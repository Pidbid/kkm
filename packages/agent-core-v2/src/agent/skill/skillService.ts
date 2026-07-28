/**
 * `skill` domain (L3) — `IAgentSkillService` implementation.
 *
 * Resolves skills from the session catalog, renders the activation prompt,
 * records the activation as a `skill.activate` fact through `wire.dispatch`
 * (a stateless, identity-apply Op), derives the `skill.activated` event
 * through the Op's `toEvent`, drives user-slash activations into a new turn via
 * `prompt`, and reports `skill_invoked` / `flow_invoked` through `telemetry`.
 * `wire.replay` reapplies the fact as a no-op, so neither the event nor
 * telemetry fires on resume (matching the former `restoring` guard). Bound at
 * Agent scope.
 */

import { randomUUID } from 'node:crypto';
import { LifecycleScope, ScopeActivation, registerScopedService } from '#/_base/di/scope';

import type { ContentPart } from '#/kosong/contract/message';

import type { ContextMessage, SkillActivationOrigin } from '#/agent/contextMemory/types';
import { renderUserSlashSkillPrompt } from './prompt';
import { ISessionContext } from '#/session/sessionContext/sessionContext';
import { Disposable } from '#/_base/di/lifecycle';
import { ErrorCodes, Error2 } from '#/errors';
import { isUserActivatableSkillType, type SkillDefinition } from '#/app/skillCatalog/types';
import { IAgentPromptService } from '#/agent/prompt/prompt';
import { ITelemetryService } from '#/app/telemetry/telemetry';
import type { Turn } from '#/agent/loop/loop';
import { IWireService } from '#/wire/wire';
import {
  IAgentSkillService,
  type SkillActivationInput,
  type SkillActivationRequest,
} from './skill';
import { skillActivate } from './skillOps';
import { ISessionSkillCatalog } from '#/session/sessionSkillCatalog/skillCatalog';

export class AgentSkillService extends Disposable implements IAgentSkillService {
  declare readonly _serviceBrand: undefined;

  constructor(
    @ISessionSkillCatalog private readonly skillCatalog: ISessionSkillCatalog,
    @IAgentPromptService private readonly prompt: IAgentPromptService,
    @IWireService private readonly wire: IWireService,
    @ITelemetryService private readonly telemetry: ITelemetryService,
    @ISessionContext private readonly sessionContext: ISessionContext,
  ) {
    super();
  }

  async activate(input: SkillActivationInput): Promise<Turn> {
    await this.skillCatalog.ready;
    const requests: readonly SkillActivationRequest[] = [
      { name: input.name, args: input.args },
      ...(input.additionalSkills ?? []),
    ];
    const activations = requests.map((request) => this.prepareActivation(request));

    if (input.prompt !== undefined || requests.length > 1) {
      for (const activation of activations) {
        this.recordActivation(activation.origin);
      }
      const message: ContextMessage = {
        role: 'user',
        content: [
          ...activations.flatMap((activation) => activation.content),
          ...(input.prompt ?? []),
        ],
        toolCalls: [],
        origin: { kind: 'user' },
      };
      return this.launch(message, 'Cannot activate skills while another turn is active');
    }

    const activation = activations[0]!;
    this.recordActivation(activation.origin);
    const message: ContextMessage = {
      role: 'user',
      content: [...activation.content],
      toolCalls: [],
      origin: activation.origin,
    };
    return this.launch(message, 'Cannot activate skill while another turn is active');
  }

  private prepareActivation(input: SkillActivationRequest): {
    readonly origin: SkillActivationOrigin;
    readonly content: readonly ContentPart[];
  } {
    const skill = this.skillCatalog.catalog.getSkill(input.name);
    if (skill === undefined) {
      throw new Error2(ErrorCodes.SKILL_NOT_FOUND, `Skill "${input.name}" was not found`);
    }
    if (!isUserActivatableSkillType(skill.metadata.type)) {
      throw new Error2(
        ErrorCodes.SKILL_TYPE_UNSUPPORTED,
        `Skill "${skill.name}" cannot be activated by the user`,
      );
    }

    const skillArgs = input.args ?? '';
    const skillContent = this.renderSkillPrompt(skill, skillArgs);
    const content: ContentPart[] = [
      {
        type: 'text',
        text: renderUserSlashSkillPrompt({
          skillName: skill.name,
          skillArgs,
          skillContent,
          skillSource: skill.source,
          skillDir: skill.dir,
        }),
      },
    ];

    return {
      origin: {
        kind: 'skill_activation',
        activationId: randomUUID(),
        skillName: skill.name,
        trigger: 'user-slash',
        skillType: skill.metadata.type,
        skillPath: skill.path,
        skillSource: skill.source,
        skillArgs: input.args,
      },
      content,
    };
  }

  recordModelToolActivation(origin: SkillActivationOrigin): void {
    this.recordActivation(origin);
  }

  private recordActivation(origin: SkillActivationOrigin): void {
    this.wire.dispatch(skillActivate({ origin }));
    this.publishActivation(origin);
  }

  private async launch(message: ContextMessage, busyMessage: string): Promise<Turn> {
    const turn = await (await this.prompt.enqueue({ message })).launched;
    if (turn === undefined) {
      throw new Error2(ErrorCodes.TURN_AGENT_BUSY, busyMessage);
    }
    return turn;
  }

  private renderSkillPrompt(skill: SkillDefinition, rawArgs: string): string {
    return this.skillCatalog.catalog.renderSkillPrompt(skill, rawArgs, {
      sessionId: this.sessionContext.sessionId,
    });
  }

  private publishActivation(origin: SkillActivationOrigin): void {
    this.telemetry.track2('skill_invoked', {
      skill_name: origin.skillName,
      trigger: origin.trigger,
    });
    if (origin.skillType === 'flow') {
      this.telemetry.track2('flow_invoked', {
        flow_name: origin.skillName,
      });
    }
  }
}

registerScopedService(
  LifecycleScope.Agent,
  IAgentSkillService,
  AgentSkillService,
  ScopeActivation.OnScopeCreated,
  'skill',
);
