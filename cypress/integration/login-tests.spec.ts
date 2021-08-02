import users from '../../cypress/fixtures/users.json';
// const user = users.validUser;

describe(`Login Page Tests:`, () => {
    const baseUrl = Cypress.config().baseUrl as string;

    beforeEach(function () {
        cy.visit(baseUrl);
        cy.clearCookies();
    })

    it('Verify that correct URL is shown.', () => {
        cy.url().should('eq', Cypress.config('baseUrl'))
    });

    it("Verify that elements are visible on login page.", () => {
        const text = 'This is where you can log into the secure area. Enter tomsmith for the username and SuperSecretPassword! for the password. If the information is wrong you should see error messages.'
        cy.get('h2').should('contain', 'Login Page');
        cy.get('h4').should('contain', text);
        cy.get('#login label').should('contain', 'Username');
        cy.get('#username').should('be.visible');
        cy.get('#login label').should('contain', 'Password');
        cy.get('#password').should('be.visible');
        cy.get('button i').contains('Login').should('be.visible');
    });

    it("Verify that user can login to site successfully.", () => {
        cy.get('#username').type(Cypress.env('username1'));
        cy.get('#password').type(Cypress.env('password1'));
        cy.get('button i').contains('Login').click();
        verifyAlertMessages('You logged into a secure area!');
    });

    it("Verify that user can login to site successfully using Enter key.", () => {
        cy.get('#username').type(Cypress.env('username1'));
        cy.get('#password').type(Cypress.env('password1') +'{downarrow}{enter}');
        verifyAlertMessages('You logged into a secure area!');
    });

    it("Verify that user can log out of site.", () => {
        cy.login();
        //cy.get('.icon-signout').click(); 
        cy.get('a > i').contains('Logout').click();
        verifyAlertMessages('You logged out of the secure area!');
    });

    it("Verify that user can close alert message.", () => {
        cy.login();
        cy.get('a > i').contains('Logout').click();
        verifyAlertMessages('You logged out of the secure area!');
        cy.get('#flash-messages div .close').click().wait(1000);

        cy.get("body").then($body => { // if alert message displays  
            if ($body.find(`#flash-messages div`).length > 0) {
                cy.log('This message should only log if test fails.');
                cy.get('#flash-messages div').should('not.be.visible');
            }
        });
    });

    it("Verify that user cannot enter an invalid username.", () => {
        cy.login('username', 'password');
        verifyAlertMessages('Your username is invalid!');
    });

    it("Verify that user cannot enter an invalid password.", () => {
        cy.login('tomsmith', 'password');
        verifyAlertMessages('Your password is invalid!');
    });

    it("Verify that user gets error message for empty username.", () => {
        cy.login(' ', 'password');
        verifyAlertMessages('Your username is invalid!');
    });

    it("Verify that user gets error message for empty password.", () => {
        cy.login('tomsmith', ' ');
        verifyAlertMessages('Your password is invalid!');
    });

    it("Verify that password field is masked.", () => {
        cy.get('#password')
            .should('have.attr', 'type')
            .and('equal', 'password')
    });

    it("Verify that password field is case-sensitive", () => {
        cy.login(Cypress.env('username1'), Cypress.env('password1').toUpperCase());
        verifyAlertMessages('Your password is invalid!');
    });

    it("Verify Tab and Shift+Tab scrolls through fields properly.", () => {
        cy.get(`#username`).clear().tab();
        cy.get('#password').should('have.focus');

        cy.get('#password').tab({ shift: true });
        cy.get(`#username`).should('have.focus');
    });

    it.skip('Verify that login page UI is displayed correctly', () => {
        // Check screenshot manually in screenshots folder
        cy.screenshot();
    })

    it.skip("Verify that user cannot enter more than 20 chars for username.", () => {
        cy.get('#username').type('123456789012345678901');
        // Would add assertion here for username requirements
    });

    it.skip("Verify that user cannot enter more than 20 chars for password.", () => {
        cy.get('#password').type('123456789012345678901');
        // Would add assertion here for password requirements
    });

    // Would also add Forgot Username/Password, reset via email tests, min/max length, and special character verification. 
});

function verifyAlertMessages(message: string) {
    cy.get('#flash-messages div').contains(`${message}`).should('be.visible');
}