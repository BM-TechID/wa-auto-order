const { Function: Func, NeoxrApi } = new(require('@neoxr/wb'))
global.Api = new NeoxrApi(process.env.API_ENDPOINT, process.env.API_KEY)
global.header = `(っ◔◡◔)っ ♥ Bot Auto Order ♥`
global.footer = `˜”*°• Bot whatsapp by BM STORE •°*”˜`

// Payment
global.payment = `𝐏 𝐀 𝐘 𝐌 𝐄 𝐍 𝐓
   
╭╼
╎∘ QRIS : https://i.ibb.co.com/5nyJ3BY/BM-STORE.png
╰─━─━─━─━─━─━─━─╼`

// Orderkuota - https://okeconnect.com
global.ord_id = 'OK219796'
global.ord_apikey = '71457951728712879219796OKCT4E18A003ED0D0164EF93C1189B7A3C53'
global.qris = 'https://i.ibb.co.com/Rcq68d2/BM-PAY.png'

// ===== Payment Gateway ===== (WAJIB)
// Paydisini - https://paydisini.co.id
global.url_paydisini = 'https://paydisini.co.id'
global.apikey_paydisini = 'd25924b7c6fb2c026383be97fb809fd4' 
global.channel = '11' // 11 atau 17
global.type_fee = '1' // 1 (di tanggung customer), 2 (di tanggung merchant)

// Status message
global.status = Object.freeze({
   invalid: Func.Styles('Invalid url'),
   wrong: Func.Styles('Wrong format.'),
   fail: Func.Styles('Can\'t get metadata'),
   error: Func.Styles('Error occurred'),
   errorF: Func.Styles('Sorry this feature is in error.'),
   premium: Func.Styles('This feature only for premium user.'),
   auth: Func.Styles('You do not have permission to use this feature, ask the owner first.'),
   seller: Func.Styles('🚩 This command only seller panel'),
   owner: Func.Styles('This command only for owner.'),
   group: Func.Styles('This command will only work in groups.'),
   botAdmin: Func.Styles('This command will work when I become an admin.'),
   admin: Func.Styles('This command only for group admin.'),
   private: Func.Styles('Use this command in private chat.'),
   gameSystem: Func.Styles('Game features have been disabled.'),
   gameInGroup: Func.Styles('Game features have not been activated for this group.'),
   gameLevel: Func.Styles('You cannot play the game because your level has reached the maximum limit.')
})