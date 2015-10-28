var Reflux = require('reflux'),
    tools = require('./tools'),
    menuActions = require('../actions/menu.js');

var storeMenu = Reflux.createStore({
    init: function () {
        this.listenTo(menuActions.toggleMenu, this.onToggleMenu);
        this.listenTo(menuActions.showSidebar, this.onShowSidebar);
    },
    onCallAi: function () {

    },
    onLogout: function () {

    },
    onFullScreen: function () {

    },
    onToggleMenu: function (data) {
        this.trigger(data);
    },
    onShowSidebar: function (data) {
        this.trigger(data);
    }
});


module.exports = storeMenu;