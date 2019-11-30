var router = require('express').Router();
let request = require('request');
let dateutil = require('date-utils');
console.log("index Router");
/* GET home page. */
var nearBus_busstop
var nearHour_busstop

let shuttlecock_o = 'https://shuttle.jaram.net/semester/week/shuttlecock_o'
let giksa = 'https://shuttle.jaram.net/semester/week/giksa'
let subway = 'https://shuttle.jaram.net/semester/week/subway'
let yesulin = 'https://shuttle.jaram.net/semester/seek/yesulin'


//셔틀콕 외부행 조회
function gettime(busstop) {
    request(busstop, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            const week_data = JSON.parse(body);
            console.log(week_data);
            let newDate = new Date();
            let time = newDate.toFormat('HH24:MI');
            console.log("now time is : " + time)
            nearHour_busstop = find_close_hour(time, week_data);
            if (nearHour_busstop.length == 0) { //배열을 다 돌아도 현재시간과 가장 가까운 데이터를 못 찾는 경우 => 새벽시간대에 검색한 경우
                is_dawn = 1
                console.log("EMPTY")
                nearHour_busstop = find_close_hour("07:00", week_data)
            }
            console.log("near hour is : " + nearHour_busstop);
            if (is_dawn == 1) {
                nearBus_busstop = 0
                console.log(nearBus_busstop)
            } else {
                nearBus_busstop = find_near_bus(time, nearHour_busstop);
            }
            console.log("The nearest Bus of ShuttleCock => HandaeAp Station comes at " + nearHour_busstop[nearBus_busstop]);

            return nearHour_busstop[nearBus_busstop]
        }
    });
}




router.get('/', function (req, res) {

    async function search(){
        var res_shuttle_o = await gettime(shuttlecock_o)
        // var res_giksa = await gettime(giksa)
        // var res_subway = await gettime(subway)
        // var res_yesulin = await gettime(yesulin)

        return [res_shuttle_o, res_giksa,res_subway, res_yesulin]
    }
    search_res = search()
    console.log("!!!!!!!!!" + search_res[0])
    res.render('bus', {
        nearHour_shuttlecock_O: search_res[0],
        nearHour_subway: search_res[2],
        nearHour_yesulin: search_res[3],
        nearHour_giksa: search_res[1]
    })
});

function find_close_hour(now, target){// week_data
    var nowTimeArr = now.split(':'); // 파리미터로 넘겨받은 현재시간을 : 기준으로 잘라서 배열에 저장.
    var near = [];
    console.log("now time arr : " + nowTimeArr)
    // console.log()
    // console.log("target:" + target[0].time)

    for (let i = 0; i < target.length; i++) {
        time = target[i].time; //08:00 형식의 데이터 추출
        var spl_time = time.split(":");//:기준으로 쪼개어 배열로 저장.
        if (spl_time[0] == nowTimeArr[0] || spl_time[0] == Number(nowTimeArr[0]) + 1){
            // console.log("what is spltime?? " + spl_time)
            // console.log("what is nowtime[0]?? " + nowTimeArr[0])
            // console.log(Number(nowTimeArr[0]) + 1)
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
        console.log(Math.abs(target[i].split(":")[1] - nowMinute));
        var gap = target[i].split(":")[1] - nowMinute; //gap 는 새로 구한 차이(절대값)
        console.log(target[i].split(":")[1])
        console.log("gap = " + gap);
        if(Math.abs(gap) <= nearest){ // 새로 구한 값이 최근접일 경우 치환
            if (gap <= 0) {
                idx++
                continue;
            }
            nearest = gap;
            idx++;
        }

        console.log("idx = " + idx);
    }
    
    return idx-1;
}

module.exports = router;