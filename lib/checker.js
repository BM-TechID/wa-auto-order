const axios = require('axios');
const FormData = require('form-data');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const env = require('../config.json');
const setting = global.db.setting;

async function cekStatusTransaksi(client, uniqueCode, Func) {
  try {
    let apiKey = global.apikey_paydisini;
    let signature = md5(apiKey + uniqueCode + 'StatusTransaction');

    // Prepare form-data
    var formdata = new FormData();
    formdata.append("key", apiKey);
    formdata.append("request", "status");
    formdata.append("unique_code", uniqueCode);
    formdata.append("signature", signature);

    const response = await axios.post('https://paydisini.co.id/api/', formdata, {
      headers: formdata.getHeaders()
    });

    if (response.data.success) {
      const transaction = response.data.data;
      const transaksiPath = path.join('lib', 'database', 'transaksi.json');
      let transaksi = JSON.parse(fs.readFileSync(transaksiPath, 'utf-8'));

      if (transaction.status.toLowerCase() === 'success') {
        if (transaksi[uniqueCode]) {
          let number = transaksi[uniqueCode].nomor;
          let balance = transaksi[uniqueCode].balance;

          // Cari pengguna di global.db
          let pengguna = global.db.users.find(v => v.jid === number + '@s.whatsapp.net');

          // Tambahkan saldo ke pengguna.deposit
          pengguna.deposit += balance;

          // Hapus data transaksi setelah saldo ditambahkan
          delete transaksi[uniqueCode];
          fs.writeFileSync(transaksiPath, JSON.stringify(transaksi, null, 2));

          // Reset beberapa properti pengguna setelah saldo ditambahkan
          pengguna.payexpired = '';
          pengguna.create = '';
          pengguna.total_pembayaran = '';
          pengguna.jumlah = '';
          pengguna.payid = '';
          pengguna.depo_opt = false;
          pengguna.note = '';
          pengguna.unique = '';
          pengguna.status_deposit = false;

          // Kirim notifikasi ke pengguna
          client.reply(number + '@c.us', `*🔴  NOTIFIKASI*

✅ Saldo sebesar Rp. ${Func.formatNumber(balance)} berhasil ditambahkan ke akun Anda.

${global.footer}`, null);
        } else {
          client.reply(env.owner + '@c.us', `🚩 Transaksi dengan uniqueCode ${uniqueCode} tidak ditemukan dalam transaksi.json.`, null);
        }
      } else if (transaction.status.toLowerCase() === 'canceled') {
        if (transaksi[uniqueCode]) {
          let number = transaksi[uniqueCode].nomor;

          // Hapus data transaksi karena status canceled
          delete transaksi[uniqueCode];
          fs.writeFileSync(transaksiPath, JSON.stringify(transaksi, null, 2));

          let pengguna = global.db.users.find(v => v.jid === number + '@s.whatsapp.net');
          pengguna.payexpired = '';
          pengguna.create = '';
          pengguna.total_pembayaran = '';
          pengguna.jumlah = '';
          pengguna.payid = '';
          pengguna.depo_opt = false;
          pengguna.note = '';
          pengguna.unique = '';
          pengguna.status_deposit = false;

          client.reply(number + '@c.us', `*🔴  NOTIFIKASI*

🚩 Unique Code ${uniqueCode} telah kadaluarsa (Expired).

${global.footer}`, null);
        }
      }
    } else {
      client.reply(env.owner + '@c.us', `🚩 Gagal mendapatkan status transaksi: ${response.data.msg}`, null);
    }
  } catch (error) {
    console.error('Error making the request:', error);
    client.reply(env.owner + '@c.us', '❌ Terjadi kesalahan saat melakukan permintaan.', null);
  }
}

async function cekAllStatus(client, Func) {
  try {
    while (true) {  // Looping terus-menerus
      const transaksiPath = path.join('lib', 'database', 'transaksi.json');
      let transaksi = JSON.parse(fs.readFileSync(transaksiPath, 'utf-8'));

      const uniqueCodes = Object.keys(transaksi);

      for (let uniqueCode of uniqueCodes) {
        await cekStatusTransaksi(client, uniqueCode, Func);
        await new Promise(resolve => setTimeout(resolve, 7000)); // Jeda 7 detik
      }

      await new Promise(resolve => setTimeout(resolve, 10000)); // Jeda 10 detik sebelum mengulang lagi
    }
  } catch (error) {
    console.error('Error:', error);
    client.reply(env.owner + '@c.us', '❌ Terjadi kesalahan dalam menjalankan permintaan Anda.', null);
  }
}

module.exports = async (client, Func) => {
  try {
    cekAllStatus(client, Func);
  } catch (e) {
    console.error('Error:', e);
  }
};