var router = require('express').Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('test');
});

module.exports = router;