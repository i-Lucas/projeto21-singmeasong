import supertest from 'supertest';
import app from '../src/app.js';

describe('get recommendations tests', () => {

    it('get all recommendations', async () => {

        const response = await supertest(app).get('/recommendations/');
        expect(response.body).not.toBeNull();
        expect(response.status).toBe(200);
    });

    it('verify response format', async () => {

        const response = await supertest(app).get('/recommendations/');

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('youtubeLink');
        expect(response.body[0]).toHaveProperty('score');
    });
});
