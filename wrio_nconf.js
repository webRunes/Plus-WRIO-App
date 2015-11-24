var nconf = require('nconf');
var path = require('path');
var fs = require('fs');

nconf.env()
	.argv();
nconf.file({
	file: './config.json'
});

module.exports = nconf;