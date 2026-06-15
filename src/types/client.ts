import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Collection,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder
} from 'discord.js'

export interface SlashCommand {
  data: | SlashCommandBuilder
        | SlashCommandOptionsOnlyBuilder
        | SlashCommandSubcommandsOnlyBuilder;

  execute: (
    interaction: ChatInputCommandInteraction
  ) => Promise<void>
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, SlashCommand>
  }
}
