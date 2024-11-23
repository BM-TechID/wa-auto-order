const fs = require('fs');

exports.run = {
   usage: ['addthumbnail'],
   use: 'reply foto',
   category: 'owner',
   async: async (m, { client, text, Func, Scraper }) => {
      try {
         if (!text) {
            return client.reply(m.chat, 'Silakan masukkan kode produk yang ingin Anda tambahkan thumbnailnya.', m);
         }

         // Memeriksa apakah ada gambar yang direply
         let q = m.quoted ? m.quoted : m;
         let mime = (q.msg || q).mimetype || '';
         if (!/image/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Gambar tidak ditemukan.`), m);

         client.sendReact(m.chat, '🕒', m.key);

         // Mengunduh gambar
         let img = await q.download();
         if (!img) return client.reply(m.chat, global.status.wrong, m);

         // Mengupload gambar dan mendapatkan URL
         let link = await Scraper.uploadImage(img);
         if (!link.status) return client.reply(m.chat, Func.jsonFormat(link), m);

         let url = link.data.url;

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf8'));

         // Mencari produk berdasarkan kode produk
         const produkKeys = Object.keys(produkData.produk);
         const foundProductKey = produkKeys.find(key => key.split('°')[2] === text);

         if (!foundProductKey) {
            return client.reply(m.chat, 'Kode produk tidak ditemukan.', m);
         }

         // Menambahkan thumbnail ke produk
         produkData.produk[foundProductKey].thumbnail = url;

         // Menulis kembali file produk.json
         fs.writeFileSync('./lib/database/produk.json', JSON.stringify(produkData, null, 2));

         client.reply(m.chat, `Thumbnail berhasil ditambahkan ke produk ${foundProductKey.split('°')[0]}.`, m);
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   owner: true,
   location: __filename
};
