import { describe, it, expect } from "vitest";
import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
  Action,
  StoriesRemoveAction,
} from "./App";
import React from "react";

const storyOne = {
  title: "React",
  url: "https://reactjs.org/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: "0",
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: "1",
};

const stories = [storyOne, storyTwo];

describe("something truthy and falsey", () => {
  it("should evaluate boolean true", () => {
    expect(true).toBeTruthy();
  });
  it("should evaluate boolean false", () => {
    expect(false).toBeFalsy();
  });
});

describe("stories reducer", () => {
  it("removes a story from all stories", () => {
    const removeAction: StoriesRemoveAction = {
      type: Action.REMOVE_STORY,
      payload: storyOne,
    };
    const state = { data: stories, isLoading: false, isError: false };
    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };
    const newState = storiesReducer(state, removeAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("App Component", () => {
  it("removes an item when clicking the dismiss button", () => {});
  it("requests initial stories from API", () => {});
});
