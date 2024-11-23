const fs = require('fs');
const path = require('path');

exports.run = {
   usage: ['addproduk'],
   category: 'owner',
   async: async (m, { client, text, isPrefix, command }) => {
      try {
         // Memecah input menjadi detail produk
         let [judul, harga, code, deskripsi] = text.split('|').map(str => str.trim());

         // Mengecek apakah input lengkap
         if (!judul || !harga || !code || !deskripsi) {
            return client.reply(m.chat, `Format input tidak lengkap.

• Example : ${isPrefix + command} judul|harga|code|deskripsi`, m);
         }

         // Membaca file produk.json
         let produkFilePath = './lib/database/produk.json';
         let produkData = {};

         // Memeriksa apakah produk.json ada dan tidak kosong
         if (fs.existsSync(produkFilePath)) {
            let fileContent = fs.readFileSync(produkFilePath, 'utf8');
            produkData = JSON.parse(fileContent);
         }

         // Inisialisasi produkData jika kosong
         if (!produkData || !produkData.produk) {
            produkData = { produk: {} };
         }

         // Mengecek apakah kode produk sudah ada dalam database
         let isCodeExists = Object.keys(produkData.produk).some(key => key.split('°')[2] === code);
         if (isCodeExists) {
            return client.reply(m.chat, 'Kode produk yang sama sudah ada dalam database.', m);
         }

         // Membentuk key produk
         const keyProduk = `${judul}°${harga}°${code}`;

         // Menambahkan produk baru ke dalam database
         produkData.produk[keyProduk] = {
            deskripsi: deskripsi,
            stok: 0,
            stok_terjual: 0,
            total_stok: 0
         };

         // Menyimpan perubahan ke dalam file produk.json
         fs.writeFileSync(produkFilePath, JSON.stringify(produkData, null, 3), 'utf8');

         // Mengirim konfirmasi bahwa produk berhasil ditambahkan
         client.reply(m.chat, `Produk dengan judul *${judul}* berhasil ditambahkan ke dalam database.`, m);
      } catch (e) {
         console.error(e);
         await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   owner: true,
   location: __filename
};