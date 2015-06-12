var React = require('react'),
    update = require('react/addons/update'),
    Reflux = require('reflux'),
    storage = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    uuid = require('uuid'),
    activeActions = require('./actions/active'),
    activeStore = require('./stores/active'),
    classNames = require('classnames'),
    Element = require('./Element'),
    P = require('./P');

var Plus = React.createClass({
    mixins: [Reflux.connect(storage, 'jsonld')],
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
        var lis = Object.keys(this.props.data).map(function (name) {
            var item = this.props.data[name];
            if (Object.prototype.toString.call(item) === '[object Array]') {
                return <SubList data={item} listName={name} key={name} />;
            }
            var self = this,
                del = function () {self.del(name); };
            return <Element del={del} data={item} listName={name} key={name} />;
        }, this);
        return (
            <ul id="nav-accordion" className="nav navbar-var">
                {lis}
                <P />
            </ul>
        );
    }
});

var SubList = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        listName: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            style: {
                height: 'auto',
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
    del: function (index) {
        actions.del(this.props.listName, index);
    },
    render: function () {
        var o = this.props.data,
            name = this.props.listName;
        return (
            <li className="panel">
                <a onClick={this.toggle}>
                    <span className="qty pull-right">{o.length}</span>
                    <span>{name}</span>
                </a>
                <div className="in" style={this.state.style}>
                    <ul className="nav nav-pills nav-stacked sub">
                        {o.map(function (i, index) {
                            var self = this,
                                del = function () {self.del(index); };
                            return <Element del={del} onClick={this.toggle} data={i} listName={name} key={i.name} />;
                        }, this)}
                    </ul>
                </div>
            </li>
        );
    }
});

module.exports = Plus;
