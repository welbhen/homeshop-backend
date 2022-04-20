const localStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
require('./models/User');
const User = mongoose.model('User');

module.exports = function(passport){
	//console.log("Inside 'auth': " + JSON.stringify(passport));
	passport.use(new localStrategy({
			usernameField: "email",
			passwordField: "password"
		},
		(email, password, done) => {
			//console.log("Inside 'auth', Email: " + email)
			//console.log("Inside 'auth', Password: " + password)
			User.findOne({
				email: email
			}, (err, user) => {
				if(err) {
					console.log("Error finding User: " + err);
					return done(err);
				}
				if(!user) {
					console.log("Did not find this user!");
					return done(null, false);
				}else {
					console.log("User found!");
					bcrypt.compare(password, user.password, (error, match) => {
						if(match){
							console.log("Password is correct!");
							/*
							req.login(user, (err) => {
								if(err) {
									console.log("Error on req.login: " + err);
									return done(null, false);
								}
							})
							*/
							return done(null, user);
						}else {
							console.log("Wrong password! Error: " + error);
							return done(null, false);
						}
					})
				}
			});
		}));
		
	passport.serializeUser((user, done) => {
		console.log("Inside serializeUser, id: " + user.id);
		/*
		console.log("Inside serializeUser, user: " + user);
		console.log("Inside serializeUser, 'done': " + done);
		*/
		done(null, user.id); // this stores the user id as a 'cookie'
	});
	passport.deserializeUser((id, done) => {
		console.log("Inside DEserializeUser, id: " + id);
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}
