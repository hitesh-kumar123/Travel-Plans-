import {
  QUEUE_ADD_ACTION,
  QUEUE_REMOVE_ACTION,
  QUEUE_SYNC_START,
  QUEUE_SYNC_SUCCESS,
  QUEUE_SYNC_ERROR,
  QUEUE_ITEM_FAILED,
} from "../types/offlineQueueTypes";
import api from "../../services/api";

// Adds a pending mutation to the offline queue instead of failing the request.
export const queueOfflineAction = ({ endpoint, method, payload }) => ({
  type: QUEUE_ADD_ACTION,
  payload: {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    endpoint,
    method,
    payload,
    createdAt: new Date().toISOString(),
  },
});

export const removeQueuedAction = (id) => ({
  type: QUEUE_REMOVE_ACTION,
  payload: id,
});

const isRetryable = (error) => {
  if (!error.response) return true;
  return error.response.status >= 500;
};

export const flushOfflineQueue = () => async (dispatch, getState) => {
  const { items, isSyncing } = getState().offlineQueue;
  if (!items.length || isSyncing) return;

  dispatch({ type: QUEUE_SYNC_START });

  for (const item of items) {
    try {
      const isGet = item.method?.toLowerCase() === "get";
      await api.request({
        url: item.endpoint,
        method: item.method,
        // GET requests need params in the query string, not a body.
        ...(isGet ? { params: item.payload } : { data: item.payload }),
      });
      dispatch(removeQueuedAction(item.id));
    } catch (error) {
      if (isRetryable(error)) {
        dispatch({
          type: QUEUE_SYNC_ERROR,
          payload:
            error.response?.data?.message || "Failed to sync offline updates",
        });
        return;
      }
      dispatch({
        type: QUEUE_ITEM_FAILED,
        payload: item,
      });
    }
  }

  dispatch({ type: QUEUE_SYNC_SUCCESS });
};
