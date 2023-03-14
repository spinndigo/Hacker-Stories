import {
  PropsWithChildren,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";

const title = "React";

const welcome = { title: "React", greeting: "Hey" };

interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectId: number;
}

const stories: Array<Story> = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectId: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectId: 1,
  },
];

const getAsyncStories = () =>
  new Promise<{ data: { stories: Story[] } }>((resolve) => {
    setTimeout(() => resolve({ data: { stories } }), 2000);
  });

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
      <label htmlFor={id}>{children}: </label>
      <input
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
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return { value, setValue };
};

const SET_STORIES = "SET_STORIES";
const REMOVE_STORY = "REMOVE_STORY";

type StoriesSetAction = {
  type: "SET_STORIES";
  payload: Array<Story>;
};

type StoriesRemoveAction = {
  type: "REMOVE_STORY";
  payload: Story;
};

type StoriesAction = StoriesSetAction | StoriesRemoveAction;

const storiesReducer = (state: Array<Story>, action: StoriesAction) => {
  switch (action.type) {
    case SET_STORIES:
      return action.payload;
    case REMOVE_STORY:
      return state.filter(
        (story) => story.objectId !== action.payload.objectId
      );
    default:
      throw new Error();
  }
};

const App: React.FC<{}> = () => {
  console.log("rendering App");
  const { value, setValue } = useStorageState("search", "React");
  const [stories, dispatachStories] = useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then((result) => {
        dispatachStories({ type: "SET_STORIES", payload: result.data.stories });
        setIsLoading(false);
      })
      .catch(() => setHasError(true));
  }, []);

  const filteredStories = stories.filter((item) =>
    item.title.toLowerCase().includes(value.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <h1>
        {" "}
        {welcome.greeting} {welcome.title}
      </h1>
      <InputWithLabel
        isFocused
        value={value}
        onInputChange={handleSearch}
        id={"search"}
      >
        <strong> {"Search Term"} </strong>
      </InputWithLabel>
      <hr />
      {hasError && <p>{"Something went wrong..."}</p>}
      {isLoading ? (
        <p>{"Loading..."}</p>
      ) : (
        <List setList={dispatachStories} list={filteredStories} />
      )}
    </>
  );
};

export default App;
