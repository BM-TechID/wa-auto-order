const fs = require('fs');

exports.run = {
   usage: ['listfavorit'],
   category: 'user info',
   async: async (m, { client, Func, setting, isPrefix }) => {
      try {
         client.sendReact(m.chat, '🕘', m.key);

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf-8'));

         // Menghitung produk yang disukai oleh pengguna berdasarkan nomor pengguna
         const userNumber = m.sender.replace(/@.+/g, '');
         let produkFavorit = [];

         for (const [key, produk] of Object.entries(produkData.produk)) {
            if (produk.suka && produk.suka.includes(userNumber)) {
               produkFavorit.push(key);
            }
         }

         // Jika tidak ada produk yang disukai
         if (produkFavorit.length === 0) {
            return client.reply(m.chat, 'Anda belum menyukai produk apapun.', m);
         }

         // Membuat pesan daftar produk favorit
         let message = `*Daftar Produk Favorit Anda:*\n`;

         if (setting.style === 1) {
            produkFavorit.forEach((produk, index) => {
               const [namaProduk, harga, kodeProduk] = produk.split('°');
               const deskripsi = produkData.produk[produk].deskripsi;
               const stok = produkData.produk[produk].stok;
               const stokTerjual = produkData.produk[produk].stok_terjual;
               const totalStok = produkData.produk[produk].total_stok;

               message += `\n${index + 1}. *${namaProduk}*\n`;
               message += `- Harga: Rp ${Func.formatNumber(harga)}\n`;
               message += `- Kode Produk: ${kodeProduk}\n`;
               message += `- Stok: ${stok}\n`;
               message += `- Terjual: ${stokTerjual}\n`;
               message += `- Total Stok: ${totalStok}\n`;
               message += `- Deskripsi: ${deskripsi}\n`;
               message += `_____________________________\n`;
            });

            // Mengirim pesan dengan daftar produk favorit dalam bentuk teks
            client.reply(m.chat, message + '\n' + global.footer, m).then(() => client.sendReact(m.chat, '✅', m.key));
         } else if (setting.style === 2) {
            const sections = [];
            let counter = 1;

            produkFavorit.forEach((produk) => {
               const [namaProduk, harga, kodeProduk] = produk.split('°');
               const deskripsi = produkData.produk[produk].deskripsi;
               const stok = produkData.produk[produk].stok;
               const stokTerjual = produkData.produk[produk].stok_terjual;
               const totalStok = produkData.produk[produk].total_stok;

               sections.push({
                  title: counter,
                  rows: [{
                     header: namaProduk,
                     title: `Harga : Rp ${Func.formatNumber(harga)}`,
                     description: deskripsi,
                     id: `${isPrefix}get ${kodeProduk}`
                  }],
                  highlight_label: `Sold: ${stokTerjual}`
               });

               counter++;
            });

            const buttons = [{
               name: 'single_select',
               buttonParamsJson: JSON.stringify({
                  title: 'Daftar Produk Favorit',
                  sections: sections
               })
            }];

            // Mengirim pesan interaktif dengan daftar produk favorit menggunakan button list
            client.sendIAMessage(m.chat, buttons, m, {
               header: 'Daftar Produk Favorit\n',
               content: 'Berikut adalah daftar produk favorit Anda\n',
               footer: global.footer,
               media: 'https://i.ibb.co/wdScCCz/image.jpg'
            }).then(() => client.sendReact(m.chat, '✅', m.key));
         }
      } catch (e) {
         console.error(e);
         client.reply(m.chat, `Terjadi kesalahan dalam mengambil data produk: ${e.message}`, m);
      }
   },
   error: false,
   location: __filename
};

