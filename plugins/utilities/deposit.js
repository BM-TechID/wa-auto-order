exports.run = {
   usage: ['deposit'],
   use: 'amount',
   category: 'utilities',
   async: async (m, { client, args, isPrefix, command, Func, users }) => {
      try {
        client.sendReact(m.chat, '🕘', m.key)
        if (users.status_deposit) return client.reply(m.chat, '🚩 Anda masih memiliki pembayaran yang belum terselesaikan. kirim *cncl* untuk membatalkan / selesaikan pembayaran terlebih dahulu', m)

         let amount = args[0]
         if (!amount) return client.reply(m.chat, Func.example(isPrefix, command, '1000'), m)
         if (isNaN(amount)) return client.reply(m.chat, Func.example(isPrefix, command, '1000'), m)
         if (amount < 100) {
            return client.reply(m.chat, '*🚩 Deposit minimal di atas 100*', m);
         }
let mess = `*❒ O P T I O N*

*— Manual Check Status* (0.3%)
1. DANA -> QRIS
2. ShopeePay -> QRIS
3. Gopay -> QRIS
4. OVO -> QRIS
5. M Banking BCA -> QRIS
6. LinkAja -> QRIS
7. All E-Wallet -> QRIS
8. Lainnya (Manual)

*— Otomatis Check Status* (0.7%)
9. All E-Wallet -> QRIS

*• Example :*
${isPrefix + command}1 7000

${global.footer}`
client.reply(m.chat, mess, m).then(() => client.sendReact(m.chat, '✅', m.key))
      } catch (e) {
         console.error(e);
         await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   private: true,
   location: __filename
};