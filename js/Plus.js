var React = require('react'),
    Reflux = require('reflux'),
    storage = require('./storages/jsonld');

var Plus = React.createClass({
    mixins: [Reflux.connect(storage, 'jsonld')],
    render: function() {
        return (
            <div className="navbar-collapse in">
                <div className="navbar-header" id="leftMenuwrp">
                    <List data={this.state.jsonld} />
                </div>
            </div>
        );
    }
});

var List = React.createClass({
    render: function() {
    	var lis = this.props.data.map(function (element) {
    		return <Element data={element} />;
    	});
        return (
            <ul id="nav-accordion" className="nav navbar-var">
            	{lis}
            </ul>
        );
    }
});

var Element = React.createClass({
    		              "@type": "Article",
              "inLanguage": "en-US",
              "author": "http://webrunes.github.io/webRunes-WRIO-Hub/Alexey-Anshakov.html",
              "name": "webRunes",
              "about": "Официальная страница webRunes и ноды webrunes.com. Здесь вы можете не только следить за новостями проекта, но и даже купить share компании.",
              "image": "http://domain1.com/image1.jpg",
              "url": "http://webrunes.com"
    delete: function () {

    },
    render: function() {
    	var element = this.props.element;
        return (
            if (this.props.author)	<a onClick={this.delete}><span class="glyphicon glyphicon-remove btn btn-xs" /></a>
            <li>
                <a href={this.props.url}>{this.props.name}</a>
            </li>
        );
    }
});

module.exports = Plus;
