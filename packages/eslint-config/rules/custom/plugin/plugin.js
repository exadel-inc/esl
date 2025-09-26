import deprecatedAlias from './rules/deprecated-alias.js';
import deprecatedPaths from './rules/deprecated-paths.js';
import deprecatedStaticMember from './rules/deprecated-static-member.js';

export const rules = {
  'deprecated-alias': deprecatedAlias,
  'deprecated-paths': deprecatedPaths,
  'deprecated-static': deprecatedStaticMember
};
export default {rules};
