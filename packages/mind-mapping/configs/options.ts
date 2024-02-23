import { MOUSE_WHEEL_ACTION } from './constants';
import openSvg from '../assets/svg/expand-open';
import closeSvg from '../assets/svg/expand-close';

export const DEFAULT_OPTIONS = {
  scaleRatio: 0.1,
  scaleCenterUseMousePosition: true,

  mousewheelAction: MOUSE_WHEEL_ACTION.MOVE,
  mousewheelMoveStep: 100,
  disableMouseWheelZoom: false,

  hoverRectColor: 'rgb(94, 200, 248)',
  hoverRectPadding: 2,

  expandButtonSize: 20,
  expandButtonStyle: {
    color: '#808080',
    fill: '#fff',
    fontSize: 12,
    strokeColor: '#333333',
  },
  expandButtonSvg: {
    openSvg,
    closeSvg,
  },
  showExpandChildrenCount: true,

  dragOpacity: {
    target: 0.3,
    clone: 0.5,
  },
};
