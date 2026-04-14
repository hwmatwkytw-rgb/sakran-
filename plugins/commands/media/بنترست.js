const config = {
    name: "بنترست",
    aliases: ["صور", "صورة", "sb"],
    description: "جلب صور من موقع safebooru",
    version: "0.0.1-beta",
    usage: "[كلمة البحث]",
    cooldown: 5,
    permissions: [0, 1, 2],
    credits: "XaviaTeam",
};

async function onCall({ message, args }) {
    try {
        await message.react("⏳");

        const tags = args.join("_");

        if (!tags) return message.reply("يرجى إدخال كلمة للبحث.");

        const data = await global
            .GET(
                `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${encodeURIComponent(
                    tags
                )}`
            )
            .then((r) => r.data)
            .catch((err) => {
                console.log(err);
                return null;
            });

        if (data.length === 0 || data === null)
            throw new Error(`لم يتم العثور على نتائج أو حدث خطأ: ${tags}`);

        const filteredData = data.filter(
            (e) =>
                e.image.endsWith(".jpg") ||
                e.image.endsWith(".png") ||
                e.image.endsWith(".jpeg")
        );

        if (filteredData.length === 0)
            return message.reply("لم يتم العثور على نتائج.");

        global.shuffleArray(filteredData);

        const imgStreams = [];

        for (let i = 0; i < 9; i++) {
            const img = filteredData[i];
            imgStreams.push(
                await global.getStream(getImageUrl(img.directory, img.image))
            );
        }

        await message.reply({ attachment: imgStreams });
        await message.react("✅");
    } catch (e) {
        console.error(e);
        return message.reply(
            "حدث خطأ، حاول مرة أخرى لاحقًا أو تواصل مع المطور."
        );
    }
}

function getImageUrl(directory, image) {
    return `https://safebooru.org/images/${directory}/${image}`;
}

export default {
    config,
    onCall,
};
