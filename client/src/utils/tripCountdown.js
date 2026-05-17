export function getTripCountdown(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const MS_PER_DAY = 86_400_000;
  const daysToStart = Math.round((start - today) / MS_PER_DAY);
  const daysToEnd = Math.round((end - today) / MS_PER_DAY);

  if (daysToEnd < 0) return { type: "completed", label: "Completed" };
  if (daysToStart === 0)
    return { type: "today", label: "Trip starts today! 🎉" };
  if (daysToStart < 0) return { type: "ongoing", label: "Trip in progress ✈️" };
  return { type: "upcoming", label: `${daysToStart} days to go` };
}
