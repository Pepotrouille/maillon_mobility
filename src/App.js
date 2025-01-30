import React, { useState, useEffect } from 'react';
import './App.css';
import BLECommunicationESP from './elements/BLECommunicationESP';
import Chart from './custom_modules/Chart'

function App() {

  const [activities, setActivities] = useState([
    { name: 'Rythme Cardiaque', comment: 'Gardez un rythme stable.' },
  ]);
  const effortLevelList = ['Balade', 'Normal', 'Intensif'];
  const [effortLevel, setEffortLevel] = useState("");
  const [heartRate, setHeartRate] = useState(0);
  const [heartRateData, setHeartRateData] = useState([]);
  const [bleCommunicationESP, setBleCommunicationESP] = useState(new BLECommunicationESP());
  const [isConnecting, setIsConnecting] = useState(false);

//-----------------------------------Effects------------------------
  // Initialize effort level
  useEffect(() => {
    changeEffortLevel("Normal");
  }, []);

  // Check connection status
  useEffect(() => {
    const interval = setInterval(() => {
      bleCommunicationESP.checkConnectionStatus().then((status) => {
        if (status !== bleCommunicationESP.server) {
          setBleCommunicationESP({ ...bleCommunicationESP, server: status });
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [bleCommunicationESP]);

  // USEFUL?
  useEffect(() => {
    const interval = setInterval(() => {
      handleReadHeartRate()
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

//-----------------------------------Handle------------------------
  const changeEffortLevel = (newEffortLevel) => {
    const value = effortLevelList.indexOf(newEffortLevel);
    console.log("New level of effort: " + value);
    setEffortLevel(newEffortLevel);
    bleCommunicationESP.sendBluetoothDataLevelOfEffort(value);
  };
  
  const handleReadHeartRate = async () => {
    try {
      const newHeartRate = bleCommunicationESP.current_heart_rate
      setHeartRate(newHeartRate);
      setHeartRateData((prevData) => [...prevData, { time: Date.now(), cardiac: newHeartRate }])
      
    } catch (error) {
      console.error('Failed to read heart rate:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await bleCommunicationESP.connectToDevice();
      setBleCommunicationESP({ ...bleCommunicationESP });
    } catch (error) {
      console.error('Failed to connect to device:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Title">Maillon Mobility</h1>
        <p className="Subtitle">Tracker cardiaque</p>
      </header>
      <main>
        <div className="container text-center">
          {bleCommunicationESP.server === null ? (
            <button className="other-button" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connecter un appareil en Bluetooth'}
            </button>
          ) : (
            <div>
              <button className="other-button" onClick={() => {
                bleCommunicationESP.disconnectDevice().then(() => {
                  setBleCommunicationESP({ ...bleCommunicationESP, server: null });
                });
              }}>
                Déconnecter le Bluetooth
              </button>
            </div>
          )}
        </div>
        <div className="activity-container">
          {activities.map((activity) => (
            <div
              key={activity.name}
              className={`activity-card`}
            >
              <i className="fas fa-heart-pulse"></i>
              <h3>{activity.name}</h3>
              <p>
                {activity.name.includes('Rythme Cardiaque') && heartRate}
              </p>
              <p className="comment">{activity.comment}</p>
            </div>
          ))}
        </div>
        
        <div className="chart-div">
          <div>
            <h2>Evolution du rythme cardiaque</h2>
            <Chart heartRateData={heartRateData} />
          </div>
        </div>
        
        <div className="effort-level">
          <h2>Niveau d'effort</h2>
          <div className="effort-buttons">
            {effortLevelList.map(
              (level) => (
                <button
                  key={level}
                  onClick={() => changeEffortLevel(level)}
                  className={"other-button"}
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
