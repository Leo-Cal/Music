const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /form:
 *   get:
 *     summary: Get musical form information
 *     description: Retrieves either a list of all forms or specific form details
 *     parameters:
 *       - in: query
 *         name: formname
 *         schema:
 *           type: string
 *         description: Name of the musical form
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', function(req, res) {
    let allOpus = [];
    let allForms = [];
    var formName = req.query.formname || null
    
    try {
        const opusJson = fs.readFileSync(path.join(__dirname, '../server-data/form_opus.json'), 'utf8');
        const formsJson = fs.readFileSync(path.join(__dirname, '../server-data/forms.json'), 'utf8');
        allOpus = JSON.parse(opusJson);
        allForms = JSON.parse(formsJson);
    } catch (error) {
        console.error('Error reading musical form list: ', error);
        res.status(500).send('Server Error');
        return;
    }

    if (formName) {
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
    else {
        // Count occurrences of each form
        const formCounts = {};
        allOpus.forEach(opus => {
            formCounts[opus.form] = (formCounts[opus.form] || 0) + 1;
        });

        // Create array of forms with their categories and count
        const forms = allForms.forms.map(form => ({
            name: form.formName,
            category: form.category,
            count: formCounts[form.formName] || 0
        }));

        // Sort forms by count (most frequent first)
        forms.sort((a, b) => b.count - a.count);

        res.json({'Forms': forms});
    }
});

/**
 * @swagger
 * /form/description:
 *   get:
 *     summary: Get form description
 *     parameters:
 *       - in: query
 *         name: form
 *         schema:
 *           type: string
 *         description: Name of the form
 *     responses:
 *       200:
 *         description: Form description
 */
router.get('/description', async function(req, res) {
    var formName = req.query.form || null
    try {
        const formsJson = fs.readFileSync(path.join(__dirname, '../server-data/forms.json'), 'utf8');
        allForms = JSON.parse(formsJson).forms;
    } catch (error) {
        console.error('Error reading forms list: ', error);
        res.status(500).send('Server Error');
    }
    if (formName) {
        const formEntry = allForms.find(item => item.formName === formName)
        formDescription = formEntry ? formEntry.description : "Description not found";
        return res.json({form: formName, description: formDescription})
    }
});

module.exports = router; 