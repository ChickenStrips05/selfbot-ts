import Client from "./Client"
import { Message } from "./Message"
import { MessageSendOptions } from "./Types"
import User from "./User"
import { formatImgUrl } from "./Utils"

export default class DMChannel {
    client: Client
    id: string
    type: number
    lastMessageId: string
    flags: number
    recipientFlags: number
    recipients: User[]

    // group dms
    name: string | null
    icon: string | null
    ownerId: string | null

    constructor(data: any, client: Client) {
        this.client = client
        this.id = data.id
        this.type = data.type
        this.lastMessageId = data.last_message_id
        this.flags = data.flags
        this.recipientFlags = data.recipient_flags
        this.recipients = data.recipients.map((user: any) => (new User(user, client)))

        this.name = data?.name || null
        this.icon = data?.icon || null
        this.ownerId = data?.owner_id || null

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    iconUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/channel-icons/${this.id}/${this.icon}`, format, size)
    }

    send(options: MessageSendOptions) {
        this.client.sendMessage(this.id, options)
    }

    async getMessages(limit: number = 30): Promise<Message[]> {
        return this.client.getMessages(this.id, limit)
    }
}