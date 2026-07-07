const noop = () => void 0;
noop.plugin = function markdownItIgnoreFrontMatter(md) {
  md.core.ruler.before(
    'normalize',
    'ignore_frontmatter',
    (state) => {
      state.src = state.src.replace(
        /^---\r?\n[\s\S]*?\r?\n---\r?\n?/,
        ''
      );
      return true;
    }
  );
};

export default noop;
