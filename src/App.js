import classes from './App.module.css';

import { Routes, Route, Navigate } from 'react-router-dom';

// pages
import AddPage from './pages/Add/AddPage';
import Update from './pages/Update/UpdatePage';

// other components
import AppLayout from './HOR/AppLayout/AppLayout';

function App() {
  return (
    <div className={classes.App}>
      <AppLayout>
        <Routes>
          <Route path='/' element={<Navigate to='/add'/>} />
          <Route path='/add' element={<AddPage />} />
          <Route path='/update' element={<Update />} />
        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;
