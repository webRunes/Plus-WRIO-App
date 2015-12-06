'use strict';
var domain = '';
if (process.env.DOMAIN === undefined) {
    domain = 'wrioos.com';
} else {
    domain = process.env.DOMAIN;
}
var React = require('react'),
    classNames = require('classnames');

class P extends React.Component{
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.active = this.active.bind(this);
        this.userId = this.userId.bind(this);
        this.gotoUrl = this.gotoUrl.bind(this);
    }
    active() {
        this.setState({
            active: true
        });
    }
    userId(id) {
        this.setState({
            userId: id
        });
    }
    componentDidMount () {
        window.addEventListener('message', function (e) {

            var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                var jsmsg = JSON.parse(e.data);
                this.userId(jsmsg.profile.id);
            }

        }.bind(this));
    }
    gotoUrl(){
        window.location = '//wr.io/' + this.state.userId + '/Plus-WRIO-App/';
        this.active();
    }
    render(){
        var className = classNames(
            'new panel',
            {
                active: this.state.active,
                fixed: this.props.data.fixed
            }
        );

        return (
            <div className={className}>
                <a onClick={this.gotoUrl} style={{width: '100%'}} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </div>
        );
    }
}

P.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = P;
