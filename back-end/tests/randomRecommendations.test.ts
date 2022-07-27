import supertest from 'supertest';
import app from '../src/app.js';

describe('random route test', () => {

    it('get random recommendation', async () => {

        const response = await supertest(app).get('/recommendations/random');
        response.body ? expect(response.status).toBe(200) : expect(response.status).toBe(404);
    });
});
