var router = require('express').Router();
let request = require('request');
let dateutil = require('date-utils');
console.log("index Router");
/* GET home page. */
router.get('/', function (req, res) {
    // var week_data; javascript 변수 범위 확인 필요...
    let week_src = 'https://exitsoft.github.io/ShuttlecockAPI/semester/week.json'
    request(week_src, function(err, res, body){
        if(!err && res.statusCode == 200) {
            var week_data = JSON.parse(body);
            // var test_data = week_data.shuttleA[1].time;
            // var testarr = test_data.split(":");
            // console.log(testarr);
            // console.log(week_data.shuttleA);
            let newDate = new Date();
            let time = newDate.toFormat('HH24:MI');
            
            var nearHour = find_close_hour(time, week_data.shuttleA);
            console.log(nearHour);
            var nearBus = find_near_bus(time, nearHour);
            console.log("The nearest Bus of ShuttleCock => HandaeAp Station comes at " + nearHour[nearBus]);
        }
    });

    // console.log(week_data.shuttleA.length);
    // for(let i=0;i<week_data.shuttleA.length)
    
    // console.log("page routing");

});

function find_close_hour(now, target){// week_data.shuttleA
    var nowTimeArr = now.split(':'); // 파리미터로 넘겨받은 현재시간을 : 기준으로 잘라서 배열에 저장.
    var data = target; //week_data.shuttleA 를 넘겨받음. 배열 인덱스로 접근해야함.
    var near = [];
    for (let i = 0; i < target.length; i++) {
        time = target[i].time; //08:00 형식의 데이터 추출
        var spl_time = time.split(":");
        if(spl_time[0] == nowTimeArr[0]){
            near.push(time);//해당 시간대의 시각을 배열에 추가
        }
    }
    
    return near; //해당 시간대의 시각이 담긴 배열을 리턴
}

function find_near_bus(now, target){ //target 은 ['HH:MM",,,] 꼴의 배열.
    var nowMinute = now.split(":")[1]; //분
    var nearest = 60; // nearest는 지금까지의 가장 최근접한 차이.
    var idx = 0;
    for (let i = 0; i < target.length; i++) {
        // console.log(Math.abs(target[i].split(":")[1] - nowMinute));
        var gap = target[i].split(":")[1] - nowMinute; //gap 는 새로 구한 차이(절대값)
        // console.log(gap);
        if(Math.abs(gap) < nearest){ // 새로 구한 값이 최근접일 경우 치환
            if(gap <= 0){
                idx++
                continue;
            }
            nearest = gap;
            idx++;
        }
        // console.log(idx);
    }
    
    return idx-1;
}

module.exports = router;