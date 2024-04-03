import { COMMANDS } from '../../configs/command';
import type Event from '../event';

type CommandExecute<T = never> = (...args: T[]) => void;

class Command {
  private commandMap = new Map<string, Set<CommandExecute>>();

  static checkCommandName(name: unknown) {
    if (typeof name !== 'string') throw new Error('The command name must be a string');
    if (COMMANDS.includes(name)) return;
    throw new Error(`The command name "${name}" is not supported`);
  }

  constructor(public event: Event) {}

  execute(name: string, ...args: never[]) {
    Command.checkCommandName(name);
    const commands = this.commandMap.get(name);

    if (!commands) return;
    commands.forEach(command => command(...args));
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
}

export default Command;
