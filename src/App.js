// src/App.js
import React from 'react';
import SerialPortComponent from './elements/SerialPortComponent';
import RadioButton from './elements/RadioButton';

function App() {
  const data = [
    { EFFORT_LEVEL: 'Stroll'},
    { EFFORT_LEVEL: 'Normal'},
    { EFFORT_LEVEL: 'Sport'},
  ];
  return (
    <div className="App">
      <header className="App-header">
        <h1>BLE Application with React and BleuIO</h1>
        
        <SerialPortComponent />
        <RadioButton data={data} />
      </header>
    </div>
  );
}

export default App;
