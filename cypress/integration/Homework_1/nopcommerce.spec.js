/// <reference types="cypress" />

const date = new Date();

describe('Registration and Login', () => {
    it('Register by filling all fields', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="gender-male"]').check('M')
        cy.get('[id="FirstName"]').type("Tom")
        cy.get('[id="LastName"]').type("Smith")
        cy.get('[name="DateOfBirthDay"]').select('12')
        cy.get('[name="DateOfBirthMonth"]').select('June')
        cy.get('[name="DateOfBirthYear"]').select('2000')
        cy.get('[id="Email"]').type(`test${date.getTime()}@gmail.com`)
        cy.get('[id="Company"]').type("Something")
        cy.get('[id="Password"]').type("Test.2022")
        cy.get('[id="ConfirmPassword"]').type("Test.2022")
        cy.get('[id="register-button"]').click()
        cy.get('[class="result"]').should('have.text', 'Your registration completed')
    });

    it('Registered user cannot register again', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="gender-male"]').click()
        cy.get('[id="FirstName"]').type("To")
        cy.get('[id="LastName"]').type("Smth")
        cy.get('[name="DateOfBirthDay"]').select('12')
        cy.get('[name="DateOfBirthMonth"]').select('June')
        cy.get('[name="DateOfBirthYear"]').select('2000')
        cy.get('[id="Email"]').type(`test${date.getTime()}@gmail.com`)
        cy.get('[id="Company"]').type("Something")
        cy.get('[id="Password"]').type("Test.2022")
        cy.get('[id="ConfirmPassword"]').type("Test.2022")
        cy.get('[id="register-button"]').click()
        cy.get('[class="message-error validation-summary-errors"]')
          .should('include.text', 'The specified email already exists')
    });

    it('Register by filling only required fields', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="FirstName"]').type("Sarah")
        cy.get('[id="LastName"]').type("Baker")
        cy.get('[id="Email"]').type(`test.${date.getTime()}@gmail.com`)
        cy.get('[id="Password"]').type("Test.2022")
        cy.get('[id="ConfirmPassword"]').type("Test.2022")
        cy.get('[id="register-button"]').click()
        cy.get('[class="result"]').should('have.text', 'Your registration completed')
    });

    it('Register by not filling any data', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="Newsletter"]').uncheck()
        cy.get('[id="register-button"]').click()
        cy.get('[id="FirstName-error"]').should('contain', 'First name is required.')
        cy.get('[id="LastName-error"]').should('contain', 'Last name is required.')
        cy.get('[id="Email-error"]').should('contain', 'Email is required.')
        cy.get('[id="Password-error"]').should('contain', 'Password is required.')
        cy.get('[id="ConfirmPassword-error"]').should('have.text', 'Password is required.')
    });

    it('Email validation', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        let emails = [
            `test${date.getTime()}@gmail..com`,
            `test${date.getTime()}@gmail.`,
            `test${date.getTime()}@.com`,
            `test${date.getTime()}@`, 
            `test${date.getTime()}@gmail`,
            `test${date.getTime()}gmail.com`,
        ]
            
        emails.forEach((email) => {
            cy.get('[id="Email"]').type(email)
            cy.get('[id="register-button"]').click()
            cy.get('[id="Email-error"]').should('have.text','Wrong email')
            cy.get('[id="Email"]').clear()
        })
    });

    it('Password length limit validation', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="Password"]').type("Test2")
        cy.get('[id="ConfirmPassword"]').type("Test2")
        cy.get('[id="register-button"]').click()
        cy.get('[id="Password-error"]').should('include.text', 'must have at least 6 characters')
    });

    it('Passing different passwords', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="Password"]').type("Test.1")
        cy.get('[id="ConfirmPassword"]').type("Test.2")
        cy.get('[id="register-button"]').click()
        cy.get('[id="ConfirmPassword-error"]')
          .should('have.text', 'The password and confirmation password do not match.')
    });

    it('Not passing confirmation password', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-register"]').click()
        cy.get('[id="Password"]').type("Test.1")
        cy.get('[id="register-button"]').click()
        cy.get('[id="ConfirmPassword-error"]').should('have.text', 'Password is required.')
    });

    it('Log in with registered email', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-login"]').click()
        cy.get('[id="Email"]').type(`test${date.getTime()}@gmail.com`)
        cy.get('[id="Password"]').type("Test.2022")
        cy.get('[class="button-1 login-button"]').click()
        cy.url().should('eq','https://demo.nopcommerce.com/')
    });


    it('Log in without filling any data', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-login"]').click()
        cy.get('[class="button-1 login-button"]').click()
        cy.get('[id="Email-error"]').should('contain','Please enter your email')
        cy.url().should('eq','https://demo.nopcommerce.com/login?returnUrl=%2F')
    });

    it('Log in only passing email', () => {
        cy.visit('https://demo.nopcommerce.com/')
        cy.get('[class="ico-login"]').click()
        cy.get('[id="Email"]').type(`test${date.getTime()}@gmail.com`)
        cy.get('[class="button-1 login-button"]').click()
        cy.get('[class="message-error validation-summary-errors"]').should('contain','Login was unsuccessful.')
        cy.url().should('eq','https://demo.nopcommerce.com/login?returnurl=%2F')
    });
})
