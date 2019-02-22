const { EventEmitter } = require('events');

/**
 * eventBus for events in all app
 * @returns {EventEmitter}
 */
module.exports = new EventEmitter();
