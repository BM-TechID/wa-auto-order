const fs = require('fs');

exports.run = {
   usage: ['favorit'],
   use: 'code',
   category: 'shop',
   async: async (m, { client, text }) => {
      try {
         if (!text) {
            return client.reply(m.chat, 'Silakan masukkan kode produk yang ingin Anda tambahkan ke favorit.', m);
         }

         client.sendReact(m.chat, '🕘', m.key);

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf-8'));

         // Mengubah kode produk menjadi uppercase
         const kodeProduk = text.toUpperCase();

         // Mencari produk berdasarkan kode produk yang tepat
         const produkKeys = Object.keys(produkData.produk);
         const foundProductKey = produkKeys.find(key => key.split('°')[2] === kodeProduk);

         if (!foundProductKey) {
            return client.reply(m.chat, 'Produk tidak ditemukan.', m);
         }

         // Mendapatkan detail produk
         const produk = produkData.produk[foundProductKey];
         
         // Mendapatkan nomor pengguna
         const userNumber = m.sender.replace(/@.+/g, '');

         // Inisialisasi array suka jika belum ada
         if (!produk.suka) {
            produk.suka = [];
         }

         // Menambahkan nomor pengguna ke array suka jika belum ada
         if (!produk.suka.includes(userNumber)) {
            produk.suka.push(userNumber);
         } else {
            return client.reply(m.chat, 'Anda sudah menyukai produk ini.', m);
         }

         // Menyimpan perubahan ke file produk.json
         fs.writeFileSync('./lib/database/produk.json', JSON.stringify(produkData, null, 2));

         client.reply(m.chat, `Produk ${kodeProduk} telah ditambahkan ke daftar favorit Anda.`, m);
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};
