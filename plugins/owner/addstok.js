const fs = require('fs');
const path = require('path');

exports.run = {
    usage: ['addstok'],
    category: 'owner',
    async: async (m, { client, text, isPrefix, command }) => {
        try {
            // Memecah input menjadi judul produk dan teks stok
            let [judul, teksStok] = text.split('|').map(str => str.trim());

            // Mengecek apakah input lengkap
            if (!judul || !teksStok) {
                return client.reply(m.chat, `Format input tidak lengkap.\n\n• Contoh: ${isPrefix + command} judul|teksStok`, m);
            }

            // Membaca file produk.json
            let produkFilePath = './lib/database/produk.json';
            let produkData = JSON.parse(fs.readFileSync(produkFilePath, 'utf8'));

            // Mengecek apakah judul produk ada dalam database
            let foundProductKey = Object.keys(produkData.produk).find(key => key.split('°')[0].toLowerCase() === judul.toLowerCase());

            if (!foundProductKey) {
                return client.reply(m.chat, 'Produk tidak ditemukan dalam database.', m);
            }

            // Mendapatkan detail produk
            let produk = produkData.produk[foundProductKey];
            let stok = produk.stok || 0;
            let totalStok = produk.total_stok || 0;
            let kodeProduk = foundProductKey.split('°')[2];

            // Menambahkan stok
            stok++;
            totalStok++;

            // Menyimpan perubahan stok ke dalam file produk.json
            produk.stok = stok;
            produk.total_stok = totalStok;
            fs.writeFileSync(produkFilePath, JSON.stringify(produkData, null, 3), 'utf8');

            // Menambahkan teks stok pada file produk data dengan nama file berdasarkan kode produk
            let produkDataPath = path.join('lib', 'database', 'data', `${kodeProduk.toLowerCase()}.json`);
            let data = fs.existsSync(produkDataPath) ? JSON.parse(fs.readFileSync(produkDataPath, 'utf8')) : [];
            data.push(teksStok);
            fs.writeFileSync(produkDataPath, JSON.stringify(data, null, 3), 'utf8');

            // Mengirim konfirmasi bahwa stok berhasil ditambahkan
            client.reply(m.chat, `Stok berhasil ditambahkan untuk produk *${foundProductKey.split('°')[0]}* dengan kode *${kodeProduk}*.`, m);
        } catch (e) {
            console.error(e);
            await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
        }
    },
    error: false,
    owner: true,
    location: __filename
};
