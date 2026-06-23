import {load} from 'js-yaml';

export default (config) => {
  config.addDataExtension('yml', (contents) => load(contents));
};
