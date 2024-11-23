const fs = require('fs');
const path = require('path');

exports.run = {
   usage: ['delproduk'],
   category: 'owner',
   async: async (m, { client, text, isPrefix, command }) => {
      try {
         if (!text) {
            return client.reply(m.chat, `Silakan masukkan judul produk yang ingin Anda hapus dari produk.\n\n• Contoh: ${isPrefix + command} judul_produk`, m);
         }

         // Mencari judul produk yang ingin dihapus
         let judul = text.trim().toLowerCase(); // Mengubah judul produk menjadi lowercase

         // Membaca file produk.json
         let produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf8'));

         // Mengecek apakah produk dengan judul yang diberikan ada dalam database
         let produkKeys = Object.keys(produkData.produk);

         // Mencari judul produk dengan huruf kecil yang cocok
         let foundProductKey = produkKeys.find(key => key.split('°')[0].toLowerCase() === judul);

         if (!foundProductKey) {
            return client.reply(m.chat, 'Produk dengan judul tersebut tidak ditemukan dalam database.', m);
         }

         // Mendapatkan kode produk
         let kodeProduk = foundProductKey.split('°')[2];

         // Menghapus produk dari database
         delete produkData.produk[foundProductKey];

         // Menyimpan perubahan ke dalam file produk.json
         fs.writeFileSync('./lib/database/produk.json', JSON.stringify(produkData, null, 3), 'utf8');

         // Menghapus file produk dari direktori "lib/database/data"
         let produkFileName = `${kodeProduk.toLowerCase()}.json`;
         let produkFilePath = path.join('lib', 'database', 'data', produkFileName); // Menggunakan direktori yang sama dengan produk.json
         if (fs.existsSync(produkFilePath)) {
            fs.unlinkSync(produkFilePath);
         }

         // Mengirim konfirmasi bahwa produk berhasil dihapus
         client.reply(m.chat, `Produk dengan judul *${foundProductKey.split('°')[0]}* dan kode *${kodeProduk}* berhasil dihapus dari database.`, m);
      } catch (e) {
         console.error(e);
         await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   owner: true,
   location: __filename
};
