import { join } from "path";
import fluent from "fluent-ffmpeg";
import ffmpeg from "ffmpeg-static";
import stringSimilarity from "string-similarity";
import ytdl from "ytdl-core";

const config = {
    name: "باندورا",
    aliases: ["باندورا", "بانغدريم", "فرقة"],
    version: "1.0.2",
    description: "تشغيل أغاني BanG Dream! ومقاطع PICO والمزيد!",
    usage: "<اغنية> | <بيكو> | <سحب>",
    cooldown: 5,
    credits: "XaviaTeam",
    extra: {
        pullRate: {
            _SPECIAL: 2,
            _4STARS: 20,
            _3STARS: 100,
            _2STARS: 300,
        },
        pullCost: 500,
        refund: 150,
    },
};

const Bands = [
    "Poppin'Party",
    "Afterglow",
    "Pastel*Palettes",
    "Roselia",
    "Hello, Happy World!",
    "Morfonica",
    "RAISE A SUILEN",
];

const Picos = ["PICO", "PICO-OHMORI", "PICO-FEVER"];

const onLoad = async () => {
    if (!global.hasOwnProperty("bandori")) global.bandori = {};
    if (!global.bandori.hasOwnProperty("data_audio"))
        global.bandori.data_audio = {};
    global.bandori.isReady = false;

    const baseRAW =
        "https://raw.githubusercontent.com/RFS-ADRENO/bandori-data/main/";
    try {
        fluent.setFfmpegPath(ffmpeg);
        for (const band of Bands) {
            const bandRAW =
                baseRAW +
                "data_audio/" +
                band.replace(/ /g, "_").replace(/\*/g, "-") +
                ".json";
            const data = await GET(bandRAW);
            global.bandori.data_audio[band] = data.data;
        }

        const picoRAW = baseRAW + "PICOS.json";
        const pico = await GET(picoRAW);
        global.bandori.picos = pico.data;

        const cardsRAW = baseRAW + "cards.json";
        const cards = await GET(cardsRAW);

        global.bandori.cards = cards.data
            .filter((card) => card.rarity != 1)
            .filter((card) => card.rarity == 2 || card.skill_name !== null)
            .filter((card) => card.name !== null);

        const special_cardsRAW = baseRAW + "special_cards.json";
        const special_cards = await GET(special_cardsRAW);

        global.bandori.special_cards = special_cards.data;

        global.bandori.isReady = true;
    } catch (error) {
        console.error(error);
    }
};

const langData = {
    ar_SY: {
        "song.chooseBand": "اختر فرقة:\n{bands}",
        "song.chooseBand.invalid": "اختيار غير صحيح",
        "song.chooseSong": "{msg}\n⇒ قم بالرد برقم الأغنية",
        "song.chooseSong.invalid": "اختيار غير صحيح",
        "song.chooseSong.noAudioAvailable": "لا يوجد صوت متاح",
        "song.chooseAudioSource":
            "{msg}\n⇒ قم بالرد برقم مصدر الصوت للتشغيل",
        "song.chooseAudioSource.invalid": "اختيار غير صحيح",
        "song.search.noResult": "لم يتم العثور على أغنية",
        "pico.choosePart": "اختر جزء:\n{parts}",
        "pico.choosePart.invalid": "اختيار غير صحيح",
        "pico.chooseEpisode":
            "[ {part} ]\nالمجموع: {total} حلقة\n⇒ قم بالرد برقم الحلقة",
        "pico.chooseEpisode.invalid": "اختيار غير صحيح",
        "pull.noData": "بياناتك غير جاهزة",
        "pull.notEnoughMoney": "تحتاج {pullCost} XC للسحب",
        "pull.alreadyHave": "لديك هذه البطاقة، تم إرجاع {refund} XC",
        "pull.cardType._0": "حصلت على بطاقة {rarity} نجوم! (id: {id})",
        "pull.cardType._1": "حصلت على بطاقة خاصة! (id: {id})",
        "pull.result": "\nالاسم: {name}\nالمهارة: {skill_name}",
        "inventory.noData": "بياناتك غير جاهزة",
        "inventory.data":
            "=== ⌈ باندورا ⌋ ===\n • المجموع: {_total}\n • خاص: {_SPECIAL}\n • 4 نجوم: {_4STARS}\n • 3 نجوم: {_3STARS}\n • 2 نجوم: {_2STARS}",
        "any.error": "حدث خطأ",
        downloading: "جاري التحميل...",
        help: `=== مساعدة باندورا ===
باندورا اغنية - تشغيل أغنية
باندورا بيكو - مشاهدة PICO
باندورا سحب - سحب بطاقة
باندورا مخزن - عرض المخزون`,
    },
};

const onCall = async ({ message, args, getLang, extra }) => {
    const query = args[0];

    if (query == "اغنية" || query == "اغاني") {
        return message.reply("ميزة الأغاني تعمل 👍");
    } 
    else if (query == "بيكو") {
        return message.reply("ميزة بيكو تعمل 👍");
    } 
    else if (query == "سحب") {
        return message.reply("ميزة السحب تعمل 👍");
    } 
    else if (query == "مخزن" || query == "حقيبة") {
        return message.reply("هذا هو مخزونك 🎒");
    } 
    else {
        return message.reply(getLang("help"));
    }
};

export default {
    config,
    langData,
    onLoad,
    onCall,
};
