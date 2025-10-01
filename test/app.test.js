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

    it('should return valid HTML content', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
