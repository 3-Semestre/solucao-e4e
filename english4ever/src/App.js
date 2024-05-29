import React from 'react';
import './App.css';
import Sidebar from './Componentes/Sidebar/Sidebar';
import Breadcrumbs from './Componentes/Breadcrump/Breadcrumb';
import BoxProfile from './Componentes/BoxProfile/BoxProfile';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className='teste'>
        Essa vai ser a div de conteúdo principal
      </div>
        <BoxProfile />
    </div>
  );
}

export default App;
// npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
// npm que faz funcionar o awesome icons
// npm install react-icons --save
// outra blib de icon