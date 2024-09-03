const {Kafka} = require('./client')
const readLine = require('readline')

const rl = readLine.createInterface({
    input: process.stdin,
    output:process.stdout
})

async function init() {
    const producer = Kafka.producer()
    console.log('Producer is connecting')
    await producer.connect()
    console.log('Producer is connecting...')
    rl.setPrompt("> ")
    rl.prompt()
    rl.on('line',async function (line) {
        const [ridername,location] = line.split(' ')
        await producer.send({
            topic: "rider-updates",
            messages:[
                {
                    partition:location.toLowerCase() === 'north' ? 0 : 1,
                    key:'LocationUpdate',
                    value: JSON.stringify({name:ridername,location:location})
                }
            ]
        })
    }).on('close',async () => {
        await producer.disconnect()
    })
}
init()