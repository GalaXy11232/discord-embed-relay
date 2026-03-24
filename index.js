const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Use an environment variable for security
const DISCORD_URL = process.env.DISCORD_WEBHOOK_URL;

app.post('/webhook', async (req, res) => {
    const data = req.body;

    if (data.commits && data.commits.length > 0) {
        const repoName = data.repository.name;
        const commitFields = data.commits.map(commit => {

            const messageParts = commit.message.split('\n\n');
            const commitTitle = messageParts[0].trim();
 
            const commitDescription = messageParts.slice(1).join('\n\n').trim() || "_No description provided._";
            
            return {
                name: `${commit.author.name}: ${commitTitle}`,
                value: commitDescription,
                inline: false
            };
        });

        const embed = {
            // username: "Custom Repo Bot",
            embeds: [{
                title: `Pushed to ${repoName}`, 
                fields: commitFields,
                color: 9581567, 
                timestamp: new Date(),
                footer: {
                    text: "GitHub Relay Service"
                }
            }]
        };

        try {
            await axios.post(DISCORD_URL, embed);
            console.log(`Successfully sent ${data.commits.length} commits to Discord.`);
        } catch (error) {
            console.error("Error sending to Discord:", error.response?.data || error.message);
        }
    }
    
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay active on port ${PORT}`));