var domready = require('domready'),
    React = require('react'),
    Plus = require('../index');

domready(function () {
    React.render(<Plus />, document.body);
});
