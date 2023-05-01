interface ItemProps {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
}

export const Item: React.FC<ItemProps & { handleRemove(): void }> = ({
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
    <span>{author}</span>
    <span>{" - "}</span>
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

type ListItem = ItemProps & { objectID: string };
interface ListProps {
  list: Array<ListItem>;
  setList: any;
}

export const List: React.FC<ListProps> = ({ list, setList }) => {
  console.log("rendering List");

  const handleRemove = (objectID: string) => {
    setList({ type: "REMOVE_STORY", payload: { objectID } });
  };

  return (
    <ul style={{ marginBottom: "20px" }}>
      {list.map(({ objectID, ...item }) => (
        <Item
          key={objectID}
          handleRemove={() => handleRemove(objectID)}
          {...item}
        />
      ))}
    </ul>
  );
};
