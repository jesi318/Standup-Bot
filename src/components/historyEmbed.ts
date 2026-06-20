import { EmbedBuilder } from "discord.js";

export function createHistoryEmbed(history: any[], page: number) {
    const embed = new EmbedBuilder().setTitle("📜 Recent Standups").setDescription(
            `Page ${page}`
        );

    history.forEach((s: any) => {

        embed.addFields({

            name: `📅 ${s.standup_date}`,

            value:
                `**Yesterday**
                    ${s.yesterday}

                    **Today**
                    ${s.today}

                    **Blockers**
                    ${s.blockers}`

        });

    });
    return embed;
}