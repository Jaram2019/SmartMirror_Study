var router = require('express').Router();
let request = require('request');

/* GET home page. */
var url = 'https://bablabs.com/openapi/v1/campuses/BVRPhfbjvn/stores/LTI0MTE0NTE5?date=2019-11-11';
var headers = {
    'accesstoken': 'T2b03Gc4bRlImC6lhjkidk8APGXADAC6qfdCRZ28TgHC388MoA'
};
var query = {
    type: "null",
    date: "2019-11-11"
};

// var menu1;
// var menu2;
// var menu3;

function getMenus(URL, HEADERS, QUERY){
    request({url: URL, headers: HEADERS, query: QUERY}, function(err, res, body){
        var result = JSON.parse(body);
        var menu1 = result.store.menus[0].description;
        var menu2 = result.store.menus[1].description;
        var menu3 = result.store.menus[2].description;
        console.log(menu1);
        console.log(menu2);
        console.log(menu3);

        return [menu1, menu2, menu3]
    })
}

router.get('/', function (req, res) {
    
    async function menus(){
        var menuu = await getMenus(url, headers, query)
        return menuu
    }
    all_m = menus()
    console.log(all_m);
    res.render('haksik', {
        menu1: all_m[0],
        menu2: all_m[1],
        menu3: all_m[2]
    })
});

// router.get('/', function (req, res) {
//     request.get({url: url, headers: headers, query: query}, function(err, res, body){
//         var result = JSON.parse(body);
//         menu1 = result.store.menus[0].description;
//         menu2 = result.store.menus[1].description;
//         menu3 = result.store.menus[2].description;
//         console.log(menu1);
//         console.log(menu2);
//         console.log(menu3);
//     })
//     res.render('haksik', {
//         menu1: menu1,
//         menu2: menu2,
//         menu3: menu3
//     })
// });

module.exports = router;