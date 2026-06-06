const KEY = "recently_viewed_destinations";
const MAX_ITEMS = 5;

export function getRecentlyViewed() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(destination) {
  try {
    let list = getRecentlyViewed();
    list = list.filter((item) => item._id !== destination._id);
    list.unshift(destination);
    if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save recently viewed:", err);
  }
}

export function clearRecentlyViewed() {
  localStorage.removeItem(KEY);
}
