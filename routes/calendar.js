var router = require('express').Router();
var fs = require('fs');
var readline = require('readline');
const { google } = require('googleapis');
 
var SCOPES = [
              'https://www.googleapis.com/auth/calendar.readonly', // 캘린더 정보의 읽기 권한? 입니다.
              'https://www.googleapis.com/auth/calendar' // 캘린더 정보의 편집 권한? 입니다.
              ];
 
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
// 토큰이 저장될 디렉토리
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs.json';
// 토큰 파일 명

router.get('/', function(req,res) {
    fs.readFile('client_secret.json/', function processClientSecrets(err, content) {
    // 로컬의 client_secret.json 파일을 읽고 'authorize' 함수 실행
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    authorize(JSON.parse(content), listEvents);
  })
});
 
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  // client_secret.json 파일에서 시크릿키, 클라이언트 아이디, 리다이렉트 URI를 받습니다.
  // 웹 어플리케이션으로 만들었을 때에는 'installed' -> 'web' 으로 수정합니다.
  // ex 'var clientSecret = credentials.web.client_secret;'
 
  var oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
 
  fs.readFile(TOKEN_PATH, function(err, token) {
    // 앞서 지정한 디렉토리와 파일명으로 토큰 파일을 읽습니다.
    if (err) {
      getNewToken(oauth2Client, callback); // 토큰이 없다면 만듭니다.
    } else {
      oauth2Client.credentials = JSON.parse(token); // 토큰이 있다면 정보를 객체에 담습니다.
      callback(oauth2Client);
    }
  });
}
 
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
 
  // 브라우저에 'authUrl'의 링크로 접근하여 데이터 접근에 동의한 후 리다이렉트 되는 URL의
  // 'code=' 다음 부분을 복사합니다.
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // 복사한 'code=' 다음 부분을 입력합니다.
  // 로컬에서 테스트 할때에는 code= 다음 부분의 값이 URL 인코딩이 되어 있을 수 있으니
  // URL 디코딩한 후에 입력합니다.
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
 
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), function(err, result){
    if(err) console.log('error', err);
  }); // 토큰을 만듭니다.
  console.log('Token stored to ' + TOKEN_PATH);
}
 
function listEvents(auth) {
  // 토큰 인증이 완료되면 최종적으로 실행되는 함수 입니다.
  // 아래의 예제는 구글 캘린더에 등록된 이벤트 10개의 정보를 출력합니다.
  var calendar = google.calendar('v3');
 
  calendar.events.list({
    auth: auth,
    calendarId: 'a123mrleelex@gmail.com', // 이곳에 이벤트를 가져올 캘린더 id를 입력해야 합니다.
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.data.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      console.log('Upcoming 10 events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
      }
    }
  });
}

module.exports = router;