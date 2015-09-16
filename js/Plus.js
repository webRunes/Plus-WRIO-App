'use strict';
var React = require('react'),
    store = require('./stores/jsonld'),
    actions = require('./actions/jsonld'),
    List = require('./List');

class Plus extends React.Component{
    constructor (props) {
        super(props);
        this.onStateChange = this.onStateChange.bind(this);
    }
    onStateChange (jsonld) {
        this.setState({
            jsonld: jsonld
        });
    }
    componentDidMount() {
        this.unsubscribe = store.listen(this.onStateChange);
        actions.read();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        if (this.state === null) {
            return null;
        }
        return (
            <div className="navbar-collapse in unselectable" unselectable="on">
                <div className="navbar-header" id="leftMenuwrp">
                    <List data={this.state.jsonld} />
                </div>
            </div>
        );
    }
}

module.exports = Plus;
