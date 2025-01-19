const mongoose = require('mongoose');

const connectDB = async (req, res, next) => {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/tinder', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
        if (next) next();  
    } catch (error) {
        console.error('MongoDB connection error:', error);
        if (next) {
            next(error); // Pass the error to the middleware chain
        } else {
            throw error; // Re-throw the error if not used as middleware
        }
    }
};

module.exports = connectDB;
