describe('Login and Logout Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
    });

    it('should navigate to the home page after successful login and logout successfully', () => {
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
        cy.get('h3').should('contain', 'Chats:');  // Check for an element on the home page to confirm successful navigation

        // Now perform logout
        cy.intercept('POST', '/api/User/logout', {
            statusCode: 200
        }).as('logoutUser');

        cy.get('[data-testid=logout-button]').click();

        cy.wait('@logoutUser').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', 'http://localhost:5173/'); // Confirm it redirects to the home page after logout
    });
});
