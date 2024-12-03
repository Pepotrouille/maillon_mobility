// src/App.js
import React from 'react';
import SerialPortComponent from './SerialPortComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>BLE Application with React and BleuIO</h1>
        <SerialPortComponent />
      </header>
    </div>
  );
}

export default App;
