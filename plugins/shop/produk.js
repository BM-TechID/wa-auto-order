const fs = require('fs');

exports.run = {
   usage: ['produk'],
   hidden: ['terfavorit', 'terlaris', 'termurah', 'termahal'],
   category: 'shop',
   async: async (m, { client, isPrefix, Func, setting, command }) => {
      try {
         client.sendReact(m.chat, '🕘', m.key);

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf-8'));

         // Pengecekan apakah data produk kosong
         if (!produkData.produk || Object.keys(produkData.produk).length === 0) {
            return client.reply(m.chat, "Belum ada produk untuk sekarang.", m);
         }

         let sortedProduk;

         if (command === 'produk') {
            // Mengubah produkData menjadi array dan menyortir berdasarkan stok_terjual
            sortedProduk = Object.entries(produkData.produk)
               .sort((a, b) => b[1].stok_terjual - a[1].stok_terjual);
         }

         if (command === 'terfavorit') {
            // Menyortir berdasarkan jumlah suka paling banyak
            sortedProduk = Object.entries(produkData.produk)
               .sort((a, b) => (b[1].suka ? b[1].suka.length : 0) - (a[1].suka ? a[1].suka.length : 0));
         }

         if (command === 'terlaris') {
            // Menyortir berdasarkan jumlah terjual paling banyak
            sortedProduk = Object.entries(produkData.produk)
               .sort((a, b) => b[1].stok_terjual - a[1].stok_terjual);
         }

         if (command === 'termurah') {
            // Menyortir berdasarkan harga paling murah
            sortedProduk = Object.entries(produkData.produk)
               .sort((a, b) => parseInt(a[0].split('°')[1]) - parseInt(b[0].split('°')[1]));
         }

         if (command === 'termahal') {
            // Menyortir berdasarkan harga paling mahal
            sortedProduk = Object.entries(produkData.produk)
               .sort((a, b) => parseInt(b[0].split('°')[1]) - parseInt(a[0].split('°')[1]));
         }

         // Mendapatkan kode produk dari produk paling atas
         const kodeProdukTeratas = sortedProduk.length > 0 ? sortedProduk[0][0].split('°')[2] : 'XXXX';

         // Mendapatkan 3 produk teratas berdasarkan stok_terjual untuk penandaan "TOP SALES"
         const top3Produk = sortedProduk.slice(0, 3);

         if (setting.style === 1) {
            let message = `*╭────〔 PRODUK 〕*
*┊⟩* Untuk membeli Ketik Perintah Berikut
*┊⟩* ${isPrefix}beli kode|jumlah
*┊⟩* Cnth: ${isPrefix}beli ${kodeProdukTeratas}|2
*┊⟩* Pastikan Kode & Jumlah Akun di Ketik dengan benar
*╰┈┈┈┈┈┈┈┈*\n\n`;

            // Iterasi melalui semua produk yang telah disortir
            for (const [key, product] of sortedProduk) {
               const [namaProduk, harga, kodeProduk] = key.split('°');
               const description = product.deskripsi;
               const sold = product.stok_terjual;
               const topSales = command === 'produk' &&
                                product.stok_terjual > 10 && // Penjualan lebih dari 10
                                top3Produk.some(p => p[0] === key) ? '- `TOP SALES` ' : '';
               const favorit = product.suka ? product.suka.length : 0;

               // Menambahkan produk ke dalam pesan
               message += `*╭─〔 ${namaProduk} ${topSales}〕*
*┊○* *Harga:* ${Func.formatNumber(harga)}
*┊○* *Stok Tersedia:* ${Func.formatNumber(product.stok)}
*┊○* *Stok Terjual:* ${Func.formatNumber(sold)}
*┊○* *Total Stok:* ${Func.formatNumber(product.total_stok)}
*┊○* *Kode:* ${kodeProduk}
*┊○* *Desk:* ${description}
*┊○* *Favorit:* ${favorit}
*╰┈┈┈┈┈┈┈┈*\n\n`;
            }

            // Mengirim pesan dengan daftar produk
            client.reply(m.chat, message + global.footer, m);
         } else if (setting.style === 2) {
            const sections = [];

            // Iterasi melalui semua produk yang telah disortir
            for (const [key, product] of sortedProduk) {
               const [namaProduk, harga, kodeProduk] = key.split('°');
               const description = product.deskripsi;
               const sold = product.stok_terjual;
               const topSales = product.stok_terjual > 10 && top3Produk.some(p => p[0] === key) ? 'TOP SALES' : '';

               // Menambahkan produk ke dalam sections
               sections.push({
                  title: `🛍️ Produk - ${namaProduk} ${topSales}`,
                  rows: [{
                     title: namaProduk,
                     description: description,
                     id: `${isPrefix}get ${kodeProduk}`
                  }],
                  highlight_label: `Sold: ${Func.formatNumber(sold)}`
               });
            }

            const buttons = [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Product',
                    sections: sections
                })
            }, {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "Filter",
                    sections: [
                        {
                            highlight_label: command === 'termahal' ? '✅' : '',
                            rows: [{
                                title: "Termahal",
                                id: `${isPrefix}termahal`
                            }]
                        },
                        {
                            highlight_label: command === 'termurah' ? '✅' : '',
                            rows: [{
                                title: "Termurah",
                                id: `${isPrefix}termurah`
                            }]
                        },
                        {
                            highlight_label: command === 'terlaris' ? '✅' : '',
                            rows: [{
                                title: "Terlaris",
                                id: `${isPrefix}terlaris`
                            }]
                        },
                        {
                            highlight_label: command === 'terfavorit' ? '✅' : '',
                            rows: [{
                                title: "Terfavorit",
                                id: `${isPrefix}terfavorit`
                            }]
                        }
                    ]
                })
            }];

            // Mengirim pesan interaktif dengan daftar produk
            client.sendIAMessage(m.chat, buttons, m, {
               header: 'List Produk',
               content: 'Berikut adalah daftar produk kami',
               footer: global.footer,
               media: global.db.setting.cover
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
