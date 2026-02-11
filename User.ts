import Client from "./Client"
import { Clan } from "./Types"
import { formatImgUrl } from "./Utils"


export default class User {
    client: Client
    id: string
    username: string
    globalName: string
    discriminator: string
    avatar: string
    bot?: boolean
    flags?: number
    publicFlags?: number

    primaryGuild?: Clan|null
    
    

    constructor(data: any, client: Client) {
        this.client = client

        this.id = data.id
        this.username = data.username
        this.globalName = (data.global_name !== null) ? data.global_name : data.username
        this.discriminator = data.discriminator
        this.avatar = data.avatar
        this.bot = data.bot || false
        this.flags = data.flags || null
        this.publicFlags = data.public_flags || null
        this.primaryGuild = data.primary_guild

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    avatarUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size)
    }
}