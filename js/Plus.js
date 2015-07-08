var React = require('react'),
    update = require('react/addons/update'),
    store = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    Element = require('./Element'),
    sortBy = require('lodash.sortby'),
    P = require('./P');

var Plus = React.createClass({
    componentDidMount: function () {
        this.unsubscribe = store.listen(this.onStateChange);
        actions.read();
    },
    componentWillUnmount: function () {
        this.unsubscribe();
    },
    onStateChange: function (jsonld) {
        this.setState({
            jsonld: jsonld
        });
    },
    render: function() {
        if (this.state === null) {
            return null;
        }
        return (
            <div className="navbar-collapse in">
                <div className="navbar-header" id="leftMenuwrp">
                    <List data={this.state.jsonld} />
                </div>
            </div>
        );
    }
});

var List = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    del: function (listName) {
        actions.del(listName);
    },
    render: function() {
        var lis = sortBy(
            Object.keys(this.props.data).map(function (name) {
                return this.props.data[name];
            }, this),
            'order'
        ).map(function (item) {
            if (item.children) {
                return <SubList data={item} key={item.name} />;
            }
            var self = this,
                del = function () {
                    self.del(item.name);
                };
            return <Element del={del} data={item} listName={item.name} key={item.name} />;
        }, this);
        return (
            <ul id="nav-accordion" className="nav navbar-var">
                {lis}
                <P data={{name: 'plus', url: 'http://wrcd'}} />
            </ul>
        );
    }
});

var SubList = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            style: {
                height: '0px',
                overflow: 'hidden'
            }
        };
    },
    toggle: function () {
        this.setState(update(this.state, {
            style: {
                height: {$set: (this.state.style.height === 'auto') ? '0px' : 'auto'}
            }
        }));
    },
    gotoUrl: function () {
        window.location = this.props.data.url;
    },
    del: function (elName) {
        actions.del(this.props.data.name, elName);
    },
    createElements: function () {
        var children = this.props.data.children;
        return sortBy(
            Object.keys(children).map(function (name) {
                return children[name];
            }),
            'order'
        ).map(function (i) {
            var self = this,
                del = function () {
                    self.del(i.name);
                };
            if (i.active) {
                this.toggle();
            }
            return <Element del={del} data={i} key={i.name} />;
        }, this);
    },
    render: function () {
        var o = this.props.data,
            name = o.name,
            rightContent = o.children ? Object.keys(o.children).length : <span onClick={this.del} className="glyphicon glyphicon-remove" />;
        return (
            <li className="panel">
                <a>
                    <span className="qty pull-right">{rightContent}</span>
                    <span onClick={this.gotoUrl}>{name}</span>
                </a>
                <div className="in" style={this.state.style}>
                    <ul className="nav nav-pills nav-stacked sub">
                        {this.createElements()}
                    </ul>
                </div>
            </li>
        );
    }
});

module.exports = Plus;
