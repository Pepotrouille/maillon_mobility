import React, { useState, useEffect, useRef } from 'react';
import { LineChart, CartesianGrid, YAxis, Tooltip, Legend, Line } from 'recharts';

function Chart({heartRateData}) {

  return (
    <div>
      <h2>Evolution du rythme cardiaque</h2>
        <LineChart data={heartRateData.slice(-20)} width={400} height={400} margin={{ top: 50, bottom: 50, left:50, right:50}}>
            <YAxis domain={[50, 150]} />
            <Line type="monotone" dataKey="cardiac" stroke="#fc5e3f" activeDot={{r: 5}}/>
            <Tooltip/>
        </LineChart>
    </div>
  );
}

export default Chart;