/*
Jangan di otak atik, Biarin aja.
Ini buat informasi Update (sebagai notifikasi kalau ada Update Script)
*/

const fs = require('fs');
const axios = require('axios');
const env = require('../config.json');

module.exports = async (client, Func) => {
  let lastNotifiedVersion = null;

  async function checkVersion() {
    try {
      const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const type = packageData.type;
      const localVersion = packageData.version;

      const response = await axios.get(`https://script-version.vercel.app/api/check?type=${type}`);
      const remoteVersionData = response.data.data;
      const remoteVersion = remoteVersionData.version;

      if (localVersion !== remoteVersion && remoteVersion !== lastNotifiedVersion) {
        const message = `*🔴  UPDATE SCRIPT*

*❒ ${remoteVersionData.title}*
○ Version : ${localVersion} ~> ${remoteVersionData.version}
○ Time : ${remoteVersionData.time}
○ Message : ${remoteVersionData.message}`;
        await client.reply(env.owner + '@c.us', message, null);
        lastNotifiedVersion = remoteVersion;
      } else {
        // console.log('Versi sudah up-to-date atau notifikasi sudah dikirim.');
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }
  }

  setInterval(checkVersion, 60000);

  checkVersion();
};