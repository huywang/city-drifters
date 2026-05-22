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
    beijing: { name: '北京', rent: 3500, cost: 1.2, house: 65000, trait: '帝都', meme: '"在北京，你不是在生活，你是在生存。"',
      events: [
        { id:'beijing_hukou_struggle', icon:'📋', title:'北京户口的诱惑', body:'有个猎头找你：年薪40万，但要求你有北京户口。你看了看自己的户口本——老家农村。\n\n"北京户口，比年薪百万还难。"', cond: g => g.city==='beijing' && !g.flags.hasHukou && g.age>=28,
          choices:[
            { label:'考公务员拿户口', hint:'🎲', fn: g => { if(g.intel>75&&Math.random()>0.6){g.flags.hasHukou=true;setJob(g,'公务员',12000);return{mood:20,money:-5000}}else{return{mood:-15,money:-5000}} }},
            { label:'算了，户口不重要', hint:'+😊', fn: g => ({mood:10}) },
          ]},
      ]},
    shanghai: { name: '上海', rent: 4000, cost: 1.3, house: 75000, trait: '魔都', meme: '"上海不相信眼泪，只相信咖啡和PPT。"',
      events: [
        { id:'shanghai_coffee_culture', icon:'☕', title:'上海咖啡文化', body:'你在上海工作，每天至少两杯咖啡。同事说："不喝咖啡怎么在上海混？"\n\n你已经从速溶升级到精品手冲，再升级到自己买咖啡机。但咖啡钱还是省不下来。\n\n"上海人的血液里流的不是血，是美式。"', cond: g => g.city==='shanghai' && g.job!=='待业中',
          choices:[
            { label:'买咖啡机自己做', hint:'-💰 +🧠', fn: g => ({money:-3000,intel:3,mood:5}) },
            { label:'继续买精品咖啡', hint:'-💰 +😊', fn: g => ({money:-500,mood:8,charm:3}) },
            { label:'戒咖啡喝茶', hint:'+💰 +❤️', fn: g => ({money:200,health:3,mood:-3}) },
          ]},
      ]},
    shenzhen: { name: '深圳', rent: 3000, cost: 1.1, house: 60000, trait: '鹏城', meme: '"来了就是深圳人——来了就开始加班。"',
      events: [
        { id:'shenzhen_startup_dream', icon:'🚀', title:'深圳创业梦', body:'你在南山科技园看到一栋楼：腾讯、大疆、商汤……都在这一片。\n\n你心想：下一个独角兽会不会是我？\n\n你的室友说："别做梦了，先活下来。"但你已经打开了公司注册网站。\n\n"深圳的空气里都是创业的味道，和加班的汗水。"', cond: g => g.city==='shenzhen' && g.intel>60 && g.age>=25 && g.age<=35 && !g.flags.entrepreneur,
          choices:[
            { label:'辞职创业！', hint:'🎲🎲', fn: g => { g.flags.entrepreneur=true;setJob(g,'创业者',0); if(Math.random()>0.6){return{money:-20000,mood:20,social:15}}else{return{money:-30000,mood:-10}} }},
            { label:'先在大厂积累经验', hint:'+🧠 +💰', fn: g => ({intel:8,money:5000,mood:5}) },
            { label:'算了，打工也挺好', hint:'+😊', fn: g => ({mood:8}) },
          ]},
      ]},
    hangzhou: { name: '杭州', rent: 2800, cost: 1.1, house: 45000, trait: '电商之城', meme: '"杭州的空气里都是创业的味道，和直播的噪音。"',
      events: [
        { id:'hangzhou_live_stream', icon:'📱', title:'杭州直播热', body:'你在杭州，周围全是做直播的。同事下班去直播，邻居周末直播，连楼下卖煎饼的大妈都在直播。\n\n"杭州人不直播，就像四川人不吃辣——不可能。"\n\n你也心动了：要不要试试？', cond: g => g.city==='hangzhou' && g.charm>50 && !g.flags.influencer,
          choices:[
            { label:'做兼职主播', hint:'+💰 +✨', fn: g => { g.flags.influencer=true; return{money:5000,charm:10,mood:8,health:-3}; }},
            { label:'全职做主播', hint:'🎲', fn: g => { g.flags.influencer=true;setJob(g,'自媒体博主',0); if(Math.random()>0.5){return{money:10000,charm:15,mood:15}}else{return{money:-5000,mood:-10}} }},
            { label:'算了，不凑热闹', hint:'+🧠', fn: g => ({intel:3,mood:5}) },
          ]},
      ]},
    guangzhou: { name: '广州', rent: 2500, cost: 1.0, house: 40000, trait: '羊城', meme: '"在广州，没有什么是一顿早茶解决不了的。"',
      events: [
        { id:'guangzhou_dim_sum', icon:'🥟', title:'广州早茶文化', body:'你在广州工作，同事每周都约早茶。一坐下就是两小时，虾饺、烧卖、肠粉、叉烧包……\n\n你发现：广州人谈生意不喝酒，喝茶。广州人交朋友不吃饭，喝早茶。\n\n"在广州，早茶不是早餐，是一种社交仪式。"', cond: g => g.city==='guangzhou' && g.social<50,
          choices:[
            { label:'积极参加早茶社交', hint:'+👥 +😊', fn: g => ({social:15,mood:10,money:-200,charm:5}) },
            { label:'偶尔去一次', hint:'+👥', fn: g => ({social:5,mood:5}) },
            { label:'我不喜欢早茶', hint:'-👥', fn: g => ({social:-5,mood:-3}) },
          ]},
      ]},
    chengdu: { name: '成都', rent: 2200, cost: 0.9, house: 25000, trait: '蓉城', meme: '"成都——一座来了就不想走的城市。前提是你能忍受内卷。"',
      events: [
        { id:'chengdu_laidback', icon:'🍵', title:'成都慢生活', body:'你在成都工作，发现这里的人真的不急。\n\n同事说："急什么，先喝杯茶。"老板说："今天早点下班，去打麻将。"外卖小哥说："莫急莫急，马上到。"\n\n你开始理解为什么成都人幸福感全国第一——因为他们真的会生活。\n\n"成都的空气中有一种魔力：让你忘记KPI和deadline。"', cond: g => g.city==='chengdu' && g.mood<60,
          choices:[
            { label:'融入成都生活', hint:'+😊 +❤️', fn: g => ({mood:15,health:8,social:5,charm:3}) },
            { label:'保持节奏不变', hint:'+🧠', fn: g => ({intel:3,mood:5}) },
            { label:'太慢了，我要回北上广', hint:'+💰 -😊', fn: g => ({money:3000,mood:-10}) },
          ]},
      ]},
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
    // === 2025-2026 TRENDING MEMES (v2.1) ===
    { id:'short_video_addiction', icon:'📱', title:'短视频成瘾',
      body:'你打开抖音/快手/B站，本来只想看5分钟，结果一抬头已经凌晨2点了。\n\n你的屏幕使用时间：日均6小时。其中5小时是短视频。\n\n你发誓"再看最后一个就睡觉"，然后这个"最后一个"循环了50次。\n\n"短视频是时间黑洞，你以为你在消磨时间，其实是时间在消磨你。"',
      cond: g => g.mood<55 && g.intel<65,
      choices:[
        { label:'开启青少年模式', hint:'+🧠 +❤️', fn: g => ({intel:8,health:5,mood:3}) },
        { label:'卸载App', hint:'+😊 +🧠', fn: g => ({mood:12,intel:5,charm:3}) },
        { label:'继续刷', hint:'-❤️ -🧠', fn: g => ({health:-5,intel:-3,mood:5}) },
      ]},
    { id:'ai_chatbot', icon:'🤖', title:'AI助手依赖',
      body:'你开始用ChatGPT/文心一言/通义千问写周报、做PPT、回邮件。\n\n效率提升300%，但你发现自己的写作能力下降了。更可怕的是，你开始怀疑：如果AI都能做，我还有什么价值？\n\n"AI不是来取代你的，是来让你思考：你存在的意义是什么。"',
      cond: g => g.job!=='待业中' && g.intel>60 && !g.flags.usedAI,
      choices:[
        { label:'用AI提升效率，专注创造性工作', hint:'+🧠 +💰', fn: g => { g.flags.usedAI=true; return{intel:12,money:3000,mood:8}; }},
        { label:'完全依赖AI', hint:'+💰 -🧠', fn: g => { g.flags.usedAI=true; return{money:5000,intel:-5,mood:5}; }},
        { label:'拒绝AI，保持独立思考', hint:'+✨ +🧠', fn: g => { g.flags.usedAI=true; return{charm:8,intel:8,mood:-3}; }},
      ]},
    { id:'digital_detox', icon:'🌿', title:'数字排毒',
      body:'你在小红书看到一篇帖子："我戒掉手机30天，人生发生了这些变化。"\n\n你心动了。但你看了看自己的屏幕使用时间：日均8小时。\n\n"数字排毒听起来很美，但现代人离开手机3小时就会焦虑。"',
      cond: g => g.intel<70 && g.mood<60,
      choices:[
        { label:'30天不用社交媒体', hint:'+😊 +🧠', fn: g => ({mood:18,intel:10,health:5,social:-8}) },
        { label:'每天限制2小时', hint:'+🧠 +❤️', fn: g => ({intel:8,health:5,mood:8}) },
        { label:'算了，离不开', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'side_project', icon:'💡', title:'副业项目',
      body:'你在GitHub/小红书上看到一个副业教程，声称"月入过万不是梦"。\n\n选项有：做独立开发者、写网文、做知识付费、开淘宝店。\n\n你已经有一个主业了，但你心想：万一副业成了呢？\n\n"副业是打工人的Plan B，但99%的人最后发现：Plan B比Plan A还累。"',
      cond: g => g.job!=='待业中' && g.intel>55 && g.age>=24,
      choices:[
        { label:'做独立开发者', hint:'+🧠 +💰', fn: g => { if(Math.random()>0.5){return{money:8000,intel:10,mood:10,health:-5}}else{return{intel:8,mood:-5,health:-3}} }},
        { label:'写网文', hint:'+✨ 🎲', fn: g => { if(Math.random()>0.6){return{money:5000,charm:12,mood:15}}else{return{mood:-10,health:-3}} }},
        { label:'做知识付费', hint:'+💰 +✨', fn: g => ({money:3000,charm:8,intel:5,mood:5}) },
        { label:'专注主业', hint:'+💰', fn: g => ({money:2000,mood:3}) },
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
    // === AGE-SPECIFIC EVENTS (v2.1) ===
    { id:'midlife_crisis', icon:'🎭', title:'中年危机',
      body:'你40岁了。照镜子时突然发现：发际线后退了3厘米，啤酒肚前进了5厘米。\n\n孩子上初中了，叛逆期比你当年还猛。老婆/老公说你"越来越像你爸了"。\n\n你开始理解为什么中年男人爱钓鱼、爱盘手串、爱看修驴蹄视频——因为那些事情有确定性。\n\n"中年危机不是突然想改变人生，是突然意识到人生已经过半。"',
      cond: g => g.age===40 && !g.flags.midlifeCrisis,
      choices:[
        { label:'买辆摩托车/跑车', hint:'-💰💰 +😊', fn: g => { g.flags.midlifeCrisis=true; return{money:-80000,mood:20,charm:8,health:-3}; }},
        { label:'开始健身', hint:'+❤️ +✨', fn: g => { g.flags.midlifeCrisis=true; return{health:12,charm:10,mood:8,money:-5000}; }},
        { label:'学一门新技能', hint:'+🧠', fn: g => { g.flags.midlifeCrisis=true; return{intel:15,mood:10,money:-3000}; }},
        { label:'接受现实', hint:'+😊', fn: g => { g.flags.midlifeCrisis=true; return{mood:15,intel:5,health:3}; }},
      ]},
    { id:'retirement_planning', icon:'🏖️', title:'退休规划',
      body:'你50岁了，开始认真思考退休。\n\n养老金：每月大概3000-5000（如果还能领到的话）\n存款：看看余额，再算算通胀\n健康：体检报告越来越长\n\n你开始理解为什么老一辈总说"养儿防老"——虽然你知道这年头养儿可能更费钱。\n\n"退休不是终点，是另一个开始。前提是你能活到那时候。"',
      cond: g => g.age>=50 && !g.flags.retirementPlanning,
      choices:[
        { label:'提前退休，享受人生', hint:'-💰💰💰 +😊', fn: g => { g.flags.retirementPlanning=true; return{money:-100000,mood:25,health:8}; }},
        { label:'继续工作，多攒点', hint:'+💰 -❤️', fn: g => { g.flags.retirementPlanning=true; return{money:50000,health:-5,mood:-5}; }},
        { label:'投资理财', hint:'🎲', fn: g => { g.flags.retirementPlanning=true; if(Math.random()>0.4){return{money:30000,intel:8}}else{return{money:-20000,mood:-15}} }},
      ]},
    { id:'empty_nest', icon:'🪹', title:'空巢综合征',
      body:'孩子上大学/工作了，家里突然安静得可怕。\n\n你不用再辅导作业、不用再接送补习班、不用再忍受青春期的叛逆。\n\n但你发现：你已经不习惯两个人（或一个人）的生活了。\n\n你妈当年说的"等你长大我就轻松了"——原来轻松的另一面是空虚。\n\n"空巢不是孩子飞走了，是你发现自己忘了怎么飞。"',
      cond: g => g.flags.hasChild && g.age>=48 && !g.flags.emptyNest,
      choices:[
        { label:'重新找回自己的爱好', hint:'+😊 +✨', fn: g => { g.flags.emptyNest=true; return{mood:15,charm:8,health:5}; }},
        { label:'经常给孩子打电话', hint:'+👥 -😊', fn: g => { g.flags.emptyNest=true; return{social:10,mood:-5}; }},
        { label:'养只宠物', hint:'+😊 -💰', fn: g => { g.flags.emptyNest=true;g.flags.hasPet=true; return{mood:20,money:-3000,health:3}; }},
      ]},
    { id:'health_decline', icon:'🏥', title:'身体大不如前',
      body:'你发现自己：\n- 爬三层楼就喘\n- 熬夜一晚要三天恢复\n- 膝盖开始疼\n- 记忆力下降（钥匙放哪了？）\n\n你开始理解为什么中年人保温杯里泡枸杞——不是矫情，是真的虚了。\n\n"年轻时拿命换钱，中年后拿钱换命。但命不换。"',
      cond: g => g.age>=45 && g.health<60 && !g.flags.healthDecline,
      choices:[
        { label:'全面体检', hint:'-💰 +❤️', fn: g => { g.flags.healthDecline=true; return{money:-8000,health:15,mood:5,intel:3}; }},
        { label:'开始养生', hint:'+❤️ -💰', fn: g => { g.flags.healthDecline=true; return{health:10,mood:5,money:-5000}; }},
        { label:'买保健品', hint:'-💰 🎲', fn: g => { g.flags.healthDecline=true; if(Math.random()>0.5){return{health:5,money:-10000}}else{return{money:-10000,health:-3}} }},
        { label:'硬扛', hint:'-❤️', fn: g => { g.flags.healthDecline=true; return{health:-10,mood:-5}; }},
      ]},
    // === SOCIAL NEWS EVENTS (v2.0) ===
    { id:'unfinished_building', icon:'🏚️', title:'烂尾楼断供',
      body:'你买的期房烂尾了。开发商跑路，楼盘停工，但银行的月供一分不少。\n\n你站在未完工地工地上，看着封顶封顶一半的大楼，欲哭无泪。\n\n房贷15000/月，房子是个壳子，你还得继续还。因为断供会影响征信，你连高铁都坐不了。\n\n"买房的时候说是期房，现在才知道是"期"待落空的房。"',
      cond: g => g.flags.hasHouse && g.age>=28 && !g.flags.unfinishedBuilding && Math.random()>0.5,
      choices:[
        { label:'继续还贷，认栽', hint:'-💰💰', fn: g => { g.flags.unfinishedBuilding=true; return{money:-50000,mood:-25,health:-5}; }},
        { label:'联合业主维权', hint:'🎲', fn: g => { g.flags.unfinishedBuilding=true; if(Math.random()>0.5){return{money:-20000,mood:-10,social:10}}else{return{money:-50000,mood:-30,health:-10}} }},
        { label:'断供！爱谁谁', hint:'-💰 -😊', fn: g => { g.flags.unfinishedBuilding=true;g.flags.creditBlacklist=true; return{money:10000,mood:-20,social:-10}; }},
      ]},
    { id:'p2p_crash', icon:'💣', title:'P2P爆雷',
      body:'你投资的P2P平台跑路了。App打不开，客服电话是空号，"理财顾问"的微信也把你删了。\n\n你投了5万块，年化收益12%。现在本金归零。\n\n你在维权群里认识了一堆和你一样的人——有退休教师、有外卖骑手、有刚毕业的大学生。\n\n"你以为你看中的是利息，人家看中的是你的本金。"',
      cond: g => g.money>30000 && g.age>=25 && !g.flags.p2pCrash,
      choices:[
        { label:'自认倒霉', hint:'-💰', fn: g => { g.flags.p2pCrash=true; return{money:-30000,mood:-15,intel:5}; }},
        { label:'报警维权', hint:'🎲', fn: g => { g.flags.p2pCrash=true; if(Math.random()>0.7){return{money:-10000,mood:-5,social:5}}else{return{money:-30000,mood:-20}} }},
        { label:'以后只存银行', hint:'+🧠', fn: g => { g.flags.p2pCrash=true; return{money:-30000,intel:10,mood:-10}; }},
      ]},
    { id:'education_crackdown', icon:'📚', title:'教培行业巨变',
      body:'"双减"政策来了。整个教培行业一夜清零。\n\n如果你在教育行业：恭喜你，你的行业没了。\n如果你不在：你的朋友小王刚被裁了，他在新东方干了五年。\n\nK12、考研辅导、职业培训……全都摇摇欲坠。\n\n"时代抛弃你的时候，连一声再见都不会说。"',
      cond: g => g.age>=24 && g.age<=35 && !g.flags.educationCrash,
      choices:[
        { label:'转行做公立学校老师', hint:'🎲', fn: g => { g.flags.educationCrash=true; if(g.intel>70&&Math.random()>0.5){setJob(g,'公立学校教师',9000);return{mood:10,social:5}}else{return{mood:-15,money:-5000}} }},
        { label:'转行做其他行业', hint:'+🧠', fn: g => { g.flags.educationCrash=true; return{intel:8,mood:-10,money:-3000}; }},
        { label:'趁机创业做素质教育', hint:'🎲 -💰', fn: g => { g.flags.educationCrash=true;g.flags.entrepreneur=true;setJob(g,'创业者',0); if(Math.random()>0.6){return{money:10000,mood:15}}else{return{money:-15000,mood:-10}} }},
      ]},
    { id:'lockdown', icon:'🔒', title:'疫情来了',
      body:'你所在的城市突发疫情，全员居家办公/封控。\n\n你被困在15平米的出租屋里，冰箱里只有三天的菜。小区门口的大喇叭每天准时响起。\n\n抢菜App秒空，外卖停了，你开始研究怎么用白菜做出一周不重样的菜。\n\n"以前觉得996苦，现在发现能出门就是幸福。"',
      cond: g => !g.flags.hadLockdown && Math.random()>0.6,
      choices:[
        { label:'居家办公，假装正常', hint:'+💰 -😊', fn: g => { g.flags.hadLockdown=true; return{money:2000,mood:-15,health:-5,intel:3}; }},
        { label:'学做饭，修炼内功', hint:'+❤️ +🧠', fn: g => { g.flags.hadLockdown=true; return{health:8,intel:5,mood:5}; }},
        { label:'疯狂囤物资', hint:'-💰 +😊', fn: g => { g.flags.hadLockdown=true; return{money:-3000,mood:5,health:3}; }},
        { label:'做社区志愿者', hint:'+👥 +✨', fn: g => { g.flags.hadLockdown=true; return{social:15,charm:8,mood:10,health:-3}; }},
      ]},
    { id:'take_off_gown', icon:'🎓', title:'脱下长衫',
      body:'"孔乙己是站着喝酒而穿长衫的唯一的人。"\n\n你在网上看到这句话，突然觉得被击中了。你是985/211毕业，但你找不到匹配学历的工作。\n\n送外卖？拉不下脸。进工厂？不甘心。考公？千军万马过独木桥。\n\n"学历是孔乙己的长衫，脱不下也穿不起。"\n\n但也许，脱下长衫才是真正的自由。',
      cond: g => (g.background==='cs'||g.background==='liberal'||g.background==='town'||g.background==='returnee') && g.jobSalary<8000 && !g.flags.tookOffGown,
      choices:[
        { label:'脱下长衫，先活下来', hint:'+💰 +😊', fn: g => { g.flags.tookOffGown=true; setJob(g,'灵活就业者',6500); return{mood:10,charm:5,health:3}; }},
        { label:'继续考公/考研', hint:'-💰 🎲', fn: g => { if(g.intel>75&&Math.random()>0.6){g.flags.civilServant=true;setJob(g,'公务员',8500);return{mood:25}}else{return{mood:-15,money:-5000,intel:5}} }},
        { label:'做自媒体记录经历', hint:'+✨ 🎲', fn: g => { if(Math.random()>0.5){g.flags.influencer=true;return{charm:10,mood:15,money:5000}}else{return{charm:3,mood:-5}} }},
      ]},
    { id:'ai_replace', icon:'🤖', title:'AI来了',
      body:'ChatGPT火了。你的同事开始用AI写代码、做PPT、写方案。\n\n老板在群里发了篇文章：《AI时代，这5种岗位将被取代》。你的岗位赫然在列。\n\n你开始焦虑：如果AI能做你的工作，你存在的意义是什么？\n\n"以前担心被同事卷，现在担心被机器卷。机器不要工资、不请假、不摸鱼。"',
      cond: g => g.job!=='待业中' && g.age>=23 && g.age<=40 && !g.flags.aiAnxiety,
      choices:[
        { label:'学AI，打不过就加入', hint:'+🧠 +💰', fn: g => { g.flags.aiAnxiety=true; return{intel:12,mood:5,money:-2000}; }},
        { label:'转行做AI做不了的事', hint:'🎲', fn: g => { g.flags.aiAnxiety=true; if(Math.random()>0.4){return{mood:10,charm:5,social:5}}else{return{mood:-15,money:-5000}} }},
        { label:'焦虑但什么都不做', hint:'-😊', fn: g => { g.flags.aiAnxiety=true; return{mood:-15,health:-5}; }},
        { label:'发条朋友圈吐槽', hint:'+✨', fn: g => { g.flags.aiAnxiety=true; return{charm:5,mood:5,social:3}; }},
      ]},
    { id:'consumption_downgrade', icon:'📉', title:'消费降级',
      body:'你开始精打细算了。\n\n以前：星巴克 → 现在：瑞幸9.9\n以前：优衣库 → 现在：拼多多\n以前：日料 → 现在：沙县小吃\n以前：打车 → 现在：共享单车\n\n你发现：消费降级后，生活质量好像也没差多少。\n\n"不是消费降级，是消费觉醒。（其实就是穷。）"',
      cond: g => g.money<20000 && g.months>12,
      choices:[
        { label:'拥抱极简生活', hint:'+💰 +😊', fn: g => ({money:3000,mood:10,intel:5}) },
        { label:'记账省钱', hint:'+💰 +🧠', fn: g => ({money:2000,intel:3,mood:-3}) },
        { label:'偶尔奢侈一次', hint:'-💰 +😊', fn: g => ({money:-2000,mood:15,charm:3}) },
      ]},
    { id:'civil_exam_fever', icon:'🔥', title:'考公考编热',
      body:'今年的国考报名人数又创新高：300万人报名，平均竞争比1:70。\n\n你朋友圈一半的人在备考公务员。有人说："宇宙的尽头是考公。"\n\n你妈又打电话来了："你表哥考上公务员了，你呢？"\n\n但你听说很多地方公务员也在降薪……\n\n"铁饭碗？现在哪有什么铁饭碗，不过是不锈钢碗罢了。"',
      cond: g => g.age>=22 && g.age<=35 && !g.flags.civilServant,
      choices:[
        { label:'加入考公大军', hint:'🎲 -💰', fn: g => { if(g.intel>72&&Math.random()>0.65){g.flags.civilServant=true;setJob(g,'公务员',8500);return{mood:25,social:10,money:-5000}}else{return{mood:-15,money:-5000,health:-5,intel:5}} }},
        { label:'考公不如搞钱', hint:'+💰', fn: g => ({money:3000,mood:5}) },
        { label:'做自由职业', hint:'+😊 +✨', fn: g => ({mood:10,charm:3,intel:3}) },
      ]},
    { id:'scam', icon:'🎭', title:'电信诈骗',
      body:'你接到一个电话："您好，我是XX公安局的，您的银行卡涉嫌洗钱……"\n\n你差点信了。直到对方说："请把资金转到安全账户。"\n\n你挂了电话，但你同事小李就没这么幸运了——他被骗了8万块。\n\n"国家反诈中心App：你下载了吗？"\n\n你默默打开了App Store。',
      cond: g => g.money>10000 && !g.flags.hadScam,
      choices:[
        { label:'差点上当，下载反诈App', hint:'+🧠', fn: g => { g.flags.hadScam=true; return{intel:8,mood:-5}; }},
        { label:'被骗了一笔', hint:'-💰💰', fn: g => { g.flags.hadScam=true; const loss=Math.min(Math.floor(g.money*0.3),30000); return{money:-loss,mood:-25,health:-5}; }},
        { label:'识破骗局，反手举报', hint:'+🧠 +✨', fn: g => { g.flags.hadScam=true; return{intel:5,charm:5,mood:10}; }},
      ]},
    { id:'bride_price', icon:'💍', title:'天价彩礼',
      body:'你到了谈婚论嫁的年纪。对方家庭开口：彩礼28.8万，三金5万，房子加名。\n\n你算了算自己的存款，又看了看房价，突然理解了为什么年轻人不想结婚。\n\n"婚姻不是两个人的事，是两个家庭的事。而两个家庭的事，最后都是钱的事。"\n\n你对象的妈妈说："不是我们现实，是这社会太现实。"',
      cond: g => g.age>=26 && g.flags.hasPartner && !g.flags.married && !g.flags.bridePrice,
      choices:[
        { label:'咬牙凑齐', hint:'-💰💰💰 +😊', fn: g => { g.flags.bridePrice=true;g.flags.married=true; return{money:-200000,mood:10,social:10,health:-5}; }},
        { label:'谈判降价', hint:'🎲', fn: g => { g.flags.bridePrice=true; if(Math.random()>0.4){g.flags.married=true;return{money:-50000,mood:15,social:5}}else{g.flags.hasPartner=false;return{mood:-25,social:-10}} }},
        { label:'不结了', hint:'+😊 -👥', fn: g => { g.flags.bridePrice=true;g.flags.hasPartner=false; return{mood:10,social:-15,charm:3}; }},
      ]},
    { id:'quiet_quitting', icon:'😐', title:'精神离职',
      body:'你决定"精神离职"——准点上下班，不卷不抢，做好分内事。\n\n领导说："你最近怎么不加班了？"\n你说："我的工作已经完成了。"\n\n领导欲言又止。你在心里说："你给多少钱我干多少活，这叫等价交换。"\n\n"精神离职不是摆烂，是拒绝被PUA。"\n\n你在小红书上发了条帖子："打工人的觉醒，从不加班开始。"获得1万赞。',
      cond: g => g.job!=='待业中' && g.mood<50 && g.months>12,
      choices:[
        { label:'彻底精神离职', hint:'+😊 +❤️', fn: g => ({mood:15,health:8,money:-2000,charm:5}) },
        { label:'偷偷搞副业', hint:'+💰 -❤️', fn: g => ({money:5000,health:-5,mood:5,intel:3}) },
        { label:'还是卷起来吧', hint:'-😊 +💰', fn: g => ({mood:-10,money:3000,health:-5}) },
      ]},
    { id:'digital_addiction', icon:'📺', title:'电子榨菜成瘾',
      body:'你吃饭时必须看视频，否则饭都不香了。\n\n一集综艺30分钟，你吃了45分钟的饭。一部剧60集，你一周刷完了。\n\n你打开屏幕使用时间：日均8小时。你清醒的时间减去上班，基本都在刷手机。\n\n"电子榨菜是当代年轻人的精神鸦片——但比鸦片便宜多了。"',
      cond: g => g.mood<55 && g.intel<60,
      choices:[
        { label:'数字排毒一周', hint:'+😊 +🧠', fn: g => ({mood:12,intel:8,health:5,charm:3}) },
        { label:'限制使用时间', hint:'+🧠', fn: g => ({intel:5,mood:5,health:3}) },
        { label:'听播客代替', hint:'+🧠 +😊', fn: g => ({intel:8,mood:5}) },
        { label:'继续刷', hint:'-❤️', fn: g => ({mood:3,health:-5,intel:-3}) },
      ]},
    { id:'delayed_retirement', icon:'👴', title:'延迟退休',
      body:'新闻说延迟退休要来了。男性65岁，女性60岁。\n\n你算了算：你要工作到65岁。你已经上了4年班。还剩39年。\n\n你看了看你的颈椎、腰椎、膝盖和发际线：它们不确定能撑到那时候。\n\n"35岁嫌你老，65岁才让你退休。中间30年你干嘛？——送外卖。"\n\n你在微博上发了个"微笑"表情。',
      cond: g => g.age>=28 && g.age<=45 && !g.flags.delayedRetirement,
      choices:[
        { label:'接受现实，养生续命', hint:'+❤️ +🧠', fn: g => { g.flags.delayedRetirement=true; return{health:5,intel:5,mood:-5}; }},
        { label:'提前FIRE！', hint:'-💰 +😊', fn: g => { g.flags.delayedRetirement=true; return{money:-10000,mood:15,charm:5}; }},
        { label:'发个帖子吐槽', hint:'+✨', fn: g => { g.flags.delayedRetirement=true; return{charm:5,mood:5,social:5}; }},
      ]},
    { id:'flexible_work', icon:'🛒', title:'灵活就业',
      body:'你下载了灵活就业平台。选项有：外卖骑手、代驾、家政保洁、快递分拣、直播间场控。\n\n"灵活就业"——多么优雅的词汇，把"没有正式工作"说得如此体面。\n\n但你发现，灵活是真的灵活：想干就干，不想干……也得干，因为要交房租。\n\n"灵活就业的自由，是不得不自由的自由。"',
      cond: g => g.job==='待业中' && g.months>3,
      choices:[
        { label:'全职做灵活就业', hint:'+💰 -❤️', fn: g => { setJob(g,'灵活就业者',7500); return{health:-5,mood:-5,social:3}; }},
        { label:'兼职做，边找工作', hint:'+💰 +🧠', fn: g => ({money:3000,intel:3,health:-3}) },
        { label:'继续找正式工作', hint:'+🧠', fn: g => ({intel:5,mood:-5}) },
      ]},
    { id:'live_stream_fail', icon:'📡', title:'直播翻车',
      body:'你被朋友拉去做直播带货。你以为很简单——对着镜头说"家人们，3、2、1，上链接"就行了。\n\n结果：直播间只有3个人（其中2个是你的小号），说了2小时卖了1单，还退货了。\n\n更惨的是你的"家人们"截图发到了朋友圈。\n\n"别人直播是印钞机，你直播是碎钞机。"',
      cond: g => (g.flags.influencer || g.flags.sideHustle==='media') && !g.flags.liveStreamFail,
      choices:[
        { label:'坚持做，总会好的', hint:'-💰 🎲', fn: g => { g.flags.liveStreamFail=true; if(Math.random()>0.6){return{money:8000,charm:8,mood:15}}else{return{money:-5000,mood:-10,health:-3}} }},
        { label:'算了，不是这块料', hint:'+😊', fn: g => { g.flags.liveStreamFail=true; return{mood:10,intel:3}; }},
        { label:'转型做知识类内容', hint:'+🧠 +✨', fn: g => { g.flags.liveStreamFail=true; return{intel:8,charm:5,mood:5}; }},
      ]},
    { id:'housing_crash', icon:'📊', title:'房价暴跌',
      body:'房价跌了。你所在的小区均价从6万跌到了4万。\n\n如果你已经买了房：你的房子亏了200万，但房贷还是按照原价还。\n\n如果你没买：恭喜你，但你可能更买不起了——因为银行收紧了贷款。\n\n"涨的时候你买不起，跌的时候你还是买不起。这就是房地产。"',
      cond: g => g.age>=27 && !g.flags.housingCrash,
      choices:[
        { label:'硬扛/抄底（看情况）', hint:'🎲', fn: g => { g.flags.housingCrash=true; if(g.flags.hasHouse){return{mood:-20,health:-5}}else{g.flags.hasHouse=true;return{money:-60000,mood:15}} }},
        { label:'割肉/继续等', hint:'+🧠', fn: g => { g.flags.housingCrash=true; if(g.flags.hasHouse){g.flags.hasHouse=false;return{money:-200000,mood:-15}}else{return{intel:5,mood:5}} }},
        { label:'跟我没关系（躺平）', hint:'+😊', fn: g => { g.flags.housingCrash=true; return{mood:8}; }},
      ]},
    { id:'involution', icon:'🌀', title:'内卷vs躺平',
      body:'你在网上看到两派争论：\n\n内卷派："你不努力，别人凭什么把机会给你？"\n躺平派："努力了也不一定有回报，不如躺平。"\n\n你想了想自己的处境：996但看不到上升通道，想躺又躺不平——因为房贷、车贷、花呗不让你躺。\n\n"卷又卷不赢，躺又躺不平。45度角仰望天花板，是当代年轻人最真实的姿态。"',
      cond: g => g.age>=23 && g.age<=35 && g.months>12,
      choices:[
        { label:'继续卷！', hint:'+💰 -❤️', fn: g => ({money:3000,health:-10,mood:-8,intel:5}) },
        { label:'躺平！', hint:'+❤️ +😊 -💰', fn: g => ({health:10,mood:15,money:-3000,charm:3}) },
        { label:'45度角——边卷边躺', hint:'+🧠', fn: g => ({intel:8,mood:5,health:3}) },
        { label:'润！（换赛道）', hint:'🎲', fn: g => { if(Math.random()>0.5){return{mood:20,charm:8,money:5000}}else{return{mood:-10,money:-5000}} }},
      ]},
    { id:'online_loan', icon:'🕳️', title:'网贷陷阱',
      body:'你在某App上看到一个借款广告："最高可借20万，日息低至0.03%。"\n\n日息0.03%听起来很低？年化利率10.95%。加上各种手续费、服务费，实际利率可能超过20%。\n\n你已经借了3万，拆东墙补西墙。\n\n"网贷就像毒品，借第一口的时候你以为自己能控制，最后发现自己被控制了。"',
      cond: g => g.money<-5000 && !g.flags.onlineLoan,
      choices:[
        { label:'以贷养贷（危险！）', hint:'-💰💰', fn: g => { g.flags.onlineLoan=true; return{money:10000,mood:-20,health:-10}; }},
        { label:'跟家人坦白', hint:'+😊 -✨', fn: g => { g.flags.onlineLoan=true; return{money:15000,mood:10,charm:-5,social:5}; }},
        { label:'找正规银行贷款周转', hint:'+🧠', fn: g => { g.flags.onlineLoan=true; return{money:8000,intel:5,mood:-5}; }},
        { label:'死扛，自己还', hint:'-❤️', fn: g => { g.flags.onlineLoan=true; return{health:-10,mood:-15,money:3000}; }},
      ]},
    // ===== v2.4: INVESTMENT & FINANCE =====
    { id:'stock_market', icon:'📈', title:'股市风云',
      body:'同事说最近股市大涨，他买的某只股票已经翻倍了。\n\n你看着自己的余额宝，年化2.5%，再看看股市——日涨3%。\n\n"不炒股的人，永远不懂什么叫\"一觉醒来财务自由\"——或者\"一觉醒来倾家荡产\"。"',
      cond: g => g.age>=24 && !g.flags.invested && g.money>5000,
      choices:[
        { label:'入场！梭哈！', hint:'🎲🎲', fn: g => { g.flags.invested=true; g.flags.stockAmount=Math.floor(g.money*0.5); g.money-=g.flags.stockAmount; if(Math.random()>0.5){const gain=Math.floor(g.flags.stockAmount*(0.3+Math.random()*0.7));g.money+=g.flags.stockAmount+gain;return{money:gain,mood:20,intel:3}}else{const loss=Math.floor(g.flags.stockAmount*(0.2+Math.random()*0.5));g.money+=g.flags.stockAmount-loss;return{money:-loss,mood:-20,health:-5}} }},
        { label:'先学点基础知识', hint:'+🧠', fn: g => { g.flags.invested=true; return{intel:10,mood:5}; }},
        { label:'不碰，稳健理财', hint:'+🧠', fn: g => ({intel:5,mood:8}) },
      ]},
    { id:'crypto_craze', icon:'₿', title:'币圈一夜暴富？',
      body:'你的大学同学小王在群里晒截图：他买的某币涨了100倍。\n\n"当初1万块买的，现在值100万。早知道我就……"\n\n你心动了。但你又看到新闻：有人炒币亏了几百万，跳楼了。\n\n"币圈一天，人间一年。这是赌场还是未来？"',
      cond: g => g.age>=25 && g.age<=40 && !g.flags.crypto && g.intel>50,
      choices:[
        { label:'冲！All in！', hint:'🎲🎲🎲', fn: g => { g.flags.crypto=true; const bet=Math.min(20000,g.money); g.money-=bet; if(Math.random()>0.7){const win=bet*(3+Math.random()*7);g.money+=win;return{money:win-bet,mood:30,charm:5}}else if(Math.random()>0.5){g.money+=bet*0.3;return{money:-bet*0.7,mood:-25,health:-8}}else{g.money+=Math.floor(bet*0.1);return{money:-bet*0.9,mood:-35,health:-15}} }},
        { label:'只买一点点试试', hint:'🎲', fn: g => { g.flags.crypto=true; const bet=Math.min(3000,g.money); g.money-=bet; if(Math.random()>0.5){g.money+=bet*2;return{money:bet,mood:15,intel:5}}else{g.money+=Math.floor(bet*0.2);return{money:-bet*0.8,mood:-15}} }},
        { label:'这是赌博，不碰', hint:'+🧠', fn: g => ({intel:8,mood:5}) },
      ]},
    { id:'p2p_explosion', icon:'💥', title:'P2P暴雷',
      body:'你投资的P2P平台突然跑路了。App打不开，客服电话空号，办公室人去楼空。\n\n你投进去的8万块，血本无归。\n\n维权群里有人说："早就知道是骗局，就是觉得自己不会是最后一个。"\n\n"你看中的是利息，人家看中的是你的本金。"',
      cond: g => g.flags.invested && !g.flags.p2pLoss && g.age>=28,
      choices:[
        { label:'加入维权群', hint:'+👥 -😊', fn: g => { g.flags.p2pLoss=true; return{mood:-25,social:8,money:-8000}; }},
        { label:'认栽，花钱买教训', hint:'+🧠', fn: g => { g.flags.p2pLoss=true; return{intel:15,mood:-20,money:-8000}; }},
        { label:'报警', hint:'+🧠', fn: g => { g.flags.p2pLoss=true; return{intel:5,mood:-15,money:-6000}; }},
      ]},
    { id:'fund_investment', icon:'📊', title:'基金定投',
      body:'你的理财顾问（其实是银行App推送）建议你做基金定投：\n\n"每月自动扣款2000元，长期投资，分散风险。"\n\n听起来很靠谱。但你又看到评论区：\n\n"定投三年，亏了30%。""基金经理跑路了。""还不如存余额宝。"\n\n"你以为你在理财，其实财在理你。"',
      cond: g => g.age>=26 && g.money>10000 && !g.flags.fundInvest,
      choices:[
        { label:'开始定投', hint:'🎲 +💰', fn: g => { g.flags.fundInvest=true; if(Math.random()>0.4){return{money:5000,mood:10,intel:8}}else{return{money:-3000,mood:-10,intel:5}} }},
        { label:'先观察一段时间', hint:'+🧠', fn: g => ({intel:5,mood:3}) },
        { label:'不信任金融产品', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    // ===== v2.4: RELATIONSHIPS =====
    { id:'dating_app', icon:'📱', title:'探探/Tinder',
      body:'你下载了一个交友App。左滑、右滑、左滑、右滑……\n\n你发现：\n- 80%的人头像都用了美颜\n- 70%的人简介写着"佛系随缘"\n- 60%的人第一句话是"在吗？"\n- 50%的人聊了三句就消失了\n\n你开始怀疑：这到底是交友App，还是孤独感贩卖机？\n\n"在这个左滑右滑的时代，爱情变成了概率游戏。"',
      cond: g => g.age>=23 && g.age<=35 && !g.flags.married && !g.flags.datingApp,
      choices:[
        { label:'继续刷，总能遇到', hint:'🎲 +✨', fn: g => { g.flags.datingApp=true; if(Math.random()>0.6){g.flags.inRelationship=true;return{mood:20,charm:8,social:10}}else{return{mood:-10,charm:-3,money:-200}} }},
        { label:'算了，卸载', hint:'+😊', fn: g => { g.flags.datingApp=true; return{mood:5,intel:3}; }},
        { label:'花钱开VIP', hint:'-💰 🎲', fn: g => { g.flags.datingApp=true; g.money-=199; if(Math.random()>0.5){g.flags.inRelationship=true;return{mood:15,charm:5,social:8}}else{return{mood:-8,money:-199}} }},
      ]},
    { id:'blind_date', icon:'👥', title:'相亲局',
      body:'你妈又给你安排相亲了。这次的对象是她同事的儿子/女儿：\n\n"人家有房有车，工作稳定，就缺个对象。"\n\n你坐在咖啡厅里，对方问你的第一个问题是：\n\n"你有北京户口吗？"\n\n"相亲市场比人才市场还卷：学历、户口、房产、收入，明码标价。"',
      cond: g => g.age>=26 && !g.flags.married && !g.flags.blindDateFail && g.social>30,
      choices:[
        { label:'认真对待', hint:'🎲 +👥', fn: g => { g.flags.blindDate=true; if(Math.random()>0.5 && !g.flags.inRelationship){g.flags.inRelationship=true;return{mood:15,social:10,charm:5}}else if(g.flags.inRelationship){return{mood:-10,social:-5}}else{return{mood:-5,social:5}} }},
        { label:'应付一下', hint:'+😊', fn: g => { g.flags.blindDate=true; return{mood:-5,social:3}; }},
        { label:'拒绝相亲', hint:'-👥', fn: g => { g.flags.blindDateFail=true; return{mood:10,social:-8}; }},
      ]},
    { id:'marriage_pressure', icon:'💍', title:'催婚风暴',
      body:'过年回家了。七大姑八大姨轮番上阵：\n\n"有对象了吗？""什么时候结婚？""隔壁老王家孩子都会打酱油了。"\n\n你妈说："你再不结婚，我都没脸出门了。"\n\n你爸说："结了婚就稳定了。"\n\n你想说：结婚不是任务，但话到嘴边又咽了回去。\n\n"在中国，结婚不是两个人的事，是两个家庭的事——外加七大姑八大姨的事。"',
      cond: g => g.age>=28 && g.age<=40 && !g.flags.married && !g.flags.marriagePressureHandled,
      choices:[
        { label:'妥协，开始认真找对象', hint:'🎲 +👥', fn: g => { g.flags.marriagePressureHandled=true; if(g.flags.inRelationship && Math.random()>0.3){g.flags.married=true;g.flags.inRelationship=false;return{mood:25,social:15,money:-50000,charm:10}}else{return{mood:-10,social:8}} }},
        { label:'坚持单身主义', hint:'+😊 -👥', fn: g => { g.flags.marriagePressureHandled=true; g.flags.lyingFlat=true; return{mood:15,social:-10,charm:5}; }},
        { label:'租个对象回家', hint:'-💰 🎲', fn: g => { g.flags.marriagePressureHandled=true; g.money-=3000; if(Math.random()>0.7){return{mood:5,social:5}}else{return{mood:-20,social:-15,charm:-10}} }},
      ]},
    { id:'wedding_cost', icon:'💒', title:'天价婚礼',
      body:'你要结婚了。但婚礼预算让你崩溃：\n\n- 婚房装修：20万\n- 婚纱照：2万\n- 婚宴（30桌）：15万\n- 蜜月：3万\n- 三金/五金：5万\n\n总计：45万。你现在的存款是……不敢算。\n\n丈母娘说："没有45万，别想娶我女儿。"\n\n"爱情是无价的，但婚礼是有价目表的。"',
      cond: g => g.flags.married && !g.flags.weddingDone && g.age>=28,
      choices:[
        { label:'办豪华婚礼', hint:'-💰💰 +😊', fn: g => { g.flags.weddingDone=true; return{money:-450000,mood:30,charm:15,social:20}; }},
        { label:'简单办', hint:'-💰 +😊', fn: g => { g.flags.weddingDone=true; return{money:-80000,mood:15,social:5}; }},
        { label:'旅行结婚', hint:'+😊 +✨', fn: g => { g.flags.weddingDone=true; return{money:-50000,mood:25,charm:10}; }},
        { label:'裸婚', hint:'+🧠 -👥', fn: g => { g.flags.weddingDone=true; return{intel:10,social:-10,mood:5}; }},
      ]},
    { id:'having_child', icon:'👶', title:'生不生娃？',
      body:'你结婚了，下一个问题：生孩子吗？\n\n支持派："孩子是爱情的结晶，是人生的完整。"\n反对派："养个孩子要花100万，还要搭上一辈子的时间和精力。"\n\n你看了看银行卡余额，又看了看学区房价格。\n\n"在中国，生孩子不是选择题，是奥数题——算到你怀疑人生。"',
      cond: g => g.flags.married && !g.flags.hasChild && g.age>=28 && g.age<=40,
      choices:[
        { label:'生！', hint:'-💰💰 +😊', fn: g => { g.flags.hasChild=true; return{money:-30000,mood:25,health:-5,charm:5,social:10}; }},
        { label:'先不要，攒钱', hint:'+💰 +😊', fn: g => ({money:10000,mood:5}) },
        { label:'丁克', hint:'+💰 +😊 -👥', fn: g => ({money:15000,mood:10,social:-8}) },
      ]},
    { id:'divorce_crisis', icon:'💔', title:'婚姻危机',
      body:'你和另一半吵架了。这次的导火索是：\n\n- 家务分配不均\n- 孩子教育分歧\n- 婆媳关系\n- 经济压力\n\n或者，只是累了。\n\n你说："我们冷静一下。"对方说："冷静就是冷暴力。"\n\n民政局门口，你犹豫了：进去，还是回去？\n\n"婚姻就像围城，外面的人想进去，里面的人想出来。"',
      cond: g => g.flags.married && g.flags.hasChild && g.mood<40 && !g.flags.divorced,
      choices:[
        { label:'离婚', hint:'+😊 -💰 -👥', fn: g => { g.flags.divorced=true; g.flags.married=false; return{mood:15,money:-100000,social:-15,health:-5}; }},
        { label:'为了孩子忍忍', hint:'-😊', fn: g => ({mood:-15,health:-5,social:5}) },
        { label:'去做婚姻咨询', hint:'-💰 +😊', fn: g => { g.money-=5000; if(Math.random()>0.5){return{mood:20,social:8}}else{return{mood:-5}} }},
      ]},
    // ===== v2.4: 2025-2026 CULTURAL EVENTS =====
    { id:'ai_job_replacement', icon:'🤖', title:'AI来了，你的工作还在吗？',
      body:'公司引进了AI工具，你的同事被裁了一半。\n\n老板说："AI效率是人的10倍，成本是1/10。"\n\n你的工作是：写代码/写文案/做设计/做客服——这些AI都能做。\n\n你看着ChatGPT生成的方案，比你的还专业。\n\n"工业革命淘汰了马车夫，AI革命会淘汰谁？也许就是你。"',
      cond: g => g.age>=24 && g.age<=45 && !g.flags.aiReplaced && g.intel>50,
      choices:[
        { label:'学习AI，成为AI工程师', hint:'+🧠 +💰', fn: g => { g.flags.aiAnxiety=true; if(g.intel>70){return{intel:15,money:10000,mood:10}}else{return{intel:10,mood:-5,money:3000}} }},
        { label:'转型做AI替代不了的工作', hint:'🎲', fn: g => { g.flags.aiReplaced=true; if(Math.random()>0.5){setJob(g,'技术工人',8000);return{mood:5,health:5}}else{setJob(g,'待业中',0);return{mood:-20}} }},
        { label:'躺平，爱咋咋地', hint:'+😊 -💰', fn: g => { g.flags.lyingFlat=true; g.flags.aiReplaced=true; setJob(g,'待业中',0); return{mood:15,money:-5000}; }},
      ]},
    { id:'lying_flat_movement', icon:'🛋️', title:'躺平还是内卷？（终极版）',
      body:'你在网上看到一个帖子："我25岁，月入3万，但我选择了辞职躺平。"\n\n评论区炸了：\n\n"有钱人的躺平叫gap year，穷人的躺平叫失业。"\n"你不卷，有的是人替你卷。"\n"人生不是赛道，是旷野。"\n\n你看了看自己的工位，又看了看窗外。你想：也许生活不只有KPI和房贷。\n\n"躺平不是放弃，是选择另一种活法。但前提是——你躺得起。"',
      cond: g => g.age>=23 && g.age<=32 && g.months>18 && !g.flags.lyingFlatChoice,
      choices:[
        { label:'辞职gap year', hint:'-💰 +😊 +❤️', fn: g => { g.flags.lyingFlatChoice=true; g.flags.lyingFlat=true; setJob(g,'待业中',0); return{mood:25,health:15,money:-10000,charm:8}; }},
        { label:'边工作边找生活', hint:'+🧠', fn: g => { g.flags.lyingFlatChoice=true; return{intel:10,mood:8,health:5}; }},
        { label:'继续卷，不敢停', hint:'+💰 -❤️', fn: g => { g.flags.lyingFlatChoice=true; return{money:5000,health:-8,mood:-10}; }},
      ]},
    { id:'consumer_downgrade', icon:'📉', title:'消费降级',
      body:'你开始消费降级了：\n\n- 星巴克 → 瑞幸 → 自己冲咖啡\n- 海底捞 → 呷哺呷哺 → 自己煮火锅\n- 优衣库 → 拼多多 → 穿旧衣服\n- 打车 → 地铁 → 骑共享单车\n\n你发现：其实也没那么难受。甚至有点爽。\n\n"消费主义最大的骗局是：让你以为你需要。"\n\n你开始理解：极简生活不是没钱，是看透。',
      cond: g => g.age>=25 && g.money<20000 && !g.flags.minimalist,
      choices:[
        { label:'彻底极简', hint:'+💰 +🧠', fn: g => { g.flags.minimalist=true; return{money:8000,intel:10,mood:10,charm:5}; }},
        { label:'该省省该花花', hint:'+😊', fn: g => ({money:3000,mood:8}) },
        { label:'降级但不降质', hint:'+🧠 +✨', fn: g => ({intel:8,charm:5,mood:5,money:5000}) },
      ]},
    { id:'remote_work', icon:'🏠', title:'远程办公时代',
      body:'你的公司开始实行混合办公：每周三天在家，两天在公司。\n\n你发现：\n- 在家工作效率更高（因为没人打扰）\n- 通勤时间省下来可以健身/学习/睡觉\n- 但你也更孤独了\n\n"远程办公让打工人获得了自由，也失去了同事。"\n\n你开始思考：工作的意义到底是什么？',
      cond: g => g.age>=24 && g.age<=40 && g.job!=='待业中' && !g.flags.remoteWork,
      choices:[
        { label:'享受远程办公', hint:'+😊 +❤️', fn: g => { g.flags.remoteWork=true; return{mood:15,health:8,intel:5,money:2000}; }},
        { label:'还是喜欢去公司', hint:'+👥', fn: g => { g.flags.remoteWork=true; return{social:10,mood:5}; }},
        { label:'趁机搞副业', hint:'+💰 -❤️', fn: g => { g.flags.remoteWork=true; g.flags.sideHustle='remote'; return{money:6000,health:-5,mood:5}; }},
      ]},
    { id:'mental_health_awakening', icon:'🧠', title:'心理健康觉醒',
      body:'你开始关注心理健康了。\n\n也许是朋友圈里有人发了心理咨询的截图，也许是新闻里又有年轻人自杀的消息。\n\n你第一次意识到：原来"不开心"不是矫情，是病。\n\n你下载了一个冥想App，开始每天练习10分钟。\n\n"承认自己需要帮助，是勇敢的第一步。"',
      cond: g => g.mood<50 && g.age>=25 && !g.flags.mentalHealthAware,
      choices:[
        { label:'去做心理咨询', hint:'-💰 +😊 +🧠', fn: g => { g.flags.mentalHealthAware=true; g.money-=3000; return{mood:25,intel:8,health:5}; }},
        { label:'自己调整', hint:'+😊', fn: g => { g.flags.mentalHealthAware=true; return{mood:15,health:5}; }},
        { label:'算了，我没事', hint:'-😊', fn: g => ({mood:-10}) },
      ]},
    { id:'aging_parents', icon:'👴', title:'父母养老',
      body:'你爸打电话来："你妈最近身体不太好，你有空回来看看。"\n\n你查了查老家的养老院：便宜的3000/月，好的8000/月。你在外地的房子还没着落，父母怎么办？\n\n"80后90后的困境：上有老下有小，中间还有房贷和996。"\n\n你站在人生的十字路口：回老家陪父母，还是留在大城市赚钱？',
      cond: g => g.age>=32 && !g.flags.parentsHandled && g.social>40,
      choices:[
        { label:'接父母来大城市', hint:'-💰💰 +😊', fn: g => { g.flags.parentsHandled=true; return{money:-50000,mood:20,social:10,health:5}; }},
        { label:'给父母买商业保险', hint:'-💰 +🧠', fn: g => { g.flags.parentsHandled=true; return{money:-20000,intel:5,mood:10}; }},
        { label:'多打电话，定期回家', hint:'+😊 +👥', fn: g => { g.flags.parentsHandled=true; return{mood:10,social:8}; }},
        { label:'先顾好自己', hint:'-😊', fn: g => { g.flags.parentsHandled=true; return{mood:-15,social:-5}; }},
      ]},
    { id:'middle_age_crisis', icon:'🔄', title:'中年危机',
      body:'你35岁了。\n\n- 职场上：比你年轻的人更便宜更能加班\n- 身体上：体检报告一年比一年厚\n- 财务上：房贷、车贷、孩子教育、父母养老\n- 心理上：开始怀疑人生的意义\n\n你看着镜子里的自己：头发少了，肚子大了，眼睛里的光没了。\n\n"35岁，是中国职场的\"保质期\"。过了这个年纪，你就是\"前浪\"。"',
      cond: g => g.age===35 && !g.flags.midlifeCrisisHandled,
      choices:[
        { label:'转型做管理', hint:'+🧠 +💰', fn: g => { g.flags.midlifeCrisisHandled=true; if(g.intel>70 && g.social>50){return{intel:10,money:15000,mood:10}}else{return{intel:5,mood:-10}} }},
        { label:'创业', hint:'🎲🎲', fn: g => { g.flags.midlifeCrisisHandled=true; g.flags.entrepreneur=true; setJob(g,'创业者',0); if(Math.random()>0.6){return{money:-30000,mood:15,social:10}}else{return{money:-50000,mood:-25}} }},
        { label:'接受现实，继续打工', hint:'+😊', fn: g => { g.flags.midlifeCrisisHandled=true; return{mood:5,health:5}; }},
        { label:'提前退休，回老家', hint:'+❤️ +😊 -💰', fn: g => { g.flags.midlifeCrisisHandled=true; g.flags.lyingFlat=true; setJob(g,'待业中',0); return{health:20,mood:20,money:-20000,social:-10}; }},
      ]},
    { id:'friendship_fade', icon:'👥', title:'渐行渐远的朋友',
      body:'你翻看微信通讯录，发现有2000个好友，但能打电话聊天的不超过5个。\n\n大学室友结婚了，同事跳槽了，老朋友回老家了。你的社交圈越来越小。\n\n"成年人的友谊，不是渐行渐远，就是渐行渐远。"\n\n你发了条朋友圈，只有3个赞。其中一个是你妈。',
      cond: g => g.age>=28 && g.social<40 && !g.flags.friendshipFade,
      choices:[
        { label:'主动联系老朋友', hint:'+👥 +😊', fn: g => { g.flags.friendshipFade=true; return{social:15,mood:15}; }},
        { label:'结交新朋友', hint:'+👥', fn: g => { g.flags.friendshipFade=true; return{social:10,charm:5}; }},
        { label:'享受独处', hint:'+🧠', fn: g => { g.flags.friendshipFade=true; return{intel:8,mood:5}; }},
      ]},
    { id:'pet_companion', icon:'🐱', title:'养个宠物？',
      body:'你路过宠物店，看到一只橘猫在橱窗里打盹。\n\n你心想：在这个城市，也许我需要的不是伴侣，而是一个不会评判你的毛茸茸的朋友。\n\n但你又想到：\n- 猫粮/狗粮：每月500-1000\n- 疫苗/驱虫：每年1000-2000\n- 绝育手术：2000-3000\n- 生病看病：3000-10000\n\n"养宠物就像养孩子，只不过这个孩子永远长不大——而且不会跟你要学区房。"',
      cond: g => g.age>=25 && g.age<=45 && !g.flags.hasPet && g.money>8000,
      choices:[
        { label:'养猫', hint:'-💰 +😊 +❤️', fn: g => { g.flags.hasPet=true; return{money:-5000,mood:20,health:5,charm:5}; }},
        { label:'养狗', hint:'-💰 +😊 +❤️', fn: g => { g.flags.hasPet=true; return{money:-6000,mood:18,health:8,social:5}; }},
        { label:'云养宠', hint:'+😊', fn: g => ({mood:8}) },
        { label:'养不起自己', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'education_upgrade', icon:'🎓', title:'学历提升',
      body:'你在职场遇到了瓶颈：学历成了天花板。\n\n选项：\n- 在职MBA：20万，2年\n- 非全日制硕士：10万，3年\n- 考证（CPA/CFA/PMP）：3-5万，1-2年\n- 在线课程：几千块，随时学\n\n"学历不代表能力，但HR只看学历。"\n\n你开始计算：投入产出比到底值不值？',
      cond: g => g.age>=25 && g.age<=35 && g.intel>60 && !g.flags.educationUpgrade,
      choices:[
        { label:'读MBA', hint:'-💰💰 +🧠 +👥', fn: g => { g.flags.educationUpgrade=true; return{money:-200000,intel:20,social:15,charm:8}; }},
        { label:'考个专业证书', hint:'-💰 +🧠', fn: g => { g.flags.educationUpgrade=true; return{money:-30000,intel:15,mood:10}; }},
        { label:'在线学习', hint:'+🧠', fn: g => { g.flags.educationUpgrade=true; return{intel:10,mood:5}; }},
        { label:'经验比学历重要', hint:'+😊', fn: g => ({mood:8,intel:3}) },
      ]},
    { id:'retirement_planning_2025', icon:'👴', title:'养老金焦虑',
      body:'你看到新闻：2025年养老金缺口达到X万亿。专家说："80后90后可能领不到养老金。"\n\n你算了算：你现在交的养老保险，到你60岁的时候能领多少？\n\n答案是：不知道。因为政策一直在变。\n\n"养老金就像薛定谔的猫：在你退休之前，你永远不知道它还在不在。"',
      cond: g => g.age>=30 && g.age<=45 && !g.flags.retirementPlanning && g.intel>55,
      choices:[
        { label:'自己存养老钱', hint:'+💰 +🧠', fn: g => { g.flags.retirementPlanning=true; return{money:15000,intel:8,mood:5}; }},
        { label:'买商业养老保险', hint:'-💰 +🧠', fn: g => { g.flags.retirementPlanning=true; return{money:-30000,intel:5,mood:8}; }},
        { label:'靠孩子养老', hint:'+😊 -💰', fn: g => { g.flags.retirementPlanning=true; if(g.flags.hasChild){return{mood:10}}else{return{mood:-10}} }},
        { label:'走一步看一步', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    // ===== v2.5: SEASONAL EVENTS =====
    { id:'spring_festival', icon:'🧧', title:'春节回家',
      body:'春节到了，你抢到了回家的火车票（虽然是无座的）。\n\n回到家，你妈的第一句话是："有对象了吗？"\n\n七大姑八大姨轮番上阵：工资多少？买房了吗？什么时候结婚？\n\n你发了条朋友圈："家和万事兴。"配了张全家福，屏蔽了所有同事。\n\n"春节是中国人的信仰：回家，吃饭，被问，微笑，忍住。"',
      cond: g => g.month === 2 && !g.flags.springFestivalThisYear,
      choices:[
        { label:'老实回答所有问题', hint:'-😊 +👥', fn: g => { g.flags.springFestivalThisYear=true; return{mood:-15,social:10,money:-3000}; }},
        { label:'装傻充楞', hint:'+😊', fn: g => { g.flags.springFestivalThisYear=true; return{mood:5,money:-2000}; }},
        { label:'不回家，旅游过年', hint:'+😊 -👥', fn: g => { g.flags.springFestivalThisYear=true; return{mood:20,money:-5000,social:-5}; }},
        { label:'不回家，加班赚钱', hint:'+💰 -😊', fn: g => { g.flags.springFestivalThisYear=true; return{money:8000,mood:-10,health:-5}; }},
      ]},
    { id:'summer_heat', icon:'🔥', title:'高温预警',
      body:'气温40度，你走在上班的路上，感觉自己是一块正在融化的冰淇淋。\n\n办公室的空调坏了，老板说："心静自然凉。"\n\n你看了看外卖App：一杯冰美式要30块，但你觉得这是救命钱。\n\n"大城市的夏天，不是热，是蒸。你不是在上班，是在蒸桑拿。"',
      cond: g => g.month >= 7 && g.month <= 8,
      choices:[
        { label:'买冰美式续命', hint:'-💰 +😊', fn: g => ({money:-30,mood:8,health:-2}) },
        { label:'自带水壶', hint:'+💰', fn: g => ({money:10,health:3}) },
        { label:'请高温假', hint:'🎲', fn: g => { if(Math.random()>0.6){return{mood:15,health:5,money:-1000}}else{return{mood:-10}} }},
      ]},
    { id:'mid_autumn', icon:'🥮', title:'中秋月饼',
      body:'中秋节到了，你收到了公司发的月饼礼盒。\n\n你打开一看：五仁月饼。你看了看朋友圈，别人晒的都是流心月饼、冰皮月饼。\n\n你妈打电话来："月饼收到了吗？好吃吗？"\n\n你说："好吃。"其实你只咬了一口就扔了。\n\n"月饼的意义不在于吃，在于发朋友圈。"',
      cond: g => g.month === 9,
      choices:[
        { label:'发朋友圈晒月饼', hint:'+✨ +👥', fn: g => ({charm:5,social:5,mood:5}) },
        { label:'寄回家给父母', hint:'+😊 +👥', fn: g => ({mood:10,social:8,money:-50}) },
        { label:'自己吃掉', hint:'+😊', fn: g => ({mood:8,health:-2}) },
        { label:'不吃，减肥', hint:'+❤️', fn: g => ({health:3,mood:-3}) },
      ]},
    { id:'winter_loneliness', icon:'❄️', title:'冬至孤独',
      body:'冬至了，你一个人在出租屋里吃速冻饺子。\n\n窗外下着雪，你看着朋友圈：有人在晒火锅，有人在晒滑雪，有人在晒男朋友/女朋友。\n\n你发了条："一个人也要好好过节。"配图是你和速冻饺子的合影。\n\n"大城市的冬天，冷的是天气，孤独的是心。"',
      cond: g => g.month === 12 && g.social < 40,
      choices:[
        { label:'约朋友吃火锅', hint:'+👥 +😊', fn: g => ({social:10,mood:15,money:-200}) },
        { label:'给父母打电话', hint:'+😊 +👥', fn: g => ({mood:10,social:5}) },
        { label:'一个人也挺好', hint:'+🧠', fn: g => ({intel:5,mood:5}) },
        { label:'下载交友App', hint:'🎲 +✨', fn: g => { if(Math.random()>0.6){g.flags.inRelationship=true;return{mood:20,charm:8,social:10}}else{return{mood:-10}} }},
      ]},
    { id:'double_11', icon:'🛒', title:'双十一购物狂欢',
      body:'双十一到了，你的购物车里塞了50件商品，总价2万。\n\n你的理智说："这些都是消费主义陷阱。"\n你的手指说："但真的便宜啊！"\n\n凌晨1点，你开始抢单。1点01分，你抢到了。1点02分，你后悔了。\n\n"双十一的本质是：用省钱的借口，花更多的钱。"',
      cond: g => g.month === 11,
      choices:[
        { label:'清空购物车！', hint:'-💰💰 +😊', fn: g => ({money:-15000,mood:25,charm:8}) },
        { label:'只买必需品', hint:'-💰 +🧠', fn: g => ({money:-2000,mood:10,intel:5}) },
        { label:'什么都不买', hint:'+💰 +🧠', fn: g => ({money:500,intel:8,mood:-5}) },
        { label:'买完再退货', hint:'🎲', fn: g => { if(Math.random()>0.5){return{mood:15,money:-3000}}else{return{mood:-10,money:-8000}} }},
      ]},
    { id:'new_year_resolution', icon:'🎯', title:'新年flag',
      body:'新年第一天，你立了一堆flag：\n\n1. 减肥20斤\n2. 存够10万\n3. 学会一项新技能\n4. 找到对象\n5. 早睡早起\n\n你看了看去年的flag：一条都没完成。\n\n"新年flag的意义不在于实现，在于给自己一个开始的仪式感。"',
      cond: g => g.month === 1,
      choices:[
        { label:'认真执行', hint:'+🧠 +❤️', fn: g => ({intel:10,health:8,mood:10}) },
        { label:'选一个重点做', hint:'+🧠', fn: g => ({intel:8,mood:5}) },
        { label:'算了，年年都一样', hint:'-😊', fn: g => ({mood:-5}) },
        { label:'发朋友圈立flag', hint:'+✨', fn: g => ({charm:5,mood:8}) },
      ]},
    // ===== v2.6: SKILLS & HOBBIES =====
    { id:'gym_membership', icon:'🏋️', title:'健身卡',
      body:'你路过一家健身房，销售小哥拦住你："哥/姐，办张健身卡吧，年卡3000，送私教体验课。"\n\n你看了看自己的肚子，又看了看镜子里的自己。\n\n你想：也许该动起来了。\n\n"健身是成年人世界里，少数付出就有回报的事。"',
      cond: g => g.age>=23 && g.age<=45 && !g.flags.gymMember && g.health<75,
      choices:[
        { label:'办卡！开始健身', hint:'-💰 +❤️ +😊', fn: g => { g.flags.gymMember=true; return{money:-3000,health:15,mood:10,charm:5}; }},
        { label:'先体验一次', hint:'+❤️', fn: g => ({health:5,mood:5}) },
        { label:'算了，我在家做俯卧撑', hint:'+😊', fn: g => ({health:3,mood:3}) },
      ]},
    { id:'reading_habit', icon:'📚', title:'阅读习惯',
      body:'你在豆瓣上看到一份"年度必读书单"：20本书，从《人类简史》到《置身事内》。\n\n你看了看自己的书架：去年买的书，一本都没翻过。\n\n你下载了微信读书，发誓今年要读完10本。\n\n"读书不是为了装，是为了不被骗。"',
      cond: g => g.intel<70 && !g.flags.readingHabit,
      choices:[
        { label:'开始读书', hint:'+🧠 +😊', fn: g => { g.flags.readingHabit=true; return{intel:12,mood:8}; }},
        { label:'买书但不读', hint:'-💰', fn: g => ({money:-500,mood:3}) },
        { label:'听有声书', hint:'+🧠', fn: g => ({intel:8,mood:5}) },
      ]},
    { id:'cooking_skill', icon:'🍳', title:'学做饭',
      body:'你算了笔账：每天外卖60块，一个月1800，一年2万。\n\n你决定学做饭。你在B站看了10个教程，买了锅碗瓢盆，开始做第一顿饭。\n\n结果：厨房差点着火，菜糊了，但你觉得很有成就感。\n\n"做饭是成年人的必修课：省钱、健康、还有发朋友圈的素材。"',
      cond: g => g.age>=24 && !g.flags.cookingSkill && g.money<30000,
      choices:[
        { label:'坚持做饭', hint:'+💰 +❤️ +🧠', fn: g => { g.flags.cookingSkill=true; return{money:5000,health:10,intel:5,mood:8}; }},
        { label:'偶尔做做', hint:'+💰 +❤️', fn: g => ({money:2000,health:5}) },
        { label:'算了，外卖真香', hint:'+😊 -💰', fn: g => ({mood:5,money:-500}) },
      ]},
    { id:'gaming_addiction', icon:'🎮', title:'游戏成瘾',
      body:'你下载了一款新游戏，本来说"就玩半小时"，结果一抬头已经凌晨3点了。\n\n你的作息变成了：上班摸鱼→下班打游戏→熬夜打游戏→第二天上班摸鱼。\n\n你的黑眼圈比熊猫还重，但你的段位从青铜升到了钻石。\n\n"游戏是逃避现实的避风港，但现实不会因为你的逃避而等你。"',
      cond: g => g.age>=22 && g.age<=35 && g.mood<50 && !g.flags.gamingAddiction,
      choices:[
        { label:'继续沉迷', hint:'+😊 -❤️ -💰', fn: g => { g.flags.gamingAddiction=true; return{mood:20,health:-15,money:-2000,intel:-5}; }},
        { label:'控制时间，每天1小时', hint:'+😊 +🧠', fn: g => { g.flags.gamingAddiction=true; return{mood:10,intel:3}; }},
        { label:'卸载游戏', hint:'-😊 +❤️ +🧠', fn: g => ({mood:-15,health:8,intel:5}) },
      ]},
    { id:'photography_hobby', icon:'📷', title:'摄影爱好',
      body:'你看到朋友圈有人发的照片特别好看，一问才知道是用手机拍的。\n\n你心动了：也许你也可以成为"朋友圈摄影大师"。\n\n你看了看银行卡：入门相机5000，好一点的1万，专业级的3万+。\n\n"摄影穷三代，单反毁一生——但你愿意。"',
      cond: g => g.age>=25 && g.age<=40 && !g.flags.photographyHobby && g.charm>40,
      choices:[
        { label:'买专业设备', hint:'-💰💰 +✨ +🧠', fn: g => { g.flags.photographyHobby=true; return{money:-15000,charm:15,intel:8,mood:10}; }},
        { label:'用手机拍', hint:'+✨ +🧠', fn: g => { g.flags.photographyHobby=true; return{charm:8,intel:5,mood:8}; }},
        { label:'先学后期修图', hint:'+🧠 +✨', fn: g => ({intel:8,charm:5,mood:5}) },
      ]},
    { id:'music_learn', icon:'🎸', title:'学乐器',
      body:'你在地铁里看到一个弹吉他的小哥，唱得特别好。你心想：要是我也会弹吉他/钢琴就好了。\n\n你打开淘宝：入门吉他800，电子琴1500，课程另算。\n\n"学乐器不是为了表演，是为了在独处的时候有个朋友。"',
      cond: g => g.age>=22 && g.age<=35 && !g.flags.musicSkill && g.mood>40,
      choices:[
        { label:'学吉他', hint:'-💰 +✨ +😊', fn: g => { g.flags.musicSkill=true; return{money:-2000,charm:10,mood:12,intel:5}; }},
        { label:'学钢琴', hint:'-💰💰 +✨ +😊', fn: g => { g.flags.musicSkill=true; return{money:-5000,charm:12,mood:15,intel:8}; }},
        { label:'算了，听听就好', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    // ===== v2.6: RANDOM LIFE EVENTS =====
    { id:'lottery_win', icon:'🎰', title:'彩票中奖！',
      body:'你随手买了一张彩票，结果——中了！\n\n不是头奖，但也有一万块。你激动得手都在抖。\n\n你开始幻想：要是中了500万该多好？辞职、旅游、买房……\n\n但你知道，彩票中奖的概率比被雷劈还低。这次是运气，下次别想了。\n\n"彩票是穷人的税，但偶尔中一次，真的很爽。"',
      cond: g => !g.flags.lotteryWin && Math.random() > 0.95,
      choices:[
        { label:'存起来', hint:'+💰', fn: g => { g.flags.lotteryWin=true; return{money:10000,mood:15}; }},
        { label:'吃顿好的庆祝', hint:'+😊 +💰', fn: g => { g.flags.lotteryWin=true; return{money:8000,mood:25,health:3}; }},
        { label:'再买100张', hint:'🎲', fn: g => { g.flags.lotteryWin=true; if(Math.random()>0.9){return{money:50000,mood:30}}else{return{money:-500,mood:-5}} }},
      ]},
    { id:'phone_lost', icon:'📱', title:'手机丢了',
      body:'你在地铁上睡着了，醒来发现手机不见了。\n\n你慌了：微信、支付宝、银行卡、照片、通讯录——全在手机里。\n\n你借了路人手机打110，又挂失了所有卡。\n\n"现代人最怕的事不是失业，是手机丢了。"',
      cond: g => !g.flags.phoneLost && Math.random() > 0.92,
      choices:[
        { label:'买新手机', hint:'-💰💰 +😊', fn: g => { g.flags.phoneLost=true; return{money:-5000,mood:10}; }},
        { label:'买二手手机', hint:'-💰', fn: g => { g.flags.phoneLost=true; return{money:-1500,mood:5}; }},
        { label:'先用旧手机', hint:'+😊', fn: g => { g.flags.phoneLost=true; return{mood:-10}; }},
      ]},
    { id:'unexpected_friend', icon:'🤝', title:'意外相遇',
      body:'你在咖啡厅里，旁边的人突然问你："这本书好看吗？"\n\n你们聊了起来，发现兴趣惊人地相似。你们加了微信，约好下次一起去看展。\n\n"大城市的友谊往往始于偶然，终于必然——但这一次，也许不一样。"',
      cond: g => g.social<50 && !g.flags.unexpectedFriend,
      choices:[
        { label:'保持联系', hint:'+👥 +😊', fn: g => { g.flags.unexpectedFriend=true; return{social:15,mood:15}; }},
        { label:'算了，萍水相逢', hint:'+🧠', fn: g => ({intel:3,mood:3}) },
      ]},
    { id:'traffic_accident', icon:'🚗', title:'交通事故',
      body:'你在过马路的时候，被一辆电动车撞了。\n\n不严重，但膝盖肿了，去医院拍了片子。肇事者是个外卖小哥，他哭着说："我赔不起……"\n\n你看着他，想起了自己刚来大城市的样子。\n\n"大城市里，每个人都在赶时间，但安全才是最重要的。"',
      cond: g => !g.flags.trafficAccident && Math.random() > 0.93,
      choices:[
        { label:'算了，不追究', hint:'+😊 +👥', fn: g => { g.flags.trafficAccident=true; return{health:-8,mood:5,social:5}; }},
        { label:'让他赔医药费', hint:'+💰 -😊', fn: g => { g.flags.trafficAccident=true; return{money:500,health:-8,mood:-5}; }},
        { label:'报警处理', hint:'+🧠', fn: g => { g.flags.trafficAccident=true; return{money:1000,health:-8,intel:3}; }},
      ]},
    { id:'viral_moment', icon:'🌟', title:'意外走红',
      body:'你在地铁上随手拍的一段视频，突然在抖音火了：100万播放，1万点赞。\n\n评论区有人说："太真实了！"有人说："这不就是我吗？"\n\n你看着粉丝数从100涨到1万，心跳加速。\n\n"在这个时代，每个人都有15分钟成名的机会——你的15分钟来了。"',
      cond: g => !g.flags.viralMoment && g.charm>50 && Math.random() > 0.9,
      choices:[
        { label:'趁热做自媒体', hint:'+💰 +✨ +👥', fn: g => { g.flags.viralMoment=true; g.flags.influencer=true; return{money:8000,charm:20,social:15,mood:15}; }},
        { label:'保持低调', hint:'+🧠', fn: g => { g.flags.viralMoment=true; return{intel:5,mood:10}; }},
        { label:'接广告赚钱', hint:'+💰 +✨', fn: g => { g.flags.viralMoment=true; return{money:15000,charm:10,mood:10}; }},
      ]},
    { id:'family_emergency', icon:'🚨', title:'家庭急事',
      body:'你妈打电话来，声音很急："你爸住院了，你快回来。"\n\n你查了查机票/高铁：最近的也要6小时。你请了假，买了最近的票。\n\n在医院里，你看着病床上的父亲，突然觉得：自己在大城市拼了这么多年，到底是为了什么？\n\n"家人是你最后的退路，也是你最大的牵挂。"',
      cond: g => g.age>=28 && !g.flags.familyEmergency && g.social>30,
      choices:[
        { label:'请假回家照顾', hint:'-💰 +😊 +👥', fn: g => { g.flags.familyEmergency=true; return{money:-5000,mood:15,social:10,health:5}; }},
        { label:'寄钱回去', hint:'-💰 -😊', fn: g => { g.flags.familyEmergency=true; return{money:-10000,mood:-10}; }},
        { label:'视频慰问', hint:'-😊', fn: g => { g.flags.familyEmergency=true; return{mood:-20,social:-5}; }},
      ]},
    // ===== v2.8: MORE LIFE PATHS =====
    { id:'freelance_offer', icon:'💻', title:'自由职业机会',
      body:'有个客户找到你："我们想请你做这个项目，按项目制收费，一个项目3-5万。"\n\n你算了算：一年接6-8个项目，收入比上班还高，而且自由。\n\n但你又担心：没有五险一金，没有稳定收入，生病了怎么办？\n\n"自由职业的本质是：用不安全感换自由。你愿意吗？"',
      cond: g => g.age>=26 && g.age<=40 && g.intel>60 && !g.flags.freelancer && g.job!=='待业中',
      choices:[
        { label:'辞职做自由职业', hint:'🎲 +💰 +😊', fn: g => { g.flags.freelancer=true; g.flags.sideHustle='freelance'; setJob(g,'自由职业者',0); if(Math.random()>0.4){return{money:20000,mood:20,intel:10}}else{return{money:-5000,mood:-10}} }},
        { label:'兼职接私活', hint:'+💰 -❤️', fn: g => { g.flags.sideHustle='freelance'; return{money:15000,health:-5,mood:5}; }},
        { label:'算了，稳定重要', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'travel_dream', icon:'✈️', title:'环游世界',
      body:'你在网上看到一个数字游民的故事：一边旅行一边工作，一年去了12个国家。\n\n你心动了：也许生活不应该只有KPI和房贷。\n\n你算了算：存款够你旅行半年，但回来之后呢？\n\n"旅行不是逃避，是寻找。但你得想清楚，你在找什么。"',
      cond: g => g.age>=25 && g.age<=35 && g.money>=50000 && !g.flags.worldTravel && g.mood<60,
      choices:[
        { label:'辞职去旅行', hint:'-💰💰 +😊 +✨', fn: g => { g.flags.worldTravel=true; g.flags.lyingFlat=true; setJob(g,'待业中',0); return{money:-40000,mood:30,charm:20,health:10,social:10}; }},
        { label:'先gap year半年', hint:'-💰 +😊 +✨', fn: g => { g.flags.worldTravel=true; setJob(g,'待业中',0); return{money:-25000,mood:25,charm:15,health:8}; }},
        { label:'算了，还是工作重要', hint:'+💰 -😊', fn: g => ({money:3000,mood:-8}) },
      ]},
    { id:'teaching_opportunity', icon:'👨‍🏫', title:'教育培训机会',
      body:'有个培训机构找你："我们想请你做兼职讲师，周末上课，一天2000。"\n\n你觉得挺有意思的：把你的专业知识教给别人，还能赚钱。\n\n但你又担心：你够格吗？你能讲好吗？\n\n"教是最好的学。当你教会别人的时候，你自己也成长了。"',
      cond: g => g.age>=27 && g.intel>65 && !g.flags.teacher && g.job!=='待业中',
      choices:[
        { label:'接受，做兼职讲师', hint:'+💰 +🧠 +✨', fn: g => { g.flags.teacher=true; return{money:8000,intel:10,charm:8,mood:10}; }},
        { label:'全职转型培训师', hint:'🎲 +🧠', fn: g => { g.flags.teacher=true; setJob(g,'培训师',15000); if(Math.random()>0.4){return{mood:15,intel:15,charm:10}}else{return{mood:-10}} }},
        { label:'算了，我不够格', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'small_shop', icon:'🏪', title:'开小店梦想',
      body:'你路过一家转让的咖啡店，老板说："位置好，租金低，转让费10万。"\n\n你心动了：开一家自己的小店，是多少人的梦想？\n\n但你又算了算：装修5万，设备3万，流动资金5万——总共23万。\n\n而且，你知道：90%的咖啡店活不过3年。\n\n"开咖啡店不是梦想，是赌博。但你愿意赌吗？"',
      cond: g => g.age>=28 && g.age<=45 && g.money>=150000 && !g.flags.smallShop && !g.flags.entrepreneur,
      choices:[
        { label:'盘下来开店', hint:'🎲 -💰💰', fn: g => { g.flags.smallShop=true; g.flags.entrepreneur=true; setJob(g,'小店老板',0); if(Math.random()>0.5){return{money:-230000,mood:25,social:15,charm:10}}else{return{money:-230000,mood:-15}} }},
        { label:'先观察市场', hint:'+🧠', fn: g => ({intel:8,mood:5}) },
        { label:'算了，风险太大', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'volunteer_work', icon:'🤝', title:'志愿者活动',
      body:'你在朋友圈看到一个公益组织在招志愿者：去山区支教/去养老院陪伴老人/去流浪动物基地帮忙。\n\n你心动了：也许做点有意义的事，会让生活不一样。\n\n但你又犹豫：周末本来可以休息/加班赚钱，去做志愿者值吗？\n\n"人生的意义不在于你得到了什么，而在于你给予了什么。"',
      cond: g => g.age>=25 && !g.flags.volunteer,
      choices:[
        { label:'参加支教', hint:'+😊 +👥 +🧠', fn: g => { g.flags.volunteer=true; return{mood:20,social:15,intel:8,charm:10,money:-500}; }},
        { label:'去养老院', hint:'+😊 +👥', fn: g => { g.flags.volunteer=true; return{mood:18,social:12,charm:8,money:-300}; }},
        { label:'救助流浪动物', hint:'+😊 +❤️', fn: g => { g.flags.volunteer=true; return{mood:15,health:5,charm:10,money:-500}; }},
        { label:'算了，没时间', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'health_scare', icon:'🏥', title:'体检异常',
      body:'你做了年度体检，报告显示：某项指标异常，建议复查。\n\n你慌了：上网一查，这个指标可能是小问题，也可能是大问题。\n\n你去医院复查，医生说："暂时没事，但要注意生活方式。"\n\n你松了一口气，但你知道：身体在给你发警告了。\n\n"健康就像银行：年轻时透支，老了要还。"',
      cond: g => g.age>=30 && g.health<60 && !g.flags.healthScare,
      choices:[
        { label:'认真改变生活方式', hint:'+❤️ +🧠', fn: g => { g.flags.healthScare=true; return{health:15,intel:8,mood:10}; }},
        { label:'买保健品', hint:'-💰 +❤️', fn: g => { g.flags.healthScare=true; return{money:-5000,health:8,mood:5}; }},
        { label:'算了，年轻人哪有不熬夜的', hint:'-❤️', fn: g => { g.flags.healthScare=true; return{health:-10,mood:-5}; }},
      ]},
    { id:'networking_event', icon:'🎯', title:'行业会议',
      body:'你参加了一个行业会议，现场都是大佬和同行。\n\n你鼓起勇气跟几个大牛换了名片，还加了几个微信群。\n\n你发现：原来人脉不是认识多少人，而是多少人认可你。\n\n"社交的本质是价值交换。你得先有价值，才能交换。"',
      cond: g => g.age>=25 && g.job!=='待业中' && g.social<60,
      choices:[
        { label:'积极社交', hint:'+👥 +✨ -💰', fn: g => ({social:15,charm:8,money:-1000,mood:8}) },
        { label:'只听不说话', hint:'+🧠', fn: g => ({intel:10,social:3}) },
        { label:'找机会跳槽', hint:'🎲 +💰', fn: g => { if(Math.random()>0.5){const s=Math.floor(g.jobSalary*1.4);setJob(g,getTitle(g,'senior'),s);return{money:5000,mood:15}}else{return{mood:-5}} }},
      ]},
    { id:'personal_brand', icon:'🌟', title:'打造个人品牌',
      body:'你在知乎/小红书上开始写专业文章，粉丝慢慢涨起来了。\n\n有人私信你："能付费咨询吗？"有人找你合作，有人请你做分享。\n\n你发现：个人品牌是最好的名片，也是最稳定的副业。\n\n"在这个时代，影响力就是资产。"',
      cond: g => g.age>=26 && g.intel>60 && g.charm>50 && !g.flags.personalBrand,
      choices:[
        { label:'持续输出，建立品牌', hint:'+💰 +✨ +🧠', fn: g => { g.flags.personalBrand=true; g.flags.influencer=true; return{money:10000,charm:15,intel:10,social:8,mood:12}; }},
        { label:'偶尔写写', hint:'+✨ +🧠', fn: g => ({charm:8,intel:5,mood:5}) },
        { label:'算了，没时间', hint:'-😊', fn: g => ({mood:-3}) },
      ]},
    { id:'financial_freedom_plan', icon:'🎯', title:'FIRE计划',
      body:'你看到一个概念：FIRE（Financial Independence, Retire Early）——财务自由，提前退休。\n\n核心思想：攒够25倍年支出的钱，然后靠4%的年化收益生活。\n\n你算了算：你一年花15万，需要攒375万才能FIRE。\n\n你现在有多少？不敢算。\n\n"FIRE不是梦，是数学题。但前提是——你得先有钱。"',
      cond: g => g.age>=28 && g.age<=38 && g.intel>65 && g.money>50000 && !g.flags.firePlan,
      choices:[
        { label:'开始执行FIRE计划', hint:'+💰 +🧠', fn: g => { g.flags.firePlan=true; return{money:30000,intel:10,mood:15}; }},
        { label:'先提高收入再说', hint:'+💰', fn: g => ({money:10000,intel:5}) },
        { label:'FIRE太遥远，过好当下', hint:'+😊', fn: g => ({mood:10}) },
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
    { id:'took_off_gown', icon:'👔', name:'脱下长衫', desc:'放下身段，脚踏实地', check: g => g.flags.tookOffGown },
    { id:'lockdown_survivor', icon:'🔒', name:'封控幸存者', desc:'熬过了疫情', check: g => g.flags.hadLockdown },
    { id:'ai_ready', icon:'🤖', name:'AI时代幸存者', desc:'拥抱了AI', check: g => g.flags.aiAnxiety && g.intel>75 },
    { id:'minimalist', icon:'📉', name:'消费觉醒', desc:'学会精打细算', check: g => g.flags.minimalist },
    { id:'scam_survivor', icon:'🛡️', name:'反诈达人', desc:'识破了骗局', check: g => g.flags.hadScam && g.money>5000 },
    { id:'investor', icon:'📈', name:'韭菜觉醒', desc:'参与过投资', check: g => g.flags.invested },
    { id:'married', icon:'💍', name:'步入婚姻', desc:'结婚了', check: g => g.flags.married },
    { id:'divorced', icon:'💔', name:'围城之外', desc:'离婚了', check: g => g.flags.divorced },
    { id:'parent', icon:'👶', name:'为人父母', desc:'有了孩子', check: g => g.flags.hasChild },
    { id:'lying_flat', icon:'🛋️', name:'躺平大师', desc:'选择了躺平', check: g => g.flags.lyingFlat },
    { id:'gym_rat', icon:'🏋️', name:'健身达人', desc:'办了健身卡', check: g => g.flags.gymMember },
    { id:'bookworm', icon:'📚', name:'书虫', desc:'养成阅读习惯', check: g => g.flags.readingHabit },
    { id:'chef', icon:'🍳', name:'厨神', desc:'学会做饭', check: g => g.flags.cookingSkill },
    { id:'musician', icon:'🎸', name:'音乐人', desc:'学了乐器', check: g => g.flags.musicSkill },
    { id:'photographer', icon:'📷', name:'摄影师', desc:'爱上摄影', check: g => g.flags.photographyHobby },
    { id:'viral_star', icon:'🌟', name:'网红初体验', desc:'意外走红', check: g => g.flags.viralMoment },
    { id:'freelancer', icon:'💻', name:'自由职业者', desc:'成为自由职业者', check: g => g.flags.freelancer },
    { id:'world_traveler', icon:'✈️', name:'环游世界', desc:'去旅行了', check: g => g.flags.worldTravel },
    { id:'teacher', icon:'👨‍🏫', name:'为人师表', desc:'做了培训师', check: g => g.flags.teacher },
    { id:'shop_owner', icon:'🏪', name:'小店老板', desc:'开了小店', check: g => g.flags.smallShop },
    { id:'volunteer', icon:'🤝', name:'志愿者', desc:'参加过志愿者活动', check: g => g.flags.volunteer },
    { id:'personal_brand', icon:'🌟', name:'个人品牌', desc:'建立个人品牌', check: g => g.flags.personalBrand },
    { id:'fire_planner', icon:'🎯', name:'FIRE计划', desc:'开始FIRE计划', check: g => g.flags.firePlan },
];

// === ENDINGS === (order matters: first match wins)
const ENDINGS = [
    // --- CRITICAL NEGATIVE (check first) ---
    { id:'karoshi', badge:'⚰️', title:'过劳死', desc:'你的身体终于撑不住了。长期的996、熬夜、外卖、焦虑——你的心脏在某天凌晨3点的加班中停止了跳动。\n\n你的朋友圈最后一条是凌晨2点发的："又是充实的一天。"\n\n追悼会上，领导说你是"优秀的员工"。你妈说："我只要我的孩子活着。"\n\n"拿命换钱，拿钱换命。但命只有一条。"\n\n（如果你或身边的人有类似困扰，请拨打心理援助热线：400-161-9995）', cond: g => g.health<=0 && g.job!=='待业中' },
    { id:'bankruptcy', badge:'💸', title:'债务深渊', desc:'你破产了。网贷、房贷、信用卡——债务像雪球一样越滚越大。\n\n催收电话从早打到晚，你的通讯录好友都收到了短信。你上了征信黑名单，坐不了高铁，买不了机票。\n\n"贫穷限制了我的想象力，债务限制了我的一切。"\n\n但你没有放弃。你还年轻，还可以重新开始。\n\n（个人破产不是终点，是重新开始的起点。）', cond: g => g.money<=-100000 },
    { id:'jail', badge:'🔒', title:'铁窗泪', desc:'你因为一时糊涂犯了法。也许是帮人"走账"变成了洗钱，也许是副业踩了法律红线。\n\n你站在法庭上，法官宣读判决书的时候，你妈在旁听席上哭了。\n\n"法律面前人人平等，但蹲监狱的人不平等。"\n\n你在里面学会了缝纫和做饭。出来后你发现：有案底的人，连外卖平台都不让你注册。', cond: g => g.flags.committedCrime },
    // --- NEGATIVE ---
    { id:'burnout', badge:'🔥', title:'过劳人生', desc:'你的身体终于扛不住了。长期996、熬夜、吃外卖——体检报告比简历还厚。\n\n医生说："你需要休息。"你苦笑：休息？在这个城市是奢侈品。\n\n"身体是革命的本钱——但打工人的本钱，早就不够了。"', cond: g => g.health<=15 },
    { id:'depression', badge:'🌧️', title:'至暗时刻', desc:'你抑郁了。不是因为某一件事，而是所有事的叠加。\n\n但你拨打了心理热线：400-161-9995。\n\n"你已经很勇敢了。"\n\n你哭了一场，然后洗了把脸。明天又是新的一天。\n\n（求助不是软弱，活着就是胜利。）', cond: g => g.mood<=10 },
    { id:'startup_fail', badge:'💔', title:'创业失败', desc:'你的公司倒闭了。赔光了积蓄，欠了一屁股债。\n\n但你知道：创业失败不丢人，不敢创业才丢人。（虽然你现在觉得这是毒鸡汤。）\n\n你打开招聘App重新投简历。至少简历上多了"联合创始人"。', cond: g => g.flags.entrepreneur && g.money<=-30000 },
    { id:'influencer_scandal', badge:'📉', title:'网红翻车', desc:'你成了网红，然后又翻车了。\n\n也许是说错了话，也许是被扒出了黑历史，也许只是算法不再推荐你。\n\n粉丝从10万跌到1万，评论区从"家人们"变成了"取关了"。\n\n你发了条道歉视频，播放量还没你的道歉信字数多。\n\n"互联网没有记忆，但互联网有截图。"\n\n你开始理解：流量是借来的，迟早要还。', cond: g => g.flags.influencer && g.charm<30 && g.mood<30 },
    // --- POSITIVE (most specific first) ---
    { id:'fire', badge:'🌟', title:'FIRE人生', desc:'你实现了财务自由，提前退休了。在大理买了栋小房子，种花养狗。\n\n"少吃外卖，少喝奶茶，少看直播——省下来的钱够你提前退休了。"\n\n（其实是因为你运气好。）', cond: g => g.money>=500000 && g.mood>=70 && g.health>=60 },
    { id:'executive', badge:'👔', title:'大厂高管', desc:'你从初级做到了技术VP。工牌从绿色变成了金色，办公室从工位变成了独立间。\n\n但头发从浓密变成了稀疏，颈椎从正常变成了C5-C6突出。\n\n你用健康换了财富，现在想用财富换健康。', cond: g => g.jobSalary>=50000 && g.money>=300000 },
    { id:'settled', badge:'🏡', title:'扎根大城市', desc:'你买了房、落了户、结了婚、生了娃。从"X漂"变成了"新XX人"。\n\n你的孩子以后不用再经历你经历的一切。\n\n你觉得一切都值了。虽然房贷还要还25年。', cond: g => g.flags.hasHouse && g.flags.hasHukou && g.flags.married },
    { id:'wealthy', badge:'💎', title:'财务自由', desc:'你成了"成功人士"。大房子、好车子、国际学校。\n\n但你知道，光鲜背后是你错过了孩子的第一次走路、父母的生日、朋友的聚会。\n\n你用时间换了钱。现在想用钱换时间——但时间不卖。', cond: g => g.money>=1000000 },
    { id:'hometown_hero', badge:'🏆', title:'衣锦还乡', desc:'你在大城市赚够了钱，风风光光地回了老家。\n\n你给爸妈买了新房子，在县城开了家店。村口的大爷大妈都说："你看人家XXX，在大城市混出来了。"\n\n你妈终于不用在亲戚面前低头了。你爸在酒桌上第一次主动敬了你一杯。\n\n"出去是为了更好地回来。"\n\n你站在老家的田埂上，看着落日。大城市很好，但这里才是家。', cond: g => g.money>=300000 && g.social>=50 && g.mood>=50 && g.age>=32 },
    { id:'immigration', badge:'✈️', title:'润了', desc:'你选择了"润"——移民海外。你卖了房子（如果有的话），考了雅思，申请了技术移民。\n\n飞机起飞的那一刻，你看着窗外的城市，想起了这些年的日日夜夜。\n\n到了国外你发现：你以为的天堂也有996，只是换了个时区。\n\n"此心安处是吾乡——但吾乡不给户口。"\n\n你在异国他乡重新开始。至少，空气是甜的。（大概。）', cond: g => g.money>=200000 && g.intel>=75 && g.charm>=60 && g.age>=28 && g.age<=40 },
    { id:'go_home', badge:'🏠', title:'返乡青年', desc:'你决定回老家了。不是因为失败，而是终于想明白了：大城市不是唯一的选择。\n\n你用攒的钱和学到的本事，在老家开了小店。\n\n你妈终于笑了："回来就好。"', cond: g => g.mood>=60 && g.money>=50000 && g.age>=30 },
    { id:'civil_end', badge:'📋', title:'体制内人生', desc:'你考上了公务员，过上了朝九晚五、稳定双休的生活。朋友圈从加班照变成了食堂照。\n\n在这个充满不确定性的时代，"稳定"本身就是一种奢侈。', cond: g => g.flags.civilServant && g.months>=36 },
    { id:'influencer_end', badge:'📱', title:'网红达人', desc:'你真的成了网红。粉丝10万，靠广告可以养活自己。\n\n你以为这是自由，后来发现算法才是你的老板。\n\n但至少做自己喜欢的事，确实比打工快乐。', cond: g => g.flags.influencer && g.money>=50000 },
    { id:'startup_end', badge:'🚀', title:'创业有成', desc:'你的公司活过了三年——这在创业圈已经是奇迹。\n\n没有上市，但你养活了10人团队，做出了有人用的产品。\n\n你偶尔想起当初在出租屋写第一行代码的夜晚。那时你什么都没有，除了笔记本和一腔热血。', cond: g => g.flags.entrepreneur && g.money>=100000 },
    { id:'ordinary', badge:'☀️', title:'小确幸人生', desc:'你没有成为大佬，没有买房，没有财务自由。\n\n但你有还不错的工作、几个交心的朋友、一只猫、一个爱你的人。\n\n周末跑步，晚上做饭，睡前看书。\n\n"不是每个人都要成为传奇。认真生活的人，本身就是英雄。"', cond: g => g.mood>=55 && g.health>=50 && g.money>=20000 },
    { id:'single', badge:'🌸', title:'单身贵族', desc:'你选择了单身。不是找不到，而是发现一个人也挺好。\n\n随时加班、随时旅行、随时吃火锅。\n\n你妈依然每周催婚，但你学会了微笑以对。\n\n"幸福的标准不止一种。一个人的日子，也可以过得很精彩。"', cond: g => !g.flags.married && !g.flags.hasPartner && g.mood>=60 && g.age>=35 },
    { id:'investment_guru', badge:'📈', title:'投资达人', desc:'你从韭菜变成了投资达人。股票、基金、房产——你都有了。\n\n但你知道，运气占了80%。剩下的20%，是你用无数个失眠的夜晚换来的。\n\n"投资有风险，入市需谨慎。但你已经入局了。"', cond: g => g.flags.invested && g.money>=200000 && g.intel>=70 },
    { id:'lying_flat_end', badge:'🛋️', title:'躺平人生', desc:'你选择了躺平。不卷了，不拼了，不争了。\n\n你在郊区租了个小房子，种花养猫，偶尔打零工。\n\n有人说你是loser，有人说你是智者。你不在乎。\n\n"人生不是赛道，是旷野。你选择了自己的路。"', cond: g => g.flags.lyingFlat && g.mood>=65 && g.health>=60 && g.age>=30 },
    { id:'divorced_life', badge:'💔', title:'围城之外', desc:'你离婚了。不是失败，是选择。\n\n你重新开始一个人的生活。周末约朋友，工作日加班，偶尔相亲。\n\n你发现：离婚不是终点，是另一种开始。\n\n"婚姻不是人生的必选项。幸福才是。"', cond: g => g.flags.divorced && g.mood>=50 && g.age>=35 },
    { id:'digital_nomad', badge:'🌍', title:'数字游民', desc:'你成了数字游民。一边旅行一边工作，今天在清迈，下个月在巴厘岛。\n\n你的办公室是咖啡厅，你的同事是WiFi。\n\n"不是逃离，是选择另一种活法。"\n\n你在朋友圈发了张海边的照片，配文："这才是生活。"\n\n虽然你偶尔也会想念大城市的便利和熟悉。', cond: g => g.flags.lyingFlat && g.money>=80000 && g.intel>=65 && g.charm>=55 && g.age>=28 && g.age<=40 },
    { id:'freelancer_end', badge:'💻', title:'自由职业者', desc:'你成了自由职业者。没有老板，没有打卡，没有固定收入。\n\n有时候一个月赚5万，有时候三个月没单子。\n\n但你享受这种自由：想接就接，想休息就休息。\n\n"自由职业不是不工作，是为自己工作。"', cond: g => g.flags.sideHustle && g.intel>=60 && g.money>=50000 && g.age>=30 },
    { id:'teacher_end', badge:'👨‍🏫', title:'教育培训师', desc:'你转型做了教育培训师。教孩子编程，教成人英语，教职场新人沟通技巧。\n\n虽然收入不如大厂，但你觉得有意义。\n\n"教育的本质是一棵树摇动另一棵树，一朵云推动另一朵云。"', cond: g => g.intel>=75 && g.social>=50 && g.mood>=55 && g.age>=30 },
    { id:'small_business', badge:'🏪', title:'小店老板', desc:'你开了家小店——也许是咖啡厅，也许是花店，也许是书店。\n\n没有996，但有7×24。你既是老板也是员工。\n\n但你享受这种踏实感：每天开门营业，看到熟客微笑。\n\n"开一家小店，是很多人的梦想。你把它变成了现实。"', cond: g => g.flags.entrepreneur && g.money>=30000 && g.mood>=50 && g.age>=32 },
    { id:'retire_abroad', badge:'🌴', title:'海外养老', desc:'你在东南亚买了套小房子，开始了海外养老生活。\n\n泰国的物价是中国的1/3，空气好，人友善。\n\n你用国内的退休金，过着当地中产的生活。\n\n"此心安处是吾乡——前提是签证不给你找麻烦。"', cond: g => g.money>=400000 && g.age>=50 && g.health>=50 && g.charm>=50 },
    // --- DEFAULT ---
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
        flags: {}, currentEvent: null, isEnded: false, consecutiveOvertime: 0,
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

// === MONTHLY ACTIVITY SYSTEM ===
let selectedActivity = null;

const ACTIVITY_EFFECTS = {
    work: { money: 3000, health: -5, mood: -3, intel: 2, social: -2, charm: 0, label: '拼命工作' },
    rest: { money: -500, health: 8, mood: 10, intel: 0, social: 0, charm: 2, label: '休息放松' },
    study: { money: -200, health: 0, mood: 3, intel: 10, social: 0, charm: 3, label: '学习充电' },
    socialize: { money: -1000, health: 0, mood: 8, intel: 0, social: 10, charm: 5, label: '社交聚会' },
    exercise: { money: -300, health: 10, mood: 5, intel: 0, social: 0, charm: 5, label: '运动锻炼' },
};

function selectActivity(type) {
    selectedActivity = type;
    // 更新UI
    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.act === type) btn.classList.add('selected');
    });
}

function applyActivity() {
    if (!selectedActivity) return null;
    const effects = ACTIVITY_EFFECTS[selectedActivity];
    if (!effects) return null;

    G.money += effects.money;
    G.health = clamp(G.health + effects.health, 0, 100);
    G.mood = clamp(G.mood + effects.mood, 0, 100);
    G.intel = clamp(G.intel + effects.intel, 0, 100);
    G.social = clamp(G.social + effects.social, 0, 100);
    G.charm = clamp(G.charm + effects.charm, 0, 100);

    const label = effects.label;
    selectedActivity = null;
    // 重置UI
    document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('selected'));
    return label;
}

// === GAME FLOW ===
function advanceMonth() {
    if (G.isEnded) return;
    G.months++; G.month++;
    if (G.month > 12) { G.month = 1; G.age++; G.year++; G.flags.springFestivalThisYear = false; }

    // 季节效果
    const season = getSeason(G.month);
    applySeasonEffects(season);

    const city = CITIES[G.city];
    G.money -= city.rent + Math.floor(3000 * city.cost);
    if (G.jobSalary > 0) G.money += G.jobSalary;
    if (G.flags.entrepreneur && Math.random()>0.6) G.money += Math.floor(Math.random()*15000)+2000;
    if (G.flags.sideHustle && Math.random()>0.5) G.money += Math.floor(Math.random()*5000)+1000;
    // 房贷月供 (如果有房且没还清) - 降低到10000更平衡
    if (G.flags.hasHouse) G.money -= 10000;

    // 养老金（50岁后如果退休）
    if (G.age >= 50 && G.flags.retirementPlanning && G.job === '待业中') {
        G.money += 4000; // 基础养老金
    }

    // 应用月度活动选择
    const activityLabel = applyActivity();
    if (activityLabel) {
        G.eventLog.push({ age: G.age, text: `这个月选择了「${activityLabel}」` });
    }

    // 健康和心情自然衰减
    G.health = clamp(G.health - (G.job==='待业中'?0:1), 0, 100);
    G.mood = clamp(G.mood - 1, 0, 100);

    // 过劳追踪
    if (G.job !== '待业中' && G.jobSalary > 10000) {
        G.consecutiveOvertime = (G.consecutiveOvertime || 0) + 1;
    } else {
        G.consecutiveOvertime = 0;
    }
    // 长期过劳额外扣健康
    if ((G.consecutiveOvertime || 0) > 12) G.health = clamp(G.health - 2, 0, 100);

    // 网贷利息
    if (G.flags.onlineLoan && G.money < 0) G.money -= Math.floor(Math.abs(G.money) * 0.02);

    updateHUD();
    checkAchievements();

    // 多重结局检查
    if (G.health <= 0) { triggerEnding(); return; }
    if (G.money <= -100000) { triggerEnding(); return; }
    if (G.age >= 60) { triggerEnding(); return; }
    if (G.mood <= 0) { triggerEnding(); return; }

    const event = pickEvent();
    if (event) { showEvent(event); } else { showMonthlySummary(); }

    if (G.months % 12 === 0) G.eventLog.push({ age: G.age, text: `在大城市又活过了一年` });
}

// === SEASON SYSTEM ===
function getSeason(month) {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

function getSeasonName(season) {
    return { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' }[season] || '';
}

function getSeasonIcon(season) {
    return { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' }[season] || '';
}

function applySeasonEffects(season) {
    switch (season) {
        case 'spring':
            G.mood = clamp(G.mood + 2, 0, 100); // 春天心情好
            break;
        case 'summer':
            G.health = clamp(G.health - 1, 0, 100); // 夏天热，健康略降
            G.mood = clamp(G.mood + 1, 0, 100);
            break;
        case 'autumn':
            G.mood = clamp(G.mood - 1, 0, 100); // 秋天容易伤感
            G.intel = clamp(G.intel + 1, 0, 100); // 秋天适合学习
            break;
        case 'winter':
            G.health = clamp(G.health - 2, 0, 100); // 冬天容易生病
            G.mood = clamp(G.mood - 2, 0, 100); // 冬天容易抑郁
            break;
    }
}

function pickEvent() {
    // 合并通用事件和当前城市专属事件
    const cityEvents = CITIES[G.city]?.events || [];
    const allEvents = [...EVENTS, ...cityEvents];
    const eligible = allEvents.filter(e => (!e.cond || e.cond(G)) && (!e.minAge || G.age>=e.minAge) && (!e.maxAge || G.age<=e.maxAge));
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
    // 显示浮动动画
    for (const [k,v] of Object.entries(result)) {
        if (labels[k] && v) {
            const d = k==='money' ? fmtMoney(v) : (v>0?`+${v}`:`${v}`);
            changes += `<span class="stat-change-item ${v>0?'positive':'negative'}">${labels[k]} ${d}</span>`;
            showStatChange(k, v, labels[k], d);
        }
    }

    // 负面事件屏幕震动
    const totalNeg = (result.mood||0) + (result.health||0);
    if (totalNeg < -20) {
        document.getElementById('screen-game').classList.add('shake');
        setTimeout(() => document.getElementById('screen-game').classList.remove('shake'), 500);
    }

    const body = typeof event.body === 'function' ? event.body() : event.body;
    addEventCard({ icon: event.icon, title: event.title, body, choice: choice.label, changes, type: result.mood>0?'positive':result.mood<0?'negative':'' }, true);

    document.getElementById('current-event').innerHTML = '';
    document.getElementById('btn-advance').disabled = false;
    G.currentEvent = null;

    updateHUD();
    if (G.health<=0 || G.mood<=0 || G.money<=-100000) triggerEnding();
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
    document.getElementById('hud-date').textContent = `${G.year}年${G.month}月 ${getSeasonIcon(getSeason(G.month))}`;

    updBar('bar-money','val-money', G.money>=0 ? Math.min(G.money/500000*100,100) : 0, fmtMoney(G.money));
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

function showStatChange(stat, value, icon, display) {
    const bar = document.getElementById(`bar-${stat}`);
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = `stat-float ${value > 0 ? 'float-positive' : 'float-negative'}`;
    el.textContent = `${icon} ${display}`;
    el.style.position = 'fixed';
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top - 10}px`;
    el.style.transform = 'translateX(-50%)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
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

// === SAVE/LOAD (Multi-slot system) ===
const MAX_SAVE_SLOTS = 3;
const SAVE_PREFIX = 'cityDrifters_save_';

function saveGame(slot = 1) {
    const saveData = { ...G, savedAt: Date.now(), version: '2.10' };
    localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(saveData));
    notify(`💾 已保存到槽位 ${slot}！`);
    toggleMenu();
}

function loadGame(slot = 1) {
    const s = localStorage.getItem(SAVE_PREFIX + slot);
    if (!s) {
        // Fallback to old save format
        const oldSave = localStorage.getItem('cityDrifters_save');
        if (oldSave) {
            Object.assign(G, JSON.parse(oldSave));
            showScreen('screen-game');
            updateHUD();
            notify('💾 旧存档已加载！');
            return;
        }
        notify('没有找到存档');
        return;
    }
    Object.assign(G, JSON.parse(s));
    showScreen('screen-game');
    updateHUD();
    notify(`💾 槽位 ${slot} 已加载！`);
}

function getSaveSlots() {
    const slots = [];
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
        const save = localStorage.getItem(SAVE_PREFIX + i);
        if (save) {
            const data = JSON.parse(save);
            slots.push({
                slot: i,
                name: data.name || '未命名',
                age: data.age || 22,
                city: data.cityName || '未知',
                savedAt: data.savedAt ? new Date(data.savedAt).toLocaleString('zh-CN') : '未知时间',
                hasSave: true
            });
        } else {
            slots.push({ slot: i, hasSave: false });
        }
    }
    return slots;
}

function showSaveMenu() {
    const slots = getSaveSlots();
    const modal = document.getElementById('modal-save');
    const list = document.getElementById('save-slots');
    list.innerHTML = slots.map(s => `
        <div class="save-slot ${s.hasSave ? '' : 'empty'}">
            <div class="slot-header">
                <span class="slot-number">槽位 ${s.slot}</span>
                <span class="slot-status ${s.hasSave ? 'used' : ''}">${s.hasSave ? '已保存' : '空闲'}</span>
            </div>
            ${s.hasSave ? `
                <div class="slot-info">
                    <p>👤 ${s.name}</p>
                    <p>📅 ${s.age}岁</p>
                    <p>🏙️ ${s.city}</p>
                    <p>💾 ${s.savedAt}</p>
                </div>
                <div class="slot-actions">
                    <button class="btn-small btn-save" onclick="saveGame(${s.slot}); closeModal('modal-save'); toggleMenu()">覆盖保存</button>
                    <button class="btn-small btn-load" onclick="loadGame(${s.slot}); closeModal('modal-save')">加载</button>
                    <button class="btn-small btn-danger" onclick="deleteSave(${s.slot})">删除</button>
                </div>
            ` : `
                <div class="slot-info">
                    <p>这个槽位还没有存档</p>
                </div>
                <div class="slot-actions">
                    <button class="btn-small btn-save" onclick="saveGame(${s.slot}); closeModal('modal-save'); toggleMenu()">保存到这里</button>
                </div>
            `}
        </div>
    `).join('');
    modal.classList.add('open');
}

function deleteSave(slot) {
    if (!confirm(`确定要删除槽位 ${slot} 的存档吗？`)) return;
    localStorage.removeItem(SAVE_PREFIX + slot);
    notify(`🗑️ 槽位 ${slot} 已删除`);
    showSaveMenu();
}

// === MOBILE SWIPE NAVIGATION ===
function initMobileSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;

    const gameScreen = document.getElementById('screen-game');
    if (!gameScreen) return;

    gameScreen.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gameScreen.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0) {
            // Swipe left - next month
            if (!document.getElementById('btn-advance').disabled) {
                advanceMonth();
            }
        } else {
            // Swipe right - open menu
            toggleMenu();
        }
    }
}

// === KEYBOARD SHORTCUTS ===
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Skip if typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        // Skip if a modal is open
        if (document.querySelector('.modal.open')) return;

        const gameScreen = document.getElementById('screen-game');
        if (!gameScreen || !gameScreen.classList.contains('active')) return;

        switch (e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                const btn = document.getElementById('btn-advance');
                if (btn && !btn.disabled) advanceMonth();
                break;
            case 'Escape':
                e.preventDefault();
                const menu = document.getElementById('side-menu');
                if (menu.classList.contains('open')) toggleMenu();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                toggleMenu();
                break;
            case '1':
                e.preventDefault();
                selectActivity('work');
                break;
            case '2':
                e.preventDefault();
                selectActivity('rest');
                break;
            case '3':
                e.preventDefault();
                selectActivity('study');
                break;
            case '4':
                e.preventDefault();
                selectActivity('socialize');
                break;
            case '5':
                e.preventDefault();
                selectActivity('exercise');
                break;
            case 's':
            case 'S':
                e.preventDefault();
                if (e.ctrlKey) {
                    e.preventDefault();
                    showSaveMenu();
                }
                break;
        }
    });
}

// === QUICK STATS ===
function showQuickStats() {
    const stats = {
        totalMonths: G.months,
        totalChoices: G.choices,
        eventsSeen: G.eventsSeen,
        currentAge: G.age,
        cityYears: Math.floor(G.months / 12),
        flagsCount: Object.keys(G.flags).filter(k => G.flags[k]).length,
        topStat: getTopStat(),
        lowestStat: getLowestStat(),
    };
    return stats;
}

function getTopStat() {
    const stats = { money: Math.max(0, G.money), health: G.health, mood: G.mood, intel: G.intel, social: G.social, charm: G.charm };
    const entries = Object.entries(stats);
    entries.sort((a, b) => b[1] - a[1]);
    const names = { money: '💰金钱', health: '❤️健康', mood: '😊心情', intel: '🧠智力', social: '👥人脉', charm: '✨魅力' };
    return names[entries[0][0]];
}

function getLowestStat() {
    const stats = { money: Math.max(0, G.money), health: G.health, mood: G.mood, intel: G.intel, social: G.social, charm: G.charm };
    const entries = Object.entries(stats);
    entries.sort((a, b) => a[1] - b[1]);
    const names = { money: '💰金钱', health: '❤️健康', mood: '😊心情', intel: '🧠智力', social: '👥人脉', charm: '✨魅力' };
    return names[entries[0][0]];
}

// === SOUND SYSTEM ===
let soundEnabled = localStorage.getItem('cityDrifters_sound') !== 'false';

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('cityDrifters_sound', soundEnabled);
    notify(soundEnabled ? '🔊 音效已开启' : '🔇 音效已关闭');
    // Update UI
    const soundBtn = document.getElementById('toggle-sound');
    if (soundBtn) soundBtn.checked = soundEnabled;
}

function playSound(type) {
    if (!soundEnabled) return;
    // Simple Web Audio API sounds
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'click':
                osc.frequency.value = 600;
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
                break;
            case 'success':
                osc.frequency.value = 800;
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
                break;
            case 'fail':
                osc.frequency.value = 300;
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
                break;
            case 'levelup':
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
                break;
        }
    } catch (e) {
        // Silently fail if audio not supported
    }
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

// === SETTINGS ===
function openSettings() {
    document.getElementById('modal-settings').classList.add('open');
    loadSettingsUI();
}

function setFontSize(size) {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[size];
    localStorage.setItem('gameSettings_fontSize', size);
    document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function toggleHighContrast() {
    const enabled = document.getElementById('toggle-contrast').checked;
    document.body.classList.toggle('high-contrast', enabled);
    localStorage.setItem('gameSettings_highContrast', enabled);
}

function toggleReduceMotion() {
    const enabled = document.getElementById('toggle-motion').checked;
    document.body.classList.toggle('reduce-motion', enabled);
    localStorage.setItem('gameSettings_reduceMotion', enabled);
}

function exportSave() {
    const save = localStorage.getItem('cityDrifters_save');
    if (!save) { notify('没有存档可导出'); return; }
    const blob = new Blob([save], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `都市浮生记_存档_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('📤 存档已导出！');
}

function importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem('cityDrifters_save', JSON.stringify(data));
                notify('💾 存档已导入！刷新页面生效');
                setTimeout(() => location.reload(), 1500);
            } catch (err) {
                notify('❌ 存档文件格式错误');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearSave() {
    if (!confirm('确定要清除存档吗？此操作不可恢复！')) return;
    localStorage.removeItem('cityDrifters_save');
    notify('🗑️ 存档已清除');
}

function loadSettingsUI() {
    const fontSize = localStorage.getItem('gameSettings_fontSize') || 'medium';
    const highContrast = localStorage.getItem('gameSettings_highContrast') === 'true';
    const reduceMotion = localStorage.getItem('gameSettings_reduceMotion') === 'true';

    document.querySelectorAll('.settings-btn').forEach(btn => {
        if (btn.textContent.includes(fontSize === 'small' ? '小' : fontSize === 'large' ? '大' : '中')) {
            btn.classList.add('active');
        }
    });
    document.getElementById('toggle-contrast').checked = highContrast;
    document.getElementById('toggle-motion').checked = reduceMotion;
}

function loadSettings() {
    const fontSize = localStorage.getItem('gameSettings_fontSize') || 'medium';
    const highContrast = localStorage.getItem('gameSettings_highContrast') === 'true';
    const reduceMotion = localStorage.getItem('gameSettings_reduceMotion') === 'true';

    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[fontSize];

    if (highContrast) document.body.classList.add('high-contrast');
    if (reduceMotion) document.body.classList.add('reduce-motion');
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initParticles();
    initMobileSwipe();
    initKeyboardShortcuts();
    const hasAnySave = localStorage.getItem(SAVE_PREFIX + '1') || localStorage.getItem(SAVE_PREFIX + '2') || localStorage.getItem(SAVE_PREFIX + '3') || localStorage.getItem('cityDrifters_save');
    if (!hasAnySave) document.getElementById('btn-continue').style.opacity = '0.4';
});
