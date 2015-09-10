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
    gotoUrl: function(){
        //window.location = 'http://' + this.props.data.url;
    },
    render: function () {
        var className = classNames('new panel', {active: this.state.active});
        return (
            <li className={className}>
                <a onClick={this.gotoUrl} style={{width: '100%'}} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </li>
        );
    }
});

module.exports = P;
