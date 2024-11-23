exports.run = {
   usage: ['setpayment'],
   hidden: ['setpay'],
   category: 'owner',
   async: async (m, {
      client,
      Func, 
      command, 
      text, 
      setting, 
      isPrefix
   }) => {
      try {
         if (!text) return client.reply(m.chat, `${isPrefix + command} 𝐏 𝐀 𝐘 𝐌 𝐄 𝐍 𝐓
   
╭╼
╎∘ Dana : 08xxxx
╎∘ Gopay : 08xxxx
╎∘ Ovo : 08xxxx
╰─━─━─━─━─━─━─━─╼`, m)
          setting.payment = text
          client.reply(m.chat, '🚩 Sukses mengganti Payment', m)
      } catch (e) {
         return console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true, 
   location: __filename
}
