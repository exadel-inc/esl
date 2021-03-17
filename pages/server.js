const settings = require('./settings.json');
const {server: {config}} = settings;
const server = require('@exadel/server-sketch/localdev');

server.start(config);
