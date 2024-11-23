const fs = require('fs');

exports.run = {
   usage: ['setdeskripsi'],
   category: 'shop',
   async: async (m, { client, text, Func, isPrefix, command }) => {
      try {
         client.sendReact(m.chat, '🕘', m.key);

         // Memeriksa apakah teks yang diberikan valid
         if (!text) {
            return client.reply(m.chat, Func.example(isPrefix, command, 'code_produk|deskripsi_baru'), m);
         }

         const [kodeProduk, ...deskripsiBaruArr] = text.split('|');
         const deskripsiBaru = deskripsiBaruArr.join('|');

         if (!kodeProduk || !deskripsiBaru) {
            return client.reply(m.chat, Func.example(isPrefix, command, 'code_produk|deskripsi_baru'), m);
         }

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf-8'));

         // Mencari produk berdasarkan kode produk yang tepat
         const produkKeys = Object.keys(produkData.produk);
         const foundProductKey = produkKeys.find(key => key.split('°')[2] === kodeProduk.toUpperCase());

         if (!foundProductKey) {
            return client.reply(m.chat, 'Produk tidak ditemukan.', m);
         }

         // Mengubah deskripsi produk
         produkData.produk[foundProductKey].deskripsi = deskripsiBaru;

         // Menyimpan perubahan ke file produk.json
         fs.writeFileSync('./lib/database/produk.json', JSON.stringify(produkData, null, 2));

         client.reply(m.chat, `Deskripsi produk ${kodeProduk} telah diubah.`, m);
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};

