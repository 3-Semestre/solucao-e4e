import React from 'react';
import './ToggleButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const ToggleButton = ({ toggleSidebar }) => {
  return (
    <li>
      <a href="#">
        <FontAwesomeIcon icon={faBars} id="btn" onClick={toggleSidebar} />
      </a>
    </li>
  );
};

export default ToggleButton;


