const express = require('express');
const admin = express.Router();

const adminController = require('../Controller/adminController/adminController');

const isAdmin = require('../middleware/adminSession')


//-----------------------------  login  ----------------------------

admin.get('/', adminController.admin);

admin.get('/login', adminController.login);

admin.post('/login', adminController.loginPost);


//-----------------------------  Dashboard  ----------------------------

admin.get('/dashboard', isAdmin , adminController.dashboard)

//-------------------  user Block and unblock  ---------------------------

admin.get('/userstatus', isAdmin, adminController.status);


admin.get('/logout' , adminController.logout)

module.exports = admin