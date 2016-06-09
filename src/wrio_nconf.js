var nconf = require('nconf');
var path = require('path');
var fs = require('fs');

nconf.env().argv();

nconf.file(path.resolve(__dirname, '../config.json'));

module.exports = nconf;