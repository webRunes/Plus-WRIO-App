'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    StoreLd = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    ActionMenu = require('./actions/menu'),
    StoreMenu = require('./stores/menu'),
    classNames = require('classnames'),
    List = require('./List'),
    P = require('./P');

class Plus extends React.Component{
    constructor (props) {
        super(props);
        this.onStateChange = this.onStateChange.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.state = {
            active: false,
            jsonld: {},
            fixed:  false
        };
    }

    onStateChange (jsonld) {
        this.setState({
            jsonld: jsonld
        });
    }

    onToggleMenu (data, fixed) {
        this.setState({
            active: data,
            fixed:  fixed
        });
    }

    componentDidMount() {
        this.listenStoreLd = StoreLd.listen(this.onStateChange);
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        actions.read();
    }

    componentWillUnmount () {
        this.listenStoreLd();
        this.listenStoreMenuToggle();
    }

    render() {
        if (this.state === null) {
            return null;
        }
        var className = classNames({
                'navbar-collapse in unselectable': true,
                'active': this.state.active,
                'fixed': this.state.fixed
            });

        return (
            <nav className={className} unselectable="on">
                <div className="navbar-header" id="leftMenuwrp">
                    <List data={this.state.jsonld} />
                </div>
                <P data={{ name: 'plus' }} />
            </nav>
        );
    }
}

module.exports = Plus;
