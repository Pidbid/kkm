import { createDecorator } from '#/_base/di/instantiation';
import type { SkillActivationOrigin } from '#/agent/contextMemory/types';
import type { Turn } from '#/agent/loop/loop';
import type { ContentPart } from '#/kosong/contract/message';

export interface SkillActivationRequest {
  readonly name: string;
  readonly args?: string;
}

export interface SkillActivationInput extends SkillActivationRequest {
  readonly additionalSkills?: readonly SkillActivationRequest[];
  readonly prompt?: readonly ContentPart[];
}

export interface IAgentSkillService {
  readonly _serviceBrand: undefined;

  activate(input: SkillActivationInput): Promise<Turn>;
  recordModelToolActivation(origin: SkillActivationOrigin): void;
}

export const IAgentSkillService =
  createDecorator<IAgentSkillService>('agentSkillService');
