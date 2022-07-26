import supertest from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/database.js';

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE;`;
});

describe('create recommendations tests', () => {

    it('create with valid data', async () => {

        const data = {
            name: 'test',
            youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
        }

        const response = await supertest(app).post('/recommendations/').send(data)
        const inserted = await prisma.recommendation.findFirst({ where: { name: data.name } });

        expect(response.status).toBe(201);
        expect(data.name).toBe(inserted.name);
    })

    it('create with invalid url', async () => {

        const data = { name: 'test', youtubeLink: 'invalidurl' }
        const response = await supertest(app).post('/recommendations/').send(data)
        expect(response.status).toBe(422);
    });

    it('create with invalid name', async () => {

        const data = {
            name: 1,
            youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
        }

        const response = await supertest(app).post('/recommendations/').send(data)
        expect(response.status).toBe(422);
    });
});