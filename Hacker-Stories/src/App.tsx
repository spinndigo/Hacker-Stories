import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";
import { ReactComponent as Check } from "./assets/icon_done.svg";
import axios from "axios";

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
  <li className="item" style={{ textAlign: "left" }}>
    <span style={{ width: "40%" }}>
      {" "}
      <a href={url}>{title} </a> {" - "}
    </span>
    <span style={{ width: "30%" }}>
      author: {author}
      {" - "}
    </span>
    <span style={{ width: "10%" }}>
      comments: {num_comments}
      {" - "}
    </span>
    <span style={{ width: "10%" }}>
      points: {points}
      {" - "}
    </span>
    <button className="button button_small" onClick={handleRemove}>
      {"Remove"}
    </button>
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
  onInputChange(event: InputEvent): void;
  value: string;
  id: string;
  type?: string;
  isFocused?: boolean;
}

const InputWithLabel: React.FC<PropsWithChildren<InputWithLabelProps>> = ({
  onInputChange,
  value,
  id,
  type = "text",
  isFocused = false,
  children,
}) => {
  console.log("rendering InputWithLabel");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleChange = (event: InputEvent) => {
    onInputChange(event);
  };

  return (
    <>
      <label className="label" htmlFor={id}>
        {children}:{" "}
      </label>
      <input
        className="input"
        ref={inputRef}
        value={value}
        id={id}
        type={type}
        onChange={handleChange}
      />

      <p>
        {" "}
        Searching for <strong>{value}</strong>{" "}
      </p>
    </>
  );
};

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
  handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  handleSearchInput,
  handleSearchSubmit,
}) => {
  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <InputWithLabel
        isFocused
        value={searchTerm}
        onInputChange={handleSearchInput}
        id={"search"}
      >
        <strong> {"Search Term"} </strong>
      </InputWithLabel>
      <button
        className="button button_large"
        type="submit"
        disabled={!searchTerm}
      >
        <Check height={"24px"} width={"24px"} fill="white" />
      </button>
    </form>
  );
};

const App: React.FC<{}> = () => {
  const { searchTerm, setSearchTerm } = useStorageState("search", "React");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: Action.STORIES_FETCH_INIT });

    try {
      const result = await axios.get(url);
      dispatchStories({
        type: Action.STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: Action.STORIES_FETCH_FAILURE });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const filteredStories = stories.data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="headline-primary"> My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />
      {stories.isError && <p>{"Something went wrong..."}</p>}
      {stories.isLoading ? (
        <p>{"Loading..."}</p>
      ) : (
        <List setList={dispatchStories} list={filteredStories} />
      )}
    </div>
  );
};

export default App;
