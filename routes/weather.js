const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');

router.get('/', function (req, res, next) {
    let url = "https://weather.naver.com/rgn/cityWetrCity.nhn?cityRgnCd=CT001017"

    request(url, function(error, response, body) {
        let date = [];
        let temp = [];
        const $ = cheerio.load(body);
        for(let i=1; i<3; i++){
          $('#content > table.tbl_weather.tbl_today3 > thead > tr > th:nth-child('+i+')').each(function(){
            date.push($(this).text());
          })
        }
        
        for(let i = 1; i< 3; i++){
          for(let j = 1; j< 4; j=j+2){
            $('#content > table.tbl_weather.tbl_today3 > tbody > tr > td:nth-child('+i+') > div:nth-child('+j+') > ul').each(function(){
              temp.push($(this).text());
            })
          }
        }
        res.render('weather',{
          date : date,
          temp : temp
        })
    });
})

module.exports = router;
