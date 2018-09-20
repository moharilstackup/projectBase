//Step 1: load path and express
const express = require("express");
const path = require("path");
const uuidv1 = require('uuid/v1');
const uuidv5 = require('uuid/v5');
const hbs = require("express-handlebars");
const bodyparser = require('body-parser');

//Step 2: create an instance of the application
const app = express();



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


//GET
app.get('/uuids', (req, resp) => {
    const count = parseInt(req.query.uuidCount) || 1;
    const uuidList = [];
    for (let i = 0; i < count; i++)
        uuidList.push(uuidv1());

    resp.status(200);
    resp.type('text/html');
    resp.render('list_of_uuids', { uuidList: uuidList });
})

//Parse json and form-urlencode payload
//app.use(bodyparser.json());
//app.use(bodyparser.urlencoded());

//const bodyparserJson = bodyparser.json();
//POST
app.post('/uuidV5', bodyparser.json(), bodyparser.urlencoded(),
    (req, resp) => {
        console.log("before req.body :", req.body);
        /*     const mediaType=req.get('Content-Type');
            switch (mediaType) {
                case 'application/jason' : 
                    try {
                        bodyparserJson(req,resp)
                    } catch(e) {
        
                    }
                    break;
                case 'application/x-www-form-urlencoded':
                    break;
                default:
                    break;
            } */
        console.log("after req.body :", req.body);
        const ns = req.body.namespace;
        const count = parseInt(req.body.uuidCount) || 2;
        const uuidList = [];
        for (let i = 0; i < count; i++)
            uuidList.push(uuidv5(ns, uuidv5.DNS));
        resp.status(200);
        resp.render('list_of_uuids', { uuidList: uuidList });
        // resp.status(200).end();

        //req.body.namespace
        //req.body.uuidCount

        /*     const count = parseInt(req.query.uuidCount) || 1;
            const uuidList = [];
            for (let i = 0; i < count; i++)
                uuidList.push(uuidv1());
        
            resp.status(200);
            resp.type('text/html');
            resp.render('list_of_uuids',{uuidList: uuidList}); */
    })

//Serves from public
app.use(express.static(path.join(__dirname, 'public')));

//Step 4: start the server
const PORT = parseInt(process.argv[2]) ||
    parseInt(process.env.APP_PORT) ||
    3000;

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
}
);
