exports.run = {
   usage: ['saldo'],
   hidden: [''],
   use: '', 
   category: 'user info',
   async: async (m, {
      client,
      Func, 
      users
   }) => {
      try {
         // Your Code
         client.reply(m.chat, `Saldo Deposit Kamu : *Rp. ${Func.formatNumber(users.deposit)}*`, m)
      } catch (e) {
         return console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   location: __filename
}