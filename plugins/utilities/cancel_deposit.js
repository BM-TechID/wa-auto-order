const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
exports.run = {
   usage: ['cancel-deposit'],
   use: 'unique',
   category: 'deposit',
   async: async (m, {
      client,
      text,
      args,
      isPrefix,
      command,
      users
   }) => {
      try {
         const uniqueCode = args[0];
         const apiKey = global.apikey_paydisini;
         const requestType = "cancel";
         const signature = crypto.createHash('md5').update(apiKey + uniqueCode + 'CancelTransaction').digest('hex');
         // Membuat formulir data
         const form = new FormData();
         form.append('key', apiKey);
         form.append('request', requestType);
         form.append('unique_code', uniqueCode);
         form.append('signature', signature);
         // Mengirim permintaan POST
         const response = await axios.post(global.url_paydisini + '/api/', form, {
            headers: {
               ...form.getHeaders()
            }
         });
         const trxId = uniqueCode;
         const filePath = path.join('lib', 'database', 'transaksi.json');
         const data2 = fs.readFileSync(filePath, 'utf8');
         const transaksi = JSON.parse(data2);
         if (!transaksi.hasOwnProperty(trxId)) {
            return
         }
         delete transaksi[trxId];
         fs.writeFileSync(filePath, JSON.stringify(transaksi, null, 2), 'utf8');
         const data = response.data;
         if (data.success) {
            let pengguna = users
            pengguna.payexpired = '';
            pengguna.create = '';
            pengguna.total_pembayaran = '';
            pengguna.jumlah = '';
            pengguna.payid = '';
            pengguna.depo_opt = false;
            pengguna.note = '';
            pengguna.unique = '';
            pengguna.status_deposit = false;
            let message = `✅ *Deposit Berhasil Dibatalkan*\n\n`;
            message += `• ID Pembayaran: ${data.data.pay_id}\n`;
            message += `• Kode Unik: ${data.data.unique_code}\n`;
            message += `• Status: ${data.data.status}\n`;
            message += `• Jumlah: Rp ${data.data.amount}\n`;
            message += `• Saldo: Rp ${data.data.balance}\n`;
            message += `• Biaya: Rp ${data.data.fee}\n`;
            message += `• Catatan: ${data.data.note}\n`;
            message += `• Dibuat Pada: ${data.data.created_at}\n`;
            client.reply(m.chat, message + '\n' + global.footer, m);
         } else {
            client.reply(m.chat, `🚩 ${data.msg}`, m);
         }
      } catch (error) {
         console.error('Error:', error);
         client.reply(m.chat, `🚩 Terjadi kesalahan saat membatalkan transaksi.`, m);
      }
   },
   error: false,
   location: __filename,
};