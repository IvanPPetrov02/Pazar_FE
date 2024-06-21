describe('Home Page Tests with Authentication', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');

        cy.fixture('registerUser').then((registerUser) => {
            cy.intercept('POST', '/api/User/login', {
                statusCode: 200,
                body: { token: 'fake-jwt-token' }
            }).as('loginUser');
        });

        cy.get('[data-testid=email]').type('user@example.com');
        cy.get('[data-testid=password]').type('string');
        cy.get('[data-testid=login-button]').click();

        cy.wait('@loginUser').its('response.statusCode').should('eq', 200);
        cy.url().should('eq', 'http://localhost:5173/');
    });

    it('should display all elements and fetch data correctly when authenticated', () => {
        cy.intercept('GET', '/api/Category/GetCategories', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' }
            ]
        }).as('getCategories');

        cy.intercept('GET', '/api/Category/GetRandomSubCategories', {
            statusCode: 200,
            body: [
                { id: 1, name: 'SubCategory 1' },
                { id: 2, name: 'SubCategory 2' }
            ]
        }).as('getRandomSubCategories');

        cy.intercept('GET', '/api/Item/filtered', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Item 1', price: 100, condition: 3, bidOnly: false },
                { id: 2, name: 'Item 2', price: null, condition: 1, bidOnly: true }
            ]
        }).as('getItems');

        cy.intercept('GET', '/api/chat', {
            statusCode: 200,
            body: [
                { id: 1, itemSoldId: 1, buyerId: 'buyer1' },
                { id: 2, itemSoldId: 2, buyerId: 'buyer2' }
            ]
        }).as('getChats');

        cy.intercept('GET', '/api/User/GetUser', {
            statusCode: 200,
            body: { id: 'user1', name: 'User', surname: 'Example' }
        }).as('getUser');

        cy.reload();

        cy.wait('@getCategories').its('response.statusCode').should('eq', 200);
        cy.get('.filter-sidebar').should('be.visible');

        cy.wait('@getRandomSubCategories').its('response.statusCode').should('eq', 200);
        cy.get('.suggestions').should('be.visible');

        cy.wait('@getItems').its('response.statusCode').should('eq', 200);
        cy.get('.items-list').should('be.visible');

        cy.wait('@getUser').its('response.statusCode').should('eq', 200);
        cy.wait('@getChats').its('response.statusCode').should('eq', 200);
        cy.get('h3').contains('Chats:').should('be.visible');
    });
});

describe('Home Page Tests without Authentication', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });

    it('should display all elements and show message for chat when not authenticated', () => {
        cy.intercept('GET', '/api/Category/GetCategories', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' }
            ]
        }).as('getCategories');

        cy.intercept('GET', '/api/Category/GetRandomSubCategories', {
            statusCode: 200,
            body: [
                { id: 1, name: 'SubCategory 1' },
                { id: 2, name: 'SubCategory 2' }
            ]
        }).as('getRandomSubCategories');

        cy.intercept('GET', '/api/Item/filtered', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Item 1', price: 100, condition: 3, bidOnly: false },
                { id: 2, name: 'Item 2', price: null, condition: 1, bidOnly: true }
            ]
        }).as('getItems');

        cy.reload();

        cy.wait('@getCategories').its('response.statusCode').should('eq', 200);
        cy.get('.filter-sidebar').should('be.visible');

        cy.wait('@getRandomSubCategories').its('response.statusCode').should('eq', 200);
        cy.get('.suggestions').should('be.visible');

        cy.wait('@getItems').its('response.statusCode').should('eq', 200);
        cy.get('.items-list').should('be.visible');

        cy.get('p').contains('Chat is available for logged-in users only.').should('be.visible');
    });
});
