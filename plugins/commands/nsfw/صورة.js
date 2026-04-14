const config = {
    name: "صورة",
    description: "صور هنتاي",
    usage: "[الفئة]",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "XaviaTeam",
    nsfw: true
}

const langData = {
    "en_US": {
        "invalidCategory": "فئة غير صالحة، الفئات المتاحة:\n{categories}",
        "error": "حدث خطأ، حاول مرة أخرى لاحقًا.",
        "noPermission": "هذا الأمر مخصص للمطور فقط."
    },
    "vi_VN": {
        "invalidCategory": "فئة غير صالحة، الفئات المتاحة:\n{categories}",
        "error": "حدث خطأ...",
        "noPermission": "هذا الأمر للمطور فقط."
    },
    "ar_SY": {
        "invalidCategory": "الفئة غير صالحة، الفئات المتاحة:\n{categories}",
        "error": "حدث خطأ، حاول مرة أخرى لاحقًا...",
        "noPermission": "هذا الأمر مخصص للمطور فقط."
    }
}

const endpoints = ["waifu", "neko", "trap", "blowjob"];

async function onCall({ message, args, getLang, event }) {
    try {
        // تحقق من ايدي المطور
        if (event.senderID !== "100081948980908")
            return message.reply(getLang("noPermission"));

        const input = args[0]?.toLowerCase();
        if (!endpoints.includes(input)) return message.reply(getLang("invalidCategory", { categories: endpoints.join(", ") }));

        const response = await global.GET(`${global.xva_api.nsfw}/${input}`);
        const data = response.data;

        if (!data.url) return message.reply(getLang("error"));

        const imageStream = await global.getStream(data.url);
        await message.reply({
            attachment: [imageStream]
        });
    } catch (e) {
        console.error(e);
        message.reply(getLang("error"));
    }
}

export default {
    config,
    langData,
    onCall
    }
