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
            this.getUrl(),
            this.core
        );
    },
    data: {},
    pending: 0,
    onData: function (key, val) {
        if (this.data[key] === undefined) {
            this.data[key] = [];
        }
        this.data[key].push(val);
        this.pending -= 1;
        if (this.pending === 0) {
            this.trigger(
                this.output()
            );
        }
    },
    output: function () {
        var data = this.data,
            root = [].concat(data.root);
        delete data.root;
        data = Object.keys(data).map(function (key) {
            return data[key];
        });
        return data.concat(root);
    },
    getHttp: function (url, cb) {
        request.get(
            url,
            function (err, result) {
                if (err) {
                    throw err;
                }
                var e = document.createElement('div'),
                    result;
                e.innerHTML = result.text;
                result = e.getElementsByTagName('script').map(function (el) {
                    return JSON.parse(el.innerText);
                });
                cb.call(this, result);
            }.bind(this)
        );
    },
    core: function (json) {
        this.pending += json.itemListElement.length;
        json.itemListElement.forEach(function (o) {
            o = {
                name: o.name,
                url: o.url,
                author: o.author
            };
            var author = o.author,
                root = [];
            if (author) {
                this.getHttp(author, function (json) {
                    var name;
                    if (json['@type'] === 'Article') {
                        name = json.name;
                    } else {
                        console.warn('plus: author [' + author + '] do not have type Article');
                    }
                    this.onData(name, o);
                }.bind(this));
            } else {
                this.onData('root', o);
            }
        }, this);
    },
    getInitialState: function () {
        return this.output();
    },
    onRead: function (url) {
        this.trigger(this.output());
    }
});
