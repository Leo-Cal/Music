const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /composers:
 *   get:
 *     summary: Get all composers
 *     description: Retrieves list of all composers
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', function(req, res) {
    let allComposers = [];
    try {
        const composersJson = fs.readFileSync(path.join(__dirname, '../server-data/composers.json'), 'utf8');
        allComposers = JSON.parse(composersJson);
    } catch (error) {
        console.error('Error reading composer list: ', error);
        res.status(500).send('Server Error');
    }

    let composerInfo = allComposers.composers.map(c => ({name:c.name, birthyear:c.birthyear, period: c.period}));
    composerInfo.sort((a,b) => a.birthyear - b.birthyear)
    res.json({'Composers': composerInfo})
});

module.exports = router; 