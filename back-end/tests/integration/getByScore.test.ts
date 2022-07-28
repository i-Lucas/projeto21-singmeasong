import supertest from 'supertest';
import app from '../../src/app.js';
import recommendationsFactory from './recommendationsFactory/recommendations.js';

describe('get recommendations by score amount', () => {

    it('get top recommendations', async () => {

        const amount = 1;
        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        const result = await recommendationsFactory.getRecommendationsFromAmount(amount);

        expect(response.body).toEqual(result);
        expect(response.status).toBe(200);
    });

    it('get top recommendations with invalid amount', async () => {

        const amount = 'aa';
        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        expect(response.status).toBe(500);
    });

    it('get top recommendations with not amount', async () => {

        const response = await supertest(app).get(`/recommendations/top/`);
        expect(response.status).toBe(500);
    });

    it('get top recommendations in descending order', async () => {

        const data1 = recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendationInDatabase({ ...data1, score: 10 });

        const data2 = recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendationInDatabase({ ...data2, score: 5 });

        const data5 = recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendationInDatabase({ ...data5, score: 5 });

        const data6 = recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendationInDatabase({ ...data6, score: 4 });

        const amount = 5;
        const response = await supertest(app).get(`/recommendations/top/${amount}`);

        let isValid = true;

        // check if the result score is in descending order
        for (let i = 0; i < response.body.length - 1; i++) { // o(n)
            if (response.body[i].score < response.body[i + 1].score) {
                isValid = false;
            }
        };

        expect(isValid).toBe(true);
        expect(response.status).toBe(200);
    });
});