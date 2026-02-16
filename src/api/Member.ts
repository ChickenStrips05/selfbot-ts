// UNFINISHED!

import Client from "../Client"
import User from "./User"
import { formatImgUrl } from "../Utils"
import { AvatarDecorationData, Collectibles, DisplayNameStyle } from "../Types"

export default class Member {
    client: Client
    guildId: string
    user: User
    nick?: string
    avatar?: string
    avatarDecorationData?: AvatarDecorationData
    collectibles?: Collectibles
    displayNameStyles?: DisplayNameStyle
    banner?: string
    bio?: string
    roles: string[]
    joinedAt: string
    premiumSince: string
    deaf?: boolean
    mute?: boolean
    pending?: boolean
    communicationDisabledUntil?: string
    unusualDmActivityUntil?: string
    flags: number
    permissions?: string
    
    constructor (data: any, client: Client, guildId: string) {
        this.client = client
        this.guildId = guildId

        this.user = new User(data.user, client)
        this.nick = data?.nick
        this.avatar = data?.avatar
        this.avatarDecorationData = data?.avatar_decoration_data || null
        this.collectibles = data?.collectibles || null
        this.displayNameStyles = data?.display_name_styles || null
        this.banner = data?.banner || null
        this.bio = data?.bio || null
        this.roles = data.roles
        this.joinedAt = data.joined_at
        this.premiumSince = data?.premium_since || null
        this.deaf = data?.deaf || null
        this.mute = data?.mute || null
        this.pending = data?.pending || null
        this.communicationDisabledUntil = data?.communication_disabled_until || null
        this.unusualDmActivityUntil = data?.unusual_dm_activity_until || null
        this.flags = data.flags
        this.permissions = data?.permissions || null

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    async addRole(roleId: string) {
        return await this.client.addRoleToMember(this.guildId, this.user.id, roleId)
    }

    async removeRole(roleId: string) {
        return await this.client.removeRoleFromMember(this.guildId, this.user.id, roleId)
    }

    async kick() {
        return await this.client.kickMember(this.guildId, this.user.id)
    }

    avatarUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/guilds/${this.guildId}/users/${this.user.id}/avatars/${this.avatar}`, format, size)
    }

    bannerUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/guilds/${this.guildId}/users/${this.user.id}/banners/${this.avatar}`, format, size)
    }
}