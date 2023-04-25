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
        value={searchTerm}
        onInputChange={handleSearchInput}
        id={"search"}
      >
        <strong> {"Search Term"} </strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm}>
        Submit
      </button>
    </form>
  );
};
