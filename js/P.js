var React = require('react'),
    classNames = require('classnames');

var P = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            active: false
        };
    },
    active: function () {
        this.setState({
            active: !this.state.active
        });
    },
    render: function () {
        var className = classNames('new panel', {active: this.state.active});
        return (
            <li className={className}>
                <a onClick={this.active} style={{width: '100%'}} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </li>
        );
    }
});

module.exports = P;
