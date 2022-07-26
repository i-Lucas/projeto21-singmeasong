import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database.js';

function createRecommendation() {

    return {
        name: faker.name.firstName(),
        youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
    }
};

async function insertRecommendationInDatabase(recommendation: any) {

    console.log(recommendation)

    const result = await prisma.recommendation.create({
        data: recommendation
    });

    return result;
};

async function getRecommendationsFromDatabase(name: string) {

    return await prisma.recommendation.findFirst({ where: { name } });
}

const recommendationsFactory = {
    createRecommendation,
    insertRecommendationInDatabase,
    getRecommendationsFromDatabase
};

export default recommendationsFactory;