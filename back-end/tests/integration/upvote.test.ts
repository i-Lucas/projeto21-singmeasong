import supertest from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/database.js';
import recommendationsFactory from './recommendationsFactory/recommendations.js';

describe('upvote recommendation route', () => {

    let upvoted_id = undefined;
    let upvoted_score = undefined;

    it('upvote recommendation a valid id', async () => {

        const data = recommendationsFactory.createRecommendation();
        const inserted = await recommendationsFactory.insertRecommendationInDatabase(data);

        upvoted_id = inserted.id;
        upvoted_score = inserted.score;

        const response = await supertest(app).post(`/recommendations/${inserted.id}/upvote`);
        expect(response.status).toBe(200);
    });

    it('check if score was upvoted', async () => {

        await prisma.recommendation.findUnique({ where: { id: upvoted_id } });
        const response = await supertest(app).get(`/recommendations/${upvoted_id}`);
        expect(response.body.score).toBe(upvoted_score + 1);
    });

    it('upvote recommendation a invalid id', async () => {

        const invalid_type = 'aa';
        const invalid_id = 99999999;

        const response1 = await supertest(app).post(`/recommendations/${invalid_type}/upvote`);
        const response2 = await supertest(app).post(`/recommendations/${invalid_id}/upvote`);

        expect(response1.status).toBe(500);
        expect(response2.status).toBe(404);
    });
});