import { Dispatch, SetStateAction } from "react";
import { Story } from "../storiesReducer";
import { SortCard } from "./SortCard";
import { sortComments, sortTopic, sortUpvotes } from "../sortUtils";

interface Props {
  setSortedStories: Dispatch<SetStateAction<Array<Story>>>;
}

export const SortCards: React.FC<Props> = ({ setSortedStories }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <SortCard
        label="title"
        sorter={sortTopic}
        setSortedStories={setSortedStories}
      />
      <SortCard
        label="upvotes"
        sorter={sortUpvotes}
        setSortedStories={setSortedStories}
      />
      <SortCard
        label="comments"
        sorter={sortComments}
        setSortedStories={setSortedStories}
      />
    </div>
  );
};
