import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import JournalForm from "./components/JournalForm";
import { useAuth } from "./contexts/AuthContext";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import MoodTrends from "./components/MoodTrends";
import Entries from "./components/Entries";

function App() {
  const { currentUser } = useAuth();

  return (
    <div>
      {!currentUser ? (
        <SignIn />
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/entry/new" element={<JournalForm />} />
            <Route path="/entry/edit/:id" element={<JournalForm />} />
            <Route path="/analysis" element={<MoodTrends />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
