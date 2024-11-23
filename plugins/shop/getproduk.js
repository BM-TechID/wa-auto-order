const fs = require('fs');

exports.run = {
   usage: ['getproduk'],
   hidden: ['get'],
   category: 'shop',
   async: async (m, { client, text, Func, isPrefix, setting }) => {
      try {
         if (!text) {
            return client.reply(m.chat, 'Silakan masukkan kode produk yang ingin Anda dapatkan detailnya.', m);
         }

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf8'));

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
         const [namaProduk, harga] = foundProductKey.split('°');
         const deskripsi = produk.deskripsi;
         const stok = produk.stok;
         const stokTerjual = produk.stok_terjual;
         const totalStok = produk.total_stok;
         const favorit = produk.suka ? produk.suka.length : 0;

         const message = `╭─━〘 *${namaProduk}* 〙
│➺ *Harga:* Rp ${Func.formatNumber(harga)}
│➺ *Kode Produk:* ${kodeProduk}
│➺ *Stok:* ${stok}
│➺ *Terjual:* ${stokTerjual}
│➺ *Total Stok:* ${totalStok}
╰─━─━─━─━─━─━─━─━─≫

○ *${favorit}* orang menyukai produk ini
○ *Deskripsi:* _${deskripsi}_

> Cara pembelian: ${isPrefix}beli kode_produk|jumlah_pembelian
> • Example: ${isPrefix}beli ${kodeProduk}|1

${global.footer}`;

         if (setting.style === 1) {
            // Style 1: Send with file if thumbnail exists, otherwise send plain text
            if (produk.thumbnail) {
               await client.sendFile(m.chat, produk.thumbnail, 'image.jpg', message, m);
            } else {
               await client.reply(m.chat, message, m);
            }
         } else if (setting.style === 2) {
            // Style 2: Send with interactive buttons
var buttons = [
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "❤️ Favorit",
            id: `${isPrefix}favorit ${kodeProduk}`
        })
    },
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "🛒 Add Cart",
            id: `${isPrefix}+cart ${kodeProduk}|1`
        })
    }
];
            
            await client.sendIAMessage(m.chat, buttons, m, {
               header: '',
               content: message,
               footer: '',
               media: produk.thumbnail || ''
            });
         } else {
            // Default case: plain reply
            await client.reply(m.chat, message, m);
         }
      } catch (e) {
         console.error(e);
         await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};

