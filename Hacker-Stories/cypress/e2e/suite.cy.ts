const searchInput = "[data-testid='search-input']";
const searchSubmit = "[data-testid='search-submit']";
const hits = "[data-testid='hits-list']";
const listHit = (id: string) => `[data-testid='hit-${id}']`;
const removelistItem = (id: string) => `[data-testid='remove-${id}']`;

describe("App Functions", () => {
  beforeEach(() => {
    cy.visit("/"); // effectively test that the site is reachable
  });

  it("search for Graphql and get results", () => {
    cy.get(searchInput).clear();
    cy.get(searchInput).type("graphql");
    cy.get(searchSubmit).click();
    cy.get(listHit("0")).should("exist");
  });

  it("returns no results for bad search", () => {
    cy.get(searchInput).clear();
    cy.get(searchInput).type("blah");
    cy.get(searchSubmit).click();
    cy.get(listHit("0")).should("not.exist");
  });
});
