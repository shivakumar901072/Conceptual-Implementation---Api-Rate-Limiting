const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000
const posts = require('./initialData');

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here

let numOfApiCalls = 0;
let intialMax = null;

app.get('/api/posts', (req,res) => {

    if(numOfApiCalls >= 5) {
        res.status(429).send({message: "Exceed Number of API Calls"});
        return;
    }

    const parsedMax = Number(req.query.max || 10);
    const max = parsedMax > 20 ? 10: parsedMax;
    let finalMax = max;

    if(intialMax !== null) {
        finalMax = Math.min(finalMax,intialMax);
    }

    const topMax = posts.filter((value,idx) => idx < finalMax);
    res.send(topMax);

    if(intialMax === null) {
        intialMax = max;
        numOfApiCalls++;
        setTimeout(() => {
            intialMax = null;
            numOfApiCalls = 0;
        },30* 1000 );

    } else {
        numOfApiCalls++;
    }   
});


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
