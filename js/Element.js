var React = require('react'),
    uuid = require('uuid'),
    activeActions = require('./actions/active'),
    activeStore = require('./stores/active'),
    classNames = require('classnames');

var Element = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        del: React.PropTypes.func.isRequired,
        listName: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
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
    render: function() {
        var className = classNames({active: this.state.active}),
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
