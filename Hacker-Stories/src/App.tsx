import { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import axios from "axios";
import { useStorageState } from "./hooks";
import { List, SearchForm, SortCards } from "./components";
import { Action, Story, storiesReducer } from "./storiesReducer";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App: React.FC<{}> = () => {
  const { searchTerm, setSearchTerm } = useStorageState("search", "React");
  const [urls, setUrls] = useState<Array<string>>([
    `${API_ENDPOINT}${searchTerm}`,
  ]);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [sortedStories, setSortedStories] = useState<Array<Story>>([]);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: Action.STORIES_FETCH_INIT });

    try {
      const result = await axios.get(urls[urls.length - 1]);
      dispatchStories({
        type: Action.STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
      setSortedStories(result.data.hits);
    } catch {
      dispatchStories({ type: Action.STORIES_FETCH_FAILURE });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const filteredStories = sortedStories.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrls((prev) => {
      const newUrls = prev.slice();
      newUrls.push(`${API_ENDPOINT}${searchTerm}`);
      if (newUrls.length > 5) newUrls.shift();
      return newUrls;
    });
    event.preventDefault();
  };

  return (
    <>
      <h1> My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        {"or try one of these previous searches: "}
        {urls.slice(0, -1).map((url) => (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setSearchTerm(url.slice(url.indexOf("=") + 1))}
          >
            {" "}
            {url.slice(url.indexOf("=") + 1)}{" "}
          </span>
        ))}
      </div>
      <hr />
      {stories.isError && <p>{"Something went wrong..."}</p>}
      {stories.isLoading ? (
        <p>{"Loading..."}</p>
      ) : (
        <>
          <SortCards setSortedStories={setSortedStories} />
          <List setList={dispatchStories} list={filteredStories} />
        </>
      )}
    </>
  );
};

export default App;
