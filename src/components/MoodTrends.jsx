import { useEffect, useState } from "react";
import MoodTrendsRecentChart from "./MoodTrendsRecentChart";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import { getDocs, query, orderBy, where, collection } from "firebase/firestore";

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

  return (
    <div className="analysis-page container mx-auto my-8 px-8">
      <h2>Mood trends</h2>

      <h3>Mood over last 14 days</h3>

      <div className="charts">
        <MoodTrendsRecentChart entries={entries} />
      </div>
    </div>
  );
};

export default MoodTrends;
