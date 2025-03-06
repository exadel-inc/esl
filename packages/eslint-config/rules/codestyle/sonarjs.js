import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    plugins: {sonarjs},
    rules: {
      // Class names should comply with a naming convention
      'sonarjs/class-name': 'warn',

      // Code is clearest when each statement has its own line.
      'sonarjs/no-same-line-conditional': 'warn',
    }
  }
];
