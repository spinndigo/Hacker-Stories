import { SyntheticEvent } from "react";
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

const Item: React.FC<{ item: Story }> = ({ item }) => (
  <li style={{ textAlign: "left" }} key={item.objectId}>
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
  return (
    <ul style={{ marginBottom: "20px" }}>
      {list.map((item) => (
        <Item item={item} />
      ))}
    </ul>
  );
};

const Search: React.FC<{}> = () => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    console.log(event.target.value);
  };

  return (
    <>
      <label htmlFor="search">{"Search: "}</label>
      <input id="search" type="text" onChange={handleChange} />
    </>
  );
};

const App: React.FC<{}> = () => {
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

  return (
    <div>
      <h1>
        {" "}
        {welcome.greeting} {welcome.title}
      </h1>
      <Search />
      <hr />
      <List list={stories} />
    </div>
  );
};

export default App;
