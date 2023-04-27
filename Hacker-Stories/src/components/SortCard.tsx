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
        flexWrap: "wrap",
        height: "100px",
        width: "200px",
        backgroundColor: "grey",
      }}
    >
      <div style={{ width: "100%", fontSize: "24px", fontWeight: "bold" }}>
        {" "}
        {label}{" "}
      </div>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {" "}
        {"sort by: "} {isAsc ? "asc" : "desc"}{" "}
      </div>
    </div>
  );
};
