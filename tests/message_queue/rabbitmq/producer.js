const amqplib = require('amqplib')
const queue = 'tasks'
const messages = 'hello, RabbitMQ for CE-film'

// amqplib.connect('amqp://localhost', (err, conn) => {
//   if (err) throw err

//   // Listener
//   conn.createChannel((err, ch2) => {
//     if (err) throw err

//     ch2.assertQueue(queue)

//     ch2.consume(queue, msg => {
//       if (msg !== null) {
//         console.log(msg.content.toString())
//         ch2.ack(msg)
//       } else {
//         console.log('Consumer cancelled by server')
//       }
//     })
//   })

//   // Sender
//   conn.createChannel((err, ch1) => {
//     if (err) throw err

//     ch1.assertQueue(queue)

//     setInterval(() => {
//       ch1.sendToQueue(queue, Buffer.from('something to do'))
//     }, 1000)
//   })
// })

const runProducer = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    // send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages))
    console.log(`message sent:`, messages)
    setTimeout(() => {
      connection.close()
    }, 5000)
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)
