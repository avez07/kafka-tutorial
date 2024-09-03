const {Kafka} = require('./client')

async function init() {
    const admin = Kafka.admin();
    console.log('admin is connecting...')
   await admin.connect()
    console.log('admin is connected...')
    console.log('creating topices...')
    await admin.createTopics({
        topics:[
            {
                topic:"rider-updates",
                numPartitions:2
            }
        ]
    })
    console.log('Topices Created...')
    
    console.log('admin is disconnecting...')
    admin.disconnect()
}
init()