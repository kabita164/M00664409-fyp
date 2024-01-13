import { useState } from "react";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import JournalForm from "./components/JournalForm";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entry/new" element={<JournalForm />} />
        <Route path="/entry/edit/:id" element={<JournalForm />} />
      </Routes>
    </div>
  );
}

export default App;
