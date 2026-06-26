import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
import { ApiService } from '../../services/api.service';
import { CustomIds } from '../../types/discord.types';

export async function handleRagQueryModal(interaction: ModalSubmitInteraction): Promise<void> {
  const query = interaction.fields.getTextInputValue(CustomIds.QUERY_INPUT_CONTENT);

  await interaction.deferReply();

  try {
    const result = await ApiService.queryRag(query);

    const embed = new EmbedBuilder()
      .setColor(0x00A2FF)
      .setTitle('📚 Knowledge Base Search Results')
      .addFields(
        { name: 'Query', value: `"${query}"` },
        { name: 'Answer', value: result.answer.length > 1024 ? result.answer.substring(0, 1020) + '...' : result.answer }
      )
      .setTimestamp()
      .setFooter({ text: 'RAG Knowledge Search', iconURL: interaction.client.user?.displayAvatarURL() });

    if (result.references && result.references.length > 0) {
      const refDetails = result.references.map((ref, idx) => {
        const scoreStr = ref.score ? ` (Score: ${(ref.score * 100).toFixed(1)}%)` : '';
        return `${idx + 1}. Doc: \`${ref.documentId || 'Unknown'}\` Index: ${ref.chunkIndex ?? 'N/A'}${scoreStr}\n*Snippet*: ${ref.textSnippet || ''}`;
      }).join('\n\n');

      embed.addFields({ name: 'References Context', value: refDetails.length > 1024 ? refDetails.substring(0, 1020) + '...' : refDetails });
    } else {
      embed.addFields({ name: 'References Context', value: 'No matching document references found.' });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Error executing semantic query:', error);
    const errorEmbed = new EmbedBuilder()
      .setColor(0xFF3366)
      .setTitle('❌ Knowledge Query Failed')
      .setDescription(`An error occurred during semantic search:\n\`\`\`${error.message || error}\`\`\``)
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
