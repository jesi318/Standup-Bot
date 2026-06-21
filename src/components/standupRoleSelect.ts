import { ActionRowBuilder, RoleSelectMenuBuilder } from "discord.js";

export const STANDUP_ROLE_SELECT_ID = "standup_role_select";

export function createStandupRoleSelect() {
    const select = new RoleSelectMenuBuilder()
        .setCustomId(STANDUP_ROLE_SELECT_ID)
        .setPlaceholder("Select the role that should submit standups")
        .setMinValues(1)
        .setMaxValues(1);

        return new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(select);
}