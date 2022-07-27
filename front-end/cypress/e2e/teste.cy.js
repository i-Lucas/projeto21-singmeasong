/// <reference types="cypress" />

import { faker } from '@faker-js/faker';


describe('Teste', () => {

    it('deve cadastrar um novo recommendation lá no beckend', () => {

        const data = {
            name: faker.name.firstName(),
            youtubeLink: 'https://www.youtube.com/watch?v=bLdEypr2e-8'
        }

        cy.visit('http://localhost:3000/');

        cy.get("#inputName").type(data.name);
        cy.get("#inputUrl").type(data.youtubeLink);
        cy.get("#ButtonCreate").click();

        //cy.url().should("equal", "http://localhost:/3000/");

        

    });

});