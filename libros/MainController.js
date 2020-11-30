var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Importamos como módulo el esquema
var Libro = require('./Libros');
// var Editorial = requiere('./Editoriales');

// Todos los libros
router.get('/', (req, res) => {
    // Permitimos que desde todos los dominios accedan a nuestra Rest API
    res.header('Access-Control-Allow-Origin', '*');
    // Traemos todos los  libros
    Libro.find({}, (err, libros) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        res.status(200).send(libros);
    });
});


router.get('/:isbn', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
	Libro.findOne({ isbn: req.params.isbn}, (err, libro) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando el libro"});
        if (!libro) return res.status(404).send({"error":"404"});
        res.status(200).send(libro);
    });
});

router.get('/titulo/:titulo', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
	Libro.findOne({ title: req.params.titulo}, (err, libro) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando el libro por titulo"});
        if (!libro) return res.status(404).send("Libro no encontrado: " + req.params.titulo);
        res.status(200).send(libro);
    });
});

router.get('/autor/:autor', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    Libro.find({ authors: req.params.autor}, (err, libros) =>{
        if (err) return res.status(500).send("Problemas buscando");
        if (!libros) return res.status(404).send("Pelicula no encontrada con el autor: " + req.params.autor);
        res.status(200).send(libros);
    });
});


router.get('/editorial/:publisher', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("restapi");
        // En la coleccion libros, tenemos la key IDpublisher, que hace referencia a la editorial
        // (publiher), que usamos en localField en el lookup.
        // dentro del from es el schema que tiene editoriales.
        // y el foreign key es con quien de la coleccion editoriales, en este caso la key id, se va a vincular
        // con la de libros.
        // as, todo va a quedar en editoriales, para despues usarlo en el unwind, donde seleccionamos
        //  con 0 y 1 los campos que ueremos traer
        // para que todo quede en el array data
        dbo.collection('libros').aggregate([ 
            { $lookup:
                {
                from: 'publisher',
                localField: 'IDpublisher',
                foreignField: 'id',
                as: 'editoriales'
                }
                },
            {$unwind:'$editoriales'},
                {$project:{            
                "_id": 0,
                "title": 1,
                "isbn":1,
                "editoriales.publisher":1     
                }}
        ]).toArray(function(err, data) {
            
            if (err) return res.status(500).send({"error":"Problemas buscando las editoriales"});
            var libros = [];
            var editoriales = req.params.publisher.toLowerCase();
            for (let editorial of data){
                // console.log(editoriales);
                // console.log("bla")
                // console.log(editorial);
                if (editorial.editoriales.publisher.toLowerCase() === editoriales.replace("_"," ")){
                    libros.push(editorial)
                }   
            }
            if (libros.length>0) return res.status(200).send(libros);
            else {res.status(404).send("Editorial no encontrada: " + editoriales.replace("_"," "))};
        
            db.close();
        });
    });
});

module.exports = router;