const userSchema = require('../model/userSchema')
const jwt = require('jsonwebtoken');

// -------------------- check user is login or not  ------------------------

async function isUser (req,res,next){
    try {
        const token = req.cookies.token
        if(token){
            const decodedToken = jwt.verify(token , process.env.JWT_SECRET )
            const userId = decodedToken.id;
            const user = await userSchema.findById(userId)
            if(user && user.isActive){
                req.user = user
                next();
            }else{
                // req.flash('error','user is blocked by admin')
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(`user session error ${error}`)
    }
}

module.exports = isUser