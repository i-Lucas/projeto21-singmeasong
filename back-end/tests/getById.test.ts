import supertest from 'supertest';
import app from '../src/app.js';
import recommendationsFactory from './recommendationsFactory/recommendations.js';

describe('get recommendations by id', () => {

    it('get recommendation by valid id', async () => {

        const data = recommendationsFactory.createRecommendation();
        const inserted = await recommendationsFactory.insertRecommendationInDatabase(data);
        const response = await supertest(app).get(`/recommendations/${inserted.id}`);

        expect(response.body).toEqual(inserted);
        expect(response.status).toBe(200);
    });

    it('get recommendation by invalid id', async () => {

        const list = await recommendationsFactory.getAllRecommendations();
        const not_found_id = list[list.length - 1].id + 1;

        const invalid_type = 'aa';

        const response = await supertest(app).get(`/recommendations/${not_found_id}`);
        const response2 = await supertest(app).get(`/recommendations/${invalid_type}`);

        expect(response.status).toBe(404);
        expect(response2.status).toBe(500);
    });
});