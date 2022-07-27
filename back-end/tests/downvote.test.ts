import supertest from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/database.js';
import recommendationsFactory from './recommendationsFactory/recommendations.js';

describe('downvote recommendation route', () => {

    let downvote_id = undefined;
    let downvote_score = undefined;

    it('downvote recommendation a valid id', async () => {

        const data = recommendationsFactory.createRecommendation();
        const inserted = await recommendationsFactory.insertRecommendationInDatabase(data);

        downvote_id = inserted.id;
        downvote_score = inserted.score;

        const response = await supertest(app).post(`/recommendations/${inserted.id}/downvote`);
        expect(response.status).toBe(200);
    });

    it('check if score was downvote', async () => {

        await prisma.recommendation.findUnique({ where: { id: downvote_id } });
        const response = await supertest(app).get(`/recommendations/${downvote_id}`);
        expect(response.body.score).toBe(downvote_score - 1);
    });

    it('downvote recommendation a invalid id', async () => {

        const invalid_type = 'aa';
        const invalid_id = 99999999;

        const response1 = await supertest(app).post(`/recommendations/${invalid_type}/downvote`);
        const response2 = await supertest(app).post(`/recommendations/${invalid_id}/downvote`);

        expect(response1.status).toBe(500);
        expect(response2.status).toBe(404);
    });
});