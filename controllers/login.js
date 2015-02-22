var jwt = require('jwt-simple')
var sql = require('../infra/database.js');
var constants = require('../constants');


module.exports.auth = function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(!username){
		res.status(400).send('Username is required')
	}
	if(!password){
		res.status(400).send('Password is required')
	}
	var query = 'select * from user where username = '+ sql.connection.escape(username) + 'and password = '+ sql.connection.escape(password)
	sql.connection.query(query , function (err, results){
		if(err){
			throw err
			res.status(400).send("Internal server error occured")
		}
		else{
			user = results[0];
			if(!user){
				res.status(400).send("Invalid Username and Password")
			}
			else{
				var claims = {
					_id : user.user_id
					,username : user.username
					,firstname : user.firstname
					,lastname  : user.lastname
					,role      : user.role
				}
				var token = jwt.encode(claims,constants.secret_key)
				res.status(200).send({'access_token':token})
			}
			
		}
	})
}


module.exports.role = function(req, res){
	var access_token = req.body.access_token;
	var claims
	if(!access_token){
		return res.status(400).send('access_token is required')
	}
	else{
		claims = jwt.decode(access_token,constants.secret_key)
		if(claims){
			res.status(200).send(claims.role)
		}
	}
}