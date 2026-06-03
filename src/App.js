import './App.css';
import { useEffect, useState } from 'react';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aerolink_user') || 'null');
    } catch {
      return null;
    }
  });
  const isAuthModal = route.startsWith('#/signup') || route.startsWith('#/login');

  useEffect(() => {
    function onHash() {
      setRoute(window.location.hash || '#/');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isAuthModal);
    return () => document.body.classList.remove('modal-open');
  }, [isAuthModal]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape' && isAuthModal) {
        window.location.hash = '#/';
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAuthModal]);

  const closeModal = () => {
    window.location.hash = '#/';
  };

  const activeModal = route.startsWith('#/signup')
    ? <Signup onClose={closeModal} />
    : route.startsWith('#/login')
      ? <Login
          onClose={closeModal}
          onLogin={(user) => {
            setCurrentUser(user);
            closeModal();
          }}
        />
      : null;

  const handleLogout = () => {
    localStorage.removeItem('aerolink_id_token');
    localStorage.removeItem('aerolink_user');
    setCurrentUser(null);
    closeModal();
  };

  return (
    <>
      <HomePage currentUser={currentUser} onLogout={handleLogout} />
      {activeModal}
    </>
  );
}

export default App;
