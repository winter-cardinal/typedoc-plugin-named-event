var plugin = require('./plugin');
module.exports = function( PluginHost ) {
	PluginHost.owner.converter.addComponent('named-event-plugin', plugin.NamedEventPlugin);
};
