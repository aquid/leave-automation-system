var mysql = require('mysql')

module.exports.init = function(callback){
	var connection = mysql.createConnection({
		host: "127.0.0.1"
		, user : "root"
		, database : "tlkn_db"
		, password :"aquid123"
		, port: 3306
	}) 
	connection.connect({debug: true}, function (err, db){
		if(err){
			callback(err)
		}
		else{
			module.exports.connection = connection
			module.exports.db = db
			return callback(null,db)
		}

	});
}