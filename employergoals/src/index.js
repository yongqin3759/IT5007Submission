import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SignupPage from './views/SignupPage'
import AboutPage from './views/About'
import { AuthContextProvider } from './context/authContext';
import 'react-toastify/dist/ReactToastify.css';

import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import App from './App';
import EmployeeGoalsPage from './views/EmployeeGoalsPage';

ReactDOM.render(<Router>
  <AuthContextProvider>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path='/employee-goals' element={<EmployeeGoalsPage />} />
    </Routes>
  </AuthContextProvider>
</Router>,
  document.getElementById('root'));
