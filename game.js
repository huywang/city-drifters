// ============================================
// 都市浮生记 - Game Engine v3.4
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
    // === HIDDEN BACKGROUNDS (Unlocked via legacy system) ===
    chai2dai: { name: '拆二代', money: 200000, health: 80, mood: 75, intel: 40, social: 50, charm: 60, startJob: '待业中', startSalary: 0, hidden: true,
        unlockCond: '解锁5种结局后可用',
        intro: '你家的老房子拆迁了。一夜之间，你从普通家庭变成了"拆二代"。\n\n补偿款200万到手，你妈说："别乱花，存着以后买房。"你爸说："给你娶媳妇用。"你说："我要去大城市闯一闯。"\n\n你开着新买的车去了大城市。朋友圈发了条："有钱人的快乐，就是这么朴实无华且枯燥。"\n\n但你知道：钱来得快，去得也快。' },
    star2dai: { name: '星二代', money: 50000, health: 85, mood: 60, intel: 55, social: 80, charm: 90, startJob: '待业中', startSalary: 0, startAge: 22, hidden: true,
        unlockCond: '解锁10种结局后可用',
        intro: '你的父母是娱乐圈的人。你从小就在聚光灯下长大，综艺节目、红毯、发布会——你都见惯了。\n\n但你说："我不想靠父母。我要证明自己。"\n\n于是你独自来到大城市，隐姓埋名。你的微博有50万粉丝，但没人知道你是谁的孩子。\n\n"星二代的标签，是光环也是枷锁。"' },
    lottery_winner: { name: '彩票中奖者', money: 500000, health: 70, mood: 85, intel: 50, social: 30, charm: 55, startJob: '待业中', startSalary: 0, startAge: 25, hidden: true,
        unlockCond: '达成"财务自由"结局后可用',
        intro: '你买彩票中了500万。税后400万，你选了50万给爸妈，剩下的带着去了大城市。\n\n你妈说："别告诉任何人。"你爸说："省着点花。"你说："我知道。"\n\n但中了彩票的人，90%在5年内破产。你知道这个统计数字。\n\n"钱不是万能的，但没有钱是万万不能的。至于多了会怎样——你准备亲自试试。"' },
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
        { id:'beijing_subway', icon:'🚇', title:'北京地铁', body:'早高峰，你在北京地铁里被挤成了照片。你的脚已经离地了，但你还能呼吸——这已经是奇迹。\n\n你看了看周围的人：有人在吃煎饼，有人在刷短视频，有人在闭眼养神。\n\n"北京地铁是北京人的修行：挤进去是技术，挤出来是艺术。"', cond: g => g.city==='beijing' && g.job!=='待业中',
          choices:[
            { label:'买辆电动车', hint:'-💰 +❤️', fn: g => ({money:-3000,health:5,mood:8}) },
            { label:'继续挤地铁', hint:'+❤️', fn: g => ({health:-3,mood:-5}) },
            { label:'搬到公司附近', hint:'-💰 +😊', fn: g => ({money:-2000,mood:10}) },
          ]},
        { id:'beijing_smog', icon:'😷', title:'雾霾来袭', body:'北京又雾霾了。PM2.5爆表，你连对面的楼都看不见。\n\n你戴上口罩，打开空气净化器，看着窗外灰蒙蒙的天空。\n\n"北京的雾霾让人学会了：呼吸也是一种奢侈。"', cond: g => g.city==='beijing' && g.month>=11 && g.month<=2,
          choices:[
            { label:'买高级空气净化器', hint:'-💰 +❤️', fn: g => ({money:-3000,health:8,mood:5}) },
            { label:'戴口罩硬扛', hint:'-❤️', fn: g => ({health:-5,mood:-3}) },
            { label:'去三亚躲几天', hint:'-💰 +😊', fn: g => ({money:-5000,mood:20,health:5}) },
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
        { id:'shanghai_bund', icon:'🌃', title:'外滩夜景', body:'你第一次去外滩，看着对岸的陆家嘴夜景：东方明珠、金茂大厦、上海中心……\n\n你心想：这些楼里有多少人跟你一样，在加班？\n\n你发了条朋友圈："魔都的夜，美得不真实。"\n\n"上海的美，是用加班换来的。"', cond: g => g.city==='shanghai' && g.age<=28,
          choices:[
            { label:'拍照发朋友圈', hint:'+✨ +👥', fn: g => ({charm:8,social:5,mood:10}) },
            { label:'找个酒吧喝一杯', hint:'-💰 +😊', fn: g => ({money:-500,mood:15,charm:3}) },
            { label:'回公司继续加班', hint:'+💰 -❤️', fn: g => ({money:1000,health:-5,mood:-5}) },
          ]},
        { id:'shanghai_fashion', icon:'👗', title:'上海时尚', body:'你在上海街头走了一圈，发现每个人都穿得很时尚。你看了看自己的优衣库——突然觉得有点土。\n\n同事说："在上海，穿搭就是名片。"\n\n"上海人的精致，是从头到脚的。"', cond: g => g.city==='shanghai' && g.charm<60,
          choices:[
            { label:'买几件好看的衣服', hint:'-💰 +✨', fn: g => ({money:-3000,charm:12,mood:8}) },
            { label:'学穿搭', hint:'+✨ +🧠', fn: g => ({charm:8,intel:3,mood:5}) },
            { label:'算了，舒服最重要', hint:'+😊', fn: g => ({mood:5}) },
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
        { id:'shenzhen_tech_expo', icon:'💻', title:'高交会', body:'深圳高交会开幕了，你请假去逛了一圈。\n\nAI、机器人、5G、新能源……你看到了未来的样子。\n\n你也看到了：未来的工作，可能不需要人类。\n\n"深圳的高交会，让你看到了未来——也看到了自己的保质期。"', cond: g => g.city==='shenzhen' && g.intel>50 && g.month>=10 && g.month<=11,
          choices:[
            { label:'学习新技术', hint:'+🧠', fn: g => ({intel:12,mood:8}) },
            { label:'找创业机会', hint:'🎲 +💰', fn: g => { if(Math.random()>0.5){return{money:10000,intel:8,social:8}}else{return{money:-5000,mood:-10}} }},
            { label:'算了，看看就好', hint:'+😊', fn: g => ({mood:5}) },
          ]},
        { id:'shenzhen_huaqiangbei', icon:'🔌', title:'华强北淘货', body:'你去华强北逛了一圈，发现这里的电子产品比淘宝便宜一半。\n\n你心动了：要不要淘点东西，然后挂到闲鱼上卖？\n\n"华强北是中国硅谷的缩影：有梦想，也有山寨。"', cond: g => g.city==='shenzhen' && g.money<30000,
          choices:[
            { label:'淘货卖闲鱼', hint:'🎲 +💰', fn: g => { if(Math.random()>0.4){return{money:5000,intel:5}}else{return{money:-2000,mood:-5}} }},
            { label:'买个便宜手机', hint:'-💰', fn: g => ({money:-800,mood:5}) },
            { label:'算了，不折腾', hint:'+😊', fn: g => ({mood:3}) },
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
        { id:'hangzhou_westlake', icon:'🏞️', title:'西湖漫步', body:'周末你去西湖散步，看到了断桥残雪、雷峰夕照。\n\n你突然觉得：杭州这座城市，真的有诗意。\n\n"杭州的美，在于工作之余，还有西湖和诗。"', cond: g => g.city==='hangzhou' && g.mood<60,
          choices:[
            { label:'拍照发朋友圈', hint:'+✨ +😊', fn: g => ({charm:5,mood:15}) },
            { label:'找个茶馆喝茶', hint:'+😊 +🧠', fn: g => ({mood:12,intel:5,money:-100}) },
            { label:'跑步锻炼', hint:'+❤️ +😊', fn: g => ({health:8,mood:10}) },
          ]},
        { id:'hangzhou_ecommerce', icon:'🛒', title:'电商创业', body:'你在杭州，周围全是做电商的。朋友说："要不你开个淘宝店？"\n\n你算了算：进货、拍照、修图、客服、发货……一个人能干十个人的活。\n\n"杭州的电商创业，比直播还卷。"', cond: g => g.city==='hangzhou' && g.intel>50 && !g.flags.ecommerce,
          choices:[
            { label:'开淘宝店', hint:'🎲 -💰', fn: g => { g.flags.ecommerce=true; if(Math.random()>0.5){return{money:15000,intel:8,mood:10}}else{return{money:-8000,mood:-15}} }},
            { label:'做跨境电商', hint:'🎲 -💰💰', fn: g => { g.flags.ecommerce=true; if(Math.random()>0.6){return{money:30000,intel:12,charm:5}}else{return{money:-15000,mood:-20}} }},
            { label:'算了，打工挺好', hint:'+😊', fn: g => ({mood:5}) },
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
        { id:'guangzhou_food', icon:'🍜', title:'广州美食', body:'你在广州吃了一圈：肠粉、云吞面、煲仔饭、牛杂、双皮奶……\n\n你胖了10斤，但你觉得值。\n\n"广州人的人生哲学：吃好喝好，没烦恼。"', cond: g => g.city==='guangzhou' && g.health<70,
          choices:[
            { label:'继续吃！', hint:'+😊 +❤️ -💰', fn: g => ({mood:15,health:5,money:-500}) },
            { label:'学做粤菜', hint:'+🧠 +😊', fn: g => { g.flags.cookingSkill=true; return{intel:8,mood:10}; }},
            { label:'开始减肥', hint:'+❤️ -😊', fn: g => ({health:10,mood:-5}) },
          ]},
        { id:'guangzhou_canton_fair', icon:'🎪', title:'广交会', body:'广交会开幕了，你朋友拉你去当翻译/兼职。\n\n你发现：这里全是老外，全是生意。\n\n"广交会是广州的名片：世界工厂，就在这里。"', cond: g => g.city==='guangzhou' && g.month===4 || g.month===10,
          choices:[
            { label:'去做兼职', hint:'+💰 +👥 +✨', fn: g => ({money:5000,social:10,charm:8,intel:5}) },
            { label:'去看看热闹', hint:'+🧠 +👥', fn: g => ({intel:5,social:5,mood:5}) },
            { label:'算了，不凑热闹', hint:'+😊', fn: g => ({mood:3}) },
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
        { id:'chengdu_hotpot', icon:'🌶️', title:'成都火锅', body:'你在成都吃火锅，发现这里的人真的能吃辣。\n\n你点了个微辣，结果被辣到怀疑人生。旁边的成都人说："这还不辣？"\n\n"成都的火锅，辣的是味蕾，暖的是人心。"', cond: g => g.city==='chengdu' && g.social<40,
          choices:[
            { label:'挑战特辣', hint:'+❤️ +😊', fn: g => ({health:-3,mood:15,social:8}) },
            { label:'点鸳鸯锅', hint:'+😊', fn: g => ({mood:8,social:3}) },
            { label:'我不吃辣', hint:'-👥', fn: g => ({social:-5,mood:-3}) },
          ]},
        { id:'chengdu_panda', icon:'🐼', title:'成都大熊猫', body:'你去成都大熊猫基地看滚滚了。\n\n你看着大熊猫吃竹子、打滚、睡觉，突然觉得：这才是生活。\n\n"成都的大熊猫，比你活得还滋润。"', cond: g => g.city==='chengdu' && g.mood<50,
          choices:[
            { label:'拍照发朋友圈', hint:'+✨ +😊', fn: g => ({charm:5,mood:15}) },
            { label:'当志愿者', hint:'+😊 +👥 +❤️', fn: g => { g.flags.volunteer=true; return{mood:20,social:10,health:5}; }},
            { label:'买个熊猫公仔', hint:'-💰 +😊', fn: g => ({money:-200,mood:8}) },
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
    // === v2.14 RELATIONSHIP EVENTS ===
    { id:'family_call', icon:'📞', title:'家人的电话',
      body:'你妈又来电话了："吃饭了吗？""穿秋裤了吗？""什么时候回来看看？"\n\n你说"挺好的"，但其实你已经三天没好好吃饭了。\n\n挂了电话，你看着窗外的霓虹灯，突然有点想家。\n\n"家人是你最后的港湾，但你总是在最远的地方。"',
      cond: g => g.months>3 && Math.random()>0.5,
      choices:[
        { label:'周末回家看看', hint:'+👨‍👩‍👧 -💰', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+15, 0, 100); return{mood:15,money:-800}; }},
        { label:'视频聊天半小时', hint:'+👨‍👩‍👧', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+8, 0, 100); return{mood:8}; }},
        { label:'说忙，下次吧', hint:'-👨‍👩‍👧', fn: g => { g.relationships.family = clamp((g.relationships.family||60)-5, 0, 100); return{mood:-5}; }},
      ]},
    { id:'friend_wedding', icon:'💒', title:'朋友的婚礼',
      body:'大学室友要结婚了，发来请帖。\n\n你看了看份子钱的标准：普通朋友500，好朋友1000，死党2000。\n\n你算了算这个月已经参加了两场婚礼了。\n\n"友情不是用金钱衡量的——但份子钱是。"',
      cond: g => g.age>=24 && g.age<=35 && g.months>6,
      choices:[
        { label:'包大红包，友情无价', hint:'-💰 +👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+12, 0, 100); return{money:-2000,mood:10,social:8}; }},
        { label:'随大流，意思意思', hint:'-💰', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+5, 0, 100); return{money:-800,mood:3}; }},
        { label:'找借口不去', hint:'+💰 -👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)-10, 0, 100); return{mood:-8,social:-5}; }},
      ]},
    { id:'colleague_conflict', icon:'⚡', title:'同事矛盾',
      body:'你和同事因为项目分工吵起来了。他觉得你在摸鱼，你觉得他在甩锅。\n\nHR找你们谈话："大家是一个team，要和谐共处。"\n\n你心里想：和谐个鬼，KPI都是各背各的。\n\n"职场没有朋友，只有利益——但有时候利益也会打架。"',
      cond: g => g.job!=='待业中' && g.months>3,
      choices:[
        { label:'主动道歉，大局为重', hint:'+👥 -😊', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)+10, 0, 100); return{mood:-8,social:5}; }},
        { label:'据理力争', hint:'🎲', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)-8, 0, 100); if(Math.random()>0.5){return{mood:10,charm:5}}else{return{mood:-15,social:-5}} }},
        { label:'找领导评理', hint:'🎲', fn: g => { if(Math.random()>0.6){return{mood:10,social:5}}else{g.relationships.colleagues = clamp((g.relationships.colleagues||30)-15, 0, 100);return{mood:-10}} }},
      ]},
    { id:'lonely_holiday', icon:'🎊', title:'一个人的节日',
      body:'又是情人节/七夕/圣诞节。朋友圈里全是秀恩爱的。\n\n你一个人吃了顿火锅，服务员问你："先生/女士，对面还坐人吗？"\n\n你说："坐空气。"\n\n"单身不是罪，是选择——一种被迫的选择。"',
      cond: g => !g.flags.hasPartner && !g.flags.married && (g.month===2 || g.month===8 || g.month===12),
      choices:[
        { label:'下载交友App', hint:'🎲 +👥', fn: g => { if(Math.random()>0.5 && g.charm>40){g.flags.hasPartner=true;g.relationships.partner=50;return{mood:20,charm:5,social:10}}else{return{mood:-5,money:-200}} }},
        { label:'约朋友出来玩', hint:'+👥 +😊', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+8, 0, 100); return{mood:10,social:8,money:-500}; }},
        { label:'一个人也挺好', hint:'+😊 -👥', fn: g => ({mood:5,social:-3}) },
      ]},
    { id:'relationship_crisis', icon:'💔', title:'感情危机',
      body:'你和对象又吵架了。原因是你又在加班，TA觉得你不在乎这段感情。\n\n"你到底是要工作还是要我？"\n\n你想说"两个都要"，但你知道这不是正确答案。\n\n"爱情需要经营，但996的人连自己都经营不好。"',
      cond: g => g.flags.hasPartner && g.relationships.partner < 50 && g.job!=='待业中',
      choices:[
        { label:'请假陪TA', hint:'-💰 +❤️', fn: g => { g.relationships.partner = clamp((g.relationships.partner||0)+20, 0, 100); return{money:-2000,mood:15,health:5}; }},
        { label:'买礼物道歉', hint:'-💰 +❤️', fn: g => { g.relationships.partner = clamp((g.relationships.partner||0)+10, 0, 100); return{money:-1500,mood:8}; }},
        { label:'算了，分手吧', hint:'💔', fn: g => { g.flags.hasPartner=false;g.relationships.partner=0;g.flags.divorced=true; return{mood:-25,social:-10}; }},
      ]},
    { id:'parent_sick', icon:'🏥', title:'父母生病了',
      body:'你接到电话：你爸/妈住院了。不是大病，但需要人照顾几天。\n\n你看了看手头的项目deadline，又看了看机票价格。\n\n"子欲养而亲不待——但请假扣的钱也很痛。"',
      cond: g => g.age>=28 && g.relationships.family > 30,
      choices:[
        { label:'请假回家照顾', hint:'-💰 +👨‍👩‍👧 +😊', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+20, 0, 100); return{money:-3000,mood:15,health:-5}; }},
        { label:'转钱让亲戚帮忙', hint:'-💰 +👨‍👩‍👧', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+5, 0, 100); return{money:-5000,mood:-5}; }},
        { label:'视频问候，工作走不开', hint:'-👨‍👩‍👧 -😊', fn: g => { g.relationships.family = clamp((g.relationships.family||60)-15, 0, 100); return{mood:-20}; }},
      ]},
    // === v2.14 SOCIAL NEWS EVENTS ===
    { id:'kaogong_fever', icon:'📚', title:'考公热',
      body:'你刷朋友圈，发现又有三个同学考上公务员了。\n\n"宇宙的尽头是编制"——这句话最近特别火。\n\n你看了看自己996的工作，又看了看公务员的福利待遇。\n\n考还是不考？这是个问题。\n\n"考公就像围城：外面的人想进去，里面的人想出来——但出来的人很少。"',
      cond: g => g.age>=24 && g.age<=35 && !g.flags.civilServant && g.intel>50,
      choices:[
        { label:'辞职备考公务员', hint:'🎲 -💰 +🧠', fn: g => { setJob(g,'待业中',0); g.flags.kaogongPrep=true; return{mood:-10,intel:10,money:-10000}; }},
        { label:'边工作边备考', hint:'-❤️ +🧠', fn: g => { g.flags.kaogongPrep=true; return{health:-10,intel:8,mood:-5}; }},
        { label:'算了，我适合打拼', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'bride_price', icon:'💍', title:'天价彩礼',
      body:'你要结婚了，但女方家要求30万彩礼+一套房。\n\n你算了算：彩礼30万+房子首付100万+装修30万+婚礼20万=180万。\n\n你的存款：20万。\n\n你妈说："要不把老家的房子卖了？"\n\n"婚姻是爱情的坟墓——但首先，你得买得起墓地。"',
      cond: g => g.flags.hasPartner && g.relationships.partner>60 && g.age>=26 && g.age<=35 && !g.flags.married && !g.flags.hasHouse,
      choices:[
        { label:'借钱凑彩礼结婚', hint:'-💰 +❤️', fn: g => { g.flags.married=true;g.flags.marriedMonths=g.months;g.money-=150000;g.relationships.partner=clamp((g.relationships.partner||0)+10,0,100);g.relationships.family=clamp((g.relationships.family||60)+15,0,100);return{mood:20}; }},
        { label:'跟对方商量降低', hint:'🎲', fn: g => { if(Math.random()>0.5){g.flags.married=true;g.money-=50000;g.relationships.partner=clamp((g.relationships.partner||0)+5,0,100);return{mood:15}}else{g.relationships.partner=clamp((g.relationships.partner||0)-20,0,100);return{mood:-20}} }},
        { label:'分手，结不起', hint:'💔', fn: g => { g.flags.hasPartner=false;g.relationships.partner=0;return{mood:-30,social:-10}; }},
      ]},
    { id:'housing_crisis', icon:'🏚️', title:'烂尾楼风波',
      body:'你看到新闻：某楼盘烂尾了，业主们集体停贷。\n\n你瑟瑟发抖——虽然你还没买房，但这让你更不敢买了。\n\n"买房前你是甲方，买房后你是孙子——烂尾楼业主连孙子都不如。"',
      cond: g => g.age>=25 && !g.flags.hasHouse && g.money>100000,
      choices:[
        { label:'还是租房安全', hint:'+😊', fn: g => ({mood:10}) },
        { label:'研究现房/二手房', hint:'+🧠', fn: g => ({intel:8,mood:-5}) },
        { label:'继续观望', hint:'', fn: g => ({mood:-3}) },
      ]},
    { id:'education_bubble', icon:'🎓', title:'学历贬值',
      body:'你看到一个新闻：某985硕士去送外卖了。\n\n评论区炸了：\n"读书有什么用？"\n"学历不如一张外卖平台优惠券。"\n"知识改变命运——改成送外卖的命运。"\n\n你看了看自己的学历证书，突然觉得它更像一张收据。\n\n"学历是敲门砖，但门后面还有门，门后面还是门。"',
      cond: g => g.age>=23 && g.age<=32,
      choices:[
        { label:'继续深造读博', hint:'-💰 +🧠', fn: g => { g.flags.phdStudent=true; return{money:-50000,intel:20,mood:-10}; }},
        { label:'学实用技能', hint:'+🧠 +💰', fn: g => ({intel:12,money:5000,mood:5}) },
        { label:'认命了', hint:'-😊', fn: g => ({mood:-10}) },
      ]},
    { id:'middle_age_anxiety', icon:'😰', title:'35岁危机',
      body:'你快35岁了。互联网行业的"35岁魔咒"让你焦虑不已。\n\n猎头说："35岁以上的简历，很多公司系统自动过滤。"\n\n你看了看镜子里的自己：发际线后移，黑眼圈加深，肚子微微隆起。\n\n"35岁是职场的保质期——过了这个期，你就是临期商品。"',
      cond: g => g.age>=33 && g.age<=37 && g.job!=='待业中' && !g.flags.middleAgeAnxiety,
      choices:[
        { label:'转型管理岗', hint:'🎲 +🧠', fn: g => { g.flags.middleAgeAnxiety=true; if(Math.random()>0.4){setJob(g,'管理岗',Math.floor(g.jobSalary*1.5));return{mood:15,intel:10}}else{return{mood:-15}} }},
        { label:'发展副业Plan B', hint:'+💰 +🧠', fn: g => { g.flags.middleAgeAnxiety=true; g.flags.sideHustle=true; return{money:10000,intel:8,mood:5}; }},
        { label:'焦虑但继续996', hint:'-❤️ -😊', fn: g => { g.flags.middleAgeAnxiety=true; return{health:-10,mood:-15}; }},
      ]},
    { id:'digital_detox', icon:'📵', title:'数字戒断',
      body:'你发现自己每天刷手机超过8小时。抖音、小红书、微博、B站——你的注意力被切割成碎片。\n\n你试着放下手机一天，结果：焦虑、手痒、幻听（总觉得手机在响）。\n\n"你以为你在玩手机，其实是手机在玩你。"',
      cond: g => g.mood<50 && g.intel>40,
      choices:[
        { label:'开始数字戒断', hint:'+🧠 +😊 -👥', fn: g => { g.flags.digitalDetox=true; return{intel:10,mood:15,social:-5,health:5}; }},
        { label:'限制使用时间', hint:'+🧠 +😊', fn: g => ({intel:5,mood:8,health:3}) },
        { label:'算了，离不开', hint:'-🧠', fn: g => ({intel:-3,mood:-5}) },
      ]},
    { id:'involution_vs_lyingflat', icon:'⚔️', title:'内卷还是躺平',
      body:'网上又在吵"内卷vs躺平"。\n\n内卷派："不卷怎么活？"\n躺平派："卷不动了，爱咋咋地。"\n\n你夹在中间：卷也卷不赢，躺也躺不平。\n\n"45度人生——既没有90度的拼搏，也没有0度的躺平。"',
      cond: g => g.age>=22 && g.age<=35,
      choices:[
        { label:'选择内卷', hint:'+💰 -❤️', fn: g => { g.flags.choseInvolution=true; return{money:8000,health:-8,mood:-5,intel:5}; }},
        { label:'选择躺平', hint:'+😊 -💰', fn: g => { g.flags.lyingFlat=true; g.flags.choseLyingFlat=true; return{mood:15,health:8,money:-3000}; }},
        { label:'45度人生', hint:'', fn: g => ({mood:5,health:3,intel:3}) },
      ]},
    { id:'friends_drift_apart', icon:'🌊', title:'渐行渐远的朋友',
      body:'你翻看手机通讯录，发现很多曾经的好朋友已经很久没联系了。\n\n你试着约了一个老朋友吃饭，结果发现：除了回忆过去，你们已经没什么可聊的了。\n\n"朋友不是消失了，只是被生活冲淡了。"',
      cond: g => g.months>24 && g.relationships.friends < 50,
      choices:[
        { label:'主动联系老朋友们', hint:'+👥 -💰', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+15, 0, 100); return{social:10,mood:12,money:-500}; }},
        { label:'接受现实', hint:'-👥 +😊', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)-5, 0, 100); return{mood:5}; }},
        { label:'交新朋友', hint:'+👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+8, 0, 100); return{social:8,mood:5,money:-300}; }},
      ]},
    // === v2.15 MORE RANDOM EVENTS ===
    { id:'roommate_drama', icon:'🏠', title:'室友矛盾',
      body:'你的室友又搞事情了：凌晨3点打游戏开语音、带对象回来过夜不提前说、用了你的锅还不洗。\n\n你想搬走，但押金还没到期。你想忍忍，但忍字头上一把刀。\n\n"合租就像婚姻：需要磨合，也需要底线。"',
      cond: g => !g.flags.hasHouse && g.age<35 && Math.random()>0.5,
      choices:[
        { label:'开诚布公谈一谈', hint:'🎲 +👥', fn: g => { if(Math.random()>0.4){return{mood:15,social:5}}else{return{mood:-10,social:-5}} }},
        { label:'忍到租期结束', hint:'-😊', fn: g => ({mood:-10,health:-3}) },
        { label:'直接搬走', hint:'-💰 +😊', fn: g => ({money:-5000,mood:15,health:5}) },
      ]},
    { id:'impulse_buy', icon:'🛍️', title:'冲动消费',
      body:'双十一/618来了，你的购物车已经塞满了"可能有用"的东西。\n\n空气炸锅、筋膜枪、投影仪、Switch、Kindle……\n\n你知道这些东西大概率会吃灰，但折扣实在太诱人了。\n\n"你以为你在省钱，其实你在花钱。"',
      cond: g => (g.month===6 || g.month===11) && g.money>5000,
      choices:[
        { label:'清空购物车！', hint:'-💰 +😊', fn: g => ({money:-8000,mood:20,charm:5}) },
        { label:'只买最需要的', hint:'-💰 +🧠', fn: g => ({money:-2000,mood:8,intel:3}) },
        { label:'什么都不买', hint:'+💰 +🧠', fn: g => ({money:500,intel:5,mood:-5}) },
      ]},
    { id:'health_check', icon:'🏥', title:'年度体检',
      body:'公司组织年度体检。你拿到报告，发现好几项指标都亮了黄灯：血脂偏高、尿酸偏高、颈椎曲度变直。\n\n医生说："年轻人，要注意饮食和作息了。"\n\n你点点头，然后中午又点了一份黄焖鸡米饭。\n\n"体检报告是成年人的成绩单——大部分人都不及格。"',
      cond: g => g.job!=='待业中' && g.months>6 && g.month===3,
      choices:[
        { label:'开始健康生活', hint:'+❤️ +😊', fn: g => { g.flags.healthyLifestyle=true; return{health:15,mood:10,money:-2000}; }},
        { label:'买保健品', hint:'-💰 +❤️', fn: g => ({money:-3000,health:5,mood:-3}) },
        { label:'假装没看到', hint:'-❤️', fn: g => ({health:-10,mood:-5}) },
      ]},
    { id:'nostalgia', icon:'📷', title:'怀旧时刻',
      body:'你翻到了一张老照片：大学毕业时的合影。大家都笑得很灿烂，眼里都是对未来的期待。\n\n你打开同学群，发现大家已经各奔东西：有人在大厂996，有人在老家考公，有人已经结婚生子。\n\n"青春是一本太仓促的书，我们含着泪一读再读。"',
      cond: g => g.age>=25 && g.age<=35,
      choices:[
        { label:'组织同学聚会', hint:'-💰 +👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+10, 0, 100); return{social:10,mood:15,money:-1000}; }},
        { label:'给老朋友打个电话', hint:'+😊', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+5, 0, 100); return{mood:10}; }},
        { label:'收起照片继续生活', hint:'+🧠', fn: g => ({intel:3,mood:5}) },
      ]},
    { id:'weekend_dilemma', icon:'🎯', title:'周末怎么过',
      body:'又是一个周末。你躺在床上刷手机，发现朋友圈里：\n- 同事A在爬山\n- 朋友B在咖啡厅看书\n- 同学C在学烘焙\n- 你：躺着刷他们的朋友圈\n\n"周末是大城市人的奢侈品——但很多人不知道怎么花。"',
      cond: g => g.job!=='待业中' && g.mood<60,
      choices:[
        { label:'出去走走', hint:'+❤️ +😊', fn: g => ({health:8,mood:12,money:-200}) },
        { label:'学个新技能', hint:'+🧠', fn: g => ({intel:8,mood:5,money:-500}) },
        { label:'继续躺着', hint:'+❤️ -😊', fn: g => ({health:5,mood:-3}) },
      ]},
    { id:'online_argument', icon:'💬', title:'网络对线',
      body:'你在微博/知乎上和网友吵起来了。话题是关于"年轻人该不该买房"。\n\n你打了500字的回复，又删了，又写了800字，又删了。最后发了句："你是对的。"\n\n"网上吵架，赢了也是输。"',
      cond: g => g.intel>40 && Math.random()>0.5,
      choices:[
        { label:'据理力争', hint:'-😊 -🧠', fn: g => ({mood:-10,intel:-3,health:-2}) },
        { label:'一笑而过', hint:'+🧠 +😊', fn: g => ({intel:3,mood:5}) },
        { label:'卸载App', hint:'+🧠 +❤️', fn: g => ({intel:5,health:3,mood:8}) },
      ]},
    { id:'found_money', icon:'💵', title:'意外之财',
      body:'你在路上捡到了一个信封，里面有2000块钱和一张名片。\n\n你站在原地犹豫了5分钟：是交给警察，还是……\n\n"道德和贫穷之间，有时候只隔着一个信封的距离。"',
      cond: g => Math.random()>0.7 && g.money<30000,
      choices:[
        { label:'交给警察', hint:'+😊 +✨', fn: g => ({mood:15,charm:10,social:3}) },
        { label:'联系失主归还', hint:'+😊 +👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+5, 0, 100); return{mood:20,social:8,charm:5}; }},
        { label:'……', hint:'+💰 -😊', fn: g => ({money:2000,mood:-15,charm:-5}) },
      ]},
    { id:'mentor_encounter', icon:'🧓', title:'遇见前辈',
      body:'你在咖啡厅遇到了一位行业前辈。你们聊了起来，他分享了很多经验。\n\n"年轻人，我当年也跟你一样迷茫。后来我发现：迷茫不可怕，不行动才可怕。"\n\n你加了前辈的微信，他说有事可以随时联系。\n\n"有些话，年轻人听不进去——直到自己也变成了前辈。"',
      cond: g => g.age>=25 && g.age<=35 && g.intel>50,
      choices:[
        { label:'定期请教学习', hint:'+🧠 +👥', fn: g => ({intel:12,social:8,mood:10}) },
        { label:'请前辈吃饭', hint:'-💰 +👥', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)+10, 0, 100); return{social:10,mood:8,money:-500}; }},
        { label:'只是客套一下', hint:'', fn: g => ({mood:3}) },
      ]},
    { id:'rent_increase', icon:'📈', title:'房租涨了',
      body:'房东发来消息："下个月开始房租涨500。"\n\n你问为什么，他说："市场价就是这样。"\n\n你看了看周边的房价，他说的是实话——但你的工资没涨。\n\n"房租是大城市最大的税——而且你还没法抵税。"',
      cond: g => !g.flags.hasHouse && g.months>12 && Math.random()>0.5,
      choices:[
        { label:'接受涨价', hint:'-💰', fn: g => ({mood:-10}) },
        { label:'换个便宜的房子', hint:'-💰 +😊', fn: g => ({money:-3000,mood:5,health:-3}) },
        { label:'找室友分摊', hint:'+👥 -😊', fn: g => ({social:5,mood:-5}) },
      ]},
    { id:'skill_certification', icon:'📜', title:'考证热',
      body:'同事们都开始考证了：PMP、AWS认证、CFA、CPA……\n\n你也心动了：多个证，多条路？还是说这只是另一种形式的内卷？\n\n"证多不压身——但考证压钱包和头发。"',
      cond: g => g.age>=24 && g.age<=40 && g.intel>50 && g.job!=='待业中',
      choices:[
        { label:'报班考证', hint:'-💰 +🧠', fn: g => ({money:-10000,intel:15,mood:-5,health:-5}) },
        { label:'自学试试', hint:'+🧠', fn: g => ({intel:8,mood:3}) },
        { label:'算了，没时间', hint:'', fn: g => ({mood:-3}) },
      ]},
    // === v2.16 CHAINED EVENTS ===
    { id:'stray_cat', icon:'🐱', title:'流浪猫',
      body:'你下班路上遇到一只流浪猫。它脏兮兮的，但眼睛亮晶晶的，一直蹭你的腿。\n\n你蹲下来摸了摸它，它发出满足的呼噜声。\n\n"大城市里，人和猫一样——都在寻找一个家。"',
      cond: g => !g.flags.hasPet && g.age>=23 && g.age<=40 && Math.random()>0.5,
      choices:[
        { label:'带它回家', hint:'-💰 +😊', fn: g => ({money:-500,mood:20,health:5,nextEvent: g => ({
            id:'cat_settled', icon:'🐱', title:'新室友',
            body:'你把流浪猫带回了家。给它洗了澡，发现它其实是一只漂亮的橘猫。\n\n你给它取名"大黄"。它很快霸占了你的床、你的沙发、你的键盘。\n\n你发了条朋友圈："从此，我也是有猫的人了。"\n\n"猫是最好的室友——不吵、不闹、不借钱。"',
            choices:[
                { label:'买猫粮猫砂', hint:'-💰', fn: g => { g.flags.hasPet=true; return{money:-1000,mood:10}; }},
                { label:'自制猫饭', hint:'+🧠 -💰', fn: g => { g.flags.hasPet=true; return{money:-300,mood:8,intel:3}; }},
            ]})}),
        },
        { label:'给它买点吃的', hint:'-💰 +😊', fn: g => ({money:-50,mood:8}) },
        { label:'走开，养不起自己', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'mystery_call', icon:'📞', title:'神秘来电',
      body:'你接到了一个陌生号码的电话。\n\n"你好，请问是XXX吗？我们是XX公司的人力资源部，看到您的简历非常匹配我们的高级岗位……"\n\n你最近没投简历啊？难道是脉脉上有人看了你？\n\n"被猎头找上门——是能力被认可，还是信息被泄露？"',
      cond: g => g.job!=='待业中' && g.age>=25 && g.intel>55 && g.months>12,
      choices:[
        { label:'听听是什么机会', hint:'🎲', fn: g => {
            if (Math.random()>0.4) {
                return {mood:5,intel:3,nextEvent: g => ({
                    id:'headhunter_offer', icon:'💼', title:'猎头推荐',
                    body:'猎头给你推荐了一个不错的机会：薪资涨幅40%，但公司刚拿到B轮，有点卷。\n\n"跳槽的最佳时机是有人挖你的时候——最差的时候也是。"',
                    choices:[
                        { label:'去面试看看', hint:'🎲 +💰', fn: g => { if(Math.random()>0.3){const s=Math.floor(g.jobSalary*1.4);setJob(g,getTitle(g,'senior'),s);return{money:10000,mood:15}}else{return{mood:-10}} }},
                        { label:'算了，现在挺好', hint:'+😊', fn: g => ({mood:5}) },
                    ]})};
            } else {
                return {mood:-5,nextEvent: g => ({
                    id:'scam_call', icon:'⚠️', title:'诈骗电话',
                    body:'对方话锋一转："您的账户存在异常，需要配合调查……"\n\n你冷笑一声：这套路太老了。\n\n"防骗第一课：凡是自称公检法的，都是骗子。"',
                    choices:[
                        { label:'直接挂断', hint:'+🧠', fn: g => ({intel:5,mood:5}) },
                        { label:'调戏骗子', hint:'+😊', fn: g => ({mood:10,health:-2}) },
                    ]})};
            }
        }},
        { label:'直接挂断', hint:'+😊', fn: g => ({mood:3}) },
      ]},
    { id:'old_classmate', icon:'🎓', title:'老同学聚会',
      body:'大学班长在群里发了聚会通知。你犹豫了：去的话要花钱，不去的话又怕错过人脉。\n\n"同学聚会的真相：混得好的在炫耀，混得差的在尴尬，混得一般的在装傻。"',
      cond: g => g.age>=26 && g.age<=38 && g.months>24,
      choices:[
        { label:'参加聚会', hint:'-💰 +👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+12, 0, 100); return{money:-800,social:10,mood:5,nextEvent: g => ({
            id:'classmate_business', icon:'🤝', title:'合作机会',
            body:'聚会上，一个混得不错的老同学找到你："我最近在创业，想找人合作，你有兴趣吗？"\n\n他说的项目听起来挺靠谱，但你也知道：和熟人合伙，容易伤感情。\n\n"生意场上最忌讳的事：和亲戚朋友合伙。"',
            choices:[
                { label:'考虑合作', hint:'🎲', fn: g => { if(Math.random()>0.5){g.flags.sideHustle=true;return{money:15000,mood:15,social:10}}else{return{money:-5000,mood:-15}} }},
                { label:'婉拒', hint:'+😊', fn: g => ({mood:5,social:-3}) },
            ]})};
        }},
        { label:'找个借口不去', hint:'+💰 -👥', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)-5, 0, 100); return{mood:-3,social:-5}; }},
      ]},
    // === v2.18 MORE EVENTS ===
    { id:'side_project', icon:'💡', title:'副业想法',
      body:'你看到一个帖子："程序员下班后靠副业月入3万"。\n\n你心动了：做独立开发？写技术博客？还是做做自媒体？\n\n但你也知道：副业听起来很美，做起来很难。\n\n"副业的真相：用8小时换来的钱，可能还不如加班费。"',
      cond: g => g.job!=='待业中' && g.intel>55 && g.age>=24 && g.age<=40 && !g.flags.sideHustle,
      choices:[
        { label:'开始做副业', hint:'🎲 -❤️ +💰', fn: g => { g.flags.sideHustle=true; if(Math.random()>0.4){return{money:8000,mood:10,health:-5}}else{return{money:-3000,mood:-10,health:-8}} }},
        { label:'先学习再说', hint:'+🧠', fn: g => ({intel:8,mood:3}) },
        { label:'算了，太累了', hint:'+❤️', fn: g => ({health:5,mood:-3}) },
      ]},
    { id:'work_burnout_warning', icon:'⚠️', title:'身体警报',
      body:'你在工位上突然感到一阵眩晕。心跳加速，眼前发黑。\n\n你赶紧坐下来休息，过了几分钟才缓过来。\n\n同事关心地问："你没事吧？要不要去医院？"\n\n"身体发出的警报，比任何KPI都重要。"',
      cond: g => g.health<40 && g.job!=='待业中' && g.consecutiveOvertime>6,
      choices:[
        { label:'去医院检查', hint:'-💰 +❤️', fn: g => ({money:-2000,health:15,mood:5}) },
        { label:'请假休息几天', hint:'+❤️ -💰', fn: g => ({health:20,mood:10,money:-3000}) },
        { label:'撑一撑就过去了', hint:'-❤️ -❤️', fn: g => ({health:-15,mood:-10}) },
      ]},
    { id:'investment_opportunity', icon:'📈', title:'投资机会',
      body:'朋友给你推荐了一个投资项目：年化收益15%，说是稳赚不赔。\n\n你有点心动，但也有点怀疑：真有这种好事？\n\n"投资有风险，入市需谨慎。但最大的风险是——什么都不投。"\n\n（或者最大的风险是——什么都投。）',
      cond: g => g.money>30000 && g.intel>45 && !g.flags.invested,
      choices:[
        { label:'投10万试试', hint:'🎲 -💰', fn: g => { g.flags.invested=true; if(Math.random()>0.5){return{money:15000,mood:20,intel:5}}else{return{money:-10000,mood:-20}} }},
        { label:'先学习理财知识', hint:'+🧠', fn: g => ({intel:10,mood:5}) },
        { label:'不投，太危险了', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'family_pressure', icon:'📞', title:'催婚电话',
      body:'你妈又来电话了："你都XX岁了，怎么还不找对象？"\n\n"隔壁老李家的儿子都生二胎了。"\n\n"你是不是有什么问题？要不要回来相亲？"\n\n你深吸一口气，默默把手机调成静音。\n\n"催婚是中国家长的必修课——但孩子永远不想上这门课。"',
      cond: g => g.age>=26 && g.age<=38 && !g.flags.married && !g.flags.hasPartner,
      choices:[
        { label:'答应去相亲', hint:'🎲 +👨‍👩‍👧', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+8, 0, 100); if(Math.random()>0.5 && g.charm>40){g.flags.hasPartner=true;g.relationships.partner=40;return{mood:15,social:5}}else{return{mood:-5,money:-200}} }},
        { label:'解释自己的计划', hint:'+🧠 +👨‍👩‍👧', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+5, 0, 100); return{intel:3,mood:5}; }},
        { label:'敷衍过去', hint:'-👨‍👩‍👧', fn: g => { g.relationships.family = clamp((g.relationships.family||60)-5, 0, 100); return{mood:-3}; }},
      ]},
    { id:'moving_day', icon:'📦', title:'搬家日',
      body:'你又搬家了。这已经是大城市生活的第N次搬家。\n\n打包行李的时候，你翻出了很多"回忆"：第一份工作的工牌、前女友/男友送的礼物、大学时的笔记……\n\n每一样东西都是一段故事，但你没有空间留下它们全部。\n\n"大城市教会你的第一件事：断舍离。"',
      cond: g => !g.flags.hasHouse && g.months>12 && g.months%18===0,
      choices:[
        { label:'扔掉不需要的东西', hint:'+😊 +🧠', fn: g => ({mood:10,intel:5,health:3}) },
        { label:'都留着，都是回忆', hint:'-😊', fn: g => ({mood:-5}) },
        { label:'搬到更好的房子', hint:'-💰 +😊', fn: g => ({money:-5000,mood:15,health:5}) },
      ]},
    { id:'weekend_trip', icon:'🏖️', title:'周末短途旅行',
      body:'你看到朋友圈有人去周边城市玩了：苏州的园林、杭州的西湖、南京的夫子庙……\n\n你心动了：要不要周末也出去玩一趟？\n\n但算了算：高铁票+酒店+吃喝，至少1000块。\n\n"旅行的意义不是去哪里，而是离开这里。"',
      cond: g => g.job!=='待业中' && g.mood<60 && g.money>5000,
      choices:[
        { label:'去！生活需要调剂', hint:'-💰 +😊 +❤️', fn: g => ({money:-1500,mood:20,health:8,charm:3}) },
        { label:'周边公园走走就好', hint:'+😊 +❤️', fn: g => ({mood:10,health:5}) },
        { label:'算了，省钱要紧', hint:'+💰 -😊', fn: g => ({money:500,mood:-5}) },
      ]},
    { id:'work_anniversary', icon:'🎂', title:'工作周年',
      body:'今天是你在这家公司工作满X周年的日子。\n\nHR发了一封全员邮件："感谢大家的辛勤付出！"\n\n你的"奖励"是：又老了一岁，又多了几根白发。\n\n"工作的意义是什么？——大概是为了发这条朋友圈。"',
      cond: g => g.job!=='待业中' && g.months>12 && g.months%12===0,
      choices:[
        { label:'发个朋友圈纪念一下', hint:'+✨ +😊', fn: g => ({charm:5,mood:8}) },
        { label:'请同事们喝奶茶', hint:'-💰 +👥', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)+10, 0, 100); return{money:-500,social:8,mood:5}; }},
        { label:'什么也不做', hint:'', fn: g => ({mood:3}) },
      ]},
    { id:'midnight_thoughts', icon:'🌙', title:'深夜思考',
      body:'凌晨2点，你睡不着。\n\n你开始想：我来大城市到底是为了什么？是为了钱？为了梦想？还是为了证明自己？\n\n你看了看天花板，又看了看手机里的余额。\n\n"深夜的思考最真实，也最没用——因为明天你还是要上班。"',
      cond: g => g.mood<50 && g.age>=25,
      choices:[
        { label:'写日记记录心情', hint:'+🧠 +😊', fn: g => ({intel:5,mood:10}) },
        { label:'给朋友打电话倾诉', hint:'+👥 +😊', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+8, 0, 100); return{social:8,mood:12}; }},
        { label:'算了，继续刷手机', hint:'-❤️', fn: g => ({health:-5,mood:-3}) },
      ]},
    { id:'salary_negotiation', icon:'💰', title:'谈涨薪',
      body:'你已经在这家公司干了快两年了，但工资只涨了10%。\n\n你决定找老板谈谈涨薪。\n\n老板说："公司现在很困难，等明年再说吧。"\n\n你知道这话你已经听了两遍了。\n\n"涨薪不是求来的，是跳出来的。"',
      cond: g => g.job!=='待业中' && g.months>18 && g.jobSalary<20000,
      choices:[
        { label:'坚持要求涨薪', hint:'🎲', fn: g => { if(Math.random()>0.5){const raise=Math.floor(g.jobSalary*0.2);g.jobSalary+=raise;return{money:raise*3,mood:15}}else{return{mood:-15,social:-5}} }},
        { label:'准备跳槽', hint:'+💰 +🧠', fn: g => ({intel:5,mood:5,social:3}) },
        { label:'算了，先这样吧', hint:'-😊', fn: g => ({mood:-10}) },
      ]},
    { id:'health_app', icon:'⌚', title:'健康追踪',
      body:'你买了一个智能手表，开始追踪健康数据。\n\n步数：3000步（目标是10000）\n睡眠：5小时（目标是8小时）\n心率：静息75（偏高）\n\n你看着数据，叹了口气：原来自己活得这么不健康。\n\n"数据不会说谎——但看了数据的人会选择忽视。"',
      cond: g => g.age>=24 && g.health<70 && g.money>3000,
      choices:[
        { label:'开始健康生活', hint:'+❤️ +😊 -💰', fn: g => { g.flags.healthyLifestyle=true; return{health:15,mood:10,money:-1500}; }},
        { label:'买更多健康设备', hint:'-💰 +❤️', fn: g => ({money:-2000,health:5,mood:3}) },
        { label:'算了，眼不见心不烦', hint:'-❤️', fn: g => ({health:-5,mood:-3}) },
      ]},
    // ===== v2.21: SOCIAL NEWS EXPANSION =====
    { id:'mortgage_default', icon:'🏚️', title:'断供危机',
      body:'你买的房子跌价了。当初300万买的，现在只值200万。\n\n更糟的是：你失业了，房贷每月15000，已经三个月没交。\n\n银行打来电话："再不还款，我们就拍卖房子。"\n\n你算了一下：卖掉房子还要倒贴银行50万。\n\n"房子是资产？不，房子是负债——而且是你最大的负债。"',
      cond: g => g.flags.hasHouse && g.money<-20000 && !g.flags.mortgageDefault,
      choices:[
        { label:'跟银行协商延期', hint:'🎲 +🧠', fn: g => { g.flags.mortgageDefault=true; if(Math.random()>0.5){return{mood:10,intel:5}}else{return{mood:-20,money:-10000}} }},
        { label:'卖掉房子止损', hint:'-💰💰 +😊', fn: g => { g.flags.mortgageDefault=true; g.flags.hasHouse=false; return{money:-80000,mood:15,health:-10}; }},
        { label:'断供，让银行收走', hint:'-💰 -😊', fn: g => { g.flags.mortgageDefault=true; g.flags.hasHouse=false; return{money:-50000,mood:-30,social:-10,health:-15}; }},
        { label:'借钱硬撑', hint:'-💰 -❤️', fn: g => { g.flags.mortgageDefault=true; return{money:-30000,health:-10,mood:-15}; }},
      ]},
    { id:'unfinished_building', icon:'🏗️', title:'烂尾楼维权',
      body:'你买的期房烂尾了。开发商跑路，工地停工，你的100万首付打了水漂。\n\n你加入维权群，发现里面有300多人，有人已经等了3年。\n\n你们去售楼处拉横幅，被保安赶了出来。你们去政府上访，被"维稳"了。\n\n"你买的不是房子，是薛定谔的房子——在交房之前，它既存在又不存在。"',
      cond: g => g.flags.hasHouse && !g.flags.unfinishedBuilding && g.age>=28 && Math.random()>0.6,
      choices:[
        { label:'坚持维权', hint:'+👥 -😊 -❤️', fn: g => { g.flags.unfinishedBuilding=true; g.relationships.friends = clamp((g.relationships.friends||40)+10, 0, 100); return{social:10,mood:-25,health:-10,money:-50000}; }},
        { label:'认栽，重新攒钱', hint:'+🧠 -💰', fn: g => { g.flags.unfinishedBuilding=true; g.flags.hasHouse=false; return{intel:10,mood:-20,money:-100000}; }},
        { label:'找律师打官司', hint:'-💰 🎲', fn: g => { g.flags.unfinishedBuilding=true; g.flags.hasHouse=false; if(Math.random()>0.7){return{money:-20000,mood:10,intel:8}}else{return{money:-150000,mood:-30}} }},
      ]},
    { id:'youth_unemployment', icon:'📊', title:'青年失业率',
      body:'新闻说：青年失业率已经超过20%。也就是说，每5个年轻人里就有1个找不到工作。\n\n你看了看自己的简历：985本科、3年工作经验、掌握5种技能。\n\n你投了100份简历，收到3个面试，0个offer。\n\nHR说："你很优秀，但我们想要更年轻的——更便宜的。"\n\n"你不是找不到工作，是找不到配得上你的工作。"',
      cond: g => g.job==='待业中' && g.age>=22 && g.age<=30 && g.intel>60,
      choices:[
        { label:'降低预期，先干着', hint:'+💰 -😊', fn: g => { g.flags.tookOffGown=true; setJob(g,'外卖骑手',6000); return{mood:-10,health:5}; }},
        { label:'继续找，不将就', hint:'+😊 -💰', fn: g => ({mood:5,money:-5000}) },
        { label:'考公务员', hint:'+🧠 -💰', fn: g => { g.flags.kaogongPrep=true; return{intel:10,mood:-5,money:-3000}; }},
        { label:'回家啃老', hint:'+😊 -✨', fn: g => { g.flags.fullTimeChild=true; return{mood:10,charm:-10,social:-5}; }},
      ]},
    { id:'kong_yiji', icon:'👔', title:'孔乙己的长衫',
      body:'你在网上看到一篇文章："孔乙己的长衫，是当代年轻人的枷锁。"\n\n你读了985，学了金融，但你找不到对口的工作。你不愿意做"低端"工作，但"高端"工作不要你。\n\n你妈说："读了那么多书，连个工作都找不到？"\n\n你想说：不是找不到，是不想将就。\n\n"学历是孔乙己的长衫，脱不下是面子，脱下了是生活。"',
      cond: g => g.background==='cs' || g.background==='liberal' || g.background==='returnee' && g.job==='待业中' && g.age>=24 && !g.flags.tookOffGown,
      choices:[
        { label:'脱下长衫，脚踏实地', hint:'+💰 +🧠 -✨', fn: g => { g.flags.tookOffGown=true; setJob(g,'社区运营',7000); return{intel:5,mood:10,charm:-5}; }},
        { label:'继续穿长衫，等机会', hint:'+😊 -💰', fn: g => ({mood:5,money:-8000}) },
        { label:'考研/留学镀金', hint:'-💰 +🧠', fn: g => ({money:-50000,intel:15,mood:-10}) },
        { label:'做自媒体，知识变现', hint:'🎲 +✨', fn: g => { if(Math.random()>0.6){g.flags.influencer=true;return{money:10000,charm:15,mood:15}}else{return{money:-5000,mood:-10}} }},
      ]},
    { id:'full_time_child', icon:'🏠', title:'全职儿女',
      body:'你辞职了，回了老家。你妈给你做饭，你爸给你零花钱。\n\n你每天的生活：睡到自然醒，刷手机，看剧，偶尔帮爸妈做家务。\n\n邻居问："你孩子在哪里工作？"\n你妈说："在家休息呢。"\n\n你听到了，心里一酸。\n\n"全职儿女不是啃老，是gap year——无限期的gap year。"',
      cond: g => g.flags.fullTimeChild && !g.flags.fullTimeChildHandled && g.age>=24 && g.age<=32,
      choices:[
        { label:'开始学技能，准备复出', hint:'+🧠 +😊', fn: g => { g.flags.fullTimeChildHandled=true; return{intel:12,mood:10,health:5}; }},
        { label:'帮爸妈开店，积累经验', hint:'+💰 +👥', fn: g => { g.flags.fullTimeChildHandled=true; g.flags.entrepreneur=true; return{money:8000,social:10,mood:8}; }},
        { label:'继续躺平', hint:'+😊 -💰', fn: g => { g.flags.fullTimeChildHandled=true; g.flags.lyingFlat=true; return{mood:15,money:-5000,social:-10}; }},
        { label:'考公务员', hint:'+🧠 -💰', fn: g => { g.flags.fullTimeChildHandled=true; g.flags.kaogongPrep=true; return{intel:10,mood:-5,money:-3000}; }},
      ]},
    { id:'kaogong_fever', icon:'📚', title:'考公上岸',
      body:'你准备了1年，终于考上了公务员。\n\n当你在公示名单上看到自己的名字时，你哭了。\n\n你妈在电话里说："终于稳定了，妈放心了。"\n\n你的同学说："恭喜你，铁饭碗。"\n\n你想说：这不是铁饭碗，是金饭碗——在这个不确定的时代。\n\n"宇宙的尽头是编制——但编制不是宇宙的终点。"',
      cond: g => g.flags.kaogongPrep && !g.flags.civilServant && g.age>=24 && g.intel>65 && Math.random()>0.4,
      choices:[
        { label:'接受，开始体制内生活', hint:'+💰 +😊 +🧠', fn: g => { g.flags.civilServant=true; setJob(g,'公务员',9000); g.relationships.family = clamp((g.relationships.family||60)+15, 0, 100); return{mood:25,money:5000,intel:5,social:10}; }},
        { label:'放弃，还是想去大厂', hint:'+💰 -😊', fn: g => { return{money:3000,mood:-10}; }},
      ]},
    { id:'workplace_pua', icon:'😤', title:'职场PUA',
      body:'你的领导又开始了："你这个年纪，不努力就废了。""别人都能加班，为什么你不行？""公司给你机会，你要感恩。"\n\n你开始怀疑：是不是我真的不行？是不是我太矫情了？\n\n你查了一下"职场PUA"的定义：通过贬低、否定、打压来控制员工。\n\n"PUA不只是在恋爱里，职场里更常见——而且你还不能分手。"',
      cond: g => g.job!=='待业中' && g.mood<50 && g.age>=23 && g.age<=35 && !g.flags.workplacePUA,
      choices:[
        { label:'收集证据，准备仲裁', hint:'+🧠 +👥', fn: g => { g.flags.workplacePUA=true; return{intel:10,social:5,mood:5}; }},
        { label:'骑驴找马，准备跳槽', hint:'+💰 +😊', fn: g => { g.flags.workplacePUA=true; return{money:5000,mood:10,intel:5}; }},
        { label:'硬刚，当场怼回去', hint:'+😊 -👥', fn: g => { g.flags.workplacePUA=true; return{mood:20,social:-15,charm:5}; }},
        { label:'忍着，为了房贷', hint:'-😊 -❤️', fn: g => { g.flags.workplacePUA=true; return{mood:-20,health:-10}; }},
      ]},
    { id:'marriage_corner', icon:'💑', title:'相亲角',
      body:'你妈带你去了人民公园相亲角。这里像菜市场，但卖的是人。\n\n每个人的"产品说明书"：年龄、身高、学历、房产、收入。\n\n一个大妈看了你的资料："985？有房吗？有车吗？年薪多少？"\n\n你说："我有梦想。"\n\n大妈笑了："梦想不能当彩礼。"\n\n"相亲角把爱情变成了交易——但交易至少明码标价。"',
      cond: g => g.age>=28 && g.age<=38 && !g.flags.married && g.social>30 && !g.flags.marriageCorner,
      choices:[
        { label:'认真对待，扩大社交圈', hint:'🎲 +👥', fn: g => { g.flags.marriageCorner=true; if(Math.random()>0.5){g.flags.inRelationship=true;return{mood:15,social:12,charm:5}}else{return{social:8,mood:-5}} }},
        { label:'应付一下，让妈开心', hint:'+😊 -👥', fn: g => { g.flags.marriageCorner=true; g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); return{mood:-5,social:-3}; }},
        { label:'拒绝，我的人生我做主', hint:'+😊 +✨ -👥', fn: g => { g.flags.marriageCorner=true; return{mood:10,charm:8,social:-10}; }},
      ]},
    { id:'school_district_house', icon:'🏫', title:'学区房',
      body:'你的孩子要上小学了。好的学校要学区房，学区房要800万。\n\n你算了算：卖掉现在的房子，加上所有存款，还差200万。\n\n你老婆说："为了孩子，值。"\n\n你爸说："我们那会儿哪有学区房？不也长大了？"\n\n"学区房是中国家长的军备竞赛——没有最卷，只有更卷。"',
      cond: g => g.flags.hasChild && g.flags.hasHouse && g.age>=32 && !g.flags.schoolDistrictHouse,
      choices:[
        { label:'买！为了孩子', hint:'-💰💰💰 +😊', fn: g => { g.flags.schoolDistrictHouse=true; return{money:-200000,mood:20,social:5}; }},
        { label:'上普通学校，省钱', hint:'+💰 +🧠 -😊', fn: g => { g.flags.schoolDistrictHouse=true; return{money:30000,intel:5,mood:-15}; }},
        { label:'送孩子上私立', hint:'-💰💰 +✨', fn: g => { g.flags.schoolDistrictHouse=true; return{money:-150000,charm:10,mood:10}; }},
      ]},
    { id:'tiger_parenting', icon:'📖', title:'鸡娃',
      body:'你的孩子3岁了。你的朋友们已经开始"鸡娃"了：\n\n- 英语启蒙：2万/年\n- 钢琴课：3万/年\n- 马术课：5万/年\n- 编程课：1万/年\n- 游学：10万/年\n\n总计：21万/年。你的年收入是……\n\n"鸡娃是家长的焦虑，孩子的童年——都在内卷中消失了。"',
      cond: g => g.flags.hasChild && g.age>=30 && !g.flags.tigerParenting,
      choices:[
        { label:'鸡！不能输在起跑线', hint:'-💰💰 +🧠 -😊', fn: g => { g.flags.tigerParenting=true; return{money:-100000,mood:-10,health:-5}; }},
        { label:'佛系养娃，快乐就好', hint:'+😊 +❤️', fn: g => { g.flags.tigerParenting=true; return{mood:15,health:5,social:5}; }},
        { label:'自己教，省钱又亲子', hint:'+🧠 +👥', fn: g => { g.flags.tigerParenting=true; g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); return{intel:8,social:8,mood:10}; }},
      ]},
    { id:'consumption_downgrade', icon:'📉', title:'消费降级',
      body:'你开始消费降级了：\n\n- 咖啡：从星巴克→瑞幸→速溶→白开水\n- 外卖：从海底捞→麦当劳→沙县→自己做饭\n- 衣服：从Zara→优衣库→拼多多→旧衣服\n- 娱乐：从旅游→电影→刷短视频→睡觉\n\n你发现：省下来的钱，够你多活3个月。\n\n"消费降级不是穷，是觉醒——你终于分清了需要和想要。"',
      cond: g => g.money<30000 && !g.flags.minimalist && g.age>=25,
      choices:[
        { label:'彻底极简主义', hint:'+💰 +🧠 +😊', fn: g => { g.flags.minimalist=true; return{money:8000,intel:8,mood:10}; }},
        { label:'只降不必要的', hint:'+💰 +😊', fn: g => { g.flags.minimalist=true; return{money:5000,mood:8}; }},
        { label:'偶尔奖励自己', hint:'+😊 -💰', fn: g => ({mood:10,money:-2000}) },
      ]},
    { id:'digital_refugee', icon:'📱', title:'数字鸿沟',
      body:'你爸打电话来："那个健康码怎么弄？""怎么网上挂号？""怎么用手机支付？"\n\n你教了他5遍，他还是不会。\n\n你说："爸，你学学吧，现在不用手机啥也干不了。"\n\n他说："我老了，学不会了。"\n\n你突然意识到：数字化时代，老年人成了"数字难民"。\n\n"科技进步了，但有些人被留在了昨天。"',
      cond: g => g.age>=28 && g.intel>50 && !g.flags.digitalRefugee,
      choices:[
        { label:'耐心教，写操作手册', hint:'+👥 +🧠 +😊', fn: g => { g.flags.digitalRefugee=true; g.relationships.family = clamp((g.relationships.family||60)+15, 0, 100); return{social:10,intel:5,mood:15}; }},
        { label:'帮他们装好所有App', hint:'+👥 +😊', fn: g => { g.flags.digitalRefugee=true; g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); return{social:8,mood:10}; }},
        { label:'算了，他们需要的时候找你', hint:'+😊', fn: g => { g.flags.digitalRefugee=true; return{mood:5}; }},
      ]},
    // ===== v2.22: GENDER & DEEPER RELATIONSHIPS =====
    { id:'gender_discrimination', icon:'⚖️', title:'职场性别歧视',
      body:'面试的时候，HR问了你一个"不该问"的问题：\n\n"你结婚了吗？""打算什么时候要孩子？""能接受出差吗？"\n\n你知道这些问题违法，但你也知道：如果你说"要孩子"，这个offer就没了。\n\n"性别歧视不是过去式，是现在进行时——只是变得更隐蔽了。"',
      cond: g => g.age>=24 && g.age<=35 && g.job==='待业中' && !g.flags.genderDiscrimination,
      choices:[
        { label:'如实回答，坚持自我', hint:'+✨ -💰', fn: g => { g.flags.genderDiscrimination=true; return{charm:10,mood:-10,money:-3000}; }},
        { label:'敷衍过去，先拿到offer', hint:'+💰 -😊', fn: g => { g.flags.genderDiscrimination=true; setJob(g,'运营专员',8000); return{mood:-5}; }},
        { label:'当场怼回去', hint:'+✨ +😊 -💰', fn: g => { g.flags.genderDiscrimination=true; return{charm:15,mood:10,money:-5000}; }},
        { label:'举报到劳动局', hint:'+🧠 +✨ -💰', fn: g => { g.flags.genderDiscrimination=true; return{intel:8,charm:10,mood:5,money:-8000}; }},
      ]},
    { id:'fertility_pressure', icon:'🤰', title:'生育歧视',
      body:"你怀孕了，告诉公司。领导的反应是：\n\n\"那你的项目怎么办？\"\"谁能接你的工作？\"\"产假结束后还回来吗？\"\n\n你查了一下法律：公司不能因为怀孕辞退你。但你也知道：你有的是办法\"自愿\"离职。\n\n\"生育是女性的权利，也是职场的'原罪'。\"",
      cond: g => g.flags.married && g.flags.hasChild && g.job!=='待业中' && !g.flags.fertilityDiscrimination && g.age>=26 && g.age<=38,
      choices:[
        { label:'坚持工作到最后一刻', hint:'+💰 -❤️', fn: g => { g.flags.fertilityDiscrimination=true; return{money:10000,health:-15,mood:-10}; }},
        { label:'提前休产假', hint:'+❤️ -💰', fn: g => { g.flags.fertilityDiscrimination=true; return{health:10,mood:5,money:-8000}; }},
        { label:'辞职做全职妈妈', hint:'+👨‍👩‍👧 -💰 -✨', fn: g => { g.flags.fertilityDiscrimination=true; g.relationships.family = clamp((g.relationships.family||60)+15, 0, 100); return{mood:10,money:-15000,charm:-10}; }},
        { label:'维权，保留证据', hint:'+🧠 +✨ -👥', fn: g => { g.flags.fertilityDiscrimination=true; g.relationships.colleagues = clamp((g.relationships.colleagues||30)-15, 0, 100); return{intel:10,charm:8,mood:-5}; }},
      ]},
    { id:'mother_in_law', icon:'👵', title:'婆媳关系',
      body:'你妈和你老婆/老公又吵架了。原因是：\n\n- 孩子怎么带\n- 家务谁做\n- 钱怎么花\n\n你夹在中间，两边都不敢得罪。\n\n你妈说："我养你这么大，你就听她的？"\n你老婆/老公说："你到底站哪边？"\n\n"婆媳关系是中国家庭的最大难题——没有之一。"',
      cond: g => g.flags.married && g.flags.hasChild && g.relationships.family<70 && !g.flags.motherInLawConflict,
      choices:[
        { label:'站老婆/老公这边', hint:'+💑 -👨‍👩‍👧', fn: g => { g.flags.motherInLawConflict=true; g.relationships.partner = clamp((g.relationships.partner||50)+15, 0, 100); g.relationships.family = clamp((g.relationships.family||60)-15, 0, 100); return{mood:-10}; }},
        { label:'站妈这边', hint:'+👨‍👩‍👧 -💑', fn: g => { g.flags.motherInLawConflict=true; g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); g.relationships.partner = clamp((g.relationships.partner||50)-20, 0, 100); return{mood:-15}; }},
        { label:'和稀泥，两边哄', hint:'+😊 -❤️', fn: g => { g.flags.motherInLawConflict=true; return{mood:-5,health:-5}; }},
        { label:'请保姆/分开住', hint:'-💰 +😊', fn: g => { g.flags.motherInLawConflict=true; return{money:-15000,mood:15,health:5}; }},
      ]},
    { id:'generational_gap', icon:'👴', title:'代际冲突',
      body:'你爸说："你们这代人就是太矫情，我们那会儿……"\n\n你说："你们那会儿有房子分配，有工作分配，有医疗报销。"\n\n他说："我们那会儿苦，但我们有奔头。"\n\n你说："我们这代人苦，但看不到奔头。"\n\n沉默。\n\n"代沟不是年龄的差距，是时代的鸿沟。"',
      cond: g => g.age>=25 && g.age<=35 && g.relationships.family<60 && !g.flags.generationalGap,
      choices:[
        { label:'耐心解释，让他们理解', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.generationalGap=true; g.relationships.family = clamp((g.relationships.family||60)+12, 0, 100); return{intel:5,mood:10}; }},
        { label:'算了，说了也不懂', hint:'-😊 -👨‍👩‍👧', fn: g => { g.flags.generationalGap=true; g.relationships.family = clamp((g.relationships.family||60)-8, 0, 100); return{mood:-10}; }},
        { label:'写长文/拍视频记录', hint:'+✨ +🧠', fn: g => { g.flags.generationalGap=true; return{charm:10,intel:8,mood:5}; }},
      ]},
    { id:'friend_betrayal', icon:'🗡️', title:'朋友背叛',
      body:'你最好的朋友背叛了你。也许是：\n\n- 把你的秘密告诉了别人\n- 在背后说你坏话\n- 借了你的钱不还\n- 挖了你的客户/对象\n\n你发了条朋友圈："从此，我不再相信友情。"然后删了。\n\n"成年人的友情，脆弱得像纸——一撕就破。"',
      cond: g => g.relationships.friends<40 && g.age>=25 && !g.flags.friendBetrayal,
      choices:[
        { label:'断交，拉黑', hint:'-👥 +😊', fn: g => { g.flags.friendBetrayal=true; g.relationships.friends = clamp((g.relationships.friends||40)-20, 0, 100); return{mood:10,social:-10}; }},
        { label:'原谅，但保持距离', hint:'+🧠 -😊', fn: g => { g.flags.friendBetrayal=true; g.relationships.friends = clamp((g.relationships.friends||40)-10, 0, 100); return{intel:5,mood:-5}; }},
        { label:'当面质问，要个说法', hint:'🎲', fn: g => { g.flags.friendBetrayal=true; if(Math.random()>0.5){g.relationships.friends = clamp((g.relationships.friends||40)+5, 0, 100);return{mood:15,social:5}}else{g.relationships.friends = clamp((g.relationships.friends||40)-25, 0, 100);return{mood:-20}} }},
      ]},
    { id:'parent_aging', icon:'🏥', title:'父母老了',
      body:'你接到电话："你爸/妈住院了。"\n\n你连夜赶回老家，看到他们躺在病床上，头发白了很多，人也瘦了很多。\n\n医生说："年纪大了，各种毛病都来了。"\n\n你算了算：医疗费、护理费、误工费……\n\n你突然意识到：他们老了，而你还没准备好。\n\n"父母在，人生尚有来处；父母去，人生只剩归途。"',
      cond: g => g.age>=30 && g.relationships.family>40 && !g.flags.parentAging,
      choices:[
        { label:'请假照顾', hint:'+👨‍👩‍👧 -💰 -❤️', fn: g => { g.flags.parentAging=true; g.relationships.family = clamp((g.relationships.family||60)+20, 0, 100); return{mood:10,money:-15000,health:-10}; }},
        { label:'请护工，远程关心', hint:'-💰 +👨‍👩‍👧', fn: g => { g.flags.parentAging=true; g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); return{money:-20000,mood:5}; }},
        { label:'买保险，提前规划', hint:'+🧠 -💰', fn: g => { g.flags.parentAging=true; return{intel:10,mood:8,money:-10000}; }},
        { label:'接他们来大城市住', hint:'+👨‍👩‍👧 -💰 -😊', fn: g => { g.flags.parentAging=true; g.relationships.family = clamp((g.relationships.family||60)+25, 0, 100); return{mood:-5,money:-8000}; }},
      ]},
    { id:'stock_market_crash', icon:'📉', title:'股市暴跌',
      body:'今天股市暴跌，你的股票亏了40%。\n\n你打开账户，看到一片绿（中国股市跌是绿色）。\n\n你的同事说："完了，完了，我的年终奖没了。"\n\n你的老婆/老公说："我早说了别炒股，你不听。"\n\n你想说：我只是想多赚点钱，有什么错？\n\n"股市是经济的晴雨表——但散户的心情是股市的过山车。"',
      cond: g => g.flags.invested && g.flags.stockAmount>10000 && !g.flags.stockCrash && Math.random()>0.6,
      choices:[
        { label:'割肉离场', hint:'-💰 +😊', fn: g => { g.flags.stockCrash=true; const loss = Math.floor(g.flags.stockAmount*0.4); g.money -= loss; return{mood:10,money:-loss}; }},
        { label:'加仓抄底', hint:'🎲 -💰', fn: g => { g.flags.stockCrash=true; const bet = Math.min(20000,g.money); g.money -= bet; if(Math.random()>0.5){const gain=Math.floor(bet*1.5);g.money+=bet+gain;return{money:gain,mood:20}}else{const loss=Math.floor(bet*0.6);g.money+=bet-loss;return{money:-loss,mood:-25}} }},
        { label:'装死不动', hint:'+🧠', fn: g => { g.flags.stockCrash=true; return{intel:8,mood:-10}; }},
      ]},
    { id:'midlife_crisis', icon:'🎭', title:'中年危机',
      body:'你35岁了。你开始想：\n\n- 我的事业到头了吗？\n- 我的婚姻还有激情吗？\n- 我的人生的意义是什么？\n\n你看着镜子里的自己：发际线后移了，肚子大了，眼神疲惫了。\n\n你想改变，但又不知道改变什么。\n\n"中年危机不是危机，是觉醒——你终于开始问自己：我到底想要什么？"',
      cond: g => g.age>=34 && g.age<=40 && g.mood<55 && !g.flags.midlifeCrisis,
      choices:[
        { label:'换赛道，重新开始', hint:'🎲 +😊 -💰', fn: g => { g.flags.midlifeCrisis=true; if(Math.random()>0.5){return{mood:25,money:-30000,charm:10}}else{return{mood:-15,money:-50000}} }},
        { label:'学新技能，提升自己', hint:'+🧠 +💰', fn: g => { g.flags.midlifeCrisis=true; return{intel:15,mood:10,money:-10000}; }},
        { label:'去旅行，寻找答案', hint:'-💰 +😊 +✨', fn: g => { g.flags.midlifeCrisis=true; g.flags.worldTravel=true; return{money:-20000,mood:20,charm:8}; }},
        { label:'接受现实，继续前行', hint:'+🧠 +😊', fn: g => { g.flags.midlifeCrisis=true; return{intel:10,mood:15}; }},
      ]},
    // ===== v2.23: MORE 2025-2026 EVENTS & BALANCE =====
    { id:'remote_work', icon:'💻', title:'远程办公',
      body:'公司宣布可以远程办公了！你高兴了三秒，然后发现：\n\n- 在家办公=永远在办公\n- 视频会议比面对面还累\n- 你分不清上班和下班了\n\n你的床变成了办公桌，你的客厅变成了会议室。\n\n"远程办公不是自由，是7×24小时待命。"',
      cond: g => g.job!=='待业中' && g.intel>55 && !g.flags.remoteWork && g.age>=24 && g.age<=40,
      choices:[
        { label:'享受灵活，提高效率', hint:'+😊 +💰', fn: g => { g.flags.remoteWork=true; return{mood:15,money:5000,health:5}; }},
        { label:'设立工作区，划清界限', hint:'+🧠 +❤️', fn: g => { g.flags.remoteWork=true; return{intel:8,health:8,mood:10}; }},
        { label:'申请回办公室', hint:'+👥 -😊', fn: g => { g.flags.remoteWork=true; g.relationships.colleagues = clamp((g.relationships.colleagues||30)+10, 0, 100); return{social:8,mood:-5}; }},
      ]},
    { id:'influencer_economy', icon:'📱', title:'网红经济',
      body:'你刷抖音/小红书，看到有人说："做自媒体月入10万！"\n\n你心动了：要不辞职做网红？\n\n你查了一下数据：90%的自媒体月收入不到3000元。\n\n"网红经济是金字塔——你看到的是塔尖，看不到的是塔底。"',
      cond: g => g.age>=22 && g.age<=35 && g.charm>50 && !g.flags.influencer && g.money>10000,
      choices:[
        { label:'辞职全职做', hint:'🎲🎲', fn: g => { g.flags.influencer=true; if(Math.random()>0.7){return{money:30000,charm:20,mood:25,social:15}}else{return{money:-20000,mood:-15,health:-10}} }},
        { label:'兼职试水', hint:'+✨ +🧠', fn: g => { g.flags.influencer=true; return{money:5000,charm:10,intel:5,mood:8}; }},
        { label:'算了，太卷了', hint:'+😊', fn: g => ({mood:5}) },
      ]},
    { id:'lottery_ticket', icon:'🎰', title:'彩票梦',
      body:'路过彩票店，你看到有人中了500万。\n\n你买了10注双色球，花了20块钱。\n\n你开始幻想：如果中了，先买房，再买车，然后辞职环游世界……\n\n开奖了。你一个号都没中。\n\n"彩票是穷人的税——但偶尔做做梦也不错。"',
      cond: g => g.money>500 && Math.random()>0.7,
      choices:[
        { label:'买100注！', hint:'🎲 -💰', fn: g => { g.money-=200; if(Math.random()>0.95){return{money:50000,mood:30,charm:5}}else{return{money:-200,mood:-5}} }},
        { label:'买10注意思意思', hint:'🎲 -💰', fn: g => { g.money-=20; if(Math.random()>0.98){return{money:10000,mood:25}}else{return{money:-20,mood:-3}} }},
        { label:'不买，这是智商税', hint:'+🧠', fn: g => ({intel:3,mood:5}) },
      ]},
    { id:'hometown_visit', icon:'🚄', title:'回老家过年',
      body:'过年了，你回老家了。\n\n亲戚们的问题三连击：\n1. 有对象了吗？\n2. 买房了吗？\n3. 工资多少？\n\n你笑着应付，心里在想：我为什么要回来？\n\n但当你吃到妈妈做的红烧肉，看到爸爸偷偷抹眼泪，你又觉得：回来真好。\n\n"老家是你想逃离，但又想回去的地方。"',
      cond: g => g.month===1 || g.month===2 && !g.flags.hometownVisit,
      choices:[
        { label:'多陪陪父母', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.hometownVisit=true; g.relationships.family = clamp((g.relationships.family||60)+20, 0, 100); return{mood:15,money:-3000}; }},
        { label:'应付一下，早点回城', hint:'+💰 -👨‍👩‍👧', fn: g => { g.flags.hometownVisit=true; g.relationships.family = clamp((g.relationships.family||60)-10, 0, 100); return{money:2000,mood:-5}; }},
        { label:'带父母来城里玩', hint:'-💰 +👨‍👩‍👧 +😊', fn: g => { g.flags.hometownVisit=true; g.relationships.family = clamp((g.relationships.family||60)+25, 0, 100); return{mood:20,money:-8000}; }},
      ]},
    { id:'social_media_anxiety', icon:'📱', title:'社交媒体焦虑',
      body:'你刷朋友圈/Instagram，看到：\n\n- 同学A：提了保时捷\n- 同事B：去了马尔代夫\n- 朋友C：升职加薪\n- 你：在出租屋吃泡面\n\n你关掉手机，叹了口气。\n\n"社交媒体不是生活，是生活的精选集——但你还是会焦虑。"',
      cond: g => g.mood<60 && g.age>=22 && g.age<=35 && !g.flags.socialMediaAnxiety,
      choices:[
        { label:'卸载社交媒体', hint:'+😊 +🧠 +❤️', fn: g => { g.flags.socialMediaAnxiety=true; g.flags.digitalDetox=true; return{mood:20,intel:8,health:5}; }},
        { label:'减少使用，专注自己', hint:'+😊 +🧠', fn: g => { g.flags.socialMediaAnxiety=true; return{mood:15,intel:5}; }},
        { label:'继续刷，继续焦虑', hint:'-😊 -❤️', fn: g => { g.flags.socialMediaAnxiety=true; return{mood:-15,health:-5}; }},
        { label:'也发朋友圈秀一下', hint:'+✨ -😊', fn: g => { g.flags.socialMediaAnxiety=true; return{charm:10,mood:-5,money:-500}; }},
      ]},
    { id:'career_change', icon:'🔄', title:'转行',
      body:'你已经干了3年现在的工作，但你越来越觉得：这不是你想要的。\n\n你想转行：从程序员转产品经理，从运营转市场，从销售转创业……\n\n但转行意味着：从零开始，降薪，重新证明自己。\n\n"转行是勇敢者的游戏——但勇敢者不一定能赢。"',
      cond: g => g.job!=='待业中' && g.months>36 && g.age>=26 && g.age<=38 && !g.flags.careerChange,
      choices:[
        { label:'勇敢转行', hint:'🎲 +🧠 -💰', fn: g => { g.flags.careerChange=true; if(Math.random()>0.5){setJob(g,'产品经理',g.jobSalary*1.2);return{intel:15,mood:20,money:-10000}}else{setJob(g,'实习生',6000);return{intel:10,mood:-10,money:-20000}} }},
        { label:'先学习，再转行', hint:'+🧠 -💰', fn: g => { g.flags.careerChange=true; return{intel:12,mood:5,money:-8000}; }},
        { label:'算了，先干着吧', hint:'-😊', fn: g => ({mood:-10}) },
      ]},
    { id:'burnout_warning', icon:'🔥', title:'倦怠警告',
      body:'你最近总是：\n\n- 早上不想起床\n- 上班像上坟\n- 对什么都提不起兴趣\n- 晚上失眠，白天犯困\n\n你查了一下"职业倦怠"的定义：情绪衰竭、去人格化、成就感降低。\n\n三条全中。\n\n"倦怠不是懒，是你的身心在求救。"',
      cond: g => g.health<50 && g.mood<45 && g.job!=='待业中' && !g.flags.burnoutWarning,
      choices:[
        { label:'请假休息一周', hint:'+❤️ +😊 -💰', fn: g => { g.flags.burnoutWarning=true; return{health:20,mood:25,money:-5000}; }},
        { label:'看心理医生', hint:'+🧠 +❤️ -💰', fn: g => { g.flags.burnoutWarning=true; return{intel:8,health:15,mood:15,money:-3000}; }},
        { label:'辞职，gap year', hint:'+😊 +❤️ -💰💰', fn: g => { g.flags.burnoutWarning=true; g.flags.lyingFlat=true; setJob(g,'待业中',0); return{mood:30,health:20,money:-30000}; }},
        { label:'硬撑，为了房贷', hint:'-❤️ -😊', fn: g => { g.flags.burnoutWarning=true; return{health:-15,mood:-20}; }},
      ]},
    // ===== v2.24: SEASONAL & CHAIN EVENTS =====
    { id:'spring_festival_travel', icon:'🚄', title:'春运',
      body:'春节到了，你要回老家。但首先，你要面对春运。\n\n火车票：抢不到\n飞机票：贵得离谱\n自驾：堵车10小时\n\n你最终选择了高铁，站票。\n\n你在人群中挤了3小时，终于到了家。你妈说："瘦了。"\n\n"春运是中国人的朝圣——再苦也要回家过年。"',
      cond: g => (g.month===1 || g.month===2) && !g.flags.springFestivalTravel && g.age>=23,
      choices:[
        { label:'买黄牛票', hint:'-💰 +😊', fn: g => { g.flags.springFestivalTravel=true; return{money:-2000,mood:15}; }},
        { label:'拼车回家', hint:'🎲 +👥', fn: g => { g.flags.springFestivalTravel=true; if(Math.random()>0.6){return{mood:10,social:8,money:-500}}else{return{mood:-10,health:-5,money:-800}} }},
        { label:'不回去了', hint:'+💰 -👨‍👩‍👧', fn: g => { g.flags.springFestivalTravel=true; g.relationships.family = clamp((g.relationships.family||60)-15, 0, 100); return{money:3000,mood:-10}; }},
      ]},
    { id:'summer_heat', icon:'☀️', title:'高温预警',
      body:'今天40度。你在外面走了10分钟，感觉自己要融化了。\n\n你的外卖小哥迟到了15分钟，他说："太热了，路上差点晕倒。"\n\n你给了他5星好评和10块钱小费。\n\n"高温下，有人在空调房里抱怨外卖慢，有人在烈日下送外卖。"',
      cond: g => g.month>=6 && g.month<=8 && !g.flags.summerHeat,
      choices:[
        { label:'买空调', hint:'-💰 +❤️ +😊', fn: g => { g.flags.summerHeat=true; return{money:-5000,health:10,mood:15}; }},
        { label:'去图书馆蹭空调', hint:'+🧠 +😊', fn: g => { g.flags.summerHeat=true; return{intel:8,mood:10}; }},
        { label:'硬扛，心静自然凉', hint:'-❤️ +💰', fn: g => { g.flags.summerHeat=true; return{health:-8,mood:-5,money:500}; }},
      ]},
    { id:'autumn_melancholy', icon:'🍂', title:'秋日感伤',
      body:'秋天到了，树叶黄了，你的心情也黄了。\n\n你看着窗外的落叶，突然觉得：时间过得好快，一年又过去了。\n\n你发了条朋友圈："秋天是离别的季节。"\n\n然后删了，觉得自己太矫情了。\n\n"秋天的忧郁是真的——但也是短暂的。"',
      cond: g => g.month>=9 && g.month<=10 && g.mood<60 && !g.flags.autumnMelancholy,
      choices:[
        { label:'去赏秋，拍照', hint:'+😊 +✨', fn: g => { g.flags.autumnMelancholy=true; return{mood:15,charm:8,money:-500}; }},
        { label:'写日记记录心情', hint:'+🧠 +😊', fn: g => { g.flags.autumnMelancholy=true; return{intel:8,mood:12}; }},
        { label:'约朋友出来聚聚', hint:'+👥 +😊', fn: g => { g.flags.autumnMelancholy=true; g.relationships.friends = clamp((g.relationships.friends||40)+10, 0, 100); return{social:10,mood:15,money:-800}; }},
      ]},
    { id:'winter_depression', icon:'❄️', title:'冬季抑郁',
      body:'冬天来了，天黑得早，你下班的时候天已经黑了。\n\n你不想出门，不想社交，只想窝在被子里刷手机。\n\n你查了一下"季节性抑郁"：冬季日照时间短，容易导致情绪低落。\n\n"冬天的冷不只是温度，还有心情。"',
      cond: g => g.month>=11 || g.month<=1 && g.mood<55 && !g.flags.winterDepression,
      choices:[
        { label:'买光疗灯', hint:'-💰 +❤️ +😊', fn: g => { g.flags.winterDepression=true; return{money:-1500,health:8,mood:15}; }},
        { label:'坚持运动', hint:'+❤️ +😊', fn: g => { g.flags.winterDepression=true; return{health:12,mood:18}; }},
        { label:'吃火锅暖身', hint:'+😊 -💰', fn: g => { g.flags.winterDepression=true; return{mood:12,money:-300}; }},
        { label:'硬扛，等春天', hint:'-❤️ -😊', fn: g => { g.flags.winterDepression=true; return{health:-8,mood:-12}; }},
      ]},
    { id:'online_shopping_addiction', icon:'🛒', title:'购物成瘾',
      body:'你打开了淘宝/拼多多/京东，本来只想买瓶洗发水。\n\n2小时后，你的购物车里有：\n- 羽绒服（打折）\n- 蓝牙耳机（打折）\n- 零食大礼包（打折）\n- 一双鞋（虽然你已经有5双了）\n\n总计：3800元。\n\n"双十一不是购物节，是剁手节——但你不是千手观音。"',
      cond: g => g.money>5000 && !g.flags.shoppingAddiction && (g.month===11 || g.month===6),
      choices:[
        { label:'全部下单！', hint:'-💰 +😊 -🧠', fn: g => { g.flags.shoppingAddiction=true; return{money:-3800,mood:15,intel:-5}; }},
        { label:'只买必需品', hint:'+🧠 +😊', fn: g => { g.flags.shoppingAddiction=true; return{intel:8,mood:5,money:-200}; }},
        { label:'全部删除，冷静30天', hint:'+🧠 +💰', fn: g => { g.flags.shoppingAddiction=true; g.flags.minimalist=true; return{intel:12,mood:10,money:500}; }},
      ]},
    { id:'friend_borrow_money', icon:'💸', title:'朋友借钱',
      body:'你朋友找你借钱："兄弟/姐妹，借我2万，下个月还你。"\n\n你心里想：上次借他的5000还没还呢。\n\n但他说："这次是真的急用，我妈住院了。"\n\n你不知道该不该借。\n\n"借钱给朋友，可能失去朋友，也可能失去钱。"',
      cond: g => g.money>10000 && g.relationships.friends>50 && !g.flags.friendBorrowMoney,
      choices:[
        { label:'借，友情无价', hint:'-💰 +👥', fn: g => { g.flags.friendBorrowMoney=true; g.relationships.friends = clamp((g.relationships.friends||40)+20, 0, 100); return{money:-20000,social:15,mood:5,nextEvent: g => ({
            id:'friend_repay', icon:'💰', title:'朋友还钱',
            body:'3个月过去了，你朋友主动还了你2万块，还多给了2000块利息。\n\n他说："谢谢你在我最难的时候帮我。"\n\n你笑了：原来友情也可以是双赢。\n\n"真正的友情，经得起金钱的考验。"',
            choices:[
                { label:'收下利息', hint:'+💰 +😊', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+10, 0, 100); return{money:22000,mood:15,social:10}; }},
                { label:'只收本金', hint:'+👥 +✨', fn: g => { g.relationships.friends = clamp((g.relationships.friends||40)+15, 0, 100); return{money:20000,mood:20,charm:10,social:12}; }},
            ]})};
        }},
        { label:'借一半，量力而行', hint:'-💰 +👥', fn: g => { g.flags.friendBorrowMoney=true; g.relationships.friends = clamp((g.relationships.friends||40)+10, 0, 100); return{money:-10000,social:8,mood:3}; }},
        { label:'拒绝，上次还没还', hint:'+💰 -👥', fn: g => { g.flags.friendBorrowMoney=true; g.relationships.friends = clamp((g.relationships.friends||40)-15, 0, 100); return{mood:-10,social:-8}; }},
        { label:'转账，不用还了', hint:'-💰💰 +👥 +✨', fn: g => { g.flags.friendBorrowMoney=true; g.relationships.friends = clamp((g.relationships.friends||40)+30, 0, 100); return{money:-20000,social:20,charm:15,mood:15}; }},
      ]},
    // ===== v2.26: CHAIN EVENTS & CULTURAL DEPTH =====
    { id:'office_gossip', icon:'🗣️', title:'办公室八卦',
      body:'你在茶水间听到同事在八卦：\n\n"听说老板要离婚了……""小李要被裁了……""公司要被收购了……"\n\n你不确定这些消息是真是假，但你知道：在办公室，信息就是权力。\n\n"办公室八卦是职场的润滑剂——但也可能是地雷。"',
      cond: g => g.job!=='待业中' && g.months>6 && !g.flags.officeGossip,
      choices:[
        { label:'加入八卦，获取信息', hint:'+👥 -🧠', fn: g => { g.flags.officeGossip=true; g.relationships.colleagues = clamp((g.relationships.colleagues||30)+8, 0, 100); return{social:8,intel:-3,mood:5,nextEvent: g => ({
            id:'gossip_backfire', icon:'😱', title:'八卦翻车',
            body:'你传的八卦被当事人知道了。老板找你谈话："听说你在到处说我离婚的事？"\n\n你解释了半天，但老板显然不信。\n\n你的绩效被打成了C。\n\n"管住嘴，是职场的第一课——你终于学会了，虽然有点晚。"',
            choices:[
                { label:'道歉，承认错误', hint:'+🧠 -😊', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)-15, 0, 100); return{intel:5,mood:-20,social:-10}; }},
                { label:'解释，推卸责任', hint:'-👥 -✨', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)-20, 0, 100); return{mood:-15,charm:-10,social:-12}; }},
            ]})};
        }},
        { label:'只听不说，保持中立', hint:'+🧠', fn: g => { g.flags.officeGossip=true; return{intel:5,mood:3}; }},
        { label:'走开，不参与', hint:'+✨ +🧠', fn: g => { g.flags.officeGossip=true; return{charm:5,intel:3,mood:5}; }},
      ]},
    { id:'parent_health_scare', icon:'🏥', title:'父母体检',
      body:'你带父母去做了年度体检。结果出来了：\n\n- 爸：高血压、高血脂、轻度脂肪肝\n- 妈：骨质疏松、血糖偏高\n\n医生说："都是老年病，注意饮食和运动。"\n\n你看着他们，突然意识到：他们真的老了。\n\n"父母的健康，是你最大的财富——但你总是在失去它。"',
      cond: g => g.age>=28 && g.money>15000 && !g.flags.parentHealthScare,
      choices:[
        { label:'买保健品', hint:'-💰 +👨‍👩‍👧', fn: g => { g.flags.parentHealthScare=true; g.relationships.family = clamp((g.relationships.family||60)+12, 0, 100); return{money:-8000,mood:10,social:5,nextEvent: g => ({
            id:'parent_lifestyle', icon:'🏃', title:'父母健康生活',
            body:'你给父母买了运动手环、健康食谱、健身卡。\n\n3个月后，你妈打电话来："你爸瘦了10斤，血压也正常了。"\n\n你笑了：原来健康是可以管理的。\n\n"健康不是天生的，是习惯的结果。"',
            choices:[
                { label:'继续保持', hint:'+👨‍👩‍👧 +❤️', fn: g => { g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); return{mood:15,health:5}; }},
            ]})};
        }},
        { label:'请私人医生', hint:'-💰💰 +👨‍👩‍👧', fn: g => { g.flags.parentHealthScare=true; g.relationships.family = clamp((g.relationships.family||60)+20, 0, 100); return{money:-25000,mood:15}; }},
        { label:'多打电话关心', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.parentHealthScare=true; g.relationships.family = clamp((g.relationships.family||60)+10, 0, 100); return{mood:8}; }},
      ]},
    { id:'career_milestone', icon:'🏆', title:'职场里程碑',
      body:'你在这家公司干了3年了。领导找你谈话：\n\n"公司准备提拔你为Team Lead，带5个人的团队，涨薪30%。"\n\n你有点激动，但也有点紧张：你能胜任吗？\n\n"升职不是终点，是新的起点——也是新的压力。"',
      cond: g => g.job!=='待业中' && g.months>=36 && g.intel>60 && !g.flags.careerMilestone,
      choices:[
        { label:'接受挑战', hint:'+💰 +🧠 -❤️', fn: g => { g.flags.careerMilestone=true; const raise=Math.floor(g.jobSalary*0.3); g.jobSalary+=raise; return{money:raise*6,intel:10,health:-5,mood:15,nextEvent: g => ({
            id:'leadership_challenge', icon:'👥', title:'领导力考验',
            body:'你当上了Team Lead，但你发现：管理团队比做业务难多了。\n\n- 有人摸鱼\n- 有人不服\n- 有人要离职\n\n你开始怀疑：我是不是不适合做管理？\n\n"领导力不是天生的，是摔出来的。"',
            choices:[
                { label:'学习管理技能', hint:'+🧠 +👥', fn: g => { g.relationships.colleagues = clamp((g.relationships.colleagues||30)+15, 0, 100); return{intel:12,social:10,mood:10}; }},
                { label:'请教前辈', hint:'+🧠 +👥', fn: g => { return{intel:10,social:8,mood:8}; }},
                { label:'申请回到技术岗', hint:'+😊 -💰', fn: g => { g.jobSalary-=raise; return{mood:15,money:-raise*3}; }},
            ]})};
        }},
        { label:'要求更多薪资', hint:'+💰 🎲', fn: g => { g.flags.careerMilestone=true; if(Math.random()>0.5){const raise=Math.floor(g.jobSalary*0.4);g.jobSalary+=raise;return{money:raise*6,mood:20}}else{return{mood:-15}} }},
        { label:'拒绝，专注技术', hint:'+🧠 +😊', fn: g => { g.flags.careerMilestone=true; return{intel:15,mood:10}; }},
      ]},
    // ===== v2.27: LIFE VARIETY & BALANCE =====
    { id:'travel_experience', icon:'✈️', title:'独自旅行',
      body:'你决定一个人去旅行。目的地：云南/西藏/新疆/青海湖。\n\n你在路上遇到了很多有趣的人：背包客、摄影师、流浪歌手。\n\n你拍了好多照片，发了好多朋友圈。\n\n"旅行的意义不是看风景，是看自己。"',
      cond: g => g.money>8000 && g.age>=24 && g.age<=40 && !g.flags.soloTravel,
      choices:[
        { label:'深度游，住青旅', hint:'-💰 +👥 +✨', fn: g => { g.flags.soloTravel=true; return{money:-5000,social:12,charm:8,mood:20}; }},
        { label:'穷游，搭车露营', hint:'-💰 +❤️ +🧠', fn: g => { g.flags.soloTravel=true; return{money:-2000,health:8,intel:10,mood:15}; }},
        { label:'豪华游，住五星', hint:'-💰💰 +😊 +✨', fn: g => { g.flags.soloTravel=true; return{money:-15000,mood:25,charm:10}; }},
        { label:'算了，没时间', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'learn_instrument', icon:'🎸', title:'学乐器',
      body:'你突然想学一门乐器：吉他、钢琴、尤克里里、口琴。\n\n你买了一把吉他，花了2000块。你看了10个教学视频，学了3个和弦。\n\n你的室友说："你弹得像杀鸡。"\n\n但你不在乎：你在享受学习的过程。\n\n"音乐是灵魂的出口——即使你弹得很烂。"',
      cond: g => g.money>3000 && g.age>=22 && g.age<=45 && !g.flags.musicSkill,
      choices:[
        { label:'坚持练习', hint:'+🧠 +😊 -❤️', fn: g => { g.flags.musicSkill=true; return{intel:10,mood:12,health:-3,money:-2000}; }},
        { label:'报班学习', hint:'-💰 +🧠 +👥', fn: g => { g.flags.musicSkill=true; return{money:-5000,intel:12,social:8,mood:10}; }},
        { label:'放弃，太难了', hint:'-😊', fn: g => ({mood:-8,money:-2000}) },
      ]},
    { id:'cooking_skill', icon:'🍳', title:'学做饭',
      body:'你受够了外卖，决定学做饭。\n\n你买了锅碗瓢盆，看了B站教程，做了一顿"黑暗料理"。\n\n你发朋友圈："第一次做饭，求赞。"\n\n朋友评论："看起来像案发现场。"\n\n但你吃了一口，觉得：嗯，还挺好吃的。\n\n"做饭是生活的基本技能——也是爱的表达方式。"',
      cond: g => g.money>1000 && g.age>=22 && !g.flags.cookingSkill,
      choices:[
        { label:'坚持做饭', hint:'+❤️ +😊 +🧠', fn: g => { g.flags.cookingSkill=true; return{health:15,mood:12,intel:8,money:-1000}; }},
        { label:'偶尔做做', hint:'+❤️ +😊', fn: g => { g.flags.cookingSkill=true; return{health:8,mood:8,money:-500}; }},
        { label:'算了，还是外卖', hint:'-❤️ -💰', fn: g => ({health:-5,mood:-5}) },
      ]},
    { id:'volunteer_work', icon:'🤝', title:'志愿者活动',
      body:'你报名参加了志愿者活动：去养老院陪伴老人/去山区支教/去动物收容所帮忙。\n\n你遇到了很多志同道合的人，也看到了很多需要帮助的人。\n\n你突然觉得：原来自己拥有的已经很多了。\n\n"帮助别人，是帮助自己的最好方式。"',
      cond: g => g.age>=23 && g.mood>40 && !g.flags.volunteer,
      choices:[
        { label:'定期参加', hint:'+👥 +😊 +✨', fn: g => { g.flags.volunteer=true; g.relationships.friends = clamp((g.relationships.friends||40)+12, 0, 100); return{social:12,mood:18,charm:10}; }},
        { label:'偶尔参加', hint:'+👥 +😊', fn: g => { g.flags.volunteer=true; return{social:8,mood:12,charm:5}; }},
        { label:'捐款支持', hint:'-💰 +😊', fn: g => { g.flags.volunteer=true; return{money:-2000,mood:15,charm:8}; }},
      ]},
    { id:'fitness_journey', icon:'🏋️', title:'健身之旅',
      body:'你办了一张健身卡，花了3000块。你发誓：这次一定要坚持！\n\n第一天：跑了5公里，感觉要死了。\n第二天：浑身酸痛，下不了楼。\n第三天：不想去了……\n\n但你还是去了。一个月后，你瘦了5斤，精力也变好了。\n\n"健身不是为了好看，是为了活得更好。"',
      cond: g => g.money>4000 && g.health<70 && g.age>=23 && g.age<=45 && !g.flags.gymMember,
      choices:[
        { label:'坚持健身', hint:'+❤️ +😊 +✨ -💰', fn: g => { g.flags.gymMember=true; return{health:20,mood:15,charm:10,money:-3000}; }},
        { label:'请私教', hint:'+❤️ +🧠 -💰💰', fn: g => { g.flags.gymMember=true; return{health:25,intel:5,mood:12,money:-8000}; }},
        { label:'办卡后就不去了', hint:'-💰 -❤️', fn: g => { g.flags.gymMember=true; return{money:-3000,health:-5,mood:-10}; }},
      ]},
    { id:'reading_habit', icon:'📚', title:'养成阅读习惯',
      body:'你决定每个月读2本书。你买了Kindle，下载了10本书。\n\n第一周：读了50页，觉得好充实。\n第二周：刷手机忘了读书。\n第三周：Kindle没电了，懒得充。\n第四周：Kindle找不到了……\n\n"阅读是最好的投资——但也是最容易被放弃的投资。"',
      cond: g => g.intel>50 && g.age>=22 && !g.flags.readingHabit,
      choices:[
        { label:'坚持阅读', hint:'+🧠 +😊', fn: g => { g.flags.readingHabit=true; return{intel:15,mood:10,money:-500}; }},
        { label:'听书，碎片时间', hint:'+🧠', fn: g => { g.flags.readingHabit=true; return{intel:10,mood:5,money:-300}; }},
        { label:'算了，没时间', hint:'-🧠', fn: g => ({intel:-3,mood:-5}) },
      ]},
    // ===== v2.28: RARE EVENTS & DEPTH =====
    { id:'unexpected_inheritance', icon:'💰', title:'意外遗产',
      body:'你接到了一个陌生律师的电话："你的远房亲戚去世了，留给你一笔遗产。"\n\n你以为是诈骗，但对方提供了完整的文件。\n\n原来是你爷爷的兄弟，一辈子没结婚，把遗产留给了你。\n\n金额：50万。\n\n"有时候，生活会给你意想不到的礼物——但礼物背后往往是遗憾。"',
      cond: g => g.age>=30 && !g.flags.inheritance && Math.random()>0.8,
      choices:[
        { label:'接受遗产', hint:'+💰💰 +😊', fn: g => { g.flags.inheritance=true; return{money:500000,mood:20,social:5}; }},
        { label:'捐出一部分', hint:'+💰 +✨ +😊', fn: g => { g.flags.inheritance=true; g.flags.volunteer=true; return{money:300000,mood:25,charm:15,social:10}; }},
        { label:'全部捐出', hint:'+✨ +😊 -💰', fn: g => { g.flags.inheritance=true; g.flags.volunteer=true; return{money:50000,mood:30,charm:25,social:15}; }},
      ]},
    { id:'life_mentor', icon:'🧓', title:'人生导师',
      body:'你在咖啡厅遇到了一位70岁的老人。他看起来很有气质，你们聊了起来。\n\n他说他曾经是大学教授，退休后环游世界。他分享了很多人生智慧：\n\n"年轻人，人生没有标准答案。你不需要活成别人期望的样子。"\n\n"做让你老了不后悔的事，而不是让你老了后悔没做的事。"\n\n你加了老人的微信，他说随时可以找他聊天。\n\n"有些话，年轻人听不进去——直到遇见对的人。"',
      cond: g => g.age>=25 && g.age<=35 && g.intel>55 && !g.flags.lifeMentor && Math.random()>0.7,
      choices:[
        { label:'定期请教', hint:'+🧠 +😊 +👥', fn: g => { g.flags.lifeMentor=true; return{intel:15,mood:18,social:10}; }},
        { label:'请老人吃饭', hint:'-💰 +🧠 +👥', fn: g => { g.flags.lifeMentor=true; return{money:-500,intel:12,mood:15,social:12}; }},
        { label:'只是客套', hint:'+😊', fn: g => ({mood:8}) },
      ]},
    { id:'moral_dilemma', icon:'⚖️', title:'道德困境',
      body:'你在公司发现了一个问题：你的领导在做假账，挪用公司资金。\n\n你知道如果举报，领导会被开除，但你也会被报复。\n\n如果你不举报，公司可能会因此倒闭，很多同事会失业。\n\n"道德和利益之间，往往只隔着一个选择的距离。"',
      cond: g => g.job!=='待业中' && g.months>12 && g.intel>50 && !g.flags.moralDilemma && Math.random()>0.7,
      choices:[
        { label:'举报，坚持正义', hint:'+✨ +🧠 -👥 -💰', fn: g => { g.flags.moralDilemma=true; g.relationships.colleagues = clamp((g.relationships.colleagues||30)-20, 0, 100); return{charm:20,intel:10,mood:-15,social:-15,money:-10000}; }},
        { label:'匿名举报', hint:'+🧠 +✨', fn: g => { g.flags.moralDilemma=true; return{intel:8,charm:10,mood:5}; }},
        { label:'假装没看到', hint:'-✨ -🧠 +👥', fn: g => { g.flags.moralDilemma=true; g.relationships.colleagues = clamp((g.relationships.colleagues||30)+5, 0, 100); return{charm:-15,intel:-8,social:5,mood:-10}; }},
        { label:'私下提醒领导', hint:'🎲', fn: g => { g.flags.moralDilemma=true; if(Math.random()>0.5){g.relationships.colleagues = clamp((g.relationships.colleagues||30)+10, 0, 100);return{mood:10,social:8}}else{return{mood:-20,social:-15,money:-15000}} }},
      ]},
    { id:'identity_crisis', icon:'🎭', title:'身份认同',
      body:'你在大城市生活了5年，但你依然觉得：自己不属于这里。\n\n你的口音、习惯、价值观，都和"本地人"不一样。\n\n你回老家的时候，亲戚说你"变了"。\n\n你在大城市的时候，同事说你是"外地人"。\n\n你开始怀疑：我到底是谁？我属于哪里？\n\n"身份认同是漂泊者的永恒命题——你既不属于故乡，也不属于他乡。"',
      cond: g => g.months>=60 && g.age>=27 && !g.flags.identityCrisis,
      choices:[
        { label:'接受自己的多重身份', hint:'+🧠 +😊', fn: g => { g.flags.identityCrisis=true; return{intel:12,mood:15,charm:5}; }},
        { label:'努力融入大城市', hint:'+👥 +✨ -💰', fn: g => { g.flags.identityCrisis=true; g.relationships.colleagues = clamp((g.relationships.colleagues||30)+10, 0, 100); return{social:10,charm:8,mood:8,money:-5000}; }},
        { label:'考虑回老家', hint:'+👨‍👩‍👧 -😊', fn: g => { g.flags.identityCrisis=true; g.relationships.family = clamp((g.relationships.family||60)+15, 0, 100); return{mood:-5,social:5}; }},
      ]},
    { id:'creative_breakthrough', icon:'💡', title:'创意突破',
      body:'你突然有了一个创意：\n\n- 一个App的想法\n- 一本书的构思\n- 一个商业计划\n- 一个艺术项目\n\n你觉得这个想法可以改变你的人生。你兴奋得睡不着觉。\n\n"创意是廉价的，执行才是无价的。"\n\n问题是：你敢不敢去执行？',
      cond: g => g.intel>60 && g.age>=24 && g.age<=40 && !g.flags.creativeBreakthrough && Math.random()>0.6,
      choices:[
        { label:'辞职创业', hint:'🎲🎲 -💰 +🧠', fn: g => { g.flags.creativeBreakthrough=true; g.flags.entrepreneur=true; setJob(g,'创业者',0); if(Math.random()>0.5){return{money:-30000,intel:20,mood:25,social:15}}else{return{money:-50000,mood:-20,health:-10}} }},
        { label:'业余时间做', hint:'+🧠 +😊 -❤️', fn: g => { g.flags.creativeBreakthrough=true; g.flags.sideHustle=true; return{intel:15,mood:18,health:-8}; }},
        { label:'写下来，以后再说', hint:'+🧠', fn: g => { g.flags.creativeBreakthrough=true; return{intel:10,mood:8}; }},
        { label:'算了，只是想想', hint:'-😊', fn: g => ({mood:-10}) },
      ]},
    // === v2.30 DRAMATIC EVENTS ===
    { id:'age_35_crisis', icon:'🔴', title:'35岁危机',
      body:'你35岁了。\n\n你的公司开始了新一轮"优化"。HR的目光在你身上停留的时间越来越长。新来的00后同事叫你"叔叔/阿姨"。\n\n你打开招聘网站，发现80%的岗位要求"35岁以下"。\n\n你不是不努力，是年龄成了原罪。\n\n"在中国互联网行业，35岁就是退休年龄——如果你还没当上管理层的话。"',
      cond: g => g.age===35 && g.job!=='待业中' && !g.flags.age35Crisis && g.jobSalary>8000,
      choices:[
        { label:'拼命证明自己', hint:'-❤️ +💰 +🧠', fn: g => { g.flags.age35Crisis=true; return{health:-15,money:10000,intel:8,mood:-10}; }},
        { label:'提前规划转型', hint:'+🧠 +👥 -💰', fn: g => { g.flags.age35Crisis=true; g.flags.careerTransition=true; return{intel:12,social:8,money:-5000,mood:5}; }},
        { label:'考公务员/事业编', hint:'🎲 +😊', fn: g => { g.flags.age35Crisis=true; if(g.intel>70&&Math.random()>0.5){g.flags.civilServant=true;setJob(g,'公务员',10000);return{mood:20,money:-3000}}else{return{mood:-15,money:-3000}} }},
        { label:'接受现实，躺平', hint:'+😊 +❤️ -💰', fn: g => { g.flags.age35Crisis=true; g.flags.lyingFlat=true; return{mood:10,health:10,money:-8000}; }},
      ]},
    { id:'zhushapan', icon:'🐷', title:'杀猪盘',
      body:'你在交友App上遇到了一个人。\n\nTA温柔体贴、事业有成、每天给你发早安晚安。你们聊了3个月，TA说："我有一个很好的投资机会，只告诉你。"\n\n你心里有个声音说："这是杀猪盘。"但TA太温柔了，你不会相信TA是骗子吧？\n\n"感情是真的，骗钱也是真的。这就是杀猪盘的可怕之处。"',
      cond: g => g.flags.hasDatingApp && g.money>10000 && !g.flags.romanceScam && g.age>=25 && g.age<=45,
      choices:[
        { label:'投资5万试试', hint:'🎲 -💰', fn: g => { g.flags.romanceScam=true; if(Math.random()>0.8){return{money:15000,mood:10}}else{return{money:-50000,mood:-30,social:-10}} }},
        { label:'投资20万（all in）', hint:'🎲🎲 -💰💰', fn: g => { g.flags.romanceScam=true; if(Math.random()>0.95){return{money:80000,mood:20}}else{return{money:-200000,mood:-50,health:-15}} }},
        { label:'报警+举报', hint:'+🧠 +😊', fn: g => { g.flags.romanceScam=true; g.flags.antiFraud=true; return{intel:8,mood:5,social:3}; }},
        { label:'拉黑，当没发生过', hint:'+😊', fn: g => { g.flags.romanceScam=true; return{mood:3}; }},
      ]},
    { id:'windfall', icon:'💰', title:'天降横财',
      body:'你意外收到了一笔钱：\n\n- 远房亲戚的遗产？\n- 公司赔偿金？\n- 退税？\n- 朋友还了你早就忘了借款？\n\n不管来源如何，这笔钱让你突然有了选择的余地。\n\n"意外之财，往往是意外之灾的开始。"',
      cond: g => g.months>=24 && !g.flags.gotWindfall && Math.random()>0.85,
      choices:[
        { label:'存银行定期', hint:'+💰 稳妥', fn: g => { g.flags.gotWindfall=true; return{money:50000,mood:5}; }},
        { label:'投资股市', hint:'🎲 +💰?', fn: g => { g.flags.gotWindfall=true; if(Math.random()>0.5){return{money:100000,mood:15,intel:5}}else{return{money:-10000,mood:-10}} }},
        { label:'请朋友们大吃一顿', hint:'+👥 +✨ -💰', fn: g => { g.flags.gotWindfall=true; g.relationships.friends=clamp((g.relationships.friends||40)+15,0,100); return{money:20000,social:15,charm:8,mood:20}; }},
        { label:'给自己买一直想要的东西', hint:'+😊 +✨', fn: g => { g.flags.gotWindfall=true; return{money:30000,mood:25,charm:10}; }},
      ]},
    { id:'digital_legacy', icon:'📱', title:'数字遗产',
      body:'你看到一个新闻：一个年轻人意外去世后，家人无法访问他的数字账号——微信、支付宝、网盘、游戏账号……\n\n你突然意识到：如果明天你出了意外，你的数字人生会怎样？\n\n你的聊天记录、照片、文档、加密货币……全都锁在手机和云端里。\n\n"人死了，数据还活着。但活着的人，未必能打开。"',
      cond: g => g.age>=28 && g.intel>50 && !g.flags.digitalLegacy,
      choices:[
        { label:'整理数字遗产清单', hint:'+🧠 +😊', fn: g => { g.flags.digitalLegacy=true; g.flags.digitalDetox=true; return{intel:8,mood:10}; }},
        { label:'设置紧急联系人', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.digitalLegacy=true; g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{intel:5,mood:8}; }},
        { label:'算了，死了就死了', hint:'-😊', fn: g => { g.flags.digitalLegacy=true; return{mood:-5}; }},
      ]},
    { id:'midlife_awakening', icon:'🌅', title:'中年觉醒',
      body:'你40岁了。\n\n某天早上醒来，你突然问自己："我这辈子到底在干什么？"\n\n你有工作，但不知道意义。你有房子，但觉得不是家。你有社交，但觉得都是应酬。\n\n你不是抑郁，你只是……醒了。\n\n"中年危机不是想换辆跑车，是想换种活法。"',
      cond: g => g.age===40 && !g.flags.midlifeAwakening,
      choices:[
        { label:'辞职，做一直想做的事', hint:'🎲 -💰 +😊 +🧠', fn: g => { g.flags.midlifeAwakening=true; if(Math.random()>0.4){setJob(g,'自由职业者',8000);return{money:-30000,mood:30,intel:15,charm:10}}else{return{money:-50000,mood:-10}} }},
        { label:'开始学一样新东西', hint:'+🧠 +😊', fn: g => { g.flags.midlifeAwakening=true; return{intel:20,mood:15,charm:5}; }},
        { label:'重新审视人际关系', hint:'+👥 +❤️', fn: g => { g.flags.midlifeAwakening=true; g.relationships.family=clamp((g.relationships.family||60)+20,0,100); g.relationships.friends=clamp((g.relationships.friends||40)+15,0,100); return{social:15,mood:12,health:5}; }},
        { label:'继续这样过吧', hint:'-😊', fn: g => { g.flags.midlifeAwakening=true; return{mood:-15}; }},
      ]},
    { id:'parent_illness', icon:'🏥', title:'父母重病',
      body:'你接到了家里的电话：你爸/你妈住院了。\n\n不是什么大病，但医生说需要手术。费用大概5-10万。你在外地，赶回去要4个小时高铁。\n\n你妈在电话里说："不用回来了，小手术。"但你听出了她的声音在发抖。\n\n"子欲养而亲不待——这句古话，只有真正面对时才知道有多重。"',
      cond: g => g.age>=30 && g.relationships && g.relationships.family>30 && !g.flags.parentIllness && Math.random()>0.7,
      choices:[
        { label:'立刻赶回去', hint:'-💰 +👨‍👩‍👧 +😊', fn: g => { g.flags.parentIllness=true; g.relationships.family=clamp((g.relationships.family||60)+25,0,100); return{money:-80000,mood:15,health:-5}; }},
        { label:'转钱回去，人不到', hint:'-💰 +👨‍👩‍👧', fn: g => { g.flags.parentIllness=true; g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{money:-100000,mood:-5}; }},
        { label:'请假一周回去照顾', hint:'-💰 -💼 +👨‍👩‍👧', fn: g => { g.flags.parentIllness=true; g.relationships.family=clamp((g.relationships.family||60)+20,0,100); if(g.jobSalary>15000&&Math.random()>0.6){return{money:-90000,mood:5,jobSalary:-3000}}else{return{money:-90000,mood:10}} }},
      ]},
    // === v2.31 INTERACTIVE EVENTS ===
    { id:'salary_negotiation', icon:'💼', title:'薪资谈判',
      body:'年度绩效考核结束了。你的绩效是A，但涨薪幅度只有5%。\n\n同事悄悄告诉你：隔壁组同样绩效的人涨了15%。\n\nHR说："公司有公司的考虑。"你的leader说："我已经帮你争取了。"\n\n你知道：不争取，就没有。\n\n"薪资谈判是一场博弈——你的底牌是你的能力，你的筹码是你的勇气。"',
      cond: g => g.job!=='待业中' && g.jobSalary>=10000 && g.age>=25 && !g.flags.salaryNegotiation && Math.random()>0.6,
      choices:[
        { label:'要求涨到15%', hint:'🎲 +💰', fn: g => { g.flags.salaryNegotiation=true; const skill=g.intel+g.charm; if(skill>130&&Math.random()>0.4){const raise=Math.floor(g.jobSalary*0.15);g.jobSalary+=raise;return{money:raise*6,mood:20,intel:3}}else if(Math.random()>0.5){const raise=Math.floor(g.jobSalary*0.08);g.jobSalary+=raise;return{money:raise*6,mood:5}}else{return{mood:-15,charm:-3}} }},
        { label:'拿offer去谈判', hint:'🎲🎲 +💰💰', fn: g => { g.flags.salaryNegotiation=true; if(g.intel>70&&Math.random()>0.5){const raise=Math.floor(g.jobSalary*0.25);g.jobSalary+=raise;return{money:raise*6,mood:25,intel:5,social:-5}}else{return{mood:-20,social:-10}} }},
        { label:'接受现状', hint:'+😊', fn: g => { g.flags.salaryNegotiation=true; return{mood:-5}; }},
        { label:'直接跳槽', hint:'🎲 +💰 -👥', fn: g => { g.flags.salaryNegotiation=true; if(Math.random()>0.4){const newSalary=Math.floor(g.jobSalary*1.3);setJob(g,getTitle(g,'senior'),newSalary);return{money:5000,mood:15,social:-5}}else{return{mood:-10,social:-5}} }},
      ]},
    { id:'apartment_hunt', icon:'🏠', title:'租房大作战',
      body:'你的租约到期了，房东要涨租20%。\n\n你打开租房App，发现：\n- 同地段的房子都涨了\n- 远一点的地方便宜但通勤2小时\n- 合租能省钱但没隐私\n- 有个"长租公寓"打折但口碑堪忧\n\n"在大城市，租房比找工作还难。"',
      cond: g => g.months>=6 && !g.flags.hasHouse && !g.flags.apartmentHunt && g.job!=='待业中',
      choices:[
        { label:'搬到远一点但便宜', hint:'+💰 -😊 -❤️', fn: g => { g.flags.apartmentHunt=true; return{money:5000,mood:-10,health:-5}; }},
        { label:'找人合租', hint:'+💰 +👥', fn: g => { g.flags.apartmentHunt=true; if(Math.random()>0.5){g.relationships.friends=clamp((g.relationships.friends||40)+10,0,100);return{money:3000,social:10,mood:5}}else{return{money:3000,mood:-10,social:-5}} }},
        { label:'咬牙续租', hint:'-💰 +😊', fn: g => { g.flags.apartmentHunt=true; return{money:-3000,mood:5}; }},
        { label:'试试长租公寓', hint:'🎲 -💰?', fn: g => { g.flags.apartmentHunt=true; if(Math.random()>0.6){return{money:2000,mood:8,charm:3}}else{return{money:-20000,mood:-25}} }},
      ]},
    { id:'involution_choice', icon:'🔄', title:'内卷还是躺平',
      body:'你的公司开始了新一轮的"绩效考核优化"——说白了就是末位淘汰。\n\n你的同事开始疯狂加班：有人凌晨2点还在发邮件，有人周末主动来公司，有人把年假全退了。\n\n你的leader说："这个季度，大家都要冲一冲。"\n\n你看着同事们卷生卷死，心里有个声音在问：值得吗？\n\n"内卷是一场没有终点的赛跑——你以为你在追别人，其实别人也在追你。"',
      cond: g => g.job!=='待业中' && g.jobSalary>8000 && !g.flags.involutionChoice && g.age>=24 && g.age<=40,
      choices:[
        { label:'跟着卷！', hint:'-❤️ +💰 +🧠', fn: g => { g.flags.involutionChoice=true; g.consecutiveOvertime=(g.consecutiveOvertime||0)+6; return{health:-15,money:15000,intel:5,mood:-10}; }},
        { label:'做最低限度的工作', hint:'+❤️ +😊', fn: g => { g.flags.involutionChoice=true; g.flags.quietQuitting=true; return{health:5,mood:10,money:-2000}; }},
        { label:'开始准备跳槽', hint:'+🧠 -💰', fn: g => { g.flags.involutionChoice=true; return{intel:10,mood:5,money:-1000}; }},
        { label:'跟leader谈条件', hint:'🎲 +💰 +👥', fn: g => { g.flags.involutionChoice=true; if(g.charm>60&&Math.random()>0.5){return{money:8000,social:8,mood:10}}else{return{mood:-8,social:-3}} }},
      ]},
    { id:'social_credit_event', icon:'📊', title:'征信危机',
      body:'你查了一下自己的征信报告，发现：\n\n- 你之前忘了还一笔小额网贷\n- 信用卡有一次逾期记录\n- 你的信用评分下降了\n\n这意味着：以后买房贷款、租车、甚至找工作都可能受影响。\n\n"征信是你在金融世界的身份证——一旦花了，洗白很难。"',
      cond: g => g.money<0 && !g.flags.creditCrisis && g.age>=25,
      choices:[
        { label:'立刻还清所有欠款', hint:'-💰 +🧠', fn: g => { g.flags.creditCrisis=true; g.flags.creditRepaired=true; return{money:-15000,intel:5,mood:10}; }},
        { label:'跟银行协商分期', hint:'+🧠 +😊', fn: g => { g.flags.creditCrisis=true; return{money:-5000,intel:8,mood:5}; }},
        { label:'先不管了', hint:'-😊', fn: g => { g.flags.creditCrisis=true; g.flags.badCredit=true; return{mood:-10}; }},
      ]},
    { id:'generational_clash', icon:'💥', title:'代际冲突',
      body:'春节回家，你和你爸/你妈大吵了一架。\n\n导火索可能是：\n- "什么时候结婚？"\n- "为什么不要孩子？"\n- "你那个工作到底能赚多少？"\n- "隔壁老王的孩子都生二胎了"\n\n你说了不该说的话。你妈哭了。你爸摔了杯子。\n\n你摔门而出，在小区楼下抽了根烟。\n\n"代际冲突不是谁对谁错，是两个时代的碰撞。"',
      cond: g => g.age>=26 && g.age<=38 && g.relationships && g.relationships.family>30 && !g.flags.generationalClash && Math.random()>0.7,
      choices:[
        { label:'道歉，但不改变立场', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.generationalClash=true; g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{mood:5,social:3}; }},
        { label:'坚持己见', hint:'-👨‍👩‍👧 +✨', fn: g => { g.flags.generationalClash=true; g.relationships.family=clamp((g.relationships.family||60)-15,0,100); return{mood:-5,charm:5}; }},
        { label:'试着理解他们', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.generationalClash=true; g.flags.generationalGap=true; g.relationships.family=clamp((g.relationships.family||60)+20,0,100); return{intel:8,mood:10}; }},
        { label:'冷战，假装没发生', hint:'-👨‍👩‍👧 -😊', fn: g => { g.flags.generationalClash=true; g.relationships.family=clamp((g.relationships.family||60)-10,0,100); return{mood:-8}; }},
      ]},
    // === v2.32 CHAIN EVENTS & SOCIAL COMMENTARY ===
    { id:'quiet_quitting_backlash', icon:'⚡', title:'躺平被发现了',
      body:'你quiet quitting了几个月——准点下班，只做分内事，不主动加班。\n\n你的leader找你谈话了："你最近表现不太好，是不是有什么想法？"\n\n你心里想："我只是在做我份内的工作。"\n\n但在内卷文化里，"份内"已经不够了。\n\n"躺平不是不工作，是拒绝被工作定义。但你的老板不这么看。"',
      cond: g => g.flags.quietQuitting && g.job!=='待业中' && !g.flags.quietQuitBacklash,
      choices:[
        { label:'坦白自己的想法', hint:'+🧠 +😊 -💰', fn: g => { g.flags.quietQuitBacklash=true; if(g.intel>70){return{intel:5,mood:8,money:-3000}}else{return{mood:-10,money:-5000}} }},
        { label:'假装重新振作', hint:'+💰 -😊', fn: g => { g.flags.quietQuitBacklash=true; return{money:3000,mood:-8,health:-5}; }},
        { label:'趁机谈离职', hint:'🎲 +💰 +😊', fn: g => { g.flags.quietQuitBacklash=true; if(Math.random()>0.4){const severance=Math.floor(g.jobSalary*3);setJob(g,'待业中',0);return{money:severance,mood:15}}else{return{mood:-10}} }},
      ]},
    { id:'tech_layoff', icon:'📉', title:'互联网大裁员',
      body:'你的公司宣布裁员20%。\n\nHR说这是"组织架构调整"，你的leader说"我也不想"，你的同事说"下一个就是我"。\n\n你的工牌还没被收走，但你已经开始更新简历了。\n\n"互联网行业只有两种人：被裁的，和等着被裁的。"',
      cond: g => g.job!=='待业中' && g.jobSalary>15000 && g.age>=28 && g.age<=42 && !g.flags.techLayoff && Math.random()>0.7,
      choices:[
        { label:'主动辞职拿N+1', hint:'+💰 -😊', fn: g => { g.flags.techLayoff=true; const severance=Math.floor(g.jobSalary*2);setJob(g,'待业中',0);return{money:severance,mood:-10,social:-5}; }},
        { label:'等着被裁拿N+3', hint:'🎲 +💰💰', fn: g => { g.flags.techLayoff=true; if(Math.random()>0.3){const severance=Math.floor(g.jobSalary*4);setJob(g,'待业中',0);return{money:severance,mood:-15}}else{setJob(g,'待业中',0);return{mood:-25}} }},
        { label:'拼命表现争取留下', hint:'-❤️ +🧠', fn: g => { g.flags.techLayoff=true; if(g.intel>75&&Math.random()>0.5){return{health:-10,intel:5,mood:5}}else{setJob(g,'待业中',0);return{health:-15,mood:-20}} }},
        { label:'开始找下家', hint:'+🧠 +👥', fn: g => { g.flags.techLayoff=true; g.flags.jobHunting=true; return{intel:5,social:5,mood:-5}; }},
      ]},
    { id:'side_hustle_boom', icon:'🚀', title:'副业爆单',
      body:'你的副业突然火了！\n\n也许是你的自媒体账号突然涨粉，也许是你做的App突然有了付费用户，也许是你代购的东西突然被抢光了。\n\n这个月的副业收入超过了主业！\n\n"当副业超过主业，它就不再是副业了——它是你的第二人生。"',
      cond: g => g.flags.sideHustle && g.job!=='待业中' && !g.flags.sideHustleBoom && g.age>=25,
      choices:[
        { label:'辞职全职做副业', hint:'🎲 +💰 +😊', fn: g => { g.flags.sideHustleBoom=true; if(Math.random()>0.4){setJob(g,'自由职业者',Math.floor(g.jobSalary*0.8));return{money:20000,mood:25,charm:8}}else{setJob(g,'待业中',0);return{money:-10000,mood:-15}} }},
        { label:'两边都做', hint:'-❤️ +💰 +💰', fn: g => { g.flags.sideHustleBoom=true; return{health:-10,money:30000,intel:5,mood:10}; }},
        { label:'保持现状，慢慢来', hint:'+😊 +🧠', fn: g => { g.flags.sideHustleBoom=true; return{money:15000,mood:12,intel:5}; }},
      ]},
    { id:'existential_dread', icon:'🌑', title:'存在焦虑',
      body:'深夜3点，你躺在床上，突然被一个问题击中：\n\n"我这辈子到底在追求什么？"\n\n钱？有了也不够。地位？爬上去也会下来。爱情？也许只是荷尔蒙。\n\n你不是抑郁，你只是在思考人生。\n\n"存在焦虑不是病，是清醒的代价。"',
      cond: g => g.age>=28 && g.intel>65 && !g.flags.existentialDread && g.mood<55 && Math.random()>0.6,
      choices:[
        { label:'读哲学书找答案', hint:'+🧠 +😊', fn: g => { g.flags.existentialDread=true; return{intel:15,mood:10}; }},
        { label:'旅行放空自己', hint:'-💰 +😊 +❤️', fn: g => { g.flags.existentialDread=true; return{money:-8000,mood:20,health:10,charm:5}; }},
        { label:'找心理咨询师', hint:'-💰 +😊 +🧠', fn: g => { g.flags.existentialDread=true; g.flags.therapy=true; return{money:-3000,mood:15,intel:5,health:5}; }},
        { label:'不去想，继续生活', hint:'+😊 -🧠', fn: g => { g.flags.existentialDread=true; return{mood:5,intel:-3}; }},
      ]},
    { id:'old_friend_reunion', icon:'🍻', title:'老友重逢',
      body:'你在朋友圈看到了一个熟悉的名字——你的大学室友/高中同学。\n\nTA来你的城市出差，约你见面。\n\n你们在烧烤摊前坐下，一杯啤酒下肚，仿佛回到了10年前。\n\nTA说："你变了。"你说："你也是。"\n\n但聊着聊着，你们发现：有些东西没有变。\n\n"老友是时间给你的礼物——即使好久不联系，一见面还是那个味道。"',
      cond: g => g.age>=28 && g.relationships && g.relationships.friends<60 && !g.flags.oldFriendReunion && Math.random()>0.6,
      choices:[
        { label:'畅聊到天亮', hint:'+👥 +😊 +❤️', fn: g => { g.flags.oldFriendReunion=true; g.relationships.friends=clamp((g.relationships.friends||40)+20,0,100); return{social:15,mood:20,health:-3}; }},
        { label:'交换近况，保持联系', hint:'+👥 +😊', fn: g => { g.flags.oldFriendReunion=true; g.relationships.friends=clamp((g.relationships.friends||40)+10,0,100); return{social:8,mood:10}; }},
        { label:'只是礼貌性见面', hint:'+😊', fn: g => { g.flags.oldFriendReunion=true; return{mood:3}; }},
      ]},
    { id:'pension_anxiety', icon:'👴', title:'养老焦虑',
      body:'你看到一条新闻："2040年养老金可能入不敷出。"\n\n你算了算：你现在每月交社保，但退休后能拿多少？\n\n你打开计算器：按现在的工资和缴费年限，退休后每月大概4000元。\n\n而你现在每月花费至少8000元。\n\n"养老焦虑不是杞人忧天，是数学题。"',
      cond: g => g.age>=32 && g.job!=='待业中' && !g.flags.pensionAnxiety,
      choices:[
        { label:'开始做养老规划', hint:'-💰 +🧠 +😊', fn: g => { g.flags.pensionAnxiety=true; g.flags.retirementPlanning=true; return{money:-20000,intel:10,mood:8}; }},
        { label:'投资养老房产', hint:'-💰💰 +💰?', fn: g => { g.flags.pensionAnxiety=true; if(Math.random()>0.5){return{money:-100000,mood:10,intel:5}}else{return{money:-150000,mood:-15}} }},
        { label:'不管了，活在当下', hint:'+😊 -🧠', fn: g => { g.flags.pensionAnxiety=true; return{mood:5,intel:-3}; }},
        { label:'多生孩子多保障', hint:'-💰 +👨‍👩‍👧', fn: g => { g.flags.pensionAnxiety=true; if(g.flags.hasChild){g.relationships.family=clamp((g.relationships.family||60)+5,0,100)}return{money:-10000,mood:3}; }},
      ]},
    // === v2.33 RELATIONSHIP DEPTH & CULTURAL EVENTS ===
    { id:'workplace_politics', icon:'🎭', title:'办公室政治',
      body:'你的两个同事在背后互相使绊子，而你被夹在中间。\n\nA说B在领导面前告了你的状。B说A在背后说你坏话。\n\n你不知道该信谁，但你确定的是：在这场政治游戏里，中立是最危险的立场。\n\n"办公室政治不是电视剧，但比电视剧精彩——因为每个演员都是真的想弄死你。"',
      cond: g => g.job!=='待业中' && g.relationships && g.relationships.colleagues>20 && !g.flags.officePolitics && Math.random()>0.6,
      choices:[
        { label:'站队A', hint:'🎲 +👥 -👥', fn: g => { g.flags.officePolitics=true; if(Math.random()>0.5){g.relationships.colleagues=clamp((g.relationships.colleagues||30)+10,0,100);return{social:8,mood:5}}else{g.relationships.colleagues=clamp((g.relationships.colleagues||30)-15,0,100);return{social:-10,mood:-10}} }},
        { label:'保持中立', hint:'+🧠', fn: g => { g.flags.officePolitics=true; return{intel:5,mood:-3}; }},
        { label:'两边都不得罪', hint:'+✨ +🧠', fn: g => { g.flags.officePolitics=true; return{charm:5,intel:8,social:3}; }},
        { label:'向HR举报', hint:'-👥 +🧠', fn: g => { g.flags.officePolitics=true; g.relationships.colleagues=clamp((g.relationships.colleagues||30)-20,0,100); return{social:-15,intel:5,mood:-5}; }},
      ]},
    { id:'relationship_test', icon:'💔', title:'感情考验',
      body:"你和你的另一半出现了严重的分歧。\n\n也许是关于要不要结婚，要不要孩子，要不要去另一个城市，或者只是\"你到底爱不爱我\"。\n\n你们吵了一架。TA说：\"你从来不理解我。\"你说：\"你从来不理解我的不理解。\"\n\n\"感情里最大的谎言不是'我不爱你'，而是'我理解你'——理解一个人，比爱一个人难多了。\"",
      cond: g => g.flags.hasPartner && g.relationships && g.relationships.partner>30 && !g.flags.relationshipTest && Math.random()>0.5,
      choices:[
        { label:'主动道歉', hint:'+❤️ +😊', fn: g => { g.flags.relationshipTest=true; g.relationships.partner=clamp((g.relationships.partner||50)+15,0,100); return{mood:10,charm:3}; }},
        { label:'坚持自己的立场', hint:'-❤️ +✨', fn: g => { g.flags.relationshipTest=true; g.relationships.partner=clamp((g.relationships.partner||50)-10,0,100); return{mood:-5,charm:5}; }},
        { label:'一起做心理咨询', hint:'-💰 +❤️ +🧠', fn: g => { g.flags.relationshipTest=true; g.relationships.partner=clamp((g.relationships.partner||50)+20,0,100); return{money:-2000,mood:8,intel:5}; }},
        { label:'冷处理，等时间解决', hint:'-❤️', fn: g => { g.flags.relationshipTest=true; g.relationships.partner=clamp((g.relationships.partner||50)-15,0,100); return{mood:-8}; }},
      ]},
    { id:'social_media_fame', icon:'📱', title:'意外走红',
      body:'你随手发的一条微博/抖音/小红书突然火了。\n\n一夜之间，你的粉丝从200变成了20000。评论区炸了，有人夸你，有人骂你，有人说你蹭热度。\n\n你看着手机通知栏里999+的消息，不知道该高兴还是该害怕。\n\n"15分钟的名气，可能换来15年的网暴。"',
      cond: g => g.charm>60 && !g.flags.socialMediaFame && g.age>=22 && g.age<=40 && Math.random()>0.8,
      choices:[
        { label:'趁热打铁做自媒体', hint:'+💰 +✨ +😊', fn: g => { g.flags.socialMediaFame=true; g.flags.influencer=true; return{money:10000,charm:15,mood:15,social:10}; }},
        { label:'低调处理，删帖', hint:'+😊 -✨', fn: g => { g.flags.socialMediaFame=true; return{mood:5,charm:-5}; }},
        { label:'回应争议，引发更多讨论', hint:'🎲 +✨ +💰', fn: g => { g.flags.socialMediaFame=true; if(Math.random()>0.5){return{charm:20,money:15000,mood:10}}else{return{charm:-10,mood:-20,social:-5}} }},
      ]},
    { id:'childcare_crisis', icon:'👶', title:'育儿焦虑',
      body:'有了孩子后，你发现生活完全变了：\n\n- 奶粉、尿布、早教班——每月多出5000+开销\n- 你和另一半为了"怎么带孩子"吵了无数次\n- 你妈说"我们那时候不也这么过来的"\n- 你的同事说"有了孩子就别想升职了"\n\n你看着孩子熟睡的脸，觉得一切都值了。然后你看到了账单。\n\n"养孩子是世界上唯一一份没有工资的全职工作。"',
      cond: g => g.flags.hasChild && !g.flags.childcareCrisis && g.age>=28,
      choices:[
        { label:'请月嫂/保姆', hint:'-💰 +😊 +❤️', fn: g => { g.flags.childcareCrisis=true; return{money:-15000,mood:10,health:5}; }},
        { label:'让父母来帮忙', hint:'+👨‍👩‍👧 -😊', fn: g => { g.flags.childcareCrisis=true; g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{mood:-5,social:3}; }},
        { label:'辞职在家带娃', hint:'-💰 -💼 +❤️ +😊', fn: g => { g.flags.childcareCrisis=true; setJob(g,'全职家长',0); return{mood:15,health:5,social:-10}; }},
        { label:'咬牙自己扛', hint:'-❤️ -😊 +💰', fn: g => { g.flags.childcareCrisis=true; return{health:-10,mood:-10}; }},
      ]},
    { id:'hometown_nostalgia', icon:'🌾', title:'乡愁',
      body:'你在朋友圈看到老家发的照片：\n\n你小时候走过的那条路被拆了。你上过的小学搬了。你家的老房子变成了一栋商业楼。\n\n你突然很想回家，但你不知道回去还能认出来吗。\n\n你妈在电话里说："家里变化很大，你回来看看嘛。"\n\n"故乡是一个你回不去的地方——不是因为路远，而是因为时间。"',
      cond: g => g.months>=36 && !g.flags.hometownNostalgia && g.relationships && g.relationships.family>40,
      choices:[
        { label:'请假回家看看', hint:'-💰 +👨‍👩‍👧 +😊', fn: g => { g.flags.hometownNostalgia=true; g.relationships.family=clamp((g.relationships.family||60)+15,0,100); return{money:-3000,mood:20,health:5}; }},
        { label:'视频通话就好', hint:'+👨‍👩‍👧', fn: g => { g.flags.hometownNostalgia=true; g.relationships.family=clamp((g.relationships.family||60)+5,0,100); return{mood:5}; }},
        { label:'发条朋友圈感慨一下', hint:'+😊 +✨', fn: g => { g.flags.hometownNostalgia=true; return{mood:8,charm:3}; }},
      ]},
    // === v2.34 NICHE EVENTS ===
    { id:'pet_adoption', icon:'🐕', title:'领养宠物',
      body:'你路过一家宠物店，看到一只小奶猫/小奶狗在笼子里用无辜的眼神看着你。\n\n你心想：养宠物每月要花500+，要铲屎、要遛弯、要带它看病。\n\n但它真的好可爱啊……\n\n"宠物不会说话，但它会用一生来回答你一个问题：你愿意爱我吗？"',
      cond: g => !g.flags.hasPet && g.money>5000 && g.age>=24 && Math.random()>0.6,
      choices:[
        { label:'领养它！', hint:'-💰 +😊 +❤️', fn: g => { g.flags.hasPet=true; return{money:-3000,mood:25,health:5,charm:3}; }},
        { label:'先考虑考虑', hint:'+🧠', fn: g => ({intel:3,mood:5}) },
        { label:'算了，养不起', hint:'-😊', fn: g => ({mood:-5}) },
      ]},
    { id:'gig_economy', icon:'🛵', title:'零工经济',
      body:'你的同事辞职去送外卖了。他说："自由，不用看老板脸色。"\n\n你打开App看了看：高峰期一单8块，一天跑12小时能赚200多。\n\n你算了算你的工资，突然觉得：也许"自由"有另一种定义。\n\n"零工经济不是自由，是用自由换了另一种不自由。"',
      cond: g => g.job!=='待业中' && g.jobSalary<12000 && !g.flags.gigEconomy && g.age>=25,
      choices:[
        { label:'下班后兼职送外卖', hint:'+💰 -❤️', fn: g => { g.flags.gigEconomy=true; g.flags.sideHustle=true; return{money:3000,health:-8,mood:-3}; }},
        { label:'做网约车司机', hint:'+💰 -❤️', fn: g => { g.flags.gigEconomy=true; g.flags.sideHustle=true; return{money:4000,health:-5,mood:-5}; }},
        { label:'算了，还是好好上班', hint:'+😊', fn: g => { g.flags.gigEconomy=true; return{mood:3}; }},
      ]},
    { id:'midnight_reflection', icon:'🌙', title:'深夜独白',
      body:'凌晨2点，你一个人躺在床上，睡不着。\n\n你想起了很多事：小时候的梦想、大学时的热血、刚来大城市时的雄心壮志。\n\n你问自己："现在的我，是10年前的我想要的样子吗？"\n\n答案可能是yes，可能是no，可能是"我不知道"。\n\n"深夜是人最诚实的时候——因为你骗不了自己。"',
      cond: g => g.age>=26 && g.mood<55 && !g.flags.midnightReflection && Math.random()>0.6,
      choices:[
        { label:'写日记记录心情', hint:'+🧠 +😊', fn: g => { g.flags.midnightReflection=true; return{intel:8,mood:10}; }},
        { label:'给老朋友打个电话', hint:'+👥 +😊', fn: g => { g.flags.midnightReflection=true; g.relationships.friends=clamp((g.relationships.friends||40)+10,0,100); return{social:8,mood:12}; }},
        { label:'刷手机到天亮', hint:'-❤️ -😊', fn: g => { g.flags.midnightReflection=true; return{health:-5,mood:-5}; }},
        { label:'打开招聘网站', hint:'+🧠', fn: g => { g.flags.midnightReflection=true; return{intel:5,mood:3}; }},
      ]},
    { id:'consumer_trap', icon:'🛍️', title:'消费主义陷阱',
      body:'双十一/618来了。你的购物车里堆满了东西：\n\n- 最新款手机（虽然现在的还能用）\n- 一堆衣服（虽然衣柜里还有没拆标签的）\n- 各种护肤品（虽然你根本用不完）\n\n直播间里，主播在喊："3、2、1，上链接！"你的手指已经在付款按钮上了。\n\n"消费主义最大的谎言：你以为你在买快乐，其实你在买焦虑。"',
      cond: g => (g.month===6 || g.month===11) && !g.flags.consumerTrap && g.money>5000,
      choices:[
        { label:'清空购物车！', hint:'-💰💰 +😊', fn: g => { g.flags.consumerTrap=true; return{money:-15000,mood:20,charm:5}; }},
        { label:'只买必需品', hint:'-💰 +🧠', fn: g => { g.flags.consumerTrap=true; return{money:-2000,intel:5,mood:3}; }},
        { label:'什么都不买', hint:'+💰 +🧠 +😊', fn: g => { g.flags.consumerTrap=true; g.flags.minimalist=true; return{intel:8,mood:8}; }},
      ]},
    // === v2.35 EVENTS ===
    { id:'rainy_season', icon:'🌧️', title:'梅雨季',
      body:'连续下了两周的雨。你的衣服永远晒不干，你的心情永远阴沉沉。\n\n你打开天气预报：未来7天，全是雨。\n\n你开始理解为什么南方人那么爱煲汤——因为身体里的湿气，需要一点温暖来驱散。\n\n"梅雨季是大城市的隐喻：你以为天晴了，其实只是两场雨之间的间歇。"',
      cond: g => (g.city==='shanghai' || g.city==='hangzhou' || g.city==='guangzhou') && (g.month>=5 && g.month<=7) && !g.flags.rainySeason && Math.random()>0.5,
      choices:[
        { label:'买台烘干机', hint:'-💰 +😊', fn: g => { g.flags.rainySeason=true; return{money:-2000,mood:10}; }},
        { label:'学会和潮湿共处', hint:'+🧠 +😊', fn: g => { g.flags.rainySeason=true; return{intel:3,mood:5,health:-3}; }},
        { label:'去北方躲一躲', hint:'-💰 +😊 +❤️', fn: g => { g.flags.rainySeason=true; return{money:-3000,mood:15,health:5}; }},
      ]},
    { id:'typhoon_day', icon:'🌀', title:'台风来了',
      body:'气象台发布红色预警：超强台风即将登陆。\n\n公司发来邮件："台风天照常上班，如有困难请提前请假。"\n\n你看了看窗外已经开始摇晃的树，又看了看那条"如有困难"的邮件——什么算"困难"？被风吹走算吗？\n\n"打工人的命，没有台风值钱。"',
      cond: g => (g.city==='shenzhen' || g.city==='guangzhou' || g.city==='shanghai') && (g.month>=7 && g.month<=10) && !g.flags.typhoonDay && Math.random()>0.6,
      choices:[
        { label:'冒着台风去上班', hint:'-❤️ +💼', fn: g => { g.flags.typhoonDay=true; if(Math.random()>0.7){return{health:-15,mood:-10,money:500}}else{return{health:-5,mood:-8}} }},
        { label:'请假在家', hint:'+😊 -💰', fn: g => { g.flags.typhoonDay=true; return{mood:5,money:-500}; }},
        { label:'在家远程办公', hint:'+🧠 +😊', fn: g => { g.flags.typhoonDay=true; g.flags.remoteWork=true; return{intel:3,mood:3}; }},
      ]},
    { id:'classmate_reunion', icon:'🍻', title:'同学聚会',
      body:'大学同学群突然有人张罗聚会。\n\n你看了看群里：\n- 张三：某大厂P8，年薪百万\n- 李四：创业成功，刚融了A轮\n- 王五：已经买了两套房\n- 你：……\n\n你开始纠结：去，还是不去？去了是叙旧，还是比较？\n\n"同学聚会是成年人最残酷的社交——你不是在回忆青春，你是在被青春审判。"',
      cond: g => g.age>=26 && !g.flags.classmateReunion && Math.random()>0.6,
      choices:[
        { label:'去！坦然面对', hint:'+👥 +😊', fn: g => { g.flags.classmateReunion=true; if(g.jobSalary>=15000||g.money>=100000){return{social:10,mood:8,charm:3}}else{return{social:5,mood:-5}} }},
        { label:'去，但低调点', hint:'+👥', fn: g => { g.flags.classmateReunion=true; return{social:5,mood:0}; }},
        { label:'找借口不去', hint:'-👥 +😊', fn: g => { g.flags.classmateReunion=true; return{social:-5,mood:3}; }},
        { label:'删了同学群', hint:'-👥 +🧠', fn: g => { g.flags.classmateReunion=true; return{social:-10,intel:3,mood:5}; }},
      ]},
    { id:'cafe_office', icon:'☕', title:'咖啡馆办公',
      body:'你发现了一家不错的咖啡馆：\n\n- WiFi快\n- 插座多\n- 咖啡不贵\n- 没人赶你\n\n你开始每周去那里办公/学习。你发现：换了个环境，效率居然高了。\n\n咖啡馆里的人都在假装很忙——和你一样。\n\n"咖啡馆是大城市的公共客厅，也是孤独者的避难所。"',
      cond: g => !g.flags.cafeOffice && g.age>=24 && g.intel>=50 && Math.random()>0.5,
      choices:[
        { label:'成为常客', hint:'-💰 +🧠 +😊', fn: g => { g.flags.cafeOffice=true; return{money:-1500,intel:5,mood:8,charm:3}; }},
        { label:'偶尔去去', hint:'+😊', fn: g => { g.flags.cafeOffice=true; return{money:-300,mood:5}; }},
        { label:'还是在家吧', hint:'+💰', fn: g => { g.flags.cafeOffice=true; return{mood:-3}; }},
      ]},
    { id:'health_scare', icon:'🏥', title:'体检报告',
      body:'公司组织了年度体检。一周后，报告出来了：\n\n- 血脂偏高 ⚠️\n- 颈椎曲度变直 ⚠️\n- 视力下降 ⚠️\n- 体重超标 ⚠️\n\n你看了看报告，又看了看桌上的外卖——突然觉得手里的炸鸡不香了。\n\n"体检报告是成年人最害怕的成绩单。"',
      cond: g => g.age>=28 && !g.flags.healthScare && g.health<70 && Math.random()>0.5,
      choices:[
        { label:'开始健身养生', hint:'+❤️ +😊 -💰', fn: g => { g.flags.healthScare=true; g.flags.fitnessJourney=true; return{health:15,mood:10,money:-3000}; }},
        { label:'焦虑三天后忘记', hint:'-❤️', fn: g => { g.flags.healthScare=true; return{mood:-5,health:-5}; }},
        { label:'买一堆保健品', hint:'-💰', fn: g => { g.flags.healthScare=true; return{money:-5000,health:3,mood:3}; }},
        { label:'预约专家门诊', hint:'-💰 +❤️', fn: g => { g.flags.healthScare=true; return{money:-2000,health:8,mood:5}; }},
      ]},
    { id:'rent_increase_v2', icon:'📈', title:'房东涨价',
      body:'房东发来消息："下个月开始，房租涨500。"\n\n你算了算：这已经是你来这个城市后第3次涨房租了。\n\n每次涨房租，你都会想：是不是该买房了？然后你看了看房价——算了，还是继续租吧。\n\n"房租是大城市的月租税，交的是你在这里呼吸的权利。"',
      cond: g => !g.flags.hasHouse && g.months>=12 && !g.flags.rentIncrease && Math.random()>0.6,
      choices:[
        { label:'接受涨价', hint:'-💰 +😊', fn: g => { g.flags.rentIncrease=true; return{money:-500,mood:-5}; }},
        { label:'搬家找便宜的', hint:'-💰 -😊 +❤️', fn: g => { g.flags.rentIncrease=true; g.flags.movedHouse=true; return{money:-3000,mood:-10,health:-5}; }},
        { label:'找室友分摊', hint:'-😊 +👥', fn: g => { g.flags.rentIncrease=true; return{mood:-5,social:5}; }},
        { label:'和房东谈判', hint:'🎲', fn: g => { g.flags.rentIncrease=true; if(g.charm>=60&&Math.random()>0.5){return{mood:5,charm:3}}else{return{mood:-10}} }},
      ]},
    // === v2.36 EVENTS ===
    { id:'blind_box', icon:'🎁', title:'盲盒经济',
      body:'你路过一家泡泡玛特，橱窗里的限量款公仔闪闪发光。\n\n"只要59元一个，说不定能抽到隐藏款！"\n\n你已经买了5个了，花了300块，还没抽到你想要的那个。你开始理解为什么有人说这是"合法赌博"。\n\n"盲盒的魅力不是里面的东西，是拆盒那一刻的期待感。"',
      cond: g => !g.flags.blindBox && g.age<=35 && g.money>3000 && Math.random()>0.6,
      choices:[
        { label:'再买10个！', hint:'-💰💰 +😊', fn: g => { g.flags.blindBox=true; return{money:-590,mood:15,charm:3}; }},
        { label:'只买一个尝尝鲜', hint:'-💰 +😊', fn: g => { g.flags.blindBox=true; return{money:-59,mood:5}; }},
        { label:'理智战胜冲动', hint:'+🧠', fn: g => { g.flags.blindBox=true; return{intel:3,mood:-3}; }},
      ]},
    { id:'short_video_addiction', icon:'📱', title:'短视频成瘾',
      body:'你本来只想刷5分钟抖音。\n\n抬头一看，已经凌晨2点了。\n\n你看了看手机使用时间：今天已使用6小时23分。\n\n你开始思考：是你在使用手机，还是手机在使用你？\n\n"短视频时代，你的注意力才是最值钱的商品。"',
      cond: g => !g.flags.shortVideoAddiction && g.age<=40 && Math.random()>0.5,
      choices:[
        { label:'设置使用时间限制', hint:'+🧠 +❤️', fn: g => { g.flags.shortVideoAddiction=true; return{intel:5,health:3,mood:5}; }},
        { label:'继续刷，明天再说', hint:'-❤️ -😊', fn: g => { g.flags.shortVideoAddiction=true; return{health:-8,mood:-5,intel:-3}; }},
        { label:'卸载所有短视频App', hint:'+🧠 +😊 +❤️', fn: g => { g.flags.shortVideoAddiction=true; g.flags.digitalDetox=true; return{intel:8,mood:10,health:5}; }},
        { label:'开始做短视频', hint:'+✨ +👥', fn: g => { g.flags.shortVideoAddiction=true; g.flags.contentCreator=true; return{charm:8,social:5,mood:5}; }},
      ]},
    { id:'new_neighbor', icon:'🏘️', title:'新邻居',
      body:'你的邻居搬走了，来了一个新邻居。\n\nta很年轻，看起来也是"漂"在大城市的人。你们在电梯里碰面，尴尬地笑了笑。\n\n"在大城市，你和邻居的关系通常是：知道ta的存在，但不知道ta的名字。"',
      cond: g => !g.flags.hasNewNeighbor && !g.flags.hasHouse && g.months>=6 && Math.random()>0.7,
      choices:[
        { label:'主动打招呼', hint:'+👥 +😊', fn: g => { g.flags.hasNewNeighbor=true; g.flags.goodNeighbor=true; return{social:8,mood:5}; }},
        { label:'礼貌地点头', hint:'+👥', fn: g => { g.flags.hasNewNeighbor=true; return{social:3}; }},
        { label:'假装看手机', hint:'-😊', fn: g => { g.flags.hasNewNeighbor=true; return{mood:-3}; }},
      ]},
    { id:'marathon_challenge', icon:'🏃', title:'马拉松挑战',
      body:'你的朋友圈被刷屏了：同事/朋友完成了半程马拉松。\n\n你看了看自己日渐圆润的肚子，又看了看那双买了3个月还没穿过的跑鞋。\n\n"每个跑马拉松的人都说：最难的不是跑步，是起床。"',
      cond: g => g.flags.fitnessJourney && !g.flags.marathonChallenge && g.health>=60 && Math.random()>0.5,
      choices:[
        { label:'报名半马！', hint:'+❤️ +😊 -💰', fn: g => { g.flags.marathonChallenge=true; if(g.health>=75){return{health:15,mood:20,money:-500}}else{return{health:-10,mood:-5,money:-500}} }},
        { label:'先跑5公里试试', hint:'+❤️ +😊', fn: g => { g.flags.marathonChallenge=true; return{health:8,mood:10}; }},
        { label:'还是算了吧', hint:'-😊', fn: g => { g.flags.marathonChallenge=true; return{mood:-5}; }},
      ]},
    { id:'side_project', icon:'💻', title:'副业项目',
      body:'一个朋友找你合作一个副业项目：\n\n- 需要投入3个月周末时间\n- 成功后预计收入5万\n- 失败了就是白干\n\n你看了看你的周末安排：刷手机、睡觉、刷手机。\n\n"副业不是第二份工作，是第二种人生可能性。"',
      cond: g => !g.flags.sideProject && g.intel>=60 && g.job!=='待业中' && g.age>=25 && Math.random()>0.6,
      choices:[
        { label:'全力以赴', hint:'-❤️ +💰💰', fn: g => { g.flags.sideProject=true; if(g.intel>=70&&Math.random()>0.4){return{money:50000,health:-10,mood:15,intel:5}}else{return{health:-15,mood:-10,intel:3}} }},
        { label:'适度参与', hint:'+💰 +🧠', fn: g => { g.flags.sideProject=true; if(Math.random()>0.5){return{money:20000,intel:5}}else{return{intel:3,mood:-3}} }},
        { label:'婉拒', hint:'+😊', fn: g => { g.flags.sideProject=true; return{mood:5}; }},
      ]},
    { id:'hometown_visit_v2', icon:'🚄', title:'回家看看',
      body:'你已经大半年没回家了。你妈在电话里说："有空回来看看吧。"\n\n你打开购票软件：高铁3小时，二等座200块。\n\n你算了算：请假3天，来回路费400，给爸妈买礼物2000。\n\n"回家的成本从来不是车票，是面对他们眼中的期待和你的愧疚。"',
      cond: g => !g.flags.hometownVisit && g.months>=18 && g.money>5000 && Math.random()>0.6,
      choices:[
        { label:'请假回家', hint:'-💰 +😊 +👥', fn: g => { g.flags.hometownVisit=true; g.relationships.family = clamp((g.relationships.family||50)+20,0,100); return{money:-3000,mood:20,social:10}; }},
        { label:'视频通话代替', hint:'+👥', fn: g => { g.flags.hometownVisit=true; g.relationships.family = clamp((g.relationships.family||50)+5,0,100); return{social:3,mood:5}; }},
        { label:'下次再说', hint:'-😊 -👥', fn: g => { g.flags.hometownVisit=true; g.relationships.family = clamp((g.relationships.family||50)-10,0,100); return{mood:-8,social:-5}; }},
      ]},
    // === v2.37 EVENTS (Chain events) ===
    { id:'freelance_offer', icon:'💻', title:'自由职业机会',
      body:'一个老客户联系你："我们有个项目，想找你外包做，预算3万。"\n\n你算了算：辞职的话，风险很大；不辞职的话，只能加班做。\n\n"自由职业听起来很美，但自由的代价是不稳定。"',
      cond: g => !g.flags.freelanceOffer && g.intel>=65 && g.job!=='待业中' && g.age>=26 && Math.random()>0.6,
      choices:[
        { label:'辞职做自由职业', hint:'🎲 高风险高回报', fn: g => {
            g.flags.freelanceOffer=true; g.flags.freelancer=true;
            return{mood:10,nextEvent: g => ({
                id:'freelance_result', icon:'💼', title:'自由职业第一年',
                body:'你做了半年自由职业。有时候月入3万，有时候月入3千。\n\n你开始理解：自由职业不是"自由"，是"自己给自己当老板、当员工、当财务"。\n\n"自由职业最大的敌人不是客户，是你的自律。"',
                choices:[
                    { label:'坚持做下去', hint:'+💰 +🧠', fn: g => { if(g.intel>=70&&Math.random()>0.4){g.flags.freelanceSuccess=true;return{money:30000,intel:5,mood:10}}else{return{money:-5000,mood:-10}} }},
                    { label:'重新找工作', hint:'+💰 +😊', fn: g => { g.flags.freelancer=false; g.flags.gotFirstJob=true; g.job='初级工程师'; g.jobSalary=10000; return{money:5000,mood:5}; }},
                    { label:'边工作边接私活', hint:'-❤️ +💰', fn: g => { return{health:-10,money:15000,mood:5}; }},
                ]})
            };
        }},
        { label:'兼职做', hint:'+💰 -❤️', fn: g => { g.flags.freelanceOffer=true; return{money:20000,health:-10,mood:5}; }},
        { label:'婉拒', hint:'+😊', fn: g => { g.flags.freelanceOffer=true; return{mood:3}; }},
      ]},
    { id:'investment_advice', icon:'📊', title:'理财顾问',
      body:'银行理财经理给你推荐了一款产品：\n\n- 预期年化收益8%\n- 锁定期2年\n- 最低投资10万\n\n"收益越高的产品，风险越大——这句话你已经听了一百遍，但你还是想试试。"',
      cond: g => !g.flags.investmentAdvice && g.money>=100000 && g.age>=28 && Math.random()>0.5,
      choices:[
        { label:'投20万试试', hint:'🎲', fn: g => {
            g.flags.investmentAdvice=true;
            return{money:-200000,nextEvent: g => ({
                id:'investment_return', icon:'📈', title:'投资回报',
                body:'2年后，你的投资到期了。\n\n' + (Math.random()>0.5 ? '好消息：收益比预期还高！' : '坏消息：实际收益只有2%，还不如存银行。'),
                choices:[
                    { label:'继续投资', hint:'🎲', fn: g => { if(Math.random()>0.4){return{money:232000,mood:15,intel:5}}else{return{money:180000,mood:-10}} }},
                    { label:'见好就收', hint:'+💰', fn: g => { return{money:216000,mood:10}; }},
                ]})
            };
        }},
        { label:'投10万保守点', hint:'+💰', fn: g => { g.flags.investmentAdvice=true; return{money:-100000,mood:5,nextEvent: g => ({
            id:'investment_small_return', icon:'📊', title:'小额回报',
            body:'你的10万投资到期了，收益8%。\n\n不多不少，但至少没亏。\n\n"投资最重要的不是赚多少，是睡得着觉。"',
            choices:[
                { label:'再投一轮', hint:'+💰', fn: g => { if(Math.random()>0.5){return{money:108000+Math.floor(Math.random()*20000),mood:10}}else{return{money:95000,mood:-5}} }},
                { label:'取出来存银行', hint:'+💰', fn: g => { return{money:108000,mood:5}; }},
            ]})
        }; }},
        { label:'还是存银行吧', hint:'+🧠', fn: g => { g.flags.investmentAdvice=true; return{intel:3,mood:3}; }},
      ]},
    { id:'mentor_found', icon:'👨‍🏫', title:'遇到贵人',
      body:'你在一次行业活动上认识了一位前辈。ta在行业里深耕15年，人脉广泛，见解独到。\n\nta主动加了你微信："年轻人，有空聊聊。"\n\n"贵人不是给你钱的人，是给你方向的人。"',
      cond: g => !g.flags.mentorFound && g.social>=50 && g.age>=26 && g.age<=35 && Math.random()>0.6,
      choices:[
        { label:'拜师学习', hint:'+🧠 +👥', fn: g => {
            g.flags.mentorFound=true;
            return{intel:8,social:10,nextEvent: g => ({
                id:'mentor_guidance', icon:'🎯', title:'贵人指点',
                body:'你的导师给你分析了你的职业规划：\n\n"你现在的瓶颈不是能力，是视野。你应该去更大的平台看看。"\n\nta推荐了你一个不错的机会。\n\n"好的导师不是告诉你答案，是帮你看到问题。"',
                choices:[
                    { label:'接受推荐', hint:'+💰 +👥', fn: g => { g.jobSalary = Math.floor(g.jobSalary * 1.5) || 15000; g.job = getTitle(g, 'senior'); return{money:10000,mood:15,social:10}; }},
                    { label:'继续现在的工作', hint:'+🧠', fn: g => { return{intel:5,mood:5}; }},
                    { label:'请教创业经验', hint:'🎲', fn: g => { if(g.intel>=70&&Math.random()>0.5){g.flags.entrepreneur=true;return{mood:20,intel:10}}else{return{mood:-5}} }},
                ]})
            };
        }},
        { label:'加个微信就好', hint:'+👥', fn: g => { g.flags.mentorFound=true; return{social:5}; }},
        { label:'不太想社交', hint:'-😊', fn: g => { g.flags.mentorFound=true; return{mood:-3}; }},
      ]},
    // === v2.38 EVENTS ===
    { id:'ai_replacement', icon:'🤖', title:'AI来了',
      body:'公司引进了AI工具，你的工作量减少了一半。\n\n领导说："AI是来帮你们的。"但你知道：帮你的下一步，就是替你。\n\n你开始焦虑：你的工作，5年后还存在吗？\n\n"AI不会取代所有人，但会用AI的人会取代不会用的人。"',
      cond: g => !g.flags.aiReplacement && g.age>=25 && g.age<=45 && g.job!=='待业中' && Math.random()>0.5,
      choices:[
        { label:'学习AI技能', hint:'+🧠 +💰', fn: g => { g.flags.aiReplacement=true; g.flags.aiSkills=true; return{intel:12,mood:5,money:-3000}; }},
        { label:'转行到AI替代不了的行业', hint:'+🧠 -💰', fn: g => { g.flags.aiReplacement=true; g.flags.careerChange=true; return{intel:8,mood:-5,money:-5000}; }},
        { label:'先观望', hint:'', fn: g => { g.flags.aiReplacement=true; return{mood:-8}; }},
        { label:'躺平接受', hint:'-🧠 +😊', fn: g => { g.flags.aiReplacement=true; g.flags.lyingFlat=true; return{intel:-5,mood:3}; }},
      ]},
    { id:'workplace_pua', icon:'😤', title:'职场PUA',
      body:'你的领导开始"PUA"你：\n\n"你看看别人加班到12点，你怎么6点就走？"\n"公司给你机会是看得起你。"\n"你不满意可以走啊。"\n\n你开始怀疑：是我太矫情，还是ta太过分？\n\n"职场PUA的本质是：用道德绑架代替合理管理。"',
      cond: g => !g.flags.workplacePUA && g.job!=='待业中' && g.age>=24 && Math.random()>0.5,
      choices:[
        { label:'硬刚回去', hint:'+😊 -💼', fn: g => { g.flags.workplacePUA=true; if(g.charm>=60||g.intel>=70){return{mood:15,charm:5}}else{return{mood:-10,money:-5000}} }},
        { label:'收集证据，准备仲裁', hint:'+🧠 +💰', fn: g => { g.flags.workplacePUA=true; g.flags.laborRights=true; return{intel:5,mood:5,money:10000}; }},
        { label:'忍气吞声', hint:'-😊 -❤️', fn: g => { g.flags.workplacePUA=true; return{mood:-15,health:-10}; }},
        { label:'跳槽', hint:'+😊 +💰', fn: g => { g.flags.workplacePUA=true; g.jobSalary=Math.floor(g.jobSalary*1.2); return{mood:10,money:5000}; }},
      ]},
    { id:'year_end_review', icon:'📊', title:'年终总结',
      body:'又到年底了。你打开日记/朋友圈，回顾这一年：\n\n- 赚了多少？\n- 成长了多少？\n- 快乐有多少？\n\n"年终总结不是给领导看的PPT，是给自己的成绩单。"',
      cond: g => !g.flags.yearEndReview && g.month===12 && g.months>=12 && Math.random()>0.4,
      choices:[
        { label:'认真写总结', hint:'+🧠 +😊', fn: g => { g.flags.yearEndReview=true; return{intel:5,mood:8}; }},
        { label:'发条朋友圈', hint:'+👥 +✨', fn: g => { g.flags.yearEndReview=true; return{social:5,charm:3,mood:5}; }},
        { label:'算了，没什么好总结的', hint:'-😊', fn: g => { g.flags.yearEndReview=true; return{mood:-5}; }},
      ]},
    { id:'roommate_conflict', icon:'🏠', title:'室友矛盾',
      body:'你和室友闹矛盾了：\n\n- ta总是很晚回家，吵醒你\n- 公共卫生从来不打扫\n- 带朋友回家不提前说\n\n你开始思考：是沟通，是忍耐，还是搬走？\n\n"室友关系是大城市最微妙的社交——你们共享空间，但不共享生活。"',
      cond: g => !g.flags.hasHouse && !g.flags.roommateConflict && g.months>=6 && Math.random()>0.6,
      choices:[
        { label:'坐下来好好谈', hint:'+👥 +😊', fn: g => { g.flags.roommateConflict=true; if(g.charm>=55){return{social:8,mood:10}}else{return{social:-5,mood:-5}} }},
        { label:'忍着，多一事不如少一事', hint:'-😊', fn: g => { g.flags.roommateConflict=true; return{mood:-10}; }},
        { label:'搬走', hint:'-💰 +😊', fn: g => { g.flags.roommateConflict=true; g.flags.movedHouse=true; return{money:-3000,mood:8}; }},
        { label:'发微信说清楚', hint:'+🧠', fn: g => { g.flags.roommateConflict=true; return{intel:3,mood:3,social:3}; }},
      ]},
    { id:'dating_app', icon:'💘', title:'交友软件',
      body:'朋友推荐你下载了一个交友App。\n\n你左滑右滑，匹配了20个人，聊了5个，见面了1个。\n\n见面后你发现：照片和真人差距有点大，聊天和现实差距更大。\n\n"交友App让选择变多了，但让心动变难了。"',
      cond: g => !g.flags.datingApp && !g.flags.married && g.age>=24 && g.age<=40 && Math.random()>0.5,
      choices:[
        { label:'继续用，扩大社交圈', hint:'+👥 +✨', fn: g => { g.flags.datingApp=true; g.relationships.partner = clamp((g.relationships.partner||20)+10,0,100); return{social:8,charm:5,mood:5}; }},
        { label:'线下认识更靠谱', hint:'+👥', fn: g => { g.flags.datingApp=true; return{social:5,mood:3}; }},
        { label:'算了，单身也挺好', hint:'+😊 +🧠', fn: g => { g.flags.datingApp=true; g.flags.singleHappy=true; return{mood:8,intel:3}; }},
        { label:'充VIP看看', hint:'-💰 +👥', fn: g => { g.flags.datingApp=true; return{money:-299,social:10,mood:5}; }},
      ]},
    // === v2.39 EVENTS ===
    { id:'city_switch', icon:'🚄', title:'换个城市？',
      body:'你在这个城市已经漂了好几年了。\n\n有时候你会想：是不是换个城市会更好？\n\n- 去北京？机会多但压力大\n- 去上海？精致但贵\n- 去深圳？年轻但内卷\n- 去杭州？互联网但996\n- 去成都？安逸但收入低\n\n"换城市不是逃避，是寻找更适合的土壤。"',
      cond: g => !g.flags.citySwitch && g.months>=36 && g.age>=26 && Math.random()>0.6,
      choices:[
        { label:'去北京闯一闯', hint:'+💰 -😊', fn: g => { g.flags.citySwitch=true; g.city='beijing'; g.cityName='北京'; return{money:-5000,mood:-5,intel:5}; }},
        { label:'去上海试试', hint:'+💰 +✨', fn: g => { g.flags.citySwitch=true; g.city='shanghai'; g.cityName='上海'; return{money:-5000,charm:5}; }},
        { label:'去深圳拼搏', hint:'+💰 +🧠', fn: g => { g.flags.citySwitch=true; g.city='shenzhen'; g.cityName='深圳'; return{money:-5000,intel:5}; }},
        { label:'留在现在的地方', hint:'+😊', fn: g => { g.flags.citySwitch=true; return{mood:8}; }},
      ]},
    { id:'midlife_crisis_40', icon:'🎂', title:'四十不惑？',
      body:'你40岁了。\n\n你开始问自己：\n- 我的人生有意义吗？\n- 我留下了什么？\n- 剩下的时间，我应该怎么过？\n\n"40岁不是中年危机的开始，是终于开始想清楚的时候。"',
      cond: g => g.age===40 && !g.flags.midlifeCrisis40,
      choices:[
        { label:'重新审视人生目标', hint:'+🧠 +😊', fn: g => { g.flags.midlifeCrisis40=true; return{intel:10,mood:10}; }},
        { label:'开始养生', hint:'+❤️ +😊', fn: g => { g.flags.midlifeCrisis40=true; return{health:10,mood:5,money:-5000}; }},
        { label:'追求年轻时没实现的梦想', hint:'+😊 -💰', fn: g => { g.flags.midlifeCrisis40=true; g.flags.chaseDream=true; return{mood:20,money:-10000}; }},
        { label:'接受现实，安于现状', hint:'+😊', fn: g => { g.flags.midlifeCrisis40=true; return{mood:5}; }},
      ]},
    { id:'learning_new_skill', icon:'📚', title:'学习新技能',
      body:'你决定学习一个新技能：\n\n- 编程？可以转行\n- 设计？可以做副业\n- 写作？可以表达自己\n- 摄影？可以记录生活\n- 外语？可以开拓视野\n\n"学习是最好的投资——回报率无限大。"',
      cond: g => !g.flags.learnNewSkill && g.intel>=50 && g.age>=24 && Math.random()>0.5,
      choices:[
        { label:'报班系统学习', hint:'-💰 +🧠🧠', fn: g => { g.flags.learnNewSkill=true; return{money:-8000,intel:15,mood:5}; }},
        { label:'自学入门', hint:'+🧠', fn: g => { g.flags.learnNewSkill=true; return{intel:8,mood:3}; }},
        { label:'先看看免费教程', hint:'+🧠', fn: g => { g.flags.learnNewSkill=true; return{intel:5}; }},
        { label:'算了，没时间', hint:'-😊', fn: g => { g.flags.learnNewSkill=true; return{mood:-5}; }},
      ]},
    { id:'parent_health_issue', icon:'🏥', title:'父母体检',
      body:'你妈打电话说：你爸体检发现了一些问题，需要复查。\n\n你的心一下子揪紧了。\n\n你开始想：\n- 要不要请假回去陪他们？\n- 要不要给他们买更好的医疗保险？\n- 要不要接他们来大城市？\n\n"父母的健康，是你在外打拼最大的牵挂。"',
      cond: g => !g.flags.parentHealthIssue && g.age>=30 && Math.random()>0.5,
      choices:[
        { label:'请假回去陪他们', hint:'-💰 +👥 +😊', fn: g => { g.flags.parentHealthIssue=true; g.relationships.family = clamp((g.relationships.family||50)+25,0,100); return{money:-5000,mood:15,social:10}; }},
        { label:'买最好的医疗保险', hint:'-💰💰 +😊', fn: g => { g.flags.parentHealthIssue=true; g.flags.parentInsurance=true; return{money:-20000,mood:10}; }},
        { label:'视频关心，寄钱回去', hint:'-💰 +👥', fn: g => { g.flags.parentHealthIssue=true; g.relationships.family = clamp((g.relationships.family||50)+10,0,100); return{money:-5000,social:5,mood:5}; }},
        { label:'告诉他们注意身体', hint:'-😊', fn: g => { g.flags.parentHealthIssue=true; g.relationships.family = clamp((g.relationships.family||50)-5,0,100); return{mood:-10}; }},
      ]},
    { id:'weekend_trip', icon:'🏖️', title:'周末旅行',
      body:'你发现了一个周末短途旅行的好去处：\n\n- 高铁2小时\n- 住宿200/晚\n- 风景不错\n\n你已经很久没有出去走走了。\n\n"旅行不是为了逃避生活，是为了让生活不再需要逃避。"',
      cond: g => !g.flags.weekendTrip && g.money>5000 && g.mood<60 && Math.random()>0.5,
      choices:[
        { label:'说走就走！', hint:'-💰 +😊 +❤️', fn: g => { g.flags.weekendTrip=true; return{money:-1000,mood:20,health:5,charm:3}; }},
        { label:'约朋友一起去', hint:'-💰 +👥 +😊', fn: g => { g.flags.weekendTrip=true; return{money:-800,social:10,mood:15}; }},
        { label:'下次再说', hint:'-😊', fn: g => { g.flags.weekendTrip=true; return{mood:-5}; }},
      ]},
    // === v2.40 EVENTS ===
    { id:'lottery_ticket', icon:'🎫', title:'彩票梦',
      body:'路过彩票站，你花了10块钱买了一张。\n\n"万一中了呢？"\n\n你知道概率是千万分之一，但你还是想试试。\n\n"彩票是穷人交的税——但你今天想逃一次税。"',
      cond: g => !g.flags.lotteryTicket && g.money>100 && Math.random()>0.6,
      choices:[
        { label:'买10张试试手气', hint:'-💰 🎲', fn: g => { g.flags.lotteryTicket=true; if(Math.random()>0.95){g.flags.lotteryWin=true;return{money:-100,money:50000,mood:30}}else{return{money:-100,mood:-3}} }},
        { label:'就买1张', hint:'-💰', fn: g => { g.flags.lotteryTicket=true; if(Math.random()>0.99){g.flags.lotteryWin=true;return{money:-10,money:10000,mood:20}}else{return{money:-10,mood:-2}} }},
        { label:'算了，概率太低', hint:'+🧠', fn: g => { g.flags.lotteryTicket=true; return{intel:2}; }},
      ]},
    { id:'social_media_fame', icon:'📸', title:'意外走红',
      body:'你随手发的一条朋友圈/微博突然火了！\n\n点赞999+，评论500+，还有人私信找你合作。\n\n你体验到了"15分钟的名气"。\n\n"走红是偶然，不红是常态——享受那一刻就好。"',
      cond: g => !g.flags.socialMediaFame && g.charm>=60 && Math.random()>0.7,
      choices:[
        { label:'趁热打铁，继续发', hint:'+✨ +👥', fn: g => { g.flags.socialMediaFame=true; g.flags.influencer=true; return{charm:10,social:15,mood:10}; }},
        { label:'低调处理', hint:'+🧠', fn: g => { g.flags.socialMediaFame=true; return{intel:5,mood:5}; }},
        { label:'接广告赚钱', hint:'+💰 +✨', fn: g => { g.flags.socialMediaFame=true; return{money:5000,charm:5,mood:8}; }},
      ]},
    { id:'career_crossroads', icon:'🔀', title:'职业十字路口',
      body:'你在现在的岗位已经3年了。\n\n你开始思考：\n- 继续做下去，5年后会怎样？\n- 转行，来得及吗？\n- 创业，敢吗？\n\n"职业选择不是选工作，是选生活方式。"',
      cond: g => !g.flags.careerCrossroads && g.months>=36 && g.age>=28 && g.job!=='待业中' && Math.random()>0.5,
      choices:[
        { label:'转行到新领域', hint:'+🧠 -💰', fn: g => { g.flags.careerCrossroads=true; g.flags.careerChange=true; g.jobSalary=Math.floor(g.jobSalary*0.8); return{intel:10,mood:5,money:-5000}; }},
        { label:'升职加薪', hint:'+💰 +🧠', fn: g => { g.flags.careerCrossroads=true; if(g.intel>=70&&g.social>=50){g.jobSalary=Math.floor(g.jobSalary*1.3);return{money:10000,mood:15,intel:5}}else{return{mood:-10}} }},
        { label:'创业试试', hint:'🎲 高风险', fn: g => { g.flags.careerCrossroads=true; g.flags.entrepreneur=true; if(g.intel>=75&&g.social>=60&&Math.random()>0.4){return{money:-20000,mood:20,intel:15}}else{return{money:-30000,mood:-15}} }},
        { label:'保持现状', hint:'+😊', fn: g => { g.flags.careerCrossroads=true; return{mood:5}; }},
      ]},
    { id:'health_checkup', icon:'🏥', title:'年度体检',
      body:'公司组织了年度体检。你拿到了报告：\n\n- BMI：偏高 ⚠️\n- 血压：正常 ✅\n- 血糖：正常 ✅\n- 肝功能：正常 ✅\n\n"体检报告是成年人的成绩单——但这次，你及格了。"',
      cond: g => !g.flags.annualCheckup && g.age>=26 && g.months>=12 && Math.random()>0.5,
      choices:[
        { label:'开始健身计划', hint:'+❤️ -💰', fn: g => { g.flags.annualCheckup=true; g.flags.fitnessPlan=true; return{health:10,mood:5,money:-2000}; }},
        { label:'改善饮食习惯', hint:'+❤️ +😊', fn: g => { g.flags.annualCheckup=true; return{health:8,mood:5}; }},
        { label:'算了，明年再说', hint:'-❤️', fn: g => { g.flags.annualCheckup=true; return{health:-3,mood:-5}; }},
      ]},
    { id:'book_club', icon:'📚', title:'读书会',
      body:'朋友邀请你参加一个读书会。\n\n每月读一本书，分享读后感。\n\n你已经很久没有认真读书了。\n\n"读书不是为了知道答案，是为了保持思考的能力。"',
      cond: g => !g.flags.bookClub && g.intel>=50 && g.age>=25 && Math.random()>0.5,
      choices:[
        { label:'加入，认真读', hint:'+🧠 +👥', fn: g => { g.flags.bookClub=true; return{intel:10,social:8,mood:5}; }},
        { label:'偶尔参加', hint:'+🧠', fn: g => { g.flags.bookClub=true; return{intel:5,social:3}; }},
        { label:'自己读就好', hint:'+🧠', fn: g => { g.flags.bookClub=true; return{intel:8,mood:3}; }},
      ]},
    // === v3.0 EVENTS - 2025-2026 TRENDING TOPICS ===
    { id:'exam_civil_war', icon:'📚', title:'考公大战',
      body:'2026年国考报名人数突破371.8万，报录比98:1。\n\n你已经备考了两年，每天刷题到凌晨。你妈说："考不上就回来吧。"你爸说："再试一年。"\n\n你的同学小李去年上岸了，朋友圈每天发单位食堂的照片，配文："又是幸福的一天。"\n\n你在评论区回复："羡慕。"然后继续做题。\n\n"考公是当代年轻人的科举——上岸是神话，落榜是人生。"',
      cond: g => g.age>=22 && g.age<=35 && !g.flags.civilServant && !g.flags.examCivilWar && g.intel>=60,
      choices:[
        { label:'全职备考一年', hint:'-💰 -❤️ 🎲', fn: g => { g.flags.examCivilWar=true; if(g.intel>80&&Math.random()>0.6){g.flags.civilServant=true;setJob(g,'公务员',8000);return{mood:40,money:-15000,health:-10}}else{return{mood:-25,money:-15000,health:-8,intel:10}} }},
        { label:'边工作边备考', hint:'-❤️ 🎲', fn: g => { g.flags.examCivilWar=true; if(Math.random()>0.7){g.flags.civilServant=true;setJob(g,'公务员',8000);return{mood:30,health:-15,intel:8}}else{return{health:-12,mood:-10,intel:5}} }},
        { label:'放弃考公，接受现实', hint:'+😊 +💰', fn: g => { g.flags.examCivilWar=true; return{mood:15,money:3000}; }},
        { label:'报个培训班', hint:'-💰💰 🎲', fn: g => { g.flags.examCivilWar=true; if(Math.random()>0.5){g.flags.civilServant=true;setJob(g,'公务员',8000);return{money:-25000,mood:35}}else{return{money:-25000,mood:-15}} }},
      ]},
    { id:'consumption_downgrade', icon:'📉', title:'消费降级',
      body:'你开始用拼多多买东西了。\n\n曾经你嘲笑"拼夕夕"，现在你是"拼爹爹"。你的购物车从淘宝变成了1688，从星巴克变成了瑞幸，从海底捞变成了自热火锅。\n\n你妈说："你终于懂事了。"你说："不是懂事，是没钱了。"\n\n你在豆瓣加入了"抠门女性联合会"，300万成员。你发现：原来不止你一个人在降级。\n\n"消费降级不是穷，是活明白了。"',
      cond: g => g.money<30000 && !g.flags.consumptionDowngrade && g.age>=24,
      choices:[
        { label:'全面拥抱平替', hint:'+💰 +🧠', fn: g => { g.flags.consumptionDowngrade=true; g.flags.minimalist=true; return{money:5000,intel:5,mood:8}; }},
        { label:'该省省，该花花', hint:'+💰 +😊', fn: g => { g.flags.consumptionDowngrade=true; return{money:3000,mood:5}; }},
        { label:'只降级不升级', hint:'+💰 -😊', fn: g => { g.flags.consumptionDowngrade=true; return{money:8000,mood:-5}; }},
        { label:'算了，对自己好点', hint:'-💰 +😊', fn: g => { g.flags.consumptionDowngrade=true; return{money:-2000,mood:10}; }},
      ]},
    { id:'ai_scam', icon:'🤖', title:'AI换脸诈骗',
      body:'你接到"你妈"的视频电话，画面里她哭着说："我在医院，急需5万块钱手术费。"\n\n你慌了，差点就转了账。但你突然想起：这可能是AI换脸诈骗。\n\n你挂了电话，回拨过去——你妈在家看电视呢。\n\n"AI时代，连你妈的脸都不能信了。"\n\n你下载了国家反诈中心App。数据显示：2024年全国电信诈骗超213万起，损失970亿。平均每分钟4人被骗。',
      cond: g => !g.flags.aiScam && g.money>5000 && g.age>=22,
      choices:[
        { label:'识破骗局，报警', hint:'+🧠 +😊', fn: g => { g.flags.aiScam=true; g.flags.hadScam=true; return{intel:10,mood:15}; }},
        { label:'差点上当', hint:'-😊', fn: g => { g.flags.aiScam=true; g.flags.hadScam=true; return{mood:-15,intel:5}; }},
        { label:'被骗了5万', hint:'-💰💰💰', fn: g => { g.flags.aiScam=true; g.flags.hadScam=true; return{money:-50000,mood:-30,intel:3}; }},
        { label:'安装反诈App', hint:'+🧠 +😊', fn: g => { g.flags.aiScam=true; return{intel:8,mood:10}; }},
      ]},
    { id:'banwei', icon:'💼', title:'班味儿太重',
      body:'你在地铁上刷到一条帖子："如何判断一个人有没有班味儿？"\n\n评论区：\n- "眼神空洞"\n- "说话像机器人"\n- "周末也在想工作"\n- "对什么都提不起兴趣"\n\n你照了照镜子，发现自己全中了。\n\n你发了条朋友圈："我的班味儿已经重到洗不掉了。"收获了87个赞，其中50个是同事。\n\n"班味儿是打工人的香水——你喷的不是香水，是疲惫。"',
      cond: g => g.job!=='待业中' && g.mood<55 && !g.flags.banweiEvent && g.age>=24,
      choices:[
        { label:'请假去旅行', hint:'-💰 +😊 +❤️', fn: g => { g.flags.banweiEvent=true; return{money:-3000,mood:20,health:8}; }},
        { label:'培养新爱好', hint:'+😊 +🧠', fn: g => { g.flags.banweiEvent=true; return{mood:12,intel:5}; }},
        { label:'摸鱼到下班', hint:'+😊 -💰', fn: g => { g.flags.banweiEvent=true; return{mood:8,money:-500}; }},
        { label:'接受这就是生活', hint:'+😊', fn: g => { g.flags.banweiEvent=true; return{mood:5}; }},
      ]},
    { id:'black_myth', icon:'🎮', title:'黑神话：悟空',
      body:'《黑神话：悟空》发售了！\n\n你的朋友圈被刷屏了。同事们都在讨论，你的leader甚至请假三天打游戏。\n\n你打开Steam，看到价格：268元。你犹豫了：这钱够我吃一周外卖了。\n\n但你又想：这是中国第一款3A大作，不支持说不过去。\n\n"游戏是成年人的童话——但这个童话，值268块。"',
      cond: g => !g.flags.blackMyth && g.money>500 && g.age>=20 && g.age<=40,
      choices:[
        { label:'买！支持国产', hint:'-💰 +😊 +✨', fn: g => { g.flags.blackMyth=true; return{money:-268,mood:25,charm:5}; }},
        { label:'等打折', hint:'+💰', fn: g => { g.flags.blackMyth=true; return{mood:5}; }},
        { label:'云通关', hint:'+😊', fn: g => { g.flags.blackMyth=true; return{mood:15}; }},
        { label:'没时间玩', hint:'-😊', fn: g => { g.flags.blackMyth=true; return{mood:-5}; }},
      ]},
    { id:'anti_involution', icon:'🛌', title:'反内卷运动',
      body:'你的同事小王辞职了。\n\n他在群里发了条消息："我不卷了，我要回家种地。"\n\n你以为他在开玩笑，结果他真的回了老家，开了个农场。朋友圈每天发种菜、养鸡的照片，配文："今天又是躺平的一天。"\n\n你开始思考：内卷到底为了什么？\n\n"反内卷不是躺平，是重新定义什么叫'站着'。"',
      cond: g => !g.flags.antiInvolution && g.job!=='待业中' && g.months>=18 && g.mood<50,
      choices:[
        { label:'辞职，追求自由', hint:'-💰 +😊 +❤️', fn: g => { g.flags.antiInvolution=true; g.flags.lyingFlat=true; setJob(g,'待业中',0); return{mood:25,health:10,money:-5000}; }},
        { label:'摸鱼式反抗', hint:'+😊 -💰', fn: g => { g.flags.antiInvolution=true; return{mood:15,money:-2000}; }},
        { label:'继续卷，但降低期待', hint:'+🧠 +😊', fn: g => { g.flags.antiInvolution=true; return{intel:5,mood:8}; }},
        { label:'副业Plan B', hint:'+💰 +🧠', fn: g => { g.flags.antiInvolution=true; g.flags.sideHustle='planB'; return{money:3000,intel:8}; }},
      ]},
    { id:'dazi_social', icon:'👥', title:'搭子社交',
      body:'你在小红书上看到一个帖子："找一个饭搭子，不聊工作，不谈感情，只吃饭。"\n\n你心动了。你加了几个群：\n- 饭搭子群\n- 电影搭子群\n- 旅行搭子群\n- 运动搭子群\n\n你发现：搭子社交的精髓是——"不深入、不负担、不期待"。\n\n"搭子是成年人的友谊——轻量、即用、无负担。"',
      cond: g => !g.flags.daziSocial && g.social<60 && g.age>=22 && g.age<=35,
      choices:[
        { label:'积极找搭子', hint:'+👥 +😊', fn: g => { g.flags.daziSocial=true; return{social:15,mood:10}; }},
        { label:'偶尔参加', hint:'+👥', fn: g => { g.flags.daziSocial=true; return{social:8,mood:5}; }},
        { label:'还是老朋友好', hint:'+👥 +😊', fn: g => { g.flags.daziSocial=true; return{social:5,mood:8}; }},
        { label:'社恐，算了', hint:'+😊', fn: g => { g.flags.daziSocial=true; return{mood:5}; }},
      ]},
    { id:'xie_xiu', icon:'🔮', title:'邪修生活',
      body:'你在B站看到一个视频："邪修减肥法——每天吃火锅，但只吃蔬菜。"\n\n你笑了。然后你开始实践"邪修生活"：\n- 邪修做饭：微波炉煮一切\n- 邪修健身：躺在床上做仰卧起坐\n- 邪修学习：听播客入睡，梦里学习\n- 邪修社交：发红包代替见面\n\n"邪修是年轻人的智慧——用离谱的方法，解决合理的问题。"',
      cond: g => !g.flags.xieXiu && g.age>=20 && g.age<=35,
      choices:[
        { label:'全面邪修', hint:'+😊 +🧠', fn: g => { g.flags.xieXiu=true; return{mood:15,intel:8,health:-3}; }},
        { label:'选择性邪修', hint:'+😊', fn: g => { g.flags.xieXiu=true; return{mood:10}; }},
        { label:'还是正经点好', hint:'+🧠', fn: g => { g.flags.xieXiu=true; return{intel:5}; }},
      ]},
    { id:'city_not_city', icon:'🏙️', title:'City不City',
      body:'你的外国朋友来中国旅游了。\n\n他拍了条视频："上海City不City？好City啊！"\n\n你带他去吃小笼包、坐地铁、逛外滩。他惊叹："中国太方便了！"\n\n你突然意识到：你习以为常的生活，在别人眼里是"City"的。\n\n"City不City，取决于你看世界的角度。"',
      cond: g => !g.flags.cityNotCity && g.city==='shanghai' && g.charm>=50,
      choices:[
        { label:'当导游，重新认识城市', hint:'+😊 +✨ +👥', fn: g => { g.flags.cityNotCity=true; return{mood:20,charm:8,social:10}; }},
        { label:'推荐好吃的店', hint:'+😊 +👥', fn: g => { g.flags.cityNotCity=true; return{mood:10,social:5}; }},
        { label:'没时间陪', hint:'-😊', fn: g => { g.flags.cityNotCity=true; return{mood:-5}; }},
      ]},
    { id:'nong_ren_dan_ren', icon:'🎭', title:'浓人淡人',
      body:'你在社交媒体看到一个测试："你是浓人还是淡人？"\n\n浓人：热情洋溢、表达欲强、喜欢社交\n淡人：平和内敛、享受独处、不喜欢热闹\n\n你测了一下，结果是"淡人"。\n\n你发了条朋友圈："我是淡人。"收获了3个赞。\n\n你的浓人朋友评论："我是浓人！"收获了30个赞。\n\n"浓人淡人，都是好人——只是活法不同。"',
      cond: g => !g.flags.nongRenDanRen && g.age>=22 && g.age<=40,
      choices:[
        { label:'接受自己是淡人', hint:'+😊 +🧠', fn: g => { g.flags.nongRenDanRen=true; return{mood:10,intel:5}; }},
        { label:'尝试变浓', hint:'+👥 -😊', fn: g => { g.flags.nongRenDanRen=true; return{social:10,mood:-5}; }},
        { label:'我就是我', hint:'+✨ +😊', fn: g => { g.flags.nongRenDanRen=true; return{charm:8,mood:8}; }},
      ]},
    { id:'song_chi_gan', icon:'🧘', title:'松弛感',
      body:'你在奥运会上看到中国00后选手，他们的表现让你印象深刻：\n\n- 赛前玩手机\n- 比赛中淡定自若\n- 赛后采访："还行吧。"\n\n你被他们的"松弛感"折服了。\n\n你开始反思：为什么我总是那么紧绷？\n\n"松弛感不是躺平，是知道自己能行。"',
      cond: g => !g.flags.songChiGan && g.mood<60 && g.age>=20 && g.age<=35,
      choices:[
        { label:'学习松弛感', hint:'+😊 +❤️', fn: g => { g.flags.songChiGan=true; return{mood:15,health:5}; }},
        { label:'冥想练习', hint:'+😊 +🧠', fn: g => { g.flags.songChiGan=true; return{mood:12,intel:5}; }},
        { label:'我还是紧张点好', hint:'+🧠', fn: g => { g.flags.songChiGan=true; return{intel:3}; }},
      ]},
    { id:'youth_unemployment', icon:'📊', title:'青年失业率',
      body:'新闻说：2025年16-24岁青年失业率16.9%-18.9%。\n\n你的同学群里，有人在考公，有人在考研，有人在送外卖，有人在家啃老。\n\n你发了条消息："大家都干嘛呢？"\n\n沉默了5分钟后，有人回复："活着。"\n\n"失业率是个数字，但对每个人来说，是一段人生。"',
      cond: g => !g.flags.youthUnemployment && g.age>=22 && g.age<=28 && (g.job==='待业中' || g.months<12),
      choices:[
        { label:'继续找工作', hint:'+🧠 -😊', fn: g => { g.flags.youthUnemployment=true; return{intel:5,mood:-10}; }},
        { label:'先做零工', hint:'+💰 -❤️', fn: g => { g.flags.youthUnemployment=true; setJob(g,'零工',5000); return{money:3000,health:-5,mood:-5}; }},
        { label:'考研提升', hint:'-💰 +🧠', fn: g => { g.flags.youthUnemployment=true; return{money:-10000,intel:15,mood:5}; }},
        { label:'接受现实', hint:'+😊', fn: g => { g.flags.youthUnemployment=true; return{mood:8}; }},
      ]},
    { id:'remote_work', icon:'💻', title:'远程办公',
      body:'你的公司开始实行"混合办公"：每周2天在家，3天在公司。\n\n在家办公的第一天：\n- 早上9点起床（平时7点）\n- 穿着睡衣开会\n- 中午做了顿好的\n- 下午工作效率出奇地高\n\n你开始想：为什么要每天通勤2小时，就为了坐在办公室里发邮件？\n\n"远程办公是打工人的解放——但也是自律的考验。"',
      cond: g => !g.flags.remoteWork && g.job!=='待业中' && g.intel>=60 && g.months>=12,
      choices:[
        { label:'申请全职远程', hint:'+😊 +❤️ 🎲', fn: g => { g.flags.remoteWork=true; if(Math.random()>0.5){return{mood:20,health:8,money:2000}}else{return{mood:-10}} }},
        { label:'享受混合办公', hint:'+😊 +❤️', fn: g => { g.flags.remoteWork=true; return{mood:15,health:5}; }},
        { label:'还是喜欢办公室', hint:'+👥', fn: g => { g.flags.remoteWork=true; return{social:8}; }},
      ]},
    { id:'mbti_personality', icon:'🧠', title:'MBTI人格测试',
      body:'你的朋友圈被MBTI刷屏了。\n\n你是"INFP"——调停者，理想主义者，喜欢独处。\n\n你的同事说："难怪你这么内向。"\n你说："我不是内向，我只是需要充电。"\n\n你开始用MBTI理解所有人：\n- 老板是ENTJ（指挥官）——难怪这么强势\n- 同事是ESFP（表演者）——难怪这么爱社交\n- 你妈是ISFJ（守卫者）——难怪这么操心\n\n"MBTI是成年人的星座——但比星座更科学（大概）。"',
      cond: g => !g.flags.mbti && g.age>=20 && g.age<=35,
      choices:[
        { label:'深入研究MBTI', hint:'+🧠 +✨', fn: g => { g.flags.mbti=true; return{intel:8,charm:5}; }},
        { label:'用来社交破冰', hint:'+👥 +✨', fn: g => { g.flags.mbti=true; return{social:10,charm:5}; }},
        { label:'不信这个', hint:'+🧠', fn: g => { g.flags.mbti=true; return{intel:5}; }},
      ]},
    // === v3.1 EVENTS - 职场热梗 ===
    { id:'paid_toilet', icon:'🚽', title:'带薪拉屎',
      body:'你发现了一个上班的秘密：带薪拉屎。\n\n每天早上，你在厕所里待20分钟，刷抖音、看小说、发呆。\n\n你算了一笔账：月薪8000，每天带薪拉屎20分钟，一年下来相当于白赚4000块。\n\n你在群里分享了这个发现，同事回复："你以为老板不知道？他只是不想拆穿你最后的快乐。"\n\n"带薪拉屎是打工人的小确幸——虽然有点臭，但是是香的。"',
      cond: g => g.job!=='待业中' && !g.flags.paidToilet && g.mood<60,
      choices:[
        { label:'每天坚持带薪拉屎', hint:'+💰 +😊', fn: g => { g.flags.paidToilet=true; return{money:200,mood:10}; }},
        { label:'被发现了，尴尬', hint:'-😊', fn: g => { g.flags.paidToilet=true; return{mood:-10,charm:-3}; }},
        { label:'分享给同事', hint:'+👥 +😊', fn: g => { g.flags.paidToilet=true; return{social:8,mood:8}; }},
      ]},
    { id:'office_roles', icon:'🎭', title:'办公室角色',
      body:'你在抖音看到一个视频："你是办公室里的哪个角色？"\n\n- 办公室申公豹：卷王，永远在加班，"收到"是口头禅\n- 办公室哪吒：摸鱼达人，黑眼圈重度患者\n- 办公室敖丙：暖男，但压力山大\n- 办公室敖光：领导，永远在开会\n\n你照了照镜子，发现自己像申公豹。\n\n"职场是个大戏台，每个人都在演自己的角色。"',
      cond: g => g.job!=='待业中' && !g.flags.officeRoles && g.months>=6,
      choices:[
        { label:'我是申公豹，继续卷', hint:'+💰 -❤️', fn: g => { g.flags.officeRoles=true; return{money:3000,health:-8,mood:-5}; }},
        { label:'我要做哪吒，摸鱼', hint:'+😊 -💰', fn: g => { g.flags.officeRoles=true; return{mood:15,money:-1000}; }},
        { label:'争取当敖光，升职', hint:'+💰 +✨ 🎲', fn: g => { g.flags.officeRoles=true; if(g.intel>=70&&g.social>=60){return{money:8000,charm:10}}else{return{mood:-10}} }},
        { label:'辞职，不演了', hint:'+😊 -💰', fn: g => { g.flags.officeRoles=true; setJob(g,'待业中',0); return{mood:20,money:-5000}; }},
      ]},
    { id:'crispy_worker', icon:'🥟', title:'脆皮打工人',
      body:'你在B站看到一个视频播放量过千万："脆皮打工人，老板一骂就碎。"\n\n你笑了，然后哭了。\n\n你发现：\n- 加班到凌晨，第二天还要笑着开会\n- 被客户骂完，转身跟同事说"没事"\n- 工资条到手，扣完五险一金只剩一半\n\n你发了一条朋友圈："我是脆皮打工人，但我还没碎。"\n\n"脆皮不是软弱，是承受了太多。"',
      cond: g => g.job!=='待业中' && !g.flags.crispyWorker && g.mood<50,
      choices:[
        { label:'接受脆皮，继续撑', hint:'+😊 +🧠', fn: g => { g.flags.crispyWorker=true; return{mood:10,intel:5}; }},
        { label:'变硬皮，学会拒绝', hint:'+✨ +😊', fn: g => { g.flags.crispyWorker=true; return{charm:8,mood:12}; }},
        { label:'碎了，辞职', hint:'+😊 -💰', fn: g => { g.flags.crispyWorker=true; setJob(g,'待业中',0); return{mood:25,money:-3000}; }},
        { label:'找人倾诉', hint:'+👥 +😊', fn: g => { g.flags.crispyWorker=true; return{social:10,mood:15}; }},
      ]},
    { id:'worker_influencer', icon:'📱', title:'职人网红',
      body:'你的同事小王开始拍抖音了。\n\n他每天拍自己上班的日常：\n- 早上挤地铁\n- 中午吃食堂\n- 下午开会打瞌睡\n- 晚上加班吃外卖\n\n三个月后，他粉丝过万，开始接广告了。\n\n你心想：我是不是也可以？\n\n"职人网红是打工人的Plan B——用上班的时间，赚下班的钱。"',
      cond: g => g.job!=='待业中' && !g.flags.workerInfluencer && g.charm>=50 && g.age>=22 && g.age<=35,
      choices:[
        { label:'我也拍！', hint:'+✨ +💰 🎲', fn: g => { g.flags.workerInfluencer=true; if(g.charm>=70&&Math.random()>0.5){g.flags.influencer=true;return{money:5000,charm:12,mood:15}}else{return{charm:5,mood:5}} }},
        { label:'算了，没那才华', hint:'+😊', fn: g => { g.flags.workerInfluencer=true; return{mood:5}; }},
        { label:'帮他拍', hint:'+👥 +✨', fn: g => { g.flags.workerInfluencer=true; return{social:10,charm:5}; }},
      ]},
    { id:'gamify_work', icon:'🎮', title:'职场游戏化',
      body:'你的公司开始实行"职场游戏化"：\n\n- 完成任务获得"经验值"\n- 加班获得"金币"\n- 表现好获得"勋章"\n- 月度MVP获得"称号"\n\n你看着手里的500金币（价值50块超市卡），陷入了沉思。\n\n"职场游戏化让加班变得有趣——但本质上，你还是那个NPC。"',
      cond: g => g.job!=='待业中' && !g.flags.gamifyWork && g.months>=12,
      choices:[
        { label:'积极参与，冲MVP', hint:'+💰 +✨ -❤️', fn: g => { g.flags.gamifyWork=true; return{money:2000,charm:8,health:-10}; }},
        { label:'佛系参与', hint:'+😊', fn: g => { g.flags.gamifyWork=true; return{mood:8}; }},
        { label:'拒绝被游戏化', hint:'+🧠 +😊', fn: g => { g.flags.gamifyWork=true; return{intel:8,mood:10}; }},
      ]},
    { id:'anti_pua', icon:'🛡️', title:'反PUA心法',
      body:'你在豆瓣看到一个帖子："2025职场黑话翻译指南"\n\n- 老板说"年轻人要多学习"＝"这活不想给钱"\n- HR说"我们像大家庭"＝"准备让你多干活"\n- 领导说"我看好你"＝"暂时找不到更便宜的"\n\n你笑了，然后哭了。\n\n你开始修炼"反PUA心法"：\n- 把"福报"当笑话听\n- 把"画饼"当零食吃\n- 把"情怀"当厕纸用\n\n"反PUA不是反抗，是清醒。"',
      cond: g => g.job!=='待业中' && !g.flags.antiPUA && g.intel>=60,
      choices:[
        { label:'修炼反PUA心法', hint:'+🧠 +😊 +✨', fn: g => { g.flags.antiPUA=true; return{intel:10,mood:15,charm:5}; }},
        { label:'分享给同事', hint:'+👥 +😊', fn: g => { g.flags.antiPUA=true; return{social:10,mood:10}; }},
        { label:'算了，我还是配合吧', hint:'+💰 -😊', fn: g => { g.flags.antiPUA=true; return{money:1000,mood:-8}; }},
      ]},
    // === v3.2 EVENTS - 房地产与婚恋 ===
    { id:'unfinished_building', icon:'🏚️', title:'烂尾楼噩梦',
      body:'你三年前买的期房，烂尾了。\n\n每个月还在还8000块的房贷，但房子连顶都没封。你去售楼处维权，看到一群同样遭遇的业主，有人哭了，有人骂了，有人沉默了。\n\n开发商说："资金链断了，我们也没办法。"\n银行说："房贷必须继续还。"\n政府说："保交楼，但需要时间。"\n\n你站在烂尾楼前，看着钢筋裸露的框架，想起了那句广告词："给你一个家。"\n\n"烂尾楼是购房者的噩梦——钱没了，房也没了，梦碎了。"',
      cond: g => g.flags.hasHouse && !g.flags.unfinishedBuilding && g.months>=36 && Math.random()>0.7,
      choices:[
        { label:'维权到底', hint:'-💰 +😊', fn: g => { g.flags.unfinishedBuilding=true; return{money:-5000,mood:10,social:5}; }},
        { label:'断供抗议', hint:'🎲 -💰💰', fn: g => { g.flags.unfinishedBuilding=true; if(Math.random()>0.6){return{money:-20000,mood:-20}}else{return{money:-50000,mood:-40}} }},
        { label:'继续等', hint:'-😊', fn: g => { g.flags.unfinishedBuilding=true; return{mood:-15}; }},
        { label:'租房住，慢慢等', hint:'-💰 -😊', fn: g => { g.flags.unfinishedBuilding=true; return{money:-3000,mood:-10}; }},
      ]},
    { id:'bride_price', icon:'💰', title:'天价彩礼',
      body:'你要结婚了，女方家要求彩礼30万。\n\n你算了算：\n- 存款：15万\n- 父母积蓄：10万\n- 还差：5万\n\n你妈说："借点吧，娶媳妇是大事。"\n你爸说："这彩礼也太高了。"\n你对象说："这是对我父母的尊重。"\n\n你陷入了沉思：爱情真的需要用金钱来衡量吗？\n\n"彩礼是传统，但天价彩礼是绑架——绑架了爱情，也绑架了婚姻。"',
      cond: g => g.flags.hasPartner && !g.flags.married && !g.flags.bridePrice && g.age>=25 && g.money<50000,
      choices:[
        { label:'借钱凑彩礼', hint:'-💰💰 +😊', fn: g => { g.flags.bridePrice=true; g.flags.married=true; return{money:-40000,mood:15,social:10}; }},
        { label:'跟女方家谈', hint:'🎲 +🧠', fn: g => { g.flags.bridePrice=true; if(Math.random()>0.5){g.flags.married=true;return{money:-15000,mood:20,intel:5}}else{return{mood:-15}} }},
        { label:'选择零彩礼', hint:'+💰 +✨ 🎲', fn: g => { g.flags.bridePrice=true; if(Math.random()>0.6){g.flags.married=true;return{mood:25,charm:10}}else{return{mood:-10,social:-5}} }},
        { label:'分手，结不起', hint:'-😊', fn: g => { g.flags.bridePrice=true; g.flags.hasPartner=false; return{mood:-25}; }},
      ]},
    { id:'delay_marriage', icon:'💍', title:'延迟结婚',
      body:'新闻说：2025年Q1结婚率同比下降8.2%，连续第七年下滑。\n\n你的朋友圈：\n- 小王：30岁，单身，"享受自由"\n- 小李：32岁，恋爱中，"再等等"\n- 小张：28岁，已婚，"别催了"\n\n你妈打电话来："你什么时候结婚？"\n你说："不急。"\n你妈说："再不急就来不及了。"\n\n"延迟结婚不是逃避，是对婚姻更负责。"',
      cond: g => !g.flags.delayMarriage && !g.flags.married && g.age>=27 && g.age<=35,
      choices:[
        { label:'享受单身生活', hint:'+😊 +💰', fn: g => { g.flags.delayMarriage=true; return{mood:15,money:5000}; }},
        { label:'认真找对象', hint:'+👥 +✨', fn: g => { g.flags.delayMarriage=true; return{social:10,charm:5}; }},
        { label:'跟父母解释', hint:'+👥 +🧠', fn: g => { g.flags.delayMarriage=true; return{social:5,intel:5}; }},
        { label:'还是听父母的', hint:'-😊 +👥', fn: g => { g.flags.delayMarriage=true; return{mood:-10,social:8}; }},
      ]},
    { id:'zero_bride_price', icon:'💚', title:'零彩礼婚礼',
      body:'你参加了一个"零彩礼"婚礼。\n\n新郎说："我们的爱情不需要彩礼来证明。"\n新娘说："我要的是他这个人，不是他家的钱。"\n\n你被感动了。但你也听到有人说："这是理想主义，现实会很残酷。"\n\n"零彩礼是勇气，也是对婚姻最美好的期待。"',
      cond: g => !g.flags.zeroBridePrice && g.age>=24 && g.age<=35,
      choices:[
        { label:'支持零彩礼', hint:'+✨ +😊', fn: g => { g.flags.zeroBridePrice=true; return{charm:10,mood:15}; }},
        { label:'觉得太理想化', hint:'+🧠', fn: g => { g.flags.zeroBridePrice=true; return{intel:5}; }},
        { label:'传播这个理念', hint:'+👥 +✨', fn: g => { g.flags.zeroBridePrice=true; return{social:8,charm:5}; }},
      ]},
    // === v3.3 EVENTS - FIRE运动与数字游民 ===
    { id:'fire_movement', icon:'🔥', title:'FIRE运动',
      body:'你在豆瓣看到一个小组："FIRE生活"，8万成员。\n\nFIRE = Financial Independence, Retire Early（财务独立，提前退休）\n\n规则：攒够年开支的25倍，靠4%的理财收益生活，然后提前退休。\n\n你算了算：\n- 年开支：6万\n- 目标：150万\n- 当前存款：15万\n- 还差：135万\n\n你陷入了沉思：要攒多少年？能坚持吗？退休后干嘛？\n\n"FIRE不是逃避，是给自己一个选择。"',
      cond: g => !g.flags.fireMovement && g.money>20000 && g.age>=25 && g.intel>=60,
      choices:[
        { label:'开始FIRE计划', hint:'+💰 +🧠 -😊', fn: g => { g.flags.fireMovement=true; return{money:5000,intel:10,mood:-5}; }},
        { label:'穷FIRE，极简生活', hint:'+💰 -😊', fn: g => { g.flags.fireMovement=true; g.flags.minimalist=true; return{money:8000,mood:-8}; }},
        { label:'咖啡师FIRE，半退休', hint:'+😊 +💰', fn: g => { g.flags.fireMovement=true; g.flags.coffeeFIRE=true; return{mood:10,money:3000}; }},
        { label:'算了，太遥远了', hint:'+😊', fn: g => { g.flags.fireMovement=true; return{mood:5}; }},
      ]},
    { id:'fire_reality', icon:'💼', title:'FIRE后又回来上班了',
      body:'你认识的一个FIRE前辈，提前退休三年后又回来上班了。\n\n他说："退休后的第一年很爽，第二年有点无聊，第三年开始焦虑。"\n\n你问："为什么？"\n\n他说："没有目标，没有社交，没有成就感。钱是够了，但人活着不只是为了钱。"\n\n"FIRE的终点不是退休，是找到真正想做的事。"',
      cond: g => g.flags.fireMovement && !g.flags.fireReality && g.age>=30,
      choices:[
        { label:'重新审视FIRE目标', hint:'+🧠 +😊', fn: g => { g.flags.fireReality=true; return{intel:10,mood:12}; }},
        { label:'继续坚持', hint:'+💰 -😊', fn: g => { g.flags.fireReality=true; return{money:5000,mood:-8}; }},
        { label:'边FIRE边找热爱', hint:'+😊 +✨', fn: g => { g.flags.fireReality=true; return{mood:15,charm:8}; }},
      ]},
    { id:'digital_nomad', icon:'🌍', title:'数字游民生活',
      body:'你辞职了，成为数字游民。\n\n你的收入来源：\n- 自由职业开发：月入8000-15000\n- 技术博客广告：月入500-2000\n- 在线课程：月入1000-3000\n\n你的足迹：\n- 大理（2个月）- 程序员天堂\n- 清迈（3个月）- 数字游民聚集地\n- 巴厘岛（1个月）- 网络一般但环境好\n- 厦门（2个月）- 国内最宜居\n- 成都（4个月）- 美食太多\n\n"数字游民不是逃避，是重新定义工作与生活的边界。"',
      cond: g => !g.flags.digitalNomad && g.intel>=70 && g.money>30000 && g.age>=25 && g.age<=40,
      choices:[
        { label:'辞职，去大理', hint:'+😊 +❤️ -💰', fn: g => { g.flags.digitalNomad=true; setJob(g,'数字游民',0); return{mood:25,health:10,money:-5000}; }},
        { label:'边工作边准备', hint:'+💰 +🧠', fn: g => { g.flags.digitalNomad=true; return{money:5000,intel:8}; }},
        { label:'太冒险了，算了', hint:'+😊', fn: g => { g.flags.digitalNomad=true; return{mood:5}; }},
      ]},
    { id:'nomad_challenges', icon:'😔', title:'数字游民的困境',
      body:'你做了半年数字游民，发现了三个问题：\n\n1. **孤独感**：没有同事，没有固定社交圈\n2. **自律难**：没有人监督，容易摸鱼\n3. **时区问题**：接海外客户需要半夜开会\n\n你开始怀疑：这是自由，还是另一种形式的流浪？\n\n"数字游民的光鲜背后，是常人看不到的孤独与自律。"',
      cond: g => g.flags.digitalNomad && !g.flags.nomadChallenges && g.months>=6,
      choices:[
        { label:'加入Coworking空间', hint:'+👥 +😊', fn: g => { g.flags.nomadChallenges=true; return{social:15,mood:12}; }},
        { label:'固定工作时间', hint:'+🧠 +😊', fn: g => { g.flags.nomadChallenges=true; return{intel:8,mood:8}; }},
        { label:'回去上班', hint:'+💰 -😊', fn: g => { g.flags.nomadChallenges=true; setJob(g,'程序员',12000); return{money:5000,mood:-10}; }},
        { label:'继续坚持', hint:'+✨ +😊', fn: g => { g.flags.nomadChallenges=true; return{charm:8,mood:10}; }},
      ]},
    // === v3.4 EVENTS - 考公考研 ===
    { id:'exam_vs_grad', icon:'📊', title:'考公vs考研',
      body:'2026年，国考报名人数（371.8万）首次超过考研报名人数（343万）。\n\n你的同学群里：\n- 小王：考公，第三次了\n- 小李：考研，二战失败\n- 小张：直接工作，后悔没考公\n- 小刘：考公上岸，朋友圈晒工牌\n\n你妈说："考个公务员吧，稳定。"\n你爸说："考个研究生吧，学历高。"\n你说："能不能都别考了？"\n\n"考公考研是年轻人的两条路——但走哪条都不容易。"',
      cond: g => !g.flags.examVsGrad && g.age>=22 && g.age<=30 && (g.job==='待业中' || g.months<12),
      choices:[
        { label:'考公，追求稳定', hint:'-💰 +🧠 🎲', fn: g => { g.flags.examVsGrad=true; if(g.intel>75&&Math.random()>0.6){g.flags.civilServant=true;setJob(g,'公务员',8000);return{mood:30,money:-8000,intel:10}}else{return{mood:-20,money:-8000,intel:5}} }},
        { label:'考研，提升学历', hint:'-💰 +🧠 🎲', fn: g => { g.flags.examVsGrad=true; if(g.intel>80&&Math.random()>0.5){return{mood:25,money:-15000,intel:20}}else{return{mood:-15,money:-15000,intel:8}} }},
        { label:'都不考，直接工作', hint:'+💰 +😊', fn: g => { g.flags.examVsGrad=true; setJob(g,'打工人',7000); return{money:3000,mood:10}; }},
        { label:'边工作边考', hint:'-❤️ +🧠', fn: g => { g.flags.examVsGrad=true; return{health:-10,intel:8,mood:-5}; }},
      ]},
    { id:'inside_system', icon:'🏛️', title:'体制内真相',
      body:'你考上了公务员，终于进入了体制内。\n\n入职第一天：\n- 领导说："年轻人要多学习"（意思是多干活）\n- 同事说："慢慢来，不急"（意思是别太积极）\n- 前辈说："到点就下班"（意思是别卷）\n\n一个月后你发现：\n- 工资不高，但稳定\n- 工作不累，但无聊\n- 福利很好，但晋升很慢\n\n"体制内不是天堂，也不是地狱——是一种选择。"',
      cond: g => g.flags.civilServant && !g.flags.insideSystem && g.months>=3,
      choices:[
        { label:'适应体制内生活', hint:'+😊 +🧠', fn: g => { g.flags.insideSystem=true; return{mood:10,intel:5}; }},
        { label:'寻找体制外的机会', hint:'+💰 +✨', fn: g => { g.flags.insideSystem=true; g.flags.sideHustle='system'; return{money:3000,charm:8}; }},
        { label:'后悔了，想辞职', hint:'+😊 -💰', fn: g => { g.flags.insideSystem=true; setJob(g,'待业中',0); return{mood:15,money:-5000}; }},
      ]},
    { id:'grad_school_reality', icon:'🎓', title:'读研真相',
      body:'你考上了研究生，开始了三年的学术生涯。\n\n第一年：上课、看论文、帮导师打杂\n第二年：做实验、写论文、被导师批评\n第三年：找工作、写毕业论文、焦虑\n\n你发现：\n- 导师把你当免费劳动力\n- 同学都在卷实习\n- 毕业要求越来越高\n\n你开始怀疑：读研到底值不值？\n\n"读研不是逃避工作的港湾，是另一场内卷的开始。"',
      cond: g => !g.flags.gradSchool && g.age>=22 && g.age<=28 && g.intel>=75 && Math.random()>0.5,
      choices:[
        { label:'坚持读完', hint:'+🧠 -😊', fn: g => { g.flags.gradSchool=true; return{intel:20,mood:-10}; }},
        { label:'边读边实习', hint:'+🧠 +💰 -❤️', fn: g => { g.flags.gradSchool=true; return{intel:15,money:5000,health:-8}; }},
        { label:'退学，直接工作', hint:'+💰 -🧠', fn: g => { g.flags.gradSchool=true; setJob(g,'打工人',8000); return{money:5000,intel:-5,mood:5}; }},
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
    { id:'exam_civil_warrior', icon:'⚔️', name:'考公战士', desc:'参加考公大战', check: g => g.flags.examCivilWar },
    { id:'consumption_master', icon:'📉', name:'消费降级大师', desc:'学会精打细算', check: g => g.flags.consumptionDowngrade },
    { id:'anti_scam', icon:'🛡️', name:'反诈英雄', desc:'识破AI诈骗', check: g => g.flags.aiScam },
    { id:'banwei_free', icon:'🌿', name:'去班味儿', desc:'摆脱班味儿', check: g => g.flags.banweiEvent },
    { id:'wukong_fan', icon:'🐵', name:'天命人', desc:'支持黑神话悟空', check: g => g.flags.blackMyth },
    { id:'anti_invol', icon:'🛌', name:'反内卷先锋', desc:'选择反内卷', check: g => g.flags.antiInvolution },
    { id:'dazi_expert', icon:'🤝', name:'搭子达人', desc:'找到你的搭子', check: g => g.flags.daziSocial },
    { id:'xie_xiu_master', icon:'🔮', name:'邪修大师', desc:'掌握邪修之道', check: g => g.flags.xieXiu },
    { id:'city_explorer', icon:'🏙️', name:'City探索者', desc:'发现城市的魅力', check: g => g.flags.cityNotCity },
    { id:'nong_dan_ren', icon:'🎭', name:'浓淡自知', desc:'接受自己的性格', check: g => g.flags.nongRenDanRen },
    { id:'song_chi', icon:'🧘', name:'松弛感大师', desc:'学会松弛', check: g => g.flags.songChiGan },
    { id:'survivor_2025', icon:'📊', name:'2025幸存者', desc:'度过就业寒冬', check: g => g.flags.youthUnemployment },
    { id:'remote_worker', icon:'💻', name:'数字游民', desc:'享受远程办公', check: g => g.flags.remoteWork },
    { id:'mbti_believer', icon:'🧠', name:'MBTI专家', desc:'了解自己和他人', check: g => g.flags.mbti },
    { id:'paid_toilet_master', icon:'🚽', name:'带薪拉屎大师', desc:'掌握打工人小确幸', check: g => g.flags.paidToilet },
    { id:'office_actor', icon:'🎭', name:'职场演员', desc:'找到自己的角色', check: g => g.flags.officeRoles },
    { id:'crispy_survivor', icon:'🥟', name:'脆皮幸存者', desc:'脆皮但没碎', check: g => g.flags.crispyWorker },
    { id:'worker_star', icon:'📱', name:'职人网红', desc:'用上班赚下班的钱', check: g => g.flags.workerInfluencer },
    { id:'game_player', icon:'🎮', name:'职场玩家', desc:'游戏化工作', check: g => g.flags.gamifyWork },
    { id:'anti_pua_master', icon:'🛡️', name:'反PUA大师', desc:'看穿职场黑话', check: g => g.flags.antiPUA },
    { id:'unfinished_survivor', icon:'🏚️', name:'烂尾楼幸存者', desc:'经历烂尾楼之痛', check: g => g.flags.unfinishedBuilding },
    { id:'bride_price_warrior', icon:'💰', name:'彩礼战士', desc:'面对天价彩礼', check: g => g.flags.bridePrice },
    { id:'delay_marriage_expert', icon:'💍', name:'延迟结婚专家', desc:'选择晚婚', check: g => g.flags.delayMarriage },
    { id:'zero_price_supporter', icon:'💚', name:'零彩礼支持者', desc:'支持婚俗改革', check: g => g.flags.zeroBridePrice },
    { id:'fire_practitioner', icon:'🔥', name:'FIRE实践者', desc:'开始FIRE计划', check: g => g.flags.fireMovement },
    { id:'fire_veteran', icon:'💼', name:'FIRE归来者', desc:'FIRE后又回来上班', check: g => g.flags.fireReality },
    { id:'digital_nomad_life', icon:'🌍', name:'数字游民', desc:'成为数字游民', check: g => g.flags.digitalNomad },
    { id:'nomad_survivor', icon:'😔', name:'游民幸存者', desc:'度过数字游民困境', check: g => g.flags.nomadChallenges },
    { id:'exam_choice', icon:'📊', name:'考公考研选择者', desc:'面对人生选择', check: g => g.flags.examVsGrad },
    { id:'system_insider', icon:'🏛️', name:'体制内人', desc:'了解体制内真相', check: g => g.flags.insideSystem },
    { id:'grad_student', icon:'🎓', name:'研究生', desc:'经历读研生活', check: g => g.flags.gradSchool },
    { id:'photographer', icon:'📷', name:'摄影师', desc:'爱上摄影', check: g => g.flags.photographyHobby },
    { id:'viral_star', icon:'🌟', name:'网红初体验', desc:'意外走红', check: g => g.flags.viralMoment },
    { id:'freelancer', icon:'💻', name:'自由职业者', desc:'成为自由职业者', check: g => g.flags.freelancer },
    { id:'world_traveler', icon:'✈️', name:'环游世界', desc:'去旅行了', check: g => g.flags.worldTravel },
    { id:'teacher', icon:'👨‍🏫', name:'为人师表', desc:'做了培训师', check: g => g.flags.teacher },
    { id:'shop_owner', icon:'🏪', name:'小店老板', desc:'开了小店', check: g => g.flags.smallShop },
    { id:'volunteer', icon:'🤝', name:'志愿者', desc:'参加过志愿者活动', check: g => g.flags.volunteer },
    { id:'personal_brand', icon:'🌟', name:'个人品牌', desc:'建立个人品牌', check: g => g.flags.personalBrand },
    { id:'fire_planner', icon:'🎯', name:'FIRE计划', desc:'开始FIRE计划', check: g => g.flags.firePlan },
    // v2.14 Relationship achievements
    { id:'family_love', icon:'👨‍👩‍👧', name:'孝顺子女', desc:'家人关系达到90+', check: g => g.relationships && g.relationships.family>=90 },
    { id:'best_friends', icon:'🤝', name:'知心好友', desc:'朋友关系达到90+', check: g => g.relationships && g.relationships.friends>=90 },
    { id:'true_love', icon:'💕', name:'真爱', desc:'恋人关系达到90+', check: g => g.relationships && g.relationships.partner>=90 },
    { id:'team_player', icon:'👥', name:'团队之星', desc:'同事关系达到90+', check: g => g.relationships && g.relationships.colleagues>=90 },
    { id:'kaogong_prepper', icon:'📚', name:'考公预备役', desc:'开始备考公务员', check: g => g.flags.kaogongPrep },
    { id:'digital_detox', icon:'📵', name:'数字排毒', desc:'完成数字戒断', check: g => g.flags.digitalDetox },
    // v2.18 achievements
    { id:'healthy_life', icon:'🥗', name:'健康生活', desc:'开始健康生活方式', check: g => g.flags.healthyLifestyle },
    { id:'side_hustle', icon:'💡', name:'斜杠青年', desc:'开始做副业', check: g => g.flags.sideHustle },
    { id:'long_timer', icon:'📅', name:'老员工', desc:'在同一家公司工作超过3年', check: g => g.job!=='待业中' && g.months>36 },
    { id:'challenge_master', icon:'🎯', name:'挑战达人', desc:'完成10个每日挑战', check: g => { const c = JSON.parse(localStorage.getItem('cityDrifters_challenges')||'[]'); return c.length>=10; }},
    // v2.21 achievements
    { id:'mortgage_survivor', icon:'🏚️', name:'房贷幸存者', desc:'经历过断供危机', check: g => g.flags.mortgageDefault },
    { id:'unfinished_building_fighter', icon:'🏗️', name:'维权斗士', desc:'参与过烂尾楼维权', check: g => g.flags.unfinishedBuilding },
    { id:'full_time_child', icon:'🏠', name:'全职儿女', desc:'回家做全职儿女', check: g => g.flags.fullTimeChild },
    { id:'kaogong_warrior', icon:'📚', name:'考公战士', desc:'备考公务员', check: g => g.flags.kaogongPrep },
    { id:'workplace_pua_survivor', icon:'😤', name:'职场PUA幸存者', desc:'经历过职场PUA', check: g => g.flags.workplacePUA },
    { id:'tiger_parent', icon:'📖', name:'鸡娃家长', desc:'开始鸡娃', check: g => g.flags.tigerParenting },
    { id:'digital_helper', icon:'📱', name:'数字桥梁', desc:'帮助家人跨越数字鸿沟', check: g => g.flags.digitalRefugee },
    { id:'school_district_hero', icon:'🏫', name:'学区房勇士', desc:'买了学区房', check: g => g.flags.schoolDistrictHouse },
    // v2.22 achievements
    { id:'gender_warrior', icon:'⚖️', name:'性别平权斗士', desc:'经历过职场性别歧视', check: g => g.flags.genderDiscrimination },
    { id:'fertility_fighter', icon:'🤰', name:'生育权益捍卫者', desc:'经历过生育歧视', check: g => g.flags.fertilityDiscrimination },
    { id:'family_peacemaker', icon:'👵', name:'家庭和平使者', desc:'处理过婆媳关系', check: g => g.flags.motherInLawConflict },
    { id:'generation_bridge', icon:'👴', name:'代沟桥梁', desc:'尝试理解父母那一代', check: g => g.flags.generationalGap },
    { id:'betrayal_survivor', icon:'🗡️', name:'背叛幸存者', desc:'经历过朋友背叛', check: g => g.flags.friendBetrayal },
    { id:'filial_child', icon:'🏥', name:'孝顺子女', desc:'照顾过生病的父母', check: g => g.flags.parentAging },
    { id:'stock_veteran', icon:'📉', name:'股市老兵', desc:'经历过股市暴跌', check: g => g.flags.stockCrash },
    { id:'midlife_awakening', icon:'🎭', name:'中年觉醒', desc:'经历过中年危机', check: g => g.flags.midlifeCrisis },
    // v2.23 achievements
    { id:'remote_worker', icon:'💻', name:'远程工作者', desc:'体验过远程办公', check: g => g.flags.remoteWork },
    { id:'content_creator', icon:'📱', name:'内容创作者', desc:'尝试做自媒体', check: g => g.flags.influencer },
    { id:'lottery_dreamer', icon:'🎰', name:'彩票梦想家', desc:'买过彩票', check: g => g.flags.lotteryTicket },
    { id:'hometown_visitor', icon:'🚄', name:'归乡者', desc:'回老家过年', check: g => g.flags.hometownVisit },
    { id:'digital_detoxer', icon:'📵', name:'数字排毒者', desc:'戒掉社交媒体', check: g => g.flags.socialMediaAnxiety && g.flags.digitalDetox },
    { id:'career_changer', icon:'🔄', name:'转行勇士', desc:'勇敢转行', check: g => g.flags.careerChange },
    { id:'burnout_survivor', icon:'🔥', name:'倦怠幸存者', desc:'经历过职业倦怠', check: g => g.flags.burnoutWarning },
    // v2.24 achievements
    { id:'spring_traveler', icon:'🚄', name:'春运勇士', desc:'经历过春运', check: g => g.flags.springFestivalTravel },
    { id:'summer_survivor', icon:'☀️', name:'酷暑幸存者', desc:'熬过了夏天', check: g => g.flags.summerHeat },
    { id:'autumn_poet', icon:'🍂', name:'秋日诗人', desc:'感受过秋天', check: g => g.flags.autumnMelancholy },
    { id:'winter_warrior', icon:'❄️', name:'冬日战士', desc:'度过了冬天', check: g => g.flags.winterDepression },
    { id:'shopaholic', icon:'🛒', name:'购物狂', desc:'经历过购物成瘾', check: g => g.flags.shoppingAddiction },
    { id:'generous_friend', icon:'💸', name:'慷慨朋友', desc:'借过钱给朋友', check: g => g.flags.friendBorrowMoney },
    // v2.30 achievements - dramatic events
    { id:'age35_survivor', icon:'🔴', name:'35岁幸存者', desc:'度过了35岁职场危机', check: g => g.flags.age35Crisis && g.age>35 },
    { id:'scam_aware', icon:'🛡️', name:'反诈先锋', desc:'识破杀猪盘', check: g => g.flags.antiFraud },
    { id:'digital_planner', icon:'💾', name:'数字遗嘱人', desc:'规划了数字遗产', check: g => g.flags.digitalLegacy },
    { id:'filial_crisis', icon:'🏥', name:'亲情守护者', desc:'照顾过生病的父母', check: g => g.flags.parentIllness },
    { id:'midlife_rebel', icon:'🌅', name:'中年叛逆者', desc:'40岁重新出发', check: g => g.flags.midlifeAwakening && g.mood>=60 },
    // v2.31 achievements
    { id:'negotiator', icon:'💼', name:'谈判高手', desc:'成功谈了薪资', check: g => g.flags.salaryNegotiation && g.jobSalary>=15000 },
    { id:'quiet_quitter', icon:'🤫', name:'安静辞职者', desc:'选择quiet quitting', check: g => g.flags.quietQuitting },
    { id:'credit_fixer', icon:'📊', name:'信用修复师', desc:'修复了征信', check: g => g.flags.creditRepaired },
    { id:'bridge_builder', icon:'🌉', name:'代沟桥梁师', desc:'理解了父母那一代', check: g => g.flags.generationalClash && g.relationships && g.relationships.family>=70 },
    { id:'phoenix', icon:'🔥', name:'浴火凤凰', desc:'从人生低谷重新崛起', check: g => (g.flags.romanceScam||g.flags.mortgageDefault||g.flags.parentIllness) && g.money>=50000 && g.mood>=60 },
    // v2.32 achievements
    { id:'layoff_survivor', icon:'📉', name:'裁员幸存者', desc:'经历了互联网大裁员', check: g => g.flags.techLayoff },
    { id:'hustle_king', icon:'🚀', name:'副业之王', desc:'副业收入超过主业', check: g => g.flags.sideHustleBoom },
    { id:'philosopher', icon:'📖', name:'生活哲学家', desc:'面对存在焦虑', check: g => g.flags.existentialDread && g.intel>=70 },
    { id:'old_friend', icon:'🍻', name:'老友记', desc:'与老朋友重逢', check: g => g.flags.oldFriendReunion },
    { id:'pension_planner', icon:'👴', name:'养老规划师', desc:'开始做养老规划', check: g => g.flags.retirementPlanning },
    // v2.33 achievements
    { id:'office_diplomat', icon:'🎭', name:'办公室外交官', desc:'处理了办公室政治', check: g => g.flags.officePolitics && g.relationships && g.relationships.colleagues>=50 },
    { id:'relationship_master', icon:'💑', name:'感情大师', desc:'通过了感情考验', check: g => g.flags.relationshipTest && g.relationships && g.relationships.partner>=70 },
    { id:'viral_star', icon:'📱', name:'一夜爆红', desc:'在社交媒体意外走红', check: g => g.flags.socialMediaFame },
    { id:'super_parent', icon:'👶', name:'超级父母', desc:'面对育儿挑战', check: g => g.flags.childcareCrisis && g.flags.hasChild },
    { id:'hometown_heart', icon:'🌾', name:'乡愁诗人', desc:'感受到了乡愁', check: g => g.flags.hometownNostalgia },
    // v2.34 achievements
    { id:'pet_adopted', icon:'🐾', name:'铲屎官进阶', desc:'领养了一只宠物', check: g => g.flags.hasPet },
    { id:'gig_worker', icon:'🛵', name:'零工达人', desc:'体验了零工经济', check: g => g.flags.gigEconomy },
    { id:'night_thinker', icon:'🌙', name:'深夜思想家', desc:'经历了一次深夜独白', check: g => g.flags.midnightReflection },
    { id:'smart_shopper', icon:'🧘', name:'理性消费者', desc:'抵制了消费主义陷阱', check: g => g.flags.minimalist },
    { id:'five_year_drift', icon:'🎒', name:'五年漂泊', desc:'在大城市漂泊超过5年', check: g => g.months >= 60 },
    // v2.35 achievements
    { id:'weather_warrior', icon:'⛈️', name:'风雨无阻', desc:'经历了极端天气仍然坚持', check: g => g.flags.typhoonDay || g.flags.rainySeason },
    { id:'cafe_regular', icon:'☕', name:'咖啡馆常客', desc:'在咖啡馆找到了第二个家', check: g => g.flags.cafeOffice },
    { id:'health_awakening', icon:'🏥', name:'健康觉醒', desc:'从体检报告中醒悟', check: g => g.flags.healthScare && g.flags.fitnessJourney },
    { id:'classmate_brave', icon:'🍻', name:'坦然面对', desc:'勇敢参加了同学聚会', check: g => g.flags.classmateReunion && g.social>=60 },
    { id:'smart_renter', icon:'🏠', name:'租房达人', desc:'和房东成功谈判', check: g => g.flags.rentIncrease && g.charm>=65 },
    // v2.36 achievements
    { id:'blind_box_fan', icon:'🎁', name:'盲盒玩家', desc:'体验了盲盒经济', check: g => g.flags.blindBox },
    { id:'digital_detox', icon:'📵', name:'数字断联', desc:'成功戒掉短视频', check: g => g.flags.digitalDetox },
    { id:'good_neighbor', icon:'🏘️', name:'好邻居', desc:'和新邻居成为朋友', check: g => g.flags.goodNeighbor },
    { id:'marathon_runner', icon:'🏃', name:'马拉松跑者', desc:'完成了一次马拉松挑战', check: g => g.flags.marathonChallenge && g.health>=70 },
    { id:'side_project_done', icon:'💻', name:'副业起步', desc:'开始了自己的副业项目', check: g => g.flags.sideProject },
    { id:'homecoming', icon:'🚄', name:'常回家看看', desc:'回家看望了父母', check: g => g.flags.hometownVisit },
    // v2.37 achievements
    { id:'freelancer_start', icon:'💻', name:'自由职业者', desc:'开始了自由职业生涯', check: g => g.flags.freelancer },
    { id:'investor', icon:'📊', name:'投资者', desc:'尝试了理财投资', check: g => g.flags.investmentAdvice },
    { id:'mentee', icon:'👨‍🏫', name:'得到指点', desc:'遇到了职业导师', check: g => g.flags.mentorFound },
    { id:'freelance_win', icon:'🌟', name:'自由职业成功', desc:'自由职业获得成功', check: g => g.flags.freelanceSuccess },
    // v2.38 achievements
    { id:'ai_learner', icon:'🤖', name:'AI学习者', desc:'学习了AI技能', check: g => g.flags.aiSkills },
    { id:'pua_resister', icon:'⚔️', name:'反PUA战士', desc:'勇敢反抗职场PUA', check: g => g.flags.workplacePUA && (g.flags.laborRights || g.charm>=65) },
    { id:'year_reviewer', icon:'📊', name:'年终总结', desc:'认真回顾了自己的这一年', check: g => g.flags.yearEndReview },
    { id:'conflict_resolver', icon:'🤝', name:'矛盾调解员', desc:'成功解决了室友矛盾', check: g => g.flags.roommateConflict && g.social>=55 },
    { id:'dating_explorer', icon:'💘', name:'交友探索者', desc:'尝试了交友软件', check: g => g.flags.datingApp },
    // v2.39 achievements
    { id:'city_explorer', icon:'🗺️', name:'城市探索者', desc:'在多个城市生活过', check: g => g.flags.citySwitch },
    { id:'midlife_reflection', icon:'🎂', name:'四十不惑', desc:'在40岁时重新审视人生', check: g => g.flags.midlifeCrisis40 },
    { id:'skill_learner', icon:'📚', name:'终身学习', desc:'学习了新技能', check: g => g.flags.learnNewSkill },
    { id:'good_child', icon:'👨‍👩‍👦', name:'孝顺子女', desc:'照顾好了父母的健康', check: g => (g.flags.parentHealthIssue || g.flags.hometownVisit) && g.relationships && g.relationships.family>=70 },
    { id:'traveler', icon:'🏖️', name:'周末旅行家', desc:'来了一次说走就走的旅行', check: g => g.flags.weekendTrip },
    // v2.40 achievements
    { id:'lottery_player', icon:'🎫', name:'彩票玩家', desc:'买了彩票试试手气', check: g => g.flags.lotteryTicket },
    { id:'viral_moment', icon:'📸', name:'意外走红', desc:'体验了一把网红感觉', check: g => g.flags.socialMediaFame },
    { id:'career_changer', icon:'🔀', name:'职业转型', desc:'勇敢走出了职业舒适区', check: g => g.flags.careerCrossroads },
    { id:'health_conscious', icon:'🏥', name:'健康意识', desc:'认真对待了年度体检', check: g => g.flags.annualCheckup },
    { id:'bookworm', icon:'📚', name:'读书会成员', desc:'加入了读书会', check: g => g.flags.bookClub },
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
    // --- v2.14 RELATIONSHIP-BASED ENDINGS ---
    { id:'lonely_death', badge:'🕯️', title:'孤独终老', desc:'你老了。没有伴侣，没有孩子，朋友也越来越少。\n\n你一个人住在养老院里，护工叫你吃饭的时候，你才发现今天是你生日。\n\n没有蛋糕，没有祝福，只有一个"生日快乐"的系统短信。\n\n你打开通讯录，翻了一遍又一遍——找不到一个可以打的人。\n\n"孤独不是身边没有人，是心里没有人。"\n\n但你也想说：一个人的日子，也可以有尊严。', cond: g => g.age>=55 && !g.flags.married && !g.flags.hasPartner && g.relationships.friends<30 && g.relationships.family<30 },
    { id:'family_first', badge:'👨‍👩‍👧‍👦', title:'家庭至上', desc:'你选择了家庭。在事业和家庭之间，你选择了后者。\n\n你可能没有成为职场精英，但你是孩子眼中的好父母，父母眼中的好儿女，伴侣眼中的好另一半。\n\n周末一家人去公园，晚上围在一起吃饭。你妈说："一家人在一起，比什么都强。"\n\n"成功的定义有很多种。家人幸福，是其中最温暖的一种。"', cond: g => g.flags.married && g.relationships.family>=80 && g.relationships.partner>=70 && g.mood>=60 && g.age>=40 },
    { id:'estranged', badge:'💔', title:'亲情断裂', desc:'你和家人的关系破裂了。也许是太久没联系，也许是某次争吵说了不该说的话。\n\n你妈的微信消息你已读不回，你爸的电话你假装没看到。\n\n直到某天你接到亲戚的电话："你爸住院了，想见你最后一面。"\n\n你赶到医院，看着他苍白的脸，突然觉得自己好混蛋。\n\n"有些关系，失去了才知道珍贵。"', cond: g => g.relationships.family<=10 && g.age>=30 },
    { id:'social_butterfly_end', badge:'🦋', title:'社交达人', desc:'你成了圈子里的"人脉王"。每个人都认识你，你也认识每个人。\n\n你组织了无数场聚会，撮合了无数对朋友，促成了无数个项目。\n\n你的名字就是最好的名片。\n\n但偶尔夜深人静的时候，你会想：这些人脉里，有几个是真正的朋友？\n\n"人脉是资产，朋友是财富。你拥有了前者，但不确定有没有后者。"', cond: g => g.social>=90 && g.relationships.friends>=70 && g.relationships.colleagues>=70 && g.age>=35 },
    // --- v2.19 NEW ENDINGS ---
    { id:'health_guru', badge:'🏃', title:'健康达人', desc:'你把健康放在了第一位。规律作息、健康饮食、坚持运动。\n\n你的体检报告比简历还漂亮。同事们都说你"越活越年轻"。\n\n你用行动证明：健康不是投资，是习惯。\n\n"身体是革命的本钱——你是最富有的人。"', cond: g => g.health>=90 && g.flags.healthyLifestyle && g.age>=35 },
    { id:'side_hustle_king', badge:'💡', title:'副业达人', desc:'你的副业收入超过了主业。从独立开发到内容创作，你成了真正的"斜杠青年"。\n\n白天上班摸鱼，晚上副业赚钱。你找到了属于自己的节奏。\n\n有人说你不务正业，但你知道：多条路，多个选择。\n\n"主业是生存，副业是生活。你两者都兼顾了。"', cond: g => g.flags.sideHustle && g.money>=150000 && g.intel>=70 && g.age>=30 },
    { id:'burnout_recovery', badge:'🌱', title:'浴火重生', desc:'你曾经差点过劳死，但你选择了改变。\n\n你辞掉了高薪但高压的工作，找了一份能平衡生活的工作。\n\n现在的你：准点下班，周末爬山，晚上陪家人。\n\n"人生不是百米冲刺，是马拉松。你学会了配速。"', cond: g => g.health>=70 && g.mood>=70 && g.flags.healthyLifestyle && g.age>=40 && g.consecutiveOvertime===0 },
    { id:'pet_parent', badge:'🐾', title:'铲屎官人生', desc:'你和你的宠物成了最好的朋友。\n\n每天下班回家，它都在门口等你。周末你们一起窝在沙发上，你看剧，它睡觉。\n\n有人说："养宠物不如养孩子。"但你知道：它不会叛逆，不会催婚，不会借钱。\n\n"有猫/狗的人生，是最好的人生。"', cond: g => g.flags.hasPet && g.mood>=65 && g.relationships.partner<50 && g.age>=30 },
    // --- v2.21 NEW ENDINGS ---
    { id:'mortgage_default_end', badge:'🏚️', title:'断供人生', desc:'你的房子被银行收走了。你从有房一族变回了租客。\n\n你搬出小区的那天，回头看了一眼：那个你曾经以为属于你，但永远不属于你的家。\n\n"房子是租的，但生活不是——虽然有时候生活也是租的。"\n\n你重新开始攒钱，重新开始生活。至少，你不用再还房贷了。', cond: g => g.flags.mortgageDefault && g.flags.hasHouse===false && g.money<-50000 && g.age>=30 },
    { id:'full_time_child_end', badge:'🏠', title:'全职儿女', desc:'你选择了回家，做爸妈的"全职儿女"。\n\n你帮他们做饭、打扫、陪他们聊天。你妈说："你回来就好，妈养你。"\n\n有人说你是啃老，有人说你是gap。你不在乎。\n\n"不是每个人都要在大城市拼命。回家，也是一种选择。"\n\n你找到了属于自己的节奏：慢一点，暖一点。', cond: g => g.flags.fullTimeChild && g.flags.lyingFlat && g.relationships.family>=75 && g.mood>=60 && g.age>=28 },
    { id:'kaogong_success', badge:'🎉', title:'考公上岸', desc:'你考上了公务员，成了"体制内"的人。\n\n你妈逢人就夸："我孩子在政府上班！"你爸在酒桌上第一次主动敬了你一杯。\n\n你的朋友圈从加班照变成了食堂照，从咖啡变成了茶。\n\n"宇宙的尽头是编制——你终于找到了你的宇宙。"\n\n虽然工资不高，但稳定，在这个不确定的时代，稳定本身就是一种奢侈。', cond: g => g.flags.civilServant && g.mood>=65 && g.money>=30000 && g.age>=26 },
    { id:'kong_yiji_end', badge:'📚', title:'孔乙己', desc:'你读了很多书，但你找不到"配得上"你的工作。\n\n你不愿意做"低端"工作，但"高端"工作不要你。你成了当代孔乙己：站着喝酒而穿长衫的唯一的人。\n\n"学历是孔乙己的长衫，脱不下是面子，脱下了是生活。"\n\n你还在等，等一个配得上你学历的机会。也许它会来，也许不会。', cond: g => !g.flags.tookOffGown && g.job==='待业中' && g.intel>=75 && g.age>=28 && g.mood<45 },
    { id:'digital_nomad_senior', badge:'🌏', title:'数字游民（资深）', desc:'你成了资深数字游民。你的办公室是全世界：清迈、巴厘岛、里斯本、墨西哥城。\n\n你的收入是美元，你的生活成本是泰铢，你的朋友圈是全球。\n\n"不是逃离，是选择另一种活法——一种不被国界限制的活法。"\n\n你在Instagram上发了张海边的照片，配文："Office for today."\n\n虽然你偶尔也会想念家乡的火锅和父母的唠叨。', cond: g => g.flags.lyingFlat && g.flags.freelancer && g.money>=120000 && g.intel>=70 && g.charm>=60 && g.age>=30 && g.age<=42 },
    // --- v2.25 NEW ENDINGS ---
    { id:'social_influencer_end', badge:'🌟', title:'社会活动家', desc:'你从打工人变成了社会活动家。你关注劳工权益、性别平等、环境保护。\n\n你在微博上有50万粉丝，你的每一次发声都能引发讨论。\n\n有人说你是"公知"，有人说你是"圣母"。你不在乎。\n\n"改变世界太难，但发出声音是每个人的权利。"\n\n你知道：声音汇聚起来，就是力量。', cond: g => g.social>=85 && g.intel>=75 && g.charm>=70 && g.flags.volunteer && g.age>=30 },
    { id:'minimalist_life', badge:'📦', title:'极简主义者', desc:'你选择了极简生活。你的家当只有：\n\n- 一个背包\n- 3套衣服\n- 一台笔记本\n- 几本书\n\n你卖掉了所有"多余"的东西。你的朋友说你疯了，但你觉得前所未有的轻松。\n\n"拥有越少，自由越多。"\n\n你终于明白：幸福不是拥有更多，而是需要更少。', cond: g => g.flags.minimalist && g.flags.digitalDetox && g.mood>=70 && g.money>=30000 && g.age>=30 },
    { id:'mentor_end', badge:'🎓', title:'人生导师', desc:'你成了很多年轻人的导师。你在知乎写回答，在B站做视频，在播客分享经验。\n\n你的口头禅是："我走过的弯路，你不必再走。"\n\n有人给你留言："谢谢你，让我少走了3年弯路。"\n\n你笑了：其实你走过的弯路，比任何人都多。\n\n"教育的本质是一棵树摇动另一棵树——你摇动了很多树。"', cond: g => g.intel>=80 && g.social>=65 && g.flags.teacher && g.age>=35 && g.months>=60 },
    { id:'community_builder', badge:'🏘️', title:'社区营造者', desc:'你在大城市建了一个"小社区"。你组织了读书会、跑步团、志愿者团队。\n\n你的微信群有500人，每个人都认识你，你也认识每个人。\n\n有人说："你让这座城市有了温度。"\n\n你笑了：其实你只是不想一个人孤独。\n\n"社区不是地理概念，是人与人的连接。"', cond: g => g.social>=80 && g.relationships.friends>=75 && g.flags.volunteer && g.mood>=65 && g.age>=32 },
    { id:'slow_life', badge:'🐌', title:'慢生活家', desc:'你选择了慢生活。你不加班、不社交、不内卷。\n\n你每天的生活：\n- 7点起床，做早餐\n- 8点上班，准点下班\n- 6点做饭，散步\n- 10点睡觉\n\n有人说你"没有上进心"，你说："我只是选择了不同的节奏。"\n\n"慢生活不是懒惰，是清醒。"', cond: g => g.flags.lyingFlat && g.flags.healthyLifestyle && g.health>=75 && g.mood>=70 && g.age>=33 },
    // --- v2.31 NEW ENDINGS ---
    { id:'scam_victim', badge:'🎭', title:'杀猪盘受害者', desc:'你被杀猪盘骗了。不只是钱，还有感情。\n\n你把积蓄都投了进去，对方消失后你才发现：那些甜言蜜语，都是话术。\n\n你报了警，但钱追不回来了。你删掉了交友App，删掉了聊天记录，但删不掉那段记忆。\n\n"你以为遇到了真爱，其实遇到了KPI。"\n\n你开始告诉每一个朋友：天上不会掉馅饼，更不会掉真爱。\n\n（如果你或身边的人遭遇诈骗，请拨打反诈热线：96110）', cond: g => g.flags.romanceScam && g.money<-30000 },
    { id:'anti_fraud_hero', badge:'🛡️', title:'反诈达人', desc:'你不仅识破了杀猪盘，还成了反诈志愿者。\n\n你在社区做反诈宣传，帮老年人识别电信诈骗，在朋友圈科普各种骗局。\n\n有人说你"管太多"，但你知道：每多一个人识破骗局，就少一个受害者。\n\n"防人之心不可无——在这个时代，防人之心要升级。"', cond: g => g.flags.antiFraud && g.social>=60 && g.age>=30 },
    { id:'career_pivot', badge:'🔄', title:'华丽转身', desc:'35岁那年，你成功转型了。\n\n你没有被年龄焦虑打败，而是找到了新的赛道。也许是管理岗，也许是技术专家，也许是完全不同的领域。\n\n你的经验成了优势，而不是包袱。\n\n"35岁不是终点，是另一个起点——前提是你准备好了。"', cond: g => g.flags.age35Crisis && g.flags.careerTransition && g.jobSalary>=20000 && g.age>=38 },
    { id:'sandwich_generation', badge:'🥪', title:'三明治一代', desc:'你上有老、下有小，你是全家的顶梁柱。\n\n父母的医药费、孩子的学费、房贷车贷——每一笔都压在你肩上。\n\n你不敢生病，不敢辞职，不敢休息。\n\n但你看着孩子的笑脸、父母的健康，你觉得一切都值了。\n\n"三明治虽然被夹在中间，但它是最有料的那一个。"', cond: g => g.flags.parentIllness && g.flags.hasChild && g.flags.married && g.age>=38 && g.mood>=50 },
    { id:'phoenix_rising', badge:'🔥', title:'浴火凤凰', desc:'你经历了人生最黑暗的时刻——也许是破产，也许是失业，也许是失去亲人。\n\n但你没有倒下。你一步一步地爬了起来，重新开始。\n\n现在的你：更坚强、更清醒、更珍惜当下。\n\n"人不是被打败的。一个人可以被毁灭，但不能被打败。"\n\n你成了别人眼中的"传奇"——不是因为成功，而是因为不放弃。', cond: g => (g.flags.romanceScam || g.flags.mortgageDefault || g.flags.parentIllness) && g.money>=50000 && g.mood>=65 && g.health>=60 && g.age>=40 },
    // --- v2.34 NEW ENDINGS ---
    { id:'workplace_legend', badge:'👑', title:'职场传奇', desc:'你从职场小白做到了行业大佬。\n\n你的LinkedIn有5万粉丝，你的每一次跳槽都上了新闻。猎头不是找你谈offer，是找你谈合作。\n\n有人说你"运气好"，但你知道：运气是准备遇到了机会。\n\n"职场没有天花板，只有你不敢想的楼层。"', cond: g => g.jobSalary>=40000 && g.intel>=80 && g.social>=70 && g.months>=96 && g.age>=35 },
    { id:'relationship_guru', badge:'💕', title:'幸福人生', desc:'你有了一段美好的感情/婚姻。\n\n你们互相理解、互相支持、互相成长。不是没有争吵，而是每次争吵后都更了解彼此。\n\n你们一起旅行、一起做饭、一起看日落。\n\n"幸福不是找到完美的人，而是学会用完美的眼光看不完美的人。"', cond: g => g.flags.married && g.relationships && g.relationships.partner>=80 && g.mood>=70 && g.age>=35 },
    { id:'lonely_achiever', badge:'🏅', title:'孤独的成功者', desc:'你成功了——有钱、有地位、有名气。\n\n但你的通讯录里找不到一个可以深夜打电话的人。你的家人不理解你，你的朋友嫉妒你，你的同事利用你。\n\n你站在高楼落地窗前，看着城市的灯火，突然觉得：这些灯没有一盏是为你亮的。\n\n"成功有很多种。你得到了全世界，却失去了自己。"', cond: g => g.money>=200000 && g.social>=60 && g.relationships && g.relationships.friends<30 && g.relationships.family<30 && g.age>=35 },
    { id:'comeback_kid', badge:'🎯', title:'逆风翻盘', desc:'所有人都觉得你完了——失业、负债、分手。\n\n但你用3年时间，从零开始，重新站了起来。\n\n你没有变得更富有，但你变得更强大。\n\n"人生最精彩的不是成功的时刻，而是从谷底爬起来的瞬间。"', cond: g => g.flags.techLayoff && g.money>=80000 && g.jobSalary>=15000 && g.mood>=60 && g.age>=32 },
    { id:'wanderer', badge:'🚶', title:'漂泊者', desc:'你在大城市漂了很多年，没有买房，没有结婚，没有扎根。\n\n但你去了很多地方，见了很多世面，活得很自由。\n\n有人说你"不稳定"，你说："我只是还没找到值得停留的地方。"\n\n"漂泊不是无根，是在寻找最适合自己的土壤。"', cond: g => !g.flags.hasHouse && !g.flags.married && g.money>=30000 && g.charm>=60 && g.months>=72 && g.age>=32 },
    // --- v2.35 ENDINGS ---
    { id:'health_warrior', badge:'💪', title:'健康觉醒者', desc:'你曾经是一个标准的"亚健康打工人"：熬夜、外卖、久坐、焦虑。\n\n直到那张体检报告把你惊醒。你开始跑步、做饭、早睡、冥想。\n\n你花了两年时间，把自己从悬崖边拉了回来。\n\n"健康不是目标，是一切目标的前提。"', cond: g => g.flags.healthScare && g.flags.fitnessJourney && g.health>=85 && g.mood>=70 && g.age>=30 },
    { id:'slow_life_master', badge:'☕', title:'慢生活实践者', desc:'你没有成为有钱人，也没有成为名人。\n\n但你找到了一种让自己舒服的生活方式：在咖啡馆看书、在公园散步、和朋友聊天。\n\n你不再追求"高效"和"成功"，你追求的是——心安。\n\n"慢下来不是放弃，是终于学会了和自己和解。"', cond: g => g.flags.cafeOffice && g.flags.minimalist && g.mood>=75 && g.intel>=70 && !g.flags.entrepreneur && g.age>=30 },
    { id:'weather_survivor', badge:'⛈️', title:'风雨同路人', desc:'你在大城市经历了很多"坏天气"：台风、暴雨、高温、寒冬。\n\n每一次极端天气，都是一次考验。你没有退缩，你挺过来了。\n\n你发现：那些打不倒你的，真的会让你更强大。\n\n"人生如天气，无法预测，只能适应。"', cond: g => (g.flags.typhoonDay || g.flags.rainySeason) && g.flags.healthScare && g.health>=70 && g.mood>=60 && g.months>=48 && g.age>=28 },
    // --- v2.36 ENDINGS ---
    { id:'content_king', badge:'📱', title:'自媒体达人', desc:'你从一个刷短视频成瘾的人，变成了一个做短视频的人。\n\n你的账号有了10万粉丝，你开始理解：内容创作的本质，是把你的时间卖给更多人。\n\n你没有成为大V，但你找到了表达的方式。\n\n"每个人都是自己生活的导演——只是有些人的观众更多而已。"', cond: g => g.flags.contentCreator && g.charm>=70 && g.social>=60 && g.money>=30000 && g.age>=28 },
    { id:'balanced_life', badge:'⚖️', title:'平衡大师', desc:'你学会了生活的艺术：工作、健康、家庭、社交、兴趣——你每一项都照顾到了。\n\n你没有特别突出的成就，但你有一个充实而平衡的人生。\n\n"成功不是某一方面的极致，是各个方面的和谐。"', cond: g => g.health>=70 && g.mood>=70 && g.intel>=60 && g.social>=60 && g.charm>=60 && (g.relationships && g.relationships.family>=60) && g.age>=35 },
    { id:'side_hustle_success', badge:'💼', title:'副业转正', desc:'你的副业终于做起来了。\n\n收入虽然不算多，但你知道：这是你自己的事业，不是给别人打工。\n\n你开始思考：要不要辞职全职做？\n\n"副业最好的结果是：你有选择的自由。"', cond: g => g.flags.sideProject && g.flags.sideHustle && g.money>=100000 && g.intel>=70 && g.age>=30 },
    // --- v2.37 ENDINGS ---
    { id:'freelance_master', badge:'🌟', title:'自由职业大师', desc:'你成功转型为自由职业者。\n\n你有稳定的客户，有灵活的时间，有不错的收入。\n\n你不再需要打卡，不需要开无聊的会，不需要看老板脸色。\n\n"自由职业不是逃避工作，是选择了另一种工作方式。"', cond: g => g.flags.freelanceSuccess && g.money>=80000 && g.intel>=70 && g.mood>=65 && g.age>=30 },
    { id:'wise_investor', badge:'📈', title:'投资高手', desc:'你学会了投资的智慧。\n\n你没有暴富，但你的资产在稳步增长。你不再追涨杀跌，不再被市场情绪左右。\n\n"投资不是赌博，是用时间换取复利。"', cond: g => g.flags.investmentAdvice && g.money>=300000 && g.intel>=75 && g.age>=35 },
    { id:'mentored_success', badge:'🎓', title:'薪火相传', desc:'你遇到了贵人，也得到了贵人的指点。\n\n你从一个迷茫的年轻人，变成了一个有方向的职业人。\n\n现在，你开始指导比你更年轻的人。\n\n"最好的报答，是把得到的帮助传递下去。"', cond: g => g.flags.mentorFound && g.jobSalary>=20000 && g.social>=70 && g.intel>=75 && g.age>=32 },
    // --- v2.38 ENDINGS ---
    { id:'ai_pioneer', badge:'🤖', title:'AI先驱者', desc:'你没有被AI淘汰，反而成为了AI时代的主角。\n\n你学会了用AI工具，你的效率翻倍，你的竞争力增强。\n\n"未来不是AI的，是会用AI的人的。"', cond: g => g.flags.aiSkills && g.intel>=80 && g.jobSalary>=20000 && g.money>=100000 && g.age>=30 },
    { id:'labor_hero', badge:'⚖️', title:'劳动权益捍卫者', desc:'你勇敢站出来，维护了自己的劳动权益。\n\n你拿到了应得的赔偿，你也帮助了其他人。\n\n"维权不是为了钱，是为了尊严。"', cond: g => g.flags.laborRights && g.money>=50000 && g.intel>=70 && g.social>=60 && g.age>=28 },
    { id:'happy_single', badge:'💝', title:'快乐单身族', desc:'你没有结婚，没有恋爱，但你活得很快乐。\n\n你有自己的爱好，有自己的朋友，有自己的节奏。\n\n"单身不是失败，是选择了另一种幸福。"', cond: g => g.flags.singleHappy && !g.flags.married && g.mood>=75 && g.social>=60 && g.charm>=60 && g.age>=32 },
    // --- v2.39 ENDINGS ---
    { id:'city_hopper', badge:'🗺️', title:'城市探索者', desc:'你在多个大城市生活过，体验了不同的城市文化。\n\n你发现：没有完美的城市，只有适合你的城市。\n\n"旅行的意义不是去更多地方，是在每个地方都认真生活。"', cond: g => g.flags.citySwitch && g.months>=60 && g.charm>=65 && g.social>=55 && g.age>=30 },
    { id:'lifelong_learner', badge:'📖', title:'终身学习者', desc:'你从未停止学习。\n\n你学了新技能、读了很多书、保持了思考的习惯。\n\n你没有成为专家，但你成为了一个有深度的人。\n\n"学习不是为了知道答案，是为了提出更好的问题。"', cond: g => g.flags.learnNewSkill && g.intel>=85 && g.mood>=65 && g.age>=35 },
    { id:'filial_child', badge:'👨‍👩‍👦', title:'孝顺子女', desc:'你在打拼事业的同时，也照顾好了父母。\n\n你经常回家看他们，给他们买保险，带他们体检。\n\n"孝顺不是给多少钱，是让父母知道你心里有他们。"', cond: g => (g.flags.parentHealthIssue || g.flags.hometownVisit) && (g.relationships && g.relationships.family>=80) && g.mood>=70 && g.age>=35 },
    // --- v2.40 ENDINGS ---
    { id:'lottery_winner_end', badge:'🎰', title:'彩票幸运儿', desc:'你真的中了彩票！\n\n虽然不是头奖，但也够你潇洒一阵子了。\n\n你没有辞职，没有炫富，只是默默地把钱存了起来。\n\n"运气是实力的一部分——但你这次，纯粹是运气。"', cond: g => g.flags.lotteryWin && g.money>=50000 && g.age>=28 },
    { id:'accidental_influencer', badge:'⭐', title:'意外网红', desc:'你的一条动态火了，你成了"15分钟名人"。\n\n你没有成为大V，但你体验了被关注的感觉。\n\n你明白了一个道理：名气是暂时的，真实的生活才是永恒的。\n\n"走红不是目的，是副产品。"', cond: g => g.flags.socialMediaFame && g.charm>=70 && g.social>=65 && g.age>=28 },
    { id:'career_transformer', badge:'🔄', title:'职业转型者', desc:'你勇敢地走出了舒适区，完成了职业转型。\n\n新的领域让你重新找回了激情。\n\n"转行不是失败，是重新开始。"', cond: g => g.flags.careerChange && g.jobSalary>=15000 && g.intel>=75 && g.mood>=65 && g.age>=32 },
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
    // v2.30: Update hidden backgrounds when showing create screen
    if (id === 'screen-create') updateHiddenBgDisplay();
    // v2.30: Load saved difficulty when showing create screen
    if (id === 'screen-create') {
        const legacy = getLegacy();
        setDifficulty(legacy.difficulty || 'normal');
    }
}

function updateHiddenBgDisplay() {
    ['chai2dai','star2dai','lottery_winner'].forEach(bgId => {
        const card = document.querySelector(`.bg-card[data-bg="${bgId}"]`);
        if (!card) return;
        const unlocked = isHiddenBgUnlocked(bgId);
        if (unlocked) {
            card.classList.remove('bg-locked');
            card.classList.add('bg-unlocked');
            const lockIcon = card.querySelector('.bg-stats .stat-neutral');
            if (lockIcon && lockIcon.textContent.includes('🔒')) {
                lockIcon.textContent = '🔓 已解锁';
                lockIcon.classList.remove('stat-neutral');
                lockIcon.classList.add('stat-up');
            }
        }
    });
}

// === CREATION ===
let selectedBg = null, selectedCity = null;
function selectBackground(bg) {
    // v2.30: Check if hidden background is unlocked
    const bgData = BACKGROUNDS[bg];
    if (bgData && bgData.hidden && !isHiddenBgUnlocked(bg)) {
        notify(`🔒 ${bgData.unlockCond}`);
        return;
    }
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

    // v2.30: Apply difficulty modifier
    const diff = getDifficultyModifier();
    const legacy = getLegacy();
    const legacyBonus = Math.min(legacy.points, 20); // Up to +20 from legacy points

    Object.assign(G, {
        name, age: bg.startAge||22, month: 1, year: 2024,
        city: selectedCity, cityName: city.name, background: selectedBg,
        job: bg.startJob, jobSalary: bg.startSalary,
        months: 0, choices: 0, eventsSeen: 0, eventLog: [], achievements: [],
        money: Math.floor(bg.money * diff.moneyMul) + legacyBonus * 500,
        health: clamp(bg.health + legacyBonus, 0, 100),
        mood: clamp(bg.mood + Math.floor(legacyBonus/2), 0, 100),
        intel: bg.intel, social: bg.social, charm: bg.charm,
        difficulty: diff.label,
        // 人际关系系统 v2.14
        relationships: {
            family: 60,      // 家人关系 (0-100)
            friends: 40,     // 朋友关系
            partner: 0,      // 恋人/伴侣关系 (单身时0)
            colleagues: 30,  // 同事关系
        },
        flags: { hasPartner: false, partnerName: '', marriedMonths: 0 },
        currentEvent: null, isEnded: false, consecutiveOvertime: 0,
    });

    showScreen('screen-game');
    updateHUD();

    const log = document.getElementById('event-log');
    log.innerHTML = '';

    const diffEmoji = diff.emoji;
    addEventCard({ icon: '🚀', title: `${bg.name} · 来到${city.name}`, body: bg.intro + `\n\n<div class="meme-quote">${city.meme}</div>`, type: 'milestone' }, false);
    addEventCard({ icon: '📍', title: `新起点 ${diffEmoji} ${diff.label}`, body: `你来到了${city.name}——"${city.trait}"。\n\n房租：${fmtMoney(city.rent)}/月\n生活成本：${city.cost>1.1?'较高':city.cost>1.0?'适中':'还行'}\n难度：${diff.label}${legacy.points>0?`\n传承加成：+${legacyBonus}点`:''}\n\n每个伟大的故事都从一间出租屋开始。`, type: 'special' }, false);

    document.getElementById('current-event').innerHTML = '';
    document.getElementById('btn-advance').disabled = false;
    G.eventLog.push({ age: G.age, text: `来到${city.name}，开始漂泊生活（${diff.label}）` });

    // Show tutorial for first-time players
    showTutorial();
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

    // v2.17: 记录最后活动（用于每日挑战）
    G._lastActivity = selectedActivity;

    G.money += effects.money;
    G.health = clamp(G.health + effects.health, 0, 100);
    G.mood = clamp(G.mood + effects.mood, 0, 100);
    G.intel = clamp(G.intel + effects.intel, 0, 100);
    G.social = clamp(G.social + effects.social, 0, 100);
    G.charm = clamp(G.charm + effects.charm, 0, 100);

    // v2.14: 活动也影响人际关系
    if (G.relationships) {
        if (selectedActivity === 'socialize') {
            G.relationships.friends = clamp((G.relationships.friends||40) + 8, 0, 100);
            G.relationships.colleagues = clamp((G.relationships.colleagues||30) + 3, 0, 100);
        }
        if (selectedActivity === 'rest') {
            G.relationships.partner = clamp((G.relationships.partner||0) + 3, 0, 100);
            G.relationships.family = clamp((G.relationships.family||60) + 2, 0, 100);
        }
    }

    const label = effects.label;
    selectedActivity = null;
    // 重置UI
    document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('selected'));
    return label;
}

