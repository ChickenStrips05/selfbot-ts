// src/Utils.ts
function formatImgUrl(base, format, size) {
  return `${base}${format ? `.${format}` : ""}${size ? `?size=${size}` : ""}`;
}

// src/api/User.ts
var User = class {
  constructor(data, client) {
    this.client = client;
    this.id = data.id;
    this.username = data.username;
    this.globalName = data.global_name !== null ? data.global_name : data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.bot = data.bot || false;
    this.flags = data.flags || null;
    this.publicFlags = data.public_flags || null;
    this.primaryGuild = data.primary_guild;
    Object.defineProperty(this, "client", {
      value: client,
      enumerable: false,
      writable: false
    });
  }
  avatarUrl(format = null, size = null) {
    return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size);
  }
};

// src/api/DMChannel.ts
var DMChannel = class {
  constructor(data, client) {
    this.client = client;
    this.id = data.id;
    this.type = data.type;
    this.lastMessageId = data.last_message_id;
    this.flags = data.flags;
    this.recipientFlags = data.recipient_flags;
    this.recipients = data.recipients.map((user) => new User(user, client));
    this.name = data?.name || null;
    this.icon = data?.icon || null;
    this.ownerId = data?.owner_id || null;
    Object.defineProperty(this, "client", {
      value: client,
      enumerable: false,
      writable: false
    });
  }
  iconUrl(format = null, size = null) {
    return formatImgUrl(`https://cdn.discordapp.com/channel-icons/${this.id}/${this.icon}`, format, size);
  }
  send(options) {
    this.client.sendMessage(this.id, options);
  }
  async getMessages(limit = 30) {
    return this.client.getMessages(this.id, limit);
  }
};

// src/EventEmitter.ts
var EventEmitter = class {
  constructor() {
    this.events = {};
    this.on = this.on.bind(this);
    this.emit = this.emit.bind(this);
    this.off = this.off.bind(this);
    this.once = this.once.bind(this);
    this.addListener = this.addListener.bind(this);
    this.removeAllListeners = this.removeAllListeners.bind(this);
  }
  on(event, listener) {
    if (!this?.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  addListener(event, listener) {
    this.on(event, listener);
  }
  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }
  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
};

// src/api/GuildTextChannel.ts
var GuildTextChannel = class {
  constructor(data, client) {
    this.client = client;
    this.id = data.id;
    this.type = data.type;
    this.lastMessageId = data.last_message_id;
    this.flags = data.flags;
    this.lastPinTimeStamp = data.last_pin_timestamp;
    this.guildId = data.guild_id;
    this.name = data.name;
    this.parentId = data.parent_id;
    this.rateLimitPerUser = data.rate_limit_per_user;
    this.topic = data.topic;
    this.position = data.position;
    this.permissionOverwrites = data.permission_overwrites;
    this.nsfw = data.nsfw;
    Object.defineProperty(this, "client", {
      value: client,
      enumerable: false,
      writable: false
    });
  }
  send(options) {
    this.client.sendMessage(this.id, options);
  }
  async getMessages(limit = 30) {
    return this.client.getMessages(this.id, limit);
  }
};

// src/api/Member.ts
var Member = class {
  constructor(data, client) {
    this.client = client;
    this.id = data.id;
    this.username = data.username;
    this.user = data?.user ? new User(data.user, client) : null;
    this.nick = data.nick;
    this.roles = data.roles;
    this.premiumSince = data.premium_since;
    this.pending = data.pending;
    this.mute = data.mute;
    this.flags = data.flags;
    this.deaf = data.deaf;
    this.communicationsDisabledUntil = data.communications_disabled_until;
    this.joinedAt = data.joined_at;
    this.avatar = data.avatar;
    this.banner = data.banner;
    Object.defineProperty(this, "client", {
      value: client,
      enumerable: false,
      writable: false
    });
  }
  avatarUrl(format = "webp", size = 0) {
    return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size);
  }
};

// src/api/Message.ts
var Message = class {
  constructor(data, client) {
    this.client = client;
    this.type = data.type;
    this.id = data.id;
    this.timestamp = data.timestamp;
    this.editedTimestamp = data.edited_timestamp;
    this.content = data.content;
    this.embeds = data.embeds;
    this.flags = data.flags;
    this.mentions = data.mentions;
    this.mentionRoles = data.mention_roles;
    this.nonce = data.nonce;
    this.attachments = data.attachments;
    this.tts = data.tts;
    this.pinned = data.pinned;
    this.messageReference = data.message_reference;
    this.referencedMessage = data.referenced_message;
    this.channelId = data.channel_id;
    this.guildId = data?.guild_id;
    this.member = data?.member ? new Member(data.member, this.client) : null;
    this.authorId = data.author.id;
    this.author = new User(data.author, this.client);
    Object.defineProperty(this, "client", {
      value: client,
      enumerable: false,
      writable: false
    });
  }
  async delete() {
    return this.client.deleteMessage(this.channelId, this.id);
  }
  async edit(content) {
    return this.client.updateMessage(this.channelId, this.id, content);
  }
  async reply(content) {
    return this.client.sendMessage(this.channelId, { content, message_reference: { channel_id: this.channelId, guild_id: this.guildId, message_id: this.id } });
  }
};

// src/Rest.ts
var Rest = class {
  constructor(token) {
    this.token = token;
  }
  async GET(url) {
    return await fetch(url, { method: "GET", headers: { "Authorization": this.token } });
  }
  async POST(url, body) {
    return await fetch(url, { method: "POST", headers: { "Authorization": this.token }, body });
  }
};

