const searchInput = "search-input";
const searchSubmit = "search-submit";
const hits = "hits-list";
const listHit = (id: string) => `hit-${id}`;
const removelistItem = (id: string) => `remove-${id}`;

describe("Connection to api", () => {
  it("returns results when searching for graphql", () => {
    cy.visit("https://example.cypress.io");
  });

  it("returns no results for bad search", () => {
    cy.visit("https://example.cypress.io");
  });
});
