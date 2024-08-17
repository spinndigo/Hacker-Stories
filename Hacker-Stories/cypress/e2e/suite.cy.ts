const searchInput = "search-input";
const searchSubmit = "search-submit";
const hits = "hits-list";
const listHit = (id: string) => `hit-${id}`;
const removelistItem = (id: string) => `remove-${id}`;

describe("App Functions", () => {
  beforeEach(() => {
    cy.visit("/"); // effectively test that the site is reachable
  });

  it("search for Graphql and get results", () => {
    cy.get(searchInput).type("graphql");
    cy.get(searchSubmit).click();
    cy.get(listHit("0")).should("exist");
  });

  it("returns no results for bad search", () => {
    cy.get(searchInput).type("blah blah blah");
    cy.get(searchSubmit).click();
    cy.get(listHit("0")).should("not.exist");
  });
});
