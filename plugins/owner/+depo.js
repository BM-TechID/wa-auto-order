exports.run = {
   usage: ['+depo'],
   use: 'mention or reply',
   category: 'owner',
   async: async (m, {
      client,
      args,
      text,
      isPrefix,
      command,
      env,
      Func
   }) => {
      try {
         let users;
         let days;

         if (m.quoted) {
            if (m.quoted.isBot) return client.reply(m.chat, Func.texted('bold', `🚩 Can't make the bot a balance user.`), m);
            if (!args[0] || isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Day must be a number.`), m);
            days = parseInt(args[0], 10);
            let jid = client.decodeJid(m.quoted.sender);
            users = global.db.users.find(v => v.jid == jid);
         } else if (m.mentionedJid.length != 0) {
            if (!args[1] || isNaN(args[1])) return client.reply(m.chat, Func.texted('bold', `🚩 Day must be a number.`), m);
            days = parseInt(args[1], 10);
            let jid = client.decodeJid(m.mentionedJid[0]);
            users = global.db.users.find(v => v.jid == jid);
         } else if (text && /|/.test(text)) {
            let [number, day] = text.split('|');
            let p = (await client.onWhatsApp(number))[0] || {};
            if (!p.exists) return client.reply(m.chat, Func.texted('bold', '🚩 Number not registered on WhatsApp.'), m);
            if (isNaN(day)) return client.reply(m.chat, Func.texted('bold', `🚩 Day must be a number.`), m);
            days = parseInt(day, 10);
            let jid = client.decodeJid(p.jid);
            users = global.db.users.find(v => v.jid == jid);
            if (!users) return client.reply(m.chat, Func.texted('bold', `🚩 Can't find user data.`), m);
         } else {
            let teks = `• *Example* :\n\n`;
            teks += `${isPrefix + command} 6285xxxxx | 7\n`;
            teks += `${isPrefix + command} @WhatsAppBusiness⁩ 7\n`;
            teks += `${isPrefix + command} 7 (reply chat target)`;
            return client.reply(m.chat, teks, m);
         }

         if (users) {
            users.deposit += days;
            client.reply(m.chat, Func.texted('bold', `🚩 Successfully added ${days} balance for @${users.jid.replace(/@.+/, '')}.`), m);
         } else {
            client.reply(m.chat, Func.texted('bold', `🚩 User not found.`), m);
         }
      } catch (e) {
         console.error(e);
         client.reply(m.chat, '🚩 An error occurred while processing your request.', m);
      }
   },
   error: false,
   owner: true,
   cache: true,
   location: __filename
};
