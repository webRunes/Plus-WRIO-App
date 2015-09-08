var React = require('react'),
    classNames = require('classnames');

var Element = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        del: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            active: this.props.data ? this.props.data.active : false
        };
    },
    active: function () {
        window.location = 'http://' + this.props.data.url;
    },
    render: function() {
        var className = classNames({
                active: this.state.active,
                panel: true
            }),
            o = this.props.data,
            name = o.name;
        return (
            <li className={className}>
                <a onClick={this.props.del} className="pull-right">
                    <span className="glyphicon glyphicon-remove" />
                </a>
                <a onClick={this.active}>{name}</a>
            </li>
        );
    }
});

module.exports = Element;
