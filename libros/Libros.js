var mongoose = require('mongoose');  
var LibrosSchema  = new mongoose.Schema({  
  title: String,
  isbn: String,
  pageCount: Number,
  IDpublisher: Number,
  country: String,
  publishedDate: Date,
  thumbnailUrl: String,
  description: String,
  authors: Array,
  categories: Array
});
mongoose.model('libros', LibrosSchema);
// Exportamos como módulo
module.exports = mongoose.model('libros');