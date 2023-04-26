import { Dispatch, SetStateAction, useState } from "react";
import { StorySorter } from "../sortUtils";
import { Story } from "../storiesReducer";

interface Props {
  label: string;
  sorter: StorySorter;
  setSortedStories: Dispatch<SetStateAction<Array<Story>>>;
}

export const SortCard: React.FC<Props> = ({
  label,
  sorter,
  setSortedStories,
}) => {
  const [isAsc, setIsAsc] = useState(true);
  const onClick = () => {
    setSortedStories((prev) => {
      const sorted = sorter(prev, isAsc);
      return sorted;
    });
    setIsAsc((prev) => !prev);
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        height: "150px",
        width: "300px",
        backgroundColor: "grey",
      }}
    >
      <p> {label} </p>
      <div> {isAsc ? "asc" : "desc"} </div>
    </div>
  );
};
