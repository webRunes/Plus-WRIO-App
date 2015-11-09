'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    actions = require('./actions/jsonld'),
    Item = require('./Item'),
    sortBy = require('lodash.sortby'),
    SubList = require('./SubList'),
    StoreMenu = require('./stores/menu'),
    ActionMenu = require('./actions/menu');

class List extends React.Component{
    constructor(props){
        super(props);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.state = {
            fixed: false,
            resize: false
        };
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    static clickOnItem() {
        ActionMenu.toggleMenu(false);
    }

    onToggleMenu (data, fixed) {

        var fixed;

        if(window.innerHeight < this.list().length * 40 + 93 && data){
            fixed = true;
        } else {
            fixed = false;
        }

        this.setState({
            fixed:  fixed
        });
    }

    onWindowResize (width, height) {
        this.setState({
            resize: true
        });
        ActionMenu.resize(this.list().length * 40);
    }

    list() {
        return sortBy(
            Object.keys(this.props.data).map(function (name) {
                return this.props.data[name];
            }, this), 'order'
        ).map(function (item) {
            if (item.children) {
                return <SubList data={item} key={item.url} />;
            }
            var del = function (){
                actions.del(item.url);
            };
            return <Item className="panel" del={del} onClick={List.clickOnItem} data={item} listName={item.name} key={item.url} />;
        }, this);
    }

    componentDidMount() {
        this.listenStoreMenuToggle = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
        this.listenStoreMenuWindowResize = StoreMenu.listenTo(ActionMenu.windowResize, this.onWindowResize);
    }

    componentWillUnmount () {
        this.listenStoreMenuToggle() ;
        this.listenStoreMenuWindowResize() ;
    }

    render() {

        var height = {
            height: 'auto'
        };

        if(this.state.fixed == true || window.innerHeight - 93 < this.list().length * 40){
            height = {
                height: window.innerHeight - 93
            };
        }

        return (
            <ul ref="nav" id="nav-accordion" className="nav navbar-var" style={height}>
                {this.list()}
            </ul>
        );
    }
}

List.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = List;
