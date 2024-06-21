describe('Item Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
    });

    const loginUser = (email, password, interceptAlias) => {
        cy.fixture('registerUser').then((registerUser) => {
            cy.intercept('POST', '/api/User/login', {
                statusCode: 200,
                body: { token: 'fake-jwt-token' }
            }).as(interceptAlias);

            cy.get('[data-testid=email]').type(email);
            cy.get('[data-testid=password]').type(password);
            cy.get('[data-testid=login-button]').click();

            cy.wait(`@${interceptAlias}`).its('response.statusCode').should('eq', 200);
            cy.url().should('eq', 'http://localhost:5173/');
        });
    };

    const interceptItemDetails = (itemData, statusCode = 200) => {
        cy.intercept('GET', '/api/Item/7', {
            statusCode: statusCode,
            body: itemData
        }).as('getItem');
    };

    const interceptIsSeller = (isSeller, statusCode = 200) => {
        cy.intercept('GET', '/api/Item/7/isseller', {
            statusCode: statusCode,
            body: { isSeller: isSeller }
        }).as('checkSeller');
    };

    const interceptBids = (bids, statusCode = 200) => {
        cy.intercept('GET', '/ws/ItemBidding/bids/7', {
            statusCode: statusCode,
            body: bids
        }).as('getBids');
    };

    const visitItemPage = () => {
        cy.visit('http://localhost:5173/item/7');
        cy.wait('@getItem').its('response.statusCode').should('eq', 200);
        cy.wait('@checkSeller').its('response.statusCode').should('eq', 200);
        cy.wait('@getBids').its('response.statusCode').should('eq', 200);
    };

    it('should display item details correctly for a logged-out user and redirect to login on bid and message attempts', () => {
        cy.fixture('items').then((items) => {
            interceptItemDetails(items[0]);
        });
        interceptIsSeller(false);
        interceptBids([]);

        visitItemPage();

        cy.get('h2').should('contain', 'dfasdfasdf');
        cy.get('.card-body').should('contain', 'Like New');
        cy.get('.card-body').should('contain', 'adsfasddfasdf');
        cy.get('.card-body').should('contain', 'user2 user2');

        // Attempt to place a bid
        cy.get('input[type="number"]').type('70');
        cy.get('button').contains('Place Bid').click();
        cy.url().should('include', '/login');

        // Attempt to send a message
        cy.visit('http://localhost:5173/item/7'); // Revisit the item page
        cy.get('input[type="text"]').type('Hello, is this item still available?');
        cy.get('button').contains('Send Message').click();
        cy.url().should('include', '/login');
    });

    it('should display item details and options correctly for the item seller', () => {
        loginUser('user@user2.com', 'sellerpassword', 'loginSeller');

        cy.fixture('items').then((items) => {
            interceptItemDetails(items[0]);
        });
        interceptIsSeller(true);
        interceptBids([]);

        visitItemPage();

        cy.get('h2').should('contain', 'dfasdfasdf');
        cy.get('.card-body').should('contain', 'Like New');
        cy.get('.card-body').should('contain', 'adsfasddfasdf');
        cy.get('.card-body').should('contain', 'user2 user2');
        cy.get('button').contains('Edit Offer').should('be.visible');
        cy.get('button').contains('Remove Offer').should('be.visible');
    });

    it('should display item details and options correctly for a logged-in user who is not the item seller', () => {
        loginUser('buyer@example.com', 'buyerpassword', 'loginBuyer');

        cy.fixture('items').then((items) => {
            interceptItemDetails(items[0]);
        });
        interceptIsSeller(false);
        cy.fixture('bids').then((bids) => {
            interceptBids(bids);
        });

        visitItemPage();

        cy.get('h2').should('contain', 'dfasdfasdf');
        cy.get('.card-body').should('contain', 'Like New');
        cy.get('.card-body').should('contain', 'adsfasddfasdf');
        cy.get('.card-body').should('contain', 'user2 user2');
        cy.get('.list-group-item').should('contain', 'Buyer One: €50');
        cy.get('.list-group-item').should('contain', 'Buyer Two: €60');
        cy.get('button').contains('Place Bid').should('be.visible');

        // Attempt to place a lower bid
        cy.intercept('POST', '/ws/ItemBidding/newbid', {
            statusCode: 400,
            body: { Message: 'Bid too low' }
        }).as('placeBidLow');

        cy.get('input[type="number"]').type('30');
        cy.get('button').contains('Place Bid').click();
        cy.wait('@placeBidLow').its('response.statusCode').should('eq', 400);
        cy.get('.alert-danger').should('contain', 'Bid too low');
    });

});
