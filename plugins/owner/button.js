exports.run = {
   usage: ['button'],
   use: 'on / off',
   category: 'owner',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      setting,
      Func
   }) => {
      try {
         if (!args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'on / off'), m)
         if (args[0] === 'off') {
         if (setting.style === 1) return client.reply(m.chat, '🚩 Mode button sudah dimatikan sebelumnya', m)
            setting.style = 1
            client.reply(m.chat, '🚩 Berhasil mematikan mode button', m)
         }
         if (args[0] === 'on') {
         if (setting.style === 2) return client.reply(m.chat, '🚩 Mode button sudah diaktifkan sebelumnya', m)
            setting.style = 2;
            client.reply(m.chat, '🚩 Berhasil mengubah ke mode Button', m)
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,

   location: __filename
}