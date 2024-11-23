const fs = require('fs');

exports.run = {
   usage: ['totalproduk'],
   category: 'shop',
   async: async (m, { client }) => {
      try {
         client.sendReact(m.chat, '🕘', m.key);

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf-8'));

         // Menghitung total produk
         const totalProduk = Object.keys(produkData.produk).length;

         // Mengirim total produk sebagai pesan
         client.reply(m.chat, `Total produk yang tersedia: ${totalProduk}`, m);
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};
