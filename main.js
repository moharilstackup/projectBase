//Step 1: load path and express
const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const bodyparser = require('body-parser');
const cors = require("cors");
const uuidv1 = require('uuid/v1');
const request = require('request');
const qs = require('querystring');


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

// https://api.giphy.com/v1/gifs/search?
// api_key=n5AVM9F6FifxhjstVlUE2FWbXzIslb4M &
// q=cat &
// limit=2 &
// offset=0 &
// rating=G &
// lang=en
const params = {
    api_key: 'n5AVM9F6FifxhjstVlUE2FWbXzIslb4M',
    q: 'cat',
    limit: '2',
    offset: '0',
    rating: 'G',
    lang: 'en'
}

app.get('/search', (req, resp) => {
    const count = parseInt(req.query.resultCount) || 1;
    const searchTerm = req.query.searchTerm;
    //resp.status(200);
    resp.format({
        'text/html': () => {
            // resp.render('online_uuid', { uuidText: uuid });
            console.log("Count of result: ", count);
            console.log("Count of searchTerm: ", searchTerm);
            //resp.send(`<h3><code>Search html</code></h3>`);
            request.get('https://api.giphy.com/v1/gifs/search',
                // { qs: qs.querystring(params) },
                { qs: params },
                (err, response, body) => {
                    if (err) {
                        resp.status(400);
                        resp.type('text/plain');
                        resp.send(err);
                        return;
                    }

                    //Parse the JSON string to JSON
                    const result = JSON.parse(body);
                    const data = result.data;
                    const gifArray = [];
                    for (let c of Object.keys(data))
                        console.log(" Embed url ",data[c].images.fixed_width.url);
                        //rateArray.push({ currency: c, rate: rates[c] });
                    console.log("Found data length:  ", data);
                    /*                     const rateArray = []
                                        for (let c of Object.keys(rates))
                                            rateArray.push({ currency: c, rate: rates[c] });
                    
                                        resp.status(200);
                                        resp.render('rates', {
                                            baseRate: result.base,
                                            date: result.date,
                                            rates: rateArray,
                                            layout: false
                                        }); */
                }
            )
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

