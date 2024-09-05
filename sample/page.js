"use client"
import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set up Server-Sent Events (SSE)
    const eventSource = new EventSource('http://localhost:5001/events');

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log('this is event',event)
      setMessages((prevMessages) => [...prevMessages, newMessage.value]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const sendMessage = async () => {
    await fetch('http://localhost:5001/send?mesg='+message, {method:'POST'});
    setMessage('');
  };

  return (
    <div className="App">
      <h1>Kafka UI with Server-Sent Events</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h2>Messages:</h2>
      <ul>
        {Array.isArray(messages) ? messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        )):null}
      </ul>
    </div>
  );
}

export default App;
