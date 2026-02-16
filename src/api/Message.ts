import Client from "../Client"
import { MessageReference, PartialUser } from "../Types"
import Member from "./Member"
import User from "./User"

interface Embed {
    title?: string
    description?: string
}

export default class Message {
    private client: Client
    type: number
    id: string
    timestamp: string
    editedTimestamp: string
    content: string | null
    embeds: Embed[]
    flags: number
    mentions: PartialUser[]
    mentionRoles: string[]
    nonce: string | number
    attachments: any
    tts: any
    pinned: any
    messageReference: MessageReference
    referencedMessage: any
    channelId: string
    guildId: string | null
    authorId: any
    author: User
    constructor(data: any, client: Client) {
        this.client = client

        this.type = data.type
        this.id = data.id
        this.timestamp = data.timestamp
        this.editedTimestamp = data.edited_timestamp
        this.content = data.content
        this.embeds = data.embeds
        this.flags = data.flags
        this.mentions = data.mentions
        this.mentionRoles = data.mention_roles
        this.nonce = data.nonce
        this.attachments = data.attachments
        this.tts = data.tts
        this.pinned = data.pinned
        this.messageReference = data.message_reference
        this.referencedMessage = data.referenced_message

        this.channelId = data.channel_id
        this.guildId = data?.guild_id
        this.authorId = data.author.id
        this.author = new User(data.author, this.client)

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    async delete() {
        return this.client.deleteMessage(this.channelId, this.id)
    }

    async edit(content: string) {
        return this.client.updateMessage(this.channelId, this.id, content)
    }

    async reply(content: string) {
        return this.client.sendMessage(this.channelId, {content: content, message_reference: { channel_id: this.channelId, guild_id: this.guildId, message_id: this.id }})
    }
}