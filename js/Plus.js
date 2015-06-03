var React = require('react'),
    Reflux = require('reflux'),
    storage = require('./storages/jsonld');

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
        data: React.PropTypes.array.isRequired
    },
    render: function() {
        var lis = this.props.data.map(function (item, key) {
            if (Object.prototype.toString.call(item) === '[object Array]') {
                return (
                    <li>
                        <List data={item} key={key} />
                    </li>
                );
            } else {
                return <Element data={item} key={key} />;
            }
        });
        return (
            <ul id="nav-accordion" className="nav navbar-var">
                {lis}
            </ul>
        );
    }
});

var Element = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    delete: function () {
        console.log('TODO delete');
    },
    render: function() {
        var o = this.props.data;
        return (
            <li>
                <a onClick={this.delete}><span class="glyphicon glyphicon-remove btn btn-xs" /></a>
                <a href={o.url}>{o.name}</a>
            </li>
        );
    }
});

module.exports = Plus;
