var express = require('express');
var router = express.Router();
var controller = require('../controllers');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Tlkn Leave System' });
});

router.post('/login',controller.login.auth); 
router.post('/role',controller.login.role); 
router.post('/get/leave',controller.leave.getLeave)
router.post('/leave',controller.leave.createLeave); 
router.post('/update/leave',controller.leave.editLeave)
module.exports = router;
