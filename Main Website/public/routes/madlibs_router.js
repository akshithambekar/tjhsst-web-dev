const express = require("express");
const madlibs_router = express.Router();

madlibs_router.use(express.static('static_files'))

madlibs_router.get('/madlibs', function(req,res) {
    res.render('madlibs')
})

madlibs_router.post('/madlibresult', function(req,res) {
    if ("yesno" in req.body) {
        x = "happy"
    } else {
        x = "sad"
    }
    const params = {
        name: req.body.name,
        food: req.body.food,
        number: req.body.number,
        yesno: x,
        ing: req.body.ing
    }
    res.render('result', params)
})

module.exports = madlibs_router