import { useState } from 'react';
import { findFares } from '../data/fares';

function FareSearch() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    setError('');
    if (!origin || !destination || !date) {
      setError('Please enter origin, destination and date');
      setResults(null);
      return;
    }
    const fares = findFares({ origin, destination, date });
    setResults(fares);
  }

  return (
    <section className="fare-search">
      <h3>Find fares</h3>
      <form className="fare-search__form" onSubmit={handleSearch} aria-label="Find fares">
        <div className="fare-search__row">
          <label>
            Origin
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. DXB"
              aria-label="Origin"
            />
          </label>

          <label>
            Destination
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. NBO"
              aria-label="Destination"
            />
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
          <button className="button button--primary" type="submit">Search</button>
        </div>
      </form>

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
                    <strong>{f.airline}</strong> — {f.cabin}
                  </div>
                  <div>
                    {f.origin} → {f.destination} • {f.date}
                  </div>
                  <div className="fare-search__price">{f.currency} {f.price}</div>
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
