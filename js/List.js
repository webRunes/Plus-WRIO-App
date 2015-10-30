'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    actions = require('./actions/jsonld'),
    Item = require('./Item'),
    sortBy = require('lodash.sortby'),
    SubList = require('./SubList'),
    ActionMenu = require('./actions/menu'),
    P = require('./P');

class List extends React.Component{
    constructor(props){
        super(props);
    }

    clickOnItem() {
        ActionMenu.toggleMenu(false);
    }

    render() {
        var lis = sortBy(
            Object.keys(this.props.data).map(function (name) {
                return this.props.data[name];
            }, this),
            'order'
        ).map(function (item) {
                if (item.children) {
                    return <SubList data={item} key={item.url} />;
                }
                var del = function () {
                    actions.del(item.url);
                };
                return <Item className="panel" del={del} onClick={this.clickOnItem} data={item} listName={item.name} key={item.url} />;
            }, this);
        return (
            <ul id="nav-accordion" className="nav navbar-var">
                {lis}
                <P data={{name: 'plus'}} />
            </ul>
        );
    }
}

List.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = List;
