//Step 1: load path and express
const hbs = require('express-handlebars');
const express = require("express");
const path = require("path");

//Step 2: create an instance of the application
const app = express();

//configure express to use handlebars as the rendering engine
app.engine('hbs', hbs());
app.set('view engine', 'hbs');
app.set('views',path.join(__dirname,'my-views'));

//Step 3: define routes
app.get('/time', (req,resp) =>{
    console.info(`Accept: ${req.get('Accept')}`);
    resp.status(200);
    resp.format({
        'text/html': () => {
            resp.render('time', { 
                time: (new Date()).toString(), 
                layout:false
            })
            
            // resp.send(`<H1>${new Date()}</H1>`)
        },
        'application/json' : () => {
            resp.send(`${new Date()}`)
        },
        'text/plain' : () => {
            resp.json({time: new Date()});
        },
        'default' : () => {
            resp.status(406);
            resp.send('Not Acceptable')
        }
    });
});
//Serves from public
// let strObj = JSON


//Step 4: start the server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
}
);
