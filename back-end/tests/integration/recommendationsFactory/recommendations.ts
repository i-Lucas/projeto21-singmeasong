import { faker } from '@faker-js/faker';
import { prisma } from '../../../src/database.js';

function createRecommendation() {

    return {
        name: faker.name.firstName(),
        youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
    }
};

async function insertRecommendationInDatabase(recommendation: any) {

    return await prisma.recommendation.create({ data: recommendation });
};

async function getRecommendationsFromDatabase(name: string) {

    return await prisma.recommendation.findFirst({ where: { name } });
};

async function getRecommendationsFromAmount(amount: number) {

    return await prisma.recommendation.findMany({ take: amount, orderBy: { score: 'desc' } });
};

async function getAllRecommendations() {

    return await prisma.recommendation.findMany();
};

const recommendationsFactory = {
    createRecommendation,
    insertRecommendationInDatabase,
    getRecommendationsFromDatabase,
    getRecommendationsFromAmount,
    getAllRecommendations
};

export default recommendationsFactory;