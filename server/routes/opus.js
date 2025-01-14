const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /opus:
 *   get:
 *     summary: Get list of works from composer and/or musical form
 *     description: Retrieves the list of all works from composer and/or musical form
 *     parameters:
 *       - in: query
 *         name: composer
 *         schema:
 *           type: string
 *         description: Composer's name
 *       - in: query
 *         name: form
 *         schema:
 *           type: string
 *         description: Musical form
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', function(req, res) {
    let allOpus = []
    var composerName = req.query.composer || null
    var formName = req.query.form || null
    
    if (composerName && !formName) {
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

    else if (formName && !composerName){
        try {
            const opusJson = fs.readFileSync(path.join(__dirname, '../server-data/form_opus.json'), 'utf8');
            allOpus = JSON.parse(opusJson);
        } catch (error) {
            console.error('Error reading musical form list: ', error);
            res.status(500).send('Server Error');
            return;
        }
        // Get all opus from the chosen form
        const formOpus = allOpus.filter(item => item.form === formName)

        // Calculate weighted score for each composer
        const composerStats = {};
        
        formOpus.forEach(opus => {
            if (!composerStats[opus.composer]) {
                composerStats[opus.composer] = {
                    totalPopularity: 0,
                    pieceCount: 0,
                    totalRecordings: 0
                };
            }
            composerStats[opus.composer].totalPopularity += opus.formPopularity;
            composerStats[opus.composer].pieceCount += 1;
            composerStats[opus.composer].totalRecordings += opus.recordingCount;
        });

        // Calculate weighted scores for composers
        const composerScores = Object.entries(composerStats).map(([composer, stats]) => {
            const avgPopularity = stats.totalPopularity / stats.pieceCount;
            const pieceCountWeight = Math.log2(stats.pieceCount + 1);
            const recordingsWeight = Math.log2(stats.totalRecordings + 1);
            
            const weightedScore = avgPopularity * pieceCountWeight * recordingsWeight;
            
            return {
                composer,
                score: weightedScore
            };
        });

        // Sort by weighted score and get top 3 composers
        const topComposers = composerScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.composer);

        // Sort opus by popularity for the main list
        formOpus.sort((a, b) => b.formPopularity - a.formPopularity);
        
        res.json({
            'FormOpus': formOpus,
            'TopComposers': topComposers
        });
    }

    else if (formName && composerName) {
        res.status(400).send('Bad Request: Select either composer or form')
    }

    else {
        res.status(400).send('Bad Request: No composer or musical form requested')
    }
});

module.exports = router;