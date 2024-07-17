const app = require('../index');
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
      },
      {
        "name": "Franz Schubert",
        "birthyear": 1797
      },
      {
        "name": "Hector Berlioz",
        "birthyear": 1803
      },
      {
        "name": "Mikhail Glinka",
        "birthyear": 1804
      },
      {
        "name": "Felix Mendelssohn",
        "birthyear": 1809
      },
      {
        "name": "Frédéric Chopin",
        "birthyear": 1810
      },
      {
        "name": "Robert Schumann",
        "birthyear": 1810
      },
      {
        "name": "Franz Liszt",
        "birthyear": 1811
      },
      {
        "name": "Richard Wagner",
        "birthyear": 1813
      },
      {
        "name": "Giuseppe Verdi",
        "birthyear": 1813
      },
      {
        "name": "Jacques Offenbach",
        "birthyear": 1819
      },
      {
        "name": "César Franck",
        "birthyear": 1822
      },
      {
        "name": "Bedřich Smetana",
        "birthyear": 1824
      },
      {
        "name": "Johann Strauss II",
        "birthyear": 1825
      },
      {
        "name": "Johannes Brahms",
        "birthyear": 1833
      },
      {
        "name": "Alexander Borodin",
        "birthyear": 1833
      },
      {
        "name": "Camille Saint-Saëns",
        "birthyear": 1835
      },
      {
        "name": "César Cui",
        "birthyear": 1835
      },
      {
        "name": "Mily Balakirev",
        "birthyear": 1837
      },
      {
        "name": "Georges Bizet",
        "birthyear": 1838
      },
      {
        "name": "Modest Mussorgsky",
        "birthyear": 1839
      },
      {
        "name": "Pyotr Ilyich Tchaikovsky",
        "birthyear": 1840
      },
      {
        "name": "Antonín Dvořák",
        "birthyear": 1841
      },
      {
        "name": "Edvard Grieg",
        "birthyear": 1843
      },
      {
        "name": "Nikolai Rimsky-Korsakov",
        "birthyear": 1844
      },
      {
        "name": "Gabriel Fauré",
        "birthyear": 1845
      },
      {
        "name": "Leoš Janáček",
        "birthyear": 1854
      },
      {
        "name": "Edward Elgar",
        "birthyear": 1857
      },
      {
        "name": "Gustav Mahler",
        "birthyear": 1860
      },
      {
        "name": "Claude Debussy",
        "birthyear": 1862
      },
      {
        "name": "Richard Strauss",
        "birthyear": 1864
      },
      {
        "name": "Jean Sibelius",
        "birthyear": 1865
      },
      {
        "name": "Erik Satie",
        "birthyear": 1866
      },
      {
        "name": "Alexander Scriabin",
        "birthyear": 1872
      },
      {
        "name": "Ralph Vaughan Williams",
        "birthyear": 1872
      },
      {
        "name": "Arnold Schoenberg",
        "birthyear": 1874
      },
      {
        "name": "Charles Ives",
        "birthyear": 1874
      },
      {
        "name": "Maurice Ravel",
        "birthyear": 1875
      },
      {
        "name": "Béla Bartók",
        "birthyear": 1881
      },
      {
        "name": "Igor Stravinsky",
        "birthyear": 1882
      },
      {
        "name": "Anton Webern",
        "birthyear": 1883
      },
      {
        "name": "Edgard Varèse",
        "birthyear": 1883
      },
      {
        "name": "Alban Berg",
        "birthyear": 1885
      },
      {
        "name": "Sergei Prokofiev",
        "birthyear": 1891
      },
      {
        "name": "George Gershwin",
        "birthyear": 1898
      },
      {
        "name": "Dmitri Shostakovich",
        "birthyear": 1906
      },
      {
        "name": "Benjamin Britten",
        "birthyear": 1913
      }];

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