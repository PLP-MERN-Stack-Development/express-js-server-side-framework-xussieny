// connect dtabase
const mongoose = require('mongoose');
require('dotenv').config(); 
const dbURI = process.env.MONGODBATLAS_URI;
        const connectDB = async () => {
            try {
                await mongoose.connect(dbURI, { 
                    useNewUrlParser: true,
                    useUnifiedTopology: true 
                });
                console.log('MongoDB connected...');
            } catch (err) {
                console.error(err.message);
                process.exit(1); // Exit process with failure
            }       
        };
        module.exports = {connectDB};
                