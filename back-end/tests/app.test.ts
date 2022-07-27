import supertest from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/database.js';
import recommendationsFactory from './recommendationsFactory/recommendations.js';

// clean database
beforeAll(async () => await prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE;`);

describe('create recommendations tests', () => {

    let existingRecommendation = '';

    it('create with valid data', async () => {

        const data = recommendationsFactory.createRecommendation();

        const response = await supertest(app).post('/recommendations/').send(data);
        const inserted = await recommendationsFactory.getRecommendationsFromDatabase(data.name);
        existingRecommendation = data.name;

        expect(response.status).toBe(201);
        expect(data.name).toBe(inserted.name);
    });

    it('create with invalid url', async () => {

        const data = recommendationsFactory.createRecommendation();
        const response = await supertest(app).post('/recommendations/')
            .send({ ...data, youtubeLink: 'invalidurl' });
        expect(response.status).toBe(422);
    });

    it('create with invalid name', async () => {

        const data = recommendationsFactory.createRecommendation();
        const response = await supertest(app).post('/recommendations/').send({ ...data, name: 1 });
        expect(response.status).toBe(422);
    });

    it('create with invalid youtube link', async () => {

        const data = recommendationsFactory.createRecommendation();
        const response = await supertest(app).post('/recommendations/')
            .send({ ...data, youtubeLink: 'www.google.com.br' });
        expect(response.status).toBe(422);
    });

    it('create with existing name', async () => {

        const data = recommendationsFactory.createRecommendation();
        const response = await supertest(app).post('/recommendations/')
            .send({ ...data, name: existingRecommendation });
        expect(response.status).toBe(409);
    });
});

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

describe('random route test', () => {

    it('get random recommendation', async () => {

        const response = await supertest(app).get('/recommendations/random');
        response.body ? expect(response.status).toBe(200) : expect(response.status).toBe(404);
    });
});

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

describe('get recommendations by valid id', () => {

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

afterAll(async () => await prisma.$disconnect());