import type { Session, SkillSummary } from '@moonshot-ai/kimi-code-sdk';

import type { KimiSlashCommand } from './types';

export type SkillListSession = Pick<Session, 'listSkills'>;

export interface SkillSlashCommands {
  readonly commands: readonly KimiSlashCommand[];
  readonly inlineCommands: readonly KimiSlashCommand[];
  readonly commandMap: ReadonlyMap<string, string>;
}

export function isUserActivatableSkill(skill: SkillSummary): boolean {
  return (
    skill.type === undefined ||
    skill.type === 'prompt' ||
    skill.type === 'inline' ||
    skill.type === 'flow'
  );
}

function compareSkillSlashCommands(a: SkillSummary, b: SkillSummary): number {
  return (
    getSkillSlashCommandGroup(a.source) - getSkillSlashCommandGroup(b.source) ||
    a.name.localeCompare(b.name)
  );
}

function getSkillSlashCommandGroup(source: SkillSummary['source']): number {
  return source === 'builtin' ? 0 : 1;
}

export function buildSkillSlashCommands(skills: readonly SkillSummary[]): SkillSlashCommands {
  const commandMap = new Map<string, string>();
  const sortedSkills = [...skills].toSorted(compareSkillSlashCommands);
  const activatableSkills = sortedSkills.filter(isUserActivatableSkill);
  const commands = activatableSkills.map((skill) => {
    const commandName =
      skill.source === 'builtin' || skill.isSubSkill === true
        ? skill.name
        : `skill:${skill.name}`;
    commandMap.set(commandName, skill.name);
    commandMap.set(`skill:${skill.name}`, skill.name);
    return {
      name: commandName,
      aliases: [],
      description: skill.description ?? '',
    };
  });
  const inlineCommands = activatableSkills.map((skill) => ({
    name: `skill:${skill.name}`,
    aliases: [],
    description: skill.description ?? '',
  }));
  return { commands, inlineCommands, commandMap };
}

export function findInlineSkillNames(
  input: string,
  skillCommandMap: ReadonlyMap<string, string>,
): readonly string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  const matches = input.matchAll(
    /(?:^|[\t\n\r ])\/(skill:[A-Za-z0-9][A-Za-z0-9._-]*)(?=$|[\t\n\r ,.?!;()[\]{}])/g,
  );
  for (const match of matches) {
    let commandName = match[1]!;
    let skillName = skillCommandMap.get(commandName);
    while (skillName === undefined && commandName.endsWith('.')) {
      commandName = commandName.slice(0, -1);
      skillName = skillCommandMap.get(commandName);
    }
    if (skillName === undefined || seen.has(skillName)) continue;
    seen.add(skillName);
    names.push(skillName);
  }
  return names;
}
