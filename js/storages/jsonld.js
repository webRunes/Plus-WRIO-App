var Reflux = require('reflux'),
    request = require('superagent'),
    Actions = require('../actions/jsonld');

module.exports = Reflux.createStore({
    listenables: Actions,
    getUrl: function () {
        var host = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://wrio.s3-website-us-east-1.amazonaws.com/',
            theme = 'Default-WRIO-Theme';
        return host + theme + '/widget/defaultList.htm';
    },
    init: function () {
        this.getHttp(
            this.getUrl()
        );
    },
    data: {},
    getHttp: function (url) {
        request.get(
            url,
            function (err, result) {
                if (err) {
                    throw err;
                }
                var e = document.createElement('div'),
                    json,
                    name;
                e.innerHTML = result.text;
                json = JSON.parse(e.getElementsByTagName('script')[0].innerText);
                name = json.name;
                if (this.data[name] === undefined) {
                    this.data[name] = [];
                }
                json.itemListElement.forEach(function (o) {
                    this.data[name].push({
                        name: o.name,
                        url: o.url,
                        author: o.author
                    });
                }, this);
                this.cache[url] = obj;
                this.trigger(obj);
            }.bind(this)
        );
    },
    getInitialState: function () {
        return this.data;
    },
    onRead: function (url) {
        
        this.trigger(this.data);
    }
});