// === GAME FLOW ===
function advanceMonth() {
    if (G.isEnded) return;
    // v2.17: 记录月初金钱（用于每日挑战）
    G._monthStartMoney = G.money;

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

    // 健康和心情自然衰减 (v2.30: difficulty modifier)
    const decayMul = getDifficultyModifier().decayMul;
    G.health = clamp(G.health - (G.job==='待业中'?0:1) * decayMul, 0, 100);
    G.mood = clamp(G.mood - 1 * decayMul, 0, 100);

    // 人际关系自然衰减 (v2.14)
    if (G.relationships) {
        G.relationships.family = clamp((G.relationships.family||60) - 1, 0, 100);  // 家人关系缓慢衰减
        G.relationships.friends = clamp((G.relationships.friends||40) - 1, 0, 100);  // 朋友关系衰减更快
        // 同事关系：工作时衰减，不工作时衰减更快
        if (G.job !== '待业中') {
            G.relationships.colleagues = clamp((G.relationships.colleagues||30) - 0.5, 0, 100);
        } else {
            G.relationships.colleagues = clamp((G.relationships.colleagues||30) - 2, 0, 100);
        }
        // 恋人关系：有恋人时衰减，需要维护
        if (G.flags.hasPartner) {
            G.relationships.partner = clamp((G.relationships.partner||0) - 2, 0, 100);
            G.flags.marriedMonths = (G.flags.marriedMonths||0) + 1;
        }
    }

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

    // v2.17: 检查每日挑战
    checkDailyChallenge();

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
    const _advBtn = document.getElementById('btn-advance');
    _advBtn.disabled = true;
    _advBtn.querySelector('.action-text').textContent = '请先做出选择';
    _advBtn.querySelector('.action-hint').textContent = '';
    document.getElementById('current-event').scrollIntoView({ behavior: 'smooth', block: 'center' });
    // v2.32: Context-sensitive sound effects
    const dangerIds = ['karoshi','bankruptcy','jail','romanceScam','techLayoff','mortgageDefault','creditCrisis'];
    const emotionIds = ['oldFriendReunion','parentIllness','generationalClash','existentialDread','midlifeAwakening'];
    const moneyIds = ['windfall','lotteryTicket','salaryNegotiation','sideHustleBoom'];
    if (dangerIds.some(id => event.id.includes(id))) playSound('danger');
    else if (emotionIds.some(id => event.id.includes(id))) playSound('emotion');
    else if (moneyIds.some(id => event.id.includes(id))) playSound('money');
    else if (event.isChain) playSound('chain');
    else playSound('click');
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
    const _advBtn2 = document.getElementById('btn-advance');
    _advBtn2.disabled = false;
    _advBtn2.querySelector('.action-text').textContent = '下个月';
    _advBtn2.querySelector('.action-hint').textContent = '空格键';
    G.currentEvent = null;

    updateHUD();
    if (G.health<=0 || G.mood<=0 || G.money<=-100000) triggerEnding();
    checkAchievements();

    // v2.16: 事件链系统 - 某些选择触发后续事件
    if (result.nextEvent) {
        setTimeout(() => {
            const nextEvent = typeof result.nextEvent === 'function' ? result.nextEvent(G) : result.nextEvent;
            if (nextEvent) showEvent(nextEvent);
        }, 800);
    }
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

    // v2.15: 更新人际关系面板
    updateRelationshipHUD();

    // v2.20: 更新每日挑战显示
    updateDailyChallengeHUD();

    document.getElementById('play-months').textContent = G.months;
    document.getElementById('total-choices').textContent = G.choices;
    document.getElementById('total-events').textContent = G.eventsSeen;
}

