const config = {
    name: "call",
    aliases: ["بلاغ", "report"],
    description: "send report to bot developer",
    usage: "[message]",
    cooldown: 5,
    permissions: [0],
    credits: "Jehane",
    isAbsolute: true
};

const langData = {
    "ar_SY": {
        "noContent": "⚠️ | يرجى كتابة نص البلاغ.",
        "sent": "✅ | تم إرسال ندائك بنجاح.",
        "error": "❌ | حدث خطأ.",
        "replyFromDev": "📩 | رد من المطور:\n━━━━━━━━━━━━━━━\n{msg}\n━━━━━━━━━━━━━━━"
    }
};

// عند إرسال البلاغ
async function onCall({ message, args, event }) {
    try {
        const { threadID, senderID } = message;
        const content = args.join(" ");

        if (!content)
            return message.reply(langData["ar_SY"].noContent);

        const supportThreadID = "1637988127236596";

        const report =
            "🔔 | نداء جديد\n" +
            "━━━━━━━━━━━━━━━\n" +
            `👤 | المستخدم: ${senderID}\n` +
            `🌐 | المجموعة: ${threadID}\n` +
            "━━━━━━━━━━━━━━━\n" +
            `📝 | الرسالة:\n${content}\n` +
            "━━━━━━━━━━━━━━━\n" +
            "💡 | قم بالرد على هذه الرسالة للرد على المستخدم.";

        global.api.sendMessage(report, supportThreadID, (err, info) => {
            if (err) return message.reply(langData["ar_SY"].error);

            // تسجيل الرد
            info.addReplyEvent({
                callback: onReply,
                author: senderID,
                threadID: threadID
            });

            return message.reply(langData["ar_SY"].sent);
        });

    } catch (e) {
        return message.reply(langData["ar_SY"].error);
    }
}

// عند رد المطور
async function onReply({ message, eventData }) {
    try {
        const { author, threadID } = eventData;
        const msg = message.body;

        const replyMsg =
            "📩 | رد من المطور:\n━━━━━━━━━━━━━━━\n" +
            msg +
            "\n━━━━━━━━━━━━━━━";

        global.api.sendMessage(replyMsg, threadID);

    } catch (e) {
        return message.reply("❌ | فشل إرسال الرد");
    }
}

export default {
    config,
    langData,
    onCall
};
