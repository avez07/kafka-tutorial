const {Kafka} = require('kafkajs')

exports.Kafka = new Kafka({
clientId : 'kafka-tutorials',
brokers:["192.168.0.114:9092"]
})