'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    StoreLd = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    ActionMenu = require('./actions/menu'),
    StoreMenu = require('./stores/menu'),
    classNames = require('classnames'),
    List = require('./List'),
    sortBy = require('lodash.sortby'),
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

    componentDidUpdate() {
        if(document.getElementById('tabScrollPosition')){
            document.getElementById('tabScrollPosition').scrollTop = !!localStorage.getItem('tabScrollPosition') ? localStorage.getItem('tabScrollPosition') : 0;
        }
    }

    componentWillUnmount () {
        this.listenStoreLd();
        this.listenStoreMenuResize();
        localStorage.removeItem('tabScrollPosition');
    }

    static checkActive(data) {

        if(data){
            var top = Object.keys(data).filter(function(name){
                return data[name].active == true;
            }, this);

            return !(top.length == 1);

        }else{
            return false;
        }
    }

    render() {
        if (this.state === null) {
            return null;
        }
        var className = classNames({
            'navbar-collapse in unselectable': true,
            'active': this.state.active,
            'fixed': this.state.fixed
        }), height = {
            height: this.props.height
        };

        return (
            <nav className={className} unselectable="on">
                <div className="navbar-header" id="tabScrollPosition" style={height}>
                    <List data={this.state.jsonld} />
                </div>
                <P data={{ name: 'plus' }} active={Plus.checkActive(this.state.jsonld)} />
            </nav>
        );
    }
}


Plus.propTypes = {
    height: React.PropTypes.object.isRequired
};


module.exports = Plus;
