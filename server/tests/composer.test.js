const app = require('../app');
const request = require('supertest');


const composers = [
    {
        "name": "George Frideric Handel",
        "birthyear": 1685
      },
      {
        "name": "Johann Sebastian Bach",
        "birthyear": 1685
      },
      {
        "name": "Joseph Haydn",
        "birthyear": 1732
      },
      {
        "name": "Wolfgang Amadeus Mozart",
        "birthyear": 1756
      },
      {
        "name": "Ludwig van Beethoven",
        "birthyear": 1770
      }
    ];

describe('Composer Page', () => {
    test('Composer list page: should return 200 and json list with composer name and birthyear', async () => {
        const response = await request(app).get('/composer');
        expect(response.status).toBe(200);
        expect(response.body.Composers).toBeDefined();
        expect(response.body.Composers[0]).toHaveProperty('name');
        expect(response.body.Composers[0]).toHaveProperty('birthyear');
        });

    composers.forEach( (composer) => {
        test(`Composer opus page from ${composer.name}: should return 200 and an Opus object`, async() => {
            expect(composer).toHaveProperty('name');
            const name = composer.name
            const response = await request(app).get('/composer').query({name});
            expect(response.status).toBe(200);
            expect(typeof response.body).toBe('object');
            expect(response.body.Opus).toBeDefined();
            if (response.body.Opus.length === 0){
                console.warn(`Opus list empty for ${name}`)
            }
        })
    })
})