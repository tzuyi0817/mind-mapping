import { MOUSE_WHEEL_ACTION, CREATE_NODE_BEHAVIOR } from './constants';
import openSvg from '../assets/svg/expand-open';
import closeSvg from '../assets/svg/expand-close';

export const DEFAULT_OPTIONS = {
  scaleRatio: 0.1,
  scaleCenterUseMousePosition: true,

  drawBorder: 20,
  drawMoveStep: 5,

  selectAreaStyle: {
    fill: 'rgba(9,132,227,0.3)',
    strokeColor: '#0984e3',
  },

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
  expandButtonSvg: { openSvg, closeSvg },
  showExpandChildrenCount: true,

  dragOpacity: { target: 0.3, clone: 0.5 },
  dragMultiple: { width: 60, height: 30 },

  createNodeBehavior: CREATE_NODE_BEHAVIOR.DEFAULT,
  createNodeText: {
    secondary: 'secondary node',
    branch: 'branch topic',
  },

  maxHistoryCount: 500,
};
