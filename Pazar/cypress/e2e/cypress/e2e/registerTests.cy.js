describe('Auth Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
    });

    context('Registration Tests', () => {
        it('should register a new user successfully', () => {
            cy.fixture('registerUser').then((registerUser) => {
                cy.intercept('POST', '/api/User/register', {
                    statusCode: 200,
                    body: { message: 'User created' }
                }).as('registerUser');

                cy.get('[data-testid="name-input"]').type(registerUser.name);
                cy.get('[data-testid="surname-input"]').type(registerUser.surname);
                cy.get('[data-testid="email-input"]').type(registerUser.email);
                cy.get('[data-testid="password-input"]').type(registerUser.password);
                cy.get('[data-testid="submit-button"]').click();

                cy.wait('@registerUser').its('response.statusCode').should('eq', 200);
                cy.on('window:alert', (str) => {
                    expect(str).to.equal('Registration successful! Please log in.');
                });
                cy.url().should('eq', 'http://localhost:5173/login');
            });
        });

        it('should show an error for already registered email', () => {
            cy.fixture('registerUser').then((registerUser) => {
                cy.intercept('POST', '/api/User/register', {
                    statusCode: 400,
                    body: { message: 'Email already in use' }
                }).as('registerUser');

                cy.get('[data-testid="name-input"]').type(registerUser.name);
                cy.get('[data-testid="surname-input"]').type(registerUser.surname);
                cy.get('[data-testid="email-input"]').type('existinguser@example.com');
                cy.get('[data-testid="password-input"]').type(registerUser.password);
                cy.get('[data-testid="submit-button"]').click();

                cy.wait('@registerUser').its('response.statusCode').should('eq', 400);
                cy.get('[data-testid="error-message"]').should('be.visible').and('contain', 'Email already in use');
            });
        });

        it('should show validation errors for missing required fields', () => {
            cy.get('[data-testid="submit-button"]').click();
            cy.get('[data-testid="error-message"]').should('be.visible').and('contain', 'All fields are required.');
        });

        it('should show error for weak password', () => {
            cy.fixture('registerUser').then((registerUser) => {
                cy.intercept('POST', '/api/User/register', {
                    statusCode: 400,
                    body: { message: 'Password is too weak' }
                }).as('registerUser');

                cy.get('[data-testid="name-input"]').type(registerUser.name);
                cy.get('[data-testid="surname-input"]').type(registerUser.surname);
                cy.get('[data-testid="email-input"]').type(registerUser.email);
                cy.get('[data-testid="password-input"]').type('123');
                cy.get('[data-testid="submit-button"]').click();

                cy.wait('@registerUser').its('response.statusCode').should('eq', 400);
                cy.get('[data-testid="error-message"]').should('be.visible').and('contain', 'Password is too weak');
            });
        });

        it('should show error for server issues', () => {
            cy.fixture('registerUser').then((registerUser) => {
                cy.intercept('POST', '/api/User/register', {
                    statusCode: 500,
                    body: { message: 'Internal Server Error' }
                }).as('registerUser');

                cy.get('[data-testid="name-input"]').type(registerUser.name);
                cy.get('[data-testid="surname-input"]').type(registerUser.surname);
                cy.get('[data-testid="email-input"]').type(registerUser.email);
                cy.get('[data-testid="password-input"]').type(registerUser.password);
                cy.get('[data-testid="submit-button"]').click();

                cy.wait('@registerUser').its('response.statusCode').should('eq', 500);
                cy.get('[data-testid="error-message"]').should('be.visible').and('contain', 'Internal Server Error');
            });
        });
    });
});
