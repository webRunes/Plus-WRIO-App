'use strict';
var React = require('react'),
    classNames = require('classnames'),
    superAgent = require('superagent');

class P extends React.Component{
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.active = this.active.bind(this);
    }
    active() {
        this.setState({
            active: !this.state.active
        });
    }
    gotoUrl(){
        superAgent.post('//storage.wrioos.com/api/get_profile').withCredentials().end(function(resp){
            window.location = '//wr.io/' + resp.id + '/Plus-WRIO-App/';
        });
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
