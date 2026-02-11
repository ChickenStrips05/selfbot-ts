import Client from "./Client"
import { config } from "dotenv"
import { Message } from "./Message"
config({ quiet: true })

const client = new Client(process.env.CLIENT_TOKEN!)

const guildId = "" // guild id to listen for messages

client.once("READY", async () => {
    console.log(`Logged in as ${client.globalName}`)

    // await client.updateGuildSubscriptions({[guildId]: {activities: true, typing: true, threads: true}}) 
    
    // this will make Discord send all message events from this guild to the client.
    // All dm events will still be sent without this
    // if not included, Discord may not send events to the client unless it has been recently active in that guild.
})

client.on("MESSAGE_CREATE", async (message: Message) => {
    if (message.content?.toLowerCase() === "ping" && message.author.id !== client.id) {
        await message.reply("Pong!")
    } 
})