const dotenv = require('dotenv');
dotenv.config();
module.exports = {
   ENV_JWT_SECRET: process.env.JWT_SECRET
}