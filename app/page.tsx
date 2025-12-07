"use client";

import { useState } from 'react';

type WheelData = {
  offset: number;
  camber: number;
  trackWidth: number;
  rideHeight: number;
};

type StanceData = {
  frontLeft: WheelData;
  frontRight: WheelData;
  rearLeft: WheelData;
  rearRight: WheelData;
};

export default function Home() {
  const [selectedWheel, setSelectedWheel] = useState(0);
  const [stanceData, setStanceData] = useState<StanceData>({
    frontLeft: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 },
    frontRight: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 },
    rearLeft: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 },
    rearRight: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 }
  });

  const wheelKeys: (keyof StanceData)[] = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'];
  const wheelNames = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'];
  const currentWheelKey = wheelKeys[selectedWheel];
  const currentData = stanceData[currentWheelKey];

  const updateValue = (key: keyof WheelData, value: number) => {
    setStanceData({
      ...stanceData,
      [currentWheelKey]: { ...currentData, [key]: value }
    });
  };

  const applyToAll = () => {
    const newData = { ...stanceData };
    wheelKeys.forEach(key => {
      newData[key] = { ...currentData };
    });
    setStanceData(newData);
  };

  const resetAll = () => {
    setStanceData({
      frontLeft: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 },
      frontRight: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 },
      rearLeft: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 },
      rearRight: { offset: 0, camber: 0, trackWidth: 0, rideHeight: 0 }
    });
  };

  const loadPreset = (preset: 'aggressive' | 'slammed') => {
    const presets: Record<string, StanceData> = {
      aggressive: {
        frontLeft: { offset: -0.05, camber: -3.5, trackWidth: 0.03, rideHeight: -0.03 },
        frontRight: { offset: -0.05, camber: -3.5, trackWidth: 0.03, rideHeight: -0.03 },
        rearLeft: { offset: -0.06, camber: -4.0, trackWidth: 0.04, rideHeight: -0.04 },
        rearRight: { offset: -0.06, camber: -4.0, trackWidth: 0.04, rideHeight: -0.04 }
      },
      slammed: {
        frontLeft: { offset: -0.08, camber: -8.0, trackWidth: 0.05, rideHeight: -0.08 },
        frontRight: { offset: -0.08, camber: -8.0, trackWidth: 0.05, rideHeight: -0.08 },
        rearLeft: { offset: -0.09, camber: -10.0, trackWidth: 0.06, rideHeight: -0.09 },
        rearRight: { offset: -0.09, camber: -10.0, trackWidth: 0.06, rideHeight: -0.09 }
      }
    };
    setStanceData(presets[preset]);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }
      `}</style>

      {/* Hero Section */}
      <header style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
          ⚙️ Real Time Stancer
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#64ffda', marginBottom: '10px' }}>
          VStancer-Style Stance Tuning for Assetto Corsa
        </p>
        <p style={{ fontSize: '1.1rem', color: '#aaa' }}>
          Live in-game stance adjustment using CSP Lua scripting
        </p>
      </header>

      {/* Features Section */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: '#64ffda' }}>
          Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { icon: '🎮', title: 'In-Game GUI', desc: 'Control stance while driving without leaving the game' },
            { icon: '⚡', title: 'Real-Time', desc: 'See changes instantly without reloading the car' },
            { icon: '🔧', title: 'Per-Wheel Control', desc: 'Individual adjustment for each wheel' },
            { icon: '💾', title: 'Save Presets', desc: 'Save and load custom stance configurations' },
            { icon: '📐', title: 'Full Control', desc: 'Adjust offset, camber, track width, ride height' },
            { icon: '✅', title: 'CSP 0.1.80+', desc: 'Built with latest Custom Shaders Patch' }
          ].map((feature, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(100,255,218,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#64ffda' }}>{feature.title}</h3>
              <p style={{ color: '#ccc', fontSize: '0.95rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section style={{ padding: '60px 20px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: '#64ffda' }}>
            Interactive Demo
          </h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(100,255,218,0.3)' }}>
            <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.1rem' }}>
              Select Wheel:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
              {wheelNames.map((name, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedWheel(i)}
                  style={{
                    padding: '15px',
                    background: selectedWheel === i ? '#64ffda' : 'rgba(100,255,218,0.1)',
                    color: selectedWheel === i ? '#000' : '#fff',
                    border: '2px solid ' + (selectedWheel === i ? '#64ffda' : 'rgba(100,255,218,0.3)'),
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(100,255,218,0.05)', borderRadius: '8px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#64ffda', fontWeight: 'bold' }}>
                Editing: {wheelNames[selectedWheel]}
              </p>

              {([
                { label: 'Wheel Offset', key: 'offset' as keyof WheelData, min: -0.2, max: 0.2, step: 0.01, unit: 'm' },
                { label: 'Track Width', key: 'trackWidth' as keyof WheelData, min: -0.2, max: 0.2, step: 0.01, unit: 'm' },
                { label: 'Camber', key: 'camber' as keyof WheelData, min: -15, max: 15, step: 0.5, unit: '°' },
                { label: 'Ride Height', key: 'rideHeight' as keyof WheelData, min: -0.1, max: 0.1, step: 0.01, unit: 'm' }
              ] as const).map((slider) => (
                <div key={slider.key} style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', color: '#ccc' }}>
                    {slider.label}: <span style={{ color: '#64ffda', fontWeight: 'bold' }}>
                      {currentData[slider.key].toFixed(slider.unit === '°' ? 1 : 3)}{slider.unit}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={currentData[slider.key]}
                    onChange={(e) => updateValue(slider.key, parseFloat(e.target.value))}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={applyToAll}
                style={{
                  padding: '15px',
                  background: 'rgba(100,255,218,0.2)',
                  color: '#fff',
                  border: '2px solid #64ffda',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Apply to All
              </button>
              <button
                onClick={resetAll}
                style={{
                  padding: '15px',
                  background: 'rgba(255,100,100,0.2)',
                  color: '#fff',
                  border: '2px solid #ff6464',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Reset All
              </button>
            </div>

            <p style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1rem', color: '#aaa' }}>
              Load Preset:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => loadPreset('aggressive')}
                style={{
                  padding: '12px',
                  background: 'rgba(255,200,0,0.2)',
                  color: '#fff',
                  border: '2px solid #ffc800',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Aggressive
              </button>
              <button
                onClick={() => loadPreset('slammed')}
                style={{
                  padding: '12px',
                  background: 'rgba(255,0,200,0.2)',
                  color: '#fff',
                  border: '2px solid #ff00c8',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Slammed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: '#64ffda' }}>
          Installation
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(100,255,218,0.2)' }}>
          <ol style={{ fontSize: '1.1rem', lineHeight: '2', paddingLeft: '20px' }}>
            <li>Install <strong style={{ color: '#64ffda' }}>Custom Shaders Patch 0.1.80+</strong></li>
            <li>Copy <code style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px' }}>content/</code> folder to your Assetto Corsa directory</li>
            <li>Launch Assetto Corsa with CSP enabled</li>
            <li>Enable <strong style={{ color: '#64ffda' }}>Real Time Stancer</strong> in the app menu during gameplay</li>
            <li>Start adjusting your stance in real-time! 🚗💨</li>
          </ol>
        </div>
      </section>

      {/* Download */}
      <section style={{ padding: '60px 20px', background: 'rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#64ffda' }}>
          Download
        </h2>
        <div style={{ display: 'inline-block', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '2px solid #64ffda' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            📦 Real Time Stancer v1.0
          </p>
          <p style={{ fontSize: '0.95rem', color: '#aaa', marginBottom: '25px' }}>
            CSP Lua App for Assetto Corsa<br/>
            File structure: content/apps/lua/RealTimeStancer/
          </p>
          <div style={{ fontSize: '0.9rem', color: '#64ffda', fontFamily: 'monospace', textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px' }}>
            content/apps/lua/RealTimeStancer/<br/>
            ├── app.lua<br/>
            ├── config_presets.json<br/>
            ├── icon.png<br/>
            ├── manifest.ini<br/>
            └── ui/layout.ini
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.5)' }}>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Real Time Stancer v1.0 | Created for the Assetto Corsa Community
        </p>
        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '10px' }}>
          Inspired by VStancer for GTA V | Requires CSP 0.1.80+
        </p>
      </footer>
    </div>
  );
}
