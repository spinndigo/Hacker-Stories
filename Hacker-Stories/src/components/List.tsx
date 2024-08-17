import { Action, StoriesAction } from "../storiesReducer";

interface ItemProps {
  id?: number;
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
}

// exported for test
export const Item: React.FC<ItemProps & { handleRemove(): void }> = ({
  id,
  url,
  title,
  author,
  num_comments,
  points,
  handleRemove,
}) => (
  <li data-testid={`hit-${id}`} style={{ textAlign: "left" }}>
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
    <button data-testid={`remove-${id}`} onClick={handleRemove}>
      {"Remove"}
    </button>
  </li>
);

type ListItem = ItemProps & { objectID: string };
interface ListProps {
  list: Array<ListItem>;
  listReducer: React.Dispatch<StoriesAction>;
}

export const List: React.FC<ListProps> = ({ list, listReducer }) => {
  const handleRemove = (objectID: string) => {
    listReducer({ type: Action.REMOVE_STORY, payload: { objectID } });
  };

  return (
    <ul data-testid="hits-list" style={{ marginBottom: "20px" }}>
      {list.map(({ objectID, ...item }, idx) => (
        <Item
          data-testid={`hit-${idx}`}
          key={objectID}
          id={idx}
          {...item}
          handleRemove={() => handleRemove(objectID)}
        />
      ))}
    </ul>
  );
};
