import Client from "../Client"
import Message from "./Message"
import { MessageSendOptions, PermissionOverwrite } from "../Types"

export default class GuildTextChannel{
    client: Client
    id: string
    type: number
    lastMessageId: string
    flags: number
    lastPinTimeStamp: string
    guildId: string
    name: string
    parentId: string
    rateLimitPerUser: number
    topic: string
    position: number
    permissionOverwrites: PermissionOverwrite[]
    nsfw: boolean

    constructor(data: any, client: Client) {
        this.client = client
        this.id = data.id
        this.type = data.type
        this.lastMessageId = data.last_message_id
        this.flags = data.flags
        this.lastPinTimeStamp = data.last_pin_timestamp
        this.guildId = data.guild_id
        this.name = data.name
        this.parentId = data.parent_id
        this.rateLimitPerUser = data.rate_limit_per_user
        this.topic = data.topic
        this.position = data.position
        this.permissionOverwrites = data.permission_overwrites 
        this.nsfw = data.nsfw

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    send(options: MessageSendOptions) {
        this.client.sendMessage(this.id, options)
    }

    async getMessages(limit: number = 30): Promise<Message[]> {
        return this.client.getMessages(this.id, limit)
    }
}