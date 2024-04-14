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
import PropTypes from "prop-types";
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

const MoodTrendsRecentChart = ({ entries }) => {
  const allDates = getLast14Days();

  const filteredData = entries.filter((entry) => {
    const entryDateNormalized = new Date(
      entry.journalDate.getFullYear(),
      entry.journalDate.getMonth(),
      entry.journalDate.getDate()
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
      const entryDateString = entry.journalDate.toISOString().split("T")[0];
      return dateString === entryDateString;
    });

    return foundEntry ? foundEntry.mood.score : null;
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
          display: false,
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

  return <Line data={data} options={options} />;
};

export default MoodTrendsRecentChart;

MoodTrendsRecentChart.propTypes = {
  entries: PropTypes.array,
};
