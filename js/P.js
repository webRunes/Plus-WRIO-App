'use strict';
var React = require('react'),
    classNames = require('classnames');

class P extends React.Component{
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.active = this.active.bind(this);
        this.gotoUrl = this.gotoUrl.bind(this);
    }
    active() {
        this.setState({
            active: !this.state.active
        });
    }
    componentDidMount () {
        window.addEventListener('message', function (e) {
            if (e.origin === 'http://login.' + domain) {
                var jsmsg = JSON.parse(e.data);
                this.setState({userId: jsmsg.profile.id});
            }
        }.bind(this));
    }
    gotoUrl(){
        window.location = '//wr.io/' + this.state.userId + '/Plus-WRIO-App/';
    }
    render(){
        var className = classNames('new panel', {active: this.state.active});
        return (
            <li className={className}>
                <a onClick={this.gotoUrl} style={{width: '100%'}} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </li>
        );
    }
}

P.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = P;
