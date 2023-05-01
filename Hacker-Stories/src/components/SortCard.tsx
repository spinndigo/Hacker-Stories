import { Dispatch, SetStateAction, useState } from "react";
import { StorySorter } from "../sortUtils";
import { Action, Story } from "../storiesReducer";
import { SortCardsProps } from "./SortCards";

interface Props {
  label: string;
  sorter: StorySorter;
}

export const SortCard: React.FC<Props & SortCardsProps> = ({
  label,
  sorter,
  stories,
  storyReducer,
}) => {
  const [isAsc, setIsAsc] = useState(true);
  const onClick = () => {
    storyReducer({
      type: Action.SET_STORIES,
      payload: {
        list: sorter(stories.data.list, isAsc),
        page: stories.data.page,
      },
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
