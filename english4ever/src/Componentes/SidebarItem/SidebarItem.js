import React from 'react';
import './SidebarItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarItem = ({ icon, text }) => {

  return (
    <li>
      <a href="#">
        <FontAwesomeIcon icon={icon} />
        <span>{text}</span>
      </a>
    </li>
  );
  
};

export default SidebarItem;
