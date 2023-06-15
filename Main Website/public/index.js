const express = require("express");
const app = express();
const url = require("url");
const mysql = require("mysql");
let https = require('https');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('static_files'));

// var sql_params = {
//     connectionLimit: 10,
//     user: process.env.DIRECTOR_DATABASE_USERNAME,
//     password: process.env.DIRECTOR_DATABASE_PASSWORD,
//     host: process.env.DIRECTOR_DATABASE_HOST,
//     port: process.env.DIRECTOR_DATABASE_PORT,
//     database: process.env.DIRECTOR_DATABASE_NAME
// };

// app.locals.pool = mysql.createPool(sql_params);

app.get('/nfl_form', (req, res) => {
    res.render('nfl_form');
});

const madlibs_router = require("./routes/madlibs_router");
app.use(madlibs_router);

// const cookies_router = require("./routes/cookies_router");
// app.use(cookies_router);

const schedule_router = require("./routes/schedule_router");
app.use(schedule_router);

const number_router = require("./routes/number_router");
app.use(number_router);

const weather_router = require("./routes/weather_router");
app.use(weather_router);

// const oauth_router = require("./routes/oauth_router");
// app.use(oauth_router);

const profile_router = require("./routes/profile_router");
app.use(profile_router);

let page_counter = 0;

app.get('/', function(req,res){
    page_counter++;
    const render_dict = {
        'count': page_counter
    };
    res.render('homepage', render_dict);
});

app.get('/labs', function(req, res) {
    res.render('labs');
});

app.get('/hello_template', function(req,res) {
    res.render('template_01');
});

app.get('/tictactoe', function(req,res) {
    res.render('tictactoe');
});

var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
};

app.locals.pool  = mysql.createPool(sql_params);


const listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});