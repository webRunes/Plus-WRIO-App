var React = require('react'),
    classNames = require('classnames'),
    superAgent = require('superagent');

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
        superAgent.post("http://storage.wrioos.com/api/get_profile").withCredentials().end(function(resp){
            window.location = 'http://wr.io/' + resp.id + '/Plus-WRIO-App/';
        });
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
