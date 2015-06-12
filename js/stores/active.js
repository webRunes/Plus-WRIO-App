var Reflux = require('reflux'),
    Actions = require('../actions/active');

module.exports = Reflux.createStore({
    listenables: Actions,
    onIam: function (opts) {
        var uuid = opts.uuid,
            data = opts.data;
        console.log('Active: ' + JSON.stringify(data));
        this.trigger(uuid);
    }
});
