import {
  faHeart,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import "./Journals.css";

const Journals = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const storedEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );
    storedEntries.sort((a, b) => b.timestamp - a.timestamp);
    setEntries(storedEntries);
  };

  const deleteEntry = (entryId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!isConfirmed) {
      return; // Do nothing if the user cancels the action
    }

    const updatedEntries = entries.filter((entry) => entry.id !== entryId);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    loadEntries(); // Refresh the entries list
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
