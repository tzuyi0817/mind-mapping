import type Command from '../command';

class RendererCommand {
  constructor(public command: Command) {
    this.bindEvents();
    this.registerCommand();
  }
  bindEvents() {
    this.insertNode = this.insertNode.bind(this);
  }
  registerCommand() {
    this.command.add('INSERT_NODE', this.insertNode);
  }
  insertNode() {
    console.log('insertNode');
  }
}

export default RendererCommand;
