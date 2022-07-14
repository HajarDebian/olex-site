const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect( process.env.DBLink).then((result) => {
        console.log(`DB connected on ${process.env.DBLink}`);
    }).catch(err => console.log('fail to connect to DB' , err));
}

module.exports = connectDB;