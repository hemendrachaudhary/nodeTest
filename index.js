var express = require('express');
var cors = require('./config/cors');
var path = require('path');
var indexRouter = require('./routes/index');
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign


// Set up the express app
const app = express();

app.use(cors.permission);
app.use(express.urlencoded({limit: '150mb',extended: true})); 
app.use(express.json({ limit: '150mb' })); 
//app.use(express.json({ limit: '150mb' }));
//app.use(express.urlencoded({ limit: '150mb' }))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    //next(createError(404));
    res.end("404 not found");
});



const PORT = 3000;


app.listen(PORT, () => {
    console.log(`server running on Host:- ${process.env.DB_HOST} & Port  ${PORT}`)
});
 
