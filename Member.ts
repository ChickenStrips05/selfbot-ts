// UNFINISHED!

import Client from "./Client"
import User from "./User"
import { formatImgUrl } from "./Utils"

export default class Member {
    client: Client
    id: string
    username: string
    user: User | null
    nick: string
    roles: string[]
    premiumSince: any
    pending: any
    mute: any
    flags: any
    deaf: any
    communicationsDisabledUntil: any
    joinedAt: any
    avatar: any
    banner: any
    
    constructor (data: any, client: Client) {
        this.client = client

        this.id = data.id
        this.username = data.username
        this.user = data?.user ? new User(data.user, client) : null
        this.nick = data.nick
        this.roles = data.roles
        this.premiumSince = data.premium_since
        this.pending = data.pending
        this.mute = data.mute
        this.flags = data.flags
        this.deaf = data.deaf
        this.communicationsDisabledUntil = data.communications_disabled_until
        this.joinedAt = data.joined_at
        this.avatar = data.avatar
        this.banner = data.banner

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    avatarUrl(format: string = "webp", size: number = 0) {
        return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size)
    }
}