var Reflux = require('reflux'),
    tools = require('./tools'),
    menuActions = require('../actions/menu.js');

var storeMenu = Reflux.createStore({
    init: function () {
        this.listenTo(menuActions.toggleMenu, this.onToggleMenu);
        this.listenTo(menuActions.showSidebar, this.onShowSidebar);
        this.listenTo(menuActions.resize, this.onResize);
    },
    onCallAi: function () {

    },
    onLogout: function () {

    },
    onFullScreen: function () {

    },
    onToggleMenu: function (data, fixed) {
        if(fixed == null || fixed == undefined || fixed == false){
            var fixed = fixed;
            fixed = false;
            this.trigger(data, fixed);
        }else{
            this.trigger(data, fixed);
        }
    },
    onShowSidebar: function (data) {
        this.trigger(data);
    },
    onResize: function(height){
        this.trigger(height);
    }
});


module.exports = storeMenu;