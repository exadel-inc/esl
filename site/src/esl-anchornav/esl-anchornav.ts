import {ESLAnchor, ESLAnchornav, ESLAnchornavSticked} from '@exadel/esl/modules/esl-anchornav/core';

import type {ESLAnchornavRender, ESLAnchorData} from '@exadel/esl/modules/esl-anchornav/core';

const demoRenderer: ESLAnchornavRender = (data: ESLAnchorData): Element => {
  const a = document.createElement('a');
  a.href = `#${data.id}`;
  a.className = 'esl-anchornav-item';
  a.dataset.index = `${data.index + 1}`;
  a.textContent = data.title;
  return a;
};

ESLAnchor.register();
ESLAnchornav.setRenderer(demoRenderer);
ESLAnchornav.register();
ESLAnchornavSticked.register();
