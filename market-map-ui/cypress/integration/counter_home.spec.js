/* eslint-disable no-undef */
describe('Counter Home Page Test', () => {
  it('Increments the Counter', () => {
    const countLabel = 'h1[data-qa=count-wrapper]';
    cy.visit('/');
    cy.get(countLabel).should('contain', '15');
    cy.get('button[data-qa=increment-button]').click();
    cy.get(countLabel).should('contain', '16');
  });
});
