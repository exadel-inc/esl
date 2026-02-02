// Additional watch targets & configs for ESL website
export default (config) => {
  // ! IMPORTANT: make sure watch targets are not referenced to esl-website project output itself

  // Observing the common files for the documentation
  config.addWatchTarget('../../docs/**/*.md');

  // Observe projects README files
  config.addWatchTarget('../../packages/*/README.md');

  // Observing the output of the build process for the esl library
  config.addWatchTarget('../../packages/esl/modules/.docs.done');

  // Observing the output of the build process for the uip library
  config.addWatchTarget('../../packages/ui-playground/dist/.docs.done');

  // Set a delay for the build process
  config.setWatchThrottleWaitTime(500);
};
