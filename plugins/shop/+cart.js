const fs = require('fs');

exports.run = {
    usage: ['+cart'],
    use: 'code|amount',
    category: 'shop',
    async: async (m, { client, text, Func, isPrefix, setting }) => {
        try {
            if (!text) {
                return client.reply(m.chat, Func.example(isPrefix, command, 'kode_produk|jumlah'), m);
            }

            const [kodeProduk, jumlahStr] = text.split('|');
            if (!kodeProduk || !jumlahStr) {
                return client.reply(m.chat, Func.example(isPrefix, command, 'kode_produk|jumlah'), m);
            }

            const jumlah = parseInt(jumlahStr, 10);
            if (isNaN(jumlah) || jumlah <= 0) {
                return client.reply(m.chat, 'Jumlah harus berupa angka positif.', m);
            }

            const userNumber = m.sender.replace(/@.+/g, '');
            const produkDataPath = './lib/database/produk.json';
            const cartDataPath = './lib/database/cart.json';

            const produkData = JSON.parse(fs.readFileSync(produkDataPath, 'utf8'));
            const cartData = fs.existsSync(cartDataPath) ? JSON.parse(fs.readFileSync(cartDataPath, 'utf8')) : {};

            const produkKey = Object.keys(produkData.produk).find(key => key.split('°')[2] === kodeProduk.toUpperCase());
            if (!produkKey) {
                return client.reply(m.chat, 'Kode produk tidak valid.', m);
            }

            const produk = produkData.produk[produkKey];
            const stokTersedia = produk.stok;

            if (!cartData[userNumber]) {
                cartData[userNumber] = {};
            }

            const existingAmount = cartData[userNumber][kodeProduk.toUpperCase()] ? cartData[userNumber][kodeProduk.toUpperCase()].amount : 0;
            const totalAmount = existingAmount + jumlah;

            if (totalAmount > stokTersedia) {
                return client.reply(m.chat, `Jumlah yang diminta melebihi stok tersedia. Stok yang tersedia untuk ${kodeProduk.toUpperCase()} adalah ${stokTersedia}.`, m);
            }

            if (!cartData[userNumber][kodeProduk.toUpperCase()]) {
                cartData[userNumber][kodeProduk.toUpperCase()] = { amount: 0 };
            }

            cartData[userNumber][kodeProduk.toUpperCase()].amount += jumlah;

            fs.writeFileSync(cartDataPath, JSON.stringify(cartData, null, 2), 'utf8');

var buttons = [
    {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: "🛒 Keranjang",
            id: `${isPrefix}keranjang`
        })
    }
];

            if (setting.style === 1) return client.reply(m.chat, `✅ Produk berhasil ditambahkan ke keranjang.

Kode Produk: ${kodeProduk.toUpperCase()}
Jumlah: ${jumlah}

> kirim ${isPrefix}keranjang untuk mengecek produk pembelian`, m);
            if (setting.style === 2) return client.sendIAMessage(m.chat, buttons, m, {
header: '✅ Produk Berhasil Ditambahkan Ke Keranjang\n',
content: `Kode Produk: ${kodeProduk.toUpperCase()}
Jumlah: ${jumlah}\n`,
footer: global.footer,
media: ''
            })
        } catch (e) {
            console.error(e);
            await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
        }
    },
    error: false,
    location: __filename
};

