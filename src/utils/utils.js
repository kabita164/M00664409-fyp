export const getFormattedDate = () => {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long", // e.g., Saturday
    day: "numeric", // e.g., 4
    month: "short", // e.g., Jan
    year: "numeric", // e.g., 2024
  });
};
