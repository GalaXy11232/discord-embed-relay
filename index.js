const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Use an environment variable for security
const DISCORD_URL = process.env.DISCORD_WEBHOOK_URL;

app.post('/webhook', async (req, res) => {
    const data = req.body;

    // Check if this is a "push" event
    if (data.commits) {
        const repo = data.repository.name;
        const author = data.sender.login;
        const message = data.commits[0].message;

        const embed = {
            username: "Custom Repo Bot",
            embeds: [{
                title: `Push to ${repo}`,
                description: `**${author}** says: *"${message}"*`,
                color: 5814783, // Blurple!
                timestamp: new Date()
            }]
        };

        await axios.post(DISCORD_URL, embed);
    }
    
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay active on port ${PORT}`));