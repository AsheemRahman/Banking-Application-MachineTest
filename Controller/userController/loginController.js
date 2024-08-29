const userSchema = require('../../model/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


//------------------------------------ Render Signup page --------------------------------

const signup = (req, res) => {
  try {
    res.render('user/signup', { title: 'Signup' })
  } catch (error) {
    console.log(`error while rendering signup page ${error} `)
  }
}


//------------------------------------ Signup post --------------------------------

const signupPost = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const details = {
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone
    }

    const check = await userSchema.findOne({ email: details.email })

    if (check) {
      res.redirect('/login')
    }else{
      await userSchema.insertMany(details)
        .then(() => {
          res.redirect('/login')
        })
        .catch(err => {
          console.log(`error while user signup ${err}`)
        })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

//------------------------------------ Login Page Render ----------------------------

const login = (req, res) => {
  try{
    res.render('user/login', { title: 'Login' })
  }catch(error){
    console.log(`error while render the login page ${error}`)
  }
}


//---------------------------------- Verify Login Details -----------------------------


const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email is not registered. Please register now.' });
    }
    if(user.isActive  == false){
      return res.status(401).json({ success: false, message: 'This user is Blocked By Admin.' });
    }

    const checkPass = await bcrypt.compare(password, user.password);

    if (checkPass) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const options = {
        httpOnly: true,
        secure: true
      };
      res.cookie('token', token, options);
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error(`Error while in login post: ${error}`);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




module.exports = { loginPost, login, signup, signupPost }
