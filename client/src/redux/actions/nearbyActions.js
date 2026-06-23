import api from "../../services/api";
import { getDistanceKm } from "../../utils/distanceUtils";
import {
  NEARBY_REQUEST_LOCATION,
  NEARBY_LOCATION_SUCCESS,
  NEARBY_LOCATION_DENIED,
  NEARBY_FETCH_SUCCESS,
  NEARBY_FETCH_ERROR,
  NEARBY_RESET,
} from "../types/nearbyTypes";

export const fetchNearbyDestinations = () => (dispatch) => {
  dispatch({ type: NEARBY_REQUEST_LOCATION });

  if (!navigator.geolocation) {
    dispatch({
      type: NEARBY_LOCATION_DENIED,
      payload: "Geolocation is not supported by your browser.",
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      dispatch({
        type: NEARBY_LOCATION_SUCCESS,
        payload: { latitude, longitude },
      });

      try {
        const res = await api.get("/destinations");
        const destinations = res.data;

        const withDistance = destinations
          .filter(
            (d) =>
              d.coordinates &&
              typeof d.coordinates.lat === "number" &&
              typeof d.coordinates.lon === "number",
          )
          .map((d) => ({
            ...d,
            distanceKm: getDistanceKm(
              latitude,
              longitude,
              d.coordinates.lat,
              d.coordinates.lon,
            ),
          }));

        dispatch({
          type: NEARBY_FETCH_SUCCESS,
          payload: withDistance,
        });
      } catch (err) {
        dispatch({
          type: NEARBY_FETCH_ERROR,
          payload: "Failed to load destinations. Please try again.",
        });
      }
    },
    (error) => {
      let message = "Location access denied.";
      if (error.code === error.POSITION_UNAVAILABLE) {
        message = "Location information is unavailable.";
      } else if (error.code === error.TIMEOUT) {
        message = "Location request timed out.";
      }
      dispatch({ type: NEARBY_LOCATION_DENIED, payload: message });
    },
    { timeout: 10000 },
  );
};

export const resetNearby = () => ({ type: NEARBY_RESET });
