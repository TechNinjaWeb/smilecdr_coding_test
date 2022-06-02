import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

import Navigation from './Navigation';
import TransitionWrapper from './TransitionWrapper';
import About from './About';
import QuestionnairePage from './QuestionnairePage';
import PatientList from './patient-list/Patients';

import './Main.css';

function Main() {
  const [triggered, setTriggered] = useState(true);

  useEffect(() => {
    if (triggered) { return; }
    setTriggered(true)
  }, [triggered, setTriggered])
  
  return <Router>
    <Routes>
      <Route path="/" element={<><Navigation /><TransitionWrapper triggered={triggered} reset={setTriggered}><Outlet /></TransitionWrapper></>}>
        <Route index element={<About />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  </Router>
}

export default Main;
