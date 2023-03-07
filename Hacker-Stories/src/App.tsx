import { SyntheticEvent, useState } from "react";
import "./App.css";

const title = "React";

const welcome = { title: "React", greeting: "Hey" };

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectId: number;
}

const Item: React.FC<{ item: Story }> = ({ item }) => (
  <li style={{ textAlign: "left" }}>
    <span>
      {" "}
      <a href={item.url}>{item.title} </a>{" "}
    </span>
    <span>
      author: {item.author}
      {" - "}
    </span>
    <span>
      comments: {item.num_comments}
      {" - "}
    </span>
    <span>
      points: {item.points}
      {" - "}
    </span>
  </li>
);

const List: React.FC<{ list: Array<Story> }> = ({ list }) => {
  console.log("rendering List");
  return (
    <ul style={{ marginBottom: "20px" }}>
      {list.map((item) => (
        <Item key={item.objectId} item={item} />
      ))}
    </ul>
  );
};

interface SearchProps {
  handleSearch(event: InputEvent): void;
}

const Search: React.FC<SearchProps> = ({ handleSearch }) => {
  console.log("rendering Search");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: InputEvent) => {
    handleSearch(event);
  };

  return (
    <div>
      <label htmlFor="search">{"Search: "}</label>
      <input id="search" type="text" onChange={handleChange} />

      <p>
        {" "}
        Searching for <strong>{searchTerm}</strong>{" "}
      </p>
    </div>
  );
};

const App: React.FC<{}> = () => {
  console.log("rendering App");
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <h1>
        {" "}
        {welcome.greeting} {welcome.title}
      </h1>
      <Search handleSearch={handleSearch} />
      <hr />
      <List list={stories} />
    </div>
  );
};

export default App;
