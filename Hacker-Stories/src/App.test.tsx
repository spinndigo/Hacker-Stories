import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import App from "./App";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Item, SearchForm } from "./components";
import { Action, StoriesRemoveAction, storiesReducer } from "./storiesReducer";

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

vi.mock("axios");

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
      payload: { objectID: storyOne.objectID},
    };
    const state = {
      data: { list: stories, page: 0 },
      isLoading: false,
      isError: false,
    };
    const expectedState = {
      data: { list: [storyTwo], page: 0 },
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
    fireEvent.submit(screen.getByRole("button"));
    expect(props.handleSearchSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders snapshot", () => {
    const { container } = render(<SearchForm {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("App Component", () => {
  it("fetches initial data", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    axios.get.mockImplementationOnce(() => promise); // TS issue?
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    await waitFor(async () => await promise);
    expect(screen.queryByText(/Loading/)).toBeNull();
    expect(screen.getAllByText("React").length).toBe(2);
    expect(screen.queryByText("Redux")).toBeNull(); // wont appear due to initial state
    expect(screen.getAllByText("Remove").length).toBe(1);
  });

  it("handles failure to fetch data", async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise); // TS issue?
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    try {
      await waitFor(async () => await promise);
    } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });
  it("removes a story", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    axios.get.mockImplementationOnce(() => promise); // TS issue?
    render(<App />);
    await waitFor(async () => await promise);
    expect(screen.getAllByText("Remove").length).toBe(1);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Remove")[0]);
    expect(screen.queryByText("Remove")).toBe(null);
    expect(screen.queryByText("Jordan Walke")).toBeNull();
  });

  it("searches for specific stories", async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const storyThree = {
      title: "Javascript",
      url: "https://en.wikipedia.org/wiki/Javascript",
      author: "Brendan Eich",
      num_comments: 15,
      points: 10,
      objectID: "3",
    };

    const newStoryPromise = Promise.resolve({
      data: {
        hits: [storyThree],
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes("React")) {
        return reactPromise;
      }
      if (url.includes("Javascript")) {
        return newStoryPromise;
      }
      throw Error();
    });

    render(<App />);
    await waitFor(async () => await reactPromise);
    expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Javascript")).toBeNull();
    expect(screen.queryByText("Brendan Eich")).toBeNull();

    fireEvent.change(screen.queryByDisplayValue("React"), {
      target: {
        value: "Javascript",
      },
    });
    expect(screen.queryByDisplayValue("React")).toBeNull();
    expect(screen.queryByDisplayValue("Javascript")).toBeInTheDocument();

    fireEvent.submit(screen.queryByText("Submit"));

    await waitFor(async () => await newStoryPromise);

    expect(screen.queryByText("Jordan Walke")).toBeNull();
    expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
  });
});
