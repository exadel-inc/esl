function getJSDocFullText(declaration) {
  const jsDoc = declaration.jsDoc && declaration.jsDoc[0];
  if (!jsDoc) return;
  return {
    text: getJSDocComment(jsDoc),
    tags: getJSDocTags(jsDoc)
  };
}

function getJSDocComment(jsDoc) {
  const comments = jsDoc.comment;
  if (!comments) return;
  return typeof comments === 'string' ?
    comments :
    comments.map((comment) => `${comment.name?.escapedText ?? ''}${comment.text ?? ''}`).join('');
}

function getJSDocTags(jsDoc) {
  return jsDoc.tags?.map((tag) => getJSDocTag(tag));
}

function getJSDocTag(tag) {
  const name = tag.tagName.escapedText;
  if (name === 'param') return;
  const comment = tag.comment;
  return {
    name,
    link: tag.name?.name.escapedText,
    text: typeof comment === 'string' ? comment : comment?.map((comment) => comment.text).join('\n')
  };
}

module.exports = {
  getJSDocFullText,
  getJSDocComment,
};
