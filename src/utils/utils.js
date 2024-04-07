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
  const endDate = new Date(
    Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      23,
      59,
      59,
      999
    )
  );
  const startDate = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate() - 13,
      0,
      0,
      0,
      0
    )
  );

  let dateArray = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setUTCDate(dt.getUTCDate() + 1)
  ) {
    dateArray.push(new Date(dt));
  }
  return dateArray;
};

export const allMoods = [
  "Very Positive",
  "Positive",
  "Neutral",
  "Negative",
  "Very Negative",
];
