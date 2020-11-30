var mongoose = require('mongoose');  
var EditorialesSchema  = new mongoose.Schema({  
  id: Number,
  publisher: String
});
mongoose.model('publisher', EditorialesSchema);
// Exportamos como módulo
module.exports = mongoose.model('publisher');