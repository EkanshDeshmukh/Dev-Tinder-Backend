const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the basic Express server!');
});
 
app.post('/signup', async (req, res) => {
  const user = new User({
    firstName: "Sachin",
    lastName: "Tendulkar",
    emailId: "sachin@kohli.com",
    password: "sachin@123",
  })
  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }

})

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});

connectDB().then(() => {
  console.log('MongoDB connected...');
});