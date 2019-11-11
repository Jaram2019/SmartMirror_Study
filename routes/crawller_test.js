var router = require('express').Router();
let request = require('request');
let dateutil = require('date-utils');
console.log("index Router");
/* GET home page. */
router.get('/', function (req, res) {
    let week_src = 'https://exitsoft.github.io/ShuttlecockAPI/semester/week.json'
    // var week_data; javascript 변소 범위 확인 필요...
    request(week_src, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var week_data = JSON.parse(body);
            console.log(week_data.shuttleA[1].time);
            // console.log(week_data.shuttleA.length);
        }
    });
    let newDate = new Date();
    let time = newDate.toFormat('HH24:MI');
    // console.log(week_data.shuttleA.length);
    // for(let i=0;i<week_data.shuttleA.length)

    // console.log("page routing");

});

function find_close(now, target) {
    var nowTimeArr = now.split(':'); // 파리미터로 넘겨받은 현재시간을 : 기준으로 잘라서 배열에 저장.

}

module.exports = router;