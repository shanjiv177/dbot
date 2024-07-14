const { Client, Events, GatewayIntentBits } = require("discord.js");
const T = require("tesseract.js");
require("dotenv").config();

const checkImage = async (url) => {
    const worker = await T.createWorker("eng");
    const ret = await worker.recognize(url);
    await worker.terminate();
    return ret.data.text;
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("ready", (c) => {
    console.log("Up and running...");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content == "help") {
        message.reply(
            "Hello, I am Me here, How may I help you? \n Send image with your allotment slip to get your roles assigned"
        );
    }

    if (message.attachments.size > 0) {
        const text = await checkImage(
            message.attachments.entries().next().value[1].url
        );

        if (
            text
                .toString()
                .includes("National Institute of Technology Karnataka, Surathkal")
        ) {
            const guild = client.guilds.cache.find(
                ({ name }) => name === "NITKtards"
            );

            const role = guild.roles.cache.find(
                ({ name }) => name == "Junior"
            );

            message.member.roles.add(role)
        }
    }
});  

client.login(process.env.DISCORD_TOKEN);
