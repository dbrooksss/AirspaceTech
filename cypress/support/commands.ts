declare namespace Cypress {
    interface Chainable {
        login(username?: string, password?: string): void;
    }
}

// if username & password are not passed in, then use the valid login credentials.
Cypress.Commands.add('login', (username?, password?) => {
    if (username == null && password == null) {
        username = Cypress.env('username1');
        password = Cypress.env('password1');
    }

    cy.get('#username').type(username);
    cy.get('#password').type(password, { log: false });
    cy.get('button i').contains('Login').click({ force: true });
});