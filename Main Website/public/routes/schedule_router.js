const express = require("express");
const schedule_router = express.Router();
let https = require('https');
schedule_router.use(express.json())

schedule_router.get('/schedule', function(req, res) {

    let url = "https://ion.tjhsst.edu/api/schedule?format=json"

    https.get(url, function(response) {
        
        let aggregated_response_string = "";
  
        response.on('data', function(chunk) {
            aggregated_response_string += chunk;
        })
    
        response.on('end', function() {
            const response_object = JSON.parse(aggregated_response_string);
            const text = {obj: response_object}
            res.render('schedule', text);
        })
    })
});

module.exports = schedule_router