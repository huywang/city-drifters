// ============================================
// 都市浮生记 - Game Engine v1.0
// ============================================

// === GAME STATE ===
const G = {
    name: '', age: 22, month: 1, year: 2024,
    city: 'beijing', cityName: '北京', background: 'cs',
    job: '待业中', jobSalary: 0,
    months: 0, choices: 0, eventsSeen: 0,
    eventLog: [], achievements: [],
    money: 5000, health: 80, mood: 70, intel: 60, social: 30, charm: 50,
    flags: {}, currentEvent: null, isEnded: false,
};

// === BACKGROUNDS ===
const BACKGROUNDS = {
    cs: { name: '985计算机毕业', money: 5000, health: 70, mood: 60, intel: 85, social: 25, charm: 45, startJob: '初级程序员', startSalary: 12000,
        intro: '你拖着行李箱走出火车站，手机里存着3份offer。互联网大厂的HR已经催了你三次入职，但你还在纠结——是去996的大厂拿高薪，还是去955的小公司保住头发？\n\n你深吸一口气：大城市，我来了。' },
    liberal: { name: '文科毕业生', money: -8000, health: 75, mood: 55, intel: 70, social: 40, charm: 65, startJob: '待业中', startSalary: 0,
        intro: '"学文科能找到什么工作？"——你妈在电话里第100次问你这个问题。\n\n你看了看银行卡余额，又看了看助学贷款账单。大城市的霓虹灯很亮，但你不确定哪一盏是为你而亮的。\n\n至少，你还年轻。大概。' },
    town: { name: '小镇做题家', money: 3000, health: 80, mood: 65, intel: 80, social: 20, charm: 40, startJob: '实习生', startSalary: 4500,
        intro: '你从小镇一路考到大城市，高考是你的骄傲。但当你第一次走进CBD的写字楼，你发现自己连咖啡机都不会用。\n\n同事们聊着你没听过的餐厅和品牌，你默默打开了外卖软件——至少，黄焖鸡米饭你认识。' },
    laidoff: { name: '中年失业者', money: -50000, health: 60, mood: 30, intel: 75, social: 60, charm: 40, startJob: '待业中', startSalary: 0, startAge: 35,
        intro: '昨天还是P8，今天就"毕业"了。\n\nHR说这是"组织优化"，你的工牌在下午3点被收走，连跟同事告别的时间都没有。房贷每月18000，孩子刚上小学，老婆还不知道你失业了。\n\n你坐在星巴克里，假装还在上班。朋友圈发了条"new journey, new beginning"，配了张笔记本电脑的照片。' },
    vocational: { name: '大专技术人', money: 4000, health: 85, mood: 70, intel: 50, social: 35, charm: 55, startJob: '技术工人', startSalary: 7000,
        intro: '你是大专毕业，但你有一门好手艺。在这个人人都在卷学历的年代，你选择了一条不同的路。\n\n大城市不缺985毕业生，但缺靠谱的水电工、汽修师傅和装修工人。你相信：手艺人，饿不死。' },
    returnee: { name: '海归留学生', money: -30000, health: 75, mood: 50, intel: 80, social: 30, charm: 70, startJob: '待业中', startSalary: 0,
        intro: '你在英国读了两年硕士，花了家里60万。回国后发现：海归硕士遍地走，你的学历在HR眼里跟国内211差不多。\n\n你妈说："花了那么多钱，总得找个好工作吧？"你不敢告诉她，你最拿得出手的技能是——做正宗的fish and chips。' },
};

// === CITIES ===
const CITIES = {
    beijing: { name: '北京', rent: 3500, cost: 1.2, house: 65000, trait: '帝都', meme: '"在北京，你不是在生活，你是在生存。"' },
    shanghai: { name: '上海', rent: 4000, cost: 1.3, house: 75000, trait: '魔都', meme: '"上海不相信眼泪，只相信咖啡和PPT。"' },
    shenzhen: { name: '深圳', rent: 3000, cost: 1.1, house: 60000, trait: '鹏城', meme: '"来了就是深圳人——来了就开始加班。"' },
    hangzhou: { name: '杭州', rent: 2800, cost: 1.1, house: 45000, trait: '电商之城', meme: '"杭州的空气里都是创业的味道，和直播的噪音。"' },
    guangzhou: { name: '广州', rent: 2500, cost: 1.0, house: 40000, trait: '羊城', meme: '"在广州，没有什么是一顿早茶解决不了的。"' },
    chengdu: { name: '成都', rent: 2200, cost: 0.9, house: 25000, trait: '蓉城', meme: '"成都——一座来了就不想走的城市。前提是你能忍受内卷。"' },
};

