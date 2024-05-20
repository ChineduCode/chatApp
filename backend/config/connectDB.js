const mongoose = require('mongoose')

const connectToDB = () => {
    return(
        mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err.message);
        })

    )
}

module.exports = connectToDB;