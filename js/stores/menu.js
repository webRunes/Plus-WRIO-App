var Reflux = require('reflux'),
    tools = require('./tools'),
    menuActions = require('../actions/menu.js');

var storeMenu = Reflux.createStore({
    init: function () {
        this.listenTo(menuActions.toggleMenu, this.onToggleMenu);
        this.listenTo(menuActions.showSidebar, this.onShowSidebar);
        console.log('init', this)
    },
    onCallAi: function () {

    },
    onLogout: function () {

    },
    onFullScreen: function () {

    },
    onToggleMenu: function (data) {
        console.log('Store onToggle', data)
        this.trigger(data);
    },
    onShowSidebar: function (data) {
        console.log('Store onShowSidebar', data)
        this.trigger(data);
    }
});


module.exports = storeMenu;