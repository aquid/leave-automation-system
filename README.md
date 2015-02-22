# leave-automation-system

This is a small project for automating leave/holiday applying system

The project is a single page application(SPA) which help's in automating leave application process.
User can login into the system,select start and end date for the leave and can check status of their application
The manager can see all employee applications with actions to accept and reject leaves with a reason for rejection

Project is done with ```node.js``` so make sure you have node.js installed in your system.
It also uses ```angular.js```for frontend part but there is no need to download it. Project uses CDN for it.
To run the project just downoload the project and get into the directory and run node server.js.
```
Step 1- cd tlkn 
Step 2- node server.js
`````
## Database Schema Design
This project uses mysql for storing data so make sure ```Mysql``` is present in your system.
You can change mysql username and password in file ``` infra/database.js``` according to your system.
```
var connection = mysql.createConnection({
		host: "127.0.0.1"
		, user : "XXXX"  // username
		, database : "tlkn_db"
		, password :"XXXX" // password
		, port: 3306
	}) 
```
	
 MySQL schema desing is commented in the above file ```(infra/database.js)```. 
 You can copy and run it once to create  the schema on your system.
 In the schema design users are assigned with roles. 
 ```
 1.employee
 2 manager
 ```
 Users with manager roles can see all application and normal users can see all there applications.
 So while inserting user's data manager should be assigned a role of manager.
 There is no register/insertion page in the project for now, it has to be done with a script.
 
## Description about the workflow:
 1. User can login with their username and password and they will be redirected to home page where they can see all  there applied leave and can apply for new leaves.
 2. Manager login's with there username and password and he can see all the leaves applied and can approve or reject employee applications with a reason.

 
	
	

