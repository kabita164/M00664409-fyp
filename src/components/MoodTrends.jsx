import { useEffect, useMemo, useState } from "react";
import MoodTrendsRecentChart from "./MoodTrendsRecentChart";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import { getDocs, query, orderBy, where, collection } from "firebase/firestore";
import MoodTrendsCountChart from "./MoodTrendsCountChart";
import "./MoodTrends.css";
import MoodTrendsByDay from "./MoodTrendsByDay";

const moodValue = {
  "Very Negative": 1,
  Negative: 2,
  Neutral: 3,
  Positive: 4,
  "Very Positive": 5,
};

const MoodTrends = () => {
  const [entries, setEntries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadEntries = async () => {
      if (currentUser) {
        let q = query(
          collection(db, "journalEntries"),
          where("userId", "==", currentUser.uid),
          orderBy("dateCreated", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedEntries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dateCreated: doc.data().dateCreated.toDate(), // convert Firestore Timestamp to Date
        }));

        setEntries(fetchedEntries);
      }
    };

    loadEntries();
  }, [currentUser]);

  const averageMoodByDay = useMemo(() => {
    const dayOfWeek = {
      Monday: { total: 0, count: 0 },
      Tuesday: { total: 0, count: 0 },
      Wednesday: { total: 0, count: 0 },
      Thursday: { total: 0, count: 0 },
      Friday: { total: 0, count: 0 },
      Saturday: { total: 0, count: 0 },
      Sunday: { total: 0, count: 0 },
    };

    entries.forEach((entry) => {
      const day = new Date(entry.dateCreated).toLocaleDateString("en-GB", {
        weekday: "long",
      });
      const moodScore = moodValue[entry.mood.label];
      if (dayOfWeek[day]) {
        dayOfWeek[day].total += moodScore;
        dayOfWeek[day].count += 1;
      }
    });

    return Object.keys(dayOfWeek).map((day) => ({
      day,
      average:
        dayOfWeek[day].count > 0
          ? (dayOfWeek[day].total / dayOfWeek[day].count).toFixed(2)
          : "No data",
    }));
  }, [entries]);

  return (
    <div className="analysis-page container mx-auto my-8 px-8">
      <h2>Mood trends</h2>

      <div className="charts">
        <div className="chart">
          <h3>Mood over last 14 days</h3>
          <MoodTrendsRecentChart entries={entries} />
        </div>

        <div className="chart">
          <h3>Mood counts</h3>
          <MoodTrendsCountChart entries={entries} />
        </div>

        <div className="chart">
          <h3>Average mood by day of week</h3>
          <MoodTrendsByDay averageMoodByDay={averageMoodByDay} />
        </div>
      </div>
    </div>
  );
};

export default MoodTrends;
