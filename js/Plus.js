var React = require('react'),
    Reflux = require('reflux'),
    storage = require('./storages/jsonld'),
    actions = require('./actions/jsonld');

var Plus = React.createClass({
    mixins: [Reflux.connect(storage, 'jsonld')],
    render: function() {
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
        var lis = Object.keys(this.props.data).map(function (name, key) {
            var item = this.props.data[name]; 
            if (Object.prototype.toString.call(item) === '[object Array]') {
                return (
                    <li>
                        <SubList data={item} name={name} key={key} />
                    </li>
                );
            } else {
                return <Element data={item} listName={name} key={key} />;
            }
        }, this);
        return (
            <ul id="nav-accordion" className="nav navbar-var">
                {lis}
            </ul>
        );
    }
});

var SubList = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        name: React.PropTypes.string.isRequired
    },
    render: function() {
        var lis = this.props.data.map(function (item, key) {
            return <Element data={item} listName={this.props.name} key={key} />;
        }, this);
        return (
            <li className="panel">
                <a href="#element2" className="" data-parent="#nav-accordion" data-toggle="collapse"><span className="qty btn btn-xs pull-right">{lis.length}</span>{this.props.name}</a>
                <div className="in" style="height: auto;">
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
    render: function() {
        var o = this.props.data;
        return (
            <li>
                <a onClick={this.delete} className="pull-right">
                    <span className="glyphicon glyphicon-remove" />
                </a>
                <a href={o.url}>{o.name}</a>
            </li>
        );
    }
});

module.exports = Plus;
