const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const profilesFile = path.join(__dirname, '..', 'profiles.json');

// Ensure profiles.json exists
if (!fs.existsSync(profilesFile)) {
    fs.writeFileSync(profilesFile, '{}');
}

let profiles;
try {
    profiles = JSON.parse(fs.readFileSync(profilesFile, 'utf8'));
} catch (err) {
    profiles = {};
}

function saveProfiles() {
    try {
        fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
    } catch (err) {
        console.error('Error saving profiles:', err);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createaprofile')
        .setDescription('Save your Tacticool profile (name and/or ID)')
        .addStringOption(opt =>
            opt.setName('name').setDescription('Your Tacticool name').setRequired(false))
        .addStringOption(opt =>
            opt.setName('id').setDescription('Your Tacticool ID').setRequired(false)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const name = interaction.options.getString('name');
        const id = interaction.options.getString('id');

        if (!name && !id) {
            return interaction.reply({ content: '❌ Provide at least a name or an ID!', ephemeral: true });
        }

        profiles[userId] = { name, id };
        saveProfiles();

        return interaction.reply(`✅ Profile saved!\nName: ${name ?? 'Not set'}\nID: ${id ?? 'Not set'}`);
    }
};