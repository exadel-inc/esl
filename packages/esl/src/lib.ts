import {ExportNs} from './esl-utils/environment/export-ns';

declare global {
  interface ESLLibrary {}
  const ESL: ESLLibrary;
  export interface Window {
    ESl: ESLLibrary;
  }
}

ExportNs.declare('6.0.0-beta.5');
