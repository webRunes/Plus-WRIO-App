var Reflux = require('reflux'),
    store = require('./jsonld'),
    Actions = require('../actions/active');

module.exports = Reflux.createStore({
    listenables: Actions,
    onUpdateJsonld: function (data) {
        this.jsonld = data;
    },
    init: function () {
        store.listen(this.onUpdateJsonld);
    },
    onIam: function (opts) {
        var uuid = opts.uuid,
            data = opts.data;
        window.location = data.url;
        this.trigger(uuid);
    },
    onKill: function () {
        console.log('TODO select new active element');
    }
});
