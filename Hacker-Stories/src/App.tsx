import { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import axios from "axios";
import { useStorageState } from "./hooks";
import { List, SearchForm, SortCards } from "./components";
import { Action, Story, storiesReducer } from "./storiesReducer";

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getUrl = (searchTerm: string, page: number) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = (url: string) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
    .replace(PARAM_SEARCH, "");

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
  const [sortedStories, setSortedStories] = useState<Array<Story>>([]);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: Action.STORIES_FETCH_INIT });

    try {
      const result = await axios.get(urls[urls.length - 1]);
      dispatchStories({
        type: Action.STORIES_FETCH_SUCCESS,
        payload: { list: result.data.hits, page: result.data.page },
      });
      setSortedStories(stories.data.list);
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
            onClick={() => setSearchTerm(url.slice(url.indexOf("=") + 1))}
          >
            {" "}
            {extractSearchTerm(url)}{" "}
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
          <button
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
