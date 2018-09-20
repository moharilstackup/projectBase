//Step 1: load path and express
const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const bodyparser = require('body-parser');
const cors = require("cors");
const uuidv1 = require('uuid/v1');


//Step 2: create an instance of the application
const app = express();

//Setup views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs');


//Step 3: define routes
//GET UUID
// uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
app.get('/uuid', (req, resp) => {
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

});


//Serves from public
app.use(express.static(path.join(__dirname, 'public')));

//Step 4: start the server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
}
);
