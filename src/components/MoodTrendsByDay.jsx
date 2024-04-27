import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

const MoodTrendsByDay = ({ averageMoodByDay }) => {
  const data = {
    labels: averageMoodByDay.map((entry) => entry.day),
    datasets: [
      {
        label: "Average Mood Score",
        data: averageMoodByDay.map((entry) =>
          entry.average === "No data" ? 0 : entry.average
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
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
                return "";
            }
          },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MoodTrendsByDay;

MoodTrendsByDay.propTypes = {
  averageMoodByDay: PropTypes.array,
};
