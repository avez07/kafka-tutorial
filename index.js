const express = require('express');
const { Kafka } = require('./client');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());



const producer = Kafka.producer();
const consumer = Kafka.consumer({ groupId: 'my-group' });

let clients = [];

// Set up Kafka producer and consumer
const startKafka = async () => {
  await producer.connect();
  console.log('Producer connected');

  await consumer.connect();
  console.log('Consumer connected');

  await consumer.subscribe({ topic: 'rider-updates', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = {
        key: message.key.toString(),
        value: message.value.toString(),
        headers: message.headers,
      };
      console.log('Message received from Kafka:', msg);

      // Send message to all connected SSE clients
      clients.forEach(client => client.res.write(`data: ${JSON.stringify(msg)}\n\n`));
    },
  });
};

startKafka().catch(console.error);

// SSE endpoint
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients = clients.filter(client => client.id !== clientId);
  });
});

// REST API to send a message to Kafka
app.post('/send', async (req, res) => {
  const { mesg } = req.query;

  await producer.send({
    topic: 'rider-updates',
    messages: [{
      partition: 0,
      key: 'LocationUpdate',
      value: JSON.stringify(mesg),
    }],
  });
  res.send('Message sent');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
