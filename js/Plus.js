'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    store = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    ActionMenu = require('./actions/menu'),
    StoreMenu = require('./stores/menu'),
    classNames = require('classnames'),
    List = require('./List');

class Plus extends React.Component{
    constructor (props) {
        super(props);
        this.onStateChange = this.onStateChange.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.state = {
            active: false,
            jsonld: false
        };
    }

    onStateChange (jsonld) {
        this.setState({
            jsonld: jsonld
        });
    }

    onToggleMenu (data) {
        this.setState({
            active: data
        });
    }

    componentDidMount() {
        this.unsubscribe = store.listen(this.onStateChange);
        this.unsubscribe1 = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        //ActionMenu.toggleMenu(this.state.active);
        actions.read();
    }

    componentWillUnmount () {
        this.unsubscribe();
        this.unsubscribe1() ;
    }

    render() {
        if (this.state === null) {
            return null;
        }

        var className = classNames({
            'navbar-collapse in unselectable': true,
            'active': this.state.active
        });
        return (
            <nav className={className} unselectable="on">
                <div className="navbar-header" id="leftMenuwrp">
                    <List data={this.state.jsonld} />
                </div>
            </nav>
        );
    }
}

module.exports = Plus;
