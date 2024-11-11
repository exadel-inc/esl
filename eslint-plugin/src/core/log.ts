import color from 'kleur';
import type {Rule} from 'eslint';

const LOGGERS = {
  error: console.error,
  warn: console.warn,
  off: console.info,
};
const HEADERS = {
  error: color.red('[ESL Lint Plugin] ❌ Error:'),
  warn: color.yellow('[ESL Lint Plugin] ⚠️ Warning:'),
  off: color.blue('[ESL Lint Plugin] ℹ️ Info:'),
};

export function log(msg: string, severity: 'error' | 'warn' | 'off' = 'off'): void {
  LOGGERS[severity](`\n${HEADERS[severity]}\n${msg}`);
}

export function buildLoggingRule(msg: string, severity: 'error' | 'warn' | 'off' = 'off'): Rule.RuleModule {
  log(msg, severity);
  return {
    meta: {
      docs: {
        description: msg,
      }
    },
    create: (): Rule.RuleListener => ({})
  };
}
