import { jest } from '@jest/globals';

import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import recommendationsFactory from '../integration/recommendationsFactory/recommendations.js';

//jest.mock('../../src/services/recommendationsService.js');

describe("create recommendation test", () => {

    it("create a new recommendation", async () => {

        const recommendation = recommendationsFactory.createRecommendation();

        jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(null);
        jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

        await recommendationService.insert(recommendation);
        expect(recommendationRepository.create).toBeCalledTimes(1);
    });

    it('error if the recommendation already exists', async () => {

        const recommendation = recommendationsFactory.createRecommendation();

        jest.spyOn(recommendationRepository, "findByName")
            .mockResolvedValueOnce({ id: 1, ...recommendation, score: 0 });

        expect(recommendationService.insert(recommendation)).rejects
            .toEqual({ message: "Recommendations names must be unique", type: "conflict" });
    });
});

describe("upvote recommendation test", () => {

    it("upvote recommendation score", async () => {

        const factory = recommendationsFactory.createRecommendation();
        const recommendation = { id: 1, ...factory, score: 5 };

        jest.spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendation);

        jest.spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce({ id: 1, ...factory, score: 6 });

        await recommendationService.upvote(recommendation.id);
        expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    });

    it("upvote error doesn't exist", async () => {

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
        expect(recommendationService.upvote(100)).rejects.toEqual({ type: 'not_found', message: '' });
    });
});

describe("downvote recommendation tests", () => {

    it("downvote recommendation score", async () => {

        const factory = recommendationsFactory.createRecommendation();
        const recommendation = { id: 1, ...factory, score: 5 };

        jest.spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendation);

        jest.spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce({ id: 1, ...factory, score: 4 });

        recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    });

    it("delete recommendation if score bellow -5", async () => {

        const factory = recommendationsFactory.createRecommendation();
        const recommendation = { id: 1, ...factory, score: -5 };

        jest.spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendation);

        jest.spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce({ id: 1, ...factory, score: -6 });

        jest.spyOn(recommendationRepository, "remove")
            .mockResolvedValueOnce();

        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.remove).toBeCalledTimes(1);
    });

    it("downvote error doesn't exist", async () => {

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
        expect(recommendationService.upvote(100)).rejects.toEqual({ type: 'not_found', message: '' });
    });
});