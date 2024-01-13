import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getFormattedDate } from "../utils/utils";
import "./JournalForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const JournalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadEntry(id);
    } else {
      setEntryTitle(getFormattedDate());
    }
  }, [id]);

  const loadEntry = (entryId) => {
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const entryToEdit = entries.find((entry) => entry.id === entryId);
    if (entryToEdit) {
      setEntryTitle(entryToEdit.title);
      setEntryContent(entryToEdit.content);
    }
  };

  const editExistingEntry = (entryId, content) => {
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const updatedEntries = entries.map((entry) =>
      entry.id === entryId ? { ...entry, content } : entry
    );
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
  };

  const createNewEntry = (content) => {
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const newEntry = {
      id: uuidv4(),
      title: entryTitle,
      content,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      "journalEntries",
      JSON.stringify([...entries, newEntry])
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!entryContent.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setError("");

    if (id) {
      editExistingEntry(id, entryContent);
    } else {
      createNewEntry(entryContent);
    }

    resetForm();
    navigate("/");
  };

  const handleCancel = () => {
    resetForm();
    navigate("/");
  };

  const resetForm = () => {
    setEntryTitle("");
    setEntryContent("");
  };

  return (
    <div className="container mx-auto my-8 px-8">
      <h2>{id ? "Edit Journal Entry" : "Create Journal Entry"}</h2>

      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}{" "}
        <div className="form-nav">
          <button onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h5 className="entry-title">{entryTitle}</h5>
          <span></span>
        </div>
        <ReactQuill
          value={entryContent}
          onChange={setEntryContent} // Update the state with the new content
          placeholder="Write your journal entry here..."
        />
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default JournalForm;
