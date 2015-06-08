var React = require('react/addons'),
    Reflux = require('reflux'),
    storage = require('./storages/jsonld'),
    actions = require('./actions/jsonld');

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
    render: function() {
        var lis = Object.keys(this.props.data).map(function (name) {
            var item = this[name];
            if (Object.prototype.toString.call(item) === '[object Array]') {
                return <SubList data={item} listName={name} key={name} />;
            } else {
                return <Element data={item} listName={name} key={name} />;
            }
        }, this.props.data);
        return (
            <ul id="nav-accordion" className="nav navbar-var">
                {lis}
                <P />
            </ul>
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
                <a onClick={this.link}>
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </li>
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
        this.setState(React.addons.update(this.state, {
            style: {
                height: {$set: (this.state.style.height === 'auto') ? '0px' : 'auto'}
            }
        }));
    },
    render: function() {
        var lis = this.props.data.map(function (item, key) {
            return <Element data={item} listName={this.props.listName} key={key} />;
        }, this);
        return (
            <li className="panel">
                <a onClick={this.toggle}>
                    <span className="qty pull-right">{lis.length}</span>
                    <span>{this.props.listName}</span>
                </a>
                <div className="in" style={this.state.style}>
                    <ul className="nav nav-pills nav-stacked sub">
                        {lis}
                    </ul>
                </div>
            </li>
        );
    }
});

var Element = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        listName: React.PropTypes.string.isRequired
    },
    delete: function () {
        actions.delete(this.props.listName, this.props.data);
    },
    link: function () {
        window.location = this.props.data.url;
    },
    render: function() {
        var o = this.props.data;
        return (
            <li onClick={this.link}>
                <a onClick={this.delete} className="pull-right">
                    <span className="glyphicon glyphicon-remove" />
                </a>
                <a onClick={this.link}>{o.name}</a>
            </li>
        );
    }
});

module.exports = Plus;
