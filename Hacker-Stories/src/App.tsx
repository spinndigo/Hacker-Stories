import {
  PropsWithChildren,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";

const title = "React";

const welcome = { title: "React", greeting: "Hey" };

const stories = [
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

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface StoryProps {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
}

const Item: React.FC<StoryProps> = ({
  url,
  title,
  author,
  num_comments,
  points,
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
  </li>
);

type ListItem = StoryProps & { objectId: number };

const List: React.FC<{ list: Array<ListItem> }> = ({ list }) => {
  console.log("rendering List");
  return (
    <ul style={{ marginBottom: "20px" }}>
      {list.map(({ objectId, ...item }) => (
        <Item key={objectId} {...item} />
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

const App: React.FC<{}> = () => {
  console.log("rendering App");
  const { value, setValue } = useStorageState("search", "React");

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
      <List list={filteredStories} />
    </>
  );
};

export default App;
