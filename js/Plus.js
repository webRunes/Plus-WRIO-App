var React = require('react'),
    update = require('react/addons/update'),
    Reflux = require('reflux'),
    storage = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    uuid = require('uuid'),
    activeActions = require('./actions/active'),
    activeStore = require('./stores/active');

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

var Element = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        del: React.PropTypes.func.isRequired,
        listName: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            className: ''
        };
    },
    active: function () {
        this.uuid = uuid.v1();
        activeActions.iam({
            uuid: this.uuid,
            data: this.props.data,
            listName: this.props.listName
        });
        this.unsubscribe = activeStore.listen(this.deactive);
        this.setState({
            className: 'active'
        });
    },
    deactive: function (id) {
        if (this.uuid === id) {
            return;
        }
        delete this.uuid;
        this.setState({
            className: ''
        });
        this.unsubscribe();
    },
    componentWillUnmount: function() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    },
    render: function() {
        var o = this.props.data,
            name = o.name;
        return (
            <li className={this.state.className}>
                <a onClick={this.props.del} className="pull-right">
                    <span className="glyphicon glyphicon-remove" />
                </a>
                <a onClick={this.active}>{name}</a>
            </li>
        );
    }
});

var P = React.createClass({
    link: function () {
        window.location = 'http://wrioos.com';
    },
    render: function() {
        return (
            <li className="new panel">
                <a onClick={this.link} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </li>
        );
    }
});

module.exports = Plus;
