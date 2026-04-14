const config = {
    name: "ملاحظة",
    description: "تسجيل رسالة كملاحظة",
    usage: "[رد]",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "XaviaTeam"
}

const langData = {
    "en_US": {
        "dataNotReady": "Data is not ready, please try again later.",
        "alreadyNoted": "You already have a noted message in this thread, do you want to overwrite it?\nReact 👍 to overwrite.",
        "noted": "Noted!",
        "notNoted": "You don't have a noted message in this thread.",
        "note": ".",
        "error": "Error, try again later."
    },
    "vi_VN": {
        "dataNotReady": "Dữ liệu chưa sẵn sàng, vui lòng thử lại sau.",
        "alreadyNoted": "Bạn đã có một tin nhắn được note trong cuộc trò chuyện này, bạn có muốn ghi đè lên nó không?\nReact 👍 để ghi đè.",
        "noted": "Đã note!",
        "notNoted": "Bạn không có tin nhắn nào được note trong cuộc trò chuyện này.",
        "note": ".",
        "error": "Có lỗi xảy ra, vui lòng thử lại sau."
    },
    "ar_SY": {
        "dataNotReady": "البيانات ليست جاهزة ، يرجى المحاولة مرة أخرى في وقت لاحق.",
        "alreadyNoted": "لديك بالفعل ملاحظة في هذه الدردشة ، هل تريد استبدالها؟\nReact 👍 للكتابة.",
        "noted": "تم تسجيل الملاحظة!",
        "notNoted": "لا توجد لديك أي ملاحظة في هذه الدردشة.",
        "note": ".",
        "error": "حدث خطأ، حاول مرة أخرى لاحقًا."
    }
}

async function confirmOverwrite({ message, getLang, eventData }) {
    try {
        const { reaction, threadID, userID } = message;
        const { targetMessageID, note } = eventData;

        if (reaction != "👍") return;

        const index = note.findIndex(item => item.threadID == threadID);
        note[index] = { threadID, messageID: targetMessageID };

        await global.controllers.Users.updateData(userID, { note });

        await message.send(getLang("noted"), threadID, targetMessageID);
    } catch (e) {
        console.error(e);
        message.reply(getLang("error"));
    }
}

async function onCall({ message, args, getLang, data }) {
    try {
        const { type, messageReply, messageID, threadID } = message;
        const input = args[0]?.toLowerCase();

        if (!data?.user?.data) return message.reply(getLang("dataNotReady"));
        const
