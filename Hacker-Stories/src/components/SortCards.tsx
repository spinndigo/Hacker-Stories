import { Dispatch, SetStateAction } from "react";
import { StoriesAction, Story, StoryState } from "../storiesReducer";
import { SortCard } from "./SortCard";
import { sortComments, sortTopic, sortUpvotes } from "../sortUtils";

export interface SortCardsProps {
  storyReducer: React.Dispatch<StoriesAction>;
  stories: StoryState;
}

export const SortCards: React.FC<SortCardsProps> = ({
  storyReducer,
  stories,
}) => {
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
        stories={stories}
        storyReducer={storyReducer}
      />
      <SortCard
        label="upvotes"
        sorter={sortUpvotes}
        stories={stories}
        storyReducer={storyReducer}
      />
      <SortCard
        label="comments"
        sorter={sortComments}
        stories={stories}
        storyReducer={storyReducer}
      />
    </div>
  );
};
