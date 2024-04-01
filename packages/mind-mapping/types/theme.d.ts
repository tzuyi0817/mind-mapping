import { SHAPE } from '../configs/shape';

export type ThemeLineStyle = 'straight';
export type ThemeKey<T> = T extends keyof ThemeNode ? keyof ThemeNode : keyof Theme['root'];

export interface Theme {
  paddingX: number;
  paddingY: number;
  imgMaxWidth: number;
  imgMaxHeight: number;
  iconSize: number;
  lineWidth: number;
  lineColor: string;
  lineDasharray: string;
  lineStyle: ThemeLineStyle;
  rootLineKeepSameInCurve: boolean;
  generalizationLineWidth: number;
  generalizationLineColor: string;
  generalizationLineMargin: number;
  generalizationNodeMargin: number;
  associativeLineWidth: number;
  associativeLineColor: string;
  associativeLineActiveWidth: number;
  associativeLineActiveColor: string;
  associativeLineTextColor: string;
  associativeLineTextFontSize: number;
  associativeLineTextLineHeight: number;
  associativeLineTextFontFamily: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundPosition: string;
  backgroundSize: string;
  nodeUseLineStyle: boolean;
  root: Omit<ThemeNode, 'marginX' | 'marginY'>;
  second: ThemeNode;
  node: ThemeNode;
  generalization: ThemeNode;
}

export interface ThemeNode {
  shape: (typeof SHAPE)[keyof typeof SHAPE];
  marginX: number;
  marginY: number;
  fillColor: string;
  fontFamily: string;
  color: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  lineHeight: number;
  borderColor: string;
  borderWidth: number;
  borderDasharray: string;
  borderRadius: number;
  textDecoration: string;
}
