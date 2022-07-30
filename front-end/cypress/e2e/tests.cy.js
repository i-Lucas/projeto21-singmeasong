/// <reference types="cypress" />

import recommendationFactory from './factory/recommendation';

beforeEach(() => cy.clearAll());

describe("create a new recommendation tests", () => {

    it("create recommendation", () => {

        const recommendation = recommendationFactory.generateRecommendation("narayana");
        cy.createRecommendation(recommendation);
        cy.contains(`${recommendation.name}`).should("be.visible");
    });

    it("error invalid url", () => {

        const recommendation = recommendationFactory.generateRecommendation("brahma");
        cy.createRecommendation({ ...recommendation, youtubeLink: "www.google.com.br" });
        cy.on("window:alert", (text) => expect(text).to.contains("Error creating recommendation!"));
    });
});

describe("get top recommendations", () => {

    it("show top recommendations", () => {

        const recommendation = recommendationFactory.generateRecommendation("vedas");
        cy.createRecommendation(recommendation);

        cy.contains("Top").click();
        cy.contains(`${recommendation.name}`).should("be.visible");
    });
});

describe("get random recommendation", () => {

    it("show random recommendations", () => {
        const recommendation = recommendationFactory.generateRecommendation("narayana");
        cy.createRecommendation(recommendation);

        cy.contains("Random").click();
        cy.contains(`${recommendation.name}`).should("be.visible");
    });
});

describe("vote recommendation tests", () => {

    it("upvote recommendation", () => {

        const recommendation = recommendationFactory.generateRecommendation("shiva");
        cy.createRecommendation(recommendation);
        cy.get("#upvote").click();
        cy.get("#score").should("contain.text", "1");
    });

    it("downvote recommendation", () => {

        const recommendation = recommendationFactory.generateRecommendation("deva");
        cy.createRecommendation(recommendation);
        cy.get("#dowvote").click();
        cy.get("#score").should("contain.text", "-1");
    });

    it("delete recommendation when score bellow -5", () => {

        const recommendation = recommendationFactory.generateRecommendation("rajneesh");
        cy.createRecommendation(recommendation);

        cy.get("#dowvote").click();
        cy.get("#dowvote").click();
        cy.get("#dowvote").click();
        cy.get("#dowvote").click();
        cy.get("#dowvote").click();
        cy.get("#dowvote").click();

        cy.contains(`No recommendations yet! Create your own :)`).should("be.visible");
    });
});