import {ExportNs} from './esl-utils/environment/export-ns';

declare global {
  const ESL: ESLLibrary;
  export interface Window {
    ESl: ESLLibrary;
  }
}

ExportNs.declare();
