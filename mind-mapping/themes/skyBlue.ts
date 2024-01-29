import { DEFAULT } from './default';
import merge from 'deepmerge';

export const SKY_BLUE = merge(DEFAULT, {
  lineColor: 'rgb(115, 161, 191)',
  backgroundColor: 'rgb(251, 251, 251)',
  generalizationLineWidth: 1,
  generalizationLineColor: '#333',
  root: {
    fillColor: 'rgb(115, 161, 191)',
  },
  second: {
    fillColor: 'rgb(238, 243, 246)',
    color: '#333',
    borderColor: 'rgb(115, 161, 191)',
    borderWidth: 1,
    fontSize: 14,
  },
  node: {
    fontSize: 12,
    color: '#333',
  },
  generalization: {
    fillColor: '#fff',
    borderColor: '#333',
    color: '#333',
  },
});
