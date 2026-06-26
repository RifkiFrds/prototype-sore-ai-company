import { REST, Routes } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { ExtendedClient, Command } from '../types/discord.types';

export async function registerCommands(client: ExtendedClient): Promise<void> {
  const commandsPath = path.join(__dirname, '../commands');
  
  if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath, { recursive: true });
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.ts') || file.endsWith('.js')
  );

  const commandData: any[] = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      // Dynamic import
      const commandModule = require(filePath);
      const command: Command = commandModule.default || commandModule;

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commandData.push(command.data.toJSON());
        console.log(`Loaded command: ${command.data.name}`);
      } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    } catch (error) {
      console.error(`Error loading command file ${file}:`, error);
    }
  }

  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId || !guildId) {
    console.error('Missing required environment variables for command registration.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log(`Started refreshing ${commandData.length} application (/) commands.`);

    const data: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandData }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('Failed to register guild commands:', error);
  }
}
