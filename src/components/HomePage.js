import { features, serviceTiles } from '../data/homepageContent';
import FareSearch from './FareSearch';

function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero__background hero__background--one" />
        <div className="hero__background hero__background--two" />

        <nav className="topbar" aria-label="Primary">
          <div className="topbar__brand-wrap">
            <img src="/logo-aerolink.png" alt="AeroLink" className="topbar__logo" />
          </div>

          <div className="topbar__actions">
            <a href="#services">Services</a>
            <a href="#auth">Access account</a>
          </div>
        </nav>

        <div className="hero__content">
          <div className="hero__copy">
            <span className="eyebrow">Airline booking platform</span>
            <h1>Elegant flight booking experiences built for scale.</h1>
            <p className="hero__description">
              AeroLink is designed to showcase premium signup, login, fare management,
              and baggage handling in a modern interface that feels fast, clear, and trustworthy.
            </p>

            <div className="hero__cta">
              <a className="button button--primary" href="#auth">
                Start booking
              </a>
              <a className="button button--secondary" href="#services">
                Explore services
              </a>
            </div>

            <FareSearch />

            <dl className="hero__stats">
              <div>
                <dt>Booking-ready</dt>
                <dd>24/7</dd>
              </div>
              <div>
                <dt>Fare clarity</dt>
                <dd>100%</dd>
              </div>
              <div>
                <dt>Cloud fit</dt>
                <dd>AWS</dd>
              </div>
            </dl>
          </div>

          <aside className="hero__panel" id="auth" aria-label="Account access and trip summary">
            <div className="hero__panel-header">
              <span className="panel-pill panel-pill--active">Secure access</span>
              <span className="panel-pill">Live fares</span>
            </div>

            <div className="auth-card">
              <h2>Account access</h2>
              <p>Keep passengers and staff moving with a polished login and signup experience.</p>
              <div className="auth-card__buttons">
                <a href="#auth" className="button button--dark">Login</a>
                <a href="#auth" className="button button--ghost">Signup</a>
              </div>
            </div>

            <div className="fare-card">
              <div>
                <span className="fare-card__label">Sample fare</span>
                <strong>Dubai to Nairobi</strong>
              </div>
              <div className="fare-card__price">$420</div>
            </div>

            <div className="baggage-card">
              <span className="fare-card__label">Baggage handling</span>
              <p>Carry-on, checked luggage, and special handling rules organized for quick review.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section__heading">
          <span className="eyebrow">Core features</span>
          <h2>Built around the airline operations that matter most.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-card__metric">{feature.metric}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--split">
        <div className="section__heading">
          <span className="eyebrow">Platform focus</span>
          <h2>A clean visual system that can grow with the AWS backend later.</h2>
        </div>

        <div className="service-list">
          {serviceTiles.map((tile) => (
            <div className="service-list__item" key={tile}>
              {tile}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;