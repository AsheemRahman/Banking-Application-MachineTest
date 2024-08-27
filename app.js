const express = require("express")
const path = require("path")
const nocache = require('nocache')
const expressLayouts=require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const app = express()

const connectDB = require("./config/connection")

app.use(cookieParser())

//----------------------- Requiring Routes -------------------------

const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')

//----------------------- port setting -------------------------

const port = process.env.PORT || 3000


//--------------------- mongodb connection ---------------------

connectDB();

//--------------------- Setting view engine --------------------

app.set('view engine','ejs')

//-----------------------public static files -------------------

app.set('views', path.join(__dirname, 'views'));
app.use('/public',express.static(path.join(__dirname,'public')))

//------------------------- url encoded data -------------------

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(nocache())


//---------------------------- layouts --------------------------

app.use(expressLayouts);
app.set('layout','./layouts/layout')

//---------------------------- routes --------------------------

app.use('/',userRoutes)
app.use('/admin',adminRoutes)


//------------------------ first route -------------------------

app.get("/",(req,res)=>{
    try {
        res.redirect('/user')
    } catch (error) {
        console.log(`error from main route ${error}`)
    }
    
})


//---------------------- 404 page render ------------------------

app.use("*",(req,res)=>{
    res.render('pageNotFound',{title:"Page not found"})
})


//----------------------- Server listening -----------------------

app.listen(port,(err)=>{
    if(err){
        console.log("Error while listening port")
    }else{
        console.log(`Server listening to  http://localhost:${port}`)
    }
})