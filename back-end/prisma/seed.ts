import { prisma } from '../src/database.js';

async function main() {

    const recommendations = [
        {
            name: 'teste',
            youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
            score: 0
        },
        {
            name: 'teste 2',
            youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
            score: 0
        },
        {
            name: 'teste 3',
            youtubeLink: 'https://www.youtube.com/watch?v=soDZBW-1P04&list=RDsoDZBW-1P04&index=2',
            score: 0
        },
    ]

    await prisma.recommendation.createMany({ data: recommendations });
}

main().catch((e) => {
    console.log(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});