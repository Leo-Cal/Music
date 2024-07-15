var http = require('http')
var express = require('express');
var request = require('request');
var querystring = require('querystring')
const cookieParser = require('cookie-parser')
const fs = require('fs');
var path = require('path')
const cors = require('cors');
var AWS = require('aws-sdk');
var awsConfig = new AWS.Config({
    credentials: {accessKeyId:'', secretAccessKey:''},
    region: 'us-east-1'
});
var ddb = new AWS.DynamoDB(awsConfig);

// Credentials of Spotify App
var client_id = ''
var client_secret = ''
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// Login page -> Redirects to Spotify authentication page with app credentials
app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type : 'code',
        client_id: client_id,
        redirect_uri: redirect_uri
    }));
});

// Callback page -> callback address in Spotify app. Receives authentication code and requests access token
//               -> redirects to '/' with access token and refresh token in cookies
app.get('/callback', function(req, res) {
    var code = req.query.code || null;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {code: code,
               redirect_uri: redirect_uri,
               grant_type: 'authorization_code'},
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))},
        json: true
    };
    
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;
            // res.redirect('/#' + 
            //     querystring.stringify({
            //         access_token: access_token,
            //         refresh_token: refresh_token
            //     }));
            res.cookie('access_token', access_token, {
                expires: new Date(Date.now() + 900000)
            })
            res.cookie('refresh_token', refresh_token, {
                expires: new Date(Date.now() + 900000)
            })
            res.redirect('/');
        } else {
            res.redirect('/#' + 
                querystring.stringify({
                    error: 'invalid_token'
                }));
        };
    });
});

app.get('/', function(req, res) {
    // console.log(req.cookies.access_token)
    res.sendFile('homepage.html', {root: __dirname})

});

app.get('/composer', function(req, res) {

    var allComposers = JSON.parse(fs.readFileSync('../data/composers.json', 'utf8'));
    var composerName = req.query.name || null

    if (composerName) {
        // Send all opus from chosen composer
        var allOpus = JSON.parse(fs.readFileSync('../data/composer_opus.json', 'utf8'));
        const composerOpus = allOpus.filter(item => item.composer === composerName)
        composerOpus.sort((a, b) => b.composerPopularity - a.composerPopularity);
        res.json({'Opus': composerOpus});           
    }

    else {
        let composerInfo = allComposers.composers.map(c => ({name:c.name, birthyear:c.birthyear}));
        composerInfo.sort((a,b) => a.birthyear - b.birthyear)
        res.json({'Composers': composerInfo})
    }
})

app.get('/form', function(req, res) {

    var allOpus = JSON.parse(fs.readFileSync('../data/form_opus.json', 'utf8'));
    var formName = req.query.formname || null

    if (formName) {
        // Get all opus from the chosen form and rank them by popularity
        const formOpus = allOpus.filter(item => item.form === formName)
        formOpus.sort((a, b) => b.formPopularity - a.formPopularity);
        res.json({'FormOpus': formOpus})
    }

    else {
        const formCount = {};
        allOpus.forEach(obj => {
            if (formCount[obj['form']]) {
                formCount[obj['form']]++;  
            }
            else {
                formCount[obj['form']] = 1;
            }

        })
        
        var entries = Object.entries(formCount)
        entries.sort( (a, b) => b[1] - a[1])
        entries = Object.fromEntries(entries)
        formsArr = Object.keys(entries);
        res.json({'Forms': formsArr})
    }
}
);

app.get('/searchwiki', async function(req, res) {

    const query = req.query
    if (!query) {
        return res.status(400).send('No query parameter given')
    }
    
    const opus = query.opus;
    const composer = query.composer;

    // Parse the name of the song to find better matches on Wikipedia API
    const nameParts = composer.trim().split(' ');
    const lastName = nameParts[nameParts.length - 1];
    const wikiSearchParam = `${opus} (${lastName})`

    // Search Wikipedia for relevant articles
    const searchUrl = 'https://en.wikipedia.org/w/api.php';
    const searchParams = {
        action: 'query',
        list: 'search',
        format: 'json',
        srsearch: wikiSearchParam
    }
    request( { url: searchUrl, qs: searchParams, json: true}, (err, response, searchData) => {
        if (err) {
            console.error('Error searching Wikipedia: ', err);
            return res.status(500).send('Error searching Wikipedia');
        }
        
        if (searchData.query) {
            // Find the best matching article
            const titles = searchData.query.search.map(article => article.title)
            const songParts = opus.toLowerCase().replace(/\./g,'').replace(/\,/g,'').split(/\s+/);
            const songNumbers = opus.match(/\d+/g);
            let highScore = 0;
            let bestMatch = titles[0];
            console.log(titles)
            titles.forEach(title => {
                let score = 0;
                const titleParts = title.toLowerCase().replace(/\./g,'').replace(/\,/g,'').split(/\s+/);
                const titleNumbers = title.match(/\d+/g) || [];
                // Calculate score based on intersection of parts in the strings
                songParts.forEach(part => {
                    if (titleParts.includes(part)){
                        score++
                    }
                });
                // Increase weight in match of Opus number or No. of work
                songNumbers.forEach(number => {
                    if (titleNumbers.includes(number)) {
                        score += 1;
                    }
                });
                // Assuming a score higher than 3 indicates relevance (i.e. same form name + same catalog + same opus number)
                if (score > 3 & score > highScore){
                    highScore = score;
                    bestMatch = title;
                }
            });

            // When the best match is the list of compositions from the composer, change to the general composer wiki
            if (bestMatch.includes('List of')){
                if (titles.includes(composer)){
                    bestMatch = composer
                }
                
            }

            // Get the summary of the best matched Wikipedia article
            wikiTitle = bestMatch
            const pageQueryParam = {
                action: 'query',
                format: 'json',
                prop: 'extracts',
                exintro: true,
                explaintext: true,
                titles: wikiTitle
            }

            request( {url: searchUrl, qs: pageQueryParam, json: true}, (err, response, opusData) => {
                if (err) {
                    console.error('Error finding the work page: ', err);
                    return res.status(404).send('Work page not found in Wikipedia')
                }
                if (opusData.query) {
                    const opusQuery = opusData.query.pages;
                    const pageKey = Object.keys(opusQuery)[0];
                    const opusSummary = opusQuery[`${pageKey}`].extract;
                    return res.json({opus: opus, summary: opusSummary});
                }
                else {
                    return res.status(404).send('No contend found')
                }       
            })
        }
        else {
            res.status(404).send('No search query')
        }
    })

});
console.log('Listening on 8888');
app.listen(8888);