// v2.20: 每日挑战HUD更新
function updateDailyChallengeHUD() {
    const bar = document.getElementById('daily-challenge-bar');
    const text = document.getElementById('challenge-text');
    if (!bar || !text) return;

    const challenge = getDailyChallenge();
    if (challenge) {
        bar.style.display = 'flex';
        text.textContent = `${challenge.title}：${challenge.desc}`;
    } else {
        bar.style.display = 'none';
    }
}

// v2.15: 人际关系HUD更新
function updateRelationshipHUD() {
    if (!G.relationships) return;
    const relBar = (id, val) => {
        const bar = document.getElementById(`bar-${id}`);
        const valEl = document.getElementById(`val-${id}`);
        if (bar) bar.querySelector('.rel-fill').style.width = `${clamp(val,0,100)}%`;
        if (valEl) valEl.textContent = Math.round(val);
    };
    relBar('family', G.relationships.family || 0);
    relBar('friends', G.relationships.friends || 0);
    relBar('colleagues', G.relationships.colleagues || 0);
    // 恋人特殊处理
    const partnerVal = document.getElementById('val-partner');
    const partnerBar = document.getElementById('bar-partner');
    if (G.flags.hasPartner) {
        if (partnerBar) partnerBar.querySelector('.rel-fill').style.width = `${clamp(G.relationships.partner||0,0,100)}%`;
        if (partnerVal) partnerVal.textContent = Math.round(G.relationships.partner || 0);
    } else {
        if (partnerBar) partnerBar.querySelector('.rel-fill').style.width = '0%';
        if (partnerVal) partnerVal.textContent = '—';
    }
}

