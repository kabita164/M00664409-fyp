import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getFormattedDate } from "../utils/utils";
import "./JournalForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";

const JournalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (id) {
      loadEntry(id).catch(console.error);
    } else {
      setEntryTitle(getFormattedDate());
      setEntryContent("");
    }
  }, [id]);

  const loadEntry = async (entryId) => {
    const docRef = doc(db, "journalEntries", entryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const entry = docSnap.data();
      setEntryTitle(entry.title);
      setEntryContent(entry.content);
    } else {
      console.log("No such document!");
    }
  };

  const saveEntry = async () => {
    if (!entryContent.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    const entryData = {
      title: entryTitle,
      content: entryContent,
      timestamp: Date.now(),
      userId: currentUser.uid,
    };

    try {
      if (id) {
        // Update existing entry
        const entryRef = doc(db, "journalEntries", id);
        await setDoc(entryRef, entryData);
      } else {
        // Add new entry
        await addDoc(collection(db, "journalEntries"), entryData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving entry:", error);
      setError("Failed to save the entry. Please try again.");
    }
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
          onChange={setEntryContent}
          placeholder="Write your journal entry here..."
        />
        <div className="form-action-buttons my-8">
          <button className="btn btn--primary" type="submit">
            Save
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
