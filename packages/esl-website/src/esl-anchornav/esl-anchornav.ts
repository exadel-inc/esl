import {ESLAnchor, ESLAnchornav, ESLAnchornavSticked} from '@exadel/esl/modules/esl-anchornav/core';

import type {ESLAnchorData} from '@exadel/esl/modules/esl-anchornav/core';

ESLAnchornav.setRenderer((data: ESLAnchorData, index: number): Element => {
  const a = document.createElement('a');
  a.href = `#${data.id}`;
  a.className = 'esl-anchornav-item';
  a.dataset.index = `${index + 1}`;
  a.textContent = data.title;
  return a;
});
ESLAnchornav.setRenderer('tree', (data, index, nav) => {
  const item = document.createElement('li');
  item.className = 'anchornav-item';

  const link = document.createElement('a');
  link.href = `#${data.id}`;
  link.textContent = data.title;
  link.className = 'anchornav-link';
  item.appendChild(link);

  if (data.children && data.children.length > 0) {
    const sublist = document.createElement('ul');
    sublist.className = 'anchornav-sublist';
    data.children.forEach((child, i) => {
      sublist.appendChild(nav.renderItem(child, i, ESLAnchornav.getRenderer('hierarchical')));
    });
    item.appendChild(sublist);
  }

  return item;
});

ESLAnchor.register();
ESLAnchornav.register();
ESLAnchornavSticked.register();
