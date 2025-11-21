// eslint-disable-next-line max-params
const renderDefault = (rule) => (tokens, idx, options, env, self) =>
  rule ? rule(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);

const plugin = (md) => {
  const open = renderDefault(md.renderer.rules.table_open);
  const close = renderDefault(md.renderer.rules.table_close);

  md.renderer.rules.table_open = (...args) => `<div class="table-container">${open(...args)}`;
  md.renderer.rules.table_close = (...args) => `${close(...args)}</div>`;
};

const noop = () => void 0;
noop.plugin = plugin;

export default noop;
