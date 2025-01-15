import React, { useState, useEffect } from 'react';
import './App.css';
import BLECommunicationESP from './elements/BLECommunicationESP';
import HeartRateGenerator from './elements/HeartRateGenerator';

function App() {

  const [theme, setTheme] = useState('light-mode');
  const [activities, setActivities] = useState([
    { name: 'Heart Rate ❤️', comment: 'Gardez un rythme stable.' },
  ]);
  const [effortLevel, setEffortLevel] = useState('');
  const [heartRate, setHeartRate] = useState('N/A');
  const [bleCommunicationESP, setBleCommunicationESP] = useState(new BLECommunicationESP());
  const heartRateGenerator = new HeartRateGenerator();

  // Toggle light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  // Add or remove activities in "Accueil"
  const toggleActivity = (name) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.name === name ? { ...activity, added: !activity.added } : activity
      )
    );
  };

  // Rerender the communication component
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to re-evaluate the condition
      setBleCommunicationESP({ ...bleCommunicationESP });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [bleCommunicationESP]);

  // Fetch heart rate from the random generator
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(heartRateGenerator.getHeartRate());
    }, 1000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [bleCommunicationESP]);

  // Update body class when theme changes
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fitness Tracker App</h1>

        <div className="container text-center">
          <h1>Bluetooth Connector</h1>
          <p>Connect your Android device to a Bluetooth device.</p>
    
          {bleCommunicationESP.server === null ? (
            <button className="btn btn-danger" onClick={() => {
              bleCommunicationESP.connectToDevice().then(() => {
                setBleCommunicationESP({ ...bleCommunicationESP });
              });
            }}>
              Connect to devices
            </button>
          ) : (
            <div>
              <button className="btn btn-danger" onClick={() => {
                bleCommunicationESP.sendBluetoothDataHeartRate(heartRateGenerator.getHeartRate());
                setBleCommunicationESP({ ...bleCommunicationESP });
              }}>
                Send Heart Rate
              </button>
              <button className="btn btn-danger" onClick={() => {
                bleCommunicationESP.sendBluetoothDataLevelOfEffort(4);
                setBleCommunicationESP({ ...bleCommunicationESP });
              }}>
                Send Level of Effort
              </button>
              <button className="btn btn-danger" onClick={() => {
                bleCommunicationESP.disconnectDevice();
                setBleCommunicationESP({ ...bleCommunicationESP });
              }}>
                Disconnect
              </button>
            </div>
          )}
        </div>

        <button onClick={toggleTheme}>Toggle Theme</button>
      </header>

      <main>
        <h2>Accueil</h2>
        <div className="stats-container">
          {activities
            .map((activity) => (
              <div
                key={activity.name}
                className={`stat-card ${theme === 'dark-mode' ? 'dark' : ''}`}
              >
                <h2>{activity.name}</h2>
                <p>
                  {activity.name.includes('Heart Rate') && heartRate}
                </p>
                <p className="comment">{activity.comment}</p>
              </div>
            ))}
        </div>

        <div className="effort-level">
          <h2>Niveau d'effort</h2>
          <div className="effort-buttons">
            {['Mode Balade', 'Sport', 'Intensif', 'Relax', 'Performance'].map(
              (level) => (
                <button
                  key={level}
                  onClick={() => setEffortLevel(level)}
                  className={theme === 'dark-mode' ? 'dark' : ''}
                  style={{
                    color: theme === 'dark-mode' ? 'white' : 'black',
                  }}
                >
                  {level}
                </button>
              )
            )}
          </div>
          {effortLevel && <p>Niveau sélectionné : {effortLevel}</p>}
        </div>
      </main>
    </div>
  );
}

export default App;
