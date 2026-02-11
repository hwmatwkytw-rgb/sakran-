const config = {
    name: "مساعدة",
    aliases: ["help", "اوامر"],
    description: "عرض قائمة أوامر البوت بشكل مفصل",
    usage: "",
    credits: "XaviaTeam"
}

async function onCall({ message, args, prefix, userPermissions }) {
    const { commandsConfig } = global.plugins;

    // لو طلب شرح أمر معيّن
    const commandName = args[0]?.toLowerCase();
    if (commandName) {
        const cmd = commandsConfig.get(commandName);
        if (!cmd || cmd.isHidden)
            return message.reply(
`───═━━━━━
⏤͟͟͞͞   معلومات الأمر
────────
⑉ هذا الأمر غير موجود أو مخفي
────────
`);

        return message.reply(
`───═━━━━━
⏤͟͟͞͞   معلومات الأمر
────────
⑉ الاسم : ${cmd.name}
⑉ الأسماء البديلة : ${cmd.aliases?.join(" ، ") || "لا يوجد"}
⑉ الوصف : ${cmd.description || "لا يوجد"}
⑉ طريقة الاستخدام :
${prefix}${cmd.name} ${cmd.usage || ""}

⑉ القسم : ${cmd.category || "غير محدد"}
⑉ وقت الانتظار : ${cmd.cooldown || 3} ثواني
⑉ المطوّر : ${cmd.credits || "غير معروف"}
────────
`);
    }

    // =========================
    // تجميع الأوامر حسب الأقسام
    // =========================
    let devCmds = [];
    let groupCmds = [];
    let toolsCmds = [];
    let funCmds = [];
    let otherCmds = [];

    for (const [key, cmd] of commandsConfig.entries()) {
        if (cmd.isHidden) continue;
        if (!cmd.permissions) cmd.permissions = [0, 1, 2];
        if (!cmd.permissions.some(p => userPermissions.includes(p))) continue;

        const name = cmd.name || key;
        const cat = (cmd.category || "").toLowerCase();

        if (cat.includes("dev") || cat.includes("owner") || cat.includes("المطور")) {
            devCmds.push(name);
        } else if (cat.includes("group") || cat.includes("admin") || cat.includes("المجموعه")) {
            groupCmds.push(name);
        } else if (cat.includes("tool") || cat.includes("util") || cat.includes("ادوات")) {
            toolsCmds.push(name);
        } else if (cat.includes("fun") || cat.includes("game") || cat.includes("ترفيه")) {
            funCmds.push(name);
        } else {
            otherCmds.push(name);
        }
    }

    const allCmds = [...devCmds, ...groupCmds, ...toolsCmds, ...funCmds, ...otherCmds];

    // =========================
    // شكل القائمة بالزخرفة العربية
    // =========================
    let body =
`───═━━━━━
⏤͟͟͞͞   قائمة أوامر البوت
────────
${allCmds.length ? allCmds.map(c => `⑉ ${c}`).join("\n") : "⑉ لا توجد أوامر حالياً"}
────────
.عدد الأوامر الكلي : ${allCmds.length}
.الاستخدام : ${prefix}مساعدة <اسم الأمر>
────────
`;

    return message.reply(body);
}

export default {
    config,
    onCall
}
