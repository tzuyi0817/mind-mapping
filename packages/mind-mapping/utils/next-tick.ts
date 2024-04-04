interface Task {
  name: string;
  callback: () => void;
}

const taskMap = new Map<string, Task>();
const callbacks: Array<Task> = [];
let timerFun: (() => void) | null = null;
let isPending = false;

if (typeof Promise !== 'undefined') {
  timerFun = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (typeof MutationObserver !== 'undefined') {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));

  observer.observe(textNode, {
    characterData: true,
  });

  timerFun = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else {
  timerFun = () => {
    setTimeout(flushCallbacks);
  };
}

function flushCallbacks() {
  isPending = false;
  const tasks = callbacks.slice(0);

  callbacks.length = 0;
  for (let index = 0; index < tasks.length; index++) {
    const { name, callback } = tasks[index];

    callback();
    taskMap.delete(name);
  }
}

function addTask(task: Task) {
  const cacheTask = taskMap.get(task.name);

  if (cacheTask) {
    cacheTask.callback = task.callback;
    return;
  }
  callbacks.push(task);
  taskMap.set(task.name, task);
}

export function nextTick(name: string, callback: () => void, thisArg?: unknown) {
  const taskCallback = () => {
    thisArg ? callback.call(thisArg) : callback();
  };

  addTask({ name, callback: taskCallback });
  if (isPending) return;
  isPending = true;
  timerFun?.();
}