// === EVENTS (100+) ===
const EVENTS = [
    // --- WORK ---
    { id:'first_job', icon:'💼', title:'第一份工作', weight:1,
      body:'你在Boss直聘上海投了200份简历，终于收到一个面试通知。公司在一栋老旧写字楼里，面试官是个比你大不了几岁的年轻人，他问你："你的五年规划是什么？"\n\n你心想：五年后我大概还在投简历吧。',
      cond: g => g.job==='待业中' && g.months<6,
      choices:[
        { label:'接受offer，先干着', hint:'+💰', fn: g => { setJob(g,'初级打工人',6000); return {money:1000,mood:-5}; }},
        { label:'谈个高薪，不行就走', hint:'🎲', fn: g => { if(Math.random()>0.5){setJob(g,'初级打工人',8500);return{money:2000,mood:10,charm:5}}else{return{mood:-15}} }},
        { label:'算了，继续投简历', hint:'-😊', fn: g => ({mood:-10,money:-500}) },
      ]},
    { id:'work_996', icon:'🏢', title:'996福报', weight:2,
      body:'老板在群里发了条消息："从今天起，我们实行弹性工作制——弹到晚上10点。"\n\n同事们面面相觑，然后纷纷打开了外卖App。你看了看时间，现在才下午3点，距离下班还有7个小时。\n\n"奋斗的青春最美丽"——你在心里默默骂了句脏话。',
      cond: g => g.job!=='待业中' && g.jobSalary>0,
      choices:[
        { label:'接受996，为梦想窒息', hint:'+💰 -❤️', fn: g => ({money:Math.floor(g.jobSalary*0.3),health:-10,mood:-15}) },
        { label:'摸鱼到下班', hint:'+😊', fn: g => ({mood:5,intel:-2}) },
        { label:'跟老板硬刚', hint:'🎲', fn: g => { if(Math.random()>0.6){return{mood:20,social:10,charm:5}}else{setJob(g,'待业中',0);return{mood:-20,money:-2000}} }},
        { label:'偷偷投简历', hint:'🤫', fn: g => ({mood:-5,social:3}) },
      ]},
    { id:'salary_day', icon:'💰', title:'发薪日', weight:3,
      body:'叮！工资到账了。你激动地打开银行App，然后开始做数学题：\n\n工资 - 房租 - 花呗 - 信用卡 - 水电燃气 = ？\n\n答案是：刚好够你活到下个月发工资。这就是传说中的"月光族"。\n\n你发了条朋友圈："又是充实的一个月。"配了张加班的照片。',
      cond: g => g.jobSalary>0,
      choices:[
        { label:'存起来，我是自律达人', hint:'+💰', fn: g => ({money:Math.floor(g.jobSalary*0.2),mood:-5}) },
        { label:'吃顿好的犒劳自己', hint:'+😊', fn: g => ({mood:15,health:3,money:-300}) },
        { label:'还完花呗再说', hint:'💸', fn: g => ({mood:5}) },
      ]},
    { id:'performance', icon:'📊', title:'绩效考核', weight:2,
      body:'又到了季度绩效考核。你的leader跟你说："今年的3.25名额我还没想好给谁。"\n\n你心里清楚，3.25就是差评，连续两个就是"毕业"。\n\n会议室里，同事们都在假装忙碌，实际上都在偷偷刷脉脉。',
      cond: g => g.job!=='待业中' && g.jobSalary>8000,
      choices:[
        { label:'拼命加班争取3.75', hint:'+💰 -❤️', fn: g => { if(Math.random()>0.4){return{money:g.jobSalary*2,mood:10,health:-12,intel:5}}else{return{mood:-20,health:-8,money:Math.floor(g.jobSalary*0.5)}} }},
        { label:'摆烂，爱谁谁', hint:'+😊', fn: g => ({mood:10,health:5,money:Math.floor(g.jobSalary*0.3)}) },
        { label:'偷偷准备跳槽', hint:'🤫', fn: g => ({intel:5,social:3,mood:-5}) },
      ]},
    { id:'layoff', icon:'📦', title:'裁员风暴', weight:2,
      body:'公司又双叒叕裁员了。这次是"业务调整"，上次是"战略收缩"。\n\nHR约你"一对一沟通"，你走进会议室，看到桌上放着一份N+1赔偿协议。\n\n"感谢你为公司做出的贡献……"\n\n你想起了入职那天CEO说的："我们是一家人。"——原来家人也会说再见。',
      cond: g => g.job!=='待业中' && g.age>=28 && g.months>24 && Math.random()>0.6,
      choices:[
        { label:'签字拿赔偿走人', hint:'+💰💰', fn: g => { const c=g.jobSalary*(Math.floor(g.months/12)+1); setJob(g,'待业中',0); return{money:c,mood:-20,social:-5}; }},
        { label:'谈判要更多', hint:'🎲', fn: g => { if(Math.random()>0.4){const c=g.jobSalary*(Math.floor(g.months/12)+3);setJob(g,'待业中',0);return{money:c,mood:-10,charm:5}}else{const c=Math.floor(g.jobSalary*0.5);setJob(g,'待业中',0);return{money:c,mood:-30}} }},
        { label:'赖着不走', hint:'🎲', fn: g => { if(Math.random()>0.7){return{mood:-15,social:-10}}else{setJob(g,'待业中',0);return{mood:-25}} }},
      ]},
    { id:'job_hop', icon:'🔄', title:'跳槽机会', weight:2,
      body:'猎头像外卖一样准时地给你打电话了："我这边有个机会，薪资涨幅30%，但公司刚拿到A轮，有点卷。"\n\n"跳槽穷一阵子，不跳穷一辈子。"但也有人说："稳定才是最大的不稳定。"——等等，这句话好像反了。',
      cond: g => g.job!=='待业中' && g.months>12,
      choices:[
        { label:'跳！涨薪才是硬道理', hint:'🎲 +💰', fn: g => { if(Math.random()>0.3){const s=Math.floor(g.jobSalary*1.3);setJob(g,getTitle(g,'senior'),s);return{money:5000,mood:10,social:-3}}else{setJob(g,getTitle(g,'senior'),Math.floor(g.jobSalary*0.9));return{mood:-10}} }},
        { label:'先看看再说', hint:'+👥', fn: g => ({social:5,intel:3}) },
        { label:'我现在挺好的', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'side_hustle', icon:'📱', title:'搞副业', weight:2,
      body:'你在小红书上看到一篇文章："月薪三千的我，靠副业月入三万。"\n\n你心动了。副业选项：做自媒体、开网店、送外卖、写网文。\n\n你决定：打工是不可能打工一辈子的。',
      cond: g => g.age>=24 && g.months>6,
      choices:[
        { label:'做自媒体', hint:'🎲 +✨', fn: g => { g.flags.sideHustle='media'; if(Math.random()>0.5){return{money:3000,charm:8,mood:10}}else{return{mood:-5,health:-3,money:-500}} }},
        { label:'开网店', hint:'-💰 🎲', fn: g => { g.flags.sideHustle='shop'; if(Math.random()>0.4){return{money:5000,intel:5}}else{return{money:-8000,mood:-15}} }},
        { label:'送外卖', hint:'+💰 -❤️', fn: g => { g.flags.sideHustle='delivery'; return{money:4000,health:-8,mood:-5}; }},
        { label:'算了，我还是躺着吧', hint:'+😊', fn: g => ({mood:10}) },
      ]},
    { id:'promotion', icon:'⬆️', title:'升职加薪',
      body:'好消息！你的leader离职了（对，他也"毕业"了），你被提拔为新的team leader。\n\n涨薪30%，但你开始理解为什么上一个leader会"毕业"了——因为当leader意味着：上面压你，下面顶你，你就是个夹心饼干。',
      cond: g => g.job!=='待业中' && g.intel>65 && g.months>18 && g.age<35,
      choices:[
        { label:'欣然接受', hint:'+💰 +✨', fn: g => { setJob(g,getTitle(g,'lead'),Math.floor(g.jobSalary*1.3)); return{mood:15,charm:5,social:5}; }},
        { label:'谈更多条件', hint:'🎲', fn: g => { if(Math.random()>0.4){setJob(g,getTitle(g,'lead'),Math.floor(g.jobSalary*1.5));return{mood:20,charm:8}}else{return{mood:-10}} }},
      ]},
    { id:'exam_civil', icon:'📝', title:'考公上岸？',
      body:'你妈又在电话里说了："考个公务员吧，稳定。"\n\n你看了看报名数据：竞争比1:350。也就是说，你要打败349个人才能上岸。\n\n高考你都过来了，这算什么？（提示：高考只需要打败同省的人，考公要打败全国的卷王。）',
      cond: g => g.age>=22 && g.age<=35 && !g.flags.civilServant,
      choices:[
        { label:'备考！铁饭碗才是真饭碗', hint:'-😊 🎲', fn: g => { if(g.intel>70&&Math.random()>0.7){g.flags.civilServant=true;setJob(g,'公务员',8000);return{mood:30,social:10,money:-5000}}else{return{mood:-20,health:-5,money:-3000,intel:5}} }},
        { label:'算了，我受不了体制内', hint:'+😊', fn: g => ({mood:5}) },
        { label:'先报名试试', hint:'-💰 🎲', fn: g => { if(g.intel>75&&Math.random()>0.8){g.flags.civilServant=true;setJob(g,'公务员',8000);return{mood:25,money:-2000}}else{return{mood:-10,money:-2000}} }},
      ]},
    { id:'startup', icon:'🚀', title:'创业灵感',
      body:'深夜两点，你在出租屋里突然灵光一闪：\n\n"我要做一个App——帮打工人自动回复老板消息的AI！"\n\n你激动地打开电脑，写了3行代码，发了条朋友圈："创业第一天，改变世界。"\n\n收获了12个赞，其中10个是你妈和你的小号。',
      cond: g => g.intel>60 && g.age>=24 && !g.flags.entrepreneur,
      choices:[
        { label:'辞职创业！All in！', hint:'🎲🎲', fn: g => { g.flags.entrepreneur=true; setJob(g,'创业者',0); if(Math.random()>0.7){return{money:-10000,mood:20,social:15,charm:10}}else{return{money:-15000,mood:-10,health:-10}} }},
        { label:'边上班边搞', hint:'-❤️ +🧠', fn: g => { g.flags.sideStartup=true; return{health:-8,intel:8,mood:5}; }},
        { label:'洗洗睡吧', hint:'+❤️', fn: g => ({health:3,mood:5}) },
      ]},
    { id:'freelance', icon:'💻', title:'自由职业',
      body:'你受够了朝九晚六（实际上是朝九晚十），你想做自由职业者。\n\n幻想中：咖啡馆、拿铁、睡到自然醒。\n现实中：出租屋、泡面、焦虑到失眠。\n\n但"自由"两个字，听起来就很贵。',
      cond: g => g.age>=25 && g.intel>55 && g.job!=='待业中',
      choices:[
        { label:'辞职做自由职业', hint:'🎲', fn: g => { setJob(g,'自由职业者',0); if(Math.random()>0.4){return{mood:15,health:5,money:5000}}else{return{mood:-10,money:-3000}} }},
        { label:'先攒够生活费', hint:'+🧠', fn: g => ({intel:5,mood:5}) },
        { label:'算了，稳定点好', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'gig', icon:'🛵', title:'零工经济',
      body:'你下载了美团众包。"反正闲着也是闲着，不如跑几单。"\n\n你的第一单：送一杯奶茶到3公里外。你骑着电动车，觉得自己是这座城市里最自由的人。\n\n然后你接到了差评——奶茶洒了一点。\n\n"自由职业的「自由」，是「自己不由自己」的自由。"',
      cond: g => g.money<5000 || g.job==='待业中',
      choices:[
        { label:'全职跑外卖', hint:'+💰 -❤️', fn: g => { setJob(g,'外卖骑手',7000); return{health:-5,mood:-5}; }},
        { label:'偶尔跑跑', hint:'+💰', fn: g => ({money:2000,health:-3,mood:3}) },
        { label:'还是找工作吧', hint:'+🧠', fn: g => ({intel:3,mood:5}) },
      ]},
    // --- HOUSING ---
    { id:'rent', icon:'🏠', title:'租房噩梦', weight:2,
      body:'房东来消息了："下个月房租涨500，不接受就搬走。"\n\n你看了看这个不到15平米的隔断间——窗户对着隔壁楼的墙，卫生间公用，厨房就是走廊上的电磁炉。\n\n但它有一个优点：离地铁15分钟（如果你跑得够快的话）。\n\n"在大城市，你不是在租房，你是在租一个睡觉的位置。"',
      cond: g => !g.flags.hasHouse && g.months>2,
      choices:[
        { label:'接受涨价，认了', hint:'-💰', fn: g => ({money:-1500,mood:-10}) },
        { label:'搬到更远的地方', hint:'-😊 +💰', fn: g => ({mood:-8,social:-5,money:2000}) },
        { label:'找室友合租', hint:'+👥 🎲', fn: g => { if(Math.random()>0.4){return{social:10,mood:5,money:3000}}else{return{mood:-15,social:-5}} }},
        { label:'住公司（省房租）', hint:'+💰 -❤️', fn: g => ({money:5000,health:-10,mood:-8}) },
      ]},
    { id:'roommate', icon:'👤', title:'室友奇缘',
      body:'你搬进了合租房。室友每天晚上8点准时直播喊"家人们"。\n\n你很快发现，合租最大的挑战不是分摊水电费，而是学会在凌晨3点忍受隔壁的声音。\n\n"合租就是——用一半的房租，换双倍的社交恐惧。"',
      cond: g => !g.flags.hasRoommate && !g.flags.hasHouse,
      choices:[
        { label:'跟室友做朋友', hint:'+👥', fn: g => { g.flags.hasRoommate=true; return{social:15,mood:8}; }},
        { label:'保持距离', hint:'+😊', fn: g => { g.flags.hasRoommate=true; return{mood:5}; }},
        { label:'受不了，搬出去', hint:'-💰 +😊', fn: g => ({money:-5000,mood:10}) },
      ]},
    { id:'buy_house', icon:'🏡', title:'买房？买房！',
      body:'你打开链家App，看了看房价：均价6万/平。\n\n你算了算：以你的工资，不吃不喝30年能买个厕所。\n\n你妈打电话来："家里凑了30万，够个首付。但你得自己还月供。"\n\n月供15000。你现在月薪才多少来着？\n\n有人说："买房是中国人最后的信仰。"你觉得这信仰有点贵。',
      cond: g => g.age>=26 && g.money>50000 && !g.flags.hasHouse,
      choices:[
        { label:'买！有房才有安全感', hint:'-💰💰💰', fn: g => { g.flags.hasHouse=true; return{money:-80000,mood:25,social:10,charm:10}; }},
        { label:'再等等，房价会跌的', hint:'🎲', fn: g => { g.flags.waitingHouse=true; return{mood:-5}; }},
        { label:'买房不如租房', hint:'+💰', fn: g => ({mood:5,intel:3}) },
      ]},
    // --- SOCIAL ---
    { id:'blind_date', icon:'💕', title:'相亲大会', weight:2,
      body:'你妈给你安排了一场相亲。对方资料："985硕士，大厂做产品，年薪50万，有车有房……"\n\n你看了看自己的条件，突然理解了什么叫"门当户对"。\n\n相亲地点在星巴克——大城市的相亲标配，因为消费不高，双方都不会太尴尬。',
      cond: g => g.age>=25 && !g.flags.hasPartner && !g.flags.married,
      choices:[
        { label:'真诚做自己', hint:'🎲', fn: g => { if((g.charm+g.social)>100||Math.random()>0.6){g.flags.hasPartner=true;return{mood:20,charm:8,social:10}}else{return{mood:-10,charm:-3}} }},
        { label:'装一下', hint:'🎲', fn: g => { if(Math.random()>0.5){g.flags.hasPartner=true;return{mood:15,charm:5}}else{return{mood:-15,charm:-5}} }},
        { label:'找借口溜走', hint:'+😊', fn: g => ({mood:10}) },
        { label:'直接说不想相亲', hint:'+😊 -👥', fn: g => ({mood:15,social:-10}) },
      ]},
    { id:'urge_marriage', icon:'👨‍👩‍👦', title:'催婚风暴',
      body:'过年回家，你妈开始每日催婚三连：\n\n"你有对象了吗？"\n"你同事小李都生二胎了。"\n"再不找就来不及了。"\n\n你爸在旁边默默看电视，偶尔插一句："你妈说得对。"\n\n你的表哥带着一家三口来拜年，你妈看他们的眼神充满了羡慕。',
      cond: g => g.age>=27 && !g.flags.married,
      choices:[
        { label:'"我在找了在找了"', hint:'-😊', fn: g => ({mood:-15,social:3}) },
        { label:'"不结婚也能过得好"', hint:'🎲', fn: g => { if(g.money>100000){return{mood:10,charm:5}}else{return{mood:-20,social:-5}} }},
        { label:'假装接电话溜走', hint:'+😊', fn: g => ({mood:5}) },
        { label:'发红包堵住嘴', hint:'-💰', fn: g => ({money:-5000,mood:5}) },
      ]},
    { id:'wedding', icon:'💒', title:'结婚？',
      body:'你们交往两年了，对方提出灵魂拷问："我们什么时候结婚？"\n\n你算了笔账：彩礼、婚礼、婚房装修……至少30万。\n\n你妈说："婚礼必须回老家办，至少200桌。"\n你对象说："我想在海边办婚礼。"\n你的钱包说："你们别闹了。"',
      cond: g => g.flags.hasPartner && g.age>=26 && !g.flags.married,
      choices:[
        { label:'办一场盛大婚礼', hint:'-💰💰💰 +😊', fn: g => { g.flags.married=true; return{money:-150000,mood:30,social:20,charm:10}; }},
        { label:'领个证就行', hint:'-💰 +😊', fn: g => { g.flags.married=true; return{money:-5000,mood:15,social:5}; }},
        { label:'"再等等吧"', hint:'-😊', fn: g => ({mood:-10}) },
      ]},
    { id:'breakup', icon:'💔', title:'分手',
      body:'你们吵架了。原因可能是谁洗碗、周末去哪、或者什么都不是，就是累了。\n\n你说："我们分手吧。"对方说："好。"\n\n两年的感情，结束于一句"好"。\n\n你回到出租屋，发现还有对方的拖鞋在门口。\n\n"成年人的分手，不吵不闹，就是突然觉得不想再努力了。"',
      cond: g => g.flags.hasPartner && !g.flags.married && g.months>12,
      choices:[
        { label:'挽回', hint:'🎲', fn: g => { if(Math.random()>0.5){return{mood:15,social:5}}else{g.flags.hasPartner=false;return{mood:-25,charm:-5}} }},
        { label:'接受现实', hint:'-😊', fn: g => { g.flags.hasPartner=false; return{mood:-20,intel:5,charm:3}; }},
        { label:'借酒消愁', hint:'-❤️ -💰', fn: g => { g.flags.hasPartner=false; return{mood:-15,health:-8,money:-500}; }},
      ]},
    { id:'baby', icon:'👶', title:'要不要孩子？',
      body:'你结婚了，下一个灵魂拷问：要不要孩子？\n\n你算了笔账：孕期+生产3-5万、奶粉尿布每月3000+、幼儿园每月5000+、学区房？？？万\n\n"不是不想生，是生不起。"但你的父母不这么想。',
      cond: g => g.flags.married && g.age>=27 && !g.flags.hasChild,
      choices:[
        { label:'生！穷养也行', hint:'-💰 +😊', fn: g => { g.flags.hasChild=true; return{money:-20000,mood:20,health:-5,social:10}; }},
        { label:'等经济条件好了再说', hint:'+🧠', fn: g => ({intel:3,mood:-5}) },
        { label:'丁克也挺好', hint:'+😊 +💰', fn: g => { g.flags.dink=true; return{mood:10,money:5000}; }},
      ]},
    { id:'classmate', icon:'🍻', title:'同学聚会',
      body:'大学同学聚会。当年的学渣现在做投行年薪百万，学霸在体制内秃了，班花在马尔代夫度假。\n\n而你……你想了想自己的银行卡余额。\n\n"同学聚会就是一场大型的互相伤害。"但你们还是聊得很开心。',
      cond: g => g.age>=25 && g.months>12,
      choices:[
        { label:'大方AA', hint:'-💰 +👥', fn: g => ({money:-800,social:15,mood:5}) },
        { label:'偷偷溜了', hint:'+💰 -👥', fn: g => ({social:-10,mood:-5}) },
        { label:'真诚分享近况', hint:'+✨', fn: g => ({charm:8,social:10,mood:10}) },
      ]},
    // --- HEALTH ---
    { id:'health_scare', icon:'🏥', title:'体检报告',
      body:'公司组织了年度体检。报告上：肝功能异常⚠️、血脂偏高⚠️、颈椎问题⚠️、视力下降⚠️、体重增加5kg⚠️\n\n你才25/30岁啊！\n\n你发誓从明天开始早睡早起、健康饮食。这个誓言大概能维持到下次加班为止。',
      cond: g => g.health<65 || (g.age>=28 && g.months>12),
      choices:[
        { label:'办健身卡', hint:'-💰 +❤️', fn: g => { if(Math.random()>0.5){return{money:-3000,health:12,mood:8}}else{return{money:-3000,health:2}} }},
        { label:'开始跑步', hint:'+❤️', fn: g => ({health:8,mood:5}) },
        { label:'算了，反正也活不了几年', hint:'-❤️', fn: g => ({health:-5,mood:-5}) },
        { label:'去医院复查', hint:'-💰 +❤️', fn: g => ({money:-2000,health:10,mood:5}) },
      ]},
    { id:'insomnia', icon:'😵', title:'失眠之夜', weight:2,
      body:'凌晨3点，你躺在床上，脑子里像跑马灯一样：\n\n"明天的deadline"\n"花呗还没还"\n"妈又问有没有对象了"\n"我的人生到底有什么意义"\n\n你打开网易云音乐，听了一首《晚安》。评论区第一条："失眠的人，都是因为心里装了一个不能想的人。"\n你不是，你只是想睡觉。',
      cond: g => g.mood<40 || g.health<50,
      choices:[
        { label:'数羊', hint:'🎲', fn: g => { if(Math.random()>0.5){return{health:3,mood:3}}else{return{health:-3,mood:-5}} }},
        { label:'刷手机到天亮', hint:'-❤️', fn: g => ({health:-8,mood:-3,intel:-2}) },
        { label:'吃褪黑素', hint:'+❤️', fn: g => ({health:2,money:-100}) },
        { label:'写日记', hint:'+😊', fn: g => ({mood:8,intel:3}) },
      ]},
    { id:'delivery', icon:'🍔', title:'外卖成瘾', weight:2,
      body:'你已经连续吃了30天外卖了。今天的外卖里发现了一根头发，你犹豫了5秒后还是继续吃了。\n\n"我已经不是那个会因为外卖不干净而投诉的人了。我只是一个需要碳水化合物的打工人。"',
      cond: g => g.health<70,
      choices:[
        { label:'自己做饭', hint:'+❤️', fn: g => { if(Math.random()>0.5){return{health:10,mood:5,money:1000}}else{return{health:-2,mood:-5}} }},
        { label:'继续点外卖', hint:'-❤️', fn: g => ({health:-5,mood:3,money:-800}) },
        { label:'买预制菜', hint:'+❤️', fn: g => ({health:3,mood:-2,money:-200}) },
      ]},
    { id:'gym', icon:'💪', title:'健身房的诱惑',
      body:'销售小哥拦住了你："帅哥/美女，办卡吗？年卡3980。"\n\n你看了看自己日渐圆润的肚子，又看了看健身房里的肌肉猛男。\n\n"办卡第一天：我是施瓦辛格。办卡第三十天：卡在哪？"',
      cond: g => g.health<75 && g.age>=23 && g.age<=40,
      choices:[
        { label:'办卡+买私教', hint:'-💰💰 +❤️ +✨', fn: g => { if(Math.random()>0.4){return{money:-15000,health:15,charm:10,mood:10}}else{return{money:-15000,health:3}} }},
        { label:'只办卡', hint:'-💰 +❤️', fn: g => ({money:-3980,health:5,mood:5}) },
        { label:'在家做keep', hint:'+❤️', fn: g => ({health:5,mood:3}) },
        { label:'下次一定', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    // --- MONEY ---
    { id:'stock', icon:'📈', title:'理财诱惑',
      body:'同事跟你说："我上个月炒币赚了2万。"\n\n你打开App：比特币涨了，A股跌了，基金绿了。\n\n你得出结论："穷人最好的理财方式，就是别理财。"\n\n但你不信邪。',
      cond: g => g.age>=24 && g.money>5000,
      choices:[
        { label:'炒股！A股永远涨！（确信）', hint:'🎲', fn: g => { if(Math.random()>0.6){return{money:Math.floor(g.money*0.15),mood:15,intel:3}}else{return{money:-Math.floor(g.money*0.2),mood:-20}} }},
        { label:'买基金', hint:'🎲', fn: g => { if(Math.random()>0.4){return{money:Math.floor(g.money*0.05),intel:5}}else{return{money:-Math.floor(g.money*0.08),mood:-5}} }},
        { label:'全部存银行', hint:'+💰', fn: g => ({money:Math.floor(g.money*0.02),mood:3}) },
        { label:'我不配理财', hint:'+😊', fn: g => ({mood:8}) },
      ]},
    { id:'borrow', icon:'💸', title:'借钱难题',
      body:'一个"朋友"找你借钱："兄弟/姐妹，能借我5000吗？下个月还你。"\n\n你知道，"下个月还"大概率等于"永远不还"。但你又不好意思拒绝。',
      cond: g => g.money>3000 && g.social>25,
      choices:[
        { label:'借！有难得帮就帮', hint:'-💰 +👥', fn: g => ({money:-5000,social:10,mood:-5}) },
        { label:'"不好意思，最近也紧"', hint:'+😊 -👥', fn: g => ({social:-5,mood:5}) },
        { label:'借一半', hint:'-💰', fn: g => ({money:-2500,social:5}) },
      ]},
    { id:'shopping', icon:'📦', title:'网购成瘾', weight:2,
      body:'双11来了。你的购物车37件商品，总价18000。满减算下来省3000（你觉得赚了3000）。\n\n直播间里主播喊："3、2、1，上链接！"你的手指比脑子快。\n\n你确定那个自动搅拌咖啡杯和宠物饮水机是必需品吗？你没有宠物。',
      cond: g => true,
      choices:[
        { label:'全部付款！人生苦短！', hint:'-💰💰 +😊', fn: g => ({money:-8000,mood:15,charm:3}) },
        { label:'精挑细选', hint:'-💰 +🧠', fn: g => ({money:-2000,mood:5,intel:3}) },
        { label:'清空购物车', hint:'+💰 -😊', fn: g => ({mood:-8,money:500}) },
        { label:'用花呗分期', hint:'-💰(未来)', fn: g => ({mood:10,money:-1000}) },
      ]},
    { id:'lottery', icon:'🎰', title:'彩票站', weight:2,
      body:'你路过一家彩票站。如果中了500万，第一件事做什么？\n\n你花了20块钱买了一注。开奖号码：03 15 22 28 35 + 07。\n你的号码：01 02 03 04 05 + 06。一个都没中。\n\n"期望越大，失望越大。跟人生一样。"',
      cond: g => true,
      choices:[
        { label:'买100块彩票', hint:'🎲', fn: g => { const r=Math.random(); if(r>0.98){return{money:500000,mood:50}}else if(r>0.9){return{money:500,mood:10}}else{return{money:-100,mood:-3}} }},
        { label:'买2块钱的', hint:'🎲', fn: g => { if(Math.random()>0.95){return{money:10000,mood:30}}else{return{money:-2,mood:2}} }},
        { label:'彩票是穷人税', hint:'+🧠', fn: g => ({intel:3,mood:3}) },
      ]},
    // --- LIFESTYLE ---
    { id:'weekend', icon:'🎮', title:'周末时光', weight:3,
      body:'终于周末了。但你知道这48小时会像水一样从指缝间流走。\n\n你躺在床上刷手机，一抬头已经是下午3点。\n\n"成年人的周末，就是在「出去玩」和「在家躺」之间反复横跳，最后选择了在床上玩手机。"',
      cond: g => true,
      choices:[
        { label:'出去浪', hint:'-💰 +😊 +👥', fn: g => ({money:-500,mood:12,social:8}) },
        { label:'在家躺一天', hint:'+❤️ +😊', fn: g => ({health:5,mood:8}) },
        { label:'去咖啡馆学习', hint:'+🧠 -💰', fn: g => ({intel:8,mood:3,money:-80}) },
        { label:'加班（自愿的）', hint:'+💰 -❤️', fn: g => ({money:1000,health:-5,mood:-8}) },
      ]},
    { id:'bubble_tea', icon:'🧋', title:'奶茶续命', weight:4,
      body:'同事问："喝奶茶吗？"你看了看手里已经喝了一半的奶茶，又看了看外卖App上另一家新开的店。\n\n你已经是金卡会员了。一年下来花在奶茶上的钱够买一部iPhone。\n\n"奶茶是打工人的精神支柱，不喝会死的。"（会得糖尿病的。）',
      cond: g => true,
      choices:[
        { label:'喝！全糖去冰加珍珠', hint:'+😊 -❤️', fn: g => ({mood:8,health:-3,money:-30}) },
        { label:'今天戒奶茶', hint:'+❤️', fn: g => ({health:3,mood:-5}) },
        { label:'喝无糖的', hint:'+😊', fn: g => ({mood:5,health:-1,money:-25}) },
        { label:'自己做', hint:'+🧠', fn: g => ({intel:2,mood:3,money:20}) },
      ]},
    { id:'family', icon:'📞', title:'父母的电话', weight:3,
      body:'你妈打来电话，永远只有几个问题：\n\n1."吃了吗？"（不管你说什么，她都说"别总吃外卖"）\n2."工作怎么样？"（你说"挺好的"她不信）\n3."有对象了吗？"\n4."什么时候回来看看？"\n\n你突然有点想家了。但你知道，回去待三天你就会想逃。\n\n"故乡容不下灵魂，大城市容不下肉身。"',
      cond: g => true,
      choices:[
        { label:'耐心聊了半小时', hint:'+😊 +👥', fn: g => ({mood:10,social:5}) },
        { label:'"我在开会，回头打"', hint:'-😊', fn: g => ({mood:-8}) },
        { label:'买张票回家看看', hint:'-💰 +😊', fn: g => ({money:-2000,mood:20,health:5}) },
        { label:'发个红包表孝心', hint:'-💰 +👥', fn: g => ({money:-2000,social:8,mood:5}) },
      ]},
    { id:'subway', icon:'🚇', title:'地铁修罗场', weight:3,
      body:'早高峰的地铁，是一场没有硝烟的战争。\n\n你被挤在两个人中间，左边外放抖音的大叔，右边吃韭菜盒子的大姐。你的脚被踩了三次，没人道歉。\n\n你终于挤上了车，发现自己已经被挤成了二次元。\n\n广播："下一站XX站，请提前做好准备。"\n在这种密度下，做任何准备都是徒劳的。',
      cond: g => g.months>1,
      choices:[
        { label:'戴上耳机，世界与我无关', hint:'+😊', fn: g => ({mood:5}) },
        { label:'挤！用力挤！', hint:'-❤️', fn: g => ({health:-2,mood:-5}) },
        { label:'打车（奢侈一次）', hint:'-💰 +😊', fn: g => ({money:-50,mood:10}) },
        { label:'骑共享单车', hint:'+❤️ +😊', fn: g => ({health:3,mood:5}) },
      ]},
    { id:'social_media', icon:'📱', title:'朋友圈焦虑', weight:2,
      body:'你打开朋友圈：同事A升职了，同学B买房了，发小C结婚了，邻居D生孩子了。\n\n你看了看自己——躺在床上，吃着外卖，刷着别人精彩的人生。\n\n你发了条"岁月静好"然后删掉了。重新发了一条"加班使我快乐"（配的是网图）。\n\n收获了38个赞。你觉得人生又有了意义。大概。',
      cond: g => g.mood<60,
      choices:[
        { label:'关掉朋友圈', hint:'+😊 +🧠', fn: g => ({mood:10,intel:5}) },
        { label:'发条精修朋友圈', hint:'+✨ -😊', fn: g => ({charm:5,mood:-3}) },
        { label:'点赞所有人', hint:'+👥', fn: g => ({social:5}) },
        { label:'删掉微信', hint:'+😊 -👥', fn: g => ({mood:15,social:-15}) },
      ]},
    { id:'pet', icon:'🐱', title:'养宠物的冲动',
      body:'你在路上看到一只流浪猫，它用那双水汪汪的大眼睛看着你。\n\n你想带它回家，但你犹豫了：出租屋允许养吗？你有钱给它看病吗？你有时间遛它吗？\n\n但它的爪子搭在了你的鞋上。完了，走不了了。',
      cond: g => !g.flags.hasPet && g.age>=23,
      choices:[
        { label:'养！穷什么不能穷孩子', hint:'-💰 +😊', fn: g => { g.flags.hasPet=true; return{money:-3000,mood:20,health:5}; }},
        { label:'喂它吃东西就好', hint:'+😊', fn: g => ({mood:10,money:-50}) },
        { label:'拍张照就走', hint:'+✨', fn: g => ({charm:3,mood:5}) },
        { label:'理性一点', hint:'-😊 +🧠', fn: g => ({mood:-8,intel:3}) },
      ]},
    { id:'spring', icon:'🧧', title:'春节回家',
      body:'春运。你抢到了站票。火车上你被挤在厕所门口，闻着泡面和脚丫的混合气味。\n\n到家后你妈第一句："瘦了。"第二句："有对象了吗？"第三句："隔壁小明生了二胎。"\n\n你发了条朋友圈："回家的感觉真好。"\n三天后："还是大城市好。"',
      cond: g => g.month%12===0 && g.month>0,
      choices:[
        { label:'开开心心过年', hint:'-💰 +😊', fn: g => ({money:-8000,mood:15,social:5,health:3}) },
        { label:'旅游过年', hint:'-💰 +😊😊', fn: g => ({money:-5000,mood:20,social:-5}) },
        { label:'加班赚三倍', hint:'+💰 -😊', fn: g => ({money:(g.jobSalary*2)||5000,mood:-15,health:-5}) },
      ]},
    { id:'travel', icon:'✈️', title:'说走就走',
      body:'你在小红书上刷到了大理/丽江/西藏的照片。蓝天白云，每一张都像壁纸。\n\n"人生苦短，我要去看看这个世界。"\n\n你打开机票App看了看价格，又看了看年假余额（还剩5天）。\n\n算了，在地图上看看也算去过了吧。',
      cond: g => g.mood<55 && g.months>6,
      choices:[
        { label:'请年假去旅行！', hint:'-💰 +😊😊', fn: g => ({money:-8000,mood:25,health:8,charm:5}) },
        { label:'周末周边游', hint:'-💰 +😊', fn: g => ({money:-1500,mood:12,health:3}) },
        { label:'云旅游（看vlog）', hint:'+😊', fn: g => ({mood:5}) },
        { label:'等有钱了再去', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    // --- SPECIAL ---
    { id:'crisis', icon:'🤔', title:'存在主义危机',
      body:'凌晨两点，你盯着天花板：\n\n"我每天上班下班，加班还贷，这就是我想要的人生吗？"\n"我为什么来大城市？"\n"我到底在追求什么？"\n\n你想了一会儿，然后打开了外卖App——哲学问题还是留给吃饱了的人吧。',
      cond: g => g.mood<45 && g.age>=25,
      choices:[
        { label:'写日记理清思绪', hint:'+😊 +🧠', fn: g => ({mood:12,intel:8}) },
        { label:'找人倾诉', hint:'+👥', fn: g => ({social:8,mood:8}) },
        { label:'继续刷手机', hint:'-😊', fn: g => ({mood:-5,health:-3}) },
        { label:'做个改变人生的决定', hint:'🎲', fn: g => { const r=Math.random(); if(r>0.7){return{mood:25,charm:10}}else if(r>0.3){return{mood:-10}}else{return{mood:15,intel:10}} }},
      ]},
    { id:'influencer', icon:'📸', title:'网红梦',
      body:'你在抖音上发了条视频，突然火了——10万播放量！\n\n评论区有人叫你"大佬"，有人叫你"老师"。\n\n你的理性说：10万可能只是算法抽风。\n你的感性说：你就是下一个李佳琦！',
      cond: g => g.charm>55 && g.age>=22 && g.age<=35,
      choices:[
        { label:'辞职做全职博主', hint:'🎲🎲', fn: g => { setJob(g,'自媒体博主',0); if(Math.random()>0.7){g.flags.influencer=true;return{money:20000,charm:15,mood:20}}else{return{money:-5000,mood:-15,health:-5}} }},
        { label:'继续做，当副业', hint:'+✨ +💰', fn: g => ({charm:8,money:3000,mood:10}) },
        { label:'热度会过去的', hint:'+🧠', fn: g => ({intel:5,mood:-3}) },
      ]},
    { id:'study', icon:'🎓', title:'考研/考博',
      body:'你开始怀疑自己的学历。在这个硕士满地走的年代，你决定考研。\n\n三个月后，你在考场上发现：第一题就不会。\n\n"知识改变命运——但前提是你能记住知识。"',
      cond: g => g.age>=22 && g.age<=32 && g.intel>50,
      choices:[
        { label:'全力备考', hint:'+🧠 -💰', fn: g => { if(g.intel>70&&Math.random()>0.5){return{intel:20,mood:20,money:-5000,health:-5}}else{return{intel:8,mood:-15,money:-5000,health:-5}} }},
        { label:'边上班边考', hint:'-❤️', fn: g => ({intel:10,health:-10,mood:-8,money:-3000}) },
        { label:'算了，学历不重要', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'age35', icon:'🎂', title:'35岁危机',
      body:'你35岁了。\n\n在互联网行业，35岁是一个神奇的年龄——过了这个年龄，你就从"有经验的人才"变成了"大龄程序员"。\n\n猎头说："35岁以上？不好意思，客户要30岁以下的。"\n\n你看着镜子里的自己，发际线又后退了1厘米。\n\n"35岁，是职场的保质期。"',
      cond: g => g.age===35 && !g.flags.age35done,
      choices:[
        { label:'转型做管理', hint:'+💰 +👥', fn: g => { g.flags.age35done=true; if(g.social>50){setJob(g,'技术总监',Math.floor((g.jobSalary||15000)*1.5));return{mood:15,charm:5}}else{return{mood:-10}} }},
        { label:'考公务员（最后机会）', hint:'🎲', fn: g => { g.flags.age35done=true; if(g.intel>75&&Math.random()>0.6){g.flags.civilServant=true;setJob(g,'公务员',12000);return{mood:25,money:-5000}}else{return{mood:-20,money:-5000}} }},
        { label:'创业！', hint:'🎲🎲', fn: g => { g.flags.age35done=true;g.flags.entrepreneur=true;setJob(g,'创业者',0);return{money:-30000,mood:10,social:10}; }},
        { label:'接受现实', hint:'+🧠', fn: g => { g.flags.age35done=true; return{intel:10,mood:-10,health:5}; }},
      ]},
    { id:'parent_sick', icon:'🏥', title:'父母生病',
      body:'你接到了电话：你爸/妈住院了。\n\n你买了最早的票赶回去。在火车上你看着窗外，突然觉得自己好无力。\n\n在大城市你可以是996的打工人，但在父母面前你永远是那个孩子。而现在角色反转了。\n\n"子欲养而亲不待"——这六个字，你终于读懂了。',
      cond: g => g.age>=30 && Math.random()>0.5,
      choices:[
        { label:'请假回去照顾', hint:'-💰 +😊', fn: g => ({money:-10000,mood:10,social:5,health:-3}) },
        { label:'转钱过去', hint:'-💰', fn: g => ({money:-15000,mood:-10}) },
        { label:'请护工', hint:'-💰💰', fn: g => ({money:-20000,mood:-5}) },
      ]},
    { id:'hukou', icon:'📋', title:'户口难题',
      body:'你在这座城市生活了好几年，但始终是个"外来人口"。\n\n没有户口：买房受限、孩子上学难、医保不方便、永远觉得自己是个"漂"。\n\n有人说："户口就是一张纸，但这张纸值几百万。"',
      cond: g => g.age>=28 && g.months>36 && !g.flags.hasHukou,
      choices:[
        { label:'努力攒积分', hint:'+🧠', fn: g => { if(Math.random()>0.5){g.flags.hasHukou=true;return{mood:20,social:10,intel:5}}else{return{intel:5,mood:-5}} }},
        { label:'花钱找关系', hint:'-💰 🎲', fn: g => { if(Math.random()>0.6){g.flags.hasHukou=true;return{money:-50000,mood:20}}else{return{money:-50000,mood:-25}} }},
        { label:'算了，不执着了', hint:'+😊', fn: g => ({mood:10,intel:5}) },
      ]},
    { id:'move_city', icon:'🗺️', title:'换城市？',
      body:'你开始怀疑自己选错了城市。\n\n北京的朋友说："来深圳吧。"\n深圳的朋友说："来杭州吧。"\n杭州的朋友说："来成都吧。"\n成都的朋友说："去哪都一样卷。"\n\n"不是城市选择了你，是你选择了在城市里受苦。"',
      cond: g => g.age>=25 && g.mood<45 && g.months>24,
      choices:[
        { label:'换一个城市重新开始', hint:'🎲', fn: g => { const cs=['shanghai','shenzhen','hangzhou','chengdu','guangzhou']; const c=cs[Math.floor(Math.random()*cs.length)]; g.city=c;g.cityName=CITIES[c].name;setJob(g,'待业中',0);return{mood:15,money:-5000,social:-15}; }},
        { label:'在哪都一样', hint:'+🧠', fn: g => ({intel:5,mood:5}) },
        { label:'回老家', hint:'+😊', fn: g => { setJob(g,'待业中',0); return{mood:10,charm:-5,social:-10}; }},
      ]},
    { id:'loneliness', icon:'🌃', title:'一个人的夜晚',
      body:'加班到晚上11点，街上已经没什么人了。\n\n你叫了辆车回家，看着窗外的霓虹灯，突然觉得有点孤独。\n\n在大城市你可以认识很多人，但真正能半夜接你电话的人，一只手数得过来。\n\n"大城市的孤独，是一种奢侈品。因为连寂寞都要自己买单。"',
      cond: g => g.social<40 && g.mood<50,
      choices:[
        { label:'打电话给朋友', hint:'+👥', fn: g => ({social:10,mood:10}) },
        { label:'去便利店买啤酒', hint:'+😊 -❤️', fn: g => ({mood:8,health:-3,money:-30}) },
        { label:'发条深夜emo朋友圈', hint:'+✨', fn: g => ({charm:3,mood:5}) },
        { label:'回家睡觉', hint:'+❤️', fn: g => ({health:5,mood:-3}) },
      ]},
    { id:'office_politics', icon:'🎭', title:'职场宫斗',
      body:'你的同事小王在背后跟领导说了你的"小秘密"——你上周迟到三次。\n\n你被领导叫去谈话。回到工位看到小王在给领导倒咖啡。\n\n"职场没有朋友，只有利益。"但你连利益都没有。\n\n你在脉脉发了条匿名吐槽，获得32个赞和一句"同是天涯沦落人"。',
      cond: g => g.job!=='待业中' && g.months>6,
      choices:[
        { label:'反击！怼回去', hint:'🎲', fn: g => { if(Math.random()>0.5){return{mood:15,social:-5,charm:5}}else{return{mood:-20,social:-10}} }},
        { label:'忍了', hint:'+🧠', fn: g => ({mood:-8,intel:5}) },
        { label:'找领导谈', hint:'+✨', fn: g => ({charm:3,social:3,mood:-3}) },
        { label:'发朋友圈阴阳怪气', hint:'+😊', fn: g => ({mood:8,social:-3}) },
      ]},
    { id:'learn', icon:'📖', title:'自我提升', weight:2,
      body:'你在B站看到视频："30岁前必须掌握的10个技能"。你一个都不会。\n\n你决定投资自己：\n- 学英语（多邻国的猫头鹰已经30天没看到你了）\n- 学编程（print("Hello World")之后没有然后了）\n- 学理财（第一课：穷人不要理财）\n- 学画画（你的画跟你的工资一样——抽象）',
      cond: g => g.intel<70 || g.months>6,
      choices:[
        { label:'报网课学习', hint:'-💰 +🧠', fn: g => { if(Math.random()>0.3){return{intel:12,money:-3000,mood:8}}else{return{intel:3,money:-3000,mood:-5}} }},
        { label:'自学（B站大学）', hint:'+🧠', fn: g => ({intel:8,mood:3}) },
        { label:'买书不看', hint:'-💰', fn: g => ({money:-200,intel:2}) },
        { label:'明天再说', hint:'+😊', fn: g => ({mood:5,intel:-1}) },
      ]},
    { id:'meme_life', icon:'😂', title:'打工人的日常', weight:4,
      body: () => {
        const memes = [
          '你今天的工牌挂绳断了。你想起上周就换了新挂绳——原来不是预兆，是质量问题。\n\n"打工人的运势，跟工牌挂绳的质量成正比。"',
          '今天开周会，领导说："我们要对标行业标杆。"你看了看标杆的薪资，又看了看自己的工资条。\n\n"对标是不可能对标的，这辈子都不可能的。"',
          '你在电梯里遇到CEO，他说了句"辛苦了"。你回了句"谢谢"。后来你才知道，他说的是旁边那个人。\n\n"社死现场。"',
          '你在群里发了条消息，结果发到了工作群："老板真是个XX。"\n\n你飞速撤回了消息，但至少三个人已经看到了。\n\n"撤回功能是人类最伟大的发明之一。"',
          '你在工位上偷偷摸鱼，领导突然走过来，你以0.1秒的速度切到了工作界面。\n\n领导说："你反应挺快的。"\n\n你心想：废话，这可是练了三年的技能。\n\n"摸鱼是打工人的核心技能，没有之一。"',
        ];
        return memes[Math.floor(Math.random()*memes.length)];
      },
      cond: g => g.job!=='待业中',
      choices:[
        { label:'发朋友圈吐槽', hint:'+✨ +😊', fn: g => ({charm:3,mood:8}) },
        { label:'默默忍了', hint:'+🧠', fn: g => ({intel:2,mood:-3}) },
        { label:'跟同事分享', hint:'+👥', fn: g => ({social:5,mood:5}) },
      ]},
    { id:'investment', icon:'🏦', title:'理财觉醒',
      body:'你发现：银行利息跑不过通胀，基金帮你亏钱还收管理费，炒股你是韭菜，买房你是穷鬼。\n\n"穷人最好的理财方式，就是别理财。"但你不信邪。',
      cond: g => g.money>20000 && g.age>=25,
      choices:[
        { label:'定投指数基金', hint:'🎲', fn: g => { if(Math.random()>0.4){return{money:Math.floor(g.money*0.08),intel:8}}else{return{money:-Math.floor(g.money*0.05),mood:-5,intel:5}} }},
        { label:'存大额定期', hint:'+💰', fn: g => ({money:Math.floor(g.money*0.03),mood:3}) },
        { label:'投资自己', hint:'+🧠 +✨', fn: g => ({money:-5000,intel:12,charm:5,mood:8}) },
      ]},
];

// === ACHIEVEMENTS ===
const ACHIEVEMENTS = [
    { id:'first_job', icon:'💼', name:'职场新人', desc:'找到第一份工作', check: g => g.flags.gotFirstJob },
    { id:'rich', icon:'💰', name:'月入过万', desc:'月收入超过10000', check: g => g.jobSalary>=10000 },
    { id:'homeowner', icon:'🏡', name:'有房一族', desc:'在大城市买房', check: g => g.flags.hasHouse },
    { id:'married', icon:'💒', name:'人生赢家？', desc:'结婚', check: g => g.flags.married },
    { id:'parent', icon:'👶', name:'成为父母', desc:'有了孩子', check: g => g.flags.hasChild },
    { id:'influencer', icon:'📸', name:'网红达人', desc:'成为自媒体', check: g => g.flags.influencer },
    { id:'survivor', icon:'🏆', name:'生存专家', desc:'在大城市存活5年', check: g => g.months>=60 },
    { id:'saver', icon:'🐷', name:'存钱达人', desc:'存款超过10万', check: g => g.money>=100000 },
    { id:'social_butterfly', icon:'🦋', name:'社交达人', desc:'人脉超过80', check: g => g.social>=80 },
    { id:'intellectual', icon:'🎓', name:'知识分子', desc:'智力超过90', check: g => g.intel>=90 },
    { id:'healthy', icon:'💪', name:'健康达人', desc:'健康保持90以上', check: g => g.health>=90 },
    { id:'civil_servant', icon:'📋', name:'铁饭碗', desc:'考上公务员', check: g => g.flags.civilServant },
    { id:'entrepreneur', icon:'🚀', name:'创业先锋', desc:'开始创业', check: g => g.flags.entrepreneur },
    { id:'pet_owner', icon:'🐱', name:'铲屎官', desc:'养了宠物', check: g => g.flags.hasPet },
    { id:'hukou', icon:'📋', name:'落户成功', desc:'获得户口', check: g => g.flags.hasHukou },
];

// === ENDINGS ===
const ENDINGS = [
    { id:'fire', badge:'🌟', title:'FIRE人生', desc:'你实现了财务自由，提前退休了。在大理买了栋小房子，种花养狗。\n\n"少吃外卖，少喝奶茶，少看直播——省下来的钱够你提前退休了。"\n\n（其实是因为你运气好。）', cond: g => g.money>=500000 && g.mood>=70 && g.health>=60 },
    { id:'executive', badge:'👔', title:'大厂高管', desc:'你从初级做到了技术VP。工牌从绿色变成了金色，办公室从工位变成了独立间。\n\n但头发从浓密变成了稀疏，颈椎从正常变成了C5-C6突出。\n\n你用健康换了财富，现在想用财富换健康。', cond: g => g.jobSalary>=50000 && g.money>=300000 },
    { id:'settled', badge:'🏡', title:'扎根大城市', desc:'你买了房、落了户、结了婚、生了娃。从"X漂"变成了"新XX人"。\n\n你的孩子以后不用再经历你经历的一切。\n\n你觉得一切都值了。虽然房贷还要还25年。', cond: g => g.flags.hasHouse && g.flags.hasHukou && g.flags.married },
    { id:'go_home', badge:'🏠', title:'返乡青年', desc:'你决定回老家了。不是因为失败，而是终于想明白了：大城市不是唯一的选择。\n\n你用攒的钱和学到的本事，在老家开了小店。\n\n你妈终于笑了："回来就好。"', cond: g => g.mood>=60 && g.money>=50000 && g.age>=30 },
    { id:'civil_end', badge:'📋', title:'体制内人生', desc:'你考上了公务员，过上了朝九晚五、稳定双休的生活。朋友圈从加班照变成了食堂照。\n\n在这个充满不确定性的时代，"稳定"本身就是一种奢侈。', cond: g => g.flags.civilServant && g.months>=36 },
    { id:'burnout', badge:'🔥', title:'过劳人生', desc:'你的身体终于扛不住了。长期996、熬夜、吃外卖——体检报告比简历还厚。\n\n医生说："你需要休息。"你苦笑：休息？在这个城市是奢侈品。\n\n"身体是革命的本钱——但打工人的本钱，早就不够了。"', cond: g => g.health<=15 },
    { id:'depression', badge:'🌧️', title:'至暗时刻', desc:'你抑郁了。不是因为某一件事，而是所有事的叠加。\n\n但你拨打了心理热线：400-161-9995。\n\n"你已经很勇敢了。"\n\n你哭了一场，然后洗了把脸。明天又是新的一天。\n\n（求助不是软弱，活着就是胜利。）', cond: g => g.mood<=10 },
    { id:'influencer_end', badge:'📱', title:'网红达人', desc:'你真的成了网红。粉丝10万，靠广告可以养活自己。\n\n你以为这是自由，后来发现算法才是你的老板。\n\n但至少做自己喜欢的事，确实比打工快乐。', cond: g => g.flags.influencer && g.money>=50000 },
    { id:'startup_end', badge:'🚀', title:'创业有成', desc:'你的公司活过了三年——这在创业圈已经是奇迹。\n\n没有上市，但你养活了10人团队，做出了有人用的产品。\n\n你偶尔想起当初在出租屋写第一行代码的夜晚。那时你什么都没有，除了笔记本和一腔热血。', cond: g => g.flags.entrepreneur && g.money>=100000 },
    { id:'startup_fail', badge:'💔', title:'创业失败', desc:'你的公司倒闭了。赔光了积蓄，欠了一屁股债。\n\n但你知道：创业失败不丢人，不敢创业才丢人。（虽然你现在觉得这是毒鸡汤。）\n\n你打开招聘App重新投简历。至少简历上多了"联合创始人"。', cond: g => g.flags.entrepreneur && g.money<=-30000 },
    { id:'ordinary', badge:'☀️', title:'小确幸人生', desc:'你没有成为大佬，没有买房，没有财务自由。\n\n但你有还不错的工作、几个交心的朋友、一只猫、一个爱你的人。\n\n周末跑步，晚上做饭，睡前看书。\n\n"不是每个人都要成为传奇。认真生活的人，本身就是英雄。"', cond: g => g.mood>=55 && g.health>=50 && g.money>=20000 },
    { id:'wealthy', badge:'💎', title:'财务自由', desc:'你成了"成功人士"。大房子、好车子、国际学校。\n\n但你知道，光鲜背后是你错过了孩子的第一次走路、父母的生日、朋友的聚会。\n\n你用时间换了钱。现在想用钱换时间——但时间不卖。', cond: g => g.money>=1000000 },
    { id:'single', badge:'🌸', title:'单身贵族', desc:'你选择了单身。不是找不到，而是发现一个人也挺好。\n\n随时加班、随时旅行、随时吃火锅。\n\n你妈依然每周催婚，但你学会了微笑以对。\n\n"幸福的标准不止一种。一个人的日子，也可以过得很精彩。"', cond: g => !g.flags.married && !g.flags.hasPartner && g.mood>=60 && g.age>=35 },
    { id:'default', badge:'🌅', title:'平凡人生', desc:'你的故事没有惊天动地，也没有波澜壮阔。\n\n你只是一个普通人，在大城市过着普通的生活。加过班、失过业、恋过爱、失过眠。\n\n但每一个认真活着的人，都在书写自己的故事。\n\n你的故事还没有结束——因为人生，永远都有下一页。', cond: g => true },
];

// === HELPERS ===
function setJob(g, title, salary) {
    g.job = title; g.jobSalary = salary;
    if (!g.flags.gotFirstJob && title !== '待业中') { g.flags.gotFirstJob = true; unlockAchievement('first_job'); }
}
function getTitle(g, level) {
    const t = { junior: ['初级工程师','初级运营','实习生','助理'], senior: ['高级工程师','资深运营','产品经理','项目经理'], lead: ['技术负责人','运营总监','设计总监','Team Lead'] };
    return (t[level]||t.junior)[Math.floor(Math.random()*(t[level]||t.junior).length)];
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function fmtMoney(n) { if(n>=10000) return `¥${(n/10000).toFixed(1)}万`; if(n<0) return `-¥${Math.abs(n).toLocaleString()}`; return `¥${n.toLocaleString()}`; }
function unlockAchievement(id) { if(!G.achievements.includes(id)){ G.achievements.push(id); const a=ACHIEVEMENTS.find(a=>a.id===id); if(a) notify(`${a.icon} 解锁成就：${a.name}`); } }

// === SCREENS ===
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const s = document.getElementById(id);
    if (s) s.classList.add('active');
}

// === CREATION ===
let selectedBg = null, selectedCity = null;
function selectBackground(bg) {
    selectedBg = bg;
    document.querySelectorAll('.bg-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.bg-card[data-bg="${bg}"]`).classList.add('selected');
    document.getElementById('create-step1').classList.add('hidden');
    document.getElementById('create-step2').classList.remove('hidden');
}
function selectCity(city) {
    selectedCity = city;
    document.querySelectorAll('.city-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.city-card[data-city="${city}"]`).classList.add('selected');
    document.getElementById('create-step2').classList.add('hidden');
    document.getElementById('create-step3').classList.remove('hidden');
}
function setName(name) { document.getElementById('player-name').value = name; }

// === START ===
function startGame() {
    const name = document.getElementById('player-name').value.trim();
    if (!name) { notify('请输入你的名字！'); return; }
    const bg = BACKGROUNDS[selectedBg], city = CITIES[selectedCity];

    Object.assign(G, {
        name, age: bg.startAge||22, month: 1, year: 2024,
        city: selectedCity, cityName: city.name, background: selectedBg,
        job: bg.startJob, jobSalary: bg.startSalary,
        months: 0, choices: 0, eventsSeen: 0, eventLog: [], achievements: [],
        money: bg.money, health: bg.health, mood: bg.mood,
        intel: bg.intel, social: bg.social, charm: bg.charm,
        flags: {}, currentEvent: null, isEnded: false,
    });

    showScreen('screen-game');
    updateHUD();

    const log = document.getElementById('event-log');
    log.innerHTML = '';

    addEventCard({ icon: '🚀', title: `${bg.name} · 来到${city.name}`, body: bg.intro + `\n\n<div class="meme-quote">${city.meme}</div>`, type: 'milestone' }, false);
    addEventCard({ icon: '📍', title: '新起点', body: `你来到了${city.name}——"${city.trait}"。\n\n房租：${fmtMoney(city.rent)}/月\n生活成本：${city.cost>1.1?'较高':city.cost>1.0?'适中':'还行'}\n\n每个伟大的故事都从一间出租屋开始。`, type: 'special' }, false);

    document.getElementById('current-event').innerHTML = '';
    document.getElementById('btn-advance').disabled = false;
    G.eventLog.push({ age: G.age, text: `来到${city.name}，开始漂泊生活` });
}

// === GAME FLOW ===
function advanceMonth() {
    if (G.isEnded) return;
    G.months++; G.month++;
    if (G.month > 12) { G.month = 1; G.age++; G.year++; }

    const city = CITIES[G.city];
    G.money -= city.rent + Math.floor(3000 * city.cost);
    if (G.jobSalary > 0) G.money += G.jobSalary;
    if (G.flags.entrepreneur && Math.random()>0.6) G.money += Math.floor(Math.random()*15000)+2000;
    if (G.flags.sideHustle && Math.random()>0.5) G.money += Math.floor(Math.random()*5000)+1000;

    G.health = clamp(G.health - (G.job==='待业中'?0:1), 0, 100);
    G.mood = clamp(G.mood - 1, 0, 100);

    updateHUD();
    checkAchievements();

    if (G.age >= 60 || G.health <= 0 || G.mood <= 0) { triggerEnding(); return; }

    const event = pickEvent();
    if (event) { showEvent(event); } else { showMonthlySummary(); }

    if (G.months % 12 === 0) G.eventLog.push({ age: G.age, text: `在大城市又活过了一年` });
}

function pickEvent() {
    const eligible = EVENTS.filter(e => (!e.cond || e.cond(G)) && (!e.minAge || G.age>=e.minAge) && (!e.maxAge || G.age<=e.maxAge));
    if (!eligible.length) return null;
    const weighted = [];
    eligible.forEach(e => { for(let i=0;i<(e.weight||1);i++) weighted.push(e); });
    return weighted[Math.floor(Math.random()*weighted.length)];
}

function showEvent(event) {
    G.currentEvent = event; G.eventsSeen++;
    const body = typeof event.body === 'function' ? event.body() : event.body;
    document.getElementById('current-event').innerHTML = `
        <div class="event-card">
            <div class="event-card-header">
                <span class="event-card-icon">${event.icon}</span>
                <span class="event-card-title">${event.title}</span>
                <span class="event-card-date">${G.year}年${G.month}月</span>
            </div>
            <div class="event-card-body">${body}</div>
            <div class="event-choices">
                ${event.choices.map((c,i) => `<button class="choice-btn" onclick="makeChoice(${i})"><span class="choice-label">${c.label}</span>${c.hint?`<span class="choice-hint">${c.hint}</span>`:''}</button>`).join('')}
            </div>
        </div>`;
    document.getElementById('btn-advance').disabled = true;
}

function makeChoice(i) {
    const event = G.currentEvent, choice = event.choices[i];
    G.choices++;
    const result = choice.fn(G);

    if (result.money) G.money += result.money;
    if (result.health) G.health = clamp(G.health + result.health, 0, 100);
    if (result.mood) G.mood = clamp(G.mood + result.mood, 0, 100);
    if (result.intel) G.intel = clamp(G.intel + result.intel, 0, 100);
    if (result.social) G.social = clamp(G.social + result.social, 0, 100);
    if (result.charm) G.charm = clamp(G.charm + result.charm, 0, 100);

    const labels = {money:'💰',health:'❤️',mood:'😊',intel:'🧠',social:'👥',charm:'✨'};
    let changes = '';
    for (const [k,v] of Object.entries(result)) {
        if (labels[k] && v) {
            const d = k==='money' ? fmtMoney(v) : (v>0?`+${v}`:`${v}`);
            changes += `<span class="stat-change-item ${v>0?'positive':'negative'}">${labels[k]} ${d}</span>`;
        }
    }

    const body = typeof event.body === 'function' ? event.body() : event.body;
    addEventCard({ icon: event.icon, title: event.title, body, choice: choice.label, changes, type: result.mood>0?'positive':result.mood<0?'negative':'' }, true);

    document.getElementById('current-event').innerHTML = '';
    document.getElementById('btn-advance').disabled = false;
    G.currentEvent = null;

    updateHUD();
    if (G.health<=0 || G.mood<=0) triggerEnding();
    checkAchievements();
}

function showMonthlySummary() {
    const s = [
        `又是平凡的一个月。你${G.job!=='待业中'?'照常上班':'继续找工作'}，日子一天天过去。`,
        `这个月没什么特别的事。在大城市，"没什么事"本身就是一种奢侈。`,
        `日子照旧。地铁、工位、出租屋，三点一线。`,
        `平静的一个月。你偶尔会想，这样的日子还要持续多久。`,
    ];
    addEventCard({ icon:'📅', title:`${G.year}年${G.month}月`, body: s[Math.floor(Math.random()*s.length)], type:'' }, true);
}

// === UI ===
function updateHUD() {
    document.getElementById('hud-name').textContent = G.name;
    document.getElementById('hud-age').textContent = `${G.age}岁`;
    document.getElementById('hud-city').textContent = G.cityName;
    document.getElementById('hud-job').textContent = G.job!=='待业中' ? `${G.job} · ${fmtMoney(G.jobSalary)}/月` : '待业中';
    document.getElementById('hud-date').textContent = `${G.year}年${G.month}月`;

    updBar('bar-money','val-money', Math.min(G.money/500000*100,100), fmtMoney(G.money));
    updBar('bar-health','val-health', G.health, G.health);
    updBar('bar-mood','val-mood', G.mood, G.mood);
    updBar('bar-intel','val-intel', G.intel, G.intel);
    updBar('bar-social','val-social', G.social, G.social);
    updBar('bar-charm','val-charm', G.charm, G.charm);

    document.getElementById('play-months').textContent = G.months;
    document.getElementById('total-choices').textContent = G.choices;
    document.getElementById('total-events').textContent = G.eventsSeen;
}

function updBar(barId, valId, pct, display) {
    const bar = document.getElementById(barId);
    const val = document.getElementById(valId);
    if (bar) bar.querySelector('.stat-fill').style.width = `${clamp(pct,0,100)}%`;
    if (val) val.textContent = display;
}

function addEventCard(data, addToLog) {
    const log = document.getElementById('event-log');
    const card = document.createElement('div');
    card.className = `event-card ${data.type?'event-'+data.type:''}`;
    let html = `<div class="event-card-header"><span class="event-card-icon">${data.icon}</span><span class="event-card-title">${data.title}</span><span class="event-card-date">${G.year}年${G.month}月</span></div><div class="event-card-body">${data.body}</div>`;
    if (data.choice) html += `<div class="event-card-result">你的选择：<span class="choice-made">${data.choice}</span>${data.changes?`<div class="stat-changes">${data.changes}</div>`:''}</div>`;
    card.innerHTML = html;
    log.querySelectorAll('.event-card').forEach(c => c.classList.add('past'));
    log.appendChild(card);
    log.scrollTop = log.scrollHeight;
    while (log.children.length > 20) log.removeChild(log.firstChild);
}

// === ENDING ===
function triggerEnding() {
    G.isEnded = true;
    const ending = ENDINGS.find(e => e.cond(G)) || ENDINGS[ENDINGS.length-1];

    document.getElementById('ending-badge').textContent = ending.badge;
    document.getElementById('ending-title').textContent = ending.title;
    document.getElementById('ending-desc').innerHTML = ending.desc.replace(/\n/g,'<br>');

    document.getElementById('summary-grid').innerHTML = `
        <div class="summary-item"><div class="summary-value">${G.age}岁</div><div class="summary-label">最终年龄</div></div>
        <div class="summary-item"><div class="summary-value">${fmtMoney(G.money)}</div><div class="summary-label">最终资产</div></div>
        <div class="summary-item"><div class="summary-value">${Math.floor(G.months/12)}年${G.months%12}个月</div><div class="summary-label">漂泊时长</div></div>
        <div class="summary-item"><div class="summary-value">${G.choices}次</div><div class="summary-label">做出选择</div></div>
        <div class="summary-item"><div class="summary-value">${G.eventsSeen}个</div><div class="summary-label">经历事件</div></div>
        <div class="summary-item"><div class="summary-value">${G.achievements.length}个</div><div class="summary-label">解锁成就</div></div>`;

    document.getElementById('timeline-list').innerHTML = G.eventLog.map(e => `<div class="timeline-item"><span class="timeline-year">${e.age}岁</span><span class="timeline-text">${e.text}</span></div>`).join('');
    showScreen('screen-ending');
}

// === ACHIEVEMENTS ===
function checkAchievements() { ACHIEVEMENTS.forEach(a => { if(!G.achievements.includes(a.id)&&a.check(G)) unlockAchievement(a.id); }); }

function showAchievements() {
    document.getElementById('achievement-grid').innerHTML = ACHIEVEMENTS.map(a => {
        const u = G.achievements.includes(a.id);
        return `<div class="achievement-item ${u?'':'locked'}"><div class="achievement-icon">${a.icon}</div><div class="achievement-name">${u?a.name:'???'}</div><div class="achievement-desc">${u?a.desc:'尚未解锁'}</div></div>`;
    }).join('');
    document.getElementById('modal-achievements').classList.add('open');
    toggleMenu();
}

function showTimeline() {
    document.getElementById('timeline-scroll').innerHTML = G.eventLog.map(e => `<div class="timeline-item"><span class="timeline-year">${e.age}岁</span><span class="timeline-text">${e.text}</span></div>`).join('') || '<p style="color:var(--text-muted)">还没有记录</p>';
    document.getElementById('modal-timeline').classList.add('open');
    toggleMenu();
}

// === SAVE/LOAD ===
function saveGame() { localStorage.setItem('cityDrifters_save', JSON.stringify(G)); notify('💾 游戏已保存！'); toggleMenu(); }
function loadGame() {
    const s = localStorage.getItem('cityDrifters_save');
    if (!s) { notify('没有找到存档'); return; }
    Object.assign(G, JSON.parse(s));
    showScreen('screen-game'); updateHUD(); notify('💾 存档已加载！');
}

// === MENU ===
function toggleMenu() { document.getElementById('side-menu').classList.toggle('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// === NOTIFY ===
function notify(text) {
    const n = document.getElementById('notification');
    document.getElementById('notif-text').textContent = text;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 3000);
}

// === SHARE ===
function shareEnding() {
    const t = document.getElementById('ending-title').textContent;
    const text = `我在「都市浮生记」中获得了【${t}】结局！${G.name}，${G.age}岁，在${G.cityName}漂泊了${Math.floor(G.months/12)}年。`;
    if (navigator.share) { navigator.share({title:'都市浮生记',text}); }
    else { navigator.clipboard.writeText(text).then(() => notify('📤 已复制到剪贴板！')); }
}

// === RESET ===
function resetGame() {
    selectedBg = null; selectedCity = null;
    document.querySelectorAll('.bg-card,.city-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('create-step1').classList.remove('hidden');
    document.getElementById('create-step2').classList.add('hidden');
    document.getElementById('create-step3').classList.add('hidden');
    document.getElementById('player-name').value = '';
}

// === PARTICLES ===
function initParticles() {
    const canvas = document.getElementById('particles'), ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    class P {
        constructor() { this.reset(); }
        reset() { this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.size=Math.random()*1.5+0.5; this.sx=(Math.random()-0.5)*0.3; this.sy=(Math.random()-0.5)*0.3; this.opacity=Math.random()*0.4+0.1; this.pulse=Math.random()*Math.PI*2; }
        update() { this.x+=this.sx; this.y+=this.sy; this.pulse+=0.01; if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset(); }
        draw() { const a=this.opacity*(0.5+0.5*Math.sin(this.pulse)); ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=`rgba(96,165,250,${a})`; ctx.fill(); }
    }
    for(let i=0;i<60;i++) particles.push(new P());
    (function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw()}); requestAnimationFrame(animate); })();
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    if (!localStorage.getItem('cityDrifters_save')) document.getElementById('btn-continue').style.opacity = '0.4';
});
