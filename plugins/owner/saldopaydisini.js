const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

exports.run = {
    usage: ['saldopaydisini'],
    category: 'owner',
    async: async (m, { client, Func }) => {
        const apiKey = global.apikey_paydisini;
        const requestType = "profile";
        const signature = crypto.createHash('md5').update(apiKey + 'Profile').digest('hex');

        // Membuat formulir data
        const form = new FormData();
        form.append('key', apiKey);
        form.append('request', requestType);
        form.append('signature', signature);

        try {
            // Mengirim permintaan POST
            const response = await axios.post(global.url_paydisini + '/api/', form, {
                headers: {
                    ...form.getHeaders()
                }
            });

            const responseData = response.data;

            if (responseData.success) {
                const data = responseData.data;
                const { full_name, merchant, telephone, email, saldo, saldo_tertahan, auto_wd } = data;

                const message = `📋 *DETAIL PROFIL:*

- Nama Lengkap: ${full_name}
- Merchant: ${merchant}
- Nomor Telepon: ${telephone}
- Email: ${email}
- Saldo: Rp. ${Func.formatNumber(saldo)}
- Saldo Tertahan: Rp. ${saldo_tertahan || '-'}
- Auto WD: ${auto_wd}

${global.footer}`;

                client.reply(m.chat, message, m);
            } else {
                client.reply(m.chat, `❌ Gagal mendapatkan data profil: ${responseData.msg}`, m);
            }
        } catch (error) {
            console.error('Error in saldopaydisini request:', error);
            client.reply(m.chat, '❌ Terjadi kesalahan saat meminta data profil.', m);
        }
    },
    error: false,
    owner: true,
    location: __filename
};
