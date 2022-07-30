function generateRecommendation(name = 'default') {
    return {
        name,
        youtubeLink: "https://www.youtube.com/watch?v=--Wwajqfou0",
    };
};

const recommendationFactory = {
    generateRecommendation,
};

export default recommendationFactory;