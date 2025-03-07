const connectDB = require('./config/database');
const express = require('express');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utilis/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Basic route for testing server
 
 
app.post('/signup', async (req, res) => {
  try {
  validateSignUpData(req);
  const {firstName, lastName,emailId ,password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error saving user:', error.message);
    res.status(400).json({ error: error.message }); // Return detailed validation error
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body; 
    const user = await User.findOne({ emailId });  
    if (!user) return res.status(400).json({ message: 'User not found' });
  
     const isPasswordValid = await user.validatePassword();
    if(isPasswordValid) {
      //create a jwt
      const token = await user.getJWT();
      res.cookie('token',token, {
        expires: new Date(Date.now() +8 * 3600000), 
        httpOnly: true, // only accessible via HTTP requests
        secure: false, // true for HTTPS
      });
       res.send('login successfully')
    }
    if (!isPasswordValid) return res.status(400).json({ message: 'Incorrect password' });
    res.json({ message: 'Logged in successfully' });
    } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Server error' });
    
}})

app.post('/profile', userAuth,async(req, res) => {
const user = req.user;
if(!user){
  throw new Error("user not exist")
}
res.send(user);    
 
})
app.get('/user', async (req, res) => {
  const userEmail = req.body.email;

  try {
    const users = await User.find({ email: userEmail });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})

app.delete('/user',async (req,res)=>{
  try {
    const user = await User.findByIdAndDelete({_id:userId});
  res.json('User deleted')
  } catch (error) {
    res.status(400).send("Something went wrong ");
  }
})

app.patch('/user',async (req,res) =>{
  try {
    const user  = await User.findByIdAndUpdate({_id:userId},data,{
      returnDocument:"after",
      runValidators:true,
    })
    res.send('user updated ')
  } catch (error) {
    res.status(400).send("Something went wrong ");
  }
})

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
 