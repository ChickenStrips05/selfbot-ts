import DMChannel from "./api/DMChannel"
import EventEmitter from "./EventEmitter"
import GuildTextChannel from "./api/GuildTextChannel"
import Message from "./api/Message"
import Rest from "./Rest"
import { EmojiUpdate, GuildMembersChunk, GuildSubscription, GuildSubscriptions, MessageSendOptions, ProfileMetadata, Relationship, RoleUpdate, StickerUpdate, UpdateMember, UpdateSelfMember, UpdateSelfMemberProfile } from "./Types"
import { formatImgUrl } from "./Utils"
import UserGuild from "./api/UserGuild"
import Role from "./api/Role"
import Guild from "./api/Guild"
import Emoji from "./api/Emoji"
import Sticker from "./api/Sticker"
import { WebSocket } from "ws"
import Member from "./api/Member"

export default class Client extends EventEmitter {
    connected: boolean = false
    ready: boolean = false
    token: string
    debug: boolean
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

    guildSubscriptions: GuildSubscriptions = {}

    constructor(token: string | any, debug: boolean = false) {
        super()
        this.debug = debug
        this.token = token
        this.Rest = new Rest(token)

        this.ws_connection = new WebSocket("wss://gateway.discord.gg/?encoding=json&v=9")
        this.ws_connection.on("open", () => {
            this.ws_connection.send(JSON.stringify({ "op": 2, "d": { "token": token, "capabilities": null, "properties": {}, "client_state": { "guild_versions": {} } } }))
        })

        this.ws_connection.on("message", (message) => {
            try {
                const json = JSON.parse(message.toString())
                if (json.s) {
                    this.lastSequenceNumber = json.s
                }
                if (debug) console.log(JSON.stringify(json, null, 2))
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
                } else if (json.op === 0 && json.t === "GUILD_MEMBERS_CHUNK") {
                    this.emit("GUILD_MEMBERS_CHUNK", json.d)
                }
            } catch (e) {
                console.warn("Error parsing discord WS message:", e)
            }
        })
    }

    avatarUrl(format: string = "webp", size: number = 0) {
        return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size)
    }

    async updateGuildSubscriptions(subscriptions: GuildSubscriptions): Promise<boolean> {
        if (this.ready) {
            this.ws_connection.send(JSON.stringify({ op: 37, d: { subscriptions: subscriptions } }))
            return true
        } else {
            throw new Error("Client WS connection not ready yet!")

        }
    }

    async subscribeToGuild(guildId: string, options: GuildSubscription): Promise<boolean> {
        this.guildSubscriptions[guildId] = options
        if (this.debug) {
            console.log(`Added new Guild Subscription to guild: ${guildId}`)
        }
        return await this.updateGuildSubscriptions(this.guildSubscriptions)
    }

    async unsubscribeFromGuild(guildId: string): Promise<boolean> {
        delete this.guildSubscriptions[guildId]
        if (this.debug) {
            console.log(`Deleted Guild Subscription to guild: ${guildId}`)
        }
        return await this.updateGuildSubscriptions(this.guildSubscriptions)
    }

    async clearGuildSubscriptions(): Promise<boolean> {
        this.guildSubscriptions = {}
        if (this.debug) {
            console.log(`Deleted all Guild Subscriptions`)
        }
        return await this.updateGuildSubscriptions(this.guildSubscriptions)
    }

    async getAllUserChannels(): Promise<DMChannel[] | never> {
        const res = await this.Rest.GET("https://discord.com/api/v9/users/@me/channels")
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error fetching user channels\n${JSON.stringify(json)}`)
        }

        return json.map((channel: any) => (new DMChannel(channel, this)))
    }

    async getChannel(channelId: string): Promise<DMChannel | GuildTextChannel> {
        const res = await this.Rest.GET(`https://discord.com/api/v9/channels/${channelId}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error fetching channel: ${channelId}\n${JSON.stringify(json)}`)
        }
        if (json.type === 1 || json.type === 3) {
            return new DMChannel(json, this)
        } else if (json.type === 0 || json.type === 5) {
            return new GuildTextChannel(json, this)
        } else {
            throw new Error("Invalid/unsuported channel type")
        }
    }

    async getUserRelationships(): Promise<Relationship[]> {
        const res = await this.Rest.GET(`https://discord.com/api/v9/users/@me/relationships`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error fetching relationships\n${JSON.stringify(json)}`)
        }

        return json
    }

    async getUserGuilds(): Promise<UserGuild[] | never> {
        const res = await this.Rest.GET("https://discord.com/api/v9/users/@me/guilds")
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error fetching user channels\n${JSON.stringify(json)}`)
        }

        return json.map((guild: any) => (new UserGuild(guild, this)))
    }

    async getGuild(guildId: string, withCounts: boolean = true): Promise<Guild> {
        const res = await this.Rest.GET(`https://discord.com/api/v9/guilds/${guildId}${withCounts ? "?with_counts=true" : null}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error updating role\n${JSON.stringify(json)}`)
        }

        return new Guild(json, this)
    }

    async sendTypingIndicator(channelId: string): Promise<true | never> {
        const res = await this.Rest.POST(`https://discord.com/api/v9/channels/${channelId}/typing`, null)

        if (!res.ok) {
            throw new Error(`Error sending typing indicator in channel id: ${channelId}`)
        }

        return true
    }

    async sendMessage(channelId: string, options: MessageSendOptions): Promise<Message | never> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`,
            {
                method: "POST", headers: { "Authorization": this.token, "Content-Type": "application/json" },
                body: JSON.stringify(options)
            }
        )

        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error sending message:\n${JSON.stringify(json)}`)
        }

        return new Message(json, this)
    }

    async deleteMessage(channelId: string, messageId: string): Promise<boolean | never> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`)

        if (!res.ok) {
            throw new Error(`Error deleting message: ${messageId} in ${channelId}`)
        }

        return true
    }

    async updateMessage(channelId: string, id: string, content: string): Promise<Message> {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${id}`,
            {
                method: "PATCH", headers: { "Authorization": this.token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: content })
            }
        )

        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error updating message\n${JSON.stringify(json)}`)
        }

        return new Message(json, this)
    }

    async getMessages(channelId: string, limit: number = 30): Promise<Message[]> {
        const res = await this.Rest.GET(`https://discord.com/api/v9/channels/${channelId}/messages?limit=${limit}`)

        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Errror getting messages: ${JSON.stringify(json)}`)
        }

        return json.map((message: Message) => (new Message(message, this)))
    }

    async updateRole(guildId: string, roleId: string, data: RoleUpdate): Promise<Role | never> {
        const res = await this.Rest.PATCH(`https://discord.com/api/v9/guilds/${guildId}/roles/${roleId}`, JSON.stringify(data))
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error updating role\n${JSON.stringify(json)}`)
        }

        return new Role(json, this, guildId)
    }

    async deleteRole(guildId: string, roleId: string): Promise<true | never> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/guilds/${guildId}/roles/${roleId}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error deleting role\n${JSON.stringify(json)}`)
        }

        return true
    }

    async updateEmoji(guildId: string, emojiId: string, data: EmojiUpdate): Promise<Emoji | never> {
        const res = await this.Rest.PATCH(`https://discord.com/api/v9/guilds/${guildId}/emojis/${emojiId}`, JSON.stringify(data))
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error updating emoji\n${JSON.stringify(json)}`)
        }

        return new Emoji(json, this, guildId)
    }

    async deleteEmoji(guildId: string, emojiId: string): Promise<true | never> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/guilds/${guildId}/emojis/${emojiId}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error deleting emoji\n${JSON.stringify(json)}`)
        }

        return true
    }

    async updateSticker(guildId: string, stickerId: string, data: StickerUpdate): Promise<Sticker | never> {
        const res = await this.Rest.PATCH(`https://discord.com/api/v9/guilds/${guildId}/stickers/${stickerId}`, JSON.stringify(data))
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error updating sticker\n${JSON.stringify(json)}`)
        }

        return new Sticker(json, this)
    }

    async deleteSticker(guildId: string, stickerId: string): Promise<true | never> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/guilds/${guildId}/stickers/${stickerId}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Error deleting sticker\n${JSON.stringify(json)}`)
        }

        return true
    }

    async getGuildMember(guildId: string, userId: string) {
        const res = await this.Rest.GET(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Errror getting member: ${JSON.stringify(json)}`)
        }

        return new Member(json, this, guildId)
    }

    async getSelfMember(guildId: string) {
        const res = await this.Rest.GET(`https://discord.com/api/v9/users/@me/guilds/${guildId}/member`)
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Errror getting member: ${JSON.stringify(json)}`)
        }

        return new Member(json, this, guildId)
    }

    async updateMember(guildId: string, userId: string, options: UpdateMember): Promise<Member> {
        const res = await this.Rest.PATCH(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, JSON.stringify(options))
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Errror updating member: ${JSON.stringify(json)}`)
        }

        return new Member(json, this, guildId)
    }

    async updateSelfMember(guildId: string, options: UpdateSelfMember): Promise<Member> {
        const res = await this.Rest.PATCH(`https://discord.com/api/v9/guilds/${guildId}/members/@me`, JSON.stringify(options))
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Errror updating member: ${JSON.stringify(json)}`)
        }

        return new Member(json, this, guildId)
    }

    async updateSelfMemberProfile(guildId: string, options: UpdateSelfMemberProfile): Promise<ProfileMetadata> {
        const res = await this.Rest.PATCH(`https://discord.com/api/v9/guilds/${guildId}/profile/@me`, JSON.stringify(options))
        const json = await res.json()

        if (!res.ok) {
            throw new Error(`Errror updating member profile: ${JSON.stringify(json)}`)
        }

        return json
    }

    async addRoleToMember(guildId: string, userId: string, roleId: string): Promise<boolean> {
        const res = await this.Rest.PUT(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}/roles/${roleId}`)

        if (!res.ok) {
            const json = await res.json()
            throw new Error(`Errror adding role: ${JSON.stringify(json)}`)
        }

        return true
    }

    async removeRoleFromMember(guildId: string, userId: string, roleId: string): Promise<boolean> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}/roles/${roleId}`)

        if (!res.ok) {
            const json = await res.json()
            throw new Error(`Errror removing role: ${JSON.stringify(json)}`)
        }

        return true
    }

    async kickMember(guildId: string, userId: string): Promise<boolean> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`)

        if (!res.ok) {
            const json = await res.json()
            throw new Error(`Errror kicking member: ${JSON.stringify(json)}`)
        }

        return true
    }

    async leaveGuild(guildId: string): Promise<boolean> {
        const res = await this.Rest.DELETE(`https://discord.com/api/v9/users/@me/guilds/${guildId}`)

        if (!res.ok) {
            const json = await res.json()
            throw new Error(`Errror leaving guild: ${JSON.stringify(json)}`)
        }

        return true
    }

    async requestGuildMembers(guildId: string, query: string | null = null, limit: number | null = null, presences: boolean | null = null, userIds: string[] | null = null, nonce: string | number | null = null): Promise<Member[]> {
        const payload: any = {}

        payload.guild_id = guildId

        if (query !== null) {
            if (query === "" && limit === null) {
                payload.limit = 0
            } else if (query === "" && limit !== 0) {
                throw new Error("Limit must be 0 with an empty query (requires MANAGE_ROLES, KICK_MEMBERS or BAN_MEMBERS permission)")
            }
            payload.query = query

        }

        if (limit !== null) {
            if (limit > 100) {
                throw new Error("Cannot set request limit to more than 100. Set query to \"\" and limit to 0 to fetch all (requires MANAGE_ROLES, KICK_MEMBERS or BAN_MEMBERS permission)")
            } else if (limit === 0 && query !== "") {
                throw new Error("Query must be empty if limit is 0")
            }
            payload.limit = limit
        }

        if (userIds) {
            if (userIds.length > 100) {
                throw new Error("User Ids field can not be more than 100 user ids")
            }
            payload.user_ids = userIds
        }

        if (presences !== null) {
            payload.presences = presences
        }

        if (nonce) {
            payload.nonce = nonce.toString()
        } else {
            payload.nonce = (Math.round(Math.random() * Math.pow(10, 16))).toString()
        }

        this.ws_connection.send(JSON.stringify({ op: 8, d: payload }))

        const members: Member[] = []
        let totalChunks
        const receivedChunks: number[] = []


        return new Promise((resolve) => {
            const listener = (data: GuildMembersChunk) => {
                if (data.nonce === payload.nonce) {
                    totalChunks = data.chunk_count
                    if (!receivedChunks.includes(data.chunk_index)) {
                        receivedChunks.push(data.chunk_index)
                        members.push(...data.members.map(member => new Member(member, this, guildId)))
                    }

                    if (receivedChunks.length === totalChunks) {
                        this.off("GUILD_MEMBERS_CHUNK", listener)
                        resolve(members)
                    }
                }
            }

            this.on("GUILD_MEMBERS_CHUNK", listener)

            setTimeout(() => {
                this.off("GUILD_MEMBERS_CHUNK", listener)
                resolve(members)
            }, 10000)
        })
    }
}