import { createContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import LoginRegister from './pages/LoginRegister';
import './App.css';

export const AuthContext = createContext();

const getSavedUser = () => {
  const savedUser = localStorage.getItem('alzikrayatUser');
  return savedUser ? JSON.parse(savedUser) : null;
};

function App() {
  const [user, setUser] = useState(getSavedUser);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('alzikrayatUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alzikrayatUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
