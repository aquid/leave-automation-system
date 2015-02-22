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

// 
//------------------ leave_data is the table which stores all the leave applications.--------------------------
// CREATE TABLE `leave_data` (
//   `leave_id` int(11) NOT NULL AUTO_INCREMENT,
//   `emp_id` int(11) NOT NULL,
//   `duration` int(11) NOT NULL,
//   `start_date` date NOT NULL,
//   `end_date` date NOT NULL,
//   `status` varchar(20) NOT NULL DEFAULT 'InProcess',
//   `status_code` varchar(200) NOT NULL DEFAULT 'Not Defined',
//   PRIMARY KEY (`leave_id`),
//   KEY `fk_leave_1` (`emp_id`),
//   CONSTRAINT `fk_leave_1` FOREIGN KEY (`emp_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION

//--------------------- user is the table to store all the user deatils-----------------------------------------------
// CREATE TABLE `user` (
//   `user_id` int(11) NOT NULL AUTO_INCREMENT,
//   `firstname` varchar(45) DEFAULT NULL,
//   `lastname` varchar(45) DEFAULT NULL,
//   `role` varchar(10) DEFAULT NULL,
//   `age` int(11) DEFAULT NULL,
//   `username` varchar(45) NOT NULL,
//   `password` varchar(45) NOT NULL,
//   PRIMARY KEY (`user_id`)