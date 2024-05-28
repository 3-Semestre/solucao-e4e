import React, { useState } from 'react';
import './Sidebar.css';
import ToggleButton from '../ToggleButton/ToggleButton';
import SidebarItem from '../SidebarItem/SidebarItem';
import { faHouse, faCallendar, faSliders, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { PiStudentBold } from "react-icons/pi";
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={`sidebar ${isActive ? 'active' : ''}`}>
      <ul className="nav-links">
        <ToggleButton toggleSidebar={toggleSidebar} />
        <SidebarItem icon={faHouse} text="Página inicial" />
        <SidebarItem icon={faCalendar} text="Calendário" />PiStudentBold
        <SidebarItem icon={PiStudentBold} text="Alunos" />
        <SidebarItem icon={faArrowRightFromBracket} text="Sair" />
      </ul>
    </nav>
  );
};

export default Sidebar;
