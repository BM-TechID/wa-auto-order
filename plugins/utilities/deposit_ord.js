exports.run = {
   usage: ['deposit4', 'deposit2', 'deposit1', 'deposit3', 'deposit5', 'deposit6', 'deposit7'],
   async: async (m, {
      client,
      Func,
      command,
      isPrefix,
      args,
      setting
   }) => {
      try {
         let users = global.db.users.find(v => v.jid === m.sender)
         if (isNaN(args[0])) return client.reply(m.chat, Func.example(isPrefix, command, '1000'), m)
         if (args[0] < 100) return client.reply(m.chat, '🚩 Deposit minimal Rp 100', m)

         users.orderkuota_deposit_amount = parseInt(args[0])
         users.depo_masuk = parseInt(args[0])
         users.status_deposit = true

         client.sendReact(m.chat, '🕘', m.key)

         let number = m.sender.replace(/@.+/g, '')

         let message = `*❒ AKTIVASI DEPOSIT*
        
○ Jumlah Pengisian : Rp ${Func.formatNumber(users.orderkuota_deposit_amount)}
○ Jumlah Yang Harus Dibayarkan : Rp ${Func.formatNumber(users.orderkuota_deposit_amount)}
○ Status : Proses 🕘

*Catatan :*
- Transfer sesuai dengan nominal deposit (harap tidak lebih / kurang).
- Setelah melakukan pembayaran, tunggu beberapa saat, kemudian kirim *${isPrefix}check <rrn_qris>* untuk mengecek status pembayaran.
- Jika ingin membatalkan pengisian deposit, kirim *${isPrefix}batal*.
- Jika status berhasil, deposit Anda akan otomatis bertambah sebesar Rp. ${Func.formatNumber(users.depo_masuk)},00.
- Apabila ada kendala/pertanyaan lain, silahkan hubungi *owner* (${isPrefix}owner)

${global.footer}`

         let imageUrl
         let tutorial

         if (command === 'deposit4') {
            imageUrl = 'https://i.ibb.co/xM0TxQ5/image.jpg'
            tutorial = `*Tutorial OVO :*
1. Buka aplikasi OVO Anda
2. Klik "History" pada pojok kanan atas
3. Klik transaksi yang ingin Anda cek untuk melihat kode RRN
4. Kode RRN akan terlihat pada keterangan "No. Referensi"`
         }

         if (command === 'deposit1') {
            imageUrl = 'https://i.ibb.co/mFD10CC/image.jpg'
            tutorial = `*Tutorial DANA :*
1. Buka aplikasi DANA Anda
2. Klik "Riwayat" pada button bawah
3. Klik "transaksi" yang ingin Anda cek untuk melihat kode RRN
4. Kode RRN akan terlihat pada keterangan "RRN / RRN QRIS"`
         }

         if (command === 'deposit3') {
            imageUrl = 'https://i.ibb.co/tx7gSLK/image.jpg'
            tutorial = `*Tutorial GoPay :*
1. Buka aplikasi Gojek Anda
2. Klik "History" di menu saldo
3. Pilih riwayat transaksi yang ingin Anda cek untuk melihat kode RRN
4. Kode RRN akan terlihat pada keterangan "QRIS RRN"`
         }

         if (command === 'deposit2') {
            imageUrl = 'https://i.ibb.co/3MVL6x9/image.jpg'
            tutorial = `*Tutorial ShopeePay :*
1. Buka aplikasi ShopeePay Anda
2. Klik isi saldo, dan gulir layar Anda ke bawah
3. Periksa transaksi Anda di “Transaksi terakhir”
4. Klik pembayaran sesuai transaksi yang ingin Anda cek untuk melihat kode RRN
5. Kode RRN akan terlihat pada keterangan "RRN"`
         }

         if (command === 'deposit5') {
            imageUrl = 'https://i.ibb.co/gzd7HBJ/image.jpg'
            tutorial = `*Tutorial Mbanking BCA :*
1. Buka aplikasi BCA mobile dan pilih QRIS pada button di bawah
2. Pilih menu Inbox di pojok kanan atas untuk memeriksa bukti transfer
3. Cek riwayat transaksi dan pilih transaksi yang ingin Anda cek
4. Kode RRN akan terlihat di bagian bawah`
         }

         if (command === 'deposit6') {
            imageUrl = 'https://i.ibb.co/vwmDBSw/image.jpg'
            tutorial = `*Tutorial LinkAja :*
1. Buka aplikasi "LinkAja" dan pilih *Riwayat* pada button di bawah
2. Pilih menu "Selesai" di pojok kanan atas untuk memeriksa bukti transfer
3. Pilih "transaksi" yang ingin Anda cek
4. Kode "RRN" akan terlihat di bagian detail merchant`
         }

         if (command === 'deposit7') {
            imageUrl = 'https://i.ibb.co/mFD10CC/image.jpg'
            tutorial = `*Tutorial :*
1. Buka aplikasi "ewallet" anda
2. Cari "history" transfer / pembayaran
3. Pilih "transaksi" yang ingin Anda cek
4. Cari kode "RRN" pada detail pembayaran`
         }

         client.sendFile(number + '@c.us', setting.qris, '', message, m).then(() => client.sendFile(m.chat, imageUrl, 'image.jpg', `"Cara Melihat/mendapatkan RRN QRIS saat selesai Transfer"

*# Tutorial :*
${tutorial}`, m)).then(() => client.sendReact(m.chat, '✅', m.key))

      } catch (e) {
         console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   private: true,
   location: __filename
}