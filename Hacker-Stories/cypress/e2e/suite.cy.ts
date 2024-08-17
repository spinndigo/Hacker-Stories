const searchInput = "search-input";
const searchSubmit = "search-submit";
const hits = "hits-list";
const listHit = (id: string) => `hit-${id}`;
const removelistItem = (id: string) => `remove-${id}`;

describe("App Functions", () => {
  it("opens the homepage", () => {
    cy.visit("/");
  });

  // it("returns no results for bad search", () => {
  //   cy.visit("https://example.cypress.io");
  // });
});
