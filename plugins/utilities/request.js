exports.run = {
   usage: ['request'],
   use: 'text',
   category: 'utilities',
   async: async (m, {
      client,
      Func, 
      command,
      env,
      text, 
      isPrefix
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'tambahin produk spotify premium!'), m)
         client.reply(m.chat, '🚩 *Request kamu berhasil dikirimkan ke owner*', m).then(() => client.reply(env.owner + '@c.us', `*❒ REQUEST BUYER*

➥ From @${m.sender.replace(/@.+/g, '')}
○ Pesan : ${text} 

${global.footer}`, null)).then(() => client.sendReact(m.chat, '✅', m.key))
      } catch (e) {
         return console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   location: __filename
}