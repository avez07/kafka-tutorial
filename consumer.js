const {Kafka} = require('./client')
const group = process.argv[2]


async function init() {
    const consumer = Kafka.consumer({groupId:group})
    await consumer.connect()
    console.log('consummer is Connected....')
    await consumer.subscribe({topics:['rider-updates']})
    await consumer.run({
        eachMessage: async({topic,partition,message,heartbeat,pause})=>{
            console.log(`${group}:[${topic}]: PART: ${partition}:`,message.value.toString())
        }
    })
    await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
            console.log({
                key: message.key.toString(),
                value: message.value.toString(),
                headers: message.headers,
            })
        },
    })
}
init()