// src/Client.ts
var Client = class extends EventEmitter {
  constructor(token, debug = false) {
    super();
    this.connected = false;
    this.ready = false;
    this.heartbeat_interval = 0;
    this.id = "";
    this.username = "";
    this.globalName = "";
    this.email = "";
    this.verified = false;
    this.discriminator = "";
    this.bio = "";
    this.avatar = "";
    this.sessionId = "";
    this.lastSequenceNumber = 0;
    this.token = token;
    this.Rest = new Rest(token);
    this.ws_connection = new WebSocket("wss://gateway.discord.gg/?encoding=json&v=9");
    this.ws_connection.onopen = () => {
      this.ws_connection.send(JSON.stringify({ "op": 2, "d": { "token": token, "capabilities": null, "properties": {}, "client_state": { "guild_versions": {} } } }));
    };
    this.ws_connection.onmessage = (message) => {
      try {
        const json = JSON.parse(message.data);
        if (json.s) {
          this.lastSequenceNumber = json.s;
        }
        if (debug) console.log(json);
        if (json.op === 10) {
          this.heartbeat_interval = json.d.heartbeat_interval;
          this.connected = true;
          this.emit("CONNECT", { heartbeat_interval: this.heartbeat_interval });
          setInterval(() => {
            this.ws_connection.send(JSON.stringify({ op: 1, d: this.lastSequenceNumber ? this.lastSequenceNumber : null }));
            this.emit("HEARTBEAT_SENT");
          }, this.heartbeat_interval);
        } else if (json.op === 11) {
          this.emit("HEARTBEAT_RECIEVED");
        } else if (json.op === 0 && json.t === "READY") {
          const data = json.d.user;
          this.id = data.id;
          this.username = data.username;
          this.globalName = data.global_name;
          this.email = data.email;
          this.verified = data.verified;
          this.discriminator = data.discriminator;
          this.bio = data.bio;
          this.avatar = data.avatar;
          this.sessionId = json.d.session_id;
          this.ready = true;
          this.emit("READY", this);
        } else if (json.op === 0 && json.t === "MESSAGE_CREATE") {
          this.emit("MESSAGE_CREATE", new Message(json.d, this));
        } else if (json.op === 0 && json.t === "MESSAGE_UPDATE") {
          this.emit("MESSAGE_UPDATE", new Message(json.d, this));
        } else if (json.op === 0 && json.t === "MESSAGE_DELETE") {
          this.emit("MESSAGE_DELETE", { id: json.d.id, channelId: json.d.channel_id, guildId: json.d.guild_id });
        }
      } catch (e) {
        console.warn("Error parsing discord WS message:", e);
      }
    };
  }
  avatarUrl(format = "webp", size = 0) {
    return formatImgUrl(`https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`, format, size);
  }
  async sendMessage(channelId, options) {
    const res = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: { "Authorization": this.token, "Content-Type": "application/json" },
        body: JSON.stringify(options)
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("Error sending message: ");
      console.log(json);
      return json;
    }
    return new Message(json, this);
  }
  async sendTypingIndicator(channelId) {
    const res = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/typing`,
      {
        method: "POST",
        headers: { "Authorization": this.token, "Content-Type": "application/json" }
      }
    );
    if (!res.ok) {
      const json = await res.json();
      console.error("Error sending typing indicator: ");
      console.log(json);
      return false;
    }
    return true;
  }
  async deleteMessage(channelId, id) {
    const res = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages/${id}`,
      {
        method: "DELETE",
        headers: { "Authorization": this.token, "Content-Type": "application/json" }
      }
    );
    if (!res.ok) {
      const json = await res.json();
      console.error("Error deleteing message: ");
      console.log(json);
      return false;
    }
    return true;
  }
  async updateMessage(channelId, id, content) {
    const res = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages/${id}`,
      {
        method: "PATCH",
        headers: { "Authorization": this.token, "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("Error updating message: ");
      console.log(json);
      return json;
    }
    return new Message(json, this);
  }
  async getMessages(channelId, limit = 30) {
    const res = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages?limit=${limit}`,
      {
        method: "GET",
        headers: { "Authorization": this.token, "Content-Type": "application/json" }
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("Error getting messages: ");
      console.log(json);
      return json;
    }
    return json.map((message) => new Message(message, this));
  }
  async updateGuildSubscriptions(subscriptions) {
    if (this.ready) {
      this.ws_connection.send(JSON.stringify({ op: 37, d: { subscriptions } }));
      return true;
    } else {
      throw new Error("Client WS connection not ready yet!");
    }
  }
  async getAllUserChannels() {
    const res = await this.Rest.GET("https://discord.com/api/v9/users/@me/channels");
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`Error fetching user channels
${JSON.stringify(json)}`);
    }
    return json.map((channel) => new DMChannel(channel, this));
  }
  async getChannel(id) {
    const res = await this.Rest.GET(`https://discord.com/api/v9/channels/${id}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`Error fetching channel data
${JSON.stringify(json)}`);
    }
    if (json.type === 1 || json.type === 3) {
      return new DMChannel(json, this);
    } else if (json.type === 0 || json.type === 5) {
      return new GuildTextChannel(json, this);
    } else {
      throw new Error("Invalid/unsuported channel type");
    }
  }
};

// src/Types.ts
var AllowedMention = /* @__PURE__ */ ((AllowedMention2) => {
  AllowedMention2[AllowedMention2["roles"] = 0] = "roles";
  AllowedMention2[AllowedMention2["users"] = 1] = "users";
  AllowedMention2[AllowedMention2["everyone"] = 2] = "everyone";
  return AllowedMention2;
})(AllowedMention || {});
export {
  AllowedMention,
  Client,
  DMChannel,
  EventEmitter,
  GuildTextChannel,
  Member,
  Message,
  Rest,
  User,
  formatImgUrl
};
