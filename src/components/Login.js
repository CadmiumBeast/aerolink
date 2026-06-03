import { useState } from 'react';
import { login } from '../aws/cognito';

function Login({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const session = await login({ email, password });
      // store id token for demo usage - in real apps use secure storage and refresh handling
      const idToken = session.getIdToken().getJwtToken();
      const payload = session.getIdToken().payload;
      const displayName = payload.name || [payload.given_name, payload.family_name].filter(Boolean).join(' ') || payload.email || email;
      const username = payload.email || email;
      localStorage.setItem('aerolink_id_token', idToken);
      localStorage.setItem('aerolink_user', JSON.stringify({ email: username, displayName }));
      if (onLogin) onLogin({ email: username, displayName });
      setMessage('Login successful');
    } catch (err) {
      setMessage(err.message || 'Login failed');
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section className="modal-card auth-page" role="dialog" aria-modal="true" aria-labelledby="login-modal-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close login modal">×</button>
        <div className="modal-header">
          <span className="eyebrow">Passenger login</span>
          <h2 id="login-modal-title">Login to your AeroLink account</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="auth-actions auth-actions--split">
            <button className="button button--secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button--primary" type="submit">Login</button>
          </div>
        </form>

        {message && <div className="auth-message">{message}</div>}
      </section>
    </div>
  );
}

export default Login;
