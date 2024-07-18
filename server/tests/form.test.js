const app = require('../app');
const request = require('supertest');
const forms = [
    "Symphony",
    "String Quartet",
    "Piano Sonata",
    "Suite",
    "Prelude",
    "Variations",
    "Piano Concerto",
    "Etude",
    "Violin Sonata",
    "Dance",
    "Nocturne",
    "Piano Trio",
    "Violin Concerto",
    "Waltz",
    "Mass",
    "Overture",
    "Quintet",
    "Cello Sonata",
    "Impromptu",
    "Clarinet Concerto",
    "Bagatelle",
    "Ballet",
    "Viola Concerto",
    "Cantata",
    "Cello Concerto",
    "Clarinet Sonata",
    "Ecossaises",
    "Fantasia",
    "Flute Concerto",
    "Fugue",
    "Gavotte",
    "Horn Concerto",
    "Mazurka",
    "Minuet",
    "Oboe Concerto",
    "Oboe Sonata",
    "Octet",
    "Oratorio",
    "Piano Quartet",
    "Polonaise",
    "Requiem",
    "Rhapsody",
    "Rondo",
    "Scherzo",
    "Sextet",
    "String Trio",
    "Toccata",
    "Trumpet Concerto",
    "Viola Sonata",
    "Bassoon Concerto",
    "Bassoon Sonata",
    "Horn Sonata"
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
