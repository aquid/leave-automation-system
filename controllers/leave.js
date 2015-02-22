var jwt = require('jwt-simple')
var sql = require('../infra/database.js');
var constants = require('../constants');
var moment = require('moment-range')

module.exports.createLeave = function(req,res){
	var access_token = req.body.access_token;
	var claims
	if(!access_token){
		return res.status(400).send('access_token is required')
	}
	else{
		claims = jwt.decode(access_token,constants.secret_key)
		if(claims){
			var start_date = req.body.start_date
			  , end_date   = req.body.end_date

			if(!start_date){
				return res.status(400).send('Start Date is required')
			}
			if(!end_date){
				return res.status(400).send('End Date is required')
			}
			start_date = new Date(start_date)
			end_date   = new Date(end_date)

			if(start_date > end_date){
				return res.status(400).send('End date sholud be greater than Start date')
			}
			var range = moment.range(start_date, end_date)
			var duration = range.diff('days')

			range.by('days' , function(moment){
				if(moment.day() == 0 || moment.day() == 6){
					duration--
				}
			})
			if(duration > 15){
				return res.status(400).send('Leave not allowed for more than 15 days')
			}
			else{
				var data ={
					emp_id: claims._id
					,duration: duration
					,start_date: start_date
					,end_date : end_date
				}
				var query = 
				sql.connection.query('INSERT INTO leave_data SET ?' , data , function (err, leave){
					if(err){
						return res.status(400).send('Error creating leave. Plaese try again')
					}
					else{
						console.log(duration)
						return res.status(200).send(leave)
					}
				})
				
			}			
		}
	}
}

module.exports.getLeave = function(req, res){
	var access_token = req.body.access_token;
	var claims
	if(!access_token){
		return res.status(400).send('access_token is required')
	}
	else{
		claims = jwt.decode(access_token,constants.secret_key)
		console.log(claims)
		if(claims){
			var user = {
				emp_id:claims._id
			}
			if(claims.role == constants.USER_ROLE.emp){
				sql.connection.query('SELECT * FROM leave_data WHERE ?', user , function (err,leaves){
					if(err){
						return res.status(400).send("Error getting leaves")
					}
					else{
						console.log(leaves)
						return res.status(200).send(leaves)
					}
				})
			}
			else if(claims.role == constants.USER_ROLE.manager){
				sql.connection.query('select ld.*, us.firstname,us.lastname from leave_data ld ,user us WHERE ld.emp_id = us.user_id' , function (err,leaves){
					if(err){
						return res.status(400).send("Error getting leaves")
					}
					else{
						console.log(leaves)
						return res.status(200).send(leaves)
					}
				})
			}
		}
	}
}

module.exports.editLeave = function(req, res){
	var access_token = req.body.access_token;
	var claims
	if(!access_token){
		return res.status(400).send('access_token is required')
	}
	else{
		claims = jwt.decode(access_token,constants.secret_key)
		console.log(claims)
		if(!claims){
			return res.status(400).send("Invalid Access Token")
		}
		else if(claims){
			if(claims.role == constants.USER_ROLE.manager){
				var leave_id = req.body.id
				var status = req.body.status
				var status_code = req.body.status_code
				var leave_status= {
					status: status
					,status_code:status_code
				}
				sql.connection.query('UPDATE leave_data SET ? WHERE leave_id = ?', [leave_status,leave_id] , function (err,result){
					if(err){
						console.log(err)
						return res.status(400).send("Error Updating leave")
					}
					else{
						return res.status(200).send(result)
					}
				})

			}
		}
	}
}