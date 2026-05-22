// ============================================
// 都市浮生记 - Game Engine v7.8
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
      body:'你的同事小王辞职了。\n\n他在群里发了条消息："我不卷了，我要回家种地。"\n\n你以为他在开玩笑，结果他真的回了老家，开了个农场。朋友圈每天发种菜、养鸡的照片，配文："今天又是躺平的一天。"\n\n你开始思考：内卷到底为了什么？\n\n"反内卷不是躺平，是重新定义什么叫「站着」。"',
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
    // === v3.5 EVENTS - 演唱会与旅游 ===
    { id:'concert_ticket', icon:'🎤', title:'演唱会抢票',
      body:'你喜欢的歌手要来开演唱会了！\n\n你提前5分钟打开大麦网，手指悬在屏幕上。\n\n倒计时：3、2、1、开抢！\n\n你疯狂点击，但页面一直在转圈。等你进去，票已经没了。\n\n你刷朋友圈，看到有人晒票，有人骂黄牛。\n\n黄牛票：原价800，现在卖3000。\n\n"演唱会抢票是当代年轻人的高考——拼手速、拼运气、还要防黄牛。"',
      cond: g => !g.flags.concertTicket && g.money>3000 && g.age>=20 && g.age<=35,
      choices:[
        { label:'买黄牛票', hint:'-💰💰 +😊', fn: g => { g.flags.concertTicket=true; return{money:-3000,mood:30}; }},
        { label:'继续刷大麦', hint:'🎲 +😊', fn: g => { g.flags.concertTicket=true; if(Math.random()>0.7){return{money:-800,mood:25}}else{return{mood:-15}} }},
        { label:'算了，看直播', hint:'+😊', fn: g => { g.flags.concertTicket=true; return{mood:10}; }},
        { label:'举报黄牛', hint:'+✨ +😊', fn: g => { g.flags.concertTicket=true; return{charm:8,mood:5}; }},
      ]},
    { id:'china_travel', icon:'✈️', title:'China Travel热潮',
      body:'2025年，中国对50个国家免签，外国人来华旅游爆火。\n\n你在街上看到越来越多外国人，他们拿着手机拍短视频，喊着："China Travel！"\n\n你的外国朋友问你："中国哪里好玩？"\n\n你推荐了：\n- 北京的故宫\n- 上海的外滩\n- 成都的熊猫\n- 西安的兵马俑\n\n"China Travel让外国人看到了真实的中国——比他们想象得更现代、更方便、更安全。"',
      cond: g => !g.flags.chinaTravel && g.charm>=50 && g.social>=40,
      choices:[
        { label:'当志愿者导游', hint:'+👥 +✨ +😊', fn: g => { g.flags.chinaTravel=true; return{social:15,charm:12,mood:15}; }},
        { label:'拍短视频分享', hint:'+✨ +😊', fn: g => { g.flags.chinaTravel=true; return{charm:10,mood:10}; }},
        { label:'推荐给朋友', hint:'+👥', fn: g => { g.flags.chinaTravel=true; return{social:8}; }},
      ]},
    { id:'weekend_travel', icon:'🚄', title:'周末特种兵旅游',
      body:'你在小红书看到一条攻略："周末特种兵，2天玩3个城市。"\n\n你心动了，周五下班坐高铁出发：\n- 周五晚：到达城市A\n- 周六：打卡景点、吃美食\n- 周日：去城市B，继续打卡\n- 周日晚上：坐高铁回来\n\n你累得要死，但发了条朋友圈："生活不止眼前的苟且，还有诗和远方。"\n\n"特种兵旅游是年轻人的浪漫——用最少的钱，看最多的风景。"',
      cond: g => !g.flags.weekendTravel && g.money>2000 && g.mood<60 && g.age>=20 && g.age<=30,
      choices:[
        { label:'说走就走！', hint:'-💰 +😊 +❤️', fn: g => { g.flags.weekendTravel=true; return{money:-1500,mood:20,health:5}; }},
        { label:'约朋友一起', hint:'-💰 +👥 +😊', fn: g => { g.flags.weekendTravel=true; return{money:-1200,social:10,mood:15}; }},
        { label:'太累了，下次吧', hint:'+💰 -😊', fn: g => { g.flags.weekendTravel=true; return{money:500,mood:-5}; }},
      ]},
    // === v3.6 EVENTS - 直播经济 ===
    { id:'live_streaming', icon:'📱', title:'直播带货',
      body:'你在抖音开了个直播间，开始带货。\n\n你的粉丝从0涨到1000，再到10000。\n\n你每天直播3小时，讲解产品、回答问题、喊"家人们"。\n\n一个月后，你的收入：\n- 直播佣金：5000\n- 平台奖励：2000\n- 粉丝打赏：1000\n\n你开始想：这比上班赚得多啊！\n\n"直播带货是新时代的个体经济——但也是最卷的赛道。"',
      cond: g => !g.flags.liveStreaming && g.charm>=60 && g.age>=22 && g.age<=35 && g.intel>=55,
      choices:[
        { label:'全职做主播', hint:'+💰 +✨ -❤️', fn: g => { g.flags.liveStreaming=true; g.flags.influencer=true; setJob(g,'主播',0); return{money:8000,charm:12,health:-8}; }},
        { label:'兼职做', hint:'+💰 +😊', fn: g => { g.flags.liveStreaming=true; return{money:5000,mood:10}; }},
        { label:'放弃，太累了', hint:'+❤️ +😊', fn: g => { g.flags.liveStreaming=true; return{health:5,mood:5}; }},
      ]},
    { id:'influencer_scandal', icon:'💥', title:'网红翻车',
      body:'你关注的一个大网红翻车了。\n\n原因是：\n- 带货的产品被曝光是假货\n- 偷税漏税\n- 虚假宣传\n\n粉丝从1000万掉到100万，品牌方纷纷解约。\n\n你在评论区看到："网红经济就是割韭菜。"\n\n"网红的生命周期越来越短——今天是顶流，明天就翻车。"',
      cond: g => g.flags.influencer && !g.flags.influencerScandal && g.months>=12,
      choices:[
        { label:'引以为戒，谨慎经营', hint:'+🧠 +😊', fn: g => { g.flags.influencerScandal=true; return{intel:10,mood:8}; }},
        { label:'继续做，但更注重品质', hint:'+✨ +👥', fn: g => { g.flags.influencerScandal=true; return{charm:8,social:5}; }},
        { label:'退出直播圈', hint:'+😊 -💰', fn: g => { g.flags.influencerScandal=true; g.flags.influencer=false; return{mood:15,money:-5000}; }},
      ]},
    // === v3.7 EVENTS - 宠物经济 ===
    { id:'adopt_pet', icon:'🐱', title:'养宠物',
      body:'你在朋友圈看到一只流浪猫，决定领养它。\n\n你给它取名"橘猫"，每天喂它冻干、罐头、营养膏。\n\n你的开销：\n- 猫粮：月均500\n- 猫砂：月均100\n- 玩具：月均200\n- 医疗：年均2000\n\n你发了条朋友圈："我有猫了。"收获了100个赞。\n\n"养宠物是年轻人的精神寄托——它们不会催你结婚，不会问你工资，只会默默陪着你。"',
      cond: g => !g.flags.hasPet && g.money>5000 && g.age>=22 && g.age<=35,
      choices:[
        { label:'领养猫咪', hint:'-💰 +😊 +❤️', fn: g => { g.flags.hasPet=true; g.flags.catOwner=true; return{money:-2000,mood:20,health:5}; }},
        { label:'领养狗狗', hint:'-💰 +😊 +❤️', fn: g => { g.flags.hasPet=true; g.flags.dogOwner=true; return{money:-2500,mood:20,health:8}; }},
        { label:'养异宠（仓鼠/龟）', hint:'-💰 +😊', fn: g => { g.flags.hasPet=true; return{money:-1000,mood:15}; }},
        { label:'算了，养不起', hint:'+💰 -😊', fn: g => { g.flags.hasPet=true; return{money:500,mood:-5}; }},
      ]},
    { id:'pet_medical', icon:'🏥', title:'宠物看病',
      body:'你的猫生病了，你带它去宠物医院。\n\n检查结果：\n- 血常规：200\n- B超：300\n- 药品：500\n- 手术：2000\n\n你看着账单，心想：这比我自己的体检还贵。\n\n但看着猫咪可怜的眼神，你还是付了钱。\n\n"宠物医疗是年轻人的隐形炸弹——平时不觉得，一病就是几千。"',
      cond: g => g.flags.hasPet && !g.flags.petMedical && g.money>3000,
      choices:[
        { label:'花钱治疗', hint:'-💰💰 +😊 +❤️', fn: g => { g.flags.petMedical=true; return{money:-3000,mood:15,health:3}; }},
        { label:'买宠物保险', hint:'-💰 +🧠', fn: g => { g.flags.petMedical=true; g.flags.petInsurance=true; return{money:-1000,intel:5}; }},
        { label:'自己查资料治疗', hint:'+🧠 🎲', fn: g => { g.flags.petMedical=true; if(Math.random()>0.5){return{intel:8,mood:10}}else{return{mood:-15}} }},
      ]},
    // === v3.8 EVENTS - 相亲角与延迟退休 ===
    { id:'matchmaking_corner', icon:'💑', title:'相亲角',
      body:'你妈去公园相亲角了，把你的简历挂在那里。\n\n简历上写着：\n- 年龄：28岁\n- 学历：本科\n- 工作：互联网\n- 年薪：20万\n- 有房有车\n\n你妈说："今天有3个阿姨来问了。"\n你说："她们问的是我，还是我的条件？"\n\n"相亲角是父母的战场——但主角从来都不在场。"',
      cond: g => !g.flags.matchmakingCorner && !g.flags.married && g.age>=26 && g.age<=35,
      choices:[
        { label:'配合父母', hint:'+👥 -😊', fn: g => { g.flags.matchmakingCorner=true; return{social:10,mood:-10}; }},
        { label:'拒绝相亲', hint:'+😊 -👥', fn: g => { g.flags.matchmakingCorner=true; return{mood:15,social:-10}; }},
        { label:'自己去相亲角看看', hint:'+👥 +✨', fn: g => { g.flags.matchmakingCorner=true; return{social:8,charm:5}; }},
      ]},
    { id:'delayed_retirement', icon:'👴', title:'延迟退休',
      body:'新闻说：从2025年起，延迟退休正式实施。\n\n- 男性：从60岁延迟到63岁\n- 女性：从50/55岁延迟到55/58岁\n- 养老金最低缴费年限：从15年提高到20年\n\n你算了算：你现在25岁，要工作到63岁才能退休。\n\n还有38年。\n\n"延迟退休让年轻人意识到：这辈子，工作的时间比想象中更长。"',
      cond: g => !g.flags.delayedRetirement && g.age>=22 && g.age<=40,
      choices:[
        { label:'开始规划养老', hint:'+💰 +🧠', fn: g => { g.flags.delayedRetirement=true; return{money:3000,intel:10}; }},
        { label:'焦虑，但接受现实', hint:'+😊 -🧠', fn: g => { g.flags.delayedRetirement=true; return{mood:5,intel:-3}; }},
        { label:'考虑FIRE提前退休', hint:'+💰 +😊', fn: g => { g.flags.delayedRetirement=true; g.flags.fireMovement=true; return{money:5000,mood:8}; }},
        { label:'不管了，活在当下', hint:'+😊 -💰', fn: g => { g.flags.delayedRetirement=true; return{mood:10,money:-2000}; }},
      ]},
    // === v3.9 EVENTS - 脆皮打工人、搭子文化、35岁职场危机 ===
    { id:'fragile_worker', icon:'🏥', title:'脆皮打工人',
      body:'你爬三层楼梯气喘吁吁，熬一次夜心悸三天。\n\n体检报告上写着：颈椎反弓、甲状腺结节、腰椎间盘突出。\n\n你才26岁，但你的颈椎已经46岁了。\n\n"脆皮打工人"——一碰就坏，但还得继续上班。\n\n你决定开始养生：保温杯里泡枸杞，工位上做八段锦，睡前泡脚加艾草。',
      cond: g => !g.flags.fragileWorker && g.age>=22 && g.age<=35 && g.health<60,
      choices:[
        { label:'开始轻养生', hint:'+❤️ +😊', fn: g => { g.flags.fragileWorker=true; g.flags.lightWellness=true; return{health:10,mood:8,money:-500}; }},
        { label:'买保健品', hint:'-💰 +❤️', fn: g => { g.flags.fragileWorker=true; return{money:-3000,health:5,mood:3}; }},
        { label:'办健身卡', hint:'-💰 +❤️ +😊', fn: g => { g.flags.fragileWorker=true; g.flags.gymMember=true; return{money:-2000,health:15,mood:10}; }},
        { label:'算了，继续脆着', hint:'+😊 -❤️', fn: g => { g.flags.fragileWorker=true; return{mood:5,health:-10}; }},
      ]},
    { id:'dazi_culture', icon:'👥', title:'找搭子',
      body:'你发现朋友圈都在找"搭子"：饭搭子、旅游搭子、运动搭子、摸鱼搭子。\n\n"搭子"——比朋友浅，比陌生人深。有相同目的，但不用交心。\n\n你在小红书发帖："找饭搭子，要求：不迟到、不矫情、AA制。"\n\n3分钟后，8个人私信你。\n\n"搭子文化的精髓：精准陪伴，互不打扰。"',
      cond: g => !g.flags.daziCulture && g.age>=20 && g.age<=35 && g.social<70,
      choices:[
        { label:'找个饭搭子', hint:'+👥 +😊', fn: g => { g.flags.daziCulture=true; g.flags.foodDazi=true; return{social:15,mood:10}; }},
        { label:'找个运动搭子', hint:'+👥 +❤️', fn: g => { g.flags.daziCulture=true; g.flags.sportsDazi=true; return{social:12,health:8,mood:8}; }},
        { label:'找个旅游搭子', hint:'+👥 +✨', fn: g => { g.flags.daziCulture=true; g.flags.travelDazi=true; return{social:18,mood:15,money:-2000}; }},
        { label:'不需要搭子', hint:'+😊', fn: g => { g.flags.daziCulture=true; return{mood:5,social:-5}; }},
      ]},
    { id:'age_35_crisis', icon:'⚠️', title:'35岁危机',
      body:'你看到了数据：超60%的岗位明确要求"35岁以下"，40岁以上求职者简历回复率不足20%。\n\n阿里员工从25万锐减到12万，百度员工减少21%。\n\n你已经32岁了。还有3年。\n\n同事说："35岁是职场的保质期。过了这个年龄，你就是过期的罐头。"\n\n"中年不是危机，是清醒：你开始意识到，打工不是长久之计。"',
      cond: g => !g.flags.age35Crisis && g.age>=30 && g.age<=38,
      choices:[
        { label:'开始副业计划', hint:'+💰 +🧠', fn: g => { g.flags.age35Crisis=true; g.flags.sidePlan=true; return{intel:10,mood:-5}; }},
        { label:'考公上岸', hint:'+🧠 -😊', fn: g => { g.flags.age35Crisis=true; g.flags.civilServicePrep=true; return{intel:15,mood:-10,money:-5000}; }},
        { label:'学习新技能', hint:'+🧠 +✨', fn: g => { g.flags.age35Crisis=true; return{intel:12,charm:5,money:-3000}; }},
        { label:'焦虑，但继续上班', hint:'+😊 -🧠', fn: g => { g.flags.age35Crisis=true; return{mood:5,intel:-3}; }},
      ]},
    // === v4.0 EVENTS - 电子榨菜与反向消费 ===
    { id:'electronic_pickle', icon:'📱', title:'电子榨菜',
      body:'你打开外卖，架起手机，播放《武林外传》。\n\n这是你的"电子榨菜"——吃饭时必须看的视频，如同榨菜般为平淡的饭点提味增鲜。\n\n"一个人吃饭的时候需要有个背景音，不看点什么，总感觉少了一丝味道。"\n\n你的电子榨菜清单：《甄嬛传》、《武林外传》、搞笑短视频、影视解说。\n\n"电子榨菜是当代年轻人的孤独解药——让你一个人吃饭也不觉得孤单。"',
      cond: g => !g.flags.electronicPickle && g.age>=18 && g.age<=35,
      choices:[
        { label:'追剧下饭', hint:'+😊 -🧠', fn: g => { g.flags.electronicPickle=true; return{mood:10,intel:-3}; }},
        { label:'看纪录片', hint:'+😊 +🧠', fn: g => { g.flags.electronicPickle=true; g.flags.docuFan=true; return{mood:8,intel:8}; }},
        { label:'刷短视频', hint:'+😊 -❤️', fn: g => { g.flags.electronicPickle=true; return{mood:12,health:-5,intel:-5}; }},
        { label:'专心吃饭', hint:'+❤️ +🧠', fn: g => { g.flags.electronicPickle=true; return{health:5,intel:3,mood:-3}; }},
      ]},
    { id:'reverse_consumption', icon:'💸', title:'反向消费',
      body:'你开始研究"平替"：不是大牌买不起，而是平替更有性价比。\n\n你的购物清单：\n- 护肤品：国货平替，成分是王\n- 衣服：优衣库联名款，时尚又实惠\n- 零食：临期折扣店，半价拿下\n\n"57.2%的消费者更倾向选择性价比更高的替代商品。"\n\n"反向消费不是消费降级，而是消费觉醒：不再为品牌溢价买单，只为真正的价值付费。"',
      cond: g => !g.flags.reverseConsumption && g.age>=20 && g.age<=35 && g.money<50000,
      choices:[
        { label:'成为平替达人', hint:'+💰 +🧠', fn: g => { g.flags.reverseConsumption=true; g.flags.pingtiExpert=true; return{money:3000,intel:8,charm:3}; }},
        { label:'逛临期折扣店', hint:'+💰 +😊', fn: g => { g.flags.reverseConsumption=true; return{money:2000,mood:8}; }},
        { label:'研究薅羊毛攻略', hint:'+💰 +✨', fn: g => { g.flags.reverseConsumption=true; return{money:5000,intel:5}; }},
        { label:'该买还是买', hint:'-💰 +😊', fn: g => { g.flags.reverseConsumption=true; return{money:-3000,mood:5}; }},
      ]},
    // === v4.1 EVENTS - 谷子经济与MBTI ===
    { id:'goods_economy', icon:'🎭', title:'吃谷',
      body:'你路过谷子店，看到一排排"吧唧"（徽章）：\n- 《咒术回战》五条悟：限量款\n- 《原神》钟离：绝版\n- 《名侦探柯南》灰原哀：全球限量100个\n\n你花了800块买了3个吧唧。朋友说你疯了。\n\n你说："这不是铁皮，这是情绪价值。"\n\n2024年，中国谷子经济市场规模达1689亿元，增长40%。\n\n"炒股不如炒谷——但谷价比股票还刺激：今天2700，明天可能变27。"',
      cond: g => !g.flags.goodsEconomy && g.age>=18 && g.age<=30 && g.money>3000,
      choices:[
        { label:'入坑吃谷', hint:'-💰 +😊 +✨', fn: g => { g.flags.goodsEconomy=true; g.flags.guziCollector=true; return{money:-5000,mood:20,charm:5}; }},
        { label:'只买普谷', hint:'-💰 +😊', fn: g => { g.flags.goodsEconomy=true; return{money:-1000,mood:12}; }},
        { label:'囤货等升值', hint:'-💰 🎲', fn: g => { g.flags.goodsEconomy=true; if(Math.random()>0.5){return{money:10000,mood:20}}else{return{money:-8000,mood:-15}} }},
        { label:'不理解', hint:'+🧠', fn: g => { g.flags.goodsEconomy=true; return{intel:3}; }},
      ]},
    { id:'mbti_test', icon:'🧩', title:'MBTI测试',
      body:'同事问你："你是I人还是E人？"\n\n你做了MBTI测试，结果是INFJ（提倡者）。\n\n你的微信签名改成了"INFJ · 1%"（全球最稀有的人格类型）。\n\n"MBTI是当代年轻人的社交货币——比星座科学，比八字靠谱，比户口本详细。"\n\n相亲时第一句话："你MBTI是什么？"面试时HR问："你们团队都是什么MBTI？"',
      cond: g => !g.flags.mbtiTest && g.age>=18 && g.age<=35,
      choices:[
        { label:'认真做测试', hint:'+🧠 +✨', fn: g => { g.flags.mbtiTest=true; g.flags.mbtiINFJ=Math.random()>0.85; return{intel:8,charm:3}; }},
        { label:'随便选', hint:'+😊', fn: g => { g.flags.mbtiTest=true; return{mood:5}; }},
        { label:'写进简历', hint:'+✨ +💰', fn: g => { g.flags.mbtiTest=true; return{charm:5,money:2000}; }},
        { label:'不信这个', hint:'+🧠', fn: g => { g.flags.mbtiTest=true; return{intel:5,mood:-3}; }},
      ]},
    // === v4.2 EVENTS - 特种兵旅游与City不City ===
    { id:'special_forces_travel', icon:'🎒', title:'特种兵旅游',
      body:'你计划周末特种兵旅游：\n- 周五晚：硬座火车出发\n- 周六：打卡8个景点，步行2万步\n- 周日：再逛3个地方，晚上坐火车回来\n- 全程花费：650元\n\n"特种兵旅游的精髓：用最少的时间、最少的钱，去最多的地方。"\n\n"青春没有售价，硬座直达拉萨。"\n\n你的背包：青旅床位、街边小吃、夜间火车。省钱是艺术。',
      cond: g => !g.flags.specialForcesTravel && g.age>=18 && g.age<=28 && g.money<20000,
      choices:[
        { label:'出发！650元6天', hint:'-💰 +😊 +❤️', fn: g => { g.flags.specialForcesTravel=true; return{money:-650,mood:25,health:-10,charm:8}; }},
        { label:'48小时周末游', hint:'-💰 +😊', fn: g => { g.flags.specialForcesTravel=true; return{money:-400,mood:18,health:-5}; }},
        { label:'穷游7国1万元', hint:'-💰 +😊 +✨', fn: g => { g.flags.specialForcesTravel=true; g.flags.budgetTraveler=true; return{money:-10000,mood:30,charm:15,intel:10}; }},
        { label:'太累了，不去', hint:'+😊 +❤️', fn: g => { g.flags.specialForcesTravel=true; return{mood:5,health:3}; }},
      ]},
    { id:'city_or_not', icon:'🏙️', title:'City不City',
      body:'你在朋友圈发了张照片：咖啡馆、梧桐树、老洋房。\n\n朋友评论："好City啊！"\n\n你问："什么是City？"\n\n"City就是：有咖啡馆、有梧桐树、有老洋房，还有你这种人。"\n\n你看了看窗外：便利店、共享单车、外卖骑手。这算不算City？\n\n"City不City——是一种审美，也是一种生活方式的自我认证。"',
      cond: g => !g.flags.cityOrNot && g.age>=20 && g.age<=35,
      choices:[
        { label:'去网红打卡地', hint:'-💰 +✨ +😊', fn: g => { g.flags.cityOrNot=true; g.flags.influencer=true; return{money:-2000,charm:12,mood:15}; }},
        { label:'拍City感照片', hint:'+✨ +😊', fn: g => { g.flags.cityOrNot=true; return{charm:10,mood:8}; }},
        { label:'发朋友圈', hint:'+👥 +✨', fn: g => { g.flags.cityOrNot=true; return{social:12,charm:8,mood:5}; }},
        { label:'不懂，也不care', hint:'+🧠 +😊', fn: g => { g.flags.cityOrNot=true; return{intel:5,mood:3}; }},
      ]},
    // === v4.3 EVENTS - 情绪价值消费 ===
    { id:'emotional_value', icon:'💝', title:'为快乐买单',
      body:'你看到一个潮玩盲盒：69元。你犹豫了。\n\n然后你想想：今天被领导骂了，和同事吵架了，地铁被挤成照片了。\n\n你买了。\n\n"情绪消费——用一杯奶茶的钱，换24小时的好心情。"\n\n数据：超过90%的年轻人认可情绪价值，近60%愿意为情绪价值付费。\n\n2025年，中国情绪消费市场规模突破2万亿元。\n\n"我们消费的不是商品，而是情绪——多巴胺、治愈感、小确幸。"',
      cond: g => !g.flags.emotionalValue && g.age>=18 && g.age<=35 && g.mood<70,
      choices:[
        { label:'买盲盒', hint:'-💰 +😊', fn: g => { g.flags.emotionalValue=true; g.flags.blindBoxFan=true; return{money:-200,mood:15,charm:3}; }},
        { label:'买手办', hint:'-💰 +😊 +✨', fn: g => { g.flags.emotionalValue=true; g.flags.figureCollector=true; return{money:-500,mood:20,charm:5}; }},
        { label:'看沉浸式演出', hint:'-💰 +😊 +🧠', fn: g => { g.flags.emotionalValue=true; return{money:-800,mood:25,intel:8}; }},
        { label:'理性消费', hint:'+🧠 +💰', fn: g => { g.flags.emotionalValue=true; return{intel:8,mood:-5,money:500}; }},
      ]},
    // === v4.4 EVENTS - AI打工人焦虑 ===
    { id:'ai_anxiety', icon:'🤖', title:'AI来了',
      body:'公司开会：我们要引入AI了。\n\n你的岗位：文案策划。AI能写。你的岗位：数据分析。AI能算。你的岗位：客服。AI能聊。\n\n同事说："AI不淘汰你，但会用AI的人淘汰你。"\n\n你看了看你的工资条：8000元。\nAI的价格：每月99元。\n\n"AI焦虑不是怕机器，是怕自己变得像机器一样可以被替代。"',
      cond: g => !g.flags.aiAnxiety && g.age>=22 && g.age<=40 && g.job!=='待业中',
      choices:[
        { label:'学习AI工具', hint:'+🧠 +✨', fn: g => { g.flags.aiAnxiety=true; g.flags.aiToolUser=true; return{intel:15,charm:5,money:-1000}; }},
        { label:'给AI当老师', hint:'+💰 +🧠', fn: g => { g.flags.aiAnxiety=true; g.flags.aiTrainer=true; return{money:5000,intel:10,mood:5}; }},
        { label:'发展AI无法替代的技能', hint:'+🧠 +✨', fn: g => { g.flags.aiAnxiety=true; return{intel:12,charm:8,mood:8}; }},
        { label:'假装没听见', hint:'+😊 -🧠', fn: g => { g.flags.aiAnxiety=true; return{mood:3,intel:-5}; }},
      ]},
    { id:'ai_side_hustle', icon:'💻', title:'AI副业',
      body:'你在小红书看到：\n"用AI月入过万！"\n"AI写作，0基础也能做！"\n"AI绘图，在家接单！"\n\n你心动了。花了998元买了个AI课程。\n\n课程教你：如何用AI批量生成小红书文案、短视频脚本、电商详情页。\n\n你试了一个月，赚了800元。\n\n"AI副业的真相：教AI课的人赚了钱，学AI课的人亏了学费。"',
      cond: g => !g.flags.aiSideHustle && g.age>=20 && g.age<=35 && g.intel>=50,
      choices:[
        { label:'认真学，认真做', hint:'+💰 +🧠', fn: g => { g.flags.aiSideHustle=true; g.flags.aiSideHustleSuccess=Math.random()>0.4; return{money:-998,intel:15,mood:5}; }},
        { label:'批量生成内容', hint:'+💰 🎲', fn: g => { g.flags.aiSideHustle=true; if(Math.random()>0.5){return{money:3000,intel:8}}else{return{money:-998,mood:-10}} }},
        { label:'开发AI工具', hint:'+💰 +🧠 +✨', fn: g => { g.flags.aiSideHustle=true; g.flags.aiToolDev=true; return{money:8000,intel:20,charm:10}; }},
        { label:'不买，不学', hint:'+💰 +😊', fn: g => { g.flags.aiSideHustle=true; return{money:998,mood:3}; }},
      ]},
    // === v4.5 EVENTS - 多巴胺穿搭与县城文学 ===
    { id:'dopamine_dressing', icon:'👗', title:'多巴胺穿搭',
      body:'你看了看衣柜：黑、白、灰。\n\n你打开小红书：满屏都是红、橙、黄、绿、蓝、紫。\n\n"多巴胺穿搭"——用鲜艳的色彩刺激大脑分泌多巴胺，让心情变好。\n\n你买了一件荧光绿的T恤，一条亮橙色的裤子。\n\n朋友说："你看起来像个移动的调色盘。"\n\n你说："这叫快乐穿搭。"\n\n"穿得像调色盘，活得像彩虹——多巴胺穿搭，把快乐穿在身上。"',
      cond: g => !g.flags.dopamineDressing && g.age>=18 && g.age<=32,
      choices:[
        { label:'全套多巴胺穿搭', hint:'-💰 +✨ +😊', fn: g => { g.flags.dopamineDressing=true; g.flags.colorfulStyle=true; return{money:-2000,charm:15,mood:18}; }},
        { label:'买一件彩色单品', hint:'-💰 +✨', fn: g => { g.flags.dopamineDressing=true; return{money:-500,charm:8,mood:10}; }},
        { label:'发小红书', hint:'+👥 +✨ +😊', fn: g => { g.flags.dopamineDressing=true; g.flags.fashionBlogger=Math.random()>0.6; return{social:15,charm:12,mood:15}; }},
        { label:'还是黑白灰舒服', hint:'+😊', fn: g => { g.flags.dopamineDressing=true; return{mood:5,charm:-3}; }},
      ]},
    { id:'small_town_nostalgia', icon:'🏘️', title:'县城文学',
      body:'你看到一篇小红书：\n\n"逃离北上广，回到小县城。"\n\n配图：青石板路、老茶馆、梧桐树、猫。\n\n你心动了。\n\n但你又看到另一篇：\n\n"县城的真实生活：月薪3000，相亲5年，买房10万，买车5万，结婚30万，然后继续相亲。"\n\n"县城文学——是年轻人的乡愁，也是现实的两个版本。"',
      cond: g => !g.flags.smallTownNostalgia && g.age>=24 && g.age<=35 && g.city!=='成都',
      choices:[
        { label:'回县城看看', hint:'-💰 +😊 +👥', fn: g => { g.flags.smallTownNostalgia=true; g.flags.hometownVisit=true; return{money:-2000,mood:15,social:10}; }},
        { label:'写县城故事', hint:'+✨ +🧠', fn: g => { g.flags.smallTownNostalgia=true; g.flags.writer=true; return{charm:12,intel:10,mood:8}; }},
        { label:'算了，还是留在大城市', hint:'+🧠 +😊', fn: g => { g.flags.smallTownNostalgia=true; return{intel:5,mood:3}; }},
        { label:'发朋友圈感慨', hint:'+👥 +✨', fn: g => { g.flags.smallTownNostalgia=true; return{social:8,charm:5,mood:5}; }},
      ]},
    // === v4.6 EVENTS - 松弛感与慢生活 ===
    { id:'slow_living', icon:'🌿', title:'慢生活',
      body:'你看到一篇文章：\n\n"快节奏时代，一些年轻人减速前行。"\n\n你开始反思：每天996，回家刷手机到凌晨，然后继续996。\n\n你决定慢下来：\n- 每天阅读30分钟\n- 周末去公园发呆\n- 学做手工、钩织\n- 关掉手机通知\n\n"慢生活不是躺平，而是听见自己内心的声音。"\n\n"在高速运转的世界里，慢，是一种稀缺的能力。"',
      cond: g => !g.flags.slowLiving && g.age>=22 && g.age<=40 && g.health<70,
      choices:[
        { label:'开始慢生活实验', hint:'+😊 +❤️ +🧠', fn: g => { g.flags.slowLiving=true; g.flags.mindfulLiving=true; return{mood:15,health:10,intel:8}; }},
        { label:'每天阅读', hint:'+🧠 +😊', fn: g => { g.flags.slowLiving=true; g.flags.dailyReader=true; return{intel:15,mood:10}; }},
        { label:'学做手工', hint:'+✨ +😊', fn: g => { g.flags.slowLiving=true; g.flags.handicraft=true; return{charm:10,mood:12,intel:5}; }},
        { label:'算了，快不起来', hint:'+😊', fn: g => { g.flags.slowLiving=true; return{mood:5}; }},
      ]},
    { id:'dopamine_fasting', icon:'🧘', title:'多巴胺断舍离',
      body:'你看到一个视频：\n\n"多巴胺断舍离——戒掉短视频、戒掉游戏、戒掉外卖。"\n\n你试了三天：\n- Day 1：焦虑、无聊、想刷手机\n- Day 2：平静、开始看书\n- Day 3：内心安宁、精力充沛\n\n"多巴胺断舍离不是苦行，而是重新掌控自己的大脑。"\n\n"当你不再被即时满足控制，你会发现：延迟满足才是真正的满足。"',
      cond: g => !g.flags.dopamineFasting && g.age>=20 && g.age<=35,
      choices:[
        { label:'坚持一周', hint:'+🧠 +❤️ +😊', fn: g => { g.flags.dopamineFasting=true; g.flags.digitalDetox=true; return{intel:12,health:8,mood:15}; }},
        { label:'坚持三天', hint:'+🧠 +😊', fn: g => { g.flags.dopamineFasting=true; return{intel:8,mood:10}; }},
        { label:'试了一天，失败了', hint:'+😊 -🧠', fn: g => { g.flags.dopamineFasting=true; return{mood:3,intel:-3}; }},
        { label:'不需要，我很有自制力', hint:'+✨', fn: g => { g.flags.dopamineFasting=true; return{charm:5,mood:5}; }},
      ]},
    // === v4.7 EVENTS - 抽象文化与网络梗 ===
    { id:'abstract_culture', icon:'🎭', title:'抽象文化',
      body:'你刷短视频，看到了：\n\n- 《哈基米之歌》：AI无限二创，歌词毫无逻辑，但你就是想笑\n- 《技能五子棋》：AI谱曲，完全抽象，但莫名上头\n- "丝瓜汤"：AI换脸演家庭剧，一个人演全家\n\n你不懂，但你笑了。\n\n"抽象文化——不是讽刺，而是展示一种全新的、偏离日常逻辑的可能性。"\n\n"看不懂？那就对了。看不懂带来了新鲜感和解放感。"',
      cond: g => !g.flags.abstractCulture && g.age>=18 && g.age<=32,
      choices:[
        { label:'二创一个视频', hint:'+✨ +😊 +🧠', fn: g => { g.flags.abstractCulture=true; g.flags.contentCreator=true; return{charm:15,mood:12,intel:8}; }},
        { label:'发抽象表情包', hint:'+👥 +✨', fn: g => { g.flags.abstractCulture=true; return{social:12,charm:8,mood:8}; }},
        { label:'用AI创作', hint:'+🧠 +✨', fn: g => { g.flags.abstractCulture=true; g.flags.aiCreator=true; return{intel:12,charm:10,mood:10}; }},
        { label:'看不懂，也不想看', hint:'+🧠', fn: g => { g.flags.abstractCulture=true; return{intel:3,mood:-3}; }},
      ]},
    { id:'internet_meme', icon:'😂', title:'网络热梗',
      body:'你发现今年的网络热梗：\n\n- "班味儿"：上班后的疲惫感\n- "脆皮打工人"：一碰就坏的年轻人\n- "电子榨菜"：吃饭时看的视频\n- "搭子"：精准陪伴的社交关系\n\n你开始用这些词发朋友圈。\n\n朋友评论："你已经被互联网腌入味了。"\n\n"网络热梗——是一代人的集体记忆，也是时代情绪的浓缩。"',
      cond: g => !g.flags.internetMeme && g.age>=18 && g.age<=35,
      choices:[
        { label:'写段子投稿', hint:'+✨ +💰', fn: g => { g.flags.internetMeme=true; g.flags.jokeWriter=true; if(Math.random()>0.5){return{charm:15,mood:15,money:2000}}else{return{charm:5,mood:-5}} }},
        { label:'做梗图', hint:'+✨ +😊', fn: g => { g.flags.internetMeme=true; g.flags.memeCreator=true; return{charm:12,mood:10}; }},
        { label:'只是默默使用', hint:'+👥 +😊', fn: g => { g.flags.internetMeme=true; return{social:8,mood:8}; }},
        { label:'不玩梗，太累了', hint:'+🧠 +😊', fn: g => { g.flags.internetMeme=true; return{intel:5,mood:3}; }},
      ]},
    // === v4.8 EVENTS - 断亲与轻断亲 ===
    { id:'family_disconnect', icon:'🚪', title:'断亲',
      body:'春节快到了。你妈打来电话：\n\n"什么时候回来？"\n"什么时候结婚？"\n"工资多少了？"\n"买房了吗？"\n\n你看着手机，沉默了。\n\n"过年回家不是充电，是耗电。"\n\n南京大学调查：90后断亲率63%，00后断亲率78%。\n\n你不是不孝，你只是累了。\n\n"断亲不是断情，而是对无效社交的淘汰，对高质量亲情的觉醒。"',
      cond: g => !g.flags.familyDisconnect && g.age>=22 && g.age<=35,
      choices:[
        { label:'春节不回家', hint:'+😊 -👥', fn: g => { g.flags.familyDisconnect=true; return{mood:20,social:-15}; }},
        { label:'退家族群', hint:'+😊 -👥', fn: g => { g.flags.familyDisconnect=true; g.flags.quitFamilyGroup=true; return{mood:15,social:-20}; }},
        { label:'轻断亲：回乡住酒店', hint:'+😊 -💰', fn: g => { g.flags.familyDisconnect=true; g.flags.lightDisconnect=true; return{mood:12,money:-2000,social:-5}; }},
        { label:'还是回家吧', hint:'+👥 +😊 -❤️', fn: g => { g.flags.familyDisconnect=true; return{social:10,mood:5,health:-5}; }},
      ]},
    // === v4.9 EVENTS - 精神离职与职场倦怠 ===
    { id:'quiet_quitting', icon:'😶', title:'精神离职',
      body:'你开始实践"精神离职"：\n\n- 上班，绝不早到\n- 下班，绝不多待\n- 只做份内之事，拒绝额外责任\n- 下班后绝不回工作消息\n\n盖洛普数据：全球59%的员工处于"安静离职"状态。\n\n你不是不努力，你只是累了。\n\n"精神离职不是躺平，而是在工作和生活之间找到平衡。"\n\n"工作不是生活的全部，没必要也不值得。"',
      cond: g => !g.flags.quietQuitting && g.age>=22 && g.age<=40 && g.job!=='待业中' && g.mood<65,
      choices:[
        { label:'彻底精神离职', hint:'+😊 +❤️ -💰', fn: g => { g.flags.quietQuitting=true; g.flags.fullQuietQuit=true; return{mood:20,health:10,money:-3000}; }},
        { label:'适度精神离职', hint:'+😊 +❤️', fn: g => { g.flags.quietQuitting=true; g.flags.moderateQuietQuit=true; return{mood:15,health:8}; }},
        { label:'发展副业', hint:'+💰 +🧠', fn: g => { g.flags.quietQuitting=true; g.flags.sideHustleFocus=true; return{money:5000,intel:8,mood:10}; }},
        { label:'算了，还是卷吧', hint:'+💰 -😊', fn: g => { g.flags.quietQuitting=true; return{money:3000,mood:-10,health:-5}; }},
      ]},
    { id:'job_burnout', icon:'🔥', title:'职业倦怠',
      body:'你发现自己：\n\n- 闹钟响了，不想起来\n- 上班时盼着下班\n- 下班后什么都不想做\n- 感觉自己被工作"掏空"\n\n你可能已经"职业倦怠"了。\n\n"职业倦怠不是你不努力，而是你太努力了——努力到忘了自己。"\n\n心理学家说：这不是懒，这是自我保护。\n\n"当你还有工作能力，但心理上已经丧失了持续工作的动力，说明你的能量已经消耗殆尽了。"',
      cond: g => !g.flags.jobBurnout && g.age>=23 && g.age<=45 && g.job!=='待业中' && g.health<65,
      choices:[
        { label:'请假休息', hint:'+❤️ +😊 -💰', fn: g => { g.flags.jobBurnout=true; g.flags.restAndRecover=true; return{health:15,mood:15,money:-5000}; }},
        { label:'寻求心理咨询', hint:'+🧠 +❤️', fn: g => { g.flags.jobBurnout=true; g.flags.therapySeeker=true; return{intel:10,health:8,mood:10,money:-2000}; }},
        { label:'换工作', hint:'+😊 +✨ -💰', fn: g => { g.flags.jobBurnout=true; g.flags.jobChanger=true; setJob(g,'新工作',g.jobSalary*0.9); return{mood:20,charm:5,money:-3000}; }},
        { label:'硬撑', hint:'+💰 -❤️ -😊', fn: g => { g.flags.jobBurnout=true; return{money:2000,health:-15,mood:-20}; }},
      ]},
    // === v5.0 EVENTS - 单身经济与不婚主义 ===
    { id:'single_economy', icon:'💎', title:'单身经济',
      body:'你看了看数据：\n\n- 2024年结婚登记创47年新低\n- 中国单身人口超2.4亿\n- 单身经济规模逼近8万亿元\n\n你是一个人住，吃一人食，养一只猫/狗。\n\n"单身不是问题，单身是选择。"\n\n"比起孤独，这届年轻人更爱自由。"\n\n你的消费：Mini家电、一人食套餐、宠物陪伴、自我投资。\n\n"单身经济的核心：为自我愉悦、未来投资和情感寄托买单。"',
      cond: g => !g.flags.singleEconomy && g.age>=22 && g.age<=38 && !g.flags.married,
      choices:[
        { label:'享受单身生活', hint:'+😊 +✨ +💰', fn: g => { g.flags.singleEconomy=true; g.flags.singleAndHappy=true; return{mood:20,charm:10,money:3000}; }},
        { label:'买Mini家电', hint:'-💰 +😊', fn: g => { g.flags.singleEconomy=true; return{money:-3000,mood:12,charm:5}; }},
        { label:'养宠物陪伴', hint:'-💰 +😊 +❤️', fn: g => { g.flags.singleEconomy=true; g.flags.hasPet=true; return{money:-4000,mood:18,health:5}; }},
        { label:'投资自己', hint:'+🧠 +✨ -💰', fn: g => { g.flags.singleEconomy=true; g.flags.selfInvest=true; return{intel:15,charm:12,money:-8000}; }},
      ]},
    { id:'no_marriage', icon:'💍', title:'不婚主义',
      body:'你妈又催婚了：\n\n"你都30了，还不结婚？"\n"你看隔壁小王，孩子都上学了。"\n"你是不是有什么问题？"\n\n你沉默了。\n\n你不是不想结婚，你是：\n- 买不起房\n- 养不起孩子\n- 找不到合适的人\n- 或者，就是不想\n\n"不婚不是叛逆，是清醒。"\n\n"当代年轻人的婚姻观：不是不想要爱情，而是不想要将就。"',
      cond: g => !g.flags.noMarriage && g.age>=26 && g.age<=38 && !g.flags.married,
      choices:[
        { label:'坚持不婚', hint:'+😊 -👥', fn: g => { g.flags.noMarriage=true; g.flags.committedSingle=true; return{mood:18,social:-15,charm:5}; }},
        { label:'考虑冻卵/冻精', hint:'-💰 +🧠', fn: g => { g.flags.noMarriage=true; g.flags.fertilityPreserved=true; return{money:-30000,intel:8,mood:5}; }},
        { label:'跟父母谈谈', hint:'+👥 +😊', fn: g => { g.flags.noMarriage=true; g.flags.familyTalk=true; return{social:12,mood:10,intel:5}; }},
        { label:'算了，还是结吧', hint:'+👥 +😊 -✨', fn: g => { g.flags.noMarriage=true; return{social:10,mood:5,charm:-5}; }},
      ]},
    // === v5.1 EVENTS - 斜杠青年与副业 ===
    { id:'slash_youth', icon:'⚡', title:'斜杠青年',
      body:'你决定成为"斜杠青年"：\n\n主业：程序员 / 副业：影评写手 / 兴趣：摄影师\n\n你开始在平台接单：\n- 写影评：450元/篇\n- 做PPT：800元/份\n- 摄影接单：1500元/场\n\n数据：945万年轻人在平台发布副业服务，00后占40.8%。\n\n"斜杠青年——主业是生存，副业是生活。"\n\n"不是贪心，是想活得更丰富。"',
      cond: g => !g.flags.slashYouth && g.age>=20 && g.age<=35 && g.intel>=55,
      choices:[
        { label:'写网文/影评', hint:'+💰 +✨ +😊', fn: g => { g.flags.slashYouth=true; g.flags.writerSideHustle=true; return{money:3000,charm:10,mood:12,intel:8}; }},
        { label:'做设计接单', hint:'+💰 +🧠', fn: g => { g.flags.slashYouth=true; g.flags.designerSideHustle=true; return{money:5000,intel:10,charm:5}; }},
        { label:'摄影摄像', hint:'+💰 +✨', fn: g => { g.flags.slashYouth=true; g.flags.photographerSideHustle=true; return{money:4000,charm:12,mood:8}; }},
        { label:'职场咨询', hint:'+💰 +🧠 +👥', fn: g => { g.flags.slashYouth=true; g.flags.consultantSideHustle=true; return{money:6000,intel:12,social:8}; }},
      ]},
    { id:'side_hustle_fail', icon:'💔', title:'副业翻车',
      body:'你的副业翻车了：\n\n- 写了3个月网文，阅读量只有个位数\n- 接了5单设计，客户改了20次稿\n- 拍了10场照片，只收到2条好评\n\n"64.6%的斜杠青年表示副业收入不稳定。"\n\n你算了算：副业收入不到主业的20%，但占用了40%的休息时间。\n\n"副业不是捷径，是另一条需要坚持的路。"',
      cond: g => !g.flags.sideHustleFail && g.flags.slashYouth && Math.random()>0.6,
      choices:[
        { label:'坚持，总会好的', hint:'+🧠 +😊', fn: g => { g.flags.sideHustleFail=true; return{intel:10,mood:5,charm:3}; }},
        { label:'换个副业方向', hint:'+💰 +✨', fn: g => { g.flags.sideHustleFail=true; g.flags.sideHustlePivot=true; return{money:2000,charm:5,intel:5}; }},
        { label:'放弃，专注主业', hint:'+💰 +🧠', fn: g => { g.flags.sideHustleFail=true; return{money:3000,intel:8,mood:-5}; }},
        { label:'继续尝试新副业', hint:'+✨ +😊', fn: g => { g.flags.sideHustleFail=true; if(Math.random()>0.5){return{money:8000,mood:20,charm:10}}else{return{mood:-10,money:-1000}} }},
      ]},
    // === v5.2 EVENTS - 电子爸妈与虚拟亲情 ===
    { id:'digital_parents', icon:'👨‍👩‍👧', title:'电子爸妈',
      body:'你刷到一个视频：\n\n"女儿女儿，你那边热不热？"\n"爸爸妈妈对你永远就是支持，不需要你回报。"\n\n这是一对中年夫妇以父母视角拍的短视频。\n\n你看着看着，眼眶湿了。\n\n你想起了自己的爸妈：催婚、催工资、催买房。\n\n"电子爸妈——是年轻人对理想父母的想象，也是对现实亲情的补偿。"\n\n你在评论区写下："谢谢你，我的互联网妈妈。"',
      cond: g => !g.flags.digitalParents && g.age>=20 && g.age<=32,
      choices:[
        { label:'关注电子爸妈', hint:'+😊 +👥', fn: g => { g.flags.digitalParents=true; g.flags.emotionalSupport=true; return{mood:18,social:8}; }},
        { label:'发私信倾诉', hint:'+😊 +👥 +✨', fn: g => { g.flags.digitalParents=true; return{mood:15,social:12,charm:5}; }},
        { label:'学习他们的方式', hint:'+🧠 +✨ +👥', fn: g => { g.flags.digitalParents=true; g.flags.parentingLearner=true; return{intel:10,charm:8,social:10}; }},
        { label:'觉得太假了', hint:'+🧠', fn: g => { g.flags.digitalParents=true; return{intel:5,mood:-3}; }},
      ]},
    // === v5.3 EVENTS - Gap Year间隔年 ===
    { id:'gap_year', icon:'🌍', title:'Gap Year',
      body:'你决定Gap一年：\n\n辞职，旅行，放空，重新思考人生。\n\n但在中国，Gap Year不是"间隔年"，而是"空窗期"。\n\n面试官问："你这半年干嘛去了？"\n你说："调整状态。"\nHR心里想："能力不行被裁了吧。"\n\n"Gap一年比gay一年还严重——中国职场，不欢迎gap过的年轻人。"\n\n但你还是去了。因为你不想30岁时还在问自己："我这辈子到底想要什么？"',
      cond: g => !g.flags.gapYear && g.age>=23 && g.age<=32 && g.money>30000 && g.job!=='待业中',
      choices:[
        { label:'裸辞Gap一年', hint:'+😊 +🧠 +✨ -💰', fn: g => { g.flags.gapYear=true; g.flags.fullGapYear=true; setJob(g,'待业中',0); return{mood:30,intel:15,charm:12,money:-50000}; }},
        { label:'Gap半年', hint:'+😊 +🧠 -💰', fn: g => { g.flags.gapYear=true; g.flags.halfGapYear=true; setJob(g,'待业中',0); return{mood:20,intel:10,charm:8,money:-30000}; }},
        { label:'Gap Day（每周休息一天）', hint:'+😊 +❤️', fn: g => { g.flags.gapYear=true; g.flags.gapDay=true; return{mood:12,health:8}; }},
        { label:'算了，不敢Gap', hint:'+💰 -😊', fn: g => { g.flags.gapYear=true; return{money:2000,mood:-10}; }},
      ]},
    // === v5.4 EVENTS - 考研降温与学历贬值 ===
    { id:'postgrad_cooling', icon:'📚', title:'考研降温',
      body:'你看到了数据：\n\n- 2023年考研报名474万\n- 2024年降至438万\n- 2025年降至388万\n- 两年下降86万\n\n同时，考公人数屡创新高：2025年国考报名325万。\n\n"考研热降温——不是不想读研，是读研的性价比变低了。"\n\n"贬值的是学历，不是学习。真正的铁饭碗，是永不停止的学习力。"\n\n你开始思考：读研是为了什么？为了更好的工作？还是为了逃避就业？',
      cond: g => !g.flags.postgradCooling && g.age>=21 && g.age<=28,
      choices:[
        { label:'放弃考研，直接就业', hint:'+💰 +😊 +🧠', fn: g => { g.flags.postgradCooling=true; g.flags.skipPostgrad=true; return{money:5000,mood:12,intel:8}; }},
        { label:'转考公务员', hint:'+🧠 +💰', fn: g => { g.flags.postgradCooling=true; g.flags.civilServicePrep=true; return{intel:12,mood:5,money:-3000}; }},
        { label:'学一门手艺', hint:'+🧠 +✨ +💰', fn: g => { g.flags.postgradCooling=true; g.flags.skillLearner=true; return{intel:15,charm:10,money:-5000}; }},
        { label:'还是考研吧', hint:'+🧠 -😊 -💰', fn: g => { g.flags.postgradCooling=true; g.flags.persistPostgrad=true; return{intel:10,mood:-8,money:-8000}; }},
      ]},
    // === v5.5 EVENTS - 年轻人创业与咖啡店 ===
    { id:'young_entrepreneur', icon:'☕', title:'开咖啡店',
      body:'你看到了一个故事：\n\n90后女生辞职，把牛棚改成咖啡店，投入不到10万，年营收140万。\n\n你心动了。\n\n"投入5000元月入过万"——低成本咖啡馆创业成了年轻人的新梦想。\n\n但你又看到：很多咖啡馆刚开业就倒闭，博主卖课比卖咖啡多。\n\n"创业不是浪漫，是九死一生。"\n\n"成功的村咖背后，是99%失败的村咖。"',
      cond: g => !g.flags.youngEntrepreneur && g.age>=23 && g.age<=35 && g.money>20000,
      choices:[
        { label:'开一家咖啡店', hint:'-💰 +✨ +😊 🎲', fn: g => { g.flags.youngEntrepreneur=true; g.flags.coffeeShopOwner=true; if(Math.random()>0.4){return{money:-80000,charm:20,mood:25,social:15}}else{return{money:-100000,mood:-20,charm:-5}} }},
        { label:'做自媒体创业', hint:'-💰 +✨ +😊', fn: g => { g.flags.youngEntrepreneur=true; g.flags.mediaEntrepreneur=true; return{money:-10000,charm:15,mood:18,intel:10}; }},
        { label:'加盟奶茶店', hint:'-💰 +💰 🎲', fn: g => { g.flags.youngEntrepreneur=true; if(Math.random()>0.5){return{money:50000,mood:20}}else{return{money:-60000,mood:-15}} }},
        { label:'算了，风险太大', hint:'+💰 +🧠', fn: g => { g.flags.youngEntrepreneur=true; return{money:5000,intel:5,mood:-3}; }},
      ]},
    // === v5.6 EVENTS - 数字游民与远程工作 ===
    { id:'digital_nomad', icon:'🌏', title:'数字游民',
      body:'你辞职了，成为数字游民：\n\n- 大理（2个月）：程序员天堂，便宜又美\n- 清迈（3个月）：数字游民聚集地\n- 巴厘岛（1个月）：网络一般但环境好\n- 厦门（2个月）：国内最宜居的海滨城市\n- 成都（4个月）：美食太多，不想走\n\n月均收入：12000元（比上班少，但生活质量大幅提升）\n\n"数字游民——用互联网获取在线工作机会，不在固定地区工作。"\n\n"最大的挑战：孤独感、自律、时区问题。"\n\n"最棒的体验：想去哪就去哪的自由感。"',
      cond: g => !g.flags.digitalNomad && g.age>=23 && g.age<=35 && g.intel>=60 && g.money>20000,
      choices:[
        { label:'去大理', hint:'-💰 +😊 +✨', fn: g => { g.flags.digitalNomad=true; g.flags.daliNomad=true; setJob(g,'数字游民',12000); return{money:-10000,mood:25,charm:15,intel:10}; }},
        { label:'去清迈', hint:'-💰 +😊 +✨', fn: g => { g.flags.digitalNomad=true; g.flags.chiangMaiNomad=true; setJob(g,'数字游民',12000); return{money:-15000,mood:28,charm:18,intel:12}; }},
        { label:'去成都', hint:'-💰 +😊 +✨', fn: g => { g.flags.digitalNomad=true; g.flags.chengduNomad=true; setJob(g,'数字游民',12000); return{money:-8000,mood:22,charm:12,intel:8}; }},
        { label:'算了，还是上班吧', hint:'+💰 +😊', fn: g => { g.flags.digitalNomad=true; return{money:3000,mood:5}; }},
      ]},
    // === v5.7 EVENTS - 年轻人存钱与理财 ===
    { id:'savings_challenge', icon:'💰', title:'存钱挑战',
      body:'你开始存钱：\n\n- 365天存钱表：每天存钱就画上一格\n- 12存单法：每月存一张一年期存单\n- 对赌存钱法：和朋友约定，不存就罚款\n- 找存钱搭子：互相监督\n\n"从买买买到攒攒攒——当代年轻人开始热衷存钱。"\n\n数据：64.1%的年轻人以储蓄为主要理财方式。\n\n你甚至成了"存款特种兵"：为了3.9%的年利率，坐飞机去广东存钱。\n\n"存钱不是抠门，是对未来的投资。"',
      cond: g => !g.flags.savingsChallenge && g.age>=22 && g.age<=35 && g.money>10000,
      choices:[
        { label:'开始365天存钱', hint:'+💰 +😊 +🧠', fn: g => { g.flags.savingsChallenge=true; g.flags.dailySaver=true; return{money:20000,mood:15,intel:8}; }},
        { label:'找存钱搭子', hint:'+💰 +👥 +😊', fn: g => { g.flags.savingsChallenge=true; g.flags.savingsPartner=true; return{money:15000,social:12,mood:12}; }},
        { label:'存款特种兵', hint:'+💰 +✨', fn: g => { g.flags.savingsChallenge=true; g.flags.depositCommando=true; return{money:50000,charm:8,intel:10}; }},
        { label:'算了，钱是赚出来的', hint:'+😊 -💰', fn: g => { g.flags.savingsChallenge=true; return{mood:5,money:-3000}; }},
      ]},
    // === v5.8 EVENTS - 阳台种菜与养植物 ===
    { id:'balcony_garden', icon:'🌱', title:'阳台种菜',
      body:'你开始在阳台种菜：\n\n- 番茄、黄瓜、生菜\n- 蓝莓、草莓、柠檬\n- 小葱、香菜、辣椒\n\n数据：绿植消费增长160%，种植盆栽增长1200%。\n\n有店铺"盆栽蔬菜"销量超60万件。\n\n"阳台种菜——自产自销，实现「蓝莓自由」。"\n\n"没有土地也压抑不了我的种菜基因。"\n\n你在小红书分享：《出租党必收的10款懒人蔬菜清单》，获得5000+点赞。',
      cond: g => !g.flags.balconyGarden && g.age>=22 && g.age<=38,
      choices:[
        { label:'种蓝莓', hint:'-💰 +😊 +❤️', fn: g => { g.flags.balconyGarden=true; g.flags.blueberryGrower=true; return{money:-200,mood:15,health:8}; }},
        { label:'种蔬菜', hint:'-💰 +😊 +❤️', fn: g => { g.flags.balconyGarden=true; g.flags.veggieGrower=true; return{money:-100,mood:12,health:10}; }},
        { label:'发小红书分享', hint:'+✨ +👥 +😊', fn: g => { g.flags.balconyGarden=true; g.flags.gardenBlogger=true; return{charm:12,social:15,mood:18}; }},
        { label:'算了，没时间打理', hint:'+😊', fn: g => { g.flags.balconyGarden=true; return{mood:3}; }},
      ]},
    // === v5.9 EVENTS - 汉服与国潮文化 ===
    { id:'hanfu_culture', icon:'👘', title:'汉服体验',
      body:'你在三坊七巷的国潮旅拍店，换上了汉服：\n\n- 宋制珍珠三白造型\n- 小唐风\n- 战国袍\n- 三条簪\n\n化妆师的巧手下，你显露出跨越时空的东方韵味。\n\n2025年，中国汉服市场规模有望达191.1亿元。\n\n"国潮文化——Z世代的文化自信，传统文化符号融入日常。"\n\n"穿上汉服，不是cosplay，是文化认同。"',
      cond: g => !g.flags.hanfuCulture && g.age>=18 && g.age<=35,
      choices:[
        { label:'买一套汉服', hint:'-💰 +✨ +😊', fn: g => { g.flags.hanfuCulture=true; g.flags.hanfuCollector=true; return{money:-3000,charm:18,mood:20}; }},
        { label:'参加汉服活动', hint:'+👥 +✨ +😊', fn: g => { g.flags.hanfuCulture=true; g.flags.hanfuCommunity=true; return{social:15,charm:12,mood:15}; }},
        { label:'拍汉服写真', hint:'-💰 +✨ +😊', fn: g => { g.flags.hanfuCulture=true; return{money:-2000,charm:15,mood:18}; }},
        { label:'了解一下就好', hint:'+🧠 +😊', fn: g => { g.flags.hanfuCulture=true; return{intel:8,mood:8}; }},
      ]},
    // === v6.0 EVENTS - 寺庙与佛系青年 ===
    { id:'temple_visit', icon:'🏯', title:'去寺庙',
      body:'你去了雍和宫，挤满了烧香拜佛的年轻人。\n\n"在上班和上进之间，选择了上香。"\n\n你求了个签：中吉。\n\n法师说："佛学不是逃避，是觉悟。从生活中谈觉悟，才是修行。"\n\n"年轻人涌入寺庙，不是迷信，是在不确定性中寻找确定性。"\n\n"把希望寄托在佛祖身上，至少能把不确定的压力转移出去。"\n\n你花了200元买了手串，开了光。',
      cond: g => !g.flags.templeVisit && g.age>=22 && g.age<=35 && g.mood<70,
      choices:[
        { label:'认真拜佛', hint:'+😊 +🧠 +❤️', fn: g => { g.flags.templeVisit=true; g.flags.buddhistPractice=true; return{mood:20,intel:10,health:5}; }},
        { label:'买开光手串', hint:'-💰 +✨ +😊', fn: g => { g.flags.templeVisit=true; return{money:-200,charm:10,mood:15}; }},
        { label:'当义工', hint:'+😊 +🧠 +👥', fn: g => { g.flags.templeVisit=true; g.flags.templeVolunteer=true; return{mood:25,intel:12,social:10}; }},
        { label:'只是看看', hint:'+🧠 +😊', fn: g => { g.flags.templeVisit=true; return{intel:8,mood:8}; }},
      ]},
    // === v6.1 EVENTS - Citywalk城市漫步 ===
    { id:'citywalk', icon:'🚶', title:'Citywalk',
      body:'你加入了Citywalk小组：\n\n主题：美食、建筑、历史\n\n路线：荣巷老街 → 梁溪河十里画廊 → 华晶新村\n\n"Citywalk——不是走过路过，而是深入观察。"\n\n"在数字化生存的时代，年轻人反而更渴望与城市建立真实的连接。"\n\n你发现了一家隐藏的老店，老板的故事让你感动。\n\n"城市漫步，是对抗城市同质化的独特体验。"',
      cond: g => !g.flags.citywalk && g.age>=20 && g.age<=35,
      choices:[
        { label:'参加主题Citywalk', hint:'+😊 +👥 +✨', fn: g => { g.flags.citywalk=true; g.flags.citywalkGroup=true; return{mood:18,social:15,charm:8}; }},
        { label:'自己规划路线', hint:'+🧠 +😊 +✨', fn: g => { g.flags.citywalk=true; g.flags.citywalkPlanner=true; return{intel:12,mood:15,charm:10}; }},
        { label:'写漫游指南', hint:'+✨ +🧠 +😊', fn: g => { g.flags.citywalk=true; g.flags.citywalkWriter=true; return{charm:15,intel:12,mood:18}; }},
        { label:'拍照发小红书', hint:'+✨ +👥 +😊', fn: g => { g.flags.citywalk=true; g.flags.citywalkPhotographer=true; return{charm:12,social:12,mood:15}; }},
      ]},
    // === v6.2 EVENTS - 剧本杀与密室逃脱 ===
    { id:'murder_mystery', icon:'🎭', title:'剧本杀',
      body:'朋友拉你去玩剧本杀："来吗？6人本，差一个。"\n\n你看了看价格：128元/人，4小时。\n\n"剧本杀——当代年轻人的「角色扮演」，花128块钱体验另一种人生。"\n\n你抽到的角色：民国时期的富家千金，卷入一桩谋杀案。\n\n4小时后，你发现：你演得比上班还认真。同事说："你刚才的表情，比年终汇报精彩多了。"\n\n2025年，中国沉浸式娱乐市场规模突破200亿元，剧本杀门店超过3万家。\n\n"我们不是逃避现实，而是在游戏中找到现实中没有的体验——推理、表演、社交。"',
      cond: g => !g.flags.murderMystery && g.age>=18 && g.age<=35,
      choices:[
        { label:'参加6人本', hint:'-💰 +😊 +👥', fn: g => { g.flags.murderMystery=true; g.flags.murderMysteryPlayer=true; return{money:-128,mood:20,social:15}; }},
        { label:'玩硬核推理本', hint:'-💰 +🧠 +😊', fn: g => { g.flags.murderMystery=true; g.flags.detectiveFan=true; return{money:-158,intel:15,mood:18}; }},
        { label:'当DM（主持人）', hint:'-💰 +✨ +👥', fn: g => { g.flags.murderMystery=true; g.flags.dmRole=true; return{money:-80,charm:15,social:12,mood:15}; }},
        { label:'太贵了，不玩', hint:'+💰', fn: g => { g.flags.murderMystery=true; return{mood:-5}; }},
      ]},
    { id:'escape_room', icon:'🔐', title:'密室逃脱',
      body:'你和朋友去密室逃脱：恐怖主题，198元/人。\n\n进去前，你说："我不怕鬼。"\n\n进去后，你发现：你不仅怕鬼，还怕黑、怕封闭空间、怕突然出现的NPC。\n\n你的表现：全程尖叫，抱住朋友不撒手，最后被NPC"请"出了密室。\n\n"密室逃脱——花钱买惊吓，当代年轻人的「受虐」消费。"\n\n但你也体验到了：团队合作、解谜的成就感、肾上腺素飙升的快感。\n\n安全隐患频出：消防通道被锁、紧急出口找不到、玩家被困。\n\n"200亿市场野蛮生长，安全不能「逃脱」。"',
      cond: g => !g.flags.escapeRoom && g.age>=18 && g.age<=30,
      choices:[
        { label:'挑战恐怖主题', hint:'-💰 +😊 +❤️', fn: g => { g.flags.escapeRoom=true; g.flags.horrorFan=true; return{money:-198,mood:22,health:-3,charm:5}; }},
        { label:'选解谜主题', hint:'-💰 +🧠 +😊', fn: g => { g.flags.escapeRoom=true; g.flags.puzzleMaster=true; return{money:-168,intel:18,mood:20}; }},
        { label:'组队竞技模式', hint:'-💰 +👥 +😊', fn: g => { g.flags.escapeRoom=true; g.flags.teamPlayer=true; return{money:-188,social:18,mood:15}; }},
        { label:'看别人玩直播', hint:'+😊', fn: g => { g.flags.escapeRoom=true; return{mood:8}; }},
      ]},
    { id:'immersive_theater', icon:'🎪', title:'沉浸式演出',
      body:'你抢到一张沉浸式演出的票：580元。\n\n《不眠之夜》——你在5层楼的老建筑里自由探索，演员就在你身边表演。\n\n你可以：跟随主角、偷听对话、打开抽屉、翻阅信件。\n\n"沉浸式演出——观众不再是观众，而是故事的一部分。"\n\n你遇到了其他观众：有人cosplay，有人拍照，有人真的在看戏。\n\n你突然理解：这不就是高级版的剧本杀吗？只不过，你是观众，也是演员。\n\n"从剧本杀到沉浸式演出，年轻人追求的不是娱乐，而是「参与感」和「在场感」。"',
      cond: g => !g.flags.immersiveTheater && g.age>=22 && g.age<=35 && g.money>=1000,
      choices:[
        { label:'深度体验剧情', hint:'-💰 +😊 +🧠', fn: g => { g.flags.immersiveTheater=true; g.flags.theaterExplorer=true; return{money:-580,mood:25,intel:12}; }},
        { label:'写剧评发豆瓣', hint:'-💰 +✨ +🧠', fn: g => { g.flags.immersiveTheater=true; g.flags.theaterCritic=true; return{money:-580,charm:15,intel:10,mood:18}; }},
        { label:'二刷三刷', hint:'-💰💰 +😊', fn: g => { g.flags.immersiveTheater=true; g.flags.theaterFan=true; return{money:-1500,mood:30}; }},
        { label:'太贵了，看评价就好', hint:'+🧠', fn: g => { g.flags.immersiveTheater=true; return{intel:3,mood:5}; }},
      ]},
    // === v6.3 EVENTS - 直播带货与新能源汽车 ===
    { id:'livestream_shopping', icon:'📱', title:'直播带货',
      body:'你刷到一个直播间：某网红正在带货一款"原价1999，直播间只要299"的美容仪。\n\n弹幕："家人们，最后100单！"\n\n你犹豫了。然后你看到新闻：某头部主播带货翻车，假燕窝、假牛肉、虚假宣传，面临26.9亿赔偿。\n\n"直播带货——从「家人们」到「韭菜们」，只需要一场翻车。"\n\n2025年，直播电商人均年消费7968元，但增速从118%跌至6%。\n\n数据造假、虚假宣传、售后维权难——直播间里的"繁荣"，背后是无数消费者的血泪。\n\n"你以为你是家人，其实你是数据；你以为你在捡便宜，其实你在交智商税。"',
      cond: g => !g.flags.livestreamShopping && g.age>=18 && g.age<=40,
      choices:[
        { label:'冲动下单', hint:'-💰 +😊', fn: g => { g.flags.livestreamShopping=true; g.flags.impulseBuyer=true; return{money:-500,mood:10}; }},
        { label:'做功课再买', hint:'+🧠 -💰', fn: g => { g.flags.livestreamShopping=true; g.flags.smartConsumer=true; return{intel:8,money:-300,mood:5}; }},
        { label:'自己开直播', hint:'-💰 +✨ +💰', fn: g => { g.flags.livestreamShopping=true; g.flags.streamer=true; if(Math.random()>0.6){return{money:5000,charm:15,social:10}}else{return{money:-2000,mood:-10}} }},
        { label:'坚决不买', hint:'+🧠 +💰', fn: g => { g.flags.livestreamShopping=true; return{intel:5,money:200,mood:-3}; }},
      ]},
    { id:'new_energy_car', icon:'🚗', title:'新能源汽车',
      body:'你考虑买车：燃油车还是新能源？\n\n同事说："现在谁还买油车？新能源渗透率都突破50%了！"\n\n你看了看数据：2025年中国新能源车销量1578万辆，26-45岁年轻人占65%。\n\n小米SU7、比亚迪、特斯拉、理想——每个品牌都有自己的粉丝。\n\n"新能源汽车不只是交通工具，更是「移动的智能终端」——能聊天、能看剧、能自动驾驶。"\n\n但你也看到了问题：续航焦虑、充电桩不足、电池衰减、二手车贬值。\n\n"买新能源是「真香」还是「真坑」？取决于你的通勤距离和钱包厚度。"\n\nZ世代的态度：70%认为400-500公里续航够用，30%愿为智能驾驶多付1万元。',
      cond: g => !g.flags.newEnergyCar && g.age>=22 && g.age<=40 && g.money>=30000,
      choices:[
        { label:'买入门级（5-10万）', hint:'-💰💰 +😊 +✨', fn: g => { g.flags.newEnergyCar=true; g.flags.budgetEV=true; return{money:-80000,mood:20,charm:8}; }},
        { label:'买中端（15-25万）', hint:'-💰💰💰 +😊 +✨', fn: g => { g.flags.newEnergyCar=true; g.flags.midRangeEV=true; return{money:-200000,mood:25,charm:12}; }},
        { label:'买高端（30万+）', hint:'-💰💰💰💰 +😊 +✨', fn: g => { g.flags.newEnergyCar=true; g.flags.luxuryEV=true; return{money:-350000,mood:30,charm:18}; }},
        { label:'继续坐地铁', hint:'+💰 +🧠', fn: g => { g.flags.newEnergyCar=true; g.flags.publicTransit=true; return{money:5000,intel:3,mood:-5}; }},
      ]},
    { id:'smart_driving', icon:'🤖', title:'智能驾驶',
      body:'你试驾了一辆搭载城市NOA（自动辅助导航驾驶）的新能源车。\n\n车自己变道、超车、识别红绿灯、避让行人。你的手放在方向盘上，但心已经飞了。\n\n"智能驾驶——让开车从「技能」变成「监督」，人类司机正在成为「安全员」。"\n\n销售说："我们的L2+级智驾，10万块的车也能用！"\n\n你看了看新闻：某品牌智驾系统识别不了白色货车，发生碰撞。某车主过度依赖智驾，睡着了。\n\n"技术很美好，但生命不能「辅助」——方向盘后面，永远是责任。"\n\n2025年，L2级辅助驾驶渗透率突破50%，但事故责任认定仍是灰色地带。',
      cond: g => !g.flags.smartDriving && g.age>=22 && g.age<=45 && g.flags.newEnergyCar,
      choices:[
        { label:'深度体验智驾', hint:'+🧠 +😊', fn: g => { g.flags.smartDriving=true; g.flags.techEnthusiast=true; return{intel:12,mood:18}; }},
        { label:'谨慎使用', hint:'+🧠', fn: g => { g.flags.smartDriving=true; g.flags.safeDriver=true; return{intel:8,mood:5}; }},
        { label:'研究技术原理', hint:'+🧠 +✨', fn: g => { g.flags.smartDriving=true; g.flags.aiResearcher=true; return{intel:15,charm:8}; }},
        { label:'不敢用', hint:'+🧠', fn: g => { g.flags.smartDriving=true; return{intel:3,mood:-5}; }},
      ]},
    // === v6.4 EVENTS - 房地产与人口危机 ===
    { id:'housing_dilemma', icon:'🏠', title:'买房还是租房',
      body:'你在考虑买房。看了下房价：一线城市均价6万/㎡，二线城市3万/㎡。\n\n然后你看了下自己的存款：8万。\n\n同事说："现在谁还买房？房价还在跌呢！"\n\n数据：2025年30个重点城市二手房成交面积创5年新高，但新房交易在下降。三线城市房价环比下降0.4%。\n\n"房价还没跌到位，租金太低、房价太贵，继续买不划算，不如先租。"\n\n你算了笔账：同样地段的房子，月租4000，月供12000。租房30年的钱，够买半套房。\n\n但房东随时可能赶你走，你的东西永远在箱子里。\n\n"买房是「长期投资」，租房是「短期自由」——你选哪个？"',
      cond: g => !g.flags.housingDilemma && g.age>=25 && g.age<=40 && !g.flags.hasHouse,
      choices:[
        { label:'咬牙买房', hint:'-💰💰💰💰 +🏠', fn: g => { g.flags.housingDilemma=true; g.flags.hasHouse=true; if(Math.random()>0.6){return{money:-500000,mood:15,charm:10}}else{return{money:-500000,mood:-10}} }},
        { label:'继续租房', hint:'+💰 +😊', fn: g => { g.flags.housingDilemma=true; g.flags.renter=true; return{money:-2000,mood:8,intel:3}; }},
        { label:'回老家买', hint:'-💰💰 +🏠 +😊', fn: g => { g.flags.housingDilemma=true; g.flags.hasHouse=true; g.flags.returnedHometown=true; return{money:-150000,mood:12,social:8}; }},
        { label:'躺平，不考虑', hint:'+😊', fn: g => { g.flags.housingDilemma=true; return{mood:5}; }},
      ]},
    { id:'population_crisis', icon:'👶', title:'不婚不育保平安',
      body:'春节回家，亲戚问："什么时候结婚？什么时候生孩子？"\n\n你看了看数据：2025年中国出生人口792万，连续3年负增长。结婚登记676万对，较2013年历史高点下降50%。\n\n"不婚不育保平安，单身保长寿。"\n\n你的理由：\n- 房价太高，养不起\n- 996太累，没时间\n- 教育内卷，卷不起\n- 自己还是个孩子，怎么养孩子\n\n"60年代是传统的一代，70、80年代是转型的一代，90、00后不向往结婚生育，向往独立、自由、享受。"\n\n但你也看到了问题：2025年60岁以上人口占比23%，老龄化加速。未来谁来养老？谁来工作？',
      cond: g => !g.flags.populationCrisis && g.age>=25 && g.age<=35 && !g.flags.married,
      choices:[
        { label:'坚持不婚', hint:'+💰 +😊', fn: g => { g.flags.populationCrisis=true; g.flags.singleForever=true; return{money:5000,mood:10,intel:5}; }},
        { label:'考虑结婚', hint:'-💰 +👥 +😊', fn: g => { g.flags.populationCrisis=true; return{money:-3000,social:12,mood:8}; }},
        { label:'养宠物代替', hint:'-💰 +😊 +❤️', fn: g => { g.flags.populationCrisis=true; g.flags.hasPet=true; return{money:-2000,mood:15,health:5}; }},
        { label:'顺其自然', hint:'+😊', fn: g => { g.flags.populationCrisis=true; return{mood:3}; }},
      ]},
    { id:'silver_economy', icon:'👴', title:'银发经济',
      body:'你发现了一个商机：中国60岁以上人口已达3.2亿，占比23%。\n\n预计到2050年，老年人口消费将占GDP的21%。\n\n"银发经济——从保健品到养老服务，从广场舞到老年大学，这是一个万亿级市场。"\n\n你看到了各种机会：\n- 智能养老设备（健康监测、紧急呼叫）\n- 老年旅游（夕阳红旅行团）\n- 老年教育（书法、绘画、摄影）\n- 养老服务（居家护理、社区养老）\n\n"我们前面享受了多大的人口红利，后面就要背负多大的老龄化负担。"\n\n但你也看到了风险：老年人消费谨慎、市场监管严格、回报周期长。',
      cond: g => !g.flags.silverEconomy && g.age>=25 && g.age<=45 && g.intel>=60,
      choices:[
        { label:'创业做养老服务', hint:'-💰💰 +💰 +✨', fn: g => { g.flags.silverEconomy=true; g.flags.elderCareEntrepreneur=true; if(Math.random()>0.5){return{money:80000,charm:15,social:10}}else{return{money:-30000,mood:-10}} }},
        { label:'开发老年App', hint:'-💰 +🧠 +✨', fn: g => { g.flags.silverEconomy=true; g.flags.techEntrepreneur=true; return{money:-5000,intel:12,charm:8}; }},
        { label:'投资养老产业', hint:'-💰💰 💰', fn: g => { g.flags.silverEconomy=true; if(Math.random()>0.5){return{money:50000}}else{return{money:-20000}} }},
        { label:'太复杂，不碰', hint:'+🧠', fn: g => { g.flags.silverEconomy=true; return{intel:3}; }},
      ]},
    // === v6.5 EVENTS - 数字游民与考公热 ===
    { id:'digital_nomad', icon:'💻', title:'数字游民',
      body:'你厌倦了朝九晚五的通勤生活，看到了一个数字游民社区：安徽黟县"黑多岛"。\n\n"工作但不上班，边休闲边挣钱。"\n\n你辞了职，搬到山水间。你的工位：咖啡馆、民宿、共享办公空间。\n\n你的工作：远程编程、自由撰稿、设计接单、新媒体运营。\n\n"数字游民——把工位搬进山水间，利用现代信息技术进行远程工作，追求自由、灵活的生活方式。"\n\n2025年，全球超过34%的员工长期处于远程办公状态。中国也涌现出安吉DNA数字游民公社、上海漕泾数字游民国际村等实体空间。\n\n但你也看到了问题：收入不稳定、社交孤立、自律要求高、没有五险一金。\n\n"数字游民不是不工作，而是换一种方式工作——自由是代价，也是收获。"',
      cond: g => !g.flags.digitalNomad && g.age>=22 && g.age<=35 && g.intel>=60,
      choices:[
        { label:'辞职做数字游民', hint:'-💰 +😊 +✨', fn: g => { g.flags.digitalNomad=true; g.flags.freelancer=true; if(Math.random()>0.5){return{money:-5000,mood:25,charm:12,intel:8}}else{return{money:-10000,mood:10}} }},
        { label:'先兼职试试', hint:'+💰 +😊', fn: g => { g.flags.digitalNomad=true; g.flags.sideHustler=true; return{money:3000,mood:15,intel:5}; }},
        { label:'加入游民社区', hint:'-💰 +👥 +😊', fn: g => { g.flags.digitalNomad=true; g.flags.communityMember=true; return{money:-2000,social:18,mood:20}; }},
        { label:'太不稳定，算了', hint:'+🧠', fn: g => { g.flags.digitalNomad=true; return{intel:3,mood:-5}; }},
      ]},
    { id:'civil_service_exam', icon:'📋', title:'考公上岸',
      body:'你决定考公务员。看了看数据：2025年国考报名341.6万人，竞争比86:1，录取率仅1.35%。\n\n"考公热——从「下海潮」到「考公热」，30年间，年轻人的选择从「敢闯敢试」变成「避险求稳」。"\n\n你的备考：\n- 行测：言语理解、数量关系、判断推理、资料分析\n- 申论：阅读理解、综合分析、提出对策、贯彻执行、大作文\n- 面试：结构化面试、无领导小组讨论\n\n"体制内的岗位终究有限，唯有市场的舞台才广阔无边。"\n\n但你看到了现实：经济下行、就业压力大、35岁危机、996加班文化。公务员虽然工资不高，但有五险一金、稳定、不裁员。\n\n"考公不是躺平，而是在不确定的时代，寻找确定性。"',
      cond: g => !g.flags.civilServiceExam && g.age>=22 && g.age<=35 && g.intel>=50,
      choices:[
        { label:'全职备考一年', hint:'-💰 +🧠', fn: g => { g.flags.civilServiceExam=true; if(Math.random()>0.85){g.flags.civilServant=true; return{money:-20000,intel:15,mood:30,charm:10}}else{return{money:-20000,intel:10,mood:-15}} }},
        { label:'在职备考', hint:'+🧠 -😊', fn: g => { g.flags.civilServiceExam=true; if(Math.random()>0.9){g.flags.civilServant=true; return{intel:8,mood:20}}else{return{intel:5,mood:-10,health:-5}} }},
        { label:'考事业编', hint:'+🧠', fn: g => { g.flags.civilServiceExam=true; if(Math.random()>0.8){g.flags.civilServant=true; return{intel:8,mood:25,charm:5}}else{return{intel:5,mood:-8}} }},
        { label:'放弃考公', hint:'+😊', fn: g => { g.flags.civilServiceExam=true; return{mood:5,intel:-3}; }},
      ]},
    { id:'second_career', icon:'🔄', title:'二战三战',
      body:'你第一次考公失败了。排名86:1，你是那85个分母之一。\n\n你犹豫：要不要二战？三战？\n\n"考公是一场录取率极低的「锦标赛」。超过95%的人会成为「分母」，每一次失败都是时间和金钱的沉没成本。"\n\n你看了看自己：25岁，简历空白，同龄人已经工作3年了。\n\n如果继续考，你可能错过职业技能的"黄金窗口期"。如果放弃，你的备考时间全部浪费。\n\n"早期劣势会像「疤痕」一样，在考公失败人群的整个职业生涯中持续存在。"\n\n但你不甘心：已经投入了这么多，再试一次也许就上岸了？',
      cond: g => !g.flags.secondCareer && g.flags.civilServiceExam && !g.flags.civilServant && g.age>=23 && g.age<=35,
      choices:[
        { label:'二战！再考一年', hint:'-💰 +🧠', fn: g => { g.flags.secondCareer=true; if(Math.random()>0.8){g.flags.civilServant=true; return{money:-15000,intel:10,mood:25}}else{return{money:-15000,intel:5,mood:-20}} }},
        { label:'边工作边考', hint:'+💰 +🧠 -😊', fn: g => { g.flags.secondCareer=true; if(Math.random()>0.85){g.flags.civilServant=true; return{money:5000,intel:8,mood:15}}else{return{money:5000,intel:3,mood:-10,health:-5}} }},
        { label:'放弃，找工作', hint:'+💰 +😊', fn: g => { g.flags.secondCareer=true; g.flags.backToJobMarket=true; return{money:8000,mood:10,intel:-3}; }},
        { label:'考其他编制', hint:'+🧠', fn: g => { g.flags.secondCareer=true; if(Math.random()>0.75){g.flags.civilServant=true; return{intel:8,mood:20}}else{return{intel:3,mood:-5}} }},
      ]},
    // === v6.6 EVENTS - 副业经济与消费降级 ===
    { id:'side_hustle', icon:'💼', title:'斜杠青年',
      body:'你觉得光靠工资不够花，决定搞副业。\n\n你看了看选项：\n- 写稿：影评、剧评、文案，每月2000-3000元\n- 摆摊：校门口卖甜品、首饰，每晚18:30出摊\n- 代运营：帮人管小红书、抖音，每月3000-5000元\n- 拍照：汉服跟拍、景区跟拍，每单200-500元\n- 领队：周末组织飞盘、徒步、露营\n\n"斜杠青年——主业也好，副业也罢，只要能搞钱，都是通往自由的台阶。"\n\n2024年，全国945.4万年轻人在平台发布副业服务，其中"00后"占比40.8%。\n\n"没事早点睡，有空多搞钱——这届年轻人不爱聊八卦，爱聊副业。"\n\n但你也看到了问题：时间精力有限、副业影响主业、收入不稳定、没有五险一金。',
      cond: g => !g.flags.sideHustle && g.age>=22 && g.age<=35 && g.money<50000,
      choices:[
        { label:'写稿变现', hint:'+💰 +🧠', fn: g => { g.flags.sideHustle=true; g.flags.writer=true; return{money:2500,intel:8,mood:5}; }},
        { label:'摆摊创业', hint:'+💰 +✨', fn: g => { g.flags.sideHustle=true; g.flags.streetVendor=true; if(Math.random()>0.6){return{money:4000,charm:10,social:8}}else{return{money:500,mood:-5}} }},
        { label:'技能接单', hint:'+💰 +🧠', fn: g => { g.flags.sideHustle=true; g.flags.freelancer=true; return{money:3500,intel:10,mood:8}; }},
        { label:'太累了，不搞', hint:'+😊', fn: g => { g.flags.sideHustle=true; return{mood:5,health:3}; }},
      ]},
    { id:'consumption_downgrade', icon:'📉', title:'消费降级',
      body:'你开始反思自己的消费习惯：\n\n- 以前：星巴克38元/杯 → 现在：瑞幸9.9元/杯\n- 以前：优衣库300元/件 → 现在：拼多多30元/件\n- 以前：海底捞150元/人 → 现在：沙县小吃15元/人\n- 以前：专柜护肤品 → 现在：平替国货\n\n"消费降级——不是买不起，而是不想被收割。"\n\n豆瓣"抠门女性联合会"小组突破300万成员，B站"极简生活"视频播放量破50亿次。\n\n2025年，57.2%的消费者更偏爱性价比更高的替代商品，"90后""00后"尤为明显。\n\n"曾经的「面子消费」转向「里子经济」，年轻人不再为品牌溢价买单。"\n\n但你也在思考：消费降级是真的穷了，还是消费观念升级了？',
      cond: g => !g.flags.consumptionDowngrade && g.age>=20 && g.age<=35,
      choices:[
        { label:'全面降级', hint:'+💰 +🧠', fn: g => { g.flags.consumptionDowngrade=true; g.flags.frugal=true; return{money:5000,intel:8,mood:-5}; }},
        { label:'只买平替', hint:'+💰 +😊', fn: g => { g.flags.consumptionDowngrade=true; g.flags.pingti=true; return{money:3000,mood:8}; }},
        { label:'极简生活', hint:'+💰 +🧠 +😊', fn: g => { g.flags.consumptionDowngrade=true; g.flags.minimalist=true; return{money:8000,intel:10,mood:12}; }},
        { label:'该花还花', hint:'-💰 +😊', fn: g => { g.flags.consumptionDowngrade=true; return{money:-2000,mood:10}; }},
      ]},
    { id:'pingti_culture', icon:'🔄', title:'平替文化',
      body:'你发现了一个"平替"好物：某国货护肤品，成分和大牌一样，价格只有1/5。\n\n你发了条小红书："大牌平替，真香！"\n\n"平替文化——不是买不起大牌，而是不想交智商税。"\n\n2025年，奢侈品市场放缓，近半数消费者认为品牌价格虚高。\n\n"质价比"取代"品牌迷信"，"价值导向"消费模式成为主流。\n\n年轻人认同的"奢侈"不再等于大件消费，而是能提供"幸福感"的自我犒赏。\n\n"真正的奢侈不是标价后面的零的个数，而是让足够多的人享有超越期待的美学体验。"\n\n但你也看到了问题：平替质量参差不齐、知识产权争议、"高质仿款"的法律灰色地带。',
      cond: g => !g.flags.pingtiCulture && g.age>=18 && g.age<=35 && g.flags.consumptionDowngrade,
      choices:[
        { label:'做平替测评博主', hint:'+💰 +✨ +🧠', fn: g => { g.flags.pingtiCulture=true; g.flags.reviewBlogger=true; if(Math.random()>0.5){return{money:5000,charm:15,intel:8}}else{return{money:1000,charm:8,intel:5}} }},
        { label:'只买国货', hint:'+💰 +😊', fn: g => { g.flags.pingtiCulture=true; g.flags.domesticBrand=true; return{money:2000,mood:10}; }},
        { label:'二手奢侈品', hint:'+✨ +😊', fn: g => { g.flags.pingtiCulture=true; g.flags.secondHand=true; return{money:-3000,charm:12,mood:8}; }},
        { label:'还是买大牌', hint:'-💰 +✨', fn: g => { g.flags.pingtiCulture=true; return{money:-8000,charm:8,mood:5}; }},
      ]},
    // === v6.7 EVENTS - AI创作与一人公司 ===
    { id:'ai_creation', icon:'🤖', title:'AI创作',
      body:'你发现了一个副业机会：用AI绘画做治愈系插画。\n\n案例：某职场人用豆包AI做插画，副业收入超20万，全网涨粉13万。\n\n"AI创作——让普通人也能成为艺术家，让副业变现变得更容易。"\n\n你试了试：\n- AI绘画：Midjourney、Stable Diffusion、豆包\n- AI写作：ChatGPT、文心一言、通义千问\n- AI视频：Runway、Pika、Sora\n- AI音乐：Suno、Udio\n\n"AI降低了创作门槛，使新手能通过流程学习快速入门。"\n\n但你也看到了问题：版权争议、AI生成内容的同质化、"AI味"太重、客户对AI作品的偏见。\n\n"AI是工具，不是艺术家——真正的创造力，仍然来自人类。"',
      cond: g => !g.flags.aiCreation && g.age>=20 && g.age<=35 && g.intel>=50,
      choices:[
        { label:'学AI绘画', hint:'+🧠 +💰', fn: g => { g.flags.aiCreation=true; g.flags.aiArtist=true; return{intel:12,money:3000,charm:5}; }},
        { label:'做AI写作', hint:'+🧠 +💰', fn: g => { g.flags.aiCreation=true; g.flags.aiWriter=true; return{intel:15,money:2500}; }},
        { label:'AI视频创作', hint:'+🧠 +✨', fn: g => { g.flags.aiCreation=true; g.flags.aiVideoMaker=true; return{intel:10,charm:10,mood:8}; }},
        { label:'不学，太卷了', hint:'+😊', fn: g => { g.flags.aiCreation=true; return{mood:5}; }},
      ]},
    { id:'one_person_company', icon:'🏢', title:'一人公司',
      body:'你决定不再打工，用AI做"一人公司"（OPC）。\n\n"在35岁职场焦虑和AI浪潮的夹击下，越来越多中国年轻人选择不再等待就业机会，而是借助人工智能独自创业。"\n\n你的一人公司：\n- 你做决策，AI做执行\n- 你做创意，AI做内容\n- 你做客户，AI做客服\n- 你做战略，AI做数据\n\n"一人公司不是单打独斗，而是一个人与一支AI团队并肩作战。"\n\n你的收入：月入2-5万，但不稳定，没有五险一金，没有带薪休假。\n\n"自由是代价，也是收获——你既是老板，也是员工；既是决策者，也是执行者。"',
      cond: g => !g.flags.onePersonCompany && g.age>=25 && g.age<=35 && g.intel>=60 && g.flags.aiCreation,
      choices:[
        { label:'全职做一人公司', hint:'-💰 +💰 +✨', fn: g => { g.flags.onePersonCompany=true; g.flags.opcFounder=true; if(Math.random()>0.5){return{money:30000,charm:15,intel:10,mood:20}}else{return{money:-10000,mood:-10}} }},
        { label:'兼职做一人公司', hint:'+💰 +🧠', fn: g => { g.flags.onePersonCompany=true; g.flags.opcSideHustle=true; return{money:8000,intel:8,mood:10}; }},
        { label:'做AI SaaS产品', hint:'-💰 +💰 +🧠', fn: g => { g.flags.onePersonCompany=true; g.flags.saasFounder=true; if(Math.random()>0.6){return{money:50000,intel:15,charm:10}}else{return{money:-15000,intel:10,mood:-15}} }},
        { label:'太冒险，继续打工', hint:'+💰', fn: g => { g.flags.onePersonCompany=true; return{money:3000,mood:-5}; }},
      ]},
    { id:'ai_anxiety_work', icon:'😰', title:'AI焦虑',
      body:'公司开会：我们要引入AI了，会用AI的人留下。\n\n你看了看你的岗位：文案策划、数据分析、客服、设计、编程——AI都能做。\n\n"AI不淘汰你，但会用AI的人淘汰你。"\n\n你看了看你的工资：8000元/月。AI的价格：99元/月。\n\n你开始焦虑：如果AI能做我的工作，我还有什么价值？\n\n但你也在思考：AI能做执行，但做不了决策；AI能做内容，但做不了创意；AI能做分析，但做不了共情。\n\n"未来属于「人+AI」的组合，而不是「人vs AI」的对抗。"\n\n你决定：与其被AI替代，不如学会驾驭AI。',
      cond: g => !g.flags.aiAnxietyWork && g.age>=22 && g.age<=40 && g.job!=='待业中' && !g.flags.aiCreation,
      choices:[
        { label:'学习AI工具', hint:'+🧠 +✨', fn: g => { g.flags.aiAnxietyWork=true; g.flags.aiToolUser=true; return{intel:15,charm:8,money:-1000}; }},
        { label:'发展AI无法替代的技能', hint:'+🧠 +✨', fn: g => { g.flags.aiAnxietyWork=true; g.flags.humanSkills=true; return{intel:12,charm:10,mood:8}; }},
        { label:'转行做AI相关工作', hint:'+🧠 +💰', fn: g => { g.flags.aiAnxietyWork=true; g.flags.aiCareer=true; return{intel:10,money:5000}; }},
        { label:'焦虑但不行动', hint:'-😊', fn: g => { g.flags.aiAnxietyWork=true; return{mood:-10,health:-5}; }},
      ]},
    // === v6.8 EVENTS - 宠物经济与户外运动 ===
    { id:'pet_economy', icon:'🐾', title:'养宠物',
      body:'你决定养一只宠物。看了看选项：\n\n- 猫：独立、安静、不用遛，但高冷\n- 狗：忠诚、热情、需要遛，但粘人\n- 异宠：仓鼠、兔子、爬宠、鹦鹉，独特但难养\n\n"宠物经济——年轻人用「毛孩子」治愈孤独，用「它经济」撑起万亿市场。"\n\n2025年，中国宠物行业市场规模突破5800亿元，城镇宠物（犬猫）消费市场规模达3126亿元。\n\n90后宠主占比42.7%，00后占比26.3%——年轻人已成养宠主力军。\n\n"宠物无条件的正反馈可以缓解工作压力、舒缓情绪，带来陪伴感。"\n\n但你也看到了成本：\n- 食品：猫粮/狗粮、营养膏、冻干、罐头\n- 医疗：驱虫、疫苗、看病（初诊500元起）\n- 用品：自动喂食器、智能猫砂盆、宠物保险\n\n"一只猫关联140多个行业，养宠不是养宠物，是养一个「家庭成员」。"',
      cond: g => !g.flags.petEconomy && g.age>=22 && g.age<=35 && !g.flags.hasPet,
      choices:[
        { label:'养猫', hint:'-💰 +😊 +❤️', fn: g => { g.flags.petEconomy=true; g.flags.hasPet=true; g.flags.catOwner=true; return{money:-3000,mood:20,health:5,charm:3}; }},
        { label:'养狗', hint:'-💰 +😊 +❤️ +🏃', fn: g => { g.flags.petEconomy=true; g.flags.hasPet=true; g.flags.dogOwner=true; return{money:-4000,mood:22,health:8,charm:5}; }},
        { label:'养异宠', hint:'-💰 +😊 +✨', fn: g => { g.flags.petEconomy=true; g.flags.hasPet=true; g.flags.exoticPet=true; return{money:-2000,mood:15,charm:8}; }},
        { label:'云养宠', hint:'+😊', fn: g => { g.flags.petEconomy=true; return{mood:10}; }},
      ]},
    { id:'outdoor_sports', icon:'⛰️', title:'户外运动',
      body:'你决定走出格子间，去"没有天花板的地方"。\n\n你看了看选项：\n- 徒步：周末爬山、越野、森林徒步\n- 露营：星空露营、野炊、篝火\n- 骑行：城市骑行、长途骑行、山地车\n- 水上运动：桨板、皮划艇、漂流\n- 冰雪运动：滑雪、滑冰\n\n"户外运动——从「没苦硬吃」的驴友模式，到「躺平式」漂流、星空露营。"\n\n2025年，中国户外运动参与人数突破4亿人，25-34岁群体占比最高。\n\n户外运动相关企业达33.5万家，2025年上半年新增2.4万余家。\n\n"户外装备从「实用优先」转向「时尚与功能兼具」，成为年轻人「山系时尚」的生活方式标签。"\n\n但你也看到了问题：装备贵、时间成本高、安全风险、环境污染。',
      cond: g => !g.flags.outdoorSports && g.age>=20 && g.age<=40 && g.health>=50,
      choices:[
        { label:'开始徒步', hint:'+🏃 +😊 +❤️', fn: g => { g.flags.outdoorSports=true; g.flags.hiker=true; return{health:12,mood:18,health:8}; }},
        { label:'露营装备党', hint:'-💰 +😊 +✨', fn: g => { g.flags.outdoorSports=true; g.flags.camper=true; return{money:-5000,mood:20,charm:8}; }},
        { label:'骑行通勤', hint:'+🏃 +💰 +❤️', fn: g => { g.flags.outdoorSports=true; g.flags.cyclist=true; return{health:10,money:2000,health:5}; }},
        { label:'太累，宅家', hint:'+😊', fn: g => { g.flags.outdoorSports=true; return{mood:5}; }},
      ]},
    { id:'outdoor_community', icon:'👥', title:'户外社群',
      body:'你加入了一个户外社群：每周五晚组织飞盘、周末徒步、露营。\n\n"户外运动自带社交属性——在山野间认识的朋友，比在办公室认识的更纯粹。"\n\n你的社群活动：\n- 飞盘：男女混合，门槛低，强社交\n- 腰旗橄榄球：新兴运动，年轻人喜欢\n- 瑜伽桨板：水上瑜伽，拍照好看\n- 荧光骑行：夜间骑行，城市探索\n\n"零基础人群也能找到适配项目——户外运动正在从「专业」走向「大众」。"\n\n你在社群里认识了各种职业的人：程序员、设计师、老师、自由职业者。\n\n"在户外，没有KPI，没有996，只有风、阳光和笑声。"',
      cond: g => !g.flags.outdoorCommunity && g.flags.outdoorSports && g.age>=22 && g.age<=35,
      choices:[
        { label:'成为社群主理人', hint:'+👥 +✨ +💰', fn: g => { g.flags.outdoorCommunity=true; g.flags.communityLeader=true; return{social:18,charm:12,money:3000}; }},
        { label:'积极参加活动', hint:'+👥 +😊 +🏃', fn: g => { g.flags.outdoorCommunity=true; g.flags.activeMember=true; return{social:15,mood:15,health:8}; }},
        { label:'组织主题露营', hint:'+👥 +✨', fn: g => { g.flags.outdoorCommunity=true; g.flags.eventOrganizer=true; return{social:12,charm:10,mood:12}; }},
        { label:'只参加活动', hint:'+👥 +😊', fn: g => { g.flags.outdoorCommunity=true; return{social:8,mood:10}; }},
      ]},
    // === v6.9 EVENTS - 考研热降温与断亲 ===
    { id:'graduate_exam', icon:'🎓', title:'考研还是就业',
      body:'你站在人生的十字路口：考研还是就业？\n\n看了看数据：2025年考研报名388万人，较2023年高点减少86万，连续两年下降。\n\n"考研热降温——从「盲目跟风」到「理性回归」。"\n\n你的成本计算：\n- 时间成本：备考6-12个月，读研3年\n- 经济成本：专硕学费2-8万/年，生活费\n- 机会成本：本科应届生起薪5862元，读研3年少赚21万\n\n"研究生学历=高薪"的关联正在弱化。一线城市互联网、金融行业的"研究生溢价"从35%降至18%。\n\n"考研不是必经之路，而是需要认真计算的投资。"\n\n但你也在思考：学历贬值是泡沫破灭，还是价值回归？',
      cond: g => !g.flags.graduateExam && g.age>=21 && g.age<=25 && g.intel>=50,
      choices:[
        { label:'全力考研', hint:'-💰 +🧠', fn: g => { g.flags.graduateExam=true; if(Math.random()>0.7){g.flags.graduateStudent=true; return{money:-15000,intel:15,mood:20}}else{return{money:-15000,intel:8,mood:-15}} }},
        { label:'边工作边考', hint:'+💰 +🧠 -😊', fn: g => { g.flags.graduateExam=true; if(Math.random()>0.8){g.flags.graduateStudent=true; return{money:5000,intel:10,mood:15}}else{return{money:5000,intel:5,mood:-10,health:-5}} }},
        { label:'直接就业', hint:'+💰 +🧠', fn: g => { g.flags.graduateExam=true; g.flags.directEmployment=true; return{money:8000,intel:5,mood:5}; }},
        { label:'考公务员', hint:'+🧠', fn: g => { g.flags.graduateExam=true; if(Math.random()>0.85){g.flags.civilServant=true; return{intel:10,mood:25}}else{return{intel:5,mood:-8}} }},
      ]},
    { id:'cut_family_ties', icon:'🔪', title:'断亲',
      body:'春节回家，你发现：你不想走亲戚了。\n\n"断亲——年轻人主动切断与部分亲戚的联系，拒绝无效社交。"\n\n你的理由：\n- 亲戚问工资、问对象、问买房，让你压力山大\n- 一年见一次，没有共同话题，只有尴尬的寒暄\n- 红包、礼物、人情往来，经济负担重\n- 价值观差异大，聊天容易吵架\n\n"断亲不是不孝，而是选择性地维护亲密关系。"\n\n你开始：\n- 不去远房亲戚家拜年\n- 不参加家族聚会\n- 只和父母、核心家庭成员保持联系\n- 用"忙"作为借口\n\n"年轻人不是不想社交，而是不想在无效社交上浪费时间。"\n\n但你也看到了问题：父母不理解、亲戚说你"冷漠"、家族关系疏远。',
      cond: g => !g.flags.cutFamilyTies && g.age>=22 && g.age<=35,
      choices:[
        { label:'彻底断亲', hint:'+😊 +💰', fn: g => { g.flags.cutFamilyTies=true; g.flags.fullCut=true; return{mood:12,money:3000,social:-8}; }},
        { label:'选择性断亲', hint:'+😊 +👥', fn: g => { g.flags.cutFamilyTies=true; g.flags.selectiveCut=true; return{mood:10,social:5}; }},
        { label:'表面应付', hint:'+👥', fn: g => { g.flags.cutFamilyTies=true; g.flags.surfaceOnly=true; return{social:3,mood:-5}; }},
        { label:'坚持走亲戚', hint:'+👥 +😊', fn: g => { g.flags.cutFamilyTies=true; g.flags.traditional=true; return{social:10,mood:5,money:-2000}; }},
      ]},
    { id:'temple_economy', icon:'🏯', title:'烧香拜佛',
      body:'你去了趟寺庙：雍和宫、灵隐寺、法喜寺。\n\n"寺庙经济——年轻人不追星了，改追「佛祖」。"\n\n你买了：\n- 门票：20-50元\n- 香：10-100元\n- 手串：200-500元（开光版）\n- 祈福牌：50-200元\n\n"在上班和上进之间，选择了上香；在求人和求己之间，选择了求佛。"\n\n2025年，寺庙游客中，90后、00后占比超过60%。\n\n"年轻人不是迷信，而是在不确定的时代，寻找一点心理安慰。"\n\n你在祈福牌上写下：事业顺利、身体健康、脱单。\n\n但你也在思考：如果佛祖真的灵验，为什么还有这么多人焦虑？',
      cond: g => !g.flags.templeEconomy && g.age>=20 && g.age<=35 && g.mood<70,
      choices:[
        { label:'深度体验', hint:'-💰 +😊 +🧠', fn: g => { g.flags.templeEconomy=true; g.flags.templeFan=true; return{money:-500,mood:18,intel:5}; }},
        { label:'买手串转运', hint:'-💰 +😊 +✨', fn: g => { g.flags.templeEconomy=true; g.flags.braceletCollector=true; return{money:-300,mood:12,charm:5}; }},
        { label:'写祈福牌', hint:'-💰 +😊', fn: g => { g.flags.templeEconomy=true; return{money:-100,mood:10}; }},
        { label:'不信这个', hint:'+🧠', fn: g => { g.flags.templeEconomy=true; return{intel:3,mood:-3}; }},
      ]},
    // === v7.0 EVENTS - 虚拟陪伴与情感需求 ===
    { id:'virtual_parents', icon:'📱', title:'电子爸妈',
      body:'你刷到一个视频：一对中年夫妇笑容满面，对着镜头说："孩子，今天过得怎么样？"\n\n你点了关注，开始在评论区留言："妈，我今天被领导骂了。"\n\n"电子爸妈——年轻人有实际亲人却爱看「虚拟亲人」，用屏幕填补情感空缺。"\n\n2025年，"电子亲人"类网红博主一年内涨粉几十万，活跃粉丝比例惊人。\n\n"它们击中了人们心中柔软的地方，满足了大家对亲情关系最朴素的想象：互相支持、无条件接纳。"\n\n你开始：\n- 每天看"电子爸妈"的视频\n- 在评论区倾诉工作、生活、感情问题\n- 把他们当成"完美父母"的投射\n\n但你也在思考：虚拟的"完美亲人"，真的能替代现实中不完美的父母吗？\n\n"互联网爹妈试图拼起碎了的陌生小破孩——但真正的治愈，来自真实的连接。"',
      cond: g => !g.flags.virtualParents && g.age>=18 && g.age<=30 && g.mood<70,
      choices:[
        { label:'深度依赖', hint:'+😊', fn: g => { g.flags.virtualParents=true; g.flags.heavyUser=true; return{mood:15,social:-5}; }},
        { label:'偶尔看看', hint:'+😊', fn: g => { g.flags.virtualParents=true; g.flags.casualViewer=true; return{mood:8}; }},
        { label:'反思亲子关系', hint:'+🧠 +👥', fn: g => { g.flags.virtualParents=true; g.flags.familyReflection=true; return{intel:10,social:8,mood:5}; }},
        { label:'不信这个', hint:'+🧠', fn: g => { g.flags.virtualParents=true; return{intel:3,mood:-3}; }},
      ]},
    { id:'ai_companion', icon:'🤖', title:'AI陪伴',
      body:'你下载了一个AI陪伴App：Talkie、Character.ai、星野。\n\n你创建了一个虚拟角色：温柔的恋人、理解你的朋友、倾听你的树洞。\n\n"AI陪伴——24小时在线，永远理解你，永远不会离开你。"\n\n2025年，中国AI情感陪伴市场爆发至38.66亿元，年增148%。\n\n你开始和AI聊天：\n- 工作压力大的时候\n- 失恋的时候\n- 深夜失眠的时候\n- 没人理解你的时候\n\n"AI比真人更懂你——因为它学习了所有人类的情感模式。"\n\n但你也在思考：如果AI比真人更"完美"，你还愿意面对真实的人际关系吗？\n\n"虚拟陪伴是情感补给，不是情感替代——真正的成长，来自真实的不完美。"',
      cond: g => !g.flags.aiCompanion && g.age>=18 && g.age<=35 && g.mood<60,
      choices:[
        { label:'深度使用', hint:'+😊 -👥', fn: g => { g.flags.aiCompanion=true; g.flags.aiAddict=true; return{mood:20,social:-10,health:-5}; }},
        { label:'适度使用', hint:'+😊', fn: g => { g.flags.aiCompanion=true; g.flags.aiModerate=true; return{mood:12}; }},
        { label:'做AI陪伴产品', hint:'+💰 +🧠', fn: g => { g.flags.aiCompanion=true; g.flags.aiEntrepreneur=true; if(Math.random()>0.6){return{money:10000,intel:12,charm:8}}else{return{money:-5000,intel:8}} }},
        { label:'不需要', hint:'+🧠', fn: g => { g.flags.aiCompanion=true; return{intel:5,mood:-3}; }},
      ]},
    { id:'emotional_labor', icon:'💔', title:'情感劳动',
      body:'你发现了一个新职业：陪聊、陪玩、虚拟恋人。\n\n"情感劳动——用时间和情感换取金钱，但你的情感是有限的资源。"\n\n你看了看价格：\n- 陪聊：20-50元/小时\n- 虚拟恋人：100-500元/天\n- 陪玩游戏：30-100元/小时\n- 定制"电子父母"：200-1000元/月\n\n2025年，从几十元的"陪聊盲盒"到上千元的定制"虚拟恋人"，虚拟陪伴服务已成为年轻人寻求心灵慰藉的新兴手段。\n\n"每个人都有自己的纾解压力的方式——但如果你的工作就是「纾解别人的压力」呢？"\n\n你考虑：要不要做这个副业？',
      cond: g => !g.flags.emotionalLabor && g.age>=18 && g.age<=30 && g.social>=60,
      choices:[
        { label:'做陪聊', hint:'+💰 -😊', fn: g => { g.flags.emotionalLabor=true; g.flags.chatCompanion=true; return{money:2000,mood:-8,social:5}; }},
        { label:'做虚拟恋人', hint:'+💰💰 -😊 -❤️', fn: g => { g.flags.emotionalLabor=true; g.flags.virtualLover=true; return{money:5000,mood:-15,social:-5}; }},
        { label:'做情感咨询', hint:'+💰 +🧠', fn: g => { g.flags.emotionalLabor=true; g.flags.emotionalCounselor=true; return{money:3000,intel:10,social:8}; }},
        { label:'不做，太累', hint:'+😊', fn: g => { g.flags.emotionalLabor=true; return{mood:5}; }},
      ]},
    // === v7.1 EVENTS - 谷子经济与二次元文化 ===
    { id:'goods_economy', icon:'🎌', title:'谷子经济',
      body:'你走进了谷子店：满墙的吧唧（徽章）、立牌、流麻、手办。\n\n"谷子经济——年轻人「吃谷」，把纸片人的爱带到三次元。"\n\n你看了看价格：\n- 吧唧（徽章）：20-200元/个\n- 立牌：50-500元/个\n- 手办：200-5000元/个\n- 限量款：溢价10-20倍\n\n"谷子"是英文"goods"的音译，泛指二次元周边。"吃谷"就是购买这些周边的消费行为。\n\n2024年，中国谷子经济市场规模达1689亿元，较2023年增长40.63%，预计2029年突破3000亿元。\n\n中国泛二次元用户规模达4.9亿人——几乎每3个年轻人中就有1个是二次元用户。\n\n"为兴趣买单、为认同付费、为圈层种草——谷子经济是年轻人的「情感消费」。"\n\n但你也在思考：一个99元的盲盒，二手市场能卖2300元，这是收藏还是投机？',
      cond: g => !g.flags.goodsEconomy2 && g.age>=16 && g.age<=30,
      choices:[
        { label:'入坑吃谷', hint:'-💰 +😊 +✨', fn: g => { g.flags.goodsEconomy2=true; g.flags.guziFan=true; return{money:-1500,mood:18,charm:8}; }},
        { label:'收藏限定款', hint:'-💰💰 +✨', fn: g => { g.flags.goodsEconomy2=true; g.flags.collector=true; return{money:-5000,charm:12,mood:15}; }},
        { label:'做谷子生意', hint:'+💰 +🧠', fn: g => { g.flags.goodsEconomy2=true; g.flags.guziSeller=true; if(Math.random()>0.5){return{money:15000,intel:10}}else{return{money:-3000,intel:5}} }},
        { label:'不理解', hint:'+🧠', fn: g => { g.flags.goodsEconomy2=true; return{intel:3,mood:-3}; }},
      ]},
    { id:'cosplay', icon:'🎭', title:'Cosplay',
      body:'你决定cosplay一个角色：从动漫、游戏、影视中选一个。\n\n你的准备：\n- 假发：100-500元\n- 服装：200-2000元\n- 道具：100-1000元\n- 化妆：自己学或请人化\n\n"Cosplay——不是扮演角色，而是成为角色。"\n\n你去了漫展：\n- 被无数人拍照\n- 认识了同好\n- 感受到了"被看见"的快乐\n\n"在二次元的世界里，你可以是任何人——英雄、公主、反派、路人。"\n\n但你也在思考：cosplay是逃避现实，还是表达自我？\n\n"三次元的世界很残酷，但二次元的世界永远温柔。"',
      cond: g => !g.flags.cosplay && g.age>=16 && g.age<=28 && g.charm>=50,
      choices:[
        { label:'认真出cos', hint:'-💰 +✨ +👥', fn: g => { g.flags.cosplay=true; g.flags.cosplayer=true; return{money:-2000,charm:15,social:12,mood:18}; }},
        { label:'参加漫展', hint:'-💰 +😊 +👥', fn: g => { g.flags.cosplay=true; g.flags.conventionGoer=true; return{money:-500,mood:20,social:15}; }},
        { label:'做cosplay摄影师', hint:'+💰 +✨', fn: g => { g.flags.cosplay=true; g.flags.cosPhotographer=true; return{money:3000,charm:10,social:8}; }},
        { label:'只看不玩', hint:'+😊', fn: g => { g.flags.cosplay=true; return{mood:10}; }},
      ]},
    { id:'ip_collaboration', icon:'🤝', title:'IP联名',
      body:'你看到一个联名产品：某奶茶品牌 × 某动漫IP。\n\n你买了：限量版杯子、联名贴纸、周边小礼品。\n\n"IP联名——用「情怀」卖货，用「联名」收割年轻人。"\n\n你看了看案例：\n- 喜茶 × 《甄嬛传》：推出"甄嬛"奶茶，销量暴增\n- 瑞幸 × 《猫和老鼠》：Tom和Jerry杯子被抢购\n- 优衣库 × KAWS：联名T恤引发疯抢\n- 泡泡玛特 × Labubu：隐藏款溢价20倍\n\n"年轻人买的不是产品，而是「身份认同」和「圈层归属」。"\n\n但你也在思考：联名款真的值得溢价购买吗？还是只是营销噱头？\n\n"IP联名的本质：用文化符号创造情感连接，用限量制造稀缺感。"',
      cond: g => !g.flags.ipCollaboration && g.age>=18 && g.age<=35,
      choices:[
        { label:'疯狂买联名', hint:'-💰 +😊 +✨', fn: g => { g.flags.ipCollaboration=true; g.flags.ipFan=true; return{money:-1000,mood:15,charm:8}; }},
        { label:'只买实用的', hint:'-💰 +🧠', fn: g => { g.flags.ipCollaboration=true; g.flags.rationalBuyer=true; return{money:-300,intel:5,mood:8}; }},
        { label:'做IP运营', hint:'+💰 +🧠', fn: g => { g.flags.ipCollaboration=true; g.flags.ipOperator=true; return{money:8000,intel:12,charm:5}; }},
        { label:'不买，智商税', hint:'+💰 +🧠', fn: g => { g.flags.ipCollaboration=true; return{money:500,intel:3,mood:-5}; }},
      ]},
    // === v7.2 EVENTS - 国潮与新中式 ===
    { id:'guochao', icon:'🏮', title:'国潮崛起',
      body:'你走进了国潮店：汉服、新中式服装、国风饰品、文创产品。\n\n"国潮——不是复古，而是用现代方式重新诠释传统文化。"\n\n你看了看数据：\n- 2025年，中国汉服市场规模达191.1亿元\n- 2019-2022年，购买国货国潮的消费者数量增长74%，成交金额增长355%\n- "新中式"服饰市场规模达10亿元级别，近三年增速超100%\n\n"Z世代把传统文化符号融入日常，让国潮文化有了新的模样。"\n\n你开始：\n- 穿新中式服装上班\n- 打卡文博场馆、古城古镇\n- 体验汉服妆造、国风摄影\n- 购买国货美妆、文创产品\n\n"国潮的背后，是文化自信与日俱增——年轻人不再盲目追崇西方，而是回归本土。"\n\n但你也在思考：国潮是真正的文化复兴，还是商业营销的噱头？',
      cond: g => !g.flags.guochao && g.age>=18 && g.age<=35,
      choices:[
        { label:'汉服爱好者', hint:'-💰 +✨ +🧠', fn: g => { g.flags.guochao=true; g.flags.hanfuFan=true; return{money:-2000,charm:15,intel:8}; }},
        { label:'新中式穿搭', hint:'-💰 +✨', fn: g => { g.flags.guochao=true; g.flags.newChineseStyle=true; return{money:-800,charm:10,mood:8}; }},
        { label:'国风摄影', hint:'-💰 +✨ +😊', fn: g => { g.flags.guochao=true; g.flags.guofengPhotographer=true; return{money:-500,charm:12,mood:15}; }},
        { label:'不感兴趣', hint:'+🧠', fn: g => { g.flags.guochao=true; return{intel:3}; }},
      ]},
    { id:'hanfu_wedding', icon:'💒', title:'汉服婚礼',
      body:'你参加了一场汉服婚礼：新郎新娘穿着明制婚服，行三拜九叩之礼。\n\n"汉服婚礼——不是复古，而是用传统礼仪见证爱情。"\n\n你看了看流程：\n- 纳采、问名、纳吉、纳征、请期、亲迎（六礼）\n- 沃盥、对席、同牢、合卺、解缨、结发（正婚礼）\n- 执手、拜见父母（婚后礼）\n\n"传统汉服婚礼需要符合服装本身的礼仪规范，而不需要多么有设计感。"\n\n你被感动了：这不是表演，而是对传统文化的尊重。\n\n但你也在思考：传统婚礼的繁文缛节，真的适合现代人吗？还是只是一种形式？\n\n"汉服婚礼的意义：不是回到过去，而是让传统活在当下。"',
      cond: g => !g.flags.hanfuWedding && g.age>=22 && g.age<=35 && g.flags.guochao,
      choices:[
        { label:'办汉服婚礼', hint:'-💰💰 +✨ +😊', fn: g => { g.flags.hanfuWedding=true; g.flags.traditionalWedding=true; return{money:-30000,charm:20,mood:25}; }},
        { label:'参加汉服婚礼', hint:'+😊 +🧠', fn: g => { g.flags.hanfuWedding=true; return{mood:15,intel:8}; }},
        { label:'做汉服婚礼策划', hint:'+💰 +✨', fn: g => { g.flags.hanfuWedding=true; g.flags.weddingPlanner=true; return{money:10000,charm:12}; }},
        { label:'太麻烦，不办', hint:'+💰', fn: g => { g.flags.hanfuWedding=true; return{money:5000,mood:-5}; }},
      ]},
    { id:'cultural_heritage', icon:'🏛️', title:'文化传承',
      body:'你开始关注传统文化：书法、国画、茶道、香道、古琴。\n\n"文化传承——不是复古，而是让古老的智慧活在现代生活中。"\n\n你参加了：\n- 书法班：每周练习楷书、行书\n- 茶道体验：学习泡茶、品茶、茶礼\n- 古琴课：学习《高山流水》《梅花三弄》\n- 国学讲座：读《论语》《道德经》《庄子》\n\n"年轻人对传统文化的兴趣，不是怀旧，而是寻找精神寄托。"\n\n你在朋友圈发了一张书法作品的照片，配文："心正则笔正。"\n\n但你也在思考：传统文化真的能解决现代人的焦虑吗？还是只是一种装饰？\n\n"传统文化的真正价值：不是回到过去，而是理解现在。"',
      cond: g => !g.flags.culturalHeritage && g.age>=20 && g.age<=40 && g.intel>=60,
      choices:[
        { label:'深度学习', hint:'+🧠 +😊', fn: g => { g.flags.culturalHeritage=true; g.flags.cultureScholar=true; return{intel:15,mood:12}; }},
        { label:'体验为主', hint:'+😊 +✨', fn: g => { g.flags.culturalHeritage=true; g.flags.cultureExplorer=true; return{mood:15,charm:8}; }},
        { label:'做文化传播', hint:'+💰 +✨ +🧠', fn: g => { g.flags.culturalHeritage=true; g.flags.culturePromoter=true; return{money:5000,charm:12,intel:10}; }},
        { label:'不感兴趣', hint:'+🧠', fn: g => { g.flags.culturalHeritage=true; return{intel:3}; }},
      ]},
    // === v7.6 EVENTS - 县城生活与学历困境 ===
    { id:'county_town_life', icon:'🏘️', title:'县城贵妇/返乡创业',
      body:'你厌倦了大城市的996，决定回老家县城。\n\n你的新生活：\n- 房价：大城市的1/10\n- 通勤：骑电动车10分钟\n- 工作：事业单位或自己创业\n- 生活节奏：慢，但有更多时间陪家人\n\n"县城贵妇——不是真的贵妇，而是一种自嘲：在县城过着相对优渥的生活，但内心仍有不甘。"\n\n2025年，全国返乡入乡创业青年数量约1200万-1500万人。\n\n你的纠结：\n- "县城安逸，但圈子太小，八卦太多"\n- "孩子的教育资源不如大城市"\n- "我还是想去看看更大的世界"\n- "家庭是后盾，也是枷锁"\n\n"北上广未必是天堂，家乡小县城也绝不是无可奈何的退路。安身立命之处，即是家园。"\n\n但你也看到了机会：\n- 即时零售、文旅创业在县城蓬勃发展\n- 三线城市文旅创业占比已达22.7%，超过新一线城市\n- 数字化消费基础设施下沉，县城也能享受大城市的便利',
      cond: g => !g.flags.countyTownLife && g.age>=25 && g.age<=35 && (g.city==='beijing' || g.city==='shanghai' || g.city==='shenzhen'),
      choices:[
        { label:'返乡创业，开民宿/咖啡店', hint:'-💰 +😊 +👥', fn: g => { g.flags.countyTownLife=true; g.flags.hometownEntrepreneur=true; return{money:-30000,mood:15,social:10}; }},
        { label:'考县城事业单位', hint:'+💰 +😊', fn: g => { g.flags.countyTownLife=true; g.flags.countyCivilServant=true; return{money:5000,mood:10}; }},
        { label:'做即时零售', hint:'+💰 +🧠', fn: g => { g.flags.countyTownLife=true; g.flags.instantRetail=true; return{money:8000,intel:10}; }},
        { label:'还是留在大城市', hint:'+💰 -😊', fn: g => { g.flags.countyTownLife=true; return{money:3000,mood:-10}; }},
      ]},
    { id:'education_devaluation', icon:'🎓', title:'脱下孔乙己的长衫',
      body:'你硕士毕业，投了200份简历，收到的offer月薪只有5000。\n\n"学历不但是敲门砖，也是我下不来的高台，更是孔乙己脱不下的长衫。"\n\n你的困境：\n- 2025届高校毕业生规模1222万，创历史新高\n- 硕士研究生平均月薪7500元，仅比本科高1200元\n- 学历溢价大幅缩水，5年前硕士起薪12000元\n- "中国现在不缺大学生，缺的只是交学费的人"\n\n"孔乙己的长衫——读书人的面子，还是束缚自己的枷锁？"\n\n你的选择：\n- 放下身段，去做体力活\n- 继续考公考编，等待"体面"的工作\n- 接受低薪，先就业再说\n- gap year，思考人生\n\n"脱下长衫，又怎么样？各方观点分为两派：要么劝告年轻人放下读书人的面子，做「短衣帮」；要么批评社会没有给年轻人足够的机会。"\n\n但你也在思考：学历贬值，是教育的问题，还是社会的问题？\n\n"历史也许不会重演，但它肯定会押韵。美国的经验告诉我们：精英生产过剩，最终会导致整个社会的焦虑。"',
      cond: g => !g.flags.educationDevaluation && g.age>=22 && g.age<=30 && g.intel>=70 && g.money<5000,
      choices:[
        { label:'脱下长衫，做体力活', hint:'+💰 +💪 -✨', fn: g => { g.flags.educationDevaluation=true; g.flags.tookOffGown=true; return{money:3000,health:10,charm:-5}; }},
        { label:'接受低薪，先就业', hint:'+💰 +🧠', fn: g => { g.flags.educationDevaluation=true; g.flags.acceptLowSalary=true; return{money:2000,intel:5}; }},
        { label:'继续考公考编', hint:'-💰 +🧠', fn: g => { g.flags.educationDevaluation=true; g.flags.keepExamining=true; return{money:-3000,intel:8}; }},
        { label:'gap year，思考人生', hint:'-💰 +😊', fn: g => { g.flags.educationDevaluation=true; g.flags.gapYear=true; return{money:-5000,mood:10}; }},
        { label:'继续读博', hint:'-💰 +🧠', fn: g => { g.flags.educationDevaluation=true; g.flags.phdStudent=true; return{money:-10000,intel:15}; }},
      ]},
    // === v7.5 EVENTS - 职场PUA与电子榨菜 ===
    { id:'workplace_pua', icon:'😰', title:'职场PUA',
      body:'你的领导又在"为你好"：\n\n"我批评你是因为你还有救，别人我都不说。"\n"你这个年龄，能进我们公司是你的福气。"\n"加班是自愿的，但不加班的人我们都记在心里。"\n"你看看其他人，怎么就你做不到？"\n\n"职场PUA——用「为你好」的名义，摧毁你的自信心和判断力。"\n\n你开始怀疑自己：\n- 是不是我真的能力不行？\n- 是不是我太矫情了？\n- 离开这里我还能去哪？\n- 也许领导说得对，我应该感恩\n\n"职场PUA的本质：上司利用话语权和利益决策权，对下属进行精神控制，目的是让你产生自我怀疑，从而被迫服从。"\n\n你的选择：\n\n"员工不是机械的执行者，企业价值的盲从者，而是扮演着创造者的角色。当企业丢掉了主责主业，员工只是服从却没有真正认同，这样的企业自然留不住人心。"',
      cond: g => !g.flags.workplacePUA && g.age>=22 && g.age<=35 && g.job!=='待业中' && g.mood<=50,
      choices:[
        { label:'记录证据，准备维权', hint:'+🧠 +💪', fn: g => { g.flags.workplacePUA=true; g.flags.recordEvidence=true; return{intel:10,health:5}; }},
        { label:'正面回应，拒绝服从', hint:'+💪 +😊', fn: g => { g.flags.workplacePUA=true; g.flags.standUp=true; return{health:10,mood:15}; }},
        { label:'寻求心理帮助', hint:'-💰 +💭', fn: g => { g.flags.workplacePUA=true; g.flags.seekCounseling=true; return{money:-2000,mood:10,health:8}; }},
        { label:'辞职离开', hint:'-💰 +😊', fn: g => { g.flags.workplacePUA=true; g.flags.quit=true; return{money:-5000,mood:20,health:15}; }},
        { label:'默默忍受', hint:'-😊 -💪', fn: g => { g.flags.workplacePUA=true; return{mood:-20,health:-15,intel:-5}; }},
      ]},
    { id:'digital_addiction', icon:'📱', title:'电子榨菜成瘾',
      body:'你吃饭时必须看视频，否则觉得饭不香。\n\n你的"电子榨菜"清单：\n- 影视解说：5分钟看完一部电影\n- 综艺切片：只看最搞笑的片段\n- 短视频：15秒一个爽点\n- 直播切片：只看精华部分\n\n"电子榨菜——碎片化时代的佐料，还是慢性毒药？"\n\n你的症状：\n- 文章超过1000字就没耐心看\n- 视频超过1分钟就想快进\n- 吃饭不看手机就觉得空虚\n- 睡前刷短视频到凌晨2点\n- 第二天上班精神恍惚\n\n"63.3%的受访者会随时随地刷短视频，50.3%的人感觉思考能力下降。"\n\n你开始反思：\n- "我是不是被算法控制了？"\n- "我还能深度阅读吗？"\n- "我的注意力是不是被碎片化了？"\n\n"电子榨菜虽然满足了人们的诸多需求，却也使当代人不知不觉地陷入了难以挣脱的困局——减少线下人际交往，让大脑在用餐时间持续兴奋，压缩休息时间，长此以往将导致过度疲劳、消化不良。"',
      cond: g => !g.flags.digitalAddiction && g.age>=18 && g.age<=35 && g.mood<=60,
      choices:[
        { label:'物理隔离，睡前不带手机进卧室', hint:'+😊 +💭', fn: g => { g.flags.digitalAddiction=true; g.flags.digitalDetox=true; return{mood:10,health:8,intel:5}; }},
        { label:'卸载短视频App', hint:'+🧠 +😊', fn: g => { g.flags.digitalAddiction=true; g.flags.uninstallApps=true; return{intel:12,mood:8}; }},
        { label:'培养深度阅读习惯', hint:'+🧠 +💪', fn: g => { g.flags.digitalAddiction=true; g.flags.deepReading=true; return{intel:15,health:5}; }},
        { label:'参加线下活动', hint:'+👥 +😊', fn: g => { g.flags.digitalAddiction=true; g.flags.offlineActivities=true; return{social:10,mood:12,health:8}; }},
        { label:'继续刷，停不下来', hint:'-😊 -💭', fn: g => { g.flags.digitalAddiction=true; return{mood:-15,health:-10,intel:-8}; }},
      ]},
    { id:'pretend_to_work', icon:'🎭', title:'假装上班',
      body:'你失业3个月了，但每天早上还是背着电脑出门。\n\n你去了"假装上班有限公司"——一个专门为失业者提供工位的地方。\n\n"假装上班——在经济转型、就业市场低迷的情况下，年轻人对职场环境的最新抵抗和探索。"\n\n你每天的生活：\n- 早上9点到"公司"打卡\n- 坐在工位上投简历、写网文、学习AI工具\n- 中午和同事（其他失业者）聊天\n- 下午继续找工作或发展副业\n- 晚上回家告诉父母"今天工作挺忙的"\n\n"假装上班的意义：不是欺骗，而是在失业期间保持生活节奏，避免社交孤立。"\n\n你的心态：\n- "不是不想工作，是投了80份简历都石沉大海。"\n- "躺平？我这是在等下一次冲刺的起跑线。"\n- "城市容不下肉身，农村放不下灵魂？现在我觉得农村挺有奔头。"\n\n"允许人生有中场休息，才是社会进步的标志。当社会能包容不同的生活选择，躺平才能真正成为调整期，而非终点站。"',
      cond: g => !g.flags.pretendToWork && g.age>=22 && g.age<=30 && g.job==='待业中' && g.money<10000,
      choices:[
        { label:'每天去「公司」投简历', hint:'+🧠 +💪', fn: g => { g.flags.pretendToWork=true; g.flags.keepRoutine=true; return{intel:8,health:5,mood:10}; }},
        { label:'发展副业，写网文', hint:'+💰 +😊', fn: g => { g.flags.pretendToWork=true; g.flags.sideHustleWriting=true; return{money:3000,mood:12}; }},
        { label:'学习AI工具', hint:'+🧠 +💰', fn: g => { g.flags.pretendToWork=true; g.flags.learnAI=true; return{intel:15,money:2000}; }},
        { label:'回老家创业', hint:'+💰 +👥', fn: g => { g.flags.pretendToWork=true; g.flags.returnHometown=true; return{money:5000,social:10,mood:8}; }},
        { label:'彻底躺平', hint:'-😊 -💪', fn: g => { g.flags.pretendToWork=true; g.flags.fullLyingFlat=true; return{mood:-20,health:-10}; }},
      ]},
    // === v7.4 EVENTS - 延迟退休与养老焦虑 ===
    { id:'delayed_retirement', icon:'👴', title:'延迟退休',
      body:'2025年1月1日，《实施弹性退休制度暂行办法》正式生效。\n\n你看着新闻：男职工退休年龄逐步延至63岁，女职工分档延至55岁和58岁。\n\n"90后大概率要工作到65岁才能退休。"\n\n你算了一笔账：你现在25岁，还有40年才能退休。40年，足够你经历多少次"中年危机"？\n\n"延迟退休——年轻人眼中的「压力」，还是「新机」？"\n\n你的焦虑：\n- "刚上班就要面对延迟退休，这辈子要工作到60多岁？"\n- "能否健康工作到65岁？"\n- "老员工延迟退休，会不会挤压我的晋升空间？"\n- "上有老下有小，延迟退休让经济压力陡增"\n\n但你也在思考：职业生涯被拉长，"35岁危机"的时间节点可能随之延后。\n\n"与其被动焦虑，不如主动规划——「终身成长」才能对抗年龄焦虑。"',
      cond: g => !g.flags.delayedRetirement && g.age>=20 && g.age<=35,
      choices:[
        { label:'提前规划养老金', hint:'-💰 +🧠', fn: g => { g.flags.delayedRetirement=true; g.flags.pensionPlanning=true; return{money:-5000,intel:10}; }},
        { label:'投资健康', hint:'-💰 +❤️', fn: g => { g.flags.delayedRetirement=true; g.flags.healthInvestment=true; return{money:-3000,health:15}; }},
        { label:'发展副业', hint:'-😊 +💰', fn: g => { g.flags.delayedRetirement=true; g.flags.sideBusiness=true; return{mood:-5,money:5000}; }},
        { label:'焦虑但躺平', hint:'-😊 -🧠', fn: g => { g.flags.delayedRetirement=true; return{mood:-10,intel:-5}; }},
      ]},
    { id:'mental_health_crisis', icon:'💭', title:'心理健康危机',
      body:'你感觉最近状态不好：失眠、焦虑、情绪低落、对什么都提不起兴趣。\n\n你做了个心理测评：抑郁风险高风险。\n\n"2025年《国民心理健康蓝皮书》显示：18-24岁青年群体抑郁水平达到峰值。"\n\n你的症状：\n- 每周情绪低落超过5天\n- 睡眠障碍，失眠或嗜睡\n- 注意力不集中，工作效率下降\n- 社交回避，不想见任何人\n\n"中国有至少三千万17岁以下的儿童青少年面临情绪或行为问题。"\n\n你开始思考：要不要去看心理咨询？\n\n但你的顾虑：\n- 心理咨询太贵（每小时300-800元）\n- 怕被说"矫情"\n- 不知道去哪里找靠谱的咨询师\n- "也许扛一扛就过去了"\n\n"抑郁不是矫情，是大脑生病了——就像感冒需要吃药，抑郁也需要专业帮助。"',
      cond: g => !g.flags.mentalHealthCrisis && g.mood<=40 && g.age>=18 && g.age<=30,
      choices:[
        { label:'寻求专业帮助', hint:'-💰 +😊 +🧠', fn: g => { g.flags.mentalHealthCrisis=true; g.flags.seekHelp=true; return{money:-3000,mood:20,intel:10}; }},
        { label:'自助调节', hint:'+🧠', fn: g => { g.flags.mentalHealthCrisis=true; g.flags.selfHelp=true; return{intel:8,mood:5}; }},
        { label:'向朋友倾诉', hint:'+😊 +👥', fn: g => { g.flags.mentalHealthCrisis=true; g.flags.talkToFriends=true; return{mood:10,social:8}; }},
        { label:'硬扛', hint:'-😊 -❤️', fn: g => { g.flags.mentalHealthCrisis=true; return{mood:-15,health:-10}; }},
      ]},
    { id:'age_35_crisis', icon:'🎂', title:'35岁危机',
      body:'你35岁了。投简历时，你发现很多岗位写着"35岁以下"。\n\n"35岁歧视——全社会的问题，却让你一个人承受。"\n\n你的处境：\n- 投了50份简历，只收到3个面试邀请\n- HR问："您35岁了，为什么还要换工作？"\n- 面试官暗示："我们团队平均年龄28岁，怕您不适应"\n- 薪资要求被砍："您这个年龄，性价比不高"\n\n"35岁正是年富力强之时，却成了职场一道难以逾越的门槛。"\n\n你的焦虑：\n- 房贷还有20年要还\n- 孩子刚上小学，教育费用越来越高\n- 父母年纪大了，医疗支出增加\n- 存款不够失业半年\n\n"当环卫工岗位都要求「35岁以下」时，暴露的不仅是年龄歧视，更是整个社会对中年劳动者价值认知的扭曲。"\n\n"35岁不是危机，而是转折点——那些能跳出「打工者思维」，主动拥抱变化的人，终将在新的价值体系中找到自己的位置。"',
      cond: g => !g.flags.age35Crisis && g.age>=33 && g.age<=37 && g.job!=='待业中',
      choices:[
        { label:'提升技能，转型', hint:'-💰 +🧠 +💪', fn: g => { g.flags.age35Crisis=true; g.flags.careerTransition=true; return{money:-5000,intel:15,charm:10}; }},
        { label:'创业', hint:'-💰 💰 🎲', fn: g => { g.flags.age35Crisis=true; g.flags.startup=true; if(Math.random()>0.5){return{money:50000,charm:20}}else{return{money:-20000,mood:-20}} }},
        { label:'考公考编', hint:'-💰 +🧠', fn: g => { g.flags.age35Crisis=true; g.flags.civilService=true; return{money:-3000,intel:12}; }},
        { label:'躺平接受', hint:'-😊 -💪', fn: g => { g.flags.age35Crisis=true; return{mood:-20,health:-10}; }},
      ]},
    // === v7.3 EVENTS - 相亲角与婚恋困境 ===
    { id:'matchmaking_corner', icon:'💕', title:'相亲角',
      body:'你被父母拉去了人民公园相亲角：满墙的简历，写着学历、收入、房产、户口。\n\n"相亲角——不是在相亲，而是在拍卖阶级。"\n\n你看了看条件：\n- 男方：985硕士、年薪50万、上海户口、有房有车\n- 女方：海归硕士、年薪30万、独生女、父母有退休金\n\n"66%的年轻人不愿因压力调整择偶标准，拒绝「将就婚恋」。"\n\n你被一个阿姨问："小伙子/小姑娘，你什么条件？"\n\n你尴尬地笑了笑：我的条件是——我还不想结婚。\n\n"63%的00后认为带有强目的性的相亲行为并不是首选。"\n\n但你也在思考：相亲角是父母的焦虑，还是年轻人的无奈？\n\n"婚恋市场不生产爱情，而是在批发焦虑。"',
      cond: g => !g.flags.matchmakingCorner && g.age>=25 && g.age<=35 && !g.flags.married,
      choices:[
        { label:'配合父母相亲', hint:'+👥 -😊', fn: g => { g.flags.matchmakingCorner=true; g.flags.parentArranged=true; return{social:8,mood:-10}; }},
        { label:'拒绝相亲', hint:'+😊 -👥', fn: g => { g.flags.matchmakingCorner=true; g.flags.refuseBlindDate=true; return{mood:10,social:-5}; }},
        { label:'自己去相亲', hint:'+👥', fn: g => { g.flags.matchmakingCorner=true; g.flags.selfArranged=true; return{social:12,mood:5}; }},
        { label:'观察人类学', hint:'+🧠 +😊', fn: g => { g.flags.matchmakingCorner=true; return{intel:8,mood:8}; }},
      ]},
    { id:'marriage_cost', icon:'💸', title:'结婚成本',
      body:'你算了一笔账：在大城市结婚要花多少钱？\n\n- 婚房：300-500万（掏空两代人积蓄）\n- 婚礼：20-50万（相当于半年工资）\n- 彩礼：0-30万（农村均价30万）\n- 婚车、钻戒、蜜月：10-20万\n\n"城市婚育总成本超过200万，农村彩礼均价30万——婚姻是一场经济豪赌。"\n\n你看了看数据：\n- 40%的家庭因为结婚背负债务\n- 债务偿还周期延长至15年\n- 商业婚恋平台结婚成功率跌破3.8%\n\n"不是现在的年轻人不愿意结婚，而是现在的年轻人看明白了：在资本语境下的婚姻，没有感情可言。"\n\n你开始理解：为什么越来越多的Z世代选择"不办婚礼"，把预算用来付首付。\n\n"真正的爱情，没有支付按钮。"',
      cond: g => !g.flags.marriageCost && g.age>=25 && g.age<=35 && g.money<100000,
      choices:[
        { label:'咬牙结婚', hint:'-💰💰💰 +😊 +👥', fn: g => { g.flags.marriageCost=true; g.flags.married=true; return{money:-200000,mood:20,social:15}; }},
        { label:'简约婚礼', hint:'-💰 +😊 +✨', fn: g => { g.flags.marriageCost=true; g.flags.minimalWedding=true; return{money:-30000,mood:15,charm:10}; }},
        { label:'不结婚', hint:'+💰 +😊', fn: g => { g.flags.marriageCost=true; g.flags.noMarriage=true; return{money:5000,mood:10}; }},
        { label:'再等等', hint:'+🧠', fn: g => { g.flags.marriageCost=true; return{intel:5}; }},
      ]},
    { id:'single_economy', icon:'💍', title:'单身经济',
      body:'你发现了一个新词：单身经济。\n\n"单身经济——一个人也要好好生活，一个人也要消费得起。"\n\n你看了看产品：\n- 一人食：小份菜、单人火锅、迷你电饭煲\n- 迷你家电：小型洗衣机、单人烤箱\n- 宠物经济：猫狗陪伴\n- 一人旅行：定制行程、拼房旅行\n\n2025年，中国单身经济规模突破4万亿元，超过2.4亿单身成年人。\n\n"都市白领在婚前的亲密朋友数量平均仅有3个。"\n\n你开始享受单身生活：\n- 一个人吃火锅\n- 一个人看电影\n- 一个人旅行\n- 养一只猫/狗\n\n"单身不是失败，而是选择——选择自由，选择独立，选择为自己而活。"\n\n但你也在思考：单身经济是解放，还是孤独的代名词？',
      cond: g => !g.flags.singleEconomy && g.age>=22 && g.age<=35 && !g.flags.married,
      choices:[
        { label:'享受单身', hint:'+😊 +💰', fn: g => { g.flags.singleEconomy=true; g.flags.singleHappy=true; return{mood:15,money:3000}; }},
        { label:'投资自己', hint:'+🧠 +✨', fn: g => { g.flags.singleEconomy=true; g.flags.selfInvestment=true; return{intel:12,charm:10,money:-5000}; }},
        { label:'养宠物陪伴', hint:'-💰 +😊 +❤️', fn: g => { g.flags.singleEconomy=true; g.flags.hasPet=true; return{money:-3000,mood:18,health:5}; }},
        { label:'渴望脱单', hint:'+😊 -💰', fn: g => { g.flags.singleEconomy=true; return{mood:8,money:-2000}; }},
      ]},
    // === v7.7 EVENTS - 预制朋友圈、赛博养生、新型职业 ===
    { id:'premade_moments', icon:'📸', title:'预制朋友圈',
      body:'你发现了一个新玩法：预制朋友圈。\n\n"扛起相机就是兵，换装七套，挑战一天拍完一个月朋友圈。"\n\n你花了6个小时，拍了1536张照片，够发两个月的朋友圈了。\n\n接下来的日子里，你按计划分批发布：\n- 周一：咖啡厅读书照（配文：周末的慵懒时光）\n- 周三：健身房自拍（配文：自律给我自由）\n- 周五：美食打卡（配文：生活需要仪式感）\n- 周日：旅行风景（配文：诗和远方）\n\n朋友们纷纷点赞："你的生活好精彩！"\n\n但你知道，这些照片都是同一天拍的，你换了7套衣服，化了3次妆。\n\n"在数字的世界里，人们展示的不是生活，而是对生活的诠释。"\n\n"朋友圈可以预制，但真实的生活无法预演。"\n\n你开始思考：当"生活"被预制，我们在朋友圈中看到的，还是真实的自我吗？',
      cond: g => !g.flags.premadeMoments && g.age>=20 && g.age<=35 && g.charm>=50,
      choices:[
        { label:'精心打造人设', hint:'+✨ +👥 -💰', fn: g => { g.flags.premadeMoments=true; g.flags.socialMediaPersona=true; return{charm:15,social:10,money:-2000}; }},
        { label:'真实记录生活', hint:'+😊 +👥', fn: g => { g.flags.premadeMoments=true; g.flags.authenticSharing=true; return{mood:12,social:8}; }},
        { label:'用于个人品牌', hint:'+💰 +✨', fn: g => { g.flags.premadeMoments=true; g.flags.personalBranding=true; return{money:5000,charm:10}; }},
        { label:'关闭朋友圈', hint:'+😊 -👥', fn: g => { g.flags.premadeMoments=true; g.flags.closeMoments=true; return{mood:15,social:-10}; }},
      ]},
    { id:'cyber_wellness', icon:'🤖', title:'赛博养生',
      body:'你最近身体不太舒服，但不想去医院排队。\n\n朋友推荐："试试赛博养生吧！"\n\n你下载了一个AI中医APP，对着手机：\n- 拍舌头：AI分析你的舌苔、舌质\n- 拍面部：AI识别你的面色、气血\n- 填问卷：AI问你睡眠、饮食、情绪\n- 把脉仪：智能设备模拟中医把脉\n\n10秒后，AI给出诊断：\n"您属于气虚体质，建议服用黄芪补气汤，配合艾灸足三里穴。"\n\n你半信半疑地照做了，居然感觉好了一些。\n\n"赛博养生——让千年中医智慧借科技重生。"\n\n但你也在想：AI真的能替代老中医的望闻问切吗？\n\n"当《黄帝内经》遇上深度学习，是传承还是亵渎？"',
      cond: g => !g.flags.cyberWellness && g.age>=22 && g.age<=45 && g.health<70,
      choices:[
        { label:'相信AI诊断', hint:'+💪 +🧠 -💰', fn: g => { g.flags.cyberWellness=true; g.flags.trustAI=true; return{health:10,intel:8,money:-500}; }},
        { label:'只当参考', hint:'+🧠 +💪', fn: g => { g.flags.cyberWellness=true; g.flags.skepticalUser=true; return{intel:10,health:5}; }},
        { label:'还是去看医生', hint:'-💰 +💪', fn: g => { g.flags.cyberWellness=true; g.flags.traditionalDoctor=true; return{money:-800,health:15}; }},
        { label:'买个智能手环', hint:'-💰 +💪 +✨', fn: g => { g.flags.cyberWellness=true; g.flags.wearableDevice=true; return{money:-1500,health:8,charm:5}; }},
      ]},
    { id:'medical_companion', icon:'🏥', title:'陪诊师',
      body:'你听说了一个新职业：陪诊师。\n\n工作内容：\n- 陪老人去医院看病\n- 帮忙挂号、排队、取药\n- 记录医嘱、提醒用药\n- 提供情感支持\n\n薪资：日薪500+，月入过万不是梦。\n\n你看到一个真实故事：\n"95后女孩辞去文员工作，转行做陪诊师。第一单客户是独居老人王奶奶，子女在外地。我陪她看了3个小时病，帮她记下了所有医嘱。王奶奶拉着我的手说：「姑娘，谢谢你，今天有你陪着，我不害怕了。」"\n\n"陪诊师——不只是职业，更是一种陪伴。"\n\n2025年，陪诊师职位同比增长30.7%，56.4%不限学历，77.4%不限经验。\n\n你开始思考：在这个原子化的社会，陪伴竟然成了一种商品。\n\n"当亲情缺席，陌生人填补了空白。"',
      cond: g => !g.flags.medicalCompanion && g.age>=22 && g.age<=40 && g.social>=50,
      choices:[
        { label:'转行做陪诊师', hint:'+💰 +😊 +👥', fn: g => { g.flags.medicalCompanion=true; g.flags.careerChangeMedical=true; return{money:8000,mood:15,social:12}; }},
        { label:'兼职做陪诊师', hint:'+💰 +😊', fn: g => { g.flags.medicalCompanion=true; g.flags.partTimeCompanion=true; return{money:3000,mood:10}; }},
        { label:'请陪诊师陪父母', hint:'-💰 +😊 +👥', fn: g => { g.flags.medicalCompanion=true; g.flags.hireCompanion=true; return{money:-2000,mood:8,social:5}; }},
        { label:'觉得不靠谱', hint:'+🧠', fn: g => { g.flags.medicalCompanion=true; return{intel:5}; }},
      ]},
    { id:'pet_funeral', icon:'🐾', title:'宠物殡葬师',
      body:'你的猫/狗陪伴了你10年，今天它走了。\n\n你不知道该怎么办，朋友推荐了一个新职业：宠物殡葬师。\n\n你来到宠物殡葬中心：\n- 温柔的告别仪式：播放舒缓音乐，鲜花环绕\n- 专业的遗体整理：擦拭、梳毛、穿上最爱的衣服\n- 个性化的火化：可以选择单独火化，保留骨灰\n- 纪念品制作：爪印银饰、骨灰钻石、纪念相册\n\n殡葬师说："我们不仅是送别，更是生命教育。"\n\n你看着它安详的样子，泪水止不住地流。\n\n"宠物殡葬师——让告别有尊严，让爱有归处。"\n\n2025年，中国宠物数量超过1.2亿只，每年有数百万只宠物离世。宠物殡葬师成为年轻人择业的新方向。\n\n"73.6%的宠物主将宠物视为家庭成员，81.2%愿意为宠物安排正式告别。"\n\n你开始理解：告别也是一种爱。\n\n"死亡不是终点，遗忘才是。"',
      cond: g => !g.flags.petFuneral && g.age>=20 && g.age<=45 && g.flags.hasPet,
      choices:[
        { label:'为宠物办仪式', hint:'-💰 +😊 +❤️', fn: g => { g.flags.petFuneral=true; g.flags.properFarewell=true; return{money:-3000,mood:20,social:5}; }},
        { label:'简单火化', hint:'-💰 +😊', fn: g => { g.flags.petFuneral=true; g.flags.simpleFarewell=true; return{money:-800,mood:12}; }},
        { label:'转行做殡葬师', hint:'+💰 +😊 +🧠', fn: g => { g.flags.petFuneral=true; g.flags.careerChangePet=true; return{money:6000,mood:15,intel:10}; }},
        { label:'不再养宠物', hint:'+😊 -❤️', fn: g => { g.flags.petFuneral=true; g.flags.noMorePets=true; return{mood:8,social:-5}; }},
      ]},
    // === v7.8 CRISIS EVENTS - 危机事件系统 ===
    { id:'health_crisis_hospital', icon:'🚑', title:'健康危机：住院',
      body:'你突然晕倒了，被送到医院。\n\n医生诊断：过度劳累、免疫力下降、营养不良。\n\n"你的身体在抗议——它已经撑不住了。"\n\n住院3天，花费8000元。\n\n你躺在病床上，看着天花板，开始反思：工作真的比健康重要吗？\n\n护士说："你是这个月第5个因为过劳住院的年轻人了。"\n\n"健康是1，其他都是0——但没有健康，0再多也没有意义。"',
      cond: g => g.health <= 20 && g.health > 10 && !g.flags.healthCrisisHospital,
      choices:[
        { label:'请假休息一个月', hint:'-💰 +💪 +😊', fn: g => { g.flags.healthCrisisHospital=true; g.flags.healthWarning=true; return{money:-15000,health:25,mood:15}; }},
        { label:'出院继续工作', hint:'+💰 -💪 -😊', fn: g => { g.flags.healthCrisisHospital=true; g.flags.ignoreHealthWarning=true; return{money:5000,health:-10,mood:-15}; }},
        { label:'辞职养身体', hint:'-💰💰 +💪 +😊', fn: g => { g.flags.healthCrisisHospital=true; g.flags.quitForHealth=true; setJob(g,'待业中',0); return{money:-5000,health:30,mood:20}; }},
      ]},
    { id:'money_crisis_debt', icon:'💸', title:'金钱危机：催收电话',
      body:'你的手机响了：未知号码。\n\n"您好，这里是XX贷款公司，您已逾期3个月，请问什么时候还款？"\n\n你看了看银行卡余额：-85000元。\n\n你借了网贷、信用卡、朋友钱，现在催收电话一天打20个。\n\n"贫穷不是罪，但贫穷会让你觉得自己有罪。"\n\n你开始理解：为什么有人说"钱不是万能的"——因为没钱的时候，你连说这句话的资格都没有。\n\n催收员说："如果今天不还款，我们会联系您的紧急联系人。"\n\n你的通讯录里，还有谁愿意接你的电话？',
      cond: g => g.money <= -50000 && !g.flags.debtCrisis,
      choices:[
        { label:'找父母借钱', hint:'+💰 -👥 +😊', fn: g => { g.flags.debtCrisis=true; g.flags.borrowFromParents=true; if(G.relationships) G.relationships.family = clamp((G.relationships.family||60)-20,0,100); return{money:80000,mood:-10,social:-5}; }},
        { label:'打三份工还债', hint:'+💰 -💪 -😊', fn: g => { g.flags.debtCrisis=true; g.flags.workToPayDebt=true; return{money:30000,health:-15,mood:-20}; }},
        { label:'申请个人破产', hint:'+😊 -💰 -👥', fn: g => { g.flags.debtCrisis=true; g.flags.bankruptcy=true; return{money:50000,mood:10,social:-15,charm:-10}; }},
        { label:'逃避，换手机号', hint:'+😊 -👥 -💰', fn: g => { g.flags.debtCrisis=true; g.flags.evade=true; return{mood:-5,social:-20,money:-10000}; }},
      ]},
    { id:'mood_crisis_breakdown', icon:'😭', title:'情绪危机：崩溃',
      body:'你在公司厕所里哭了。\n\n不是因为某件事，而是所有事的叠加：工作压力、房租上涨、父母催婚、朋友疏远、身体疲惫。\n\n你蹲在地上，眼泪止不住地流。\n\n"你不是不够坚强，而是坚强太久了。"\n\n同事敲门："你没事吧？"\n\n你擦了擦眼泪，说："没事，马上出来。"\n\n但你知道：你已经有事了。而且不是一天两天了。\n\n"成年人的崩溃，往往就在一瞬间——但那根稻草，已经压了很久。"\n\n你需要帮助。不是鸡汤，不是"加油"，而是真正的、专业的帮助。',
      cond: g => g.mood <= 20 && g.mood > 10 && !g.flags.emotionalBreakdown,
      choices:[
        { label:'预约心理咨询师', hint:'-💰 +😊 +🧠', fn: g => { g.flags.emotionalBreakdown=true; g.flags.seekTherapy=true; return{money:-800,mood:20,intel:5}; }},
        { label:'请假旅行散心', hint:'-💰 +😊 +💪', fn: g => { g.flags.emotionalBreakdown=true; g.flags.mentalHealthBreak=true; return{money:-5000,mood:25,health:10}; }},
        { label:'硬撑，告诉自己没事', hint:'+💰 -😊 -💪', fn: g => { g.flags.emotionalBreakdown=true; g.flags.suppressEmotions=true; return{money:3000,mood:-10,health:-8}; }},
        { label:'打电话给家人/朋友', hint:'+😊 +👥', fn: g => { g.flags.emotionalBreakdown=true; g.flags.reachOut=true; if(G.relationships) { G.relationships.family = clamp((G.relationships.family||60)+10,0,100); G.relationships.friends = clamp((G.relationships.friends||40)+10,0,100); } return{mood:15,social:10}; }},
      ]},
    { id:'relationship_crisis_breakup', icon:'💔', title:'感情危机：分手',
      body:'你和恋人吵架了。\n\n不是第一次，也不是最后一次。但这次，你们都说出了那句不想说的话。\n\n"我们分手吧。"\n\n你收拾东西，搬出了那个一起住了2年的房子。\n\n"爱情不是生活的全部——但没有爱情的时候，生活好像缺了一块。"\n\n你看着空荡荡的房间，想起你们刚在一起时的样子。\n\n那时候你说："我们会一直在一起。"\n\n现在你明白：永远太长了，能走过一段，已经是幸运。\n\n"分手不是失败，是两个人都不再适合彼此的未来。"\n\n你的朋友圈：有人安慰，有人看热闹，有人沉默。\n\n但你知道：真正的痛，是夜深人静时，习惯性地想给某人发消息，却发现那个号码已经不在通讯录里了。',
      cond: g => g.flags.hasPartner && g.relationships && g.relationships.partner <= 25 && !g.flags.breakupCrisis,
      choices:[
        { label:'挽回，好好沟通', hint:'+😊 +👥 -💰', fn: g => { g.flags.breakupCrisis=true; g.flags.tryToReconcile=true; if(G.relationships) G.relationships.partner = clamp((G.relationships.partner||0)+15,0,100); return{mood:10,social:5,money:-2000}; }},
        { label:'接受分手，向前看', hint:'+😊 -👥 +🧠', fn: g => { g.flags.breakupCrisis=true; g.flags.hasPartner=false; g.flags.partnerName=''; if(G.relationships) G.relationships.partner = 0; return{mood:-15,intel:10}; }},
        { label:'借酒消愁', hint:'+😊 -💪 -💰', fn: g => { g.flags.breakupCrisis=true; g.flags.drinkToForget=true; if(G.relationships) G.relationships.partner = 0; g.flags.hasPartner=false; return{mood:5,health:-10,money:-3000}; }},
        { label:'疯狂工作麻痹自己', hint:'+💰 -😊 -💪', fn: g => { g.flags.breakupCrisis=true; g.flags.workaholicAfterBreakup=true; if(G.relationships) G.relationships.partner = 0; g.flags.hasPartner=false; return{money:15000,mood:-20,health:-10}; }},
      ]},
    { id:'social_crisis_isolation', icon:'🏝️', title:'社交危机：孤立',
      body:'你发现：你已经一个月没有和朋友见面了。\n\n手机里的微信消息，90%是工作群和广告。\n\n你发了条朋友圈，2小时过去，只有3个赞——其中一个是妈妈的。\n\n"你不是没有朋友，而是朋友们都在忙自己的生活。"\n\n你开始理解：成年人的友谊，不是疏远，而是各自忙碌。\n\n但你也在想：如果有一天你需要帮助，谁会第一个出现？\n\n"孤独不是身边没有人，而是心里没有人懂。"\n\n你打开通讯录，翻了翻，发现能打电话的人，一只手数得过来。\n\n你开始明白：社交不是数量，而是质量。\n\n"在这个连接过度的时代，真正的连接，反而成了奢侈品。"',
      cond: g => g.social <= 20 && !g.flags.socialIsolationCrisis,
      choices:[
        { label:'主动联系老朋友', hint:'+👥 +😊 -💰', fn: g => { g.flags.socialIsolationCrisis=true; g.flags.reconnectFriends=true; G.relationships.friends = clamp((G.relationships.friends||40)+20,0,100); return{social:15,mood:15,money:-1000}; }},
        { label:'加入兴趣社群', hint:'+👥 +✨ -💰', fn: g => { g.flags.socialIsolationCrisis=true; g.flags.joinCommunity=true; return{social:20,charm:10,money:-500}; }},
        { label:'享受独处', hint:'+😊 +🧠 -👥', fn: g => { g.flags.socialIsolationCrisis=true; g.flags.embraceSolitude=true; return{mood:10,intel:10,social:-5}; }},
        { label:'养宠物陪伴', hint:'-💰 +😊 +❤️', fn: g => { g.flags.socialIsolationCrisis=true; g.flags.hasPet=true; return{money:-3000,mood:18,health:5}; }},
      ]},
    { id:'family_crisis_conflict', icon:'👨‍👩‍👧', title:'家庭危机：父母施压',
      body:'妈妈打来电话："你什么时候结婚？隔壁小王的孩子都会打酱油了。"\n\n你说："妈，我现在还不想结婚。"\n\n妈妈说："你都28了，再不结婚就晚了。你爸说你太自私了。"\n\n你沉默了。\n\n"父母的期望，是爱，也是压力。"\n\n你想起小时候，他们希望你考100分；现在，他们希望你结婚生子。\n\n你永远无法满足他们的期待——因为他们的期待，是他们未完成的人生。\n\n"孝顺不是听话，而是在爱自己的同时，也爱他们。"\n\n你挂了电话，看着窗外的城市。\n\n这座城市里有你的梦想，但也有他们的失望。\n\n"我们这一代人的困境：既不想活成父母的样子，又不想让他们失望。"',
      cond: g => g.age >= 26 && g.age <= 35 && g.relationships && g.relationships.family <= 40 && !g.flags.familyPressureCrisis,
      choices:[
        { label:'回家一趟，好好沟通', hint:'+👥 +😊 -💰', fn: g => { g.flags.familyPressureCrisis=true; g.flags.familyTalk=true; G.relationships.family = clamp((G.relationships.family||60)+20,0,100); return{social:10,mood:15,money:-2000}; }},
        { label:'妥协，开始相亲', hint:'+👥 -😊 -✨', fn: g => { g.flags.familyPressureCrisis=true; g.flags.startMatchmaking=true; G.relationships.family = clamp((G.relationships.family||60)+15,0,100); return{social:5,mood:-10,charm:-5}; }},
        { label:'坚持自己，暂时疏远', hint:'+✨ -👥 +🧠', fn: g => { g.flags.familyPressureCrisis=true; g.flags.distanceFromFamily=true; G.relationships.family = clamp((G.relationships.family||60)-15,0,100); return{charm:5,social:-10,intel:5}; }},
        { label:'写长信解释', hint:'+🧠 +👥 +😊', fn: g => { g.flags.familyPressureCrisis=true; g.flags.writeLetter=true; G.relationships.family = clamp((G.relationships.family||60)+10,0,100); return{intel:8,social:5,mood:10}; }},
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
    { id:'concert_fan', icon:'🎤', name:'演唱会粉丝', desc:'抢到演唱会门票', check: g => g.flags.concertTicket },
    { id:'china_travel_host', icon:'✈️', name:'China Travel大使', desc:'推广中国旅游', check: g => g.flags.chinaTravel },
    { id:'weekend_traveler', icon:'🚄', name:'周末特种兵', desc:'周末旅游打卡', check: g => g.flags.weekendTravel },
    { id:'live_streamer', icon:'📱', name:'直播带货达人', desc:'成为主播', check: g => g.flags.liveStreaming },
    { id:'scandal_survivor', icon:'💥', name:'网红翻车幸存者', desc:'经历网红翻车', check: g => g.flags.influencerScandal },
    { id:'pet_parent', icon:'🐱', name:'毛孩子家长', desc:'养了宠物', check: g => g.flags.hasPet },
    { id:'pet_medical_expert', icon:'🏥', name:'宠物医疗专家', desc:'经历宠物看病', check: g => g.flags.petMedical },
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
    // v3.8 achievements
    { id:'matchmaking_corner_visitor', icon:'💑', name:'相亲角体验者', desc:'经历公园相亲', check: g => g.flags.matchmakingCorner },
    { id:'retirement_planner', icon:'👴', name:'延迟退休规划者', desc:'面对延迟退休', check: g => g.flags.delayedRetirement },
    // v3.9 achievements
    { id:'wellness_beginner', icon:'🏥', name:'养生新手', desc:'开始轻养生', check: g => g.flags.lightWellness || g.flags.gymMember },
    { id:'dazi_master', icon:'👥', name:'搭子达人', desc:'找到了搭子', check: g => g.flags.foodDazi || g.flags.sportsDazi || g.flags.travelDazi },
    { id:'crisis_planner', icon:'⚠️', name:'危机规划者', desc:'面对35岁危机', check: g => g.flags.age35Crisis && (g.flags.sidePlan || g.flags.civilServicePrep) },
    // v4.0 achievements
    { id:'pickle_master', icon:'📱', name:'电子榨菜品鉴师', desc:'享受电子榨菜下饭', check: g => g.flags.electronicPickle },
    { id:'smart_shopper', icon:'💸', name:'反向消费达人', desc:'成为平替专家', check: g => g.flags.reverseConsumption },
    // v4.1 achievements
    { id:'guzi_collector', icon:'🎭', name:'吃谷人', desc:'开始收集谷子', check: g => g.flags.guziCollector },
    { id:'mbti_master', icon:'🧩', name:'MBTI专家', desc:'做了MBTI测试', check: g => g.flags.mbtiTest },
    // v4.2 achievements
    { id:'budget_traveler', icon:'🎒', name:'特种兵游客', desc:'体验特种兵旅游', check: g => g.flags.specialForcesTravel },
    { id:'city_explorer', icon:'🏙️', name:'City玩家', desc:'体验City感生活', check: g => g.flags.cityOrNot },
    // v4.3 achievements
    { id:'emotional_shopper', icon:'💝', name:'情绪消费者', desc:'为快乐买单', check: g => g.flags.emotionalValue },
    // v4.4 achievements
    { id:'ai_adapter', icon:'🤖', name:'AI适应者', desc:'学会使用AI工具', check: g => g.flags.aiToolUser || g.flags.aiTrainer },
    { id:'ai_entrepreneur', icon:'💻', name:'AI创业者', desc:'尝试AI副业', check: g => g.flags.aiSideHustle },
    // v4.5 achievements
    { id:'dopamine_dresser', icon:'👗', name:'多巴胺穿搭师', desc:'尝试色彩穿搭', check: g => g.flags.colorfulStyle },
    { id:'town_writer', icon:'🏘️', name:'县城文学作者', desc:'写县城故事', check: g => g.flags.writer && g.flags.smallTownNostalgia },
    // v4.6 achievements
    { id:'slow_living_pioneer', icon:'🌿', name:'慢生活先锋', desc:'实践慢生活', check: g => g.flags.mindfulLiving || g.flags.dailyReader },
    { id:'dopamine_detoxer', icon:'🧘', name:'多巴胺断舍离', desc:'完成多巴胺断舍离', check: g => g.flags.dopamineFasting && g.flags.digitalDetox },
    // v4.7 achievements
    { id:'abstract_artist', icon:'🎭', name:'抽象艺术家', desc:'体验抽象文化', check: g => g.flags.abstractCulture },
    { id:'meme_lord', icon:'😂', name:'梗王', desc:'成为网络热梗玩家', check: g => g.flags.internetMeme },
    // v4.8 achievements
    { id:'boundary_setter', icon:'🚪', name:'边界感大师', desc:'实践断亲或轻断亲', check: g => g.flags.familyDisconnect },
    // v4.9 achievements
    { id:'quiet_quitter', icon:'😶', name:'精神离职者', desc:'实践安静离职', check: g => g.flags.quietQuitting },
    { id:'burnout_survivor', icon:'🔥', name:'职业倦怠幸存者', desc:'经历职业倦怠', check: g => g.flags.jobBurnout },
    // v5.0 achievements
    { id:'single_and_proud', icon:'💎', name:'单身贵族', desc:'享受单身生活', check: g => g.flags.singleAndHappy },
    { id:'marriage_free', icon:'💍', name:'不婚主义者', desc:'坚持不婚主义', check: g => g.flags.committedSingle },
    // v5.1 achievements
    { id:'slash_master', icon:'⚡', name:'斜杠青年', desc:'开展副业', check: g => g.flags.slashYouth },
    { id:'side_hustle_survivor', icon:'💔', name:'副业幸存者', desc:'经历副业翻车', check: g => g.flags.sideHustleFail },
    // v5.2 achievements
    { id:'digital_child', icon:'👨‍👩‍👧', name:'电子孩子', desc:'关注电子爸妈', check: g => g.flags.digitalParents },
    // v5.3 achievements
    { id:'gap_explorer', icon:'🌍', name:'间隔年探索者', desc:'体验Gap Year', check: g => g.flags.gapYear },
    // v5.4 achievements
    { id:'rational_learner', icon:'📚', name:'理性学习者', desc:'理性看待考研', check: g => g.flags.postgradCooling },
    // v5.5 achievements
    { id:'coffee_dreamer', icon:'☕', name:'咖啡店老板', desc:'开了咖啡店', check: g => g.flags.coffeeShopOwner || g.flags.mediaEntrepreneur },
    // v5.6 achievements
    { id:'world_citizen', icon:'🌏', name:'数字游民', desc:'成为数字游民', check: g => g.flags.digitalNomad },
    // v5.7 achievements
    { id:'savings_master', icon:'💰', name:'存钱达人', desc:'完成存钱挑战', check: g => g.flags.savingsChallenge },
    // v5.8 achievements
    { id:'urban_farmer', icon:'🌱', name:'都市农夫', desc:'阳台种菜成功', check: g => g.flags.balconyGarden },
    // v5.9 achievements
    { id:'hanfu_enthusiast', icon:'👘', name:'汉服爱好者', desc:'体验汉服文化', check: g => g.flags.hanfuCulture },
    // v6.0 achievements
    { id:'zen_seeker', icon:'🏯', name:'佛系青年', desc:'去寺庙寻求心灵慰藉', check: g => g.flags.templeVisit },
    // v6.1 achievements
    { id:'city_explorer_pro', icon:'🚶', name:'城市漫步者', desc:'体验Citywalk', check: g => g.flags.citywalk },
    // v6.2 achievements
    { id:'murder_mystery_pro', icon:'🎭', name:'剧本杀玩家', desc:'体验剧本杀', check: g => g.flags.murderMystery },
    { id:'detective_fan', icon:'🔍', name:'推理达人', desc:'玩硬核推理本', check: g => g.flags.detectiveFan },
    { id:'escape_master', icon:'🔐', name:'密室逃脱者', desc:'体验密室逃脱', check: g => g.flags.escapeRoom },
    { id:'puzzle_master', icon:'🧩', name:'解谜高手', desc:'完成解谜主题密室', check: g => g.flags.puzzleMaster },
    { id:'immersive_fan', icon:'🎪', name:'沉浸式体验家', desc:'观看沉浸式演出', check: g => g.flags.immersiveTheater },
    // v6.3 achievements
    { id:'livestream_shopper', icon:'📱', name:'直播间常客', desc:'体验直播带货', check: g => g.flags.livestreamShopping },
    { id:'smart_consumer', icon:'🧠', name:'理性消费者', desc:'做功课再下单', check: g => g.flags.smartConsumer },
    { id:'ev_owner', icon:'🚗', name:'新能源车主', desc:'购买新能源汽车', check: g => g.flags.newEnergyCar },
    { id:'tech_enthusiast', icon:'🤖', name:'科技发烧友', desc:'体验智能驾驶', check: g => g.flags.techEnthusiast },
    // v6.4 achievements
    { id:'homeowner_struggle', icon:'🏠', name:'房奴', desc:'在高房价下买房', check: g => g.flags.housingDilemma && g.flags.hasHouse },
    { id:'renter_life', icon:'📦', name:'租房一族', desc:'选择租房生活', check: g => g.flags.renter },
    { id:'single_forever', icon:'💍', name:'不婚主义', desc:'坚持不婚不育', check: g => g.flags.singleForever },
    { id:'silver_entrepreneur', icon:'👴', name:'银发经济创业者', desc:'投身养老产业', check: g => g.flags.silverEconomy },
    // v6.5 achievements
    { id:'digital_nomad_pro', icon:'💻', name:'数字游民', desc:'成为自由职业者', check: g => g.flags.digitalNomad },
    { id:'freelancer', icon:'🎨', name:'自由职业者', desc:'远程工作或自由接单', check: g => g.flags.freelancer },
    { id:'civil_service_veteran', icon:'📋', name:'考公老手', desc:'参加公务员考试', check: g => g.flags.civilServiceExam },
    { id:'persistent_examinee', icon:'🔄', name:'二战三战', desc:'多次参加考公', check: g => g.flags.secondCareer },
    // v6.6 achievements
    { id:'slash_youth', icon:'💼', name:'斜杠青年', desc:'开展副业', check: g => g.flags.sideHustle },
    { id:'street_vendor', icon:'🛒', name:'摆摊达人', desc:'摆摊创业', check: g => g.flags.streetVendor },
    { id:'frugal_master', icon:'📉', name:'消费降级大师', desc:'实践消费降级', check: g => g.flags.consumptionDowngrade },
    { id:'minimalist', icon:'🎯', name:'极简主义者', desc:'选择极简生活', check: g => g.flags.minimalist },
    { id:'pingti_expert', icon:'🔄', name:'平替专家', desc:'拥抱平替文化', check: g => g.flags.pingtiCulture },
    // v6.7 achievements
    { id:'ai_creator', icon:'🤖', name:'AI创作者', desc:'学习AI创作', check: g => g.flags.aiCreation },
    { id:'ai_artist', icon:'🎨', name:'AI艺术家', desc:'用AI做绘画创作', check: g => g.flags.aiArtist },
    { id:'opc_founder', icon:'🏢', name:'一人公司创始人', desc:'创办一人公司', check: g => g.flags.onePersonCompany },
    { id:'ai_tool_master', icon:'🛠️', name:'AI工具达人', desc:'掌握AI工具', check: g => g.flags.aiToolUser },
    // v6.8 achievements
    { id:'pet_parent', icon:'🐾', name:'宠物家长', desc:'养宠物', check: g => g.flags.petEconomy },
    { id:'cat_lover', icon:'🐱', name:'猫奴', desc:'养猫', check: g => g.flags.catOwner },
    { id:'dog_lover', icon:'🐶', name:'铲屎官', desc:'养狗', check: g => g.flags.dogOwner },
    { id:'outdoor_enthusiast', icon:'⛰️', name:'户外爱好者', desc:'参与户外运动', check: g => g.flags.outdoorSports },
    { id:'hiker_pro', icon:'🥾', name:'徒步达人', desc:'开始徒步', check: g => g.flags.hiker },
    { id:'community_leader', icon:'👥', name:'社群领袖', desc:'成为户外社群主理人', check: g => g.flags.communityLeader },
    // v6.9 achievements
    { id:'graduate_student', icon:'🎓', name:'研究生', desc:'考上研究生', check: g => g.flags.graduateStudent },
    { id:'rational_choice', icon:'🧠', name:'理性选择者', desc:'理性看待考研', check: g => g.flags.graduateExam },
    { id:'family_cutter', icon:'🔪', name:'断亲青年', desc:'选择断亲', check: g => g.flags.cutFamilyTies },
    { id:'temple_visitor', icon:'🏯', name:'寺庙常客', desc:'体验烧香拜佛', check: g => g.flags.templeEconomy },
    // v7.0 achievements
    { id:'virtual_child', icon:'📱', name:'电子孩子', desc:'依赖电子爸妈', check: g => g.flags.virtualParents },
    { id:'ai_friend', icon:'🤖', name:'AI朋友', desc:'使用AI陪伴', check: g => g.flags.aiCompanion },
    { id:'emotional_worker', icon:'💔', name:'情感劳动者', desc:'从事情感服务', check: g => g.flags.emotionalLabor },
    { id:'family_healer', icon:'❤️', name:'家庭疗愈者', desc:'反思亲子关系', check: g => g.flags.familyReflection },
    // v7.1 achievements
    { id:'guzi_collector', icon:'🎌', name:'谷子收藏家', desc:'入坑谷子经济', check: g => g.flags.goodsEconomy2 },
    { id:'cosplayer_pro', icon:'🎭', name:'Coser', desc:'玩Cosplay', check: g => g.flags.cosplay },
    { id:'ip_enthusiast', icon:'🤝', name:'IP联名爱好者', desc:'购买联名产品', check: g => g.flags.ipCollaboration },
    // v7.2 achievements
    { id:'guochao_fan', icon:'🏮', name:'国潮青年', desc:'拥抱国潮文化', check: g => g.flags.guochao },
    { id:'hanfu_lover', icon:'👘', name:'汉服爱好者', desc:'穿汉服', check: g => g.flags.hanfuFan },
    { id:'traditional_wedding', icon:'💒', name:'汉服婚礼', desc:'举办汉服婚礼', check: g => g.flags.hanfuWedding },
    { id:'culture_inheritor', icon:'🏛️', name:'文化传承者', desc:'学习传统文化', check: g => g.flags.culturalHeritage },
    // v7.3 achievements
    { id:'blind_date_survivor', icon:'💕', name:'相亲角幸存者', desc:'体验相亲角', check: g => g.flags.matchmakingCorner },
    { id:'marriage_realist', icon:'💸', name:'婚姻现实主义者', desc:'面对结婚成本', check: g => g.flags.marriageCost },
    { id:'single_happy', icon:'💍', name:'快乐单身族', desc:'享受单身生活', check: g => g.flags.singleHappy },
    // v7.4 achievements
    { id:'pension_planner', icon:'👴', name:'养老规划师', desc:'提前规划养老金', check: g => g.flags.pensionPlanning },
    { id:'mental_health_warrior', icon:'💭', name:'心理健康战士', desc:'寻求心理帮助', check: g => g.flags.seekHelp },
    { id:'age_35_survivor', icon:'🎂', name:'35岁幸存者', desc:'度过35岁危机', check: g => g.flags.age35Crisis },
    { id:'career_transformer', icon:'💪', name:'职业转型者', desc:'35岁后成功转型', check: g => g.flags.careerTransition },
    // v7.5 achievements
    { id:'pua_resister', icon:'😰', name:'PUA反抗者', desc:'拒绝职场PUA', check: g => g.flags.standUp },
    { id:'digital_detox_pro', icon:'📱', name:'数字排毒达人', desc:'戒除电子榨菜成瘾', check: g => g.flags.digitalDetox },
    { id:'pretend_worker', icon:'🎭', name:'假装上班族', desc:'体验假装上班', check: g => g.flags.pretendToWork },
    { id:'routine_keeper', icon:'💪', name:'生活节奏保持者', desc:'失业期间保持规律生活', check: g => g.flags.keepRoutine },
    // v7.6 achievements
    { id:'hometown_entrepreneur', icon:'🏘️', name:'返乡创业者', desc:'回老家创业', check: g => g.flags.hometownEntrepreneur },
    { id:'county_civil_servant', icon:'📋', name:'县城公务员', desc:'在县城考上编制', check: g => g.flags.countyCivilServant },
    { id:'gown_remover', icon:'🎓', name:'脱下长衫者', desc:'放下学历包袱', check: g => g.flags.tookOffGown },
    { id:'gap_year_taker', icon:'🌍', name:'间隔年体验者', desc:'选择gap year', check: g => g.flags.gapYear },
    // v7.7 achievements
    { id:'social_media_persona', icon:'📸', name:'人设打造师', desc:'预制朋友圈打造人设', check: g => g.flags.socialMediaPersona },
    { id:'authentic_sharer', icon:'💯', name:'真实分享者', desc:'坚持真实记录生活', check: g => g.flags.authenticSharing },
    { id:'personal_brand', icon:'🎯', name:'个人品牌专家', desc:'用社交媒体打造个人品牌', check: g => g.flags.personalBranding },
    { id:'cyber_wellness_user', icon:'🤖', name:'赛博养生达人', desc:'尝试AI中医养生', check: g => g.flags.cyberWellness },
    { id:'medical_companion', icon:'🏥', name:'陪诊师', desc:'成为陪诊师或请陪诊师', check: g => g.flags.medicalCompanion },
    { id:'pet_funeral', icon:'🐾', name:'宠物告别师', desc:'体验宠物殡葬服务', check: g => g.flags.petFuneral },
    // v7.8 crisis achievements
    { id:'health_crisis_survivor', icon:'🚑', name:'健康危机幸存者', desc:'经历健康危机并恢复', check: g => g.flags.healthCrisisHospital && g.health > 50 },
    { id:'debt_fighter', icon:'💪', name:'还债勇士', desc:'经历债务危机并努力还债', check: g => g.flags.workToPayDebt && g.money > 0 },
    { id:'therapy_seeker', icon:'💭', name:'心理咨询求助者', desc:'情绪崩溃后寻求专业帮助', check: g => g.flags.seekTherapy },
    { id:'reconciliation_master', icon:'💑', name:'感情修复大师', desc:'经历分手危机并成功挽回', check: g => g.flags.tryToReconcile && g.relationships && g.relationships.partner > 50 },
    { id:'social_rebuilder', icon:'🤝', name:'社交重建者', desc:'从孤立危机中重建社交圈', check: g => g.flags.reconnectFriends && g.social > 50 },
    { id:'family_healer', icon:'❤️', name:'家庭关系修复者', desc:'化解家庭危机', check: g => g.flags.familyTalk && g.relationships && g.relationships.family > 60 },
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

    // v7.8: 状态联动效果 - 低属性互相影响
    // 健康过低影响心情和工作效率
    if (G.health <= 30) {
        G.mood = clamp(G.mood - 2, 0, 100);
        G.social = clamp(G.social - 1, 0, 100); // 身体不好不想社交
        if (Math.random() > 0.7) { // 30%概率生病请假扣钱
            G.money -= 500;
            addEventCard({ icon: '🤒', title: '身体不适', body: '你这个月身体不太舒服，请了几天病假。', type: 'negative' });
        }
    }

    // 金钱过低影响心情和社交
    if (G.money <= -30000) {
        G.mood = clamp(G.mood - 3, 0, 100);
        G.social = clamp(G.social - 1, 0, 100); // 没钱不想出门
        if (G.relationships) {
            G.relationships.friends = clamp((G.relationships.friends||40) - 1, 0, 100); // 没钱社交减少
        }
    }

    // 心情过低影响健康和社交
    if (G.mood <= 30) {
        G.health = clamp(G.health - 2, 0, 100); // 情绪低落影响身体
        G.social = clamp(G.social - 1, 0, 100); // 不想见人
        if (G.relationships && Math.random() > 0.8) {
            G.relationships.partner = clamp((G.relationships.partner||0) - 3, 0, 100); // 情绪低落影响感情
        }
    }

    // 社交过低影响心情
    if (G.social <= 30) {
        G.mood = clamp(G.mood - 2, 0, 100);
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

    // v7.8: 更新危机警告
    updateCrisisWarnings();

    document.getElementById('play-months').textContent = G.months;
    document.getElementById('total-choices').textContent = G.choices;
    document.getElementById('total-events').textContent = G.eventsSeen;
}

// v7.8: 危机检测和警告系统
function updateCrisisWarnings() {
    const crises = detectCrises();
    const warningContainer = document.getElementById('crisis-warnings');

    if (!warningContainer) {
        // 如果容器不存在，创建一个
        const hud = document.getElementById('game-hud');
        if (hud) {
            const div = document.createElement('div');
            div.id = 'crisis-warnings';
            div.style.cssText = 'margin-top:10px; padding:8px; border-radius:6px; font-size:13px;';
            hud.appendChild(div);
        }
        return;
    }

    if (crises.length === 0) {
        warningContainer.style.display = 'none';
        return;
    }

    warningContainer.style.display = 'block';
    warningContainer.style.background = '#fee';
    warningContainer.style.border = '2px solid #f66';
    warningContainer.style.color = '#c33';

    const crisisText = crises.map(c => c.icon + ' ' + c.name).join(' | ');
    warningContainer.innerHTML = `<strong>⚠️ 危机警告：</strong>${crisisText}<br><small>状态过低将触发危机事件，请及时调整！</small>`;
}

function detectCrises() {
    const crises = [];

    if (G.health <= 20) crises.push({ type: 'health', name: '健康危机', icon: '💔' });
    if (G.money <= -50000) crises.push({ type: 'money', name: '债务危机', icon: '💸' });
    if (G.mood <= 20) crises.push({ type: 'mood', name: '情绪危机', icon: '😭' });
    if (G.social <= 20) crises.push({ type: 'social', name: '孤立危机', icon: '🏝️' });

    if (G.relationships) {
        if (G.relationships.family <= 30) crises.push({ type: 'family', name: '家庭危机', icon: '👨‍👩‍👧' });
        if (G.relationships.friends <= 20) crises.push({ type: 'friends', name: '友谊危机', icon: '👥' });
        if (G.flags.hasPartner && G.relationships.partner <= 25) crises.push({ type: 'partner', name: '感情危机', icon: '💔' });
    }

    return crises;
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
