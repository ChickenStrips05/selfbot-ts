import DMChannel from "./DMChannel"
import EventEmitter from "./EventEmitter"
import GuildTextChannel from "./GuildTextChannel"
import { Message } from "./Message"
import Rest from "./Rest"
import { MessageReference, MessageSendOptions } from "./Types"
import { formatImgUrl } from "./Utils"

interface GuildSubscription {
    typing?: boolean,
    activities?: boolean,
    threads?: boolean
    channels?: [key: string]
}

interface GuildSubscriptions {
    [key: string]: GuildSubscription
}

export default class Client extends EventEmitter {
    connected: boolean = false
    ready: boolean = false
    token: string
    ws_connection: WebSocket
    heartbeat_interval: number = 0
    id: string = ""
    username: string = ""
    globalName: string = ""
    email: string = ""
    verified: boolean = false
    discriminator: string = ""
    bio: string = ""
    avatar: string = ""
    sessionId: string = ""
    lastSequenceNumber: number = 0
    Rest: Rest

    constructor(token: string | any, debug: boolean = false) {
        super()

        this.token = token
        this.Rest = new Rest(token)

        this.ws_connection = new WebSocket("wss://gateway.discord.gg/?encoding=json&v=9")
        this.ws_connection.onopen = () => {
            this.ws_connection.send(JSON.stringify({ "op": 2, "d": { "token": token, "capabilities": null, "properties": {}, "client_state": { "guild_versions": {} } } }))
        }

        this.ws_connection.onmessage = (message: MessageEvent) => {
            try {
                const json = JSON.parse(message.data)
                if (json.s) {
                    this.lastSequenceNumber = json.s
                }
                if (debug) console.log(json)
                if (json.op === 10) {
                    this.heartbeat_interval = json.d.heartbeat_interval
                    this.connected = true
                    this.emit("CONNECT", { heartbeat_interval: this.heartbeat_interval })

                    // heartbeat
                    setInterval(() => {
                        this.ws_connection.send(JSON.stringify({ op: 1, d: this.lastSequenceNumber ? this.lastSequenceNumber : null }))
                        this.emit("HEARTBEAT_SENT")
                    }, this.heartbeat_interval)
                }
                else if (json.op === 11) {
                    this.emit("HEARTBEAT_RECIEVED")
                }
                else if (json.op === 0 && json.t === "READY") {
                    const data = json.d.user

                    this.id = data.id
                    this.username = data.username
                    this.globalName = data.global_name
                    this.email = data.email
                    this.verified = data.verified
                    this.discriminator = data.discriminator
                    this.bio = data.bio
                    this.avatar = data.avatar
                    this.sessionId = json.d.session_id
                    this.ready = true
                    this.emit("READY", this)
                }
                else if (json.op === 0 && json.t === "MESSAGE_CREATE") {
                    this.emit("MESSAGE_CREATE", new Message(json.d, this))
                }
                else if (json.op === 0 && json.t === "MESSAGE_UPDATE") {
                    this.emit("MESSAGE_UPDATE", new Message(json.d, this))
                }
                else if (json.op === 0 && json.t === "MESSAGE_DELETE") {
                    this.emit("MESSAGE_DELETE", { id: json.d.id, channelId: json.d.channel_id, guildId: json.d.guild_id })
                }
            } catch (e) {
                console.warn("Error parsing discord WS message:", e)
            }
        }
    }

    avatarUrl(format: string = "webp", size: number = 0) {
        return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size)
    }

    async sendMessage(channelId: string, options: MessageSendOptions): Promise<Message | object> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`,
            {
                method: "POST", headers: { "Authorization": this.token, "Content-Type": "application/json" },
                body: JSON.stringify(options)
            }
        )

        const json = await res.json()

        if (!res.ok) {
            console.error("Error sending message: ")
            console.log(json)
            return json
        }

        return new Message(json, this)
    }

    async sendTypingIndicator(channelId: string): Promise<boolean> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/typing`,
            {
                method: "POST", headers: { "Authorization": this.token, "Content-Type": "application/json" },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            console.error("Error sending typing indicator: ")
            console.log(json)
            return false
        }

        return true
    }

    async deleteMessage(channelId: string, id: string): Promise<boolean> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${id}`,
            {
                method: "DELETE", headers: { "Authorization": this.token, "Content-Type": "application/json" },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            console.error("Error deleteing message: ")
            console.log(json)
            return false
        }

        return true
    }

    async updateMessage(channelId: string, id: string, content: string): Promise<Message | object> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${id}`,
            {
                method: "PATCH", headers: { "Authorization": this.token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: content })
            }
        )

        const json = await res.json()

        if (!res.ok) {
            console.error("Error updating message: ")
            console.log(json)
            return json
        }

        return new Message(json, this)
    }

    async getMessages(channelId: string, limit: number = 30): Promise<Message[]> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages?limit=${limit}`,
            {
                method: "GET", headers: { "Authorization": this.token, "Content-Type": "application/json" },
            }
        )

        const json = await res.json()

        if (!res.ok) {
            console.error("Error getting messages: ")
            console.log(json)
            return json
        }

        return json.map((message: Message) => (new Message(message, this)))
    }

    async updateGuildSubscriptions(subscriptions: GuildSubscriptions): Promise<boolean|never> {
        if (this.ready) {
            this.ws_connection.send(JSON.stringify({ op: 37, d: { subscriptions: subscriptions } }))
            return true
        } else {
            throw new Error("Client WS connection not ready yet!")
            
        }
    }

    async getAllUserChannels(): Promise<DMChannel[]|never> {
        const res = await this.Rest.GET("https://discord.com/api/v9/users/@me/channels")
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error fetching user channels\n${JSON.stringify(json)}`)
        }

        return json.map((channel: any) => (new DMChannel(channel, this)))
    }
    
    async getChannel(id: string): Promise<DMChannel|GuildTextChannel> {
        const res = await this.Rest.GET(`https://discord.com/api/v9/channels/${id}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error fetching channel data\n${JSON.stringify(json)}`)
        }
        if (json.type === 1 || json.type === 3) {
            return new DMChannel(json, this)
        } else if (json.type === 0 || json.type === 5) {
            return new GuildTextChannel(json, this)
        } else {
            throw new Error("Invalid/unsuported channel type")
        }

        
    }
}