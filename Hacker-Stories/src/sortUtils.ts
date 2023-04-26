import _ from "lodash";
import { Story } from "./storiesReducer";

export type StorySorter = (
  s: Array<Story>,
  isAscending: boolean
) => Array<Story>;

export const sortTopic: StorySorter = (stories, isAscending = true) => {
  const sorted = _.sortBy(stories, (s) => s.title);
  return isAscending ? sorted : sorted.reverse();
};

export const sortUpvotes: StorySorter = (stories, isAscending = true) => {
  const sorted = _.sortBy(stories, (s) => s.points);
  return isAscending ? sorted : sorted.reverse();
};

export const sortComments: StorySorter = (stories, isAscending = true) => {
  const sorted = _.sortBy(stories, (s) => s.num_comments);
  return isAscending ? sorted : sorted.reverse();
};
