const fs = require('fs');
const path = require('path');

exports.run = {
    usage: ['beli'],
    hidden: ['buy'],
    use: 'code|amount',
    category: 'shop',
    async: async (m, { client, env, args, isPrefix, text, command, Func, setting, users }) => {
        const number = `${m.sender.replace(/@.+/g, '')}`
        const [code, amount] = text.split('|');
        if (!code || isNaN(amount)) {
            return client.reply(m.chat, `🚩 *Format salah!*\n\n• Penggunaan : ${isPrefix + command} code|jumlah\n• Contoh : ${isPrefix + command} TT200|2`, m);
        }

        if (!users) return client.reply(m.chat, '🚩 Pengguna tidak ditemukan.', m);

        // Path ke file produk.json
        const produkFilePath = path.join('lib', 'database', 'produk.json');
        // Path ke file tt200.json (atau sesuai dengan kode produk)
        const codeFilePath = path.join('lib', 'database', 'data', `${code.toLowerCase()}.json`);

        try {
            // Baca file produk.json
            const produkData = JSON.parse(fs.readFileSync(produkFilePath, 'utf8'));

            // Cek apakah produk dengan kode tersebut ada
            const produkKey = Object.keys(produkData.produk).find(key => key.endsWith(`°${code.toUpperCase()}`));
            if (!produkKey) return client.reply(m.chat, '🚩 Produk tidak ditemukan.', m);
            // Cek apakah stok mencukupi
            const produk = produkData.produk[produkKey];
            if (produk.stok < amount) {
                return client.reply(m.chat, '🚩 Stok tidak mencukupi.', m);
            }

            const [judul, hargaStr, kodeProduk] = produkKey.split('°');
            const harga = parseInt(hargaStr);
            const total = harga * parseInt(amount);

            if (users.deposit < total) {
                const selisih = total - users.deposit;
                return client.reply(m.chat, `🚩 Saldo kamu tidak mencukupi. Saldo kamu kurang Rp. ${Func.formatNumber(selisih)}`, m);
            }

            // Baca file code.json
            let codeData = JSON.parse(fs.readFileSync(codeFilePath, 'utf8'));

            // Kirim pesan sebanyak amount dan hapus data yang dikirimkan
            const codesToSend = codeData.splice(0, amount);
            for (let i = 0; i < codesToSend.length; i++) {
                let number = `${m.sender.replace(/@.+/g, '')}`
                await client.reply(number + '@c.us', codesToSend[i], m);
            }

            // Simpan perubahan ke dalam file code.json
            fs.writeFileSync(codeFilePath, JSON.stringify(codeData, null, 2), 'utf8');

            // Kasus pengguna
            users.deposit -= harga * amount;
            users.total_pengeluaran += harga * amount;
            users.total_pembelian += parseInt(amount);

            // Kurangi stok produk
            produk.stok -= parseInt(amount);
            produk.stok_terjual += parseInt(amount);

            // Simpan perubahan ke dalam produk.json
            fs.writeFileSync(produkFilePath, JSON.stringify(produkData, null, 2), 'utf8');

            client.reply(m.chat, `✅ Pembelian berhasil.

- Produk : ${judul}
- Jumlah Pembelian : ${amount}
- Total Harga : Rp. ${Func.formatNumber(harga * amount)}

> _Terimakasih Atas Pembeliannya Di ${env.merchant}_

${global.footer}`, m).then(() => client.reply(env.owner + '@c.us', `🔴 *NOTIFIKASI*

@${number} Membeli produk - *${judul}*
- Jumlah Pembelian : ${amount}
- Total Pembelian : Rp. ${Func.formatNumber(harga * amount)}
- Sisa Stok Produk : ${Func.formatNumber(produk.stok)}

${global.footer}`, m));
        } catch (error) {
            console.error('Error in beli request:', error);
            client.reply(m.chat, '❌ Terjadi kesalahan saat melakukan pembelian.', m);
        }
    },
    error: false,
    location: __filename
};

