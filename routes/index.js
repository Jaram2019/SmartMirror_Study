var router = require('express').Router();
var bus = require('../public/js/bus.js');
var shuttlecock_o = 'https://shuttle.jaram.net/semester/week/shuttlecock_o'
var shuttletime = bus.gettime(shuttlecock_o)
// var response = '';
// var shuttle = (req, res, next) => {
//     response += bus.gettime(shuttlecock_o)
//     next(response);
// }
/* GET home page. */

router.get('/',  function (req, res) {


    res.render('index',{
        bustime: shuttletime
    });
});



module.exports = router;