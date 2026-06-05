import { useState } from 'react';
import { searchFares } from '../services/airlineApi';

function getPortLabel(port) {
  if (!port) {
    return '';
  }

  return `${port.code} - ${port.name}`;
}

function formatDateTime(value) {
  if (!value) {
    return 'Not provided';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

function FareSearch({ ports = [], loadingPorts = false, portsError = '' }) {
  const [originPortId, setOriginPortId] = useState('');
  const [destinationPortId, setDestinationPortId] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const portById = new Map(ports.map((port) => [String(port.id), port]));

  async function handleSearch(event) {
    event.preventDefault();
    setError('');
    setResults(null);

    if (!originPortId || !destinationPortId || !date) {
      setError('Please select an origin port, destination port, and travel date.');
      return;
    }

    if (originPortId === destinationPortId) {
      setError('Origin and destination ports must be different.');
      return;
    }

    setSearching(true);

    try {
      const fares = await searchFares({
        originPortId,
        destinationPortId,
        date,
      });
      setResults(Array.isArray(fares) ? fares : []);
    } catch (err) {
      setError(err.message || 'Unable to search fares.');
      setResults(null);
    }
    finally {
      setSearching(false);
    }
  }

  return (
    <section className="fare-search">
      <div className="fare-search__header">
        <div>
          <span className="eyebrow">Search fares</span>
          <h3>Find fares with live ports</h3>
        </div>
        <p>
          Pick origin and destination from the live port service so the search matches the backend data.
        </p>
      </div>

      {portsError && <div className="status-message status-message--error">{portsError}</div>}

      <form className="fare-search__form" onSubmit={handleSearch} aria-label="Find fares">
        <div className="fare-search__row">
          <label>
            Origin
            <select value={originPortId} onChange={(event) => setOriginPortId(event.target.value)} aria-label="Origin port" disabled={loadingPorts || ports.length === 0}>
              <option value="">Select origin port</option>
              {ports.map((port) => (
                <option key={port.id} value={port.id}>
                  {getPortLabel(port)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Destination
            <select value={destinationPortId} onChange={(event) => setDestinationPortId(event.target.value)} aria-label="Destination port" disabled={loadingPorts || ports.length === 0}>
              <option value="">Select destination port</option>
              {ports.map((port) => (
                <option key={port.id} value={port.id}>
                  {getPortLabel(port)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Travel date"
            />
          </label>
        </div>

        <div className="fare-search__actions">
          <button className="button button--primary" type="submit" disabled={searching || loadingPorts || ports.length === 0}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loadingPorts && <div className="fare-search__hint">Loading ports from the live service.</div>}
      {!loadingPorts && ports.length === 0 && !portsError && (
        <div className="fare-search__hint">No ports are available yet. Add one below before searching.</div>
      )}

      {error && <div className="fare-search__error">{error}</div>}

      {results && (
        <div className="fare-search__results">
          {results.length === 0 ? (
            <div className="fare-search__empty">No fares found for the selected route and date.</div>
          ) : (
            <ul>
              {results.map((f) => (
                <li key={f.id} className="fare-search__item">
                  <div>
                    <strong>{f.flight?.airline || `Flight ${f.flight_id || f.id}`}</strong>
                    <div className="fare-search__meta">Fare #{f.id}</div>
                  </div>
                  <div>
                    {getPortLabel(portById.get(String(f.origin_port_id))) || f.origin_port_id} → {getPortLabel(portById.get(String(f.destination_port_id))) || f.destination_port_id}
                  </div>
                  <div>
                    Depart {formatDateTime(f.departure_time)}
                  </div>
                  <div>
                    Arrive {formatDateTime(f.arrival_time)}
                  </div>
                  <div className="fare-search__price">Amount {f.amount}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export default FareSearch;
