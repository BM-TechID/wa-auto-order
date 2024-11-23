const fs = require('fs');

exports.run = {
   usage: ['delthumbnail'],
   use: 'kode produk',
   category: 'owner',
   async: async (m, { client, text }) => {
      try {
         if (!text) {
            return client.reply(m.chat, 'Silakan masukkan kode produk yang ingin Anda hapus thumbnailnya.', m);
         }

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf8'));

         // Mencari produk berdasarkan kode produk
         const produkKeys = Object.keys(produkData.produk);
         const foundProductKey = produkKeys.find(key => key.split('°')[2] === text);

         if (!foundProductKey) {
            return client.reply(m.chat, 'Kode produk tidak ditemukan.', m);
         }

         // Menghapus thumbnail dari produk
         if (produkData.produk[foundProductKey].thumbnail) {
            delete produkData.produk[foundProductKey].thumbnail;

            // Menulis kembali file produk.json
            fs.writeFileSync('./lib/database/produk.json', JSON.stringify(produkData, null, 2));

            client.reply(m.chat, `Thumbnail berhasil dihapus dari produk ${foundProductKey.split('°')[0]}.`, m);
         } else {
            client.reply(m.chat, 'Produk ini tidak memiliki thumbnail.', m);
         }
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   owner: true,
   location: __filename
};
