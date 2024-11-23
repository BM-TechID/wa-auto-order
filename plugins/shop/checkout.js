const fs = require('fs');

exports.run = {
    usage: ['checkout'],
    category: 'shop',
    async: async (m, { client, Func, env, isPrefix, users }) => {
        try {
            const userNumber = m.sender.replace(/@.+/g, '');
            const produkDataPath = './lib/database/produk.json';
            const cartDataPath = './lib/database/cart.json';

            const produkData = JSON.parse(fs.readFileSync(produkDataPath, 'utf8'));
            const cartData = JSON.parse(fs.readFileSync(cartDataPath, 'utf8'));

            if (!cartData[userNumber]) {
                return client.reply(m.chat, 'Keranjang belanja Anda kosong.', m);
            }

            const userCart = cartData[userNumber];
            let totalHarga = 0;
            let produkList = '';

            // Check stock for all products in the cart
            for (const kodeProduk in userCart) {
                const amount = userCart[kodeProduk].amount;
                const produkKey = Object.keys(produkData.produk).find(key => key.split('°')[2] === kodeProduk);
                if (produkKey) {
                    const produk = produkData.produk[produkKey];
                    if (produk.stok < amount) {
                        return client.reply(m.chat, `Stok untuk produk ${produkKey.split('°')[0]} tidak mencukupi.\n\nSilakan kurangi jumlah pembelian untuk produk tersebut.`, m);
                    }
                }
            }

            // Calculate total price and prepare product list
            for (const kodeProduk in userCart) {
                const amount = userCart[kodeProduk].amount;
                const produkKey = Object.keys(produkData.produk).find(key => key.split('°')[2] === kodeProduk);
                if (produkKey) {
                    const [namaProduk, harga] = produkKey.split('°');
                    totalHarga += amount * parseInt(harga, 10);
                    produkList += `  - ${namaProduk} : ${amount}\n`;
                }
            }

            // Get user's balance
            let user = global.db.users.find(v => v.jid == m.sender);
            if (user.deposit < totalHarga) {
                let selisih = totalHarga - user.deposit;
                var buttons = [{
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "ISI DEPOSIT",
                        id: `${isPrefix}deposit ${selisih}`
                    }),
                }];
                client.reply(m.chat, 'Saldo Anda tidak mencukupi untuk pembelian ini.', m).then(() => client.sendIAMessage(m.chat, buttons, m, {
                    header: 'DEPOSIT\n',
                    content: `Pengisian deposit sebanyak Rp. ${Func.formatNumber(selisih)}`,
                    footer: global.footer,
                    media: ''
                }));
                return;
            }

            // Process the purchase
            for (const kodeProduk in userCart) {
                const amount = userCart[kodeProduk].amount;
                const produkKey = Object.keys(produkData.produk).find(key => key.split('°')[2] === kodeProduk);

                if (produkKey) {
                    const [namaProduk, , kodeProduk] = produkKey.split('°');
                    const produk = produkData.produk[produkKey];

                    // Send product messages to the user
                    const pesanPath = `./lib/database/data/${kodeProduk.toLowerCase()}.json`;
                    if (fs.existsSync(pesanPath)) {
                        let pesanProduk = JSON.parse(fs.readFileSync(pesanPath, 'utf8'));

                        if (pesanProduk.length >= amount) {
                            const pesanTerkirim = pesanProduk.splice(0, amount);
                            for (const pesan of pesanTerkirim) {
                                await client.reply(userNumber + '@c.us', pesan, m);
                            }

                            // Save remaining product messages
                            fs.writeFileSync(pesanPath, JSON.stringify(pesanProduk, null, 2), 'utf8');
                        } else {
                            return client.reply(m.chat, `Jumlah pembelian untuk produk ${namaProduk} tidak mencukupi.\n\n> note: kurangi jumlah pembelian pada produk ${namaProduk}`, m);
                        }
                    }

                    // Update stock and sold stock
                    produk.stok -= amount;
                    produk.stok_terjual += amount;
                    users.total_pembelian += amount;
                    users.total_pengeluaran += totalHarga;
                }
            }

            // Update user's balance
            user.deposit -= totalHarga;

            // Clear user's cart
            delete cartData[userNumber];

            // Save changes to files
            fs.writeFileSync(produkDataPath, JSON.stringify(produkData, null, 2), 'utf8');
            fs.writeFileSync(cartDataPath, JSON.stringify(cartData, null, 2), 'utf8');

            const pesanPembelianBerhasil = `Pembelian berhasil!\n\nTotal harga: Rp ${Func.formatNumber(totalHarga)}.\nSaldo Anda sekarang: Rp ${Func.formatNumber(user.deposit)}.\n\n${global.footer}`;

            const pesanNotifikasiOwner = `*🔴 NOTIFIKASI*\n\n○ Name: ${m.pushName}\n○ Nomor: ${userNumber}\n○ List Produk:\n${produkList}○ Total Pembelian: Rp ${Func.formatNumber(totalHarga)}`;

            await client.reply(m.chat, pesanPembelianBerhasil, m);
            await client.reply(env.owner + '@c.us', pesanNotifikasiOwner, null);
        } catch (e) {
            console.error(e);
            await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
        }
    },
    error: false,
    location: __filename
};

