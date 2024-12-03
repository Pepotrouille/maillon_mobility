import React, { useState, useEffect } from 'react';

const SerialPortComponent = () => {
  const [port, setPort] = useState(null);
  const [output, setOutput] = useState('');
  const [reader, setReader] = useState(null);
  const [writer, setWriter] = useState(null);

  const connectToSerialPort = async () => {
    try {
      // Request a port and open a connection.
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = selectedPort.readable.pipeTo(
        textDecoder.writable
      );
      const reader = textDecoder.readable.getReader();
      setReader(reader);

      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(
        selectedPort.writable
      );
      const writer = textEncoder.writable.getWriter();
      setWriter(writer);

      // Read data from the serial port.
      readSerialData(reader);
    } catch (error) {
      console.error('There was an error opening the serial port:', error);
    }
  };

  const readSerialData = async (reader) => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        // Convert the received data to a string and update the state.
        setOutput((prevOutput) => prevOutput + value);
      }
    } catch (error) {
      console.error('Error reading from the serial port:', error);
    }
  };

  const writeToSerialPort = async () => {
    setOutput('');
    try {
      if (writer) {
        // Send AT+CENTRAL command
        await writer.write('AT+CENTRAL\r');
        setOutput((prevOutput) => prevOutput + 'AT+CENTRAL\r\n');

        // Wait for a short while to ensure the command is processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Send AT+GAPSCAN=3 command
        await writer.write('AT+GAPSCAN=3\r');
        setOutput((prevOutput) => prevOutput + 'AT+GAPSCAN=3\r\n');

        // Wait for scan to complete and read response
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Read and process data from the serial port
        let scanData = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          scanData += value;
        }
        setOutput((prevOutput) => prevOutput + scanData);
      } else {
        console.error('Writer not available');
      }
    } catch (error) {
      console.error('Error writing to the serial port:', error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup function to close port when component unmounts
      if (port) {
        port.close();
      }
      if (reader) {
        reader.releaseLock();
      }
      if (writer) {
        writer.releaseLock();
      }
    };
  }, [port, reader, writer]);

  return (
    <div className="mt-5">
      <button
        className="btn btn-success me-2"
        onClick={connectToSerialPort}
        disabled={!!port}
      >
        Connect to BleuIO
      </button>
      <button
        className="btn btn-warning me-2"
        onClick={writeToSerialPort}
        disabled={!writer}
      >
        Scan for nearby BLE devices for 3 seconds
      </button>

      {output && (
        <div>
          <h3>Response from the BleuIO:</h3> <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default SerialPortComponent;