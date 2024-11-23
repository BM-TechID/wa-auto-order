const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Lokasi file check.json
const checkFilePath = path.join('media', 'json', 'check.json');

// Fungsi untuk membaca file check.json
function readCheckFile() {
    if (fs.existsSync(checkFilePath)) {
        const data = fs.readFileSync(checkFilePath, 'utf8');
        return JSON.parse(data);
    } else {
        return []; // Jika file tidak ada, kembalikan array kosong
    }
}

// Fungsi untuk menulis ke file check.json
function writeCheckFile(data) {
    fs.writeFileSync(checkFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Fungsi untuk mengambil data dari API Mutasi QRIS menggunakan axios
async function fetchMutasiQris() {
    const url = `https://gateway.okeconnect.com/api/mutasi/qris/${global.ord_id}/${global.ord_apikey}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.status !== "success") {
            throw new Error('Gagal mendapatkan data mutasi.');
        }

        return response.data.data; // Mengembalikan data transaksi
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Fungsi utama untuk melakukan pengecekan amount dan issuer_reff
async function check(m, { client, args, users, env, isPrefix, command, Func }) {
    try {
        if (!args[0]) {
            return client.reply(m.chat, `🚩 Masukkan RRN QRIS\n\n• *Example* :\n${isPrefix + command} *rrn_qris*`, m);
        }

        const amountStr = users.orderkuota_deposit_amount;
        const issuer_reff = args[0];

        // Konversi amount ke number
        const amount = Number(amountStr);
        if (isNaN(amount)) {
            return client.reply(m.chat, '🚩 Amount harus berupa angka yang valid.', m);
        }

        // Baca file check.json untuk melihat apakah data sudah pernah dicek
        const checkedData = readCheckFile();
        const dataKey = `${issuer_reff}°${amount}`;

        // Cek apakah data sudah ada di file check.json
        if (checkedData.includes(dataKey)) {
            return client.reply(m.chat, '🚩 Data Telah Di Check Sebelumnya', m);
        }

        // Ambil data mutasi dari API
        const transactions = await fetchMutasiQris();

        if (!transactions) {
            return client.reply(m.chat, '🚩 Tidak ada DATA apapun', m);
        }

        // Cek apakah ada transaksi yang sesuai dengan amount dan issuer_reff
        const found = transactions.some(transaction => 
            Number(transaction.amount) === amount && transaction.issuer_reff === issuer_reff
        );

        if (found) {
            // Simpan data ke check.json jika ditemukan
            checkedData.push(dataKey);
            writeCheckFile(checkedData);

            // Pastikan users.deposit adalah number sebelum ditambah
            users.deposit += parseInt(amount);
            users.deposit_total += parseInt(amount);
            users.depo_masuk = 0;
            users.orderkuota_deposit_amount = 0;
            
            client.reply(m.chat, `✅ Saldo sebesar Rp ${Func.formatNumber(amount)},00 berhasil ditambahkan.`, m);
        } else {
            client.reply(m.chat, '❌ Data Tidak Ada, Silahkan cek ulang RRN', m);
        }

    } catch (error) {
        console.error(error);
        client.reply(env.owner + '@c.us', `🚩 Terjadi kesalahan: ${error.message}`, m);
    }
}

exports.run = {
    usage: ['check'],
    use: 'rrn qris',
    category: 'utilities',
    async: async (m, { client, args, users, env, isPrefix, command, Func }) => {
        if (users.status_deposit === false) return client.reply(m.chat, '🚩 Kamu tidak memiliki Aktivasi Deposit', m);
        await check(m, { client, args, users, env, isPrefix, command, Func });
    },
    error: false,
    private: true,
    location: __filename
};
