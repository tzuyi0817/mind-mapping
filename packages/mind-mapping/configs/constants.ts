export const MOUSE_WHEEL_ACTION = {
  ZOOM: 'zoom',
  MOVE: 'move',
};

export enum MOUSE_BUTTON_ENUM {
  LEFT,
  MIDDLE,
  RIGHT,
}

export const DIRECTION = {
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down',
  LEFT: 'left',
} as const;

export enum POSITION_ENUM {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  CENTER,
}

export const INIT_POSITION_MAP = {
  [POSITION_ENUM.TOP]: 0,
  [POSITION_ENUM.RIGHT]: 1,
  [POSITION_ENUM.BOTTOM]: 1,
  [POSITION_ENUM.LEFT]: 0,
  [POSITION_ENUM.CENTER]: 0.5,
} as const;

export const MIN_DRAG_DISTANCE = 10;
export const INSERT_PLACEHOLDER_HEIGHT = 5;

export const CREATE_NODE_BEHAVIOR = {
  DEFAULT: 'default',
} as const;
