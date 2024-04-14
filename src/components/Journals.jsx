import {
  faPencil,
  faTrashCan,
  faSmileBeam,
  faSmile,
  faFaceMeh,
  faFrownOpen,
  faFaceTired,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faRegularBookmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
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
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import "./Journals.css";
import { interpretSentiment } from "../analysis/analyseSentiment";
import { allMoods } from "../utils/utils";

library.add(
  faSmileBeam,
  faSmile,
  faFaceMeh,
  faFrownOpen,
  faFaceTired,
  faBookmark
);

const Journals = () => {
  const [entries, setEntries] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilters, setMoodFilters] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadEntries = async () => {
      if (currentUser) {
        let q = query(
          collection(db, "journalEntries"),
          where("userId", "==", currentUser.uid),
          orderBy("journalDate", "desc")
        );

        // adjust query for bookmarked filter
        if (showBookmarked) {
          q = query(q, where("bookmarked", "==", true));
        }

        const querySnapshot = await getDocs(q);
        let entriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // apply search query filter
        if (searchQuery) {
          entriesData = entriesData.filter(
            (entry) =>
              entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (moodFilters.length > 0) {
          entriesData = entriesData.filter((entry) =>
            moodFilters.includes(entry.mood.label)
          );
        }

        setEntries(entriesData);
      }
    };

    loadEntries();
  }, [currentUser, showBookmarked, searchQuery, moodFilters]);

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

  const toggleBookmark = async (entryId, currentBookmarkStatus) => {
    const entryRef = doc(db, "journalEntries", entryId);
    await updateDoc(entryRef, {
      bookmarked: !currentBookmarkStatus,
    });

    setEntries(
      entries.map((entry) => {
        if (entry.id === entryId) {
          return { ...entry, bookmarked: !currentBookmarkStatus };
        }
        return entry;
      })
    );
  };

  const toggleShowBookmarked = () => {
    setShowBookmarked(!showBookmarked);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMoodFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked && !moodFilters.includes(value)) {
      setMoodFilters([...moodFilters, value]);
    } else {
      setMoodFilters(moodFilters.filter((mood) => mood !== value));
    }
  };

  return (
    <div>
      <h2>Entries</h2>
      <div className="journal-container">
        <aside className="journal-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter">
            <label>
              <input
                type="checkbox"
                checked={showBookmarked}
                onChange={toggleShowBookmarked}
              />
              Bookmarked
            </label>
          </div>

          <div className="filter moods-filter">
            <h6>Moods</h6>
            {allMoods.map((moodLabel) => (
              <label key={moodLabel}>
                <input
                  type="checkbox"
                  value={moodLabel}
                  onChange={handleMoodFilterChange}
                  checked={moodFilters.includes(moodLabel)}
                />
                {moodLabel}
              </label>
            ))}
          </div>
        </aside>
        <ul className="journal-entries">
          {entries.length === 0 && <div>Nothing added yet</div>}

          {entries.map((entry) => {
            const sentimentInfo = interpretSentiment(entry.sentiment);

            return (
              <li key={entry.id} className="journal-entry">
                <div className="entry-detail">
                  <Link to={`/entry/edit/${entry.id}`}>
                    <h4 className="entry-title">{entry.title}</h4>
                  </Link>
                  <div
                    className="entry-content-trimmed"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(entry.content),
                    }}
                  />
                </div>

                <div className="entry-footer">
                  <div className="entry-actions">
                    <button
                      onClick={() => toggleBookmark(entry.id, entry.bookmarked)}
                    >
                      <FontAwesomeIcon
                        icon={entry.bookmarked ? faBookmark : faRegularBookmark}
                        size="lg"
                      />
                    </button>

                    <Link to={`/entry/edit/${entry.id}`}>
                      <FontAwesomeIcon icon={faPencil} size="lg" />
                    </Link>

                    <button onClick={() => deleteEntry(entry.id)}>
                      <FontAwesomeIcon icon={faTrashCan} size="lg" />
                    </button>
                  </div>

                  <div className="entry-sentiment">
                    <FontAwesomeIcon
                      icon={`fa-solid ${sentimentInfo.icon}`}
                      color={sentimentInfo.color}
                      size="2xl"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Journals;
