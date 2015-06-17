var Reflux = require('reflux'),
    request = require('superagent'),
    Actions = require('../actions/jsonld'),
    uuid = require('uuid');

module.exports = Reflux.createStore({
    listenables: Actions,
    getUrl: function () {
        var host = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'http://wrioos.com.s3-website-us-east-1.amazonaws.com/',
            theme = 'Default-WRIO-Theme';
        return host + theme + '/widget/defaultList.htm';
    },
    init: function () {
        if (!localStorage.getItem('plus')) {
            this.getHttp(
                this.getUrl(),
                this.concatAlljsonld
            );
        }
    },
    data: {},
    pending: 0,
    onData: function (o, name) {
        if (name) {
            if (this.data[name] === undefined) {
                this.data[name] = [];
            }
            this.data[name].push(o);
        } else {
            if (o.author) {
                console.warn('plus: author [' + o.author + '] do not have type Article');
            }
            name = uuid.v1();
            this.data[name] = o;
        }
        this.pending -= 1;
        if (this.pending === 0) {
            if (localStorage.getItem('plus') !== JSON.stringify(this.data)) {
                this.update();
            }
        }
    },
    update: function () {
        localStorage.removeItem('plus');
        localStorage.setItem('plus', JSON.stringify(this.data));
        this.trigger(this.data);
    },
    getHttp: function (url, cb) {
        var self = this;
        request.get(
            url,
            function (err, result) {
                if (!err && (typeof result === 'object')) {
                    var e = document.createElement('div');
                    e.innerHTML = result.text;
                    result = Array.prototype.filter.call(e.getElementsByTagName('script'), function (el) {
                        return el.type === 'application/ld+json';
                    }).map(function (el) {
                        return JSON.parse(el.textContent);
                    });
                }
                cb.call(self, result || []);
            }
        );
    },
    concatAlljsonld: function (jsons) {
        var scripts = document.getElementsByTagName('script'),
            i;
        for (i = 0; i < scripts.length; i += 1) {
            if (scripts[i].type === 'application/ld+json') {
                jsons.unshift(JSON.parse(scripts[i].textContent));
            }
        }
        this.core(jsons);
    },
    core: function (jsons) {
        var i, json;
        for (i = 0; i < jsons.length; i += 1) {
            json = jsons[i];
            if (json.itemListElement && json['@type'] === 'ItemList') {
                this.pending += json.itemListElement.length;
                json.itemListElement.forEach(function (o) {
                    o = {
                        name: o.name,
                        url: o.url,
                        author: o.author
                    };
                    var author = o.author;
                    if (author) {
                        this.getHttp(author, function (jsons) {
                            var j, name;
                            for (j = 0; j < jsons.length; i += 1) {
                                if (jsons[j]['@type'] === 'Article') {
                                    name = jsons[i].name;
                                    j = jsons.length;
                                }
                            }
                            this.onData(o, name);
                        }.bind(this));
                    } else {
                        this.onData(o);
                    }
                }, this);
            }
        }
    },
    getInitialState: function () {
        return JSON.parse(localStorage.getItem('plus')) || this.data;
    },
    onDel: function (listName, index) {
        if ((index === undefined) || (this.data[listName].length === 1)) {
            delete this.data[listName];
        } else {
            this.data[listName].splice(index, 1);
        }
        this.update();
    },
    onRead: function () {
        this.trigger(this.data);
    }
});