// v2.15: 切换人际关系面板显示
function toggleRelationships() {
    const content = document.getElementById('relationships-content');
    const icon = document.getElementById('rel-toggle');
    if (content.style.display === 'none') {
        content.style.display = 'grid';
        icon.classList.add('open');
    } else {
        content.style.display = 'none';
        icon.classList.remove('open');
    }
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

    // Track ending for statistics
    const endingsUnlocked = JSON.parse(localStorage.getItem('cityDrifters_endings') || '[]');
    if (!endingsUnlocked.includes(ending.id)) {
        endingsUnlocked.push(ending.id);
        localStorage.setItem('cityDrifters_endings', JSON.stringify(endingsUnlocked));
    }

    // v2.17: Update cross-playthrough statistics
    updatePlaythroughStats(ending.id);

    // v2.30: Apply legacy rewards
    const legacyPoints = applyLegacyReward(ending.id);

    // Calculate ending rarity
    const rarity = getEndingRarity(ending.id);
    const rarityLabel = { common: '普通', uncommon: '罕见', rare: '稀有', legendary: '传说' }[rarity];
    const rarityColor = { common: '#888', uncommon: '#4ade80', rare: '#60a5fa', legendary: '#f59e0b' }[rarity];

    document.getElementById('ending-badge').textContent = ending.badge;
    document.getElementById('ending-title').innerHTML = `${ending.title} <span class="ending-rarity" style="color:${rarityColor}">[${rarityLabel}]</span>`;
    document.getElementById('ending-desc').innerHTML = ending.desc.replace(/\n/g,'<br>');

    // Get achievements summary
    const achievementSummary = G.achievements.slice(0, 6).map(a => {
        const ach = ACHIEVEMENTS.find(x => x.id === a);
        return ach ? `<span class="achievement-badge-small">${ach.icon} ${ach.name}</span>` : '';
    }).join('');

    document.getElementById('summary-grid').innerHTML = `
        <div class="summary-item"><div class="summary-value">${G.age}岁</div><div class="summary-label">最终年龄</div></div>
        <div class="summary-item"><div class="summary-value">${fmtMoney(G.money)}</div><div class="summary-label">最终资产</div></div>
        <div class="summary-item"><div class="summary-value">${Math.floor(G.months/12)}年${G.months%12}个月</div><div class="summary-label">漂泊时长</div></div>
        <div class="summary-item"><div class="summary-value">${G.choices}次</div><div class="summary-label">做出选择</div></div>
        <div class="summary-item"><div class="summary-value">${G.eventsSeen}个</div><div class="summary-label">经历事件</div></div>
        <div class="summary-item"><div class="summary-value">${G.achievements.length}个</div><div class="summary-label">解锁成就</div></div>
        <div class="summary-item legacy-reward"><div class="summary-value">+${legacyPoints}</div><div class="summary-label">🌀 人生点数</div></div>`;

    // Add achievement showcase
    const achievementShowcase = document.getElementById('achievement-showcase');
    if (achievementShowcase) {
        achievementShowcase.innerHTML = achievementSummary ? `<h3>🏆 获得成就</h3><div class="achievement-showcase">${achievementSummary}</div>` : '';
    }

    // v2.34: Add attribute visualization
    const attrViz = document.getElementById('attribute-viz');
    if (attrViz) {
        const attrs = [
            { label: '💰 金钱', value: clamp(Math.floor((G.money+100000)/3000), 0, 100), raw: fmtMoney(G.money) },
            { label: '❤️ 健康', value: G.health, raw: G.health },
            { label: '😊 心情', value: G.mood, raw: G.mood },
            { label: '🧠 智力', value: G.intel, raw: G.intel },
            { label: '👥 人脉', value: G.social, raw: G.social },
            { label: '✨ 魅力', value: G.charm, raw: G.charm },
        ];
        attrViz.innerHTML = `<h3>📊 人生属性</h3><div class="attr-bars">${attrs.map(a => {
            const color = a.value >= 70 ? '#4ade80' : a.value >= 40 ? '#fbbf24' : '#f87171';
            return `<div class="attr-row"><span class="attr-label">${a.label}</span><div class="attr-bar-bg"><div class="attr-bar-fill" style="width:${a.value}%;background:${color}"></div></div><span class="attr-value">${a.raw}</span></div>`;
        }).join('')}</div>`;
    }

    // Update ending progress
    const progressText = `已解锁 ${endingsUnlocked.length}/${ENDINGS.length} 种结局`;
    const progressEl = document.getElementById('ending-progress');
    if (progressEl) progressEl.textContent = progressText;

    document.getElementById('timeline-list').innerHTML = G.eventLog.map(e => `<div class="timeline-item"><span class="timeline-year">${e.age}岁</span><span class="timeline-text">${e.text}</span></div>`).join('');

    // v2.33: Add replay suggestions
    const replayEl = document.getElementById('replay-suggestions');
    if (replayEl) {
        replayEl.innerHTML = getReplaySuggestions(ending.id);
    }

    showScreen('screen-ending');
}

