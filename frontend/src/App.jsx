// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { HeaderSimple } from './components/Header/HeaderSimple.jsx';
import { Route, Routes } from 'react-router-dom';
import { Hero } from './pages/Hero/Hero.jsx';
import { Login } from './pages/Login/Login.jsx';
import { Register } from './pages/Register/Register.jsx';
import { NotFound } from './pages/NotFound/NotFound.jsx';
import { Profile } from './pages/Profile/Profile.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

export default function App() {
  return <MantineProvider>
      <HeaderSimple />
    <Routes>
      <Route path='/' element={<Hero/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='*' element={<NotFound/>} />
      
    </Routes>
  </MantineProvider>;
}