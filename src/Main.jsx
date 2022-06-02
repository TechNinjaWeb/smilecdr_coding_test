import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

import Navigation from './Navigation';
import About from './About';
import QuestionnairePage from './QuestionnairePage';
import PatientList from './patient-list/Patients';

import './Main.css';

function Main() {
  return <Router>
    <Routes>
      <Route path="/" element={<><Navigation /><Outlet /></>}>
        <Route index element={<About />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  </Router>
}

export default Main;
