var router = require('express').Router();

const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.premierleague.com/tables';

router.get('/', function (req, res) {
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const Table = $('.tableBodyContainer.isPL > tr');
      let PLtable = [];

      Table.each(function () {
        const position = $(this).find('.pos > .value').text();
        const badge = $(this).find('.team > a > .badge-25').toString();
        const club = $(this).find('.team > a > .long').text();
        const club_short = $(this).find('.team > a > .short').text();
        const points = $(this).find('.points').text();
        const played = $(this).find('td:nth-child(4)').text();
        const won = $(this).find('td:nth-child(5)').text();
        const drawn = $(this).find('td:nth-child(6)').text();
        const lost  = $(this).find('td:nth-child(7)').text();
        const gf  = $(this).find('td:nth-child(8)').text();
        const ga  = $(this).find('td:nth-child(9)').text();
        const gd  = $(this).find('td:nth-child(10)').text().trim();

        if(club !== ''){
          PLtable.push([position,club,played,won,drawn,lost,gf,ga,gd,points])
        }
      });
      res.render('parse_PL',{
        PLtable : PLtable
      });
    })
    .catch(console.error);
});


module.exports = router;
