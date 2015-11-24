var express = require('express');
var app = require("./wrio_app.js")
	.init(express);
var server = require('http')
	.createServer(app)
	.listen(1234);

var passport = require('passport');
var GooglePlusStrategy = require('passport-google-oauth')
	.OAuth2Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var nconf = require("./wrio_nconf.js")
	.init();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({
	secret: 'keyboard cat',
	saveUninitialized: true,
	resave: true,
	key: 'sid'
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

//passport.use(new GooglePlusStrategy({
//		clientID: nconf.get('api:google:clientId'),
//		clientSecret: nconf.get('api:google:clientSecret'),
//		callbackURL: nconf.get('api:google:callbackUrl')
//	},
//	function (accessToken, refreshToken, profile, done) {
//		process.nextTick(function () {
//			return done(null, profile);
//		});
//	}
//));

app.get('/', function(request, response) {
	response.sendFile(__dirname +
		'/hub/index.htm');
});

app.get('/account', ensureAuthenticated, function(request, response) {
	response.render('account', {
		user: request.user
	});
});

app.get('/auth/google', passport.authenticate('google', {
	scope: ['https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}));

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	}),
	function(request, response) {
		response.redirect('/');
	});

app.get('/logout', function(request, response) {
	request.logout();
	response.redirect('/');
});

app.listen(3000);
console.log("app running on port 3000");

function ensureAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect('/login')
}
