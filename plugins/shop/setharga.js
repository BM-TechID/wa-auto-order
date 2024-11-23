const fs = require('fs');

exports.run = {
   usage: ['setharga'],
   category: 'shop',
   async: async (m, { client, text, Func }) => {
      try {
         client.sendReact(m.chat, '🕘', m.key);

         // Memeriksa apakah teks yang diberikan valid
         if (!text) {
            return client.reply(m.chat, Func.example(isPrefix, command, 'code_produk|harga_baru'), m);
         }

         const [kodeProduk, hargaBaru] = text.split('|');

         if (!kodeProduk || !hargaBaru) {
            return client.reply(m.chat, Func.example(isPrefix, command, 'code_produk|harga_baru'), m);
         }

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf-8'));

         // Mencari produk berdasarkan kode produk yang tepat
         const produkKeys = Object.keys(produkData.produk);
         const foundProductKey = produkKeys.find(key => key.split('°')[2] === kodeProduk.toUpperCase());

         if (!foundProductKey) {
            return client.reply(m.chat, 'Produk tidak ditemukan.', m);
         }

         // Mendapatkan detail produk
         const produk = produkData.produk[foundProductKey];

         // Menghapus produk lama dari produkData
         delete produkData.produk[foundProductKey];

         // Mengubah harga produk
         const [namaProduk, , kodeProdukAsli] = foundProductKey.split('°');
         const newKey = `${namaProduk}°${hargaBaru}°${kodeProdukAsli}`;
         produkData.produk[newKey] = produk;

         // Menyimpan perubahan ke file produk.json
         fs.writeFileSync('./lib/database/produk.json', JSON.stringify(produkData, null, 2));

         client.reply(m.chat, `Harga produk ${kodeProduk} telah diubah menjadi Rp ${Func.formatNumber(hargaBaru)}.`, m);
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};