function getReplaySuggestions(endingId) {
    const suggestions = [];
    const negative = ['karoshi','bankruptcy','burnout','depression','jail','startup_fail','scam_victim','mortgage_default_end','lonely_death','estranged'];
    const positive = ['fire','executive','settled','wealthy','hometown_hero','immigration'];
    const neutral = ['ordinary','single','lying_flat_end','digital_nomad','freelancer_end','slow_life'];

    if (negative.includes(endingId)) {
        suggestions.push('💡 试试不同的月度活动组合——运动和休息可以救命');
        suggestions.push('💡 注意健康值，低于20就该休息了');
        suggestions.push('💡 投资要分散风险，不要把鸡蛋放在一个篮子里');
    }
    if (positive.includes(endingId)) {
        suggestions.push('🎯 挑战更高难度，看看能否再次成功');
        suggestions.push('🎯 试试不同的城市和出身组合');
        suggestions.push('🎯 解锁隐藏出身：拆二代、星二代、彩票中奖者');
    }
    if (neutral.includes(endingId)) {
        suggestions.push('🌟 每个选择都会影响结局，试试不同的路');
        suggestions.push('🌟 人际关系很重要，多维护家人和朋友');
        suggestions.push('🌟 探索更多事件链，发现隐藏的故事');
    }

    // Always add these
    const legacy = getLegacy();
    if (legacy.totalEndings.length < 10) {
        suggestions.push(`🔓 再解锁 ${10-legacy.totalEndings.length} 种结局可以解锁"星二代"出身`);
    }
    if (!legacy.totalEndings.includes('fire')) {
        suggestions.push('🔥 试试达成"财务自由"结局');
    }

    const legacyPoints = legacy.points;
    if (legacyPoints > 0) {
        suggestions.push(`🌀 你有 ${legacyPoints} 人生点数，下次开局会有额外加成`);
    }

    return `<div class="replay-section"><h3>🔄 下次试试</h3><ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
}

function getEndingRarity(endingId) {
    // Legendary (rare endings that require specific conditions)
    const legendary = ['fire', 'immigration', 'executive', 'retire_abroad', 'wealthy', 'family_first', 'burnout_recovery', 'digital_nomad_senior', 'social_influencer_end', 'phoenix_rising', 'workplace_legend', 'ai_pioneer'];
    // Rare (hard to achieve)
    const rare = ['settled', 'startup_end', 'influencer_end', 'digital_nomad', 'karoshi', 'jail', 'social_butterfly_end', 'health_guru', 'side_hustle_king', 'kaogong_success', 'mentor_end', 'community_builder', 'career_pivot', 'anti_fraud_hero', 'relationship_guru', 'comeback_kid', 'health_warrior', 'freelance_master', 'labor_hero', 'lottery_winner_end'];
    // Uncommon (moderately difficult)
    const uncommon = ['hometown_hero', 'go_home', 'civil_end', 'ordinary', 'single', 'investment_guru', 'lying_flat_end', 'lonely_death', 'estranged', 'pet_parent', 'mortgage_default_end', 'kong_yiji_end', 'full_time_child_end', 'minimalist_life', 'slow_life', 'scam_victim', 'sandwich_generation', 'lonely_achiever', 'wanderer', 'slow_life_master', 'weather_survivor', 'content_king', 'balanced_life', 'side_hustle_success', 'wise_investor', 'mentored_success', 'happy_single', 'city_hopper', 'lifelong_learner', 'filial_child', 'accidental_influencer', 'career_transformer'];
    // Rare (hard to achieve)

    if (legendary.includes(endingId)) return 'legendary';
    if (rare.includes(endingId)) return 'rare';
    if (uncommon.includes(endingId)) return 'uncommon';
    return 'common';
}

// === ENDING GALLERY ===
function showEndingGallery() {
    const unlocked = JSON.parse(localStorage.getItem('cityDrifters_endings') || '[]');
    const grid = document.getElementById('gallery-grid');
    const progress = document.getElementById('gallery-progress');

    progress.textContent = `已解锁 ${unlocked.length} / ${ENDINGS.length} 种结局`;

    grid.innerHTML = ENDINGS.map(e => {
        const isUnlocked = unlocked.includes(e.id);
        const rarity = getEndingRarity(e.id);
        const rarityLabel = { common: '普通', uncommon: '罕见', rare: '稀有', legendary: '传说' }[rarity];
        const rarityColor = { common: '#888', uncommon: '#4ade80', rare: '#60a5fa', legendary: '#f59e0b' }[rarity];

        if (isUnlocked) {
            return `<div class="gallery-item unlocked" title="${e.title}">
                <div class="gallery-badge">${e.badge}</div>
                <div class="gallery-title">${e.title}</div>
                <div class="gallery-rarity" style="color:${rarityColor}">${rarityLabel}</div>
            </div>`;
        } else {
            return `<div class="gallery-item locked" title="???">
                <div class="gallery-badge">❓</div>
                <div class="gallery-title">???</div>
                <div class="gallery-rarity" style="color:${rarityColor}">${rarityLabel}</div>
            </div>`;
        }
    }).join('');

    document.getElementById('modal-gallery').classList.add('open');
}

// === TUTORIAL ===
function showTutorial() {
    const tutorialShown = localStorage.getItem('cityDrifters_tutorial');
    if (tutorialShown) return;

    setTimeout(() => {
        notify('💡 提示：选择月度活动来影响你的人生！按 1-5 快速选择');
        setTimeout(() => {
            notify('💡 提示：按空格键前进到下个月');
        }, 4000);
        localStorage.setItem('cityDrifters_tutorial', 'true');
    }, 2000);
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

// === v2.30 LEGACY / META-PROGRESSION SYSTEM ===
const LEGACY_KEY = 'cityDrifters_legacy';

function getLegacy() {
    return JSON.parse(localStorage.getItem(LEGACY_KEY) || '{"points":0,"totalEndings":[],"totalAchievements":[],"difficulty":"normal","playthroughs":0}');
}

function saveLegacy(data) {
    localStorage.setItem(LEGACY_KEY, JSON.stringify(data));
}

function calculateLegacyReward(endingId) {
    const rarity = getEndingRarity(endingId);
    const basePoints = { legendary: 50, rare: 30, uncommon: 15, common: 5 }[rarity] || 5;
    const achievementBonus = G.achievements.length * 3;
    const survivalBonus = Math.floor(G.months / 12);
    return basePoints + achievementBonus + survivalBonus;
}

function applyLegacyReward(endingId) {
    const legacy = getLegacy();
    const points = calculateLegacyReward(endingId);
    legacy.points += points;
    legacy.playthroughs++;
    if (!legacy.totalEndings.includes(endingId)) legacy.totalEndings.push(endingId);
    G.achievements.forEach(a => { if (!legacy.totalAchievements.includes(a)) legacy.totalAchievements.push(a); });
    saveLegacy(legacy);
    return points;
}

function isHiddenBgUnlocked(bgId) {
    const legacy = getLegacy();
    const endingsCount = legacy.totalEndings.length;
    if (bgId === 'chai2dai') return endingsCount >= 5;
    if (bgId === 'star2dai') return endingsCount >= 10;
    if (bgId === 'lottery_winner') return legacy.totalEndings.includes('fire') || legacy.totalEndings.includes('wealthy');
    return false;
}

function getDifficultyModifier() {
    const legacy = getLegacy();
    const d = legacy.difficulty || 'normal';
    return {
        easy:   { moneyMul: 1.5, decayMul: 0.7, eventMul: 0.8, label: '简单人生', emoji: '😊' },
        normal: { moneyMul: 1.0, decayMul: 1.0, eventMul: 1.0, label: '普通人生', emoji: '😐' },
        hard:   { moneyMul: 0.7, decayMul: 1.3, eventMul: 1.2, label: '困难人生', emoji: '😰' },
        hell:   { moneyMul: 0.5, decayMul: 1.6, eventMul: 1.5, label: '地狱人生', emoji: '🔥' },
    }[d];
}

function setDifficulty(d) {
    const legacy = getLegacy();
    legacy.difficulty = d;
    saveLegacy(legacy);
    // Update UI
    document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`.diff-card[data-diff="${d}"]`);
    if (card) card.classList.add('selected');
}

function showLegacyInfo() {
    const legacy = getLegacy();
    const modal = document.getElementById('modal-legacy') || createLegacyModal();
    const content = modal.querySelector('.legacy-content');
    if (!content) return;

    const unlockedBgs = ['chai2dai','star2dai','lottery_winner'].filter(id => isHiddenBgUnlocked(id));
    const bgNames = { chai2dai: '🏗️ 拆二代', star2dai: '⭐ 星二代', lottery_winner: '🎰 彩票中奖者' };

    content.innerHTML = `
        <div class="legacy-stats-grid">
            <div class="legacy-stat"><div class="legacy-num">${legacy.points}</div><div class="legacy-label">人生点数</div></div>
            <div class="legacy-stat"><div class="legacy-num">${legacy.totalEndings.length}</div><div class="legacy-label">解锁结局</div></div>
            <div class="legacy-stat"><div class="legacy-num">${legacy.totalAchievements.length}</div><div class="legacy-label">累计成就</div></div>
            <div class="legacy-stat"><div class="legacy-num">${legacy.playthroughs}</div><div class="legacy-label">游玩次数</div></div>
        </div>
        <div class="legacy-unlocks">
            <h3>🔓 已解锁隐藏出身</h3>
            ${unlockedBgs.length > 0 ? unlockedBgs.map(id => `<div class="legacy-unlock">${bgNames[id]}</div>`).join('') : '<p style="color:var(--text-muted)">还没有解锁隐藏出身</p>'}
            <h3 style="margin-top:16px">🎯 解锁条件</h3>
            <div class="legacy-conditions">
                <div class="legacy-cond ${legacy.totalEndings.length>=5?'done':''}">🏗️ 拆二代：解锁5种结局 (${legacy.totalEndings.length}/5)</div>
                <div class="legacy-cond ${legacy.totalEndings.length>=10?'done':''}">⭐ 星二代：解锁10种结局 (${legacy.totalEndings.length}/10)</div>
                <div class="legacy-cond ${legacy.totalEndings.includes('fire')||legacy.totalEndings.includes('wealthy')?'done':''}">🎰 彩票中奖者：达成财务自由结局</div>
            </div>
        </div>
    `;
    modal.classList.add('open');
}

function createLegacyModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-legacy';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('modal-legacy')"></div>
        <div class="modal-content modal-large">
            <button class="modal-close" onclick="closeModal('modal-legacy')" aria-label="关闭">×</button>
            <h2>🌀 人生传承</h2>
            <div class="legacy-content"></div>
            <button class="btn btn-secondary" onclick="closeModal('modal-legacy')" style="margin-top:16px">关闭</button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// === SAVE/LOAD (Multi-slot system) ===
const MAX_SAVE_SLOTS = 3;
const SAVE_PREFIX = 'cityDrifters_save_';

function saveGame(slot = 1) {
    const saveData = { ...G, savedAt: Date.now(), version: '2.40' };
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
            case 'money':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
                break;
            case 'danger':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
                break;
            case 'chain':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(500, ctx.currentTime);
                osc.frequency.setValueAtTime(700, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(900, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
                break;
            case 'emotion':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(350, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.3);
                osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.6);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.6);
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
    const t = document.getElementById('ending-title').textContent.replace(/\s*\[.*?\]\s*/g, '');
    const rarity = getEndingRarity(ENDINGS.find(e => e.title.includes(t))?.id || 'default');
    const rarityEmoji = { common: '⚪', uncommon: '🟢', rare: '🔵', legendary: '🟡' }[rarity];
    const topStat = getTopStat();
    const achievementCount = G.achievements.length;
    const text = `🏙️ 都市浮生记 · 人生结局\n\n${rarityEmoji} ${t}\n\n👤 ${G.name}，${G.age}岁\n📍 ${G.cityName}\n⏱️ 漂泊了${Math.floor(G.months/12)}年${G.months%12}个月\n💰 最终资产：${fmtMoney(G.money)}\n🎯 做出选择：${G.choices}次\n🏆 解锁成就：${achievementCount}个\n📊 最强属性：${topStat}\n\n#都市浮生记 #人生模拟器`;
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

// v2.16: 主题切换
function toggleTheme() {
    const isLight = document.getElementById('toggle-theme').checked;
    document.body.classList.toggle('light-theme', isLight);
    localStorage.setItem('gameSettings_lightTheme', isLight);
    playSound('click');
}

function loadThemeSettings() {
    const isLight = localStorage.getItem('gameSettings_lightTheme') === 'true';
    if (isLight) {
        document.body.classList.add('light-theme');
        const toggle = document.getElementById('toggle-theme');
        if (toggle) toggle.checked = true;
    }
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

// === v2.17 DAILY CHALLENGES SYSTEM ===
const DAILY_CHALLENGES = [
    { id:'earn_5k', icon:'💰', title:'小富翁', desc:'本月赚取5000元以上', check: g => g.jobSalary>=5000 || g.money > (g._monthStartMoney||0) + 5000, reward: {mood:10,money:1000} },
    { id:'health_80', icon:'❤️', title:'健康达人', desc:'保持健康在80以上', check: g => g.health>=80, reward: {health:5,mood:5} },
    { id:'social_call', icon:'📞', title:'社交达人', desc:'选择社交活动', check: g => g._lastActivity==='socialize', reward: {social:8,mood:5} },
    { id:'study_hard', icon:'📚', title:'学无止境', desc:'选择学习活动', check: g => g._lastActivity==='study', reward: {intel:8,mood:3} },
    { id:'exercise', icon:'🏃', title:'运动健将', desc:'选择锻炼活动', check: g => g._lastActivity==='exercise', reward: {health:8,charm:3} },
    { id:'save_money', icon:'🐷', title:'省钱高手', desc:'本月存款增加', check: g => g.money > (g._monthStartMoney||0), reward: {mood:8} },
    { id:'rest_well', icon:'😴', title:'养生达人', desc:'选择休息活动', check: g => g._lastActivity==='rest', reward: {health:5,mood:8} },
    { id:'work_hard', icon:'💼', title:'拼命三郎', desc:'选择工作活动', check: g => g._lastActivity==='work', reward: {money:2000,health:-3} },
];

function getDailyChallenge() {
    // 根据日期生成确定性挑战（每天不同）
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(),0,0)) / 86400000);
    return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

