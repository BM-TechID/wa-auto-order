const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

exports.run = {
   usage: ['profile'],
   use: 'mentions / reply',
   category: 'user info',
   async: async (m, { client, Func, users, env, blockList, isPrefix }) => {
      try {
         let user = global.db.users.find(v => v.jid == m.sender);
         let birthday = user.birthday ? `${user.birthdayTgl} - ${user.birthdayBln} - ${user.birthdayThn}` : '-';
         let blocked = blockList.includes(m.sender) ? true : false;
         let _own = [...new Set([env.owner, ...global.db.setting.owners])];
         let number = m.quoted ? (m.quoted.sender).split`@`[0] : (m.sender).split`@`[0];
         if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m);
         if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid format.`), m);

         let userJid = number + '@s.whatsapp.net';

         // Membaca file produk.json
         const produkData = JSON.parse(fs.readFileSync('./lib/database/produk.json', 'utf8'));

         // Menghitung total favorit berdasarkan nomor pengguna
         const userNumber = m.sender.replace(/@.+/g, '');
         let totalFavorit = 0;
         let produkFavorit = [];

         for (const [key, produk] of Object.entries(produkData.produk)) {
            if (produk.suka && produk.suka.includes(userNumber)) {
               totalFavorit++;
               produkFavorit.push(key.split('°')[0]);
            }
         }

         let pic;
         try {
            client.sendReact(m.chat, '🕒', m.key);
            pic = await client.profilePictureUrl(userJid, 'image');
         } catch (e) {
            console.error(e);
         } finally {
            // Jika pic tidak tersedia, gunakan gambar default
            if (!pic) {
               pic = './media/image/default.jpg';
            }

            // Load background and profile picture
            const bg = await loadImage('https://i.ibb.co/NWwCzHx/image.jpg');
            const profilePic = await loadImage(pic);

            // Register font
            registerFont(path.join('media/fonts/maxim.ttf'), { family: 'Maxim' });

            // Create canvas
            const canvas = createCanvas(bg.width, bg.height);
            const ctx = canvas.getContext('2d');

            // Draw background
            ctx.drawImage(bg, 0, 0, bg.width, bg.height);

            // Draw profile picture (centered and circular)
            const centerX = canvas.width / 1.37;
            const centerY = canvas.height / 2;
            const radius = canvas.width / 5.4; // Diameter = 1/6 of width (19:6 aspect ratio)

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.drawImage(profilePic, centerX - radius, centerY - radius, radius * 2, radius * 2);
            ctx.restore();

            // Draw text on the left of pic
            const leftText = env.bot_name;
            ctx.font = '20px "Maxim"';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(leftText, centerX - radius - 285, centerY + 88);

            // Draw text below m.pushName
            const belowText = m.pushName;
            ctx.font = '27px "Maxim"';
            ctx.fillStyle = '#FFBE2D';
            ctx.textAlign = 'left';
            ctx.fillText(belowText, centerX - radius - 220, centerY - 1);

            ctx.font = '27px "Maxim"';
            ctx.fillStyle = '#FFBE2D'; // Yellow text color
            ctx.textAlign = 'left';
            ctx.fillText(users.point, centerX - radius - 220, centerY + 25);

            // Convert canvas to buffer and send as file
            const buffer = canvas.toBuffer('image/jpeg');
            let caption = `乂  *U S E R - P R O F I L E*\n\n`
            caption += `    ◦  *Name* : ${m.pushName}\n`
            caption += `    ◦  *Saldo* : Rp ${Func.formatNumber(user.deposit)}\n`
            caption += `    ◦  *Total Pengeluaran* : ${Func.formatNumber(user.total_pembelian)}\n`
            caption += `    ◦  *Total Pembelian* : Rp ${Func.formatNumber(user.total_pengeluaran)}\n`
            caption += `    ◦  *Total Favorit* : ${Func.formatNumber(totalFavorit)}\n`
            caption += `    ◦  *Hitstat* : ${Func.formatNumber(user.hit)}\n`
            caption += `    ◦  *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[m.sender] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[m.sender].warning : 0) + ' / 5' : user.warning + ' / 5')}\n\n`
            caption += `乂  *U S E R - S T A T U S*\n\n`
            caption += `    ◦  *Blocked* : ${(blocked ? '√' : '×')}\n`
            caption += `    ◦  *Banned* : ${(new Date - user.ban_temporary < env.timer) ? Func.toTime(new Date(user.ban_temporary + env.timeout) - new Date()) + ' (' + ((env.timeout / 1000) / 60) + ' min)' : user.banned ? '√' : '×'}\n`
            caption += `    ◦  *Use In Private* : ${(global.db.chats.map(v => v.jid).includes(m.sender) ? '√' : '×')}\n\n`
            caption += global.footer;
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: buffer, 
               url: global.db.setting.link
            }).then(() => client.sendReact(m.chat, '✅', m.key));
         }
      } catch (e) {
         console.error(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   error: false,
   cache: true,
   location: __filename
};
