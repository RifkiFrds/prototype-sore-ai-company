import { GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ExtendedClient } from './types/discord.types';
import readyEvent from './events/ready.event';
import interactionEvent from './events/interaction.event';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// Load events
client.once(readyEvent.name as any, (...args: any[]) => (readyEvent.execute as any)(...args));
client.on(interactionEvent.name as any, (...args: any[]) => (interactionEvent.execute as any)(...args));

// Log in
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('CRITICAL: DISCORD_TOKEN is not defined in the environment.');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error('Failed to log in client to Discord:', err);
});
