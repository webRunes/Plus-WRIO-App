var Reflux = require('reflux'),
    request = require('superagent'),
    Actions = require('../actions/jsonld');

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
                this.filterItemList
            );
        }
    },
    data: {},
    pending: 0,
    onData: function (params) {
        var o = params.tab,
            name = params.parent;
        if (name) {
            if (this.data[name] === undefined) {
                this.data[name] = {
                    name: name,
                    url: o.author,
                    order: o.order
                };
            }
            if (this.data[name].children === undefined) {
                this.data[name].children = {};
            }
            this.data[name].children[o.name] = o;
        } else {
            if (o.author) {
                console.warn('plus: author [' + o.author + '] do not have type Article');
            }
            this.data[o.name] = o;
        }
        this.pending -= 1;
        if (this.pending === 0) {
            if (localStorage.getItem('plus') !== JSON.stringify(this.data)) {
                this.update();
            }
        }
    },
    lastOrder: function (x) {
        var keys = Object.keys(x),
            max = (keys.length === 0) ? 0 : x[keys[0]].order,
            i;
        for (i = 1; i < keys.length; i += 1) {
            var order = x[keys[i]].order;
            if (order > max) {
                max = order;
            }
        }
        return max;
    },
    onDataActive: function (params) {
        var o = params.tab,
            name = params.parent;
        o.active = true;
        if (name) {
            if (this.data[name] === undefined) {
                this.data[name] = {
                    name: name,
                    url: o.author,
                    order: this.lastOrder(this.data) + 1
                };
            }
            this.data[name].active = true;
            if (this.data[name].children === undefined) {
                this.data[name].children = {};
            }
            var children = this.data[name].children;
            if (children[o.name]) {
                children[o.name].active = true;
            } else {
                children[o.name] = {
                    name: o.name,
                    url: o.url,
                    active: true,
                    order: this.lastOrder(children)
                };
            }
        } else {
            if (o.author) {
                console.warn('plus: author [' + o.author + '] do not have type Article');
            }
            if (this.data[o.name]) {
                this.data[o.name].active = true;
            } else {
                this.data[o.name] = {
                    name: o.name,
                    url: o.url,
                    active: true,
                    order: this.lastOrder(this.data)
                };
            }
        }
        this.update();
        this.trigger(this.data);
    },
    update: function () {
        localStorage.removeItem('plus');
        localStorage.setItem('plus', JSON.stringify(this.data));
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
    addCurrentPage: function () {
        var scripts = document.getElementsByTagName('script'),
            i,
            json,
            o;
        for (i = 0; i < scripts.length; i += 1) {
            if (scripts[i].type === 'application/ld+json') {
                json = JSON.parse(scripts[i].textContent);
                if (json['@type'] === 'Article') {
                    o = {
                        name: json.name,
                        url: window.location.href,
                        author: json.author,
                        active: true
                    };
                    break;
                }
            }
        }
        if (o) {
            this.removeLastActive(this.data);
            if (o.author) {
                this.getHttp(o.author, function (jsons) {
                    var j, name;
                    for (j = 0; j < jsons.length; j += 1) {
                        if (jsons[j]['@type'] === 'Article') {
                            name = jsons[j].name;
                            j = jsons.length;
                        }
                    }
                    this.onDataActive({
                        tab: o,
                        parent: name
                    });
                }.bind(this));
            } else {
                this.onDataActive({
                    tab: o
                });
            }
        }
    },
    removeLastActive: function (obj) {
        Object.keys(obj).forEach(function (key) {
            var o = obj[key];
            if (o.active !== undefined) {
                delete o.active;
            }
            if (o.children) {
                this.removeLastActive(o.children);
            }
        }, this);
    },
    filterItemList: function (jsons) {
        var items = [];
        jsons.forEach(function (json) {
            if ((json.itemListElement !== undefined) && (json['@type'] === 'ItemList')) {
                items = items.concat(json.itemListElement);
            }
        });
        this.pending += items.length + 1;
        this.core(items);
    },
    core: function (items) {
        items.forEach(function (o, order) {
            o = {
                name: o.name,
                url: o.url,
                author: o.author,
                order: order
            };
            var author = o.author;
            if (author) {
                this.getHttp(author, function (jsons) {
                    var j, name;
                    for (j = 0; j < jsons.length; j += 1) {
                        if (jsons[j]['@type'] === 'Article') {
                            name = jsons[j].name;
                            j = jsons.length;
                        }
                    }
                    this.onData({
                        tab: o,
                        parent: name
                    });
                }.bind(this));
            } else {
                this.onData({
                    tab: o
                });
            }
        }, this);
    },
    getInitialState: function () {
        return this.data;
    },
    onDel: function (listName, elName) {
        if (elName === undefined) {
            delete this.data[listName];
        } else {
            delete this.data[listName].children[elName];
        }
        this.update();
        this.trigger(this.data);
    },
    haveData: function () {
        return (typeof this.data === 'object') && (Object.keys(this.data).length !== 0);
    },
    onRead: function () {
        if (this.haveData && (this.pending !== 0)) {
            this.addCurrentPage();
        } else {
            this.data = JSON.parse(localStorage.getItem('plus')) || {};
            if (this.haveData) {
                this.addCurrentPage();
            } else if (this.pending !== 0) {
                var self = this,
                    i;
                i = setInterval(function () {
                    if (self.pending === 0) {
                        clearInterval(i);
                        this.addCurrentPage();
                    }
                }, 100);
            }
        }
    }
});
