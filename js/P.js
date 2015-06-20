var React = require('react'),
    uuid = require('uuid'),
    activeActions = require('./actions/active'),
    activeStore = require('./stores/active'),
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
        this.uuid = uuid.v1();
        activeActions.iam({
            uuid: this.uuid,
            data: this.props.data
        });
        this.unsubscribe = activeStore.listen(this.deactive);
        this.setState({
            active: true
        });
    },
    deactive: function (id) {
        if (this.uuid === id) {
            return;
        }
        delete this.uuid;
        this.setState({
            active: false
        });
        this.unsubscribe();
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
