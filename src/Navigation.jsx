import { Link } from 'react-router-dom'

import smileLogo from './smile-cdr-logo.webp';

function Navigation() {
  return <div className="nav-wrap flex">
    <div className="container flex">
      <img className="logo" alt="" src={smileLogo} />
      <ul className="nav flex">
        <li><Link to="patients">Patients</Link></li>
        <li><Link to="questionnaire">Questionnaire</Link></li>
        <li><Link to="/">About</Link></li>
      </ul>
    </div>
  </div>
}

export default Navigation;
