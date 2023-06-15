const express = require("express");
const url = require("url");
const weather_router = express.Router();
let https = require("https");

weather_router.use(express.json());
weather_router.use(express.urlencoded({extended: true}));

weather_router.get('/weatherform', function(req, res) {
    res.render('weatherform');
});

var location_pull = function(req, res, next) {
    // var url = 'https://api.weather.gov/points/38.8187,-77.1688';
    var url = `https://api.weather.gov/points/${req.query.lat},${req.query.long}`;
    var options = { 
	    headers: {
		    'User-Agent': '(my weather) (monke@gmail.com)'
	    }
    };
    https.get(url, options, function(response) {
	    var rawData = '';
	    response.on('data', function(chunk) {
		    rawData += chunk;
	    });
	    response.on('end', function() {
	        const weather_obj = JSON.parse(rawData);
	        if (weather_obj.properties === null || weather_obj.properties === undefined) {
	            res.render('weathererror');
	        } else {
	            forecasted = weather_obj.properties.forecast;
	            if (weather_obj.properties.forecast === null || weather_obj.properties.forecast === undefined) {
	                res.render('weathererror');
	            }
	            else {
	                res.locals.forecast = forecasted;
	            }
	        }
	        // console.log(res.locals.forecast);
	        next();
        });
    }).on('error', function(e) {
	console.error(e);
    });
};

var weather_pull = function(req, res, next) {
    // var url = 'https://api.weather.gov/gridpoints/BUF/36,49/forecast'; // TODO: code for tomorrow's forecast
    var url = res.locals.forecast;
    // console.log(url)
    var options = { 
	    headers : {
		    'User-Agent': '(weather app) (me@bob.com)'
	    }
    };
    https.get(url, options, function(response) {
	    var rawData = '';
	    response.on('data', function(chunk) {
		    rawData += chunk;
	    });
	    response.on('end', function() {
            const forecast_obj = JSON.parse(rawData);
            res.locals.temp = forecast_obj.properties.periods[0].temperature;
            res.locals.unit = forecast_obj.properties.periods[0].temperatureUnit;
            res.locals.precipitation = forecast_obj.properties.periods[0].probabilityOfPrecipitation.value;
            res.locals.dew = forecast_obj.properties.periods[0].dewpoint.value;
            res.locals.windspeed = forecast_obj.properties.periods[0].windSpeed;
            res.locals.winddir = forecast_obj.properties.periods[0].windDirection;
            res.locals.short = forecast_obj.properties.periods[0].shortForecast;
            res.locals.tempt = forecast_obj.properties.periods[1].temperature;
            res.locals.unitt = forecast_obj.properties.periods[1].temperatureUnit;
            res.locals.precipitationt = forecast_obj.properties.periods[1].probabilityOfPrecipitation.value;
            res.locals.dewt = forecast_obj.properties.periods[1].dewpoint.value;
            res.locals.windspeedt = forecast_obj.properties.periods[1].windSpeed;
            res.locals.winddirt = forecast_obj.properties.periods[1].windDirection;
            res.locals.shortt = forecast_obj.properties.periods[1].shortForecast;
            next();
        });
    }).on('error', function(e) {
	console.error(e);
    });
};

var weather_results = function(req, res) {
    forecast_info = {
        temp: res.locals.temp,
        unit: res.locals.unit,
        precipitation: res.locals.precipitation,
        dew: res.locals.dew,
        windspeed: res.locals.windspeed,
        winddir: res.locals.winddir,
        short: res.locals.short,
        tempt: res.locals.tempt,
        unitt: res.locals.unitt,
        precipitationt: res.locals.precipitationt,
        dewt: res.locals.dewt,
        windspeedt: res.locals.windspeedt,
        winddirt: res.locals.winddirt,
        shortt: res.locals.shortt
    };
    res.render('forecast_result', forecast_info);
};

weather_router.get('/weatherresult', [location_pull, weather_pull, weather_results]);

module.exports = weather_router;