import React, { useEffect } from 'react';
import { UserTable } from './components/GenericTable';
import { fetchUsers } from './services/api';

function App() {

  useEffect(()=>{
    fetchUsers();
  },[]);

  return (
    <div className="App">
      <UserTable/>
    </div>
  );
}

export default App;
