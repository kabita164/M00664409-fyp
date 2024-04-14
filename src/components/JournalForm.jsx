import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getFormattedDate } from "../utils/utils";
import "./JournalForm.css";
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import {
  analyseSentiment,
  interpretSentiment,
} from "../analysis/analyseSentiment";

const JournalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [journalDate, setJournalDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (id) {
      loadEntry(id).catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    setEntryTitle(getFormattedDate(journalDate));
  }, [journalDate]);

  const loadEntry = async (entryId) => {
    const docRef = doc(db, "journalEntries", entryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const entry = docSnap.data();
      setEntryTitle(entry.title);
      setEntryContent(entry.content);
      setJournalDate(entry.journalDate.toDate().toISOString().split("T")[0]);
    } else {
      console.log("No such document!");
    }
    setIsLoading(false);
  };

  const saveEntry = async () => {
    const textContent = entryContent.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      setError("Content cannot be empty.");
      return;
    }
    setIsSaving(true);

    const sentimentResult = await analyseSentiment(entryContent);
    const mood = interpretSentiment(sentimentResult);
    console.log("Sentiment result:", sentimentResult, mood);

    const entryData = {
      title: entryTitle,
      content: entryContent,
      sentiment: sentimentResult,
      mood: {
        label: mood.label,
        score: mood.moodScore,
      },
      journalDate: new Date(journalDate),
      dateEdited: new Date(),
    };

    try {
      if (id) {
        // Update existing entry
        const entryRef = doc(db, "journalEntries", id);
        await updateDoc(entryRef, entryData);
      } else {
        // Add new entry
        entryData.userId = currentUser.uid;
        (entryData.journalDate = new Date(journalDate)),
          (entryData.dateEdited = new Date()),
          (entryData.bookmarked = false);
        await addDoc(collection(db, "journalEntries"), entryData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving entry:", error);
      setError("Failed to save the entry. Please try again.");
    }
    setIsSaving(false);
  };

  const handleDateChange = (event) => {
    setJournalDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveEntry();
  };

  const handleCancel = () => {
    resetForm();
    navigate("/");
  };

  const resetForm = () => {
    setEntryTitle("");
    setEntryContent("");
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <BarLoader color="#000" loading={true} size={150} />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto my-8 px-8">
      <h2>{id ? "Edit Journal Entry" : "Create Journal Entry"}</h2>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-panel">{error}</div>}{" "}
        <div className="form-nav">
          <button onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h5 className="entry-title">{entryTitle}</h5>
          <div className="date-input-wrapper">
            <label>
              <span className="date-label">Date:</span>
              <input
                type="date"
                value={journalDate}
                onChange={handleDateChange}
                max={today}
              />
            </label>
          </div>
        </div>
        <ReactQuill
          value={entryContent}
          onChange={setEntryContent}
          placeholder="Write your journal entry here..."
        />
        <div className="form-action-buttons my-8">
          <button
            className="btn btn--primary"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            className="btn btn--secondary"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalForm;
