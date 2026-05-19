import { useState, useEffect } from "react";

const WEEKDAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return {
    week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7),
    year: d.getUTCFullYear()
  };
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  return Math.floor(diff / 86400000);
}

function todayString() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
}

export default function App() {
  const [dateVal, setDateVal] = useState(todayString());
  const [result, setResult] = useState(null);
  const [visible, setVisible] = useState(false);

  function calculate(val) {
    const v = val ?? dateVal;
    if (!v) return;
    const [y, m, d] = v.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const { week, year } = getISOWeek(date);
    setVisible(false);
    setTimeout(() => {
      setResult({
        kw: String(week).padStart(2, '0'),
        kwYear: year,
        weekday: WEEKDAYS[date.getDay()],
        formatted: `${d}. ${MONTHS[m-1]} ${y}`,
        quarter: `Q${Math.ceil(m / 3)} / ${y}`,
        doy: getDayOfYear(date),
      });
      setVisible(true);
    }, 50);
  }

  useEffect(() => { calculate(todayString()); }, []);

  function handleChange(e) {
    setDateVal(e.target.value);
    calculate(e.target.value);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0e0e10', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
      fontFamily: "'Courier New', monospace"
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(200,240,96,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,96,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        background: '#18181c', border: '1px solid #2e2e36',
        borderRadius: '20px', padding: '2.5rem 3rem',
        maxWidth: '440px', width: '100%',
        boxShadow: '0 0 80px rgba(200,240,96,0.07), 0 8px 48px rgba(0,0,0,0.6)'
      }}>
        {/* Header */}
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8f060', marginBottom: '0.4rem' }}>
          Tool
        </div>
        <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#f0ede6', marginBottom: '0.2rem', lineHeight: 1.1 }}>
          Kalender<span style={{ color: '#c8f060' }}>woche</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6a6a78', marginBottom: '2rem' }}>
          Datum eingeben → KW sofort anzeigen
        </div>

        {/* Date Input */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a78', marginBottom: '0.5rem' }}>
            Datum
          </div>
          <input
            type="date"
            value={dateVal}
            onChange={handleChange}
            style={{
              width: '100%', background: '#0e0e10', border: '1px solid #2e2e36',
              borderRadius: '10px', color: '#f0ede6', fontFamily: "'Courier New', monospace",
              fontSize: '1rem', padding: '0.8rem 1rem', outline: 'none',
              boxSizing: 'border-box', cursor: 'pointer',
              colorScheme: 'dark'
            }}
          />
        </div>

        {/* Today button */}
        <button
          onClick={() => { const t = todayString(); setDateVal(t); calculate(t); }}
          style={{
            background: 'transparent', border: '1px solid #2e2e36',
            borderRadius: '8px', color: '#6a6a78', fontFamily: "'Courier New', monospace",
            fontSize: '0.72rem', padding: '0.4rem 0.85rem', cursor: 'pointer',
            marginBottom: '1rem', letterSpacing: '0.05em'
          }}
        >
          ↩ Heute
        </button>

        {/* Result */}
        {result && (
          <div style={{
            borderTop: '1px solid #2e2e36', paddingTop: '1.75rem', marginTop: '0.5rem',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease'
          }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6a6a78', marginBottom: '0.5rem' }}>
              Ergebnis
            </div>

            {/* Big KW */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.95rem', color: '#6a6a78' }}>KW</span>
              <span style={{
                fontSize: '5rem', lineHeight: 1, color: '#c8f060', fontWeight: 'bold',
                textShadow: '0 0 40px rgba(200,240,96,0.3)'
              }}>
                {result.kw}
              </span>
              <span style={{ fontSize: '1rem', color: '#6a6a78', paddingBottom: '0.5rem' }}>
                / {result.kwYear}
              </span>
            </div>

            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[
                { key: 'Wochentag', val: result.weekday },
                { key: 'Datum', val: result.formatted },
                { key: 'Quartal', val: result.quarter },
                { key: 'Tag des Jahres', val: `${result.doy}. von 365` },
              ].map(({ key, val }) => (
                <div key={key} style={{
                  background: '#0e0e10', border: '1px solid #2e2e36',
                  borderRadius: '8px', padding: '0.7rem 0.9rem'
                }}>
                  <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a6a78', marginBottom: '0.25rem' }}>
                    {key}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#f0ede6' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
