const fetch = require('node-fetch');
const md5 = require('md5');
const qrcode = require('qrcode');
const fs = require('fs');
exports.run = {
   usage: ['deposit-paydis'],
   hidden: ['deposit9'],
   use: 'amount',
   category: 'deposit',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func,
      users
   }) => {
      try {
         // Mengurai teks input
         let amount = args[0]
         let note = `${m.sender.replace(/@.+/g, '')} Deposit Sebesar Rp. ${Func.formatNumber(amount)}`
         // Mengecek
         if (isNaN(amount)) {
            return client.reply(m.chat, Func.example(isPrefix, command, '5000'), m);
         }
         if (amount < 100) {
            return client.reply(m.chat, '*🚩 Deposit minimal di atas 100*', m);
         }
         client.sendReact(m.chat, '🕘', m.key)
         const number = m.sender.replace(/@.+/g, '')

         function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = 'YANA-';
            for (let i = 0; i < length; i++) {
               result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
         }
         const randomString = generateRandomString(10);
         // Menyiapkan parameter untuk request
         let key = global.apikey_paydisini;
         let service = global.channel;
         let validTime = "900";
         let typeFee = global.type_fee;
         let signature = md5(`${key}${randomString}${service}${amount}${validTime}NewTransaction`);
         // Membuat payload untuk request
         let formdata = new URLSearchParams();
         formdata.append("key", key);
         formdata.append("request", "new");
         formdata.append("unique_code", randomString);
         formdata.append("service", service);
         formdata.append("amount", amount);
         formdata.append("note", note);
         formdata.append("valid_time", validTime);
         formdata.append("type_fee", typeFee);
         formdata.append("signature", signature);
         // Membuat request ke API Paydisini
         let requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
         };
         // Mengirimkan request dan menangani responsenya
         let response = await fetch(global.url_paydisini + "/api/", requestOptions);
         let result = await response.json();
         // Menghasilkan QR code dari qr_content
         const qrCodeData = await qrcode.toDataURL(result.data.qr_content);
         // Simpan QR code sebagai gambar
         const fileName = `qrcode_${Date.now()}.png`;
         const filePath = `./media/${fileName}`;
         // Simpan QR code sebagai gambar
         await qrcode.toFile(filePath, result.data.qr_content);
         // Cek Data
         let total = result.data.amount;
         let payID = result.data.pay_id;
         let create = result.data.created_at;
         let expired = result.data.expired;
         var buttons = [{
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
               display_text: "Cancel Deposit",
               id: `${isPrefix}cancel-deposit ${randomString}`
            }),
         }]
         // Kirim QR code sebagai pesan
         await client.sendFile(number + '@c.us', filePath, 'qrcode.png', `*❒  QRIS*

Pay Id : ${payID}
Status : *Pending 🕘*
Unique Code : *${randomString}*
Jumlah : *Rp. ${Func.formatNumber(amount)}*
Total Pembayaran : *Rp. ${Func.formatNumber(total)}*

Note : ${note}

Create : *${create}*
Expired : *${expired}*

○ Silahkan scan *QRIS* tersebut menggunakan ewallet / bank dan melakukan pembayaran
○ *QRIS* Expired 15 menit
○ Setelah melakukan pembayaran, maka secara otomatis deposit anda akan bertambah sebesar *Rp. ${Func.formatNumber(amount)}*
○ Jika ingin membatalkan pengisian deposit, biarkan saja (akan otomatis dibatalkan ketika expired)
○ Jika terjadi kendala / pertanyaan lainnya, bisa hubungi *Owner*

${global.footer}`, m).then(() => client.sendIAMessage(number + '@c.us', buttons, null, {
            header: '',
            content: 'Cancel Deposit',
            footer: '',
            media: ''
         })).then(() => client.sendReact(m.chat, '✅', m.key));
         if (m.isGroup) return client.reply(m.chat, '*🚩 Aktivasi deposit telah dikirimkan pada private chat*', m)
         users.payexpired = expired
         users.create = create
         users.total_pembayaran = total
         users.jumlah = amount
         users.payid = payID
         users.note = note
         users.unique = randomString
         users.opt_depo = true
         // Tambahkan data unique_code ke transaksi.json
         let transaksiData = fs.readFileSync('./lib/database/transaksi.json', 'utf8');
         let transaksi = JSON.parse(transaksiData);
         transaksi[randomString] = {
            balance: result.data.balance,
            nomor: `${m.sender.replace(/@.+/g, '')}`
         };
         fs.writeFileSync('./lib/database/transaksi.json', JSON.stringify(transaksi, null, 2));
         // Hapus file QR code setelah dikirim
         fs.unlinkSync(filePath);
      } catch (e) {
         console.error(e);
         await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};