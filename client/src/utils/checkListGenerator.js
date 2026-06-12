export const generateChecklist = (destination, weather) => {
  const list = [];

  if (!destination) return list;

  list.push("Passport");
  list.push("Tickets");
  list.push("ID Card");

  const dest = destination.toLowerCase();

  if (dest !== "india") {
    list.push("Visa");
  }

  const w = weather.toLowerCase();

  if (w.includes("rain")) {
    list.push("Umbrella");
    list.push("Raincoat");
  }

  if (w.includes("cold")) {
    list.push("Winter clothes");
  }

  if (w.includes("hot")) {
    list.push("Sunglasses");
    list.push("Light cotton clothes");
  }

  return list;
};
