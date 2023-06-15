const express = require("express");
const number_router = express.Router();

number_router.use(express.json());

number_router.get('/numberform', function(req, res) {
    res.render('numberform');
});

number_router.get('/form_handler_01', function(req, res) {
    const num = req.query.num_input;
    res.redirect('numberresult/' + num);
});

number_router.get('/numberresult/:num', function(req, res) {
    const num = req.params.num;
    input = {
        my_number: parseInt(num),
        fahr_to_cels: (parseInt(num) - 32) * 0.5556,
        miles_to_km: parseInt(num) * 1.60934,
        moles_to_particles: parseInt(num) * 602000000000000000000000,
        hours_to_seconds: parseInt(num) * 3600
    };
    if ('format' in req.query && req.query.format == 'json') {
        res.json(input);
    } else {
        res.render('numberresult', input);
    }
});

module.exports = number_router;