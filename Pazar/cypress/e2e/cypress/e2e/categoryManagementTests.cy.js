describe('Category Management Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
    });

    const setLocalStorage = (key, value) => {
        cy.window().then((win) => {
            win.localStorage.setItem(key, value);
        });
    };

    const mockAdminJwtToken = () => {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwOGRjOGM2ZC00YWE2LTQ4MGMtODhkNy1mNjA3M2U0NTVkNDYiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MTkwMDU5MDEsImV4cCI6MTcxOTA5MjMwMSwiaWF0IjoxNzE5MDA1OTAxfQ.Rf7GzK3cSh5V0N3yBJzRGB9y0c2dZTec_qnOvDqFWOU';
    };

    const loginUser = (email, password, interceptAlias) => {
        cy.intercept('POST', '/api/User/login', {
            statusCode: 200,
            body: { token: mockAdminJwtToken() }
        }).as(interceptAlias);

        cy.get('[data-testid=email]').type(email);
        cy.get('[data-testid=password]').type(password);
        cy.get('[data-testid=login-button]').click();

        cy.wait(`@${interceptAlias}`).its('response.statusCode').should('eq', 200);
        cy.window().then((win) => {
            const userInfo = {
                role: 1,
                isActive: true
            };
            win.localStorage.setItem('userInfo', JSON.stringify(userInfo));
            win.localStorage.setItem('token', mockAdminJwtToken());
        });
    };

    const findCategoryByName = (name) => {
        return cy.get('[data-testid=category-list] li')
            .contains(name)
            .parents('li')
            .invoke('attr', 'data-testid')
            .then((testId) => {
                return testId.split('-')[1];
            });
    };

    it('should redirect to login when a logged-out user attempts to access category management', () => {
        cy.visit('http://localhost:5173/category-management');
        cy.url().should('include', '/login');
    });

    it('should deny access to category management for a logged-in non-admin user and redirect to home page', () => {
        loginUser('nonadmin@example.com', 'userpassword', 'loginNonAdmin');

        cy.visit('http://localhost:5173');
        cy.window().then((win) => {
            const userInfo = {
                role: 0,
                isActive: true
            };
            win.localStorage.setItem('userInfo', JSON.stringify(userInfo));
            win.localStorage.setItem('token', 'fake-non-admin-token');
        });

        cy.visit('http://localhost:5173/category-management');
        cy.url().should('eq', 'http://localhost:5173/');
    });

    it('should allow access to category management for an admin user and perform CRUD operations', () => {
        // Start from the home page
        cy.visit('http://localhost:5173');

        // Click on the login button to go to the login page
        cy.get('[data-testid=login-button]').click();
        cy.url().should('include', '/login');

        // Log in as an admin user
        loginUser('user@example.com', 'adminpassword', 'loginAdmin');

        // Reload the page to apply localStorage changes
        cy.reload();

        // After login, ensure we're back on the home page
        cy.url().should('eq', 'http://localhost:5173/');

        // Check if the category management button is present in the navbar
        cy.get('[data-testid=category-management-button]').should('be.visible').click();

        // Intercept the initial GET request to fetch categories
        cy.intercept('GET', '/api/Category/GetAllCategoriesWithSubcategories').as('getCategories');

        // Verify that the user is redirected to the category management page
        cy.url().should('include', '/category-management');
        cy.get('[data-testid=category-management-page]').should('be.visible');

        // Intercept POST request to create a new parent category
        cy.intercept('POST', '/api/Category').as('createCategory');

        // Create a new parent category
        cy.get('[data-testid=category-name-input]').clear().type('New Category');
        cy.get('[data-testid=submit-button]').click();
        cy.wait('@createCategory').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
        });

        // Reload the page to fetch the updated categories
        cy.reload();
        cy.wait('@getCategories').its('response.statusCode').should('eq', 200);

        // Verify the new category appears in the list
        cy.get('[data-testid=category-list]').should('contain', 'New Category');

        // Intercept POST request to create a new subcategory
        cy.intercept('POST', '/api/Category').as('createSubCategory');

        // Create a new subcategory
        cy.get('[data-testid=category-name-input]').clear().type('New Subcategory');
        cy.get('[data-testid=is-subcategory-checkbox]').check();
        cy.get('[data-testid=parent-category-select]').select('New Category');
        cy.get('[data-testid=submit-button]').click();
        cy.wait('@createSubCategory').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
        });

        // Reload the page to fetch the updated categories
        cy.reload();
        cy.wait('@getCategories').its('response.statusCode').should('eq', 200);

        // Verify the new subcategory appears in the list
        cy.get('[data-testid=category-list] [data-testid^=expand-category-]').each($el => {
            cy.wrap($el).click();
        });

        cy.reload();

        cy.get('[data-testid=category-list]').should('contain', 'New Subcategory');

        // Intercept PUT request to update a category
        cy.intercept('PUT', '/api/Category/**').as('updateCategory');

        // Find the category by name and get its test ID
        findCategoryByName('New Category').then((categoryId) => {
            // Edit the category
            cy.get(`[data-testid=edit-category-${categoryId}]`).click();
            cy.get('[data-testid=category-name-input]').should('have.value', 'New Category');
            cy.get('[data-testid=category-name-input]').clear().type('Updated Category');
            cy.get('[data-testid=submit-button]').click();
            cy.wait('@updateCategory').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            });

            // Reload the page to fetch the updated categories
            cy.reload();
            cy.wait('@getCategories').its('response.statusCode').should('eq', 200);

            // Verify the updated category appears in the list
            cy.get('[data-testid=category-list]').should('contain', 'Updated Category');
        });

        // Intercept DELETE request to delete a category
        cy.intercept('DELETE', '/api/Category/**').as('deleteCategory');

        // Find the subcategory by name and get its test ID
        findCategoryByName('Updated Category').then((subCategoryId) => {
            // Delete the subcategory
            cy.get(`[data-testid=delete-category-${subCategoryId}]`).click();
            cy.on('window:confirm', () => true); // Confirm the deletion
            cy.wait('@deleteCategory').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            });

            // Reload the page to fetch the updated categories
            cy.reload();
            cy.wait('@getCategories').its('response.statusCode').should('eq', 200);

            // Verify the deleted subcategory is no longer in the list
            cy.get('[data-testid=category-list]').should('not.contain', 'Updated Category');
        });
    });
});
