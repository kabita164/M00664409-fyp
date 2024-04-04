import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getLast14Days } from "../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodTrends = () => {
  const allDates = getLast14Days();

  const filteredData = mockData.filter((entry) => {
    const entryDateNormalized = new Date(
      entry.dateCreated.getFullYear(),
      entry.dateCreated.getMonth(),
      entry.dateCreated.getDate()
    );
    return allDates.some(
      (date) =>
        date.getFullYear() === entryDateNormalized.getFullYear() &&
        date.getMonth() === entryDateNormalized.getMonth() &&
        date.getDate() === entryDateNormalized.getDate()
    );
  });

  const preparedData = allDates.map((date) => {
    const dateString = date.toISOString().split("T")[0];

    const foundEntry = filteredData.find((entry) => {
      const entryDateString = entry.dateCreated.toISOString().split("T")[0];
      return dateString === entryDateString;
    });

    return foundEntry ? foundEntry.mood.moodScore : null;
  });

  // dashed line for skipped dates
  const skipped = (ctx, value) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;

  const data = {
    labels: allDates.map((date) => date.toISOString().split("T")[0]),
    datasets: [
      {
        label: "Mood score",
        data: preparedData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 5,
        segment: {
          borderDash: (ctx) => skipped(ctx, [6, 6]),
        },
        spanGaps: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        offset: true,
      },
      y: {
        title: {
          display: false,
        },
        offset: true,
        min: 1,
        max: 5,
        ticks: {
          precision: 0,
          font: {
            weight: "bold",
          },
          callback: (val) => {
            switch (val) {
              case 1:
                return "Very Negative";
              case 2:
                return "Negative";
              case 3:
                return "Neutral";
              case 4:
                return "Positive";
              case 5:
                return "Very Positive";
              default:
                return "N/A";
            }
          },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  return (
    <div className="analysis-page container mx-auto my-8 px-8">
      <h2>Mood trends</h2>

      <h3>Mood over last 14 days</h3>

      <div className="charts">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default MoodTrends;

const mockData = [
  {
    dateCreated: new Date(2024, 2, 22),
    mood: { moodScore: 2, label: "Negative" },
  },
  {
    dateCreated: new Date(2024, 2, 25),
    mood: { moodScore: 2, label: "Negative" },
  },
  {
    dateCreated: new Date(2024, 2, 26),
    mood: { moodScore: 3, label: "Neutral" },
  },
  {
    dateCreated: new Date(2024, 2, 27),
    mood: { moodScore: 4, label: "Positive" },
  },
  {
    dateCreated: new Date(2024, 2, 28),
    mood: { moodScore: 2, label: "Negative" },
  },
  {
    dateCreated: new Date(2024, 2, 29),
    mood: { moodScore: 5, label: "Very Positive" },
  },
  {
    dateCreated: new Date(2024, 2, 30),
    mood: { moodScore: 3, label: "Neutral" },
  },
  {
    dateCreated: new Date(2024, 3, 1),
    mood: { moodScore: 4, label: "Positive" },
  },
  {
    dateCreated: new Date(2024, 3, 2),
    mood: { moodScore: 5, label: "Very Positive" },
  },
  {
    dateCreated: new Date(2024, 3, 4),
    mood: { moodScore: 3, label: "Neutral" },
  },
];
