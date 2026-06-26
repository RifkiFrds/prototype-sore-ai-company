import { Events } from 'discord.js';
import { ExtendedClient } from '../types/discord.types';
import { registerCommands } from '../registry/command.registry';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: ExtendedClient) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    await registerCommands(client);
  },
};