function checkDailyChallenge() {
    const challenge = getDailyChallenge();
    if (challenge.check(G)) {
        const reward = challenge.reward;
        if (reward.money) G.money += reward.money;
        if (reward.health) G.health = clamp(G.health + reward.health, 0, 100);
        if (reward.mood) G.mood = clamp(G.mood + reward.mood, 0, 100);
        if (reward.intel) G.intel = clamp(G.intel + reward.intel, 0, 100);
        if (reward.social) G.social = clamp(G.social + reward.social, 0, 100);
        if (reward.charm) G.charm = clamp(G.charm + reward.charm, 0, 100);

        // 记录完成
        const completed = JSON.parse(localStorage.getItem('cityDrifters_challenges') || '[]');
        const today = new Date().toDateString();
        if (!completed.includes(today)) {
            completed.push(today);
            localStorage.setItem('cityDrifters_challenges', JSON.stringify(completed));
        }

        notify(`🎯 每日挑战完成：${challenge.title}！`);
        playSound('success');
        updateHUD();
    }
}

// === v2.17 CROSS-PLAYTHROUGH STATISTICS ===
function updatePlaythroughStats(ending) {
    const stats = JSON.parse(localStorage.getItem('cityDrifters_stats') || '{}');
    stats.totalPlaythroughs = (stats.totalPlaythroughs || 0) + 1;
    stats.totalMonths = (stats.totalMonths || 0) + G.months;
    stats.totalChoices = (stats.totalChoices || 0) + G.choices;
    stats.totalEvents = (stats.totalEvents || 0) + G.eventsSeen;

    // 记录结局
    if (!stats.endings) stats.endings = {};
    stats.endings[ending] = (stats.endings[ending] || 0) + 1;

    // 记录最高金钱
    if (!stats.maxMoney || G.money > stats.maxMoney) stats.maxMoney = G.money;
    // 记录最长存活
    if (!stats.maxAge || G.age > stats.maxAge) stats.maxAge = G.age;
    // 记录最常选城市
    if (!stats.cities) stats.cities = {};
    stats.cities[G.city] = (stats.cities[G.city] || 0) + 1;
    // 记录最常选背景
    if (!stats.backgrounds) stats.backgrounds = {};
    stats.backgrounds[G.background] = (stats.backgrounds[G.background] || 0) + 1;

    localStorage.setItem('cityDrifters_stats', JSON.stringify(stats));
}

