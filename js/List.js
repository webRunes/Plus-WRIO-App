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
            fixed: false
        };
    }

    static clickOnItem() {
        ActionMenu.toggleMenu(false);
    }

    onToggleMenu (data, fixed) {

        var fixed;

        if(window.innerHeight < this.list().length * 41 + 93 && data){
            fixed = true;
        } else {
            fixed = false;
        }

        this.setState({
            fixed:  fixed
        });
    }

    list() {
        var lis;
        return lis = sortBy(
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
        this.unsubscribe = StoreMenu.listenTo(ActionMenu.toggleMenu, this.onToggleMenu);
    }

    componentWillUnmount () {
        this.unsubscribe() ;
    }

    render() {

        ActionMenu.resize(this.list().length * 40);

        var height = {
            height: 'auto'
        };

        if(this.state.fixed == true){
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
