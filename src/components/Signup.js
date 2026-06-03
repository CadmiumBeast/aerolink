import { useState } from 'react';
import { signUp, confirmSignUp } from '../aws/cognito';

function Signup({ onClose }) {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('form'); // 'form' or 'confirm' or 'done'
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!birthdate) {
      setMessage('Birthday is required.');
      return;
    }

    try {
      await signUp({ email, phoneNumber, givenName, familyName, birthdate, password });
      setStep('confirm');
      setMessage('Signup initiated. Please check your email or phone for a verification code.');
    } catch (err) {
      setMessage(err.message || 'Signup failed');
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setMessage('');
    try {
      await confirmSignUp({ email, code });
      setStep('done');
      setMessage('Account confirmed. You can now login.');
    } catch (err) {
      setMessage(err.message || 'Confirmation failed');
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section className="modal-card auth-page" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close signup modal">×</button>
        <div className="modal-header">
          <span className="eyebrow">Passenger signup</span>
          <h2 id="signup-modal-title">Create your AeroLink account</h2>
        </div>

        {step === 'form' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid auth-grid--two">
              <label>
                First name
                <input className="auth-input" value={givenName} onChange={(e) => setGivenName(e.target.value)} />
              </label>
              <label>
                Last name
                <input className="auth-input" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
              </label>
            </div>
            <label>
              Birthday
              <input className="auth-input" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </label>
            <label>
              Email
              <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Phone number
              <input
                className="auth-input"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+250700000000"
              />
            </label>
            <label>
              Password
              <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
              Confirm password
              <input
                className="auth-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <div className="auth-actions auth-actions--split">
              <button className="button button--secondary" type="button" onClick={onClose}>Cancel</button>
              <button className="button button--primary" type="submit">Create account</button>
            </div>
          </form>
        )}

        {step === 'confirm' && (
          <form className="auth-form" onSubmit={handleConfirm}>
            <label>
              Confirmation code
              <input className="auth-input" value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <div className="auth-actions auth-actions--split">
              <button className="button button--secondary" type="button" onClick={onClose}>Close</button>
              <button className="button button--primary" type="submit">Confirm</button>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="auth-confirmation">
            <p>{message}</p>
            <div className="auth-actions auth-actions--split">
              <button className="button button--secondary" type="button" onClick={onClose}>Close</button>
              <a href="#/login" className="button button--primary" onClick={onClose}>Go to login</a>
            </div>
          </div>
        )}

        {message && step !== 'done' && <div className="auth-message">{message}</div>}
      </section>
    </div>
  );
}

export default Signup;
