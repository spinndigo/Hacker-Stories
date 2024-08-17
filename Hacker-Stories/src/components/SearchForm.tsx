import { InputWithLabel } from "./InputWithLabel";

interface Props {
  searchTerm: string;
  handleSearchInput(event: React.ChangeEvent<HTMLInputElement>): void;
  handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): void;
}

export const SearchForm: React.FC<Props> = ({
  searchTerm,
  handleSearchInput,
  handleSearchSubmit,
}) => {
  return (
    <form onSubmit={handleSearchSubmit}>
      <InputWithLabel
        isFocused
        testId="search-input"
        value={searchTerm}
        onInputChange={handleSearchInput}
        id={"search"}
      >
        <strong> {"Search Term"} </strong>
      </InputWithLabel>
      <button data-testid="search-submit" type="submit" disabled={!searchTerm}>
        Submit
      </button>
    </form>
  );
};
