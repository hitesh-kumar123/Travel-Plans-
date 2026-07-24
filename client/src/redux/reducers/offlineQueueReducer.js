import {
  QUEUE_ADD_ACTION,
  QUEUE_REMOVE_ACTION,
  QUEUE_CLEAR,
  QUEUE_SYNC_START,
  QUEUE_SYNC_SUCCESS,
  QUEUE_SYNC_ERROR,
  QUEUE_ITEM_FAILED,
} from "../types/offlineQueueTypes";

const initialState = {
  items: [], // { id, endpoint, method, payload, createdAt }
  isSyncing: false,
  lastError: null,
  failedItems: [], // items that failed permanently (e.g. 4xx) and were pulled out of the retry queue
};

const offlineQueueReducer = (state = initialState, action) => {
  switch (action.type) {
    case QUEUE_ADD_ACTION:
      return { ...state, items: [...state.items, action.payload] };

    case QUEUE_REMOVE_ACTION:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case QUEUE_CLEAR:
      return { ...state, items: [] };

    case QUEUE_SYNC_START:
      return { ...state, isSyncing: true, lastError: null };

    case QUEUE_SYNC_SUCCESS:
      return { ...state, isSyncing: false };

    case QUEUE_SYNC_ERROR:
      return { ...state, isSyncing: false, lastError: action.payload };

    case QUEUE_ITEM_FAILED:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        failedItems: [
          ...state.failedItems,
          { ...action.payload, failedAt: new Date().toISOString() },
        ],
      };

    default:
      return state;
  }
};

export default offlineQueueReducer;
