import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  doc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  where,
  collection,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import "./Journals.css";

const Journals = () => {
  const [entries, setEntries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadEntries = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "journalEntries"),
          where("userId", "==", currentUser.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEntries(entriesData);
      }
    };

    loadEntries();
  }, [currentUser]);

  const deleteEntry = async (entryId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!isConfirmed) {
      return;
    }

    await deleteDoc(doc(db, "journalEntries", entryId));
    setEntries(entries.filter((entry) => entry.id !== entryId)); // update entries state
  };

  return (
    <div>
      <h2>Entries</h2>
      <ul className="journal-entries">
        {entries.length === 0 && <div>Nothing added yet</div>}

        {entries.map((entry) => {
          return (
            <li key={entry.id} className="journal-entry">
              <div className="entry-detail">
                <Link to={`entry/edit/${entry.id}`}>
                  <h4 className="entry-title">{entry.title}</h4>
                </Link>
                <div
                  className="entry-content-trimmed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(entry.content),
                  }}
                />
              </div>

              <div className="entry-actions">
                <FontAwesomeIcon icon={faRegularHeart} size="lg" />

                <Link to={`entry/edit/${entry.id}`}>
                  <FontAwesomeIcon icon={faPencil} size="lg" />
                </Link>

                <button onClick={() => deleteEntry(entry.id)}>
                  <FontAwesomeIcon icon={faTrashCan} size="lg" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Journals;
