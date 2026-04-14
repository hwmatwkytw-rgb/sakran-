const config = {
    name: "خلفية",
    aliases: ["anhnen", "wp"],
    credits: "XaviaTeam"
}

function onCall({ message }) {
    global.GET(`${global.xva_api.main}/wallpaper`)
        .then(async res => {
            try {
                let imgStream = await global.getStream(res.data.url);
                message.reply({
                    body: res.data.url,
                    attachment: imgStream
                });
            } catch {
                message.reply("حدث خطأ أثناء جلب الصورة!");
            }
        })
        .catch(_ => message.reply("حدث خطأ في الاتصال بالخادم!"));
}

export default {
    config,
    onCall
                    }
