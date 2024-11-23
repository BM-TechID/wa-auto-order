const fs = require('fs');

exports.run = {
    usage: ['keranjang'],
    category: 'shop',
    async: async (m, { client, Func, setting, isPrefix }) => {
        try {
            const userNumber = m.sender.replace(/@.+/g, '');
            const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf8'));
            const cartData = JSON.parse(fs.readFileSync('./lib/database/cart.json', 'utf8'));

            if (!cartData[userNumber]) {
                return client.reply(m.chat, 'Keranjang belanja Anda kosong.', m);
            }

            const userCart = cartData[userNumber];
            let message = `╭─━〘 *🛒 KERANJANG* 〙\n`;

            let totalHargaSemuaProduk = 0;

            for (const kodeProduk in userCart) {
                const amount = userCart[kodeProduk].amount;

                const produkKey = Object.keys(produkData.produk).find(key => key.split('°')[2] === kodeProduk);
                if (!produkKey) continue;

                const [namaProduk, harga] = produkKey.split('°');
                const totalHargaProduk = amount * parseInt(harga, 10);
                totalHargaSemuaProduk += totalHargaProduk;

                message += `│➺ *${namaProduk}*\n`;
                message += `│   - Harga: Rp ${Func.formatNumber(harga)} × ${amount} = Rp ${Func.formatNumber(totalHargaProduk)}\n`;
            }

            message += `╰─━─━─━─━─━─━─━─━─≫\n\n`;
            message += `○ *Total Harga Semua Produk:* Rp ${Func.formatNumber(totalHargaSemuaProduk)}\n`;
            if (setting.style === 1) {
               message += `\n> kirim "checkout" untuk membeli produk yang ada pada keranjang\n\n`;
               message += `${global.footer}`;
            }

            if (setting.style === 1) {
               client.reply(m.chat, message, m);
            }

            if (setting.style === 2) {
var buttons = [{
   name: "quick_reply",
   buttonParamsJson: JSON.stringify({
      display_text: "🛍️ CHECKOUT",
      id: `${isPrefix}checkout`
   })
}]
               client.sendIAMessage(m.chat, buttons, m, {
                  headers: '', 
                  content: message,
                  footer: global.footer,
                  media: ''
               });
            }
        } catch (e) {
            console.error(e);
            await client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
        }
    },
    error: false,
    location: __filename
};
