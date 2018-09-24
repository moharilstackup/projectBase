//Step 1: load path and express
require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const bodyParser = require('body-parser');
const cors = require("cors");
const uuidv1 = require('uuid/v1');
const mysql = require("mysql");
const q = require("q");



//Step 2: create an instance of the application
const app = express();

const sqlFindAllFilms = "SELECT * FROM film limit 1";
const sqlFindOneBook = "SELECT name, author, publish_year, isbn FROM books WHERE idbooks=?";

console.log("process.env.DB_PORT => ",process.env.DB_PORT);

const pool = mysql.createPool({
    host: process.env.DB_HOST, //"localhost",
    port: process.env.DB_PORT, //3306,
    user: process.env.DB_USER, //"root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, //"derby",
    connectionLimit: process.env.DB_CONLIMIT //4
    // debug: true
});

var makeQuery = (sql, pool) => {
    console.log(sql);
    // var defer = q.defer();
    return (args) => {
        var defer = q.defer();
        pool.getConnection((err, connection) => {
            if (err) {
                defer.reject(err);
                return;
            }
            connection.query(sql, args || [], (err, results) => {
                connection.release();
                if (err) {
                    defer.reject(err);
                    return;
                }
                defer.resolve(results);
            })
        });
        return defer.promise;
    }

}

var findAllFilms = makeQuery(sqlFindAllFilms, pool);
var findOneBookById = makeQuery(sqlFindOneBook, pool);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/films", (req, res) => {
    findAllFilms().then((results)=>{
        res.json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error); //.end()
    });
    // res.json({ });
});
//sample test : http://localhost:3000/books/3
app.get("/books/:bookId", (req,res) => {
    var bookId=req.params.bookId;
    console.log(bookId);
    findOneBookById([bookId]).then((results)=>{
        res.json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error); //.end()
    });
    // res.json({});
});

//sample test : http://localhost:3000/books?bookId=1
app.get("/books", (req,res) => {
    console.log("/books query !");
    var bookId=req.query.bookId;
    console.log(bookId);
    findOneBookById([bookId]).then((results)=>{
        res.json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error); //.end()
    });
    // res.json({});
});

//Step 4: start the server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
}
);


//Configure a connection pool to the database
/* const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "fred",
    password: "yabadabadoo",
    database: "derby",
    connectionLimit: 4
});
 */

//Step 2: create an instance of the application
// const app = express();

//Setup views
/* app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs'); */


//Step 3: define routes
//GET UUID
// uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
/* app.get('/uuid', (req, resp) => {
    const uuid = uuidv1();
    resp.status(200);
    resp.format({
        'text/html': () => {
            resp.render('online_uuid', { uuidText: uuid });
            // resp.send(`<h3><code>${uuid}</code></h3>`);
        },
        'application/json': () => {
            resp.json({
                uuid: uuid,
                generated_on: (new Date()).toString()
            })
        },
        'text/plain': () => {
            resp.send(uuid);
        },
        'default': () => {
            resp.status(406);
            resp.send('Not Acceptable');
        }
    });

}); */


//Serves from public
// app.use(express.static(path.join(__dirname, 'public')));

//Step 4: start the server
// const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

/* app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
}
); */
