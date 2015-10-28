var Reflux = require('reflux');

var menuAction = Reflux.createActions([
    'callAi',
    'logout',
    'fullScreen',
    'toggleMenu',
    'showSidebar'
]);

module.exports = menuAction;