const mongoose = require('mongoose');

const dbConnection = async() =>
{
    try 
    {
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        console.log('DB Online');
    }
    catch (error)
    {
        console.log(error);
        throw new Error('DB Error');
    }
}

module.exports = {
    dbConnection
};