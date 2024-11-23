module.exports = (m, env) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.users.find(v => v.jid == m.sender)
   if (user) {
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      if (!('afkObj' in user)) user.afkObj = {}
      if (!('name' in user)) user.name= m.pushName
      if (!('banned' in user)) user.banned = false
      if (!isNumber(user.ban_temporary)) user.ban_temporary = 0
      if (!isNumber(user.ban_times)) user.ban_times = 0
      if (!isNumber(user.limit)) user.limit = env.limit
      if (!('premium' in user)) user.premium = false
      if (!('seller' in user)) user.seller = false
      if (!isNumber(user.expired)) user.expired = 0
      if (!isNumber(user.expired_seller)) user.expired_seller = 0
      if (!isNumber(user.lastseen)) user.lastseen = 0
      if (!isNumber(user.hit)) user.hit = 0
      if (!isNumber(user.warning)) user.warning = 0
      // orderkuota
      if (!isNumber(user.orderkuota_deposit_amount)) user.orderkuota_deposit_amount = 0
      if (!isNumber(user.depo_masuk)) user.depo_masuk = 0
      if (!('orderkuota_status' in user)) user.orderkuota_status = false
      // auto order
      if (!isNumber(user.deposit)) user.deposit = 0
      if (!isNumber(user.total_pembelian)) user.total_pembelian = 0
      if (!isNumber(user.total_pengeluaran)) user.total_pengeluaran = 0
      // panel pterodactyl
      if (!isNumber(user.memory)) user.memory = 0
      if (!isNumber(user.cpu)) user.cpu = 0
      if (!isNumber(user.disk)) user.disk = 0
      if (!('username_panel' in user)) user.username_panel = ''
      if (!('code_panel' in user)) user.code_panel = '' 
      if (!('opsi_username' in user)) user.opsi_username = false
      if (!('opsi_akun' in user)) user.opsi_akun = false
      // pay
      if (!('payexpired' in user)) user.payexpired = ''
      if (!('status_deposit' in user)) user.status_deposit = false
      if (!('status_beli' in user)) user.status_beli = false
      if (!('depo_opt' in user)) user.depo_opt = false
      if (!('unique' in user)) user.unique = ''
      if (!('unique_beli' in user)) user.unique_beli = ''
      if (!('note' in user)) user.note = ''
      if (!('create' in user)) user.create = ''
      if (!('total_pembayaran' in user)) user.total_pembayaran = ''
      if (!('jumlah' in user)) user.jumlah = ''
      if (!('payid' in user)) user.payid = ''
   } else {
      global.db.users.push({
         jid: m.sender,
         afk: -1,
         opsi_akun: false,
         status_deposit: false,
         status_beli: false,
         payexpired: '', 
         unique: '',
         create: '', 
         seller: false,
         note: '', 
         total_pembayaran: '',
         code_panel: '',
         jumlah: '', 
         depo_opt: false,
         payid: '', 
         expired_seller: 0,
         afkReason: '',
         username_panel: '',
         unique_beli: '',
         memory: 0,
         cpu: 0,
         disk: 0,
         opsi_username: false,
         total_pembelian: 0,
         deposit: 0,
         total_pengeluaran: 0,
         afkObj: {},
         name: m.pushName,
         banned: false,
         ban_temporary: 0,
         ban_times: 0,
         limit: env.limit,
         premium: false,
         expired: 0,
         lastseen: 0,
         hit: 0,
         warning: 0, 
         // orderkuota
         orderkuota_deposit_amount: 0,
         depo_masuk: 0,
         orderkuota_status: false
      })
   }

   if (m.isGroup) {
      let group = global.db.groups.find(v => v.jid == m.chat)
      if (group) {
         if (!isNumber(group.activity)) group.activity = 0
         if (!('antidelete' in group)) group.antidelete = true
         if (!('antilink' in group)) group.antilink = true
         if (!('antivirtex' in group)) group.antivirtex = true
         if (!('filter' in group)) group.filter = false
         if (!('left' in group)) group.left = false
         if (!('localonly' in group)) group.localonly = false
         if (!('mute' in group)) group.mute = false
         if (!('viewonce' in group)) group.viewonce = true
         if (!('autosticker' in group)) group.autosticker = true
         if (!('member' in group)) group.member = {}
         if (!('text_left' in group)) group.text_left = ''
         if (!('text_welcome' in group)) group.text_welcome = ''
         if (!('welcome' in group)) group.welcome = true
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = false
      } else {
         global.db.groups.push({
            jid: m.chat,
            activity: 0,
            antidelete: true,
            antilink: false,
            antivirtex: false,
            filter: false,
            left: false,
            localonly: false,
            mute: false,
            viewonce: true,
            autosticker: true,
            member: {},
            text_left: '',
            text_welcome: '',
            welcome: true,
            expired: 0,
            stay: false
         })
      }
   }

   let chat = global.db.chats.find(v => v.jid == m.chat)
   if (chat) {
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
      if (!isNumber(chat.lastseen)) chat.lastseen = 0
   } else {
      global.db.chats.push({
         jid: m.chat,
         chat: 0,
         lastchat: 0,
         lastseen: 0
      })
   }

   let setting = global.db.setting
   if (setting) {
      if (!('autodownload' in setting)) setting.autodownload = true
      if (!('autoread' in setting)) setting.autoread = true
      if (!('auto_cekstatus' in setting)) setting.auto_cekstatus = false
    	if (!('debug' in setting)) setting.debug = false
      if (!('error' in setting)) setting.error = []
      if (!('hidden' in setting)) setting.hidden = []
      if (!('pluginDisable' in setting)) setting.pluginDisable = []
      if (!('receiver' in setting)) setting.receiver = []
      if (!('groupmode' in setting)) setting.groupmode = false
      if (!('sk_pack' in setting)) setting.sk_pack = 'Sticker by'
      if (!('sk_author' in setting)) setting.sk_author = '© BM STORE'
      if (!('self' in setting)) setting.self = false
      if (!('noprefix' in setting)) setting.noprefix = true
      if (!('multiprefix' in setting)) setting.multiprefix = true
      if (!('prefix' in setting)) setting.prefix = ['.', '/', '!', '#']
      if (!('toxic' in setting)) setting.toxic = ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "xnxx"]
      if (!('online' in setting)) setting.online = true
      if (!('onlyprefix' in setting)) setting.onlyprefix = '+'
      if (!('owners' in setting)) setting.owners = ['6285793589243', '6285775616873']
      if (!isNumber(setting.lastReset)) setting.lastReset = new Date * 1
      if (!('msg' in setting)) setting.msg = `Hallo +tag 🪸

◦ *Database* : +db
◦ *Website* : https://BM STORE.xyz
◦ *Source* : https://github.com/BM STORE-Project

Jika menemukan bug / error pada fitur harap hubungi owner`
      if (!isNumber(setting.style)) setting.style = 1
      if (!('cover' in setting)) setting.cover = 'https://i.ibb.co.com/5nyJ3BY/BM-STORE.png'
      if (!('qris' in setting)) setting.qris = global.qris
      if (!('link' in setting)) setting.link = 'https://chat.whatsapp.com/GQVmvYckLoN8xgvLwdy4Ch'
      if (!('payment' in setting)) setting.payment = global.payment
   } else {
      global.db.setting = {
         autodownload: true,
         autoread: true, 
         auto_cekstatus: false,
         debug: false,
         error: [],
         hidden: [],
         pluginDisable: [],
         receiver: [],
         groupmode: false,
         sk_pack: 'Sticker by',
         sk_author: '© BM STORE',
         self: false,
         noprefix: true,
         multiprefix: true,
         prefix: ['.', '#', '!', '/'],
         toxic: ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "xnxx"],
         online: true,
         onlyprefix: '+',
         owners: ['6285775616873', '6285793589243'],
         lastReset: new Date * 1,
         msg: `Hallo +tag 🪸

◦ *Database* : +db
◦ *Website* : https://BM STORE.xyz
◦ *Source* : https://github.com/BM STORE-Project

Jika menemukan bug / error pada fitur harap hubungi owner`,
         style: 1,
         cover: 'https://i.ibb.co.com/5nyJ3BY/BM-STORE.png',
         qris: global.qris,
         payment: global.payment,
         link: 'https://chat.whatsapp.com/GQVmvYckLoN8xgvLwdy4Ch'
      }
   }
}