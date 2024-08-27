const userSchema = require('../model/userSchema')
const jwt = require('jsonwebtoken');

// -------------------- check admin is login or not  ------------------------

async function isAdmin (req,res,next){
    try {
        const adminToken = req.cookies.adminToken;
        if (adminToken) {
            const admin = jwt.verify(adminToken, process.env.JWT_SECRET);
                req.admin = admin;
                next();
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.log(`Admin session error: ${error}`);
        res.redirect('/admin/login');
    }
}

module.exports = isAdmin