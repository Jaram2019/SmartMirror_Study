var router = require('express').Router();
let request = require('request');

/* GET home page. */
var url = 'https://bablabs.com/openapi/v1/campus/BVRPhfbjvn';
var headers = {
    'accesstoken': ''
};
router.get('/', function (req, res) {
    request.get({url: url, headers: headers}, function(err, res, body){
        var result = JSON.parse(body);
        console.log(result.campuses[0]);
        // for (let i = 0; i < result.campuses.length; i++) {
        //     if(result.campuses[i].alias.includes("한양대")){
        //         console.log(result.campuses[i]);
        //     }
            
        // }
    })
    
});

module.exports = router;