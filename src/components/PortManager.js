import { useState } from 'react';
import { createPort, deletePort, updatePort } from '../services/airlineApi';

const emptyPortForm = {
  name: '',
  code: '',
};

function PortManager({ ports = [], loading = false, error = '', onPortsUpdated }) {
  const [form, setForm] = useState(emptyPortForm);
  const [editingPortId, setEditingPortId] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
    };

    if (!payload.name || !payload.code) {
      setMessage('Port name and code are required.');
      return;
    }

    setBusy(true);

    try {
      if (editingPortId) {
        await updatePort(editingPortId, payload);
        setMessage('Port updated successfully.');
      } else {
        await createPort(payload);
        setMessage('Port created successfully.');
      }

      setForm(emptyPortForm);
      setEditingPortId(null);

      if (onPortsUpdated) {
        await onPortsUpdated();
      }
    } catch (err) {
      setMessage(err.message || 'Unable to save port.');
    } finally {
      setBusy(false);
    }
  }

  function handleEdit(port) {
    setEditingPortId(port.id);
    setForm({
      name: port.name || '',
      code: port.code || '',
    });
    setMessage(`Editing ${port.code}.`);
  }

  function handleCancelEdit() {
    setEditingPortId(null);
    setForm(emptyPortForm);
    setMessage('');
  }

  async function handleDelete(port) {
    if (!window.confirm(`Delete ${port.code} - ${port.name}?`)) {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      await deletePort(port.id);

      if (editingPortId === port.id) {
        handleCancelEdit();
      }

      setMessage('Port deleted successfully.');

      if (onPortsUpdated) {
        await onPortsUpdated();
      }
    } catch (err) {
      setMessage(err.message || 'Unable to delete port.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="port-manager" aria-label="Port management">
      <div className="port-manager__header">
        <div>
          <span className="eyebrow">Port admin</span>
          <h3>Manage origin and destination ports</h3>
          <p>
            Add, update, or remove ports from the live service, then use the same data for fare searches.
          </p>
        </div>
        <div className="port-manager__count">
          {loading ? 'Loading ports...' : `${ports.length} live ports`}
        </div>
      </div>

      {error && <div className="status-message status-message--error">{error}</div>}

      <div className="port-manager__layout">
        <form className="port-manager__form" onSubmit={handleSubmit}>
          <div className="port-manager__form-head">
            <h4>{editingPortId ? 'Edit port' : 'Add new port'}</h4>
            {editingPortId && (
              <button type="button" className="button button--secondary port-manager__cancel" onClick={handleCancelEdit}>
                Cancel edit
              </button>
            )}
          </div>

          <label>
            Port name
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Dubai International Airport"
            />
          </label>

          <label>
            Port code
            <input
              value={form.code}
              onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
              placeholder="DXB"
              maxLength={8}
            />
          </label>

          <div className="port-manager__actions">
            <button className="button button--primary" type="submit" disabled={busy}>
              {busy ? 'Saving...' : editingPortId ? 'Update port' : 'Create port'}
            </button>
          </div>

          {message && <div className="status-message">{message}</div>}
        </form>

        <div className="port-manager__list" aria-live="polite">
          {loading ? (
            <div className="port-manager__empty">Loading the current port inventory.</div>
          ) : ports.length === 0 ? (
            <div className="port-manager__empty">No ports are available yet.</div>
          ) : (
            ports.map((port) => (
              <article className="port-card" key={port.id}>
                <div>
                  <span className="port-card__code">{port.code}</span>
                  <h4>{port.name}</h4>
                </div>
                <div className="port-card__actions">
                  <button type="button" className="button button--secondary" onClick={() => handleEdit(port)} disabled={busy}>
                    Edit
                  </button>
                  <button type="button" className="button button--secondary" onClick={() => handleDelete(port)} disabled={busy}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default PortManager;
