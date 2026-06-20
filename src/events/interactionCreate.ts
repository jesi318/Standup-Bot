import { Events, type Interaction } from "discord.js";
import { handleCommand } from "../handlers/commandHandler.js";
import { handleButton } from "../handlers/buttonHandler.js";
import { handleModalSubmit } from "../handlers/modalHandler.js";
import { replyWithError } from "../utils/replyWithError.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        try{
            if (interaction.isChatInputCommand()) {
                return handleCommand(interaction);
            }
            if (interaction.isButton()) {
                return handleButton(interaction);
            }
            if (interaction.isModalSubmit()) {
                return handleModalSubmit(interaction);
            }
        } catch (error) {
            console.error("Error occurred while handling interaction:", error);
            await replyWithError(interaction);
        }
    }
}