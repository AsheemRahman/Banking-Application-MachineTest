const express = require('express');
const user = express.Router();

const loginController = require('../Controller/userController/loginController')
const dashboardController = require('../Controller/userController/dashboardController');

const isUser = require('../middleware/userSession')


//----------------------------- signup -------------------------------

user.get('/',loginController.signup);

user.post('/signup',loginController.signupPost);


//------------------------------ login -------------------------------

user.get('/login',loginController.login);

user.post('/login',loginController.loginPost);


//------------------------- Dashboard route --------------------------

user.get('/dashboard', isUser , dashboardController.getDashboard);


//--------------------------- deposit --------------------------------

user.post('/deposit', isUser , dashboardController.deposit);


//---------------------------- withdrawal ----------------------------

user.post('/withdraw', isUser , dashboardController.withdraw);


//------------------------------- logout -------------------------------

user.get('/logout' , dashboardController.logout);



module.exports = user;