import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";
import axios from "axios";
import React from "react";

const title = "React";
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const welcome = { title: "React", greeting: "Hey" };

interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectId: number;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface ItemProps {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
}

const Item: React.FC<ItemProps & { handleRemove(): void }> = ({
  url,
  title,
  author,
  num_comments,
  points,
  handleRemove,
}) => (
  <li style={{ textAlign: "left" }}>
    <span>
      {" "}
      <a href={url}>{title} </a> {" - "}
    </span>
    <span>
      author: {author}
      {" - "}
    </span>
    <span>
      comments: {num_comments}
      {" - "}
    </span>
    <span>
      points: {points}
      {" - "}
    </span>
    <button onClick={handleRemove}>{"Remove"}</button>
  </li>
);

type ListItem = ItemProps & { objectId: number };
interface ListProps {
  list: Array<ListItem>;
  setList: any;
}

const List: React.FC<ListProps> = ({ list, setList }) => {
  console.log("rendering List");

  const handleRemove = (objectId: number) => {
    setList({ type: "REMOVE_STORY", payload: { objectId } });
  };

  return (
    <ul style={{ marginBottom: "20px" }}>
      {list.map(({ objectId, ...item }) => (
        <Item
          key={objectId}
          handleRemove={() => handleRemove(objectId)}
          {...item}
        />
      ))}
    </ul>
  );
};

interface InputWithLabelProps {
  children?: React.ReactNode;
  onInputChange(event: InputEvent): void;
  value: string;
  id: string;
  type?: string;
  isFocused?: boolean;
}

class InputWithLabel extends React.Component<InputWithLabelProps> {
  render() {
    const { id, value, type = "text", onInputChange, children } = this.props;

    return (
      <>
        <label htmlFor={id}>{children}: </label>
        <input value={value} id={id} type={type} onChange={onInputChange} />
      </>
    );
  }
}

const useStorageState = (key: string, initialState: string) => {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, searchTerm);
  }, [searchTerm, key]);

  return { searchTerm, setSearchTerm };
};

enum Action {
  SET_STORIES = "SET_STORIES",
  REMOVE_STORY = "REMOVE_STORY",
  STORIES_FETCH_INIT = "STORIES_FETCH_INIT",
  STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS",
  STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE",
}

type StoriesInitAction = {
  type: Action.STORIES_FETCH_INIT;
};

type StoriesSuccessAction = {
  type: Action.STORIES_FETCH_SUCCESS;
  payload: Array<Story>;
};

type StoriesFialureAction = {
  type: Action.STORIES_FETCH_FAILURE;
};

type StoriesSetAction = {
  type: Action.SET_STORIES;
  payload: Array<Story>;
};

type StoriesRemoveAction = {
  type: Action.REMOVE_STORY;
  payload: Story;
};

type StoriesAction =
  | StoriesSetAction
  | StoriesRemoveAction
  | StoriesInitAction
  | StoriesSuccessAction
  | StoriesFialureAction;

interface StoryState {
  data: Array<Story>;
  isLoading: boolean;
  isError: boolean;
}

type StoryReducer = (state: StoryState, action: StoriesAction) => StoryState;

const storiesReducer: StoryReducer = (
  state: StoryState,
  action: StoriesAction
) => {
  switch (action.type) {
    case Action.STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case Action.STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case Action.STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case Action.SET_STORIES:
      return { ...state, data: action.payload };
    case Action.REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectId !== action.payload.objectId
        ),
      };
    default:
      throw new Error();
  }
};

interface SearchFormProps {
  searchTerm: string;
  handleSearchInput(event: React.ChangeEvent<HTMLInputElement>): void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  handleSearchInput,
}) => {
  return (
    <form onSubmit={() => undefined}>
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

interface AppState {
  searchTerm: string;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      searchTerm: "React",
    };
  }

  render() {
    const { searchTerm } = this.state;

    return (
      <>
        <h1> My Hacker Stories</h1>
        <SearchForm
          searchTerm={searchTerm}
          handleSearchInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            this.setState({ searchTerm: event?.target.value })
          }
        />
      </>
    );
  }
}

export default App;
