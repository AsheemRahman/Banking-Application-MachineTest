const jwt = require('jsonwebtoken')

const userSchema = require('../../model/userSchema')
const transactionSchema = require('../../model/transactionSchema');


//--------------------------- admin routes ------------------------------

const admin = (req,res)=>{
    try {
        res.redirect('/admin/login')
    } catch (error) {
        console.log(`error from admin ${error}`)
    }
}


//------------------------- login get request --------------------------

const login = (req,res)=>{
    try {
        if(req.admin){
            res.redirect('/admin/home')
        }else{
            res.render('admin/login',{title: "Login"})
        }
        
    } catch (error) {
        console.log(`error from admin login ${error}`)
    }
}


//--------------------- admin login post request ----------------------

const loginPost = (req,res)=>{
    try {
        if(req.body.email === process.env.ADMIN_USERNAME && req.body.password === process.env.ADMIN_PASSWORD ){
            const adminToken = jwt.sign({ email : req.body.email }, process.env.JWT_SECRET);
            const options = {
                httpOnly: true,
                secure: true
            };
            res.cookie('adminToken', adminToken , options);
            return res.redirect('/admin/dashboard')
        }else{
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
    } catch (error) {
        console.log(`error from login post ${error}`)
        return res.status(500).json({ message: 'Internal server error' });
    }
}


//------------------------ dashboard Render -------------------------

const dashboard = async(req,res)=>{
    try{
        if(req.admin){
            const search = req.query.search || ''
            const user = await userSchema.find({name: {$regex: search, $options: 'i'}}).sort({ createdAt: -1 })
            res.render('admin/home',{ title :"Dashboard", user })
        }else{
            res.redirect('/admin/login')
        }
    }catch(error){
        console.log(`error while render dashboard ${error}`)
    }
}


//------------------------ User Status ---------------------------

const status = async (req,res)=> {
    try {
        const {id,status} = req.query;
        const newStatus = !(status === 'true')

        await userSchema.findByIdAndUpdate(id,{isActive: newStatus})
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(`error while changing status of user ${error}`)
    }
}

const transaction = async(req,res) =>{
    try{
        const user = req.params.id
        console.log(user)
        const transactions = await transactionSchema.find({ userId : user }).sort({ createdAt: -1 });
        res.render('admin/transaction',{title: "Transaction Details" ,transactions })
    }catch(error){
        console.log(`error while render transaction page ${error}`)
    }
}


//------------------------ Logout ---------------------------

const logout = (req, res) => {
    try {
        res.clearCookie('adminToken');
        res.redirect('/admin/login');
    } catch (error) {
        console.log(`error while logout user ${error}`);
    }
}



module.exports ={ admin , login , loginPost , dashboard , status , transaction ,logout }