import { SyntheticEvent, useState } from "react";
import "./App.css";

const title = "React";

const welcome = { title: "React", greeting: "Hey" };

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

interface SearchProps {
  handleSearch(event: InputEvent): void;
  searchTerm: string;
}

const Search: React.FC<SearchProps> = ({ handleSearch, searchTerm }) => {
  console.log("rendering Search");

  const handleChange = (event: InputEvent) => {
    handleSearch(event);
  };

  return (
    <div>
      <label htmlFor="search">{"Search: "}</label>
      <input
        value={searchTerm}
        id="search"
        type="text"
        onChange={handleChange}
      />

      <p>
        {" "}
        Searching for <strong>{searchTerm}</strong>{" "}
      </p>
    </div>
  );
};

const App: React.FC<{}> = () => {
  console.log("rendering App");
  const [searchTerm, setSearchTerm] = useState("React");
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

  const filteredStories = stories.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>
        {" "}
        {welcome.greeting} {welcome.title}
      </h1>
      <Search searchTerm={searchTerm} handleSearch={handleSearch} />
      <hr />
      <List list={filteredStories} />
    </div>
  );
};

export default App;
