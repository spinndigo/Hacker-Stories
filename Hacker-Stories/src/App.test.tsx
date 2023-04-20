import { describe, it, expect, vi } from "vitest";
import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
  Action,
  StoriesRemoveAction,
} from "./App";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

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

describe("Item", () => {
  it("renders all properties", () => {
    render(<Item handleRemove={() => undefined} {...storyOne} />);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://reactjs.org/"
    );
  });

  it("renders a clickable remove button", () => {
    render(<Item handleRemove={() => undefined} {...storyOne} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls the callback handler after clicking remove", () => {
    const handleRemove = vi.fn();
    render(<Item handleRemove={handleRemove} {...storyOne} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});

describe("SearchForm", () => {
  const props = {
    searchTerm: "React",
    handleSearchInput: vi.fn(),
    handleSearchSubmit: vi.fn(),
  };
  const renderForm = () => {
    render(<SearchForm {...props} />);
  };

  it("renders the input field with its value", () => {
    renderForm();
    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
  });

  it("renders correct label", () => {
    renderForm();
    expect(screen.getByLabelText(/Search Term/)).toBeInTheDocument();
  });

  it("calls handleSearchInput on input field change", () => {
    renderForm();
    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });
    expect(props.handleSearchInput).toHaveBeenCalledTimes(1);
  });

  it("calls handleSearchSubmit on button submit click", () => {
    renderForm();
    fireEvent.submit(screen.getByRole('button'));
    expect(props.handleSearchSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("App Component", () => {
  it("removes an item when clicking the dismiss button", () => {});
  it("requests initial stories from API", () => {});
});
