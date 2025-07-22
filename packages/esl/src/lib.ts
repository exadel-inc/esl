import {ExportNs} from './esl-utils/environment/export-ns';

declare global {
  interface ESLLibrary {}
  const ESL: ESLLibrary;
  export interface Window {
    ESl: ESLLibrary;
  }
}

ExportNs.declare('5.9.1');
