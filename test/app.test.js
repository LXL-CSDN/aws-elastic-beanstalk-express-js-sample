const request = require('supertest');
const app = require('../app');

describe('Express App Tests', () => {
    it('should return 200 for GET /', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return "Hello World!" content', (done) => {
        request(app)
            .get('/')
            .expect('Hello World!')
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

