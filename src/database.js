const mongoose = require('mongoose');

let connection

async function connect(){
    if(connection)return

    const mongoUri = process.env.MONGO_URI

    connection = mongoose.connection

    connection.once("open",()=>{
        console.log("Connection with mongo OK")
    })

    connection.on("disconnected",()=>{
        console.log("Disconnected successfull")
    })

    connection.on("error",(error)=>{
        console.log("Something went wrong!", error)

    })
    await mongoose.connect(mongoUri)
}

async function disconnect(){
    if(!connection)return

    await mongoose.disconnect()
}

async function cleanup(){
    for(const collection in connection.collections){
        await connection.collections[collection].deleteMany({})
    }
}

module.exports = { connect , disconnect , cleanup }