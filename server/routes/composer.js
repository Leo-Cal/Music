const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /composer:
 *   get:
 *     summary: Get composer information
 *     description: Retrieves either a list of all composers or specific composer's works
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Composer's name
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', function(req, res) {
    let allComposers = [];
    let allOpus = []
    var composerName = req.query.name || null

    try {
        const composersJson = fs.readFileSync(path.join(__dirname, '../server-data/composers.json'), 'utf8');
        allComposers = JSON.parse(composersJson);
    } catch (error) {
        console.error('Error reading composer list: ', error);
        res.status(500).send('Server Error');
    }
    
    if (composerName) {
        try {
            const opusJson = fs.readFileSync(path.join(__dirname, '../server-data/composer_opus.json'), 'utf8');
            allOpus = JSON.parse(opusJson)
        } catch (error) {
            console.error(`Error reading ${composerName} opus: `, error);
            res.status(500).send('Server Error')
        }
        const composerOpus = allOpus.filter(item => item.composer === composerName)
        
        // Calculate weighted score for each form
        const formStats = {};
        
        composerOpus.forEach(opus => {
            if (!formStats[opus.form]) {
                formStats[opus.form] = {
                    totalPopularity: 0,
                    pieceCount: 0,
                    totalRecordings: 0
                };
            }
            formStats[opus.form].totalPopularity += opus.composerPopularity;
            formStats[opus.form].pieceCount += 1;
            formStats[opus.form].totalRecordings += opus.recordingCount;
        });

        // Calculate weighted scores
        const formScores = Object.entries(formStats).map(([form, stats]) => {
            const avgPopularity = stats.totalPopularity / stats.pieceCount;
            const pieceCountWeight = Math.log2(stats.pieceCount + 1); // logarithmic scaling for piece count
            const recordingsWeight = Math.log2(stats.totalRecordings + 1); // logarithmic scaling for recordings
            
            // Weighted score formula:
            // (Average Popularity) * (log2(pieces + 1)) * (log2(recordings + 1))
            const weightedScore = avgPopularity * pieceCountWeight * recordingsWeight;
            
            return {
                form,
                score: weightedScore
            };
        });

        // Sort by weighted score and get top 3 forms
        const topForms = formScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.form);

        composerOpus.sort((a, b) => b.composerPopularity - a.composerPopularity);
        res.json({
            'Opus': composerOpus,
            'TopForms': topForms
        });           
    }

    else {
        let composerInfo = allComposers.composers.map(c => ({name:c.name, birthyear:c.birthyear, period: c.period}));
        composerInfo.sort((a,b) => a.birthyear - b.birthyear)
        res.json({'Composers': composerInfo})
    }
});

module.exports = router; 