function showPlaythroughStats() {
    const stats = JSON.parse(localStorage.getItem('cityDrifters_stats') || '{}');
    const modal = document.getElementById('modal-stats') || createStatsModal();

    const content = modal.querySelector('.stats-content');
    if (!content) return;

    const totalPlaythroughs = stats.totalPlaythroughs || 0;
    const avgMonths = totalPlaythroughs > 0 ? Math.round((stats.totalMonths || 0) / totalPlaythroughs) : 0;

    content.innerHTML = `
        <div class="stats-grid">
            <div class="stats-card">
                <div class="stats-number">${totalPlaythroughs}</div>
                <div class="stats-label">总游玩次数</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${avgMonths}</div>
                <div class="stats-label">平均存活月数</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${stats.maxAge || 0}岁</div>
                <div class="stats-label">最长存活</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${fmtMoney(stats.maxMoney || 0)}</div>
                <div class="stats-label">最高资产</div>
            </div>
        </div>
        <p style="text-align:center;margin-top:16px;color:var(--text-secondary);font-size:0.9rem;">
            累计做出 ${stats.totalChoices || 0} 个选择，经历 ${stats.totalEvents || 0} 个事件
        </p>
    `;

    modal.classList.add('show');
}

function createStatsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-stats';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('modal-stats')"></div>
        <div class="modal-content">
            <h2>📊 游戏统计</h2>
            <div class="stats-content"></div>
            <button class="btn btn-secondary" onclick="closeModal('modal-stats')">关闭</button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadThemeSettings();
    initParticles();
    initMobileSwipe();
    initKeyboardShortcuts();
    const hasAnySave = localStorage.getItem(SAVE_PREFIX + '1') || localStorage.getItem(SAVE_PREFIX + '2') || localStorage.getItem(SAVE_PREFIX + '3') || localStorage.getItem('cityDrifters_save');
    if (!hasAnySave) document.getElementById('btn-continue').style.opacity = '0.4';
});
