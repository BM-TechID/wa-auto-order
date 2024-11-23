const fs = require('fs');

exports.run = {
    usage: ['-cart'],
    use: 'code',
    category: 'shop',
    async: async (m, { client, text, isPrefix, command, Func }) => {
        try {
            if (!text) {
                return client.reply(m.chat, `*• Contoh Penggunaan :*

> menghapus produk dari keranjang
${isPrefix + command} code_produk

> mengurangi jumlah pembelian produk
${isPrefix + command} code_produk|jumlah`, m);
            }

            const [kodeProduk, jumlahStr] = text.split('|');
            const userNumber = m.sender.replace(/@.+/g, '');
            const cartDataPath = './lib/database/cart.json';

            const cartData = fs.existsSync(cartDataPath) ? JSON.parse(fs.readFileSync(cartDataPath, 'utf8')) : {};

            if (!cartData[userNumber] || !cartData[userNumber][kodeProduk.toUpperCase()]) {
                return client.reply(m.chat, 'Produk tidak ditemukan dalam keranjang Anda.', m);
            }

            if (!jumlahStr) {
                // Menghapus produk dari keranjang
                delete cartData[userNumber][kodeProduk.toUpperCase()];

                if (Object.keys(cartData[userNumber]).length === 0) {
                    delete cartData[userNumber];
                }

                fs.writeFileSync(cartDataPath, JSON.stringify(cartData, null, 2), 'utf8');

                return client.reply(m.chat, `Produk ${kodeProduk.toUpperCase()} berhasil dihapus dari keranjang.`, m);
            } else {
                const jumlah = parseInt(jumlahStr, 10);
                if (isNaN(jumlah) || jumlah <= 0) {
                    return client.reply(m.chat, 'Jumlah harus berupa angka positif.', m);
                }

                if (cartData[userNumber][kodeProduk.toUpperCase()].amount < jumlah) {
                    return client.reply(m.chat, `Jumlah yang ingin dihapus melebihi jumlah dalam keranjang. Anda memiliki ${cartData[userNumber][kodeProduk.toUpperCase()].amount} produk ${kodeProduk.toUpperCase()} dalam keranjang.`, m);
                }

                // Mengurangi jumlah produk dalam keranjang
                cartData[userNumber][kodeProduk.toUpperCase()].amount -= jumlah;

                if (cartData[userNumber][kodeProduk.toUpperCase()].amount === 0) {
                    delete cartData[userNumber][kodeProduk.toUpperCase()];

                    if (Object.keys(cartData[userNumber]).length === 0) {
                        delete cartData[userNumber];
                    }
                }

                fs.writeFileSync(cartDataPath, JSON.stringify(cartData, null, 2), 'utf8');

                client.reply(m.chat, `Jumlah produk ${kodeProduk.toUpperCase()} berhasil dikurangi sebanyak ${jumlah}.`, m);
            }
        } catch (e) {
            console.error(e);
            await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
        }
    },
    error: false,
    location: __filename
};
