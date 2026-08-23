const { mongoose } = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Підключення до бази даних успішне');

    } catch (error){
        console.error('Помилка підключення до бази даних:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;