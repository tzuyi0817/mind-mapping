import { COMMANDS } from '../../configs/command';
import type MindMapping from '../mapping';
import type { MappingBase } from '../../types/mapping';

type CommandExecute<T = never> = (...args: T[]) => void;

class Command {
  private commandMap = new Map<string, Set<CommandExecute>>();
  private history: MappingBase[] = [];

  static checkCommandName(name: unknown) {
    if (typeof name !== 'string') throw new Error('The command name must be a string');
    if (COMMANDS.includes(name)) return;
    throw new Error(`The command name "${name}" is not supported`);
  }

  constructor(public mindMapping: MindMapping) {}

  execute(name: string, ...args: never[]) {
    Command.checkCommandName(name);
    const commands = this.commandMap.get(name);

    if (!commands) return;
    commands.forEach(command => command(...args));
    this.addHistory();
  }
  add<T>(name: string, command: CommandExecute<T>) {
    Command.checkCommandName(name);
    const commands = this.commandMap.get(name);

    commands ? commands.add(command) : this.commandMap.set(name, new Set([command]));
  }
  delete<T>(name: string, command: CommandExecute<T>) {
    Command.checkCommandName(name);
    const commands = this.commandMap.get(name);

    if (!commands) return;
    commands.delete(command);
  }
  clear() {
    this.commandMap.forEach(commands => commands.clear());
    this.commandMap.clear();
  }
  addHistory() {
    const last = this.history.at(-1);
    const current = this.mindMapping.renderer.cloneRenderTree();

    if (last === current) return;
  }
}

export default Command;
