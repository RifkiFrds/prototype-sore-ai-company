import { Client, Collection, ChatInputCommandInteraction, SlashCommandBuilder, AutocompleteInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface Command {
  data: 
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export class ExtendedClient extends Client {
  public commands = new Collection<string, Command>();
}

export enum CustomIds {
  // Modals
  CHAT_MODAL = 'modal_chat_prompt',
  QUERY_MODAL = 'modal_rag_query',

  // Modal Inputs
  CHAT_INPUT_CONTENT = 'input_chat_content',
  QUERY_INPUT_CONTENT = 'input_query_content',

  // Buttons
  RETRY_BUTTON = 'btn_retry',
  COPY_BUTTON = 'btn_copy',
  REFRESH_BUTTON = 'btn_refresh',
}
