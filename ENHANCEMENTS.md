# Potential Enhancements

This document tracks potential features and improvements for GrettasBots.

## Professor Channel Restrictions

### Current Behavior
Professors (Philosophy, Latin, Librarian) currently respond to commands in any channel where the bot has access. They accept both slash commands and prefix commands from all channels.

### Enhancement Proposal
Add the ability to limit specific professors to specific channels, allowing server admins to organize educational content and control where each professor can be summoned.

### Implementation Options

#### Option 1: Environment Variables
Add channel restrictions via environment variables:

```env
PHILOSOPHY_CHANNELS=123456789,987654321
LATIN_CHANNELS=123456789
LIBRARIAN_CHANNELS=111222333,444555666
```

**Pros:**
- Simple to implement
- No database required
- Easy to configure per deployment

**Cons:**
- Requires bot restart to change
- Not suitable for multi-guild bots
- Limited flexibility

#### Option 2: Configuration File
Store channel restrictions in a JSON config file:

```json
{
  "professorChannels": {
    "philosophy": ["123456789", "987654321"],
    "latin": ["123456789"],
    "librarian": ["111222333", "444555666"]
  }
}
```

**Pros:**
- Easy to edit without restart (with hot-reload)
- Version controllable
- Can add per-guild configuration

**Cons:**
- Still requires file access to change
- Manual configuration management

#### Option 3: Database/Guild Settings
Store restrictions in a database with per-guild configuration:

```javascript
// Example structure
{
  guildId: "123456789",
  professorChannels: {
    philosophy: ["channel1", "channel2"],
    latin: ["channel1"],
    librarian: ["channel3"]
  }
}
```

**Pros:**
- Runtime configuration without restart
- Per-guild customization
- Could add slash commands for admins to configure
- Scalable for multiple servers

**Cons:**
- Requires database setup
- More complex implementation
- Additional infrastructure

### Technical Implementation Notes

1. **Modify `professorBase.js`**: Add channel check in `executeProfessorCommand()` before processing:
   ```javascript
   // Check if professor is allowed in this channel
   if (!isChannelAllowed(professorType, source.channelId)) {
     return await source.reply({ 
       content: 'This professor is not available in this channel.', 
       ephemeral: true 
     });
   }
   ```

2. **Apply to both command types**: Ensure restrictions work for:
   - Slash commands (`/philosophy`, `/latin`, `/librarian`)
   - Prefix commands (`!philosophy`, `!latin`, `!librarian` and their aliases)

3. **Admin override**: Consider allowing server admins to bypass restrictions or manage them via slash commands.

4. **User feedback**: Provide clear messages when a professor can't be used in a channel, optionally listing where they ARE available.

### Use Cases
- Keep philosophy discussions in a dedicated philosophy channel
- Restrict Latin help to a homework/study channel
- Organize librarian research assistance in a library/resources channel
- Reduce channel clutter by limiting bot responses to appropriate channels
