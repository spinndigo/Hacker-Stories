export interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: string;
}

export enum Action {
  SET_STORIES = "SET_STORIES",
  REMOVE_STORY = "REMOVE_STORY",
  STORIES_FETCH_INIT = "STORIES_FETCH_INIT",
  STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS",
  STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE",
}

type SetPayload = {
  list: Array<Story>;
  page: number;
};

type StoriesInitAction = {
  type: Action.STORIES_FETCH_INIT;
};

type StoriesSuccessAction = {
  type: Action.STORIES_FETCH_SUCCESS;
  payload: SetPayload;
};

type StoriesFailureAction = {
  type: Action.STORIES_FETCH_FAILURE;
};

type RemovePayload = { objectID: Story["objectID"] };

export type StoriesSetAction = {
  type: Action.SET_STORIES;
  payload: SetPayload;
};

export type StoriesRemoveAction = {
  type: Action.REMOVE_STORY;
  payload: RemovePayload;
};

export type StoriesAction =
  | StoriesSetAction
  | StoriesRemoveAction
  | StoriesInitAction
  | StoriesSuccessAction
  | StoriesFailureAction;

export interface StoryState {
  data: SetPayload;
  isLoading: boolean;
  isError: boolean;
}

type StoryReducer = (state: StoryState, action: StoriesAction) => StoryState;

export const storiesReducer: StoryReducer = (
  state: StoryState,
  action: StoriesAction
) => {
  switch (action.type) {
    case Action.STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case Action.STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: {
          list:
            action.payload.page === 0
              ? action.payload.list
              : state.data.list.concat(action.payload.list),
          page: action.payload.page,
        },
      };
    case Action.STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case Action.SET_STORIES:
      return { ...state, data: action.payload };
    case Action.REMOVE_STORY:
      return {
        ...state,
        data: {
          list: state.data.list.filter(
            (story) => story.objectID !== action.payload.objectID
          ),
          page: state.data.page,
        },
      };
    default:
      throw new Error();
  }
};
