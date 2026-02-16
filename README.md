## Simple Discord selfbot made with TypeScript
> [!WARNING]
> This code is not official nor does it follow the Discord Terms of Service. Use at your own risk and beware of your account being moderated or flagged.
> I am not responsible for any blocked accounts because of this code.

The data structures are inspired by discord.js module.
Huge thanks to the [Discord Userdoccers](https://github.com/discord-userdoccers) for reverse-engineering and creating some data structures that I used, [website](https://docs.discord.food/).

### Huge update!
I have published the code to the NPM registry, so this is now an official module.

### To install:
```bash
npm install selfbot-ts
```
### Example code

```typescript
// Simple ping/pong command thing
import { config } from "dotenv"
import { Client, Message } from "selfbot-ts"
config({quiet: true})

const client = new Client(process.env.CLIENT_TOKEN!)

client.once("READY", async () => {
    console.log(`Logged in as ${client.globalName}`)
})

client.on("MESSAGE_CREATE", async (message: Message) => {
    if (message.content?.toLowerCase() === "ping" && message.author.id !== client.id) {
        await message.reply("Pong!")
    } 
})
```