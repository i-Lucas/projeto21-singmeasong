import supertest from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/database.js';
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

afterAll(async () => await prisma.$disconnect());