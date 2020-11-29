require('dotenv').config()
var mongoose = require('mongoose');
const conexion = process.env.MONGO_URL;
mongoose.connect(conexion ,{useNewUrlParser: true, useUnifiedTopology: true});