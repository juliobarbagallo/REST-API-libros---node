var express = require('express');
var app = express();
// Importamos la conexión a la base de datos
var db = require('./db');

// El archivo que tiene todo el armado de la Rest API
var MainController = require('./libros/MainController');
// La Rest API queda en /api/
app.use('/api', MainController);

var port = "8181";

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});