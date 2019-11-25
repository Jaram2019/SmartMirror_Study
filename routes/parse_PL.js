const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.premierleague.com/tables';

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const Table = $('.tableBodyContainer.isPL > tr');
    const PLtable = [];

    Table.each(function () {
      const position = $(this).find('.pos > .value').text();
      const badge = $(this).find('.team > a > .badge-25').toString();
      const club = $(this).find('.team > a > .long').text();
      const club_short = $(this).find('.team > a > .short').text();
      const points = $(this).find('.points').text();
      const played = $(this).find('td:nth-child(4)').text();
      const won = $(this).find('td:nth-child(5)').text();
      const drown = $(this).find('td:nth-child(6)').text();
      const lost  = $(this).find('td:nth-child(7)').text();
      const gf  = $(this).find('td:nth-child(8)').text();
      const ga  = $(this).find('td:nth-child(9)').text();
      const gd  = $(this).find('td:nth-child(10)').text().trim();

      if(club !== ''){
        const badgeArr = badge.split('"');
        PLtable.push({
          Position: position,
          Badge: badgeArr[1],
          Club: club,
          Club_Short: club_short,
          Played: played,
          Won: won,
          Drown: drown,
          Lost: lost,
          GF: gf,
          GA: ga,
          GD: gd,
          Points: points,
        });
      }
    });
    console.log(PLtable);
  })
  .catch(console.error);
