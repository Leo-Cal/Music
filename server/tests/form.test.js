const app = require('../app');
const request = require('supertest');
const forms = [
    "Symphony",
    "Piano Sonata",
    "Piano Concerto",
]

describe('Musical Forms Page', () => {
    test('Musical forms list page: should return 200 and list of JSON with form name', async() => {
        const response = await request(app).get('/form');
        expect(response.status).toBe(200);
        expect(response.body.Forms).toBeDefined();
        expect(response.body.Forms.length).toBeGreaterThan(0)
    })

    forms.forEach( (formname) => {
        test(`Musical form opus page from ${formname}}: should return 200 and a FormOpus object`, async() => {
            const response = await request(app).get('/form').query({formname});
            expect(response.status).toBe(200);
            expect(typeof response.body).toBe('object');
            expect(response.body.FormOpus).toBeDefined();
            if (response.body.FormOpus.length === 0){
                console.warn(`Opus list empty for ${formname}`)
            }
        })
    })
})
