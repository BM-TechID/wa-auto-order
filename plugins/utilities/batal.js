exports.run = {
   usage: ['batal'],
   async: async (m, {
      client,
      users,
      Func
   }) => {
      try {
         if (users.status_deposit) {
         users.orderkuota_deposit_amount = 0
         users.depo_masuk = 0
         users.status_deposit = false
         client.reply(m.chat, '🚩 Aktivasi deposit berhasil di hapus', m)
        }
      } catch (e) {
         return console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   private: true,
   location: __filename
}