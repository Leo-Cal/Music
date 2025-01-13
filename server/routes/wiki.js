const express = require('express');
const router = express.Router();
const request = require('request');

/**
 * @swagger
 * /wiki/opus:
 *   get:
 *     summary: Search Wikipedia for opus information
 *     parameters:
 *       - in: query
 *         name: opus
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: composer
 *         schema:
 *           type: string
 *         required: true
 */
router.get('/opus', async function(req, res) {
    const query = req.query
    let wikiSearchParam = ''
    if (!query) {
        return res.status(400).send('No query parameter given')
    }
    
    const opus = query.opus || null;
    const composer = query.composer || null;

    // Parse the name of the song to find better matches on Wikipedia API
    if (!composer){
        return res.status(400).send('Bad Request. No composer name')
    }
    const nameParts = composer.trim().split(' ');
    const lastName = nameParts[nameParts.length - 1];
    wikiSearchParam = `${opus} (${lastName})`

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
            titles.forEach(title => {
                let score = 0;
                const titleParts = title.toLowerCase().replace(/\./g,'').replace(/\,/g,'').split(/\s+/);
                const titleNumbers = title.match(/\d+/g) || [];
                
                songParts.forEach(part => {
                    if (titleParts.includes(part)){
                        score++
                    }
                });
                
                if (songNumbers){
                    songNumbers.forEach(number => {
                        if (titleNumbers.includes(number)) {
                            score += 1;
                        }
                    });
                }

                if (score > 3 & score > highScore){
                    highScore = score;
                    bestMatch = title;
                }
            });

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
                    const opusSummary = opusQuery[`${pageKey}`].extract.split('\n')[0];;
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

/**
 * @swagger
 * /wiki/composer:
 *   get:
 *     summary: Search Wikipedia for composer information
 *     parameters:
 *       - in: query
 *         name: composer
 *         schema:
 *           type: string
 *         required: true
 */
router.get('/composer', async function(req, res) {
    const query = req.query
    const composer = query.composer || null;
    const searchUrl = 'https://en.wikipedia.org/w/api.php';
    if (!composer){
        return res.status(400).send('Bad Request. No composer name')
    }
    else{
        const pageQueryParam = {
            action: 'query',
            format: 'json',
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            titles: composer
        }
        request( {url: searchUrl, qs: pageQueryParam, json: true}, (err, response, wikiData) => {
            if (err) {
                console.error('Error finding the work page: ', err);
                return res.status(400).send('Error fetching Wikipedia')
            }
            if (wikiData.query) {
                const wikiQuery = wikiData.query.pages;
                const pageKey = Object.keys(wikiQuery)[0];
                const wikiSummary = wikiQuery[`${pageKey}`].extract.split('\n')[0];

                return res.json({composer: composer, summary: wikiSummary});
            }
            else {
                return res.status(404).send(`${composer} article not found in Wikipedia`)
            }
        })
    }
});

module.exports = router; 