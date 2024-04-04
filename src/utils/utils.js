// format today's date like "Saturday, 4 Jan 2024"
export const getFormattedDate = () => {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long", // e.g., Saturday
    day: "numeric", // e.g., 4
    month: "short", // e.g., Jan
    year: "numeric", // e.g., 2024
  });
};

// generate date range for the last 14 days
export const getLast14Days = () => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 13);
  startDate.setHours(0, 0, 0, 0);

  let dateArray = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dateArray.push(new Date(dt));
  }
  return dateArray;
};
