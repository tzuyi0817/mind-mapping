export enum PositionEnum {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  CENTER,
}

export const INIT_POSITION_MAP = {
  [PositionEnum.TOP]: 0,
  [PositionEnum.RIGHT]: 1,
  [PositionEnum.BOTTOM]: 1,
  [PositionEnum.LEFT]: 0,
  [PositionEnum.CENTER]: 0.5,
} as const;
