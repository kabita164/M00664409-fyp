import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";
import { allMoods } from "../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodTrendsCountChart = ({ entries }) => {
  let moodCounts = allMoods.reduce((acc, mood) => {
    acc[mood] = 0;
    return acc;
  }, {});

  entries.forEach((entry) => {
    const mood = entry.mood.label;
    if (mood in moodCounts) {
      moodCounts[mood] += 1;
    }
  });

  const data = {
    labels: allMoods,
    datasets: [
      {
        data: allMoods.map((mood) => moodCounts[mood]),
        backgroundColor: [
          "#4caf50",
          "#8bc34a",
          "#9e9e9e",
          "#ff9800",
          "#f44336",
        ],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            weight: "bold",
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

  return <Bar data={data} options={options} />;
};

export default MoodTrendsCountChart;

MoodTrendsCountChart.propTypes = {
  entries: PropTypes.array,
};
