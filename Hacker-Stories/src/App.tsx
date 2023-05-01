import { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import axios from "axios";
import { useStorageState } from "./hooks";
import { List, SearchForm, SortCards } from "./components";
import { Action, Story, storiesReducer } from "./storiesReducer";
import { getUrl, extractSearchTerm } from "./utils";

const App: React.FC<{}> = () => {
  const { searchTerm, setSearchTerm } = useStorageState("search", "React");
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: { list: [], page: 0 },
    isLoading: false,
    isError: false,
  });
  const [urls, setUrls] = useState<Array<string>>([
    getUrl(searchTerm, stories.data.page),
  ]);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: Action.STORIES_FETCH_INIT });

    try {
      const result = await axios.get(urls[urls.length - 1]);
      dispatchStories({
        type: Action.STORIES_FETCH_SUCCESS,
        payload: { list: result.data.hits, page: result.data.page },
      });
    } catch {
      dispatchStories({ type: Action.STORIES_FETCH_FAILURE });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const filteredStories = stories.data.list.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);
    setUrls((prev) => {
      const newUrls = prev.slice();
      newUrls.push(url); // ??
      if (newUrls.length > 5) newUrls.shift();
      return newUrls;
    });
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSearch(searchTerm, 0);
    event.preventDefault();
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.data.page + 1);
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
            onClick={() => setSearchTerm(extractSearchTerm(url))}
          >
            {" "}
            {extractSearchTerm(url)}{" "}
          </span>
        ))}
      </div>
      <hr />
      <SortCards stories={stories} storyReducer={dispatchStories} />
      <List listReducer={dispatchStories} list={filteredStories} />
      {stories.isError && <p>{"Something went wrong..."}</p>}
      {stories.isLoading ? (
        <p>{"Loading..."}</p>
      ) : (
        <>
          <button
            type="button"
            onClick={handleMore}
            style={{
              height: "50px",
              width: "200px",
              backgroundColor: "darkorange",
              fontWeight: "bold",
            }}
          >
            {"More"}
          </button>
        </>
      )}
    </>
  );
};

export default App;
