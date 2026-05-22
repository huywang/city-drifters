// ============================================
// 都市浮生记 - Game Engine v17.1
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
    // v8.0: 事件去重 - 记录最近看过的事件ID，避免重复
    recentEventIds: [],
    // v8.0: 倒卖系统 - 背包容量5件，不同城市价格不同
    inventory: {},
    // v8.0: 连续月数追踪（用于事件链深度）
    consecutiveChoices: {},
    // v8.2: 延迟后果系统 - 某些选择的后果在数月后显现
    delayedEffects: [],
    // v9.2: 投资理财系统
    investments: {},
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

// === v8.0 倒卖交易系统 ===
// 借鉴《北京浮生记》核心玩法：低买高卖，价格波动，城市价差
const TRADE_GOODS = {
    fake_phone: { name: '华强北水货手机', icon: '📱', basePrice: 800, volatility: 0.6,
        cityMod: { shenzhen: 0.6, beijing: 1.3, shanghai: 1.4, guangzhou: 0.9, hangzhou: 1.2, chengdu: 1.1 } },
    luxury_fake: { name: '高仿奢侈品', icon: '👜', basePrice: 500, volatility: 0.5,
        cityMod: { guangzhou: 0.5, shanghai: 1.5, beijing: 1.3, shenzhen: 0.8, hangzhou: 1.1, chengdu: 1.0 } },
    concert_ticket: { name: '演唱会黄牛票', icon: '🎫', basePrice: 1200, volatility: 0.8,
        cityMod: { beijing: 1.4, shanghai: 1.5, chengdu: 0.8, shenzhen: 0.9, guangzhou: 1.0, hangzhou: 1.1 } },
    xianyu_stuff: { name: '闲鱼捡漏货', icon: '📦', basePrice: 300, volatility: 0.7,
        cityMod: { beijing: 1.0, shanghai: 1.0, shenzhen: 1.0, guangzhou: 1.0, hangzhou: 1.0, chengdu: 1.0 } },
    daigou: { name: '海外代购品', icon: '✈️', basePrice: 2000, volatility: 0.4,
        cityMod: { shanghai: 0.7, beijing: 0.9, shenzhen: 0.8, guangzhou: 1.1, hangzhou: 1.2, chengdu: 1.3 } },
    sneaker: { name: '限量球鞋', icon: '👟', basePrice: 1500, volatility: 0.7,
        cityMod: { shanghai: 0.8, beijing: 1.2, shenzhen: 1.0, guangzhou: 0.9, hangzhou: 1.1, chengdu: 1.3 } },
    blind_box: { name: '隐藏款盲盒', icon: '🎁', basePrice: 200, volatility: 0.9,
        cityMod: { beijing: 1.0, shanghai: 1.0, shenzhen: 1.0, guangzhou: 1.0, hangzhou: 1.0, chengdu: 1.0 } },
    medicine: { name: '网红保健品', icon: '💊', basePrice: 600, volatility: 0.5,
        cityMod: { chengdu: 0.7, guangzhou: 0.8, beijing: 1.2, shanghai: 1.1, shenzhen: 1.0, hangzhou: 1.0 } },
};
const MAX_INVENTORY = 5; // v8.1: 背包从8降到5，增加策略深度

// 价格波动状态（每月更新）
let tradePrices = {};
function updateTradePrices() {
    const city = G.city;
    for (const [key, good] of Object.entries(TRADE_GOODS)) {
        const cityMul = good.cityMod[city] || 1.0;
        const randomMul = 0.5 + Math.random() * good.volatility * 2;
        // 偶尔出现极端价格（10%概率暴涨暴跌）
        const extremeRoll = Math.random();
        let extremeMul = 1;
        if (extremeRoll < 0.05) extremeMul = 2.5 + Math.random(); // 5%暴涨
        else if (extremeRoll < 0.10) extremeMul = 0.2 + Math.random() * 0.3; // 5%暴跌
        tradePrices[key] = Math.floor(good.basePrice * cityMul * randomMul * extremeMul);
    }
}
function getInventoryCount() {
    let count = 0;
    for (const v of Object.values(G.inventory)) count += (v || 0);
    return count;
}

// === v8.0 突发事件系统 ===
// 打破严格回合制，在月度中间随机插入意外事件
const SURPRISE_EVENTS = [
    { id:'surprise_pickpocket', icon:'🤏', title:'地铁小偷', weight:3,
      body:'你在地铁上感觉口袋一轻——手机没了！\n\n你回头一看，一个戴鸭舌帽的中年男人正在往车门方向挤。但门已经关了。\n\n"大城市教会你的第一课：永远不要把手机放在外衣口袋。"',
      fn: g => ({money: -Math.floor(g.money * 0.05) - 500, mood: -12}) },
    { id:'surprise_find_money', icon:'💵', title:'路边捡到钱', weight:2,
      body:'你在路边捡到一个红包，打开一看——200块！\n\n你环顾四周，没人注意你。\n\n你的良心说：交给警察。你的钱包说：今天加餐。\n\n"这200块够你吃一周外卖了。"',
      fn: g => { const r = Math.random(); if (r > 0.7) { return { money: 200, mood: 10 }; } else { return { money: 200, mood: 5, health: -2 }; /* 吃了路边摊 */ } } },
    { id:'surprise_landlord', icon:'🏠', title:'房东突袭', weight:3,
      body:'你的房东突然打电话来：从下个月开始涨房租500。\n\n你："为什么？合同还没到期啊！"\n房东："不想住可以搬走，后面排队的人多着呢。"\n\n"在大城市，你不是住在房子里，你是住在别人的投资里。"',
      fn: g => { g.flags.rentHike = true; return {money: -2000, mood: -15}; } },
    { id:'surprise_mlm', icon:'🤝', title:'老同学约你吃饭', weight:4,
      body:'大学同学突然约你吃饭，你以为是叙旧——结果是安利。\n\n"我现在做的这个项目，月入五万不是梦！你只需要拉三个下线……"\n\n他两眼放光，PPT比你的年终总结还精致。\n\n"你以为他请你吃饭，其实你是他的KPI。"',
      fn: g => ({mood: -8, social: -3}) },
    { id:'surprise_chengguan', icon:'👮', title:'城管来了！', weight:2,
      body:'你在路边摊买煎饼的时候，突然一声"城管来了！"——整条街的小贩像多米诺骨牌一样开始跑。\n\n你拿着半个煎饼，站在原地不知所措。\n\n"这场面比奥运会开幕式还壮观。"',
      fn: g => { if (getInventoryCount() > 0) { /* 有货可能被没收 */ const keys = Object.keys(G.inventory).filter(k => G.inventory[k] > 0); if (keys.length > 0 && Math.random() > 0.5) { const k = keys[0]; const lost = G.inventory[k]; G.inventory[k] = 0; return {mood: -20, money: -Math.floor(lost * (tradePrices[k] || 500))}; } } return {mood: -3}; } },
    { id:'surprise_viral', icon:'📱', title:'意外走红', weight:1,
      body:'你随手拍的一段视频在抖音上了热门——100万播放！\n\n评论区有人说你是天才，有人说你是智障。但不管怎样，你火了。\n\n虽然这种热度大概只能维持48小时。\n\n"互联网造神只需要三秒钟，毁灭也只需要三秒。"',
      fn: g => { g.flags.wentViral = true; return {charm: 15, social: 10, mood: 20, money: Math.floor(Math.random() * 3000)}; } },
    { id:'surprise_scam_call', icon:'📞', title:'诈骗电话', weight:5,
      body: () => {
        const scripts = [
          '"你好，我是公安局的，你的银行账户涉嫌洗钱……"\n你差点信了，直到对方说了一句带口音的普通话。',
          '"恭喜你中奖了！只需要先交2000元手续费……"\n你心想：我连彩票都没买过。',
          '"我是你领导，明天来我办公室一趟。先转3000块到我对公账户……"\n你心想：我领导就坐我对面。',
          '"你的快递丢了，我们双倍赔偿，请提供银行卡号……"\n你看了看快递列表——你根本没买东西。',
        ];
        return scripts[Math.floor(Math.random() * scripts.length)] + '\n\n"骗子的演技，比很多演员都好。"';
      },
      fn: g => { if (g.intel > 60 || g.flags.antiFraud) { return {intel: 3, mood: 5}; /* 识破 */ } else if (Math.random() > 0.6) { return {money: -3000, mood: -20}; /* 上当 */ } else { return {intel: 2, mood: -5}; } } },
    { id:'surprise_rain', icon:'🌧️', title:'暴雨通勤', weight:4,
      body:'下班的时候突然暴雨，你的伞被大风吹翻了。你淋着雨跑了三站地铁。\n\n到地铁站的时候，你看起来像刚从游泳池里爬出来。\n\n"大城市的暴雨不挑时间，只挑你没带伞的时候。"',
      fn: g => ({health: -5, mood: -8, charm: -3}) },
    { id:'surprise_pay_cut', icon:'✂️', title:'公司降薪', weight:2,
      body:'全公司邮件：由于"经营调整"，全员降薪10%。\n\nCEO在邮件最后写道："让我们一起共渡难关。"\n\n你看了看他刚换的新保时捷——确实挺难的。\n\n"所谓共渡难关，就是老板的船永远不沉。"',
      fn: g => { if (g.jobSalary > 0) { g.jobSalary = Math.floor(g.jobSalary * 0.9); return {money: -2000, mood: -15}; } return {mood: -5}; } },
    { id:'surprise_free_food', icon:'🍜', title:'免费试吃', weight:3,
      body:'路过商场，一家新开的餐厅在搞免费试吃。你吃了三份——不是因为好吃，是因为免费。\n\n"免费的总是最贵的。但这次是真的免费。"',
      fn: g => ({health: 2, mood: 8, money: 0}) },
    { id:'surprise_traffic', icon:'🚗', title:'打车被绕路', weight:3,
      body:'你打了一辆网约车，导航显示15分钟到家。结果司机绕了40分钟。\n\n你："师傅，这不是走反了吗？"\n司机："这条路不堵。"\n你看了看手机——这条路也不通。\n\n"导航说15分钟，司机说40分钟。你永远不知道谁在说谎。"',
      fn: g => ({money: -50, mood: -8}) },
    { id:'surprise_insomnia', icon:'😵', title:'失眠之夜', weight:4,
      body:'你躺在床上，脑子里全是今天开的会、明天要交的PPT、下个月的房租、去年的年终奖……\n\n你数了300只羊，结果羊也开始加班了。\n\n凌晨3点，你终于放弃了——打开了外卖App。\n\n"失眠的人不是睡不着，是脑子不肯下班。"',
      fn: g => ({health: -4, mood: -6, money: -80}) },
    { id:'surprise_bonus', icon:'🎉', title:'意外奖金', weight:1,
      body:'公司突然发了一笔项目奖金——虽然不多，但完全出乎意料。\n\n你盯着银行短信看了三遍，确认没有小数点错误。\n\n"意外之财的快乐，比预期中的加薪还大。"',
      fn: g => ({money: Math.floor(Math.random() * 5000 + 3000), mood: 15}) },
    { id:'surprise_neighbor', icon:'🔊', title:'邻居深夜装修', weight:3,
      body:'凌晨1点，隔壁突然传来电钻声。你的邻居在装修。\n\n你去敲门，没人应。你打了物业电话，没人接。\n\n你戴上耳塞，打开白噪音App，但电钻声穿透了一切。\n\n"大城市的隔音效果，约等于没有。"',
      fn: g => ({health: -3, mood: -10}) },
    { id:'surprise_delivery', icon:'📦', title:'快递到了', weight:3,
      body: () => {
        const items = [
          '你忘了什么时候买的猫粮到了——但你没有猫。\n\n你在闲鱼上挂了三天，终于卖出去了，还赚了50块。',
          '你妈从老家寄了一箱土特产：腊肉、辣椒、还有一封手写的信。\n\n信上只有六个字："在外面照顾好自己。"\n\n你读完信，吃了三碗饭。',
          '你的快递到了，但你忘了买的是什么。\n\n拆开一看：一个你完全不记得买过的东西。\n\n你看了看订单——凌晨2点下的单。"深夜购物的你，是另一个人。"',
          '快递小哥打电话："你的快递放门口了啊。"\n\n你开门一看——门口放了五个快递，全是你的。\n\n你不记得买了这么多东西。但拆快递的快乐让你决定不去想了。\n\n"拆快递是成年人唯一的惊喜。"',
        ];
        return items[Math.floor(Math.random() * items.length)];
      },
      fn: g => { const r = Math.random(); if (r > 0.7) return {mood: 15, money: 50}; if (r > 0.4) return {mood: 10}; return {mood: 5, money: -200}; } },
    { id:'surprise_meeting', icon:'💼', title:'无意义的会议', weight:4,
      body:'你被拉进了一个两小时的会议。一个小时后你发现：这个会议本该是一封邮件。\n\n你看了看周围：有人在偷偷玩手机，有人在假装记笔记，有个人已经睡着了。\n\n"开会是打工人的合法摸鱼时间。"',
      fn: g => ({mood: -5, intel: -1}) },
    { id:'surprise_taxi_share', icon:'🚕', title:'顺风车奇遇', weight:2,
      body: () => {
        const stories = [
          '你打了一辆顺风车，拼车的是一个跟你同公司的人。你们聊了一路，发现你们做着同样的工作，拿着一样的工资，住着同一个小区。\n\n"在大城市，你以为你是独特的，其实你是可复制的。"',
          '你打了一辆顺风车，司机是个前程序员。他去年被裁了，现在全职开网约车。\n\n"我之前也996，现在007——但至少自由了。"\n\n你下车的时候，心里五味杂陈。',
          '顺风车上遇到一个阿姨，一路上给你介绍了三个相亲对象。你还没来得及拒绝，她已经把微信推给你了。\n\n"阿姨的热心，比算法还精准。"',
        ];
        return stories[Math.floor(Math.random() * stories.length)];
      },
      fn: g => { const r = Math.random(); if (r > 0.5) return {social: 5, mood: 5}; return {mood: -3, social: 3}; } },
    { id:'surprise_gym_scam', icon:'🏋️', title:'健身房跑路', weight:1,
      body:'你常去的那家健身房——跑路了。\n\n你还有8个月的会员卡没用完。你去找物业，物业说："老板已经人间蒸发了。"\n\n你的3000块会费，换来了一身教训。\n\n"健身房的倒闭速度，比你的腹肌出现速度还快。"',
      fn: g => ({money: -3000, mood: -12, health: -3}) },
    { id:'surprise_wander_cat', icon:'🐈', title:'流浪猫', weight:3,
      body:'下班路上，一只橘猫蹲在你面前，用一种"你不带我回家我就死给你看"的眼神盯着你。\n\n你蹲下来摸了摸它，它立刻蹭你的腿。\n\n你看了看自己10平米的出租屋，又看了看猫。\n\n"养猫之前你是自由的，养猫之后你是铲屎的。但自由的代价是孤独。"',
      fn: g => { if (!g.flags.hasPet) { g.flags.hasPet = true; return {mood: 15, money: -500, social: 3}; } return {mood: 5}; } },
    { id:'surprise_overtime_msg', icon:'📩', title:'周五下午6点的消息', weight:5,
      body:'周五下午5:59，你的微信响了。\n\n领导："这个PPT周一开会要用，你周末辛苦一下。"\n\n你看了看刚买好的电影票——《速度与激情》。\n\n你回复："好的领导。"\n\n然后你把电影票退了。\n\n"大城市没有周末，只有另一种形式的加班。"',
      fn: g => ({mood: -12, health: -3, money: 500}) },
    // === v8.1 新增突发事件 ===
    { id:'surprise_wechat_group', icon:'💬', title:'公司群消息轰炸', weight:4,
      body:'凌晨11点，公司群突然炸了。领导连发15条60秒语音。\n\n你听完发现：他只是分享钓鱼照片。\n\n"公司群存在的意义：让你下班后继续上班。"',
      fn: g => ({mood: -8, health: -2}) },
    { id:'surprise_food_wrong', icon:'🍔', title:'外卖送错了', weight:3,
      body:'你点了黄焖鸡，送来酸菜鱼。小哥说："你就吃这个吧。"\n\n酸菜鱼比黄焖鸡贵20块。\n\n"外卖送错是大城市唯一免费的升级服务。"',
      fn: g => { if (Math.random() > 0.5) return {mood: 8, health: 2}; return {mood: -5, money: -30}; } },
    { id:'surprise_parent_call', icon:'📞', title:'你妈来电话了', weight:3,
      body: () => {
        const c = ['你妈问：吃饭了吗？穿秋裤了吗？有对象了吗？\n\n你说完后她说："那没事了。"\n\n你挂了电话，鼻子有点酸。',
          '你妈说："你爸体检血压有点高。"\n你问严重吗。她说："不严重，就让你知道一下。"\n\n"让你知道一下"="我们不想让你担心"。',
          '你妈沉默很久："没事，就想听听你的声音。"\n\n你差点没忍住。'];
        return c[Math.floor(Math.random() * c.length)];
      },
      fn: g => { if (g.relationships) g.relationships.family = clamp((g.relationships.family||60) + 5, 0, 100); return {mood: 5, social: 2}; } },
    { id:'surprise_subway_push', icon:'🚇', title:'早高峰地铁', weight:5,
      body:'早高峰地铁，你被推进去，脸贴着陌生人的后背。\n\n你闻到他昨晚的火锅味。到站后耳机掉了一只。\n\n"早高峰地铁不是交通工具，是人体压缩机。"',
      fn: g => ({mood: -6, health: -2, charm: -1}) },
    { id:'surprise_social_compare', icon:'📱', title:'朋友圈暴击', weight:4,
      body:'刷朋友圈：室友晒特斯拉，同学晒三亚，前同事晒升职，表弟晒结婚。\n\n你看了看自己的外卖和10平米出租屋。\n\n"朋友圈是别人精心编排的预告片，你却把它当正片。"',
      fn: g => ({mood: -10, charm: -2}) },
    { id:'surprise_late_snack', icon:'🌙', title:'深夜烧烤摊', weight:3,
      body:'加班到11点路过烧烤摊。本想两串，结果吃了二十串加两瓶啤酒。\n\n"深夜烧烤是打工人的精神鸦片——明知有害，欲罢不能。"',
      fn: g => ({health: -3, mood: 10, money: -120, charm: -1}) },
    { id:'surprise_rent_due', icon:'📅', title:'月初三连击', weight:3,
      body:'月初：房租扣款、花呗还款、信用卡账单。\n\n工资还没到，账单先到了。\n\n"月初是大城市打工人的受难日。"',
      fn: g => ({money: -1500, mood: -8}) },
    { id:'surprise_wedding_invite', icon:'💒', title:'红色炸弹', weight:2,
      body:'同事发来请帖。你算了算：这个月已经出了3个份子钱了。\n\n"份子钱是中国式社交的隐形税。"',
      fn: g => ({money: -600, mood: -5, social: 3}) },
    { id:'surprise_found_wallet', icon:'👛', title:'捡到钱包', weight:1,
      body:'捡到钱包，里面有身份证和800块。你交给了派出所。\n\n失主老太太拉着你的手说："好人啊！"\n\n"做好事的快乐，比消费更上瘾。"',
      fn: g => { if (g.relationships) g.relationships.friends = clamp((g.relationships.friends||40) + 3, 0, 100); return {mood: 15, money: 200, charm: 5}; } },
    { id:'surprise_annual_leave', icon:'✈️', title:'年假批了', weight:1,
      body:'去年提的年假终于批了——只批3天。够去机场吃碗面的。\n\n"年假是法定权利，但在很多公司更像恩赐。"',
      fn: g => { if (Math.random() > 0.5) return {mood: 12, health: 5, money: -2000}; return {mood: -5}; } },
    { id:'surprise_good_review', icon:'⭐', title:'好评返现', weight:2,
      body:'"亲，五星好评返现2元~"\n\n你看了看一星的外卖，想了想2块钱。打了五星。\n\n"好评返现是这个时代最诚实的交易。"',
      fn: g => ({money: 2, mood: -2}) },
    // === v9.1 新增突发事件 ===
    { id:'surprise_ai_email', icon:'🤖', title:'AI写的邮件', weight:3,
      body:'你用AI写了一封工作邮件，领导回了一句："写得不错，以后都这么写。"\n\n你心想：他不知道这是AI写的，但他觉得我变聪明了。\n\n"AI时代的职场秘诀：让AI替你努力。"',
      fn: g => ({intel: 3, mood: 5, charm: 2}) },
    { id:'surprise_digital_detox', icon:'📵', title:'手机掉马桶', weight:2,
      body:'你的手机掉进了马桶。捞出来已经开不了机了。\n\n你去修手机，师傅说："进水了，换主板，800。"\n\n没有手机的24小时，你发现：原来生活可以这么安静。\n\n然后你焦虑了。',
      fn: g => ({money: -800, mood: -15, health: 5, intel: 3}) },
    { id:'surprise_pinduoduo', icon:'🛍️', title:'拼多多陷阱', weight:4,
      body:'你妈发来一个拼多多链接："帮我砍一刀。"\n\n你砍了。然后她又发来三个链接。\n\n你帮她砍了47刀，她的空气炸锅省了3块钱。\n\n"亲情在拼多多面前，不值一提。"',
      fn: g => ({mood: -5, social: 3}) },
    { id:'surprise_didi', icon:'🚗', title:'网约车加价', weight:3,
      body:'暴雨天叫车，加价2.5倍。你看了看500米外的地铁站——决定走路。\n\n走了100米你就后悔了。但你已经湿透了，回头也没意义。\n\n"暴雨天的打车软件，比股票还刺激。"',
      fn: g => ({health: -5, mood: -8, money: -50}) },
    { id:'surprise_colleague_secret', icon:'🤫', title:'同事的秘密', weight:2,
      body:'你无意中发现：坐你对面的同事，工资比你高50%。\n\n你们干的活一模一样，他比你晚来半年。\n\n你安慰自己：也许他有关系吧。也许他能力强吧。\n\n也许，这就是命。',
      fn: g => { if (g.job !== '待业中') { return {mood: -15, intel: 2}; } return {mood: -5}; } },
    { id:'surprise_xianyu', icon:'📱', title:'闲鱼奇遇', weight:2,
      body:'你在闲鱼上卖二手货，买家约在地铁站交易。\n\n见面一看：是你前同事。他也在卖东西。\n\n你们互相看了看对方的窘境，然后假装不认识。\n\n"闲鱼是大城市打工人的跳蚤市场——卖掉过去，凑合现在。"',
      fn: g => { const gain = Math.floor(Math.random() * 300) + 100; return {money: gain, mood: 5, social: 3}; } },
    { id:'surprise_covid_test', icon:'🧪', title:'社区通知', weight:2,
      body:'社区群发了条通知：明天早上6点核酸。\n\n你设了5:30的闹钟，结果到了发现队伍已经排了200人。\n\n你排队的时候认识了一个大爷，他教你怎么薅社区福利。\n\n"在中国，排队是国民运动。"',
      fn: g => ({health: 2, mood: -5, social: 3}) },
    { id:'surprise_power_cut', icon:'💡', title:'停电了', weight:2,
      body:'加班到一半，整栋楼停电了。\n\n你保存文件了吗？没有。\n\n你在黑暗中静坐了5分钟，突然觉得：这5分钟是你今天最平静的时刻。\n\n"停电是大城市唯一的黑暗浪漫。"',
      fn: g => ({mood: 5, health: 3}) },
    // === v9.3 新增突发事件 ===
    { id:'surprise_boss_dinner', icon:'🍻', title:'老板请吃饭', weight:2,
      body:'老板突然说："今晚请大家吃饭！"\n\n你去了才知道：这不是聚餐，是团建。老板要你们每个人表演节目。\n\n你唱了首《光辉岁月》，跑调了。老板说："有勇气！加500块绩效。"',
      fn: g => { if (g.job !== '待业中') return {mood: 5, money: 500, social: 5, charm: -2}; return {mood: -3}; } },
    { id:'surprise_health_code', icon:'🟢', title:'健康码变黄', weight:2,
      body:'你的健康码突然变黄了。你哪也没去，什么也没做。\n\n你打了12345投诉，排了2小时队做核酸。三天后自动变绿。\n\n"在大城市，你的命运由一个二维码决定。"',
      fn: g => ({mood: -10, health: -3}) },
    { id:'surprise_upgrade', icon:'💻', title:'电脑死机', weight:3,
      body:'你的工作电脑蓝屏了。硬盘里三个月的工作文件全没了。\n\nIT说："你没备份？"\n\n你心想：备份？我连觉都没时间睡，还备份。',
      fn: g => { if (g.job !== '待业中') return {mood: -15, intel: -2}; return {mood: -5}; } },
    { id:'surprise_street_food', icon:'🍢', title:'路边摊', weight:3,
      body:'加班到深夜，你在路边摊吃了碗热干面。老板多给你加了个蛋。\n\n"看你天天加班，怪辛苦的。"\n\n这碗面5块钱，但你觉得它值500。',
      fn: g => ({mood: 12, health: 3, money: -5}) },
    { id:'surprise_promotion_rumor', icon:'📢', title:'升职传言', weight:2,
      body:'公司里传开了：下个月要提拔一个主管。你觉得自己有戏。\n\n然后你看到名单：是老板的小舅子。\n\n"职场升迁靠能力——如果你老板不认识你的话。"',
      fn: g => { if (g.job !== '待业中') return {mood: -10, social: -3}; return {mood: -3}; } },
    { id:'surprise_lost_item', icon:'🔑', title:'丢钥匙', weight:2,
      body:'你把家门钥匙丢了。开锁师傅收了你300块。\n\n你站在门口看着他30秒打开锁，突然觉得自己的安全感也很脆弱。\n\n"一把钥匙300块，安全感的价格另算。"',
      fn: g => ({money: -300, mood: -8}) },
    // === v10.2 新增突发事件 ===
    { id:'surprise_birthday', icon:'🎂', title:'生日', weight:2,
      body:'今天是你生日。你发了一条朋友圈，收到了87个赞。\n\n其中50个是不太熟的人，30个是同事，只有7个是你真正的朋友。\n\n"成年人的生日，是朋友圈的狂欢，一个人的孤独。"',
      fn: g => ({mood: 5, social: 3, charm: 2}) },
    { id:'surprise_upgrade_app', icon:'📱', title:'APP更新', weight:3,
      body:'你最常用的App更新了——界面全变了，你常用的功能被移到了三级菜单。\n\n你骂了10分钟产品经理，然后默默学会了新操作。\n\n"每一次App更新，都是对用户耐心的测试。"',
      fn: g => ({mood: -5, intel: 1}) },
    { id:'surprise_free_trial', icon:'🎁', title:'免费试用', weight:2,
      body:'你注册了一个"免费试用7天"的会员服务。\n\n7天后你忘了取消，被扣了298块。\n\n"免费试用是这个时代最成功的商业模式——利用你的健忘。"',
      fn: g => ({money: -298, mood: -8}) },
    { id:'surprise_old_classmate', icon:'👋', title:'偶遇老同学', weight:2,
      body:'你在商场排队的时候，遇到了高中同学。\n\n他开了辆宝马，你说你在挤地铁。\n\n你们互相加了微信，但你心里清楚：以后不会再联系了。\n\n"老同学是大城市最熟悉的陌生人。"',
      fn: g => { const r = Math.random(); if (r > 0.7) return {social: 5, mood: -5}; return {mood: -8, social: -2}; } },
    { id:'surprise_aircon', icon:'❄️', title:'空调坏了', weight:2,
      body:'你的出租屋空调坏了。房东说维修要等一周。\n\n你买了个电风扇，但40度的风吹过来也是热的。\n\n你开始认真考虑：要不要住公司？至少公司有中央空调。\n\n"出租屋的空调，和出租屋的爱情一样——随时可能坏掉。"',
      fn: g => ({health: -5, mood: -10, money: -200}) },
    { id:'surprise_salary_compare', icon:'💰', title:'工资对比', weight:2,
      body:'你在网上看到一个帖子：《2024年各行业平均薪资》。\n\n你的行业平均月薪2万，你的月薪1万2。\n\n你安慰自己：平均数都是被大佬拉高的。你是那个"被平均"的人。\n\n"平均工资就像平均身高——姚明来了，所有人都"长高"了。"',
      fn: g => { if (g.jobSalary > 0 && g.jobSalary < 20000) return {mood: -12, intel: 2}; return {mood: -3}; } },
    { id:'surprise_nap', icon:'😴', title:'午休', weight:3,
      body:'中午你趴在工位上睡了20分钟。醒来发现口水流到了键盘上。\n\n你偷偷擦了擦，假装什么都没发生。\n\n"工位午睡是打工人的小确幸——前提是别流口水。"',
      fn: g => ({health: 3, mood: 5}) },
    // === v11.0 新增突发事件 ===
    { id:'surprise_wechat_pay_bug', icon:'💳', title:'支付故障', weight:3,
      body:'你在便利店买了瓶水，微信支付扣了两次。你找店员理论，店员说："找微信客服。"\n\n你打了客服电话，等了40分钟。最终退了回来，但你的时薪已经超过了这瓶水的价格。\n\n"移动支付很方便，直到它不方便。"',
      fn: g => ({money: -10, mood: -8}) },
    { id:'surprise_delivery_delay', icon:'📦', title:'快递延误', weight:3,
      body:'你等了三天的快递，物流信息停在"已发货"一动不动。\n\n你催了客服，客服说："亲，耐心等待哦~"\n\n又等了两天，快递到了——你买的是夏天的衣服，现在已经是秋天了。\n\n"快递的速度，取决于快递小哥的心情。"',
      fn: g => ({mood: -5}) },
    { id:'surprise_shared_bike', icon:'🚲', title:'共享单车', weight:3,
      body:'你扫了一辆共享单车，骑了5分钟发现链条掉了。\n\n你想还车，但App显示"不在停车区"。你推了20分钟找到停车区，已经迟到了。\n\n"共享单车：共享的是车，独享的是倒霉。"',
      fn: g => ({mood: -8, health: -2, charm: -1}) },
    { id:'surprise_internet_outage', icon:'📡', title:'断网了', weight:2,
      body:'你正在开视频会议，突然断网了。你用手机热点，结果信号也只有一格。\n\n领导在群里说："你怎么掉了？"\n\n你心想：我也想掉线，但我不敢。\n\n"断网是打工人唯一合法的「消失」理由。"',
      fn: g => ({mood: -10, intel: -1}) },
    { id:'surprise_lucky_draw', icon:'🎰', title:'抽奖', weight:2,
      body:'公司年会抽奖。一等奖iPhone，二等奖AirPods，三等奖保温杯。\n\n你抽到了——"参与奖"：一张公司logo的贴纸。\n\n你看了看手里的贴纸，又看了看一等奖得主——老板的儿子。\n\n"抽奖是概率游戏，但有些人的概率比你高。"',
      fn: g => { if (Math.random() > 0.85) return {money: 2000, mood: 20}; return {mood: -5, charm: -1}; } },
    { id:'surprise_food_delivery_coupon', icon:'🎫', title:'外卖红包', weight:3,
      body:'你花10分钟找了一张外卖红包：满30减3。\n\n你觉得自己赚了3块。但你花了10分钟，你的时薪远超3块。\n\n"省3块钱的快感，和赚300块一样大。这就是打工人的快乐阈值。"',
      fn: g => ({money: 3, mood: 3, intel: -1}) },
    { id:'surprise_parking_ticket', icon:'🅿️', title:'违停罚单', weight:2,
      body:'你在路边停了5分钟买杯咖啡，出来车上多了一张罚单：200元。\n\n你这杯咖啡38块，加上罚单238块。\n\n"这是你喝过最贵的咖啡。"',
      fn: g => ({money: -200, mood: -10}) },
    { id:'surprise_reunion_group', icon:'👥', title:'同学群复活', weight:2,
      body:'沉寂三年的大学同学群突然活跃了——有人在卖保险，有人在拉投票，有人在发拼多多链接。\n\n你默默设了免打扰。\n\n"同学群的复活节，永远是有人在卖东西的时候。"',
      fn: g => ({mood: -3, social: 2}) },
    { id:'surprise_typhoon', icon:'🌀', title:'台风天上班', weight:2,
      body:'台风预警，全市停工停课——除了你的公司。\n\n领导说："大家注意安全，能来尽量来。"\n\n你顶着12级大风，走了40分钟到公司。发现只来了3个人。\n\n"台风天上班的人，不是勇敢，是穷。"',
      fn: g => ({health: -8, mood: -12}) },
    { id:'surprise_random_kindness', icon:'💝', title:'陌生人的善意', weight:1,
      body:'你在地铁上打了个喷嚏，旁边的人递给你一张纸巾。\n\n你说了声谢谢，TA笑了笑说："没事，我包里有的是。"\n\n就这么一瞬间，你觉得这座城市没那么冷了。\n\n"大城市的温暖，往往来自最陌生的人。"',
      fn: g => ({mood: 12, social: 3, health: 2}) },
    { id:'surprise_salary_delay', icon:'💸', title:'工资延迟发放', weight:2,
      body:'HR发来通知："本月工资延迟至月底发放。"\n\n你看了看信用卡还款日——15号。\n\n你开始认真思考：要不要去找老板借点钱？\n\n"延迟发工资的公司，和延迟发货的卖家一样——让人想给差评。"',
      fn: g => ({money: -1000, mood: -12}) },
    { id:'surprise_found_cat', icon:'🐱', title:'猫咪碰瓷', weight:2,
      body:'你蹲在路边等外卖，一只猫走过来，直接躺在你脚边翻肚皮。\n\n你摸了它10分钟，外卖到了，但它不让你走。\n\n最终你花了20分钟才脱身。\n\n"猫咪碰瓷是世界上最可爱的犯罪。"',
      fn: g => ({mood: 10, charm: 3}) },
    // === v12.0 新增惊喜事件 ===
    { id:'surprise_pay_raise', icon:'🎉', title:'意外加薪', weight:1,
      body:'今天发工资，你发现多了2000块。问了才知道：上个月你帮别的部门救了一个项目，对方领导给你申请了额外奖金。\n\n你的同事酸了：「怎么不是我？」\n\n"有时候，多管闲事是有回报的。"',
      fn: g => ({money: 2000, mood: 15, social: 5}) },
    { id:'surprise_lost_wallet', icon:'👛', title:'钱包丢了', weight:2,
      body:'你的钱包丢了。里面有身份证、银行卡、500块现金。\n\n你花了一整天补办证件。排队3小时，办事10分钟。\n\n"大城市教会你的第二课：手机比钱包重要——因为手机丢了更惨。"',
      fn: g => ({money: -800, mood: -15}) },
    { id:'surprise_viral_post', icon:'📱', title:'随手发帖火了', weight:1,
      body:'你在小红书上随手发了一条吐槽帖，没想到一觉醒来10万赞。\n\n评论区炸了：「说出了我的心声！」「太真实了！」\n\n你涨了3000粉丝。虽然三天后就没人记得你了。\n\n"互联网的记忆只有72小时——但那72小时，你是主角。"',
      fn: g => ({charm: 8, mood: 12, social: 5}) },
    { id:'surprise_food_poisoning', icon:'🤢', title:'外卖中毒', weight:2,
      body:'你点了一份25块的外卖，吃完两小时后开始上吐下泻。\n\n你打了12315投诉，商家说：「我们已经关门了。」\n\n你在医院挂了一天盐水，花了600块。\n\n"便宜外卖的风险：你可能省了10块饭钱，但花了600块医药费。"',
      fn: g => ({health: -10, money: -600, mood: -8}) },
    { id:'surprise_old_friend', icon:'📞', title:'老友来电', weight:2,
      body:'你接到了一个很久没联系的朋友的电话。\n\n「嘿，最近怎么样？有空出来吃个饭吗？」\n\n你们聊了两个小时，从工作聊到感情，从过去聊到未来。挂电话的时候，你觉得：\n\n这个城市没那么冷了。\n\n"老朋友是最好的药——不花钱，但治百病。"',
      fn: g => ({mood: 12, social: 8}) },
    { id:'surprise_rent_increase', icon:'📈', title:'房东涨租', weight:3,
      body:'你收到房东的微信：「下个月开始房租涨500。」\n\n没有理由，没有商量，甚至没有表情包。\n\n你搜了一圈附近的房子，发现：要么更贵，要么更远，要么更破。\n\n你默默转了新的房租。\n\n"租房的真相：你不是在租房子——你是在给房东还房贷。"',
      fn: g => ({money: -3000, mood: -10}) },
    { id:'surprise_kindness', icon:'💝', title:'陌生人的善意', weight:2,
      body:'你今天心情很差。在便利店买咖啡的时候，你发现自己忘了带手机。\n\n排在你后面的陌生人说：「我帮你付吧。」\n\n你说：「不用不用。」\n\n她说：「没事，我也有过这样的时候。」然后她帮你付了28块，走了。\n\n你站在那儿，鼻子一酸。\n\n"有时候，陌生人的28块钱，比朋友的一万句「加油」更有力量。"',
      fn: g => ({mood: 15, social: 3}) },
    { id:'surprise_power_outage', icon:'🕯️', title:'突然停电', weight:2,
      body:'晚上8点，你正在赶一个明天要交的PPT。突然——停电了。\n\n你的笔记本还有15%的电。你的手机还有23%。你打开手电筒，发现自己不知道蜡烛放在哪。\n\n你坐在黑暗中，第一次听到了：楼上在吵架，隔壁在打游戏，楼下有人在弹吉他。\n\n原来这座城市，比你以为的更热闹。\n\n"停电是城市给你的礼物：一段被迫的安静。"',
      fn: g => ({mood: -5, intel: 3}) },
    { id:'surprise_found_money', icon:'💵', title:'捡到钱了', weight:1,
      body:'你在路边捡到了200块钱。你左看右看，没有摄像头，没有失主。\n\n你的内心经历了三个阶段：\n\n1. 交给警察（道德高地）\n2. 放自己口袋（经济理性）\n3. 买了一顿好的（实用主义）\n\n你选了第三个。\n\n"捡钱的道德困境：你做了正确的事——如果你不捡，下一个人也会捡。"',
      fn: g => ({money: 200, mood: 8}) },
    { id:'surprise_celebrity_encounter', icon:'⭐', title:'偶遇名人', weight:1,
      body:'你在咖啡馆排队，发现前面那个人……好像是个网红？\n\n你犹豫了三秒要不要搭话。最终你鼓起勇气：「你是xxx吗？」\n\n对方笑着说：「是呀，你好。」然后你们合了张影。\n\n你发了朋友圈，收获了200个赞——比你过去一年发的所有朋友圈加起来都多。\n\n"偶遇名人的价值：不在于见到谁——在于朋友圈能发什么。"',
      fn: g => ({charm: 5, mood: 10, social: 3}) },
    // === v13.0 新增惊喜事件 ===
    { id:'surprise_lost_phone', icon:'📱', title:'手机丢了', weight:2,
      body:'你在出租车上把手机落下了。\n\n等你发现的时候，车已经开走了。你打了20个电话——关机。\n\n你花了一整天：挂失手机号、冻结银行卡、重新下载所有App。\n\n你突然发现：你的人生全在一部手机里。没有手机，你连自己住哪都差点想不起来。\n\n"手机丢了才发现：你不是手机的主人——你是手机的奴隶。"',
      fn: g => ({money: -3000, mood: -20, social: -5}) },
    { id:'surprise_wedding_invite_v2', icon:'💌', title:'红色炸弹', weight:3,
      body:'你这个月收到了5张婚礼请柬。\n\n你算了一下：每份随礼1000，5份就是5000。你月薪8000。\n\n你开始研究「如何优雅地拒绝婚礼邀请」。\n\n最后你去了3场，推了2场。花了4000块。你吃了3顿鲍鱼，收获了0个新朋友。\n\n"红色炸弹的威力：比真正的炸弹还可怕——因为它还要还礼。"',
      fn: g => ({money: -4000, mood: -8, social: 5}) },
    { id:'surprise_found_job', icon:'💼', title:'意外offer', weight:1,
      body:'你在领英上随便更新了一下简历，第二天就有猎头找上门。\n\n「我们这边有个机会，年薪翻一倍，你感兴趣吗？」\n\n你以为是骗子。结果是真的。\n\n你犹豫了一周，最终决定接受。离职的时候你的领导说：「你走了我们怎么办？」\n你心想：以前怎么没见你这么在乎我？\n\n"有时候好运不是等来的——是你终于让别人看见了你。"',
      fn: g => { if(g.jobSalary < 15000) { setJob(g, '高级专员', g.jobSalary + 5000); } return{money: 3000, mood: 20, charm: 5}; } },
    { id:'surprise_food_poisoning_v2', icon:'🤢', title:'食物中毒', weight:2,
      body:'你点了一份18块的外卖。吃完两小时后——你开始怀疑人生。\n\n你在厕所里度过了整个晚上。你的肚子像有一台洗衣机在运转。\n\n你打开外卖App给了1星差评。商家回复：「亲，我们的食品都是经过严格检验的呢~」\n\n你决定以后再也不点那家了。但你不确定你能坚持多久——毕竟它只要18块。\n\n"便宜外卖的风险：你以为省了钱——其实你在赌命。"',
      fn: g => ({health: -12, mood: -15, money: -200}) },
    { id:'surprise_lottery_win', icon:'🎰', title:'中了小奖', weight:1,
      body:'你随手买了一张刮刮乐——中了500块！\n\n你激动得差点跳起来。你发了条朋友圈：「今天运气爆棚！」\n\n你的评论区分成了两派：\n「请客请客！」\n「快买更多彩票！」\n\n你选了第一个。请朋友吃了一顿300块的饭。赚了200块。\n\n"中彩票的意义不在于多少钱——在于那一瞬间，你相信了命运。"',
      fn: g => ({money: 500, mood: 15, social: 5}) },
    { id:'surprise_water_leak', icon:'💧', title:'漏水危机', weight:2,
      body:'你回到家发现：天花板在滴水。你的床、你的电脑、你的书——全湿了。\n\n楼上的住户说：「不是我，是管道的问题。」\n物业说：「这不是我们的责任。」\n房东说：「你自己修吧。」\n\n你花了2000块修好了。但你的MacBook进水了，维修费3000。\n\n"大城市租房最可怕的事不是房租贵——是你的东西随时可能被泡在水里。"',
      fn: g => ({money: -5000, mood: -18}) },
    { id:'surprise_reunion', icon:'🎉', title:'同学聚会', weight:2,
      body:'大学同学组织了毕业5年聚会。\n\n你去了。发现：\n张三当了总监，李四创了业，王五买了两套房，赵六——好像比上学时还帅了。\n\n只有你，还是老样子。\n\n你们聊了一晚上。散场的时候张三偷偷跟你说：「其实我去年被裁了，现在是外包。」\n\n你突然觉得：原来大家都在假装过得好。\n\n"同学聚会最真实的时刻：不是炫耀——是散场后的那句悄悄话。"',
      fn: g => ({mood: -5, social: 8, intel: 3}) },
    { id:'surprise_typhoon_v2', icon:'🌀', title:'台风天', weight:2,
      body:'台风来了。全市停工停课。\n\n你在家窝了一天。看了3部电影，吃了4顿饭，睡了一下午。\n\n你发现：原来你不需要上班也能活。原来你最喜欢的天气——是「不用出门」的天气。\n\n台风走了。你又要上班了。\n\n你看着窗外被吹倒的树，想：如果台风再来一次就好了。\n\n"台风天是大自然给打工人的带薪假期——虽然代价是城市瘫痪。"',
      fn: g => ({mood: 10, health: 3, intel: 2}) },
    { id:'surprise_stray_cat', icon:'🐱', title:'流浪猫碰瓷', weight:2,
      body:'你下班回家，一只橘猫跟了你三条街。\n\n你走它走，你停它停。你蹲下来，它蹭你的手。\n\n你把它带回了家。给它吃了根火腿肠。它赖着不走了。\n\n你现在有了一只猫。你本来不打算养宠物的——但猫不care你打不打算。\n\n"流浪猫选择你，不是因为你善良——是因为你家有火腿肠。"',
      fn: g => { g.flags.hasPet = true; return{mood: 15, money: -500, health: 3}; } },
    { id:'surprise_salary_delay_v2', icon:'💸', title:'工资延迟发放', weight:3,
      body:'公司通知：本月工资延迟到下月发放。\n\n你的房贷不会延迟。你的房租不会延迟。你的花呗不会延迟。\n\n只有你的工资会延迟。\n\n你开始研究「如何用信用卡套现度过月底」。你第一次理解了什么叫「月光族」——不是你花完了，是公司不给你发。\n\n"工资延迟是当代最大的信任危机——公司让你相信下个月一定会发。"',
      fn: g => ({money: -2000, mood: -12}) },
    { id:'surprise_street_food_v2', icon:'🍢', title:'路边摊宝藏', weight:2,
      body:'你在路边发现了一家没有招牌的小摊。一个大叔在铁板上煎饺。\n\n你点了一份——10个饺子，8块钱。你咬了一口：这是你在大城市吃过最好吃的饺子。\n\n大叔说：「我在这摆了20年了。」\n你说：「为什么没有招牌？」\n大叔说：「好吃就是最好的招牌。」\n\n"大城市的米其林不值得排队——真正的美食，藏在没有招牌的角落里。"',
      fn: g => ({mood: 10, health: 3}) },
    { id:'surprise_moving_help', icon:'📦', title:'搬家互助', weight:1,
      body:'你要搬家了。你在朋友圈发了条求助：「有没有人能帮忙搬个家？」\n\n三个朋友来了。他们帮你搬了6箱书、2个行李箱、一台洗衣机（从6楼没有电梯搬下来的）。\n\n你请他们吃了一顿火锅。花了400块。\n\n但你知道：这400块买不到搬家公司搬不到的东西——叫义气。\n\n"朋友就是那种你说「搬家」，他说「几点」的人。"',
      fn: g => ({social: 12, mood: 12, money: -400}) },
    { id:'surprise_wifi_down', icon:'📶', title:'断网了', weight:2,
      body:'你家的WiFi突然断了。\n\n你重启了路由器10次。打了客服电话3次。客服说：「技术人员会在24小时内上门。」\n\n你在没有WiFi的晚上，做了一件你很久没做的事：你看了一本书。\n\n你发现：没有网络的一个晚上，比你过去一个月都过得充实。\n\n"断网是21世纪最被低估的幸福——你终于可以不在线了。"',
      fn: g => ({mood: 5, intel: 5, health: 2}) },
    { id:'surprise_charity', icon:'❤️', title:'随手公益', weight:1,
      body:'你在地铁站看到一个募捐箱。你犹豫了一下——然后投了10块钱。\n\n你不确定这10块钱会去哪里。也许给一个孩子买了本书，也许给一个老人买了一顿饭。\n\n但你知道：这10块钱比你花在奶茶上的任何一笔都更有价值。\n\n你走出地铁站，觉得今天的空气特别好。\n\n"善良不需要理由——也不需要很多钱。"',
      fn: g => ({mood: 12, charm: 3, money: -10}) },
    { id:'surprise_old_song', icon:'🎵', title:'回忆杀', weight:2,
      body:'你在商场等电梯的时候，突然响起了一首歌——是你高中时候最喜欢的歌。\n\n你站在那儿，听完了整首歌。你的脑海里闪过：教室、操场、那个你暗恋的人、毕业那天。\n\n你打开QQ看了看——那个人的头像是灰色的。已经离线好几年了。\n\n你笑了笑。走出商场的时候，你哼着那首歌。\n\n"音乐是时间机器——一首歌就能把你送回10年前。"',
      fn: g => ({mood: 8, intel: 2}) },
    // === v14.0 新增惊喜事件 ===
    { id:'surprise_lucky_draw_v2', icon:'🎰', title:'抽奖中了！', weight:1,
      body:'你随手参加了商场的抽奖活动——居然中了一等奖！\n\n奖品是一台最新款手机，价值8000块。\n\n你激动得手都在抖。旁边的阿姨说：「年轻人运气真好，我抽了10年都没中过。」\n\n你把手机挂闲鱼了。\n\n"运气这东西——信则有，不信则...反正也不亏。"',
      fn: g => { const r = Math.random(); if (r > 0.8) { return {money: 8000, mood: 20, charm: 5}; } else { return {mood: -5}; /* 是假的 */ } } },
    { id:'surprise_celebrity', icon:'⭐', title:'偶遇明星', weight:1,
      body:'你在机场候机的时候，突然发现旁边坐着一个明星！\n\n你偷偷拍了张照片。明星发现后，对你笑了笑，还跟你合了影。\n\n你发了朋友圈，收获了100个赞。你的同事说：「真的假的？」\n\n你把照片洗出来，贴在了工位上。\n\n"追星的最高境界：让明星追你。（虽然只是看了一眼）"',
      fn: g => ({mood: 15, charm: 8, social: 5}) },
    { id:'surprise_traffic_jam', icon:'🚗', title:'大堵车', weight:3,
      body:'你打车去面试/约会，结果遇到了大堵车。\n\n导航显示：前方拥堵5公里，预计通行时间2小时。\n\n你看着时间一分一秒过去，急得在车里转圈。司机说：「年轻人，别急，这就是大城市的生活。」\n\n你迟到了。对方说：「没关系，我也堵在路上了。」\n\n"大城市的交通：不是你控制时间，是时间控制你。"',
      fn: g => ({mood: -12, charm: -5}) },
    { id:'surprise_lost_pet', icon:'🐕', title:'捡到流浪猫/狗', weight:2,
      body:'你在小区里看到一只脏兮兮的小猫/小狗，瘦得皮包骨，眼神可怜。\n\n你给它买了根火腿肠。它吃完后，蹭了蹭你的脚。\n\n你犹豫了：带回去？自己都快养不活了。不带？良心过不去。\n\n最后你把它带回了家。你的室友/对象说：「又多了一张嘴吃饭。」\n\n"收养流浪动物：你救了一条命，它治愈了你的心。"',
      fn: g => { g.flags.hasPet = true; return {mood: 12, money: -500, health: 3, social: 5}; } },
    { id:'surprise_wifi_down_v2', icon:'📶', title:'断网了！', weight:2,
      body:'你正在赶一个重要的deadline，突然——断网了。\n\n你重启路由器、打电话给运营商、甚至跑到楼下咖啡馆蹭网。\n\n等网恢复的时候，已经过了deadline。\n\n你发了条朋友圈：「现代人的命是WiFi给的。」收获了50个赞。\n\n"断网的恐惧：不是没网——是没网的时候你才发现自己什么都做不了。"',
      fn: g => ({mood: -10, intel: -3}) },
    { id:'surprise_compliment', icon:'😊', title:'陌生人的夸奖', weight:2,
      body:'你在地铁上，突然有个陌生人对你说：「你的衣服好好看！」\n\n你愣了一下，说了声谢谢。然后你开心了一整天。\n\n你发现：有时候，陌生人的一句夸奖，比朋友的十句安慰还管用。\n\n"被看见的感觉：原来我值得被夸奖。"',
      fn: g => ({mood: 10, charm: 5, social: 3}) },
    { id:'surprise_power_outage_v2', icon:'💡', title:'停电了', weight:2,
      body:'晚上10点，你正在赶工，突然停电了。\n\n你打开手机手电筒，发现整个小区都黑了。\n\n你点了根蜡烛，坐在窗边看着城市的夜景。突然发现：没有电的夜晚，星星特别亮。\n\n来电后，你发了条朋友圈：「偶尔停电，也挺好。」\n\n"停电的意义：让你看见被灯光遮蔽的星空。"',
      fn: g => ({mood: 5, intel: 3, health: 2}) },
    { id:'surprise_food_delivery_wrong', icon:'🍱', title:'外卖送错了', weight:3,
      body:'你点了一份宫保鸡丁，外卖小哥送来一份鱼香肉丝。\n\n你打电话给商家，商家说：「抱歉送错了，您先吃，我们再送一份。」\n\n于是你吃了两份。\n\n你摸着肚子想：这算不算因祸得福？\n\n"外卖送错：唯一一种让你吃两份还不胖的理由。（其实会胖）"',
      fn: g => ({health: -3, mood: 8, money: 0}) },
    { id:'surprise_old_friend_v2', icon:'👋', title:'偶遇老同学', weight:2,
      body:'你在街上走着，突然有人喊你的名字——是高中同学！\n\n你们聊了起来。ta现在是一家公司的CEO，年薪百万。\n\n你笑着说：「厉害啊！」心里想：当年ta成绩还没我好呢。\n\n你们加了微信，说「有空聚聚」。然后你们再也没联系过。\n\n"偶遇老同学：让你知道，人生没有标准答案。"',
      fn: g => ({mood: -5, social: 3, intel: 2}) },
    { id:'surprise_bonus_v2', icon:'💰', title:'意外奖金', weight:1,
      body:'公司突然发了一笔奖金——说是「季度绩效奖」。\n\n你看了看金额：5000块！你激动得差点跳起来。\n\n你的同事说：「别高兴太早，下个月可能要裁员。」\n\n你把钱存了起来。不管怎样，先开心一天。\n\n"意外奖金：老板的良心发现——虽然可能只有一天。"',
      fn: g => ({money: 5000, mood: 15}) },
    { id:'surprise_social_anxiety', icon:'😰', title:'社恐发作', weight:3,
      body:'你被拉去参加一个聚会。到场后发现：一个认识的人都没有。\n\n你站在角落，假装看手机。有人来搭话，你紧张得手心出汗。\n\n你找了个借口溜了。回家的路上，你长舒一口气。\n\n你发了条朋友圈：「社恐患者的日常。」收获了100个赞——原来大家都一样。\n\n"社恐不是病——是这个世界太吵了。"',
      fn: g => ({mood: -8, social: -5, intel: 2}) },
    { id:'surprise_good_weather', icon:'☀️', title:'好天气', weight:2,
      body:'今天天气特别好，阳光明媚，微风不燥。\n\n你走在上班的路上，突然觉得：活着真好。\n\n你拍了张天空的照片，发了朋友圈，配文：「今天也是元气满满的一天！」\n\n收获了30个赞。有人说：「被你治愈了。」\n\n"好天气的治愈力：比任何药物都有效。"',
      fn: g => ({mood: 12, health: 3, charm: 2}) },
    { id:'surprise_queue', icon:'🧍', title:'排队地狱', weight:3,
      body:'你去网红店打卡，排队2小时。\n\n你看着前面还有50个人，后面又来了50个人。你进退两难。\n\n终于轮到你了，你发现：也就那样吧。\n\n你发了条小红书：「不值得排队。」收获了1000个赞——大家都在排队。\n\n"排队的真相：你排的不是队，是从众心理。"',
      fn: g => ({mood: -10, money: -100, charm: -2}) },
    // === v15.0 新增惊喜事件（心理健康主题） ===
    { id:'surprise_therapy_breakthrough', icon:'💡', title:'咨询突破', weight:2,
      body:'今天的心理咨询，你突然想通了一件事。\n\n你意识到：你一直在为别人的期待而活——父母的、领导的、社会的。你从来没有问过自己：「我到底想要什么？」\n\n咨询师说：「这就是你今天最大的突破。」\n\n你走出咨询室，抬头看了看天空。天还是那个天，但你觉得——空气变甜了一点。\n\n"突破：不是改变了世界——是改变了自己看世界的角度。"',
      fn: g => ({mood: 15, intel: 8, health: 3}) },
    { id:'surprise_runners_high', icon:'🏃', title:'跑步者高潮', weight:2,
      body:'你跑步的时候，突然进入了一种奇妙的状态。\n\n你的脚步变得轻盈，呼吸变得均匀，大脑放空了。你不再想工作、不再想烦恼，只有「左脚、右脚」的简单节奏。\n\n跑了5公里，你觉得整个人都通透了。这就是传说中的「跑步者高潮」。\n\n你发了条朋友圈：「跑步治百病。」你的一个朋友评论：「我懒癌能治吗？」\n\n"跑步者高潮：不是兴奋——是平静。一种只有运动后才能体会的平静。"',
      fn: g => ({mood: 12, health: 8, intel: 3}) },
    { id:'surprise_deep_talk', icon:'🌙', title:'深夜谈心', weight:3,
      body:'凌晨1点，你和朋友在路边摊喝酒聊天。\n\n你们聊了很多：关于工作、关于感情、关于未来、关于那些说不出口的压力。你们平时都是「我很好」的人，今天突然都卸下了伪装。\n\n你的朋友说：「谢谢你愿意和我说这些。」你说：「谢谢你愿意听。」\n\n你们喝到凌晨3点。第二天都迟到了。但你觉得——值。\n\n"深夜谈心：不是在喝酒——是在找一个可以脆弱的空间。"',
      fn: g => ({mood: 10, social: 12, charm: 3}) },
    { id:'surprise_crying_release', icon:'😢', title:'哭一场', weight:2,
      body:'你在看一部电影的时候突然哭了。\n\n不是因为电影多感人——是因为你太久没有哭了。你的眼泪像是开了闸的水龙头，止不住。\n\n你哭了整整20分钟。哭完之后，你觉得胸口的那块大石头——消失了。\n\n你的室友看到你红肿的眼睛说：「怎么了？」你说：「没事——只是哭了一场。」\n\n"哭泣：不是脆弱——是身体自带的排毒系统。"',
      fn: g => ({mood: 8, health: 5, intel: 3}) },
    { id:'surprise_digital_detox_v2', icon:'📵', title:'数字排毒', weight:2,
      body:'你的手机掉进马桶了。\n\n你被迫断网24小时。一开始你焦虑得要命：看不到微信、刷不了抖音、连外卖都点不了。\n\n但到了下午，你发现——世界没有因为你断网而崩塌。你看了2本书、做了1顿饭、在小区里散了1小时步。\n\n你修好手机后，发现只有3条消息：2条是广告，1条是你妈问你吃了吗。\n\n"数字排毒：不是戒掉手机——是发现没有手机的世界也很精彩。"',
      fn: g => ({mood: 10, intel: 8, health: 5, charm: -2}) },
    { id:'surprise_kindness_stranger', icon:'🤗', title:'陌生人的善意', weight:2,
      body:'你在地铁上没忍住红了眼眶。\n\n一个阿姨递给你一包纸巾。她没有问你怎么了，只是轻轻拍了拍你的肩膀。\n\n你说：「谢谢。」她笑了笑就下车了。\n\n你不知道她叫什么名字，她也不知道你经历了什么。但那一刻的善意——你觉得比任何心理治疗都有效。\n\n"陌生人的善意：不是因为认识你才帮你——是因为看见了你。"',
      fn: g => ({mood: 15, social: 5, charm: 3}) },
    { id:'surprise_nature_healing', icon:'🌿', title:'自然疗愈', weight:2,
      body:'你周末去了郊外爬山。\n\n远离了城市的喧嚣，你听到了鸟叫、风声、溪流。你的手机没有信号——你第一次觉得这是一件好事。\n\n你在一棵大树下坐了一个小时。什么都没做，只是看着远处的云慢慢飘。\n\n你觉得自己的焦虑像是被风吹走了。也许古人说的「天人合一」——就是这种感觉。\n\n"自然疗愈：不是逃离城市——是提醒自己，世界比你的烦恼大得多。"',
      fn: g => ({mood: 15, health: 10, intel: 5}) },
    { id:'surprise_overthinking', icon:'🤯', title:'过度思考', weight:3,
      body:'你躺在床上，大脑开始了它的「深夜节目」。\n\n你在想：明天开会要说什么、下周的项目怎么推进、上个月说的话是不是得罪了谁、三年后自己会在哪里、人活着的意义是什么……\n\n你从凌晨1点想到了凌晨3点。什么问题都没解决，但你已经累得不行了。\n\n你的大脑是一个24小时不打烊的公司——问题是，它的CEO是你自己，而你没法开除他。\n\n"过度思考：不是在解决问题——是在制造问题。学会停下来，比想明白更重要。"',
      fn: g => ({mood: -8, health: -5, intel: 3}) },
];

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
        { label:'接受996，为梦想窒息', hint:'+💰 -❤️', fn: g => { addDelayedEffect(Math.floor(Math.random()*3)+2, {health:-12, mood:-8}, '连续996的后果终于显现了。你在办公室突然头晕目眩，差点晕倒。同事帮你叫了120。\n\n医生说："再这样下去，下次可能就不是头晕了。"\n\n"梦想窒息——不是比喻，是字面意思。"'); return{money:Math.floor(g.jobSalary*0.3),health:-10,mood:-15}; }},
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
        { label:'算了，反正也活不了几年', hint:'-❤️', fn: g => { addDelayedEffect(Math.floor(Math.random()*4)+2, {health:-15, mood:-10, money:-3000}, '你之前忽视了体检报告上的异常指标。今天你突然感到胸口一阵剧痛，被送进了急诊。\n\n医生说："如果再晚来两天……"\n\n你没让他说完。你开始后悔当初那个"算了"的决定。'); return{health:-5,mood:-5}; }},
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
    { id:'blind_date_v2', icon:'👥', title:'相亲局',
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
    { id:'health_scare_v2', icon:'🏥', title:'体检异常',
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
    { id:'parent_sick_v2', icon:'🏥', title:'父母生病了',
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
    { id:'bride_price_v2', icon:'💍', title:'天价彩礼',
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
    { id:'digital_detox_v2', icon:'📵', title:'数字戒断',
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
    { id:'side_project_v2', icon:'💡', title:'副业想法',
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
    { id:'unfinished_building_v2', icon:'🏗️', title:'烂尾楼维权',
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
    { id:'kaogong_fever_v2', icon:'📚', title:'考公上岸',
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
    { id:'consumption_downgrade_v2', icon:'📉', title:'消费降级',
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
    { id:'midlife_crisis_v2', icon:'🎭', title:'中年危机',
      body:'你35岁了。你开始想：\n\n- 我的事业到头了吗？\n- 我的婚姻还有激情吗？\n- 我的人生的意义是什么？\n\n你看着镜子里的自己：发际线后移了，肚子大了，眼神疲惫了。\n\n你想改变，但又不知道改变什么。\n\n"中年危机不是危机，是觉醒——你终于开始问自己：我到底想要什么？"',
      cond: g => g.age>=34 && g.age<=40 && g.mood<55 && !g.flags.midlifeCrisis,
      choices:[
        { label:'换赛道，重新开始', hint:'🎲 +😊 -💰', fn: g => { g.flags.midlifeCrisis=true; if(Math.random()>0.5){return{mood:25,money:-30000,charm:10}}else{return{mood:-15,money:-50000}} }},
        { label:'学新技能，提升自己', hint:'+🧠 +💰', fn: g => { g.flags.midlifeCrisis=true; return{intel:15,mood:10,money:-10000}; }},
        { label:'去旅行，寻找答案', hint:'-💰 +😊 +✨', fn: g => { g.flags.midlifeCrisis=true; g.flags.worldTravel=true; return{money:-20000,mood:20,charm:8}; }},
        { label:'接受现实，继续前行', hint:'+🧠 +😊', fn: g => { g.flags.midlifeCrisis=true; return{intel:10,mood:15}; }},
      ]},
    // ===== v2.23: MORE 2025-2026 EVENTS & BALANCE =====
    { id:'remote_work_v2', icon:'💻', title:'远程办公',
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
    { id:'summer_heat_v2', icon:'☀️', title:'高温预警',
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
    { id:'cooking_skill_v2', icon:'🍳', title:'学做饭',
      body:'你受够了外卖，决定学做饭。\n\n你买了锅碗瓢盆，看了B站教程，做了一顿"黑暗料理"。\n\n你发朋友圈："第一次做饭，求赞。"\n\n朋友评论："看起来像案发现场。"\n\n但你吃了一口，觉得：嗯，还挺好吃的。\n\n"做饭是生活的基本技能——也是爱的表达方式。"',
      cond: g => g.money>1000 && g.age>=22 && !g.flags.cookingSkill,
      choices:[
        { label:'坚持做饭', hint:'+❤️ +😊 +🧠', fn: g => { g.flags.cookingSkill=true; return{health:15,mood:12,intel:8,money:-1000}; }},
        { label:'偶尔做做', hint:'+❤️ +😊', fn: g => { g.flags.cookingSkill=true; return{health:8,mood:8,money:-500}; }},
        { label:'算了，还是外卖', hint:'-❤️ -💰', fn: g => ({health:-5,mood:-5}) },
      ]},
    { id:'volunteer_work_v2', icon:'🤝', title:'志愿者活动',
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
    { id:'reading_habit_v2', icon:'📚', title:'养成阅读习惯',
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
    { id:'salary_negotiation_v2', icon:'💼', title:'薪资谈判',
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
    { id:'health_scare_v3', icon:'🏥', title:'体检报告',
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
    { id:'short_video_addiction_v2', icon:'📱', title:'短视频成瘾',
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
    { id:'side_project_v3', icon:'💻', title:'副业项目',
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
    { id:'freelance_offer_v2', icon:'💻', title:'自由职业机会',
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
    { id:'workplace_pua_v2', icon:'😤', title:'职场PUA',
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
    { id:'dating_app_v2', icon:'💘', title:'交友软件',
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
    { id:'weekend_trip_v2', icon:'🏖️', title:'周末旅行',
      body:'你发现了一个周末短途旅行的好去处：\n\n- 高铁2小时\n- 住宿200/晚\n- 风景不错\n\n你已经很久没有出去走走了。\n\n"旅行不是为了逃避生活，是为了让生活不再需要逃避。"',
      cond: g => !g.flags.weekendTrip && g.money>5000 && g.mood<60 && Math.random()>0.5,
      choices:[
        { label:'说走就走！', hint:'-💰 +😊 +❤️', fn: g => { g.flags.weekendTrip=true; return{money:-1000,mood:20,health:5,charm:3}; }},
        { label:'约朋友一起去', hint:'-💰 +👥 +😊', fn: g => { g.flags.weekendTrip=true; return{money:-800,social:10,mood:15}; }},
        { label:'下次再说', hint:'-😊', fn: g => { g.flags.weekendTrip=true; return{mood:-5}; }},
      ]},
    // === v2.40 EVENTS ===
    { id:'lottery_ticket_v2', icon:'🎫', title:'彩票梦',
      body:'路过彩票站，你花了10块钱买了一张。\n\n"万一中了呢？"\n\n你知道概率是千万分之一，但你还是想试试。\n\n"彩票是穷人交的税——但你今天想逃一次税。"',
      cond: g => !g.flags.lotteryTicket && g.money>100 && Math.random()>0.6,
      choices:[
        { label:'买10张试试手气', hint:'-💰 🎲', fn: g => { g.flags.lotteryTicket=true; if(Math.random()>0.95){g.flags.lotteryWin=true;return{money:-100,money:50000,mood:30}}else{return{money:-100,mood:-3}} }},
        { label:'就买1张', hint:'-💰', fn: g => { g.flags.lotteryTicket=true; if(Math.random()>0.99){g.flags.lotteryWin=true;return{money:-10,money:10000,mood:20}}else{return{money:-10,mood:-2}} }},
        { label:'算了，概率太低', hint:'+🧠', fn: g => { g.flags.lotteryTicket=true; return{intel:2}; }},
      ]},
    { id:'social_media_fame_v2', icon:'📸', title:'意外走红',
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
    { id:'consumption_downgrade_v3', icon:'📉', title:'消费降级',
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
    { id:'youth_unemployment_v2', icon:'📊', title:'青年失业率',
      body:'新闻说：2025年16-24岁青年失业率16.9%-18.9%。\n\n你的同学群里，有人在考公，有人在考研，有人在送外卖，有人在家啃老。\n\n你发了条消息："大家都干嘛呢？"\n\n沉默了5分钟后，有人回复："活着。"\n\n"失业率是个数字，但对每个人来说，是一段人生。"',
      cond: g => !g.flags.youthUnemployment && g.age>=22 && g.age<=28 && (g.job==='待业中' || g.months<12),
      choices:[
        { label:'继续找工作', hint:'+🧠 -😊', fn: g => { g.flags.youthUnemployment=true; return{intel:5,mood:-10}; }},
        { label:'先做零工', hint:'+💰 -❤️', fn: g => { g.flags.youthUnemployment=true; setJob(g,'零工',5000); return{money:3000,health:-5,mood:-5}; }},
        { label:'考研提升', hint:'-💰 +🧠', fn: g => { g.flags.youthUnemployment=true; return{money:-10000,intel:15,mood:5}; }},
        { label:'接受现实', hint:'+😊', fn: g => { g.flags.youthUnemployment=true; return{mood:8}; }},
      ]},
    { id:'remote_work_v3', icon:'💻', title:'远程办公',
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
    { id:'unfinished_building_v3', icon:'🏚️', title:'烂尾楼噩梦',
      body:'你三年前买的期房，烂尾了。\n\n每个月还在还8000块的房贷，但房子连顶都没封。你去售楼处维权，看到一群同样遭遇的业主，有人哭了，有人骂了，有人沉默了。\n\n开发商说："资金链断了，我们也没办法。"\n银行说："房贷必须继续还。"\n政府说："保交楼，但需要时间。"\n\n你站在烂尾楼前，看着钢筋裸露的框架，想起了那句广告词："给你一个家。"\n\n"烂尾楼是购房者的噩梦——钱没了，房也没了，梦碎了。"',
      cond: g => g.flags.hasHouse && !g.flags.unfinishedBuilding && g.months>=36 && Math.random()>0.7,
      choices:[
        { label:'维权到底', hint:'-💰 +😊', fn: g => { g.flags.unfinishedBuilding=true; return{money:-5000,mood:10,social:5}; }},
        { label:'断供抗议', hint:'🎲 -💰💰', fn: g => { g.flags.unfinishedBuilding=true; if(Math.random()>0.6){return{money:-20000,mood:-20}}else{return{money:-50000,mood:-40}} }},
        { label:'继续等', hint:'-😊', fn: g => { g.flags.unfinishedBuilding=true; return{mood:-15}; }},
        { label:'租房住，慢慢等', hint:'-💰 -😊', fn: g => { g.flags.unfinishedBuilding=true; return{money:-3000,mood:-10}; }},
      ]},
    { id:'bride_price_v3', icon:'💰', title:'天价彩礼',
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
    { id:'age_35_crisis_v2', icon:'⚠️', title:'35岁危机',
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
    { id:'quiet_quitting_v2', icon:'😶', title:'精神离职',
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
    { id:'digital_nomad_v2', icon:'🌏', title:'数字游民',
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
    { id:'digital_nomad_v3', icon:'💻', title:'数字游民',
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
    { id:'side_hustle_v2', icon:'💼', title:'斜杠青年',
      body:'你觉得光靠工资不够花，决定搞副业。\n\n你看了看选项：\n- 写稿：影评、剧评、文案，每月2000-3000元\n- 摆摊：校门口卖甜品、首饰，每晚18:30出摊\n- 代运营：帮人管小红书、抖音，每月3000-5000元\n- 拍照：汉服跟拍、景区跟拍，每单200-500元\n- 领队：周末组织飞盘、徒步、露营\n\n"斜杠青年——主业也好，副业也罢，只要能搞钱，都是通往自由的台阶。"\n\n2024年，全国945.4万年轻人在平台发布副业服务，其中"00后"占比40.8%。\n\n"没事早点睡，有空多搞钱——这届年轻人不爱聊八卦，爱聊副业。"\n\n但你也看到了问题：时间精力有限、副业影响主业、收入不稳定、没有五险一金。',
      cond: g => !g.flags.sideHustle && g.age>=22 && g.age<=35 && g.money<50000,
      choices:[
        { label:'写稿变现', hint:'+💰 +🧠', fn: g => { g.flags.sideHustle=true; g.flags.writer=true; return{money:2500,intel:8,mood:5}; }},
        { label:'摆摊创业', hint:'+💰 +✨', fn: g => { g.flags.sideHustle=true; g.flags.streetVendor=true; if(Math.random()>0.6){return{money:4000,charm:10,social:8}}else{return{money:500,mood:-5}} }},
        { label:'技能接单', hint:'+💰 +🧠', fn: g => { g.flags.sideHustle=true; g.flags.freelancer=true; return{money:3500,intel:10,mood:8}; }},
        { label:'太累了，不搞', hint:'+😊', fn: g => { g.flags.sideHustle=true; return{mood:5,health:3}; }},
      ]},
    { id:'consumption_downgrade_v4', icon:'📉', title:'消费降级',
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
    { id:'goods_economy_v2', icon:'🎌', title:'谷子经济',
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
    { id:'workplace_pua_v3', icon:'😰', title:'职场PUA',
      body:'你的领导又在"为你好"：\n\n"我批评你是因为你还有救，别人我都不说。"\n"你这个年龄，能进我们公司是你的福气。"\n"加班是自愿的，但不加班的人我们都记在心里。"\n"你看看其他人，怎么就你做不到？"\n\n"职场PUA——用「为你好」的名义，摧毁你的自信心和判断力。"\n\n你开始怀疑自己：\n- 是不是我真的能力不行？\n- 是不是我太矫情了？\n- 离开这里我还能去哪？\n- 也许领导说得对，我应该感恩\n\n"职场PUA的本质：上司利用话语权和利益决策权，对下属进行精神控制，目的是让你产生自我怀疑，从而被迫服从。"\n\n你的选择：\n\n"员工不是机械的执行者，企业价值的盲从者，而是扮演着创造者的角色。当企业丢掉了主责主业，员工只是服从却没有真正认同，这样的企业自然留不住人心。"',
      cond: g => !g.flags.workplacePUA && g.age>=22 && g.age<=35 && g.job!=='待业中' && g.mood<=50,
      choices:[
        { label:'记录证据，准备维权', hint:'+🧠 +💪', fn: g => { g.flags.workplacePUA=true; g.flags.recordEvidence=true; return{intel:10,health:5}; }},
        { label:'正面回应，拒绝服从', hint:'+💪 +😊', fn: g => { g.flags.workplacePUA=true; g.flags.standUp=true; return{health:10,mood:15}; }},
        { label:'寻求心理帮助', hint:'-💰 +💭', fn: g => { g.flags.workplacePUA=true; g.flags.seekCounseling=true; return{money:-2000,mood:10,health:8}; }},
        { label:'辞职离开', hint:'-💰 +😊', fn: g => { g.flags.workplacePUA=true; g.flags.quit=true; return{money:-5000,mood:20,health:15}; }},
        { label:'默默忍受', hint:'-😊 -💪', fn: g => { g.flags.workplacePUA=true; return{mood:-20,health:-15,intel:-5}; }},
      ]},
    { id:'digital_addiction_v2', icon:'📱', title:'电子榨菜成瘾',
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
    { id:'delayed_retirement_v2', icon:'👴', title:'延迟退休',
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
    { id:'age_35_crisis_v3', icon:'🎂', title:'35岁危机',
      body:'你35岁了。投简历时，你发现很多岗位写着"35岁以下"。\n\n"35岁歧视——全社会的问题，却让你一个人承受。"\n\n你的处境：\n- 投了50份简历，只收到3个面试邀请\n- HR问："您35岁了，为什么还要换工作？"\n- 面试官暗示："我们团队平均年龄28岁，怕您不适应"\n- 薪资要求被砍："您这个年龄，性价比不高"\n\n"35岁正是年富力强之时，却成了职场一道难以逾越的门槛。"\n\n你的焦虑：\n- 房贷还有20年要还\n- 孩子刚上小学，教育费用越来越高\n- 父母年纪大了，医疗支出增加\n- 存款不够失业半年\n\n"当环卫工岗位都要求「35岁以下」时，暴露的不仅是年龄歧视，更是整个社会对中年劳动者价值认知的扭曲。"\n\n"35岁不是危机，而是转折点——那些能跳出「打工者思维」，主动拥抱变化的人，终将在新的价值体系中找到自己的位置。"',
      cond: g => !g.flags.age35Crisis && g.age>=33 && g.age<=37 && g.job!=='待业中',
      choices:[
        { label:'提升技能，转型', hint:'-💰 +🧠 +💪', fn: g => { g.flags.age35Crisis=true; g.flags.careerTransition=true; return{money:-5000,intel:15,charm:10}; }},
        { label:'创业', hint:'-💰 💰 🎲', fn: g => { g.flags.age35Crisis=true; g.flags.startup=true; if(Math.random()>0.5){return{money:50000,charm:20}}else{return{money:-20000,mood:-20}} }},
        { label:'考公考编', hint:'-💰 +🧠', fn: g => { g.flags.age35Crisis=true; g.flags.civilService=true; return{money:-3000,intel:12}; }},
        { label:'躺平接受', hint:'-😊 -💪', fn: g => { g.flags.age35Crisis=true; return{mood:-20,health:-10}; }},
      ]},
    // === v7.3 EVENTS - 相亲角与婚恋困境 ===
    { id:'matchmaking_corner_v2', icon:'💕', title:'相亲角',
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
    { id:'single_economy_v2', icon:'💍', title:'单身经济',
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
    // === v8.0 新增黑色幽默事件（借鉴北京浮生记风格） ===
    { id:'loan_shark', icon:'🦈', title:'民间借贷', weight:2,
      body:'你在网上看到一个广告："急用钱？无需征信，当天放款！"\n\n利息"只有"月息3%。你算了一下——年化36%。\n\n但你的花呗已经逾期了，信用卡也刷爆了。你看了看这个数字，又看了看账单。\n\n"当你开始考虑高利贷的时候，说明你已经走投无路了。"',
      cond: g => g.money < -20000 && !g.flags.loanShark,
      choices:[
        { label:'借5万应急', hint:'🎲🎲', fn: g => { g.flags.loanShark=true; g.flags.onlineLoan=true; g.flags.loanSharkOwed=true; addDelayedEffect(3, function(g2){g2.flags.loanSharkUrgent=true; return {mood:-15, money:-Math.floor(g2.money*0.1)-5000};}, '高利贷到期了。利息像雪球一样越滚越大，催收电话从早打到晚。你的通讯录好友都收到了短信。\n\n"借高利贷就像喝盐水解渴——越喝越渴。"'); return{money:50000,mood:5,health:-5}; }},
        { label:'算了，自己扛', hint:'+🧠', fn: g => ({intel:5,mood:-10}) },
        { label:'跟父母坦白', hint:'+👥 -😊', fn: g => { if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)-10,0,100); return{money:20000,mood:-15,social:5}; }},
      ]},
    { id:'loan_shark_chase', icon:'🏃', title:'催收来了', weight:1, isChain:true,
      body:'你接到了催收电话。对方说："你今天不还钱，我们就打你通讯录里所有人的电话。"\n\n你妈打来电话问："儿子，你是不是借了高利贷？"\n\n"你借的每一分钱，都有人替你记着。只是利息不同。"',
      cond: g => g.flags.loanShark && !g.flags.loanSharkPaid && g.months > 3,
      choices:[
        { label:'砸锅卖铁还钱', hint:'-💰 +😊', fn: g => { g.flags.loanSharkPaid=true; return{money:-Math.min(g.money,60000),mood:10,health:-5}; }},
        { label:'换手机号跑路', hint:'+😊 -👥', fn: g => { g.flags.loanSharkPaid=true; if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)-20,0,100); return{mood:-5,social:-15}; }},
        { label:'报警求助', hint:'🎲', fn: g => { g.flags.loanSharkPaid=true; if(Math.random()>0.5){return{mood:10,social:5}}else{return{mood:-15,money:-5000}} }},
      ]},
    { id:'rent_trap', icon:'🏠', title:'租房踩雷', weight:3,
      body:() => {
        const traps = [
          '你租的房子，隔壁是麻将馆。每天晚上10点准时开打，吵到凌晨2点。\n\n房东说："这个价格你还想安静？"\n\n"在大城市租房，噪音是标配，安静是奢侈品。"',
          '你发现你的出租屋有"室友"——蟑螂。不是一两只，是一大家子。\n\n你买了三瓶杀虫剂，打了一场"人虫大战"。你赢了，但它们明天会卷土重来。\n\n"你以为你在租房，其实你在和昆虫合租。"',
          '你搬进新房第一天，发现楼上在装修。每天早上8点准时开工，周末也不休息。\n\n你去找物业，物业说："装修是业主权利。"\n\n你去找楼上，楼上说："再忍两个月就好了。"\n\n两个月后，隔壁单元又开始装修了。',
          '你的房东是个"二房东"——他租了整套房子，然后把每间卧室单独加价租给你和另外两个人。\n\n你付的房租，够他在老家还月供了。\n\n"你不是在租房，你是在替房东还房贷。"',
        ];
        return traps[Math.floor(Math.random() * traps.length)];
      },
      cond: g => !g.flags.hasHouse && !g.flags.rentTrap,
      choices:[
        { label:'忍了，搬家太麻烦', hint:'-😊 -❤️', fn: g => { g.flags.rentTrap=true; return{mood:-10,health:-3}; }},
        { label:'花钱搬家', hint:'-💰 +😊', fn: g => { g.flags.rentTrap=true; return{money:-3000,mood:5}; }},
        { label:'跟房东理论', hint:'🎲', fn: g => { g.flags.rentTrap=true; if(g.charm>60&&Math.random()>0.4){return{money:1000,mood:10,charm:3}}else{return{mood:-15}} }},
      ]},
    { id:'food_poisoning', icon:'🤢', title:'外卖食物中毒', weight:2,
      body:'你点了一份15块钱的黄焖鸡米饭。吃完后开始上吐下泻。\n\n你打开外卖App，发现这家店评分4.9——全是刷的。\n\n你去医院挂急诊，花了800块。\n\n"15块的饭，800块的医药费。这就是省钱的下场。"',
      cond: g => g.money < 20000 && !g.flags.foodPoisoning,
      choices:[
        { label:'去急诊', hint:'-💰 +❤️', fn: g => { g.flags.foodPoisoning=true; return{money:-800,health:-5,mood:-8}; }},
        { label:'硬扛，吃点药', hint:'-❤️', fn: g => { g.flags.foodPoisoning=true; return{health:-12,mood:-5,money:-50}; }},
        { label:'给差评+投诉', hint:'🎲', fn: g => { g.flags.foodPoisoning=true; if(Math.random()>0.5){return{money:-800,mood:5,intel:2}}else{return{money:-800,health:-8,mood:-10}} }},
      ]},
    { id:'office_gossip_caught', icon:'👂', title:'被卷入办公室八卦', weight:3,
      body:'茶水间里，你无意间听到两个同事在议论：领导要换人了，新领导是个"屠夫"。\n\n你正准备悄悄离开，被其中一个发现了："哎，你听到了什么？"\n\n现在你成了"知情者"。\n\n"办公室八卦，听到是运气，传出去是灾难。"',
      cond: g => g.job !== '待业中' && !g.flags.officeGossipCaught,
      choices:[
        { label:'装傻："啊？你们在说什么？"', hint:'+😊', fn: g => { g.flags.officeGossipCaught=true; return{mood:3}; }},
        { label:'加入八卦，交换情报', hint:'+👥 🎲', fn: g => { g.flags.officeGossipCaught=true; g.flags.knowsOfficeSecret=true; if(Math.random()>0.6){return{social:8,mood:5}}else{return{social:-10,mood:-15}} }},
        { label:'直接走开，什么都不说', hint:'+🧠', fn: g => { g.flags.officeGossipCaught=true; return{intel:3,mood:-2}; }},
      ]},
    { id:'double_11_trap', icon:'🛍️', title:'双十一购物车', weight:3,
      body:'双十一到了。你的购物车里堆了37件"必买"商品，总价8000块。\n\n你告诉自己："这些都是打折的，不买就是亏。"\n\n但你的银行卡告诉你："再买就是亏。"\n\n"双十一的本质：你以为你在省钱，其实你在花钱。"',
      cond: g => g.month === 11 && !g.flags.double11,
      choices:[
        { label:'全部清空！买！', hint:'-💰 +😊', fn: g => { g.flags.double11=true; addDelayedEffect(2, {money:-3000, mood:-10}, '双十一的信用卡账单到了。你看着数字，深呼吸了一下。\n\n你买的东西有一半已经找不到了，另一半你后悔买了。\n\n"双十一买的东西，三月到了想退货——但退货比买还难。"'); return{money:-8000,mood:15,charm:5}; }},
        { label:'只买3件最需要的', hint:'-💰 +🧠', fn: g => { g.flags.double11=true; return{money:-2000,mood:5,intel:3}; }},
        { label:'一件都不买', hint:'+💰 +🧠 -😊', fn: g => { g.flags.double11=true; return{money:0,intel:5,mood:-8}; }},
        { label:'全退了', hint:'+🧠 +😊', fn: g => { g.flags.double11=true; g.flags.minimalist=true; return{intel:5,mood:3}; }},
      ]},
    { id:'spring_festival_dilemma', icon:'🧧', title:'过年回家还是留下', weight:2,
      body:'又快过年了。你妈已经打了8个电话催你回家。\n\n但回家意味着：来回高铁票1200、各种红包至少5000、七大姑八大姨的拷问……\n\n不回家意味着：清净的7天假期，但代价是你妈的冷暴力。\n\n"过年回家的本质：用金钱和尊严换一顿团圆饭。"',
      cond: g => g.month === 12 && !g.flags.springFestivalChoice && g.months > 6,
      choices:[
        { label:'回家过年', hint:'-💰 +👥 +😊', fn: g => {
          g.flags.springFestivalChoice=true; g.flags.hometownVisit=true;
          if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)+15,0,100);
          return{money:-6000,mood:15,social:8};
        }},
        { label:'留在大城市', hint:'+💰 -👥 +😊', fn: g => {
          g.flags.springFestivalChoice=true;
          if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)-10,0,100);
          return{money:3000,mood:5,social:-5};
        }},
        { label:'旅游过年', hint:'-💰 +😊 +✨', fn: g => {
          g.flags.springFestivalChoice=true;
          if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)-5,0,100);
          return{money:-5000,mood:20,charm:8};
        }},
      ]},
    { id:'shared_flat_hell', icon:'🏚️', title:'合租地狱', weight:3,
      body:() => {
        const hell = [
          '你的室友半夜2点开始练吉他。你敲门提醒，他说："我白天要上班，只有晚上有时间。"\n\n你看了看他白天11点才起床的作息——"你的白天，是我的深夜。"',
          '你的室友从不洗碗。水池里堆了两周的碗，已经开始"自我进化"了。\n\n你发了条微信提醒，他回了个"好的"——然后继续不洗。\n\n"合租最大的考验不是房租，是忍耐力的极限。"',
          '你的室友带了个"朋友"回来过夜。第二天"朋友"还在。第三天还在。\n\n你问他："你朋友什么时候走？"\n\n他说："她不是朋友，是我女朋友。"\n\n"你付的是单间房租，但享受的是三人间体验。"',
        ];
        return hell[Math.floor(Math.random() * hell.length)];
      },
      cond: g => !g.flags.hasHouse && !g.flags.flatHell && g.money < 50000,
      choices:[
        { label:'忍了', hint:'-😊', fn: g => { g.flags.flatHell=true; return{mood:-10}; }},
        { label:'找室友谈', hint:'🎲', fn: g => { g.flags.flatHell=true; if(Math.random()>0.5){return{mood:5,social:3}}else{return{mood:-15,social:-5}} }},
        { label:'自己搬走', hint:'-💰 +😊', fn: g => { g.flags.flatHell=true; return{money:-4000,mood:8}; }},
      ]},
    { id:'work_from_home_trap', icon:'💻', title:'居家办公的陷阱', weight:2,
      body:'公司宣布本周居家办公。你很高兴——终于可以边工作边摸鱼了。\n\n结果：你从早上9点坐到下午6点，中间只去了3次冰箱和2次厕所。工作效率比在公司还低。\n\n更糟糕的是：你发现自己一整天没跟任何人说话。\n\n"居家办公的自由，是另一种形式的牢笼。你的监狱没有围墙，只有WiFi。"',
      cond: g => g.job !== '待业中' && !g.flags.wfhTrap,
      choices:[
        { label:'严格规划时间', hint:'+🧠 +❤️', fn: g => { g.flags.wfhTrap=true; return{intel:5,health:3,mood:-3}; }},
        { label:'享受摸鱼的快乐', hint:'+😊 -🧠', fn: g => { g.flags.wfhTrap=true; return{mood:8,intel:-3}; }},
        { label:'去咖啡馆办公', hint:'-💰 +👥', fn: g => { g.flags.wfhTrap=true; return{money:-100,social:5,mood:5}; }},
      ]},
    { id:'medical_bill_shock', icon:'🏥', title:'看病贵到离谱', weight:2,
      body:'你感冒了，去社区医院看病。挂号费、检查费、药费——一共花了1200块。\n\n你看着处方单：一盒感冒灵、一盒板蓝根、两盒阿莫西林。\n\n你想起小时候，感冒了妈妈煮碗姜汤就好了。\n\n"看病三件套：排队两小时，看病三分钟，花了一千块。"',
      cond: g => g.health < 60 && !g.flags.medicalBillShock,
      choices:[
        { label:'乖乖付钱', hint:'-💰 +❤️', fn: g => { g.flags.medicalBillShock=true; return{money:-1200,health:8,mood:-5}; }},
        { label:'去药店自己买药', hint:'-💰 🎲', fn: g => { g.flags.medicalBillShock=true; if(Math.random()>0.4){return{money:-200,health:5}}else{return{money:-200,health:-5,mood:-8}} }},
        { label:'硬扛，多喝热水', hint:'-❤️', fn: g => { g.flags.medicalBillShock=true; return{health:-8,mood:-3}; }},
      ]},
    { id:'social_media_compare', icon:'📱', title:'朋友圈焦虑', weight:4,
      body:'你打开朋友圈：\n\n同学A买了新房，晒了房产证。\n同学B升了总监，晒了工牌。\n同学C去了马尔代夫，晒了比基尼。\n\n你看了看自己的出租屋、工位、和外卖。\n\n"朋友圈是别人的高光集锦，却是你的日常暴击。"\n\n但你不知道的是：A背着30年房贷，B已经三个月没休息了，C的照片P了两个小时。',
      cond: g => g.mood < 60 && !g.flags.socialMediaAnxiety,
      choices:[
        { label:'关掉朋友圈', hint:'+😊 +🧠', fn: g => { g.flags.socialMediaAnxiety=true; g.flags.digitalDetox=true; return{mood:12,intel:5,social:-5}; }},
        { label:'也发一条装逼的', hint:'+✨ -🧠', fn: g => { g.flags.socialMediaAnxiety=true; return{charm:5,intel:-2,mood:-3}; }},
        { label:'接受现实，继续刷', hint:'-😊', fn: g => { g.flags.socialMediaAnxiety=true; return{mood:-8}; }},
      ]},
    { id:'salary_comparison', icon:'💰', title:'工资对比暴击', weight:2,
      body:'你在脉脉上看到一个帖子：同样是工作3年，某大厂程序员年薪60万。\n\n你看了看自己的工资条——月薪8000，一年到头96000。\n\n你默默关掉了App，但那个数字像钉子一样扎在脑子里。\n\n"人比人，气死人。但不比，你永远不知道自己值多少钱。"',
      cond: g => g.jobSalary < 15000 && g.jobSalary > 0 && g.age < 35 && !g.flags.salaryCompare,
      choices:[
        { label:'准备跳槽', hint:'+🧠 🎲', fn: g => { g.flags.salaryCompare=true; if(g.intel>70&&Math.random()>0.4){g.jobSalary=Math.floor(g.jobSalary*1.5);return{mood:20,intel:5}}else{return{mood:-10,intel:3}} }},
        { label:'学新技能提升竞争力', hint:'+🧠', fn: g => { g.flags.salaryCompare=true; return{intel:8,mood:3}; }},
        { label:'算了，比上不足比下有余', hint:'+😊', fn: g => { g.flags.salaryCompare=true; return{mood:5}; }},
      ]},
    { id:'night_taxi', icon:'🚕', title:'深夜打车', weight:3,
      body:'加班到凌晨1点，你打了个出租车回家。\n\n司机是个50多岁的大叔，他说："小伙子，这么晚下班啊？"\n\n你说是。他说："我以前也是程序员，后来颈椎病犯了，干不了了。"\n\n"你以为你在用命换钱，其实你在用命换一种随时可能被替代的能力。"',
      cond: g => g.job !== '待业中' && g.jobSalary > 10000,
      choices:[
        { label:'跟司机聊聊人生', hint:'+👥 +🧠', fn: g => ({social:5,intel:3,mood:3}) },
        { label:'在后座偷偷哭一会儿', hint:'+😊 -✨', fn: g => ({mood:-5,charm:-2}) },
        { label:'到家后认真想了想未来', hint:'+🧠', fn: g => ({intel:5,mood:-3}) },
      ]},
    { id:'wechat_red_packet', icon:'🧧', title:'微信红包大战', weight:3,
      body:'公司群里，领导发了个200块红包，30个人抢。\n\n你以迅雷不及掩耳之势抢了——0.01元。\n\n你看了看排行榜：有个同事抢了68块。你怀疑他用了外挂。\n\n"抢红包是人类最后的公平——除了手速和运气。"',
      cond: g => g.job !== '待业中',
      choices:[
        { label:'发一个更大的红包', hint:'-💰 +👥 +✨', fn: g => ({money:-200,social:8,charm:5,mood:3}) },
        { label:'默默退出群聊', hint:'+😊', fn: g => ({mood:3}) },
        { label:'@领导再发一个', hint:'🎲', fn: g => { if(Math.random()>0.6){return{money:50,mood:8,social:3}}else{return{mood:-5,social:-3}} }},
      ]},
    { id:'delivery_addiction', icon:'📦', title:'外卖成瘾', weight:4,
      body:'你算了一下这个月的外卖账单——2800块。\n\n平均每天93块。你吃了47顿外卖，覆盖了方圆3公里内所有的黄焖鸡、麻辣烫、螺蛳粉。\n\n你的体重涨了3公斤，你的厨艺依然是——泡面。\n\n"外卖是大城市的脐带，它让你活着，但不让你生活。"',
      cond: g => !g.flags.deliveryAddiction && g.job !== '待业中',
      choices:[
        { label:'学做饭！买锅买菜', hint:'-💰 +❤️ +🧠', fn: g => { g.flags.deliveryAddiction=true; g.flags.cookingSkill=true; return{money:-500,health:8,intel:3,mood:5}; }},
        { label:'算了，时间就是金钱', hint:'+😊', fn: g => { g.flags.deliveryAddiction=true; return{mood:3}; }},
        { label:'只点健康餐', hint:'-💰 +❤️', fn: g => { g.flags.deliveryAddiction=true; return{money:-500,health:5,mood:-3}; }},
      ]},
    // === v8.0 事件链：炒股亏钱 → 借高利贷/割肉/死扛 ===
    { id:'stock_deep_loss', icon:'📉', title:'股票深套', weight:1, isChain:true,
      body:'你买的股票跌了40%。你的账户从10万变成了6万。\n\n你每天打开App看一次，每看一次心碎一次。\n\n同事说："要不割肉吧，止损。"\n\n但你看着那个数字，心里只有一个想法："再等等，会涨回来的。"\n\n"炒股亏钱的三个阶段：1.不卖就不亏 2.补仓拉低成本 3.装死。"',
      cond: g => g.flags.invested && g.money > 10000 && !g.flags.stockDeepLoss,
      choices:[
        { label:'割肉止损', hint:'-💰 +🧠', fn: g => { g.flags.stockDeepLoss=true; g.flags.stockCrash=true; return{money:-Math.floor(g.money*0.3),intel:5,mood:-10}; }},
        { label:'死扛不卖', hint:'🎲🎲', fn: g => { g.flags.stockDeepLoss=true; if(Math.random()>0.7){g.flags.stockRecovery=true;return{money:Math.floor(g.money*0.5),mood:25}}else{return{money:-Math.floor(g.money*0.4),mood:-20,health:-5}} }},
        { label:'补仓拉低成本', hint:'-💰 🎲', fn: g => { g.flags.stockDeepLoss=true; if(Math.random()>0.5){return{money:-5000,mood:-5}}else{return{money:-15000,mood:-15}} }},
      ]},
    // === v8.0 黑色幽默：中年人的朋友圈 ===
    { id:'midlife_social_media', icon:'📱', title:'中年朋友圈', weight:2,
      body:'你发了一条朋友圈："又是充实的一天！"\n\n配图是一杯星巴克和一台MacBook。\n\n实际上你今天投了20份简历，一个回复都没有。星巴克是蹭WiFi的，MacBook是公司的。\n\n"朋友圈是中年人最后的体面。"',
      cond: g => g.age >= 30 && g.job === '待业中' && !g.flags.midlifeSocial,
      choices:[
        { label:'继续维持人设', hint:'+✨ -😊', fn: g => { g.flags.midlifeSocial=true; return{charm:5,mood:-8}; }},
        { label:'发一条真实的', hint:'+😊 +👥 -✨', fn: g => { g.flags.midlifeSocial=true; return{mood:10,social:5,charm:-3}; }},
        { label:'删掉朋友圈', hint:'+🧠', fn: g => { g.flags.midlifeSocial=true; return{intel:3,mood:3}; }},
      ]},
    // === v8.0 突发事件链：被裁后的一系列连锁反应 ===
    { id:'post_layoff_crisis', icon:'📦', title:'被裁后的第一周', weight:1, isChain:true,
      body:'被裁的第一周：\n\n周一：睡到自然醒，假装还在上班。\n周二：投了50份简历，收到2个回复。\n周三：跟老婆说公司调整，暂时在家办公。\n周四：在星巴克坐了一天，假装在开会。\n周五：终于忍不住告诉了老婆。\n\n"被裁不是最可怕的，最可怕的是假装没被裁。"',
      cond: g => g.job === '待业中' && g.flags.techLayoff && g.age >= 30 && !g.flags.postLayoff,
      choices:[
        { label:'全力找工作', hint:'+🧠 -❤️', fn: g => { g.flags.postLayoff=true; return{intel:5,health:-5,mood:-5}; }},
        { label:'先休息一段时间', hint:'+😊 +❤️ -💰', fn: g => { g.flags.postLayoff=true; return{mood:10,health:5,money:-5000}; }},
        { label:'考虑转行', hint:'+🧠 🎲', fn: g => { g.flags.postLayoff=true; g.flags.careerChange=true; return{intel:8,mood:-3}; }},
        { label:'假装上班（瞒着家人）', hint:'-😊 -❤️', fn: g => { g.flags.postLayoff=true; g.flags.pretendToWork=true; return{mood:-15,health:-8}; }},
      ]},
    // === v8.0 更多黑色幽默 ===
    { id:'gym_new_year', icon:'🏋️', title:'新年健身计划', weight:3,
      body:'1月1日，你发了条朋友圈："新的一年，新的自己！"配了张健身房的自拍。\n\n你办了一张年卡，3600块。\n\n1月去了15次，2月去了5次，3月去了1次。\n\n4月到12月——0次。\n\n平均每次健身成本：720块。\n\n"健身房的商业模式：赚的是你不去的那部分钱。"',
      cond: g => g.month === 1 && !g.flags.gymNewYear,
      choices:[
        { label:'坚持锻炼！', hint:'+❤️ +😊', fn: g => { g.flags.gymNewYear=true; g.flags.gymMember=true; return{health:10,mood:8,money:-3600}; }},
        { label:'买卡但大概率不去', hint:'-💰', fn: g => { g.flags.gymNewYear=true; return{money:-3600,mood:3}; }},
        { label:'在家做Keep就行', hint:'+❤️ +🧠', fn: g => { g.flags.gymNewYear=true; return{health:5,intel:3,mood:5}; }},
      ]},
    { id:'office_politics_trap', icon:'🎭', title:'站队的代价', weight:2,
      body:'公司两个领导闹矛盾，你被迫选边站。\n\n你选了看起来更强的A。结果B赢了。\n\nB在周会上看着你说："有些人啊，眼光不太好。"\n\n"办公室政治的本质：你以为你在下棋，其实你是棋子。"',
      cond: g => g.job !== '待业中' && g.age >= 28 && !g.flags.officePoliticsTrap,
      choices:[
        { label:'找新领导表忠心', hint:'🎲', fn: g => { g.flags.officePoliticsTrap=true; if(Math.random()>0.5){return{mood:5,social:3}}else{return{mood:-15,social:-8}} }},
        { label:'装糊涂，谁都不站', hint:'+🧠', fn: g => { g.flags.officePoliticsTrap=true; return{intel:5,mood:-5}; }},
        { label:'趁机跳槽', hint:'-💰 +😊', fn: g => { g.flags.officePoliticsTrap=true; g.flags.careerChange=true; return{money:-2000,mood:5}; }},
      ]},
    // === v8.1 策划团队新增事件（阿墨叙事设计） ===
    { id:'roommate_from_hell', icon:'🏠', title:'室友是人类吗',
      body:'你的室友凌晨3点还在打游戏外放，你敲门提醒，他回你："你住得起单间吗？"\n\n你看了看合同：确实，你们签的是"隔断间"，严格来说连房间都不算。\n\n冰箱里你的酸奶被喝了，洗衣机的衣服三天没人收，公共区域的垃圾堆成了行为艺术。\n\n"合租是检验人性的试金石——而你室友刚好是反面教材。"',
      cond: g => !g.flags.hasHouse && g.money < 50000 && !g.flags.roommateHell,
      choices:[
        { label:'忍了，戴上降噪耳机', hint:'+🧠', fn: g => { g.flags.roommateHell=true; return{mood:-12,health:-5,intel:3}; }},
        { label:'正面对线！', hint:'🎲', fn: g => { g.flags.roommateHell=true; if(Math.random()>0.4){return{mood:8,social:-3}}else{return{mood:-20,health:-8,money:-1000}} }},
        { label:'搬走！找新房子', hint:'-💰', fn: g => { g.flags.roommateHell=true; return{money:-5000,mood:10,health:5}; }},
      ]},
    { id:'spring_ticket_war', icon:'🚄', title:'春运抢票大战',
      body:'春节到了。你打开了12306、携程、飞猪、智行，同时开抢。\n\n验证码问你："请选出所有含有红绿灯的图片"——你怀疑连AI都选不对。\n\n终于抢到了！站票。16个小时。你看着窗外飞速后退的风景，想着妈妈包的饺子。\n\n"春运是人类最大规模的周期性迁徙——而你，是其中最渺小的一只候鸟。"\n\n列车广播："本次列车超员，请无座旅客不要坐在行李箱上。"',
      cond: g => g.month >= 12 || g.month <= 2,
      choices:[
        { label:'站回去！为了妈妈的饺子', hint:'-❤️ +😊', fn: g => { g.flags.springFestivalThisYear=true; return{health:-8,mood:15,money:-800}; }},
        { label:'买黄牛票（加价3倍）', hint:'-💰 +😊', fn: g => { g.flags.springFestivalThisYear=true; return{money:-3000,mood:12}; }},
        { label:'算了，就地过年', hint:'+💰 -😊', fn: g => { return{money:2000,mood:-15,social:-5}; }},
      ]},
    { id:'colleague_karoshi_news', icon:'⚰️', title:'同事猝死了',
      body:'今天上班，隔壁工位的小王没来。下午才知道：他昨晚加班到凌晨3点，在回家的出租车上心脏骤停。\n\n他才28岁。上个月还在朋友圈说"今年要开始跑步"。\n\n公司发了内部邮件："请大家注意身体，合理安排工作。"然后HR把加班审批改成了"自愿加班"。\n\n茶水间里有人小声说："上个月他的KPI是部门第一。"\n\n"拿命换钱，拿钱换命——但命只有一条，钱可以再来。问题是，这个道理要死一次才懂。"',
      cond: g => g.job !== '待业中' && g.age >= 24 && !g.flags.colleagueKaroshi,
      choices:[
        { label:'立刻准点下班', hint:'+❤️ +😊', fn: g => { g.flags.colleagueKaroshi=true; g.flags.healthScare=true; return{health:5,mood:-8}; }},
        { label:'去健身房办卡', hint:'-💰 +❤️', fn: g => { g.flags.colleagueKaroshi=true; g.flags.gymMember=true; g.flags.fitnessJourney=true; return{money:-3000,health:10,mood:5}; }},
        { label:'"跟我有什么关系"', hint:'🎲', fn: g => { g.flags.colleagueKaroshi=true; if(Math.random()>0.6){return{mood:-3}}else{return{health:-10,mood:-15}} }},
      ]},
    { id:'ai_replacement_fear', icon:'🤖', title:'AI要替代你了',
      body:'老板开会宣布："公司引入了AI工具，效率提升了300%。"\n\n你看了看自己的工作内容——确实，AI做得比你好，比你快，还不摸鱼。\n\nHR开始"优化"你的部门。同事小张昨天还在工位上，今天他的工位已经空了。\n\n你打开招聘App，发现你的岗位描述变成了："熟练使用AI工具，有AI无法替代的核心竞争力优先。"\n\n"你学了四年编程，AI四天就学会了。但你有一样AI没有的——你会焦虑。"',
      cond: g => g.job !== '待业中' && g.intel >= 50 && !g.flags.aiReplacementFear,
      choices:[
        { label:'疯狂学AI！成为驾驭AI的人', hint:'+🧠 -💰', fn: g => { g.flags.aiReplacementFear=true; g.flags.aiSkills=true; return{intel:12,mood:-5,money:-2000}; }},
        { label:'转型做AI做不了的事', hint:'+😊', fn: g => { g.flags.aiReplacementFear=true; g.flags.careerChange=true; return{mood:8,social:5,charm:5}; }},
        { label:'假装没看到，继续摸鱼', hint:'🎲', fn: g => { g.flags.aiReplacementFear=true; if(Math.random()>0.5){return{mood:-5}}else{return{mood:-20,money:-5000}} }},
      ]},
    { id:'matchmaking_corner_v3', icon:'💒', title:'人民公园相亲角',
      body:'你妈逼你去相亲角。你的简历被挂在绳子上，跟旁边的985硕士和年薪50万的程序员并排。\n\n你的"条件"被大妈们评头论足："没房？""外地户口？""工资多少？"\n\n一个大爷看了看你的简历，摇了摇头："你这个条件，在我女儿那里排不上号。"\n\n你站在人群里，突然觉得自己像超市货架上的打折商品。\n\n"相亲角的残酷真相：你以为你在找爱情，其实你在做资产评估。"',
      cond: g => g.age >= 26 && !g.flags.married && !g.flags.hasPartner && !g.flags.matchmakingCorner,
      choices:[
        { label:'配合演出，留联系方式', hint:'+👥', fn: g => { g.flags.matchmakingCorner=true; if(Math.random()>0.6){return{social:8,charm:3,mood:5}}else{return{social:3,mood:-10,charm:-3}} }},
        { label:'"我的爱情不需要被标价"', hint:'+😊', fn: g => { g.flags.matchmakingCorner=true; return{mood:10,charm:5}; }},
        { label:'当场跟你妈吵架', hint:'-😊 -👥', fn: g => { g.flags.matchmakingCorner=true; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)-15,0,100); return{mood:-12,social:-5}; }},
      ]},
    { id:'rent_scam', icon:'🏚️', title:'黑中介陷阱',
      body:'你找了个新房子，中介说"押一付一，精装修，近地铁"。\n\n你交了钱，搬进去才发现：\n- "精装修" = 墙刷白了\n- "近地铁" = 坐公交20分钟到地铁\n- "押一付一" = 押金不退\n\n住了两个月，中介跑了，真房东来了："你谁啊？这房子是我的，中介是骗子。"\n\n你被扫地出门，行李被扔在楼道里。\n\n"在大城市租房，你不仅要跟房东斗，还要跟中介斗，跟骗子斗。最后发现，你谁都斗不过。"',
      cond: g => !g.flags.hasHouse && !g.flags.rentScam && g.money > 0,
      choices:[
        { label:'报警！找法律援助', hint:'+🧠', fn: g => { g.flags.rentScam=true; g.flags.laborRights=true; return{money:-3000,intel:5,mood:-8}; }},
        { label:'认栽，找新房子', hint:'-💰', fn: g => { g.flags.rentScam=true; return{money:-5000,mood:-15}; }},
        { label:'赖着不走，跟真房东谈判', hint:'🎲', fn: g => { g.flags.rentScam=true; if(Math.random()>0.5){return{money:-2000,mood:-5}}else{return{money:-8000,mood:-20,health:-5}} }},
      ]},
    // === v8.3 深化事件链 + 黑色幽默 ===
    { id:'wechat_moments_crisis', icon:'📱', title:'朋友圈人设崩塌',
      body:'你在朋友圈精心经营着"精致生活"人设：打卡网红餐厅、晒健身照、分享读书笔记。\n\n直到你的同事截图了你的朋友圈发到群里："你们看她/他，明明工资才8000，天天装有钱人。"\n\n你看到了截图，手在发抖。\n\n"朋友圈是成年人的简历——只是你不知道HR也在看。"',
      cond: g => g.charm >= 50 && !g.flags.momentsCrisis && g.months > 6,
      choices:[
        { label:'删掉所有朋友圈', hint:'+🧠 -✨', fn: g => { g.flags.momentsCrisis=true; addDelayedEffect(3, {charm:10, intel:5, mood:10}, '你删掉了所有朋友圈后，反而轻松了很多。你开始活在当下，而不是活在别人的点赞里。'); return{charm:-10,mood:-15,intel:5}; }},
        { label:'回怼！关你什么事', hint:'+😊 -👥', fn: g => { g.flags.momentsCrisis=true; return{mood:8,social:-10,charm:-5}; }},
        { label:'假装没看到', hint:'-😊', fn: g => { g.flags.momentsCrisis=true; addDelayedEffect(2, {mood:-8}, '你假装没看到同事的截图，但每次看到那个同事都浑身不自在。\n\n"成年人的体面，就是假装什么都没发生。"'); return{mood:-5}; }},
      ]},
    { id:'parent_video_call', icon:'📹', title:'父母的视频电话',
      body:'你妈突然要求视频通话。你赶紧把出租屋的背景换成了"整洁模式"——把脏衣服塞进衣柜，外卖盒扔进垃圾桶。\n\n视频接通后，你妈的第一句话是："你是不是又瘦了？"\n\n然后她把手机转向你爸："你看，孩子瘦了。"\n\n你爸说："让他多吃点肉。"\n\n你妈说："让他早点睡。"\n\n你爸说："让他别乱花钱。"\n\n你妈说："让他赶紧找对象。"\n\n你：……\n\n"父母的关心，总是以「让他」开头，以你沉默结束。"',
      cond: g => g.months > 3 && !g.flags.parentVideoCall,
      choices:[
        { label:'笑着说"我都好"', hint:'+👨‍👩‍👧', fn: g => { g.flags.parentVideoCall=true; if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)+8,0,100); addDelayedEffect(1, {mood:-5}, '挂了视频后你在出租屋里坐了很久。你说的"我都好"，你自己都不信。'); return{mood:5}; }},
        { label:'哭着说想家了', hint:'+😊 -💪', fn: g => { g.flags.parentVideoCall=true; if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)+15,0,100); return{mood:10,charm:-3}; }},
        { label:'"我在忙，下次再聊"', hint:'-👨‍👩‍👧', fn: g => { g.flags.parentVideoCall=true; if(g.relationships) g.relationships.family = clamp((g.relationships.family||60)-10,0,100); addDelayedEffect(4, {mood:-15, social:-5}, '你妈在电话里哭着说："你是不是不想理我们了？"\n\n你才想起来：上次说"下次再聊"，已经是4个月前了。'); return{mood:-3}; }},
      ]},
    { id:'midnight_philosophy', icon:'🌃', title:'凌晨哲学时刻',
      body:'凌晨2点，你还没睡。你打开窗户，看着城市的夜景。\n\n楼下有个外卖小哥在跑，对面有个程序员还在加班，远处有个工地还在施工。\n\n你突然开始想一些"没用"的问题：\n- 人生的意义是什么？\n- 我为什么在这里？\n- 如果当初选了另一条路会怎样？\n\n然后你看了看时间：2:15。明天还要上班。\n\n"凌晨的思考是最深刻的，也是最没用的——因为天亮后你就会忘记。"',
      cond: g => g.mood < 50 && g.health < 60,
      choices:[
        { label:'写下你的想法', hint:'+🧠 +✨', fn: g => { g.flags.midnightPhilosophy=true; addDelayedEffect(6, function(g2){g2.flags.writer=true; return {intel:10,charm:8,mood:15};}, '半年前你凌晨写下的那些文字，今天被你翻了出来。你读了一遍，发现自己当时比现在清醒得多。\n\n你把它们发到了公众号上，阅读量只有37。但有一个留言说："写到我心里去了。"'); return{intel:8,charm:3,mood:-3}; }},
        { label:'点一份外卖', hint:'+😊 -💰', fn: g => { return{mood:8,money:-80,health:-2}; }},
        { label:'强迫自己睡觉', hint:'+❤️', fn: g => { return{health:3,mood:-3}; }},
      ]},
    { id:'career_crossroad', icon:'🔀', title:'职业十字路口', weight:2,
      body:'你在这家公司干了两年了。今天领导找你谈话："公司准备提拔一个人做主管，你有兴趣吗？"\n\n你当然有兴趣。但你也知道：当了主管就要996，要管理团队，要背KPI。\n\n同时，一个猎头也找上了你："有个创业公司想挖你，薪资涨30%，期权另谈。"\n\n你站在十字路口：稳定晋升 vs 冒险跳槽。\n\n"每个选择都是一条路。你选了这条路，就永远不知道那条路的风景。"',
      cond: g => g.job !== '待业中' && g.months > 18 && g.jobSalary > 8000 && !g.flags.careerCrossroad,
      choices:[
        { label:'接受提拔，做主管', hint:'+💰 -❤️', fn: g => { g.flags.careerCrossroad=true; setJob(g, getTitle(g,'lead'), Math.floor(g.jobSalary*1.5)); addDelayedEffect(6, {health:-10, mood:-5, money:10000}, '当了半年主管，你的工资涨了，但你的黑眼圈也深了。你开始理解为什么前任主管总是叹气。'); return{money:5000,mood:10,health:-5}; }},
        { label:'跳槽去创业公司', hint:'🎲', fn: g => { g.flags.careerCrossroad=true; g.flags.careerChange=true; if(Math.random()>0.4){setJob(g,'高级'+g.job.replace('初级',''),Math.floor(g.jobSalary*1.3)); addDelayedEffect(8, function(g2){if(Math.random()>0.5){g2.flags.entrepreneur=true; return {money:50000,mood:20}}else{return {money:-20000,mood:-15}};}, '你跳槽的那家创业公司：要么上市了，要么倒闭了。无论哪种，你都学到了很多。'); return{mood:15,charm:5}}else{setJob(g,'待业中',0); return{mood:-20,money:-5000}} }},
        { label:'都拒绝，做现在的事', hint:'+😊', fn: g => { g.flags.careerCrossroad=true; addDelayedEffect(12, {mood:8, intel:5}, '一年过去了。你没升职也没跳槽。但你在现在的岗位上越来越熟练，越来越从容。\n\n有时候，不选择也是一种选择。'); return{mood:5,intel:3}; }},
      ]},
    // === v9.1 谣言触发事件 ===
    { id:'rumor_followup_job', icon:'💼', title:'内推消息来了',
      body:'上次聚会上朋友提到的那个内推机会，今天他发微信来了：岗位JD和薪资范围都发过来了。\n\n薪资确实比你现在高30%，但要求也高不少。\n\n"你考虑好了告诉我，名额有限。"',
      cond: g => g.flags.rumorJobTip && g.job !== '待业中' && g.months > 6,
      choices:[
        { label:'投简历试试', hint:'🎲', fn: g => { g.flags.rumorJobTip=false; if(g.intel>65&&Math.random()>0.4){ setJob(g, '高级'+g.job.replace('初级','').replace('高级',''), Math.floor(g.jobSalary*1.3)); return{money:5000,mood:15,social:5}; }else{ return{mood:-10,money:-500}; } }},
        { label:'现在的工作还行', hint:'+😊', fn: g => { g.flags.rumorJobTip=false; return{mood:5}; }},
      ]},
    { id:'rumor_followup_rent', icon:'🏠', title:'公租房消息',
      body:'你之前听到的公租房消息是真的！街道办开始接受申请了。\n\n但排队的人很多，你的条件刚好够格——前提是你要准备一堆材料。',
      cond: g => g.flags.rumorRentTip,
      choices:[
        { label:'赶紧去排队申请', hint:'+😊 -💰', fn: g => { g.flags.rumorRentTip=false; if(Math.random()>0.3){ G.flags.cheapRent=true; return{mood:20,money:-2000}; }else{ return{mood:-10,money:-500}; } }},
        { label:'太麻烦了，算了', hint:'+😊', fn: g => { g.flags.rumorRentTip=false; return{mood:3}; }},
      ]},
    { id:'rumor_followup_gym', icon:'💪', title:'健身年卡',
      body:'你之前听说的那个健身房周年庆促销，今天路过发现真的在搞活动。\n\n年卡原价3999，现在只要1199。\n\n前台小姐姐笑容满面："帅哥/美女，办一张吗？"',
      cond: g => g.flags.rumorGymDeal,
      choices:[
        { label:'办！投资健康', hint:'-💰 +❤️', fn: g => { g.flags.rumorGymDeal=false; g.flags.hasGymCard=true; return{money:-1199,health:10,mood:8,charm:5}; }},
        { label:'算了，我在家做keep', hint:'+😊', fn: g => { g.flags.rumorGymDeal=false; return{mood:3}; }},
      ]},
    { id:'rumor_followup_policy', icon:'📋', title:'人才补贴',
      body:'好消息！你之前听说的人才补贴政策真的出了！\n\n租房补贴每月1500，连续发3年。你赶紧去网上查了查——你居然符合条件！',
      cond: g => g.flags.rumorPolicyTip && g.months > 3,
      choices:[
        { label:'立即申请', hint:'+💰', fn: g => { g.flags.rumorPolicyTip=false; g.flags.hasSubsidy=true; G.money += 5000; return{money:5000,mood:15}; }},
        { label:'再研究研究', hint:'+🧠', fn: g => { g.flags.rumorPolicyTip=false; addDelayedEffect(2, {mood:-8}, '你犹豫太久，补贴政策名额满了……'); return{intel:2}; }},
      ]},
    { id:'rumor_followup_crypto', icon:'🪙', title:'币圈诱惑',
      body:'上次聚会那个吹币圈暴富的人又发朋友圈了——这次晒了张保时捷的照片。\n\n你看着自己的工资条，陷入了沉思。\n\n"要不上车试试？就投一点点？"',
      cond: g => g.flags.rumorCrypto && g.money > 5000,
      choices:[
        { label:'投5000试试水', hint:'🎲', fn: g => { g.flags.rumorCrypto=false; if(Math.random()>0.7){ return{money:15000,mood:20}; }else{ return{money:-5000,mood:-15}; } }},
        { label:'忍住，这是韭菜收割机', hint:'+🧠', fn: g => { g.flags.rumorCrypto=false; addDelayedEffect(4, {mood:-5}, '那个币圈大佬后来发朋友圈说亏了一套房。你庆幸自己没上车。'); return{intel:5,mood:5}; }},
      ]},
    { id:'rumor_followup_elevator', icon:'🏢', title:'电梯费',
      body:'物业真的发了通知：装电梯每户要出5万，不交钱就取消你家的使用权。\n\n楼下大爷说的没错，你被"少数服从多数"了。',
      cond: g => g.flags.rumorElevator && g.money > 0,
      choices:[
        { label:'交钱吧', hint:'-💰', fn: g => { g.flags.rumorElevator=false; return{money:-5000,mood:-10}; }},
        { label:'跟物业理论', hint:'🎲', fn: g => { g.flags.rumorElevator=false; if(Math.random()>0.7){ return{mood:10,social:5}; }else{ return{money:-5000,mood:-20,social:-5}; } }},
        { label:'考虑搬家', hint:'🎲', fn: g => { g.flags.rumorElevator=false; return{mood:-8}; }},
      ]},
    { id:'rumor_followup_scam', icon:'🛡️', title:'防诈骗',
      body:'你果然接到了"社保局"的电话，说你社保异常需要补缴。\n\n好在你之前听朋友提过这个骗局，一秒识破。\n\n"骗子：先生您的社保……"\n"你：你猜我信不信？"',
      cond: g => g.flags.rumorScamAlert,
      choices:[
        { label:'挂掉电话', hint:'+🧠', fn: g => { g.flags.rumorScamAlert=false; return{mood:8,intel:3}; }},
        { label:'逗骗子玩一会儿', hint:'+😊', fn: g => { g.flags.rumorScamAlert=false; return{mood:15,charm:2}; }},
      ]},
    { id:'rumor_followup_blind_date', icon:'💕', title:'相亲',
      body:'朋友妈妈介绍的对象终于约出来了。\n\n见面才发现：对方确实"条件很好"，但你们之间完全没有话题。\n\n全程都在聊房子车子和年薪。',
      cond: g => g.flags.rumorBlindDate && !g.relationships?.partner,
      choices:[
        { label:'再给一次机会', hint:'🎲', fn: g => { g.flags.rumorBlindDate=false; if(Math.random()>0.5){ G.relationships.partner=25; return{social:5,mood:8}; }else{ return{mood:-5,money:-200}; } }},
        { label:'算了，不是我的菜', hint:'+😊', fn: g => { g.flags.rumorBlindDate=false; return{mood:3}; }},
      ]},
    // === v9.1 新增社会热点事件 ===
    { id:'ai_interview', icon:'🤖', title:'AI面试官',
      body:'你投了一家大公司，结果第一轮面试是AI面试官。\n\n一个屏幕上的虚拟人问你：「请描述你最大的优点。」\n\n你心想：我的优点就是不会在AI面前紧张……才怪。',
      cond: g => g.intel > 50 && g.job === '待业中' && g.months > 3,
      choices:[
        { label:'认真回答', hint:'+🧠', fn: g => { if(g.intel>70&&Math.random()>0.4){ setJob(g,'大厂员工',18000); return{mood:20,money:5000}; }else{ return{mood:-10,intel:3}; } }},
        { label:'随便应付', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'rent_increase_v2_v2', icon:'📈', title:'房东涨价',
      body:'房东发来微信：下个月房租涨500。\n\n"不涨不行啊，我也要生活。"\n\n你看了看合同，确实没写不能涨。',
      cond: g => g.money > 0 && g.months > 6 && !g.flags.cheapRent && Math.random() > 0.7,
      choices:[
        { label:'接受涨价', hint:'-💰', fn: g => { G.flags.rentIncreased = true; return{money:-500,mood:-8}; }},
        { label:'跟房东砍价', hint:'🎲', fn: g => { if(Math.random()>0.5){ return{mood:10,charm:3}; }else{ return{money:-300,mood:-5}; } }},
        { label:'准备搬家', hint:'-💰 +😊', fn: g => { return{money:-2000,mood:5}; }},
      ]},
    { id:'wechat_group_drama', icon:'💬', title:'群聊风波',
      body:'你的微信群里突然吵起来了——有人在群里发了一条"震惊体"文章，另一个人说是假的。\n\n然后话题从养生转到了国际政治，从国际政治转到了谁在群里潜水不说话。\n\n最后有人说："要不咱们建个新群？"',
      cond: g => g.social > 30 && g.months > 2,
      choices:[
        { label:'加入新群', hint:'+👥', fn: g => { return{social:5,mood:3}; }},
        { label:'默默退群', hint:'+😊', fn: g => { return{mood:5,social:-3}; }},
        { label:'发个红包和稀泥', hint:'-💰 +👥', fn: g => { return{money:-50,social:8,mood:5}; }},
      ]},
    { id:'food_delivery_guilt', icon:'🍜', title:'外卖罪恶感',
      body:'你这个月的外卖消费记录出来了：3800块。\n\n平均每天127块。你算了算，如果自己做饭能省一半。\n\n但你看着厨房——连锅都没有。',
      cond: g => g.money > 5000 && g.months > 3,
      choices:[
        { label:'买个锅学做饭', hint:'-💰 +❤️', fn: g => { return{money:-500,health:8,mood:5,intel:3}; }},
        { label:'算了吧，时间就是金钱', hint:'+😊', fn: g => { return{mood:3}; }},
        { label:'下个月一定控制', hint:'+😊', fn: g => { return{mood:-3}; }},
      ]},
    { id:'midnight_emo', icon:'🌙', title:'深夜emo',
      body:'凌晨两点，你躺在床上翻来覆去睡不着。\n\n你打开手机，刷了一圈朋友圈：同学升职了，朋友结婚了，前同事创业融资了。\n\n你默默发了条朋友圈，又删掉了。又发了一条，又删掉了。\n\n"成年人的崩溃，是悄无声息的。"',
      cond: g => g.mood < 40 && g.months > 6,
      choices:[
        { label:'听白噪音入睡', hint:'+❤️', fn: g => { return{health:3,mood:5}; }},
        { label:'打开购物软件', hint:'-💰 +😊', fn: g => { return{money:-500,mood:8,health:-3}; }},
        { label:'写日记', hint:'+🧠', fn: g => { return{intel:5,mood:8}; }},
        { label:'打开招聘APP', hint:'+💰 +😊', fn: g => { if(Math.random()>0.6){ return{mood:10,money:2000}; }else{ return{mood:-5}; } }},
      ]},
    { id:'health_check_report', icon:'🏥', title:'体检报告',
      body:'公司组织的年度体检报告出来了。\n\n你打开一看：脂肪肝、颈椎病、近视加深、体重超标……\n\n"20多岁的身体，50岁的零件。"',
      cond: g => g.health < 50 && g.job !== '待业中' && g.months > 6,
      choices:[
        { label:'开始养生', hint:'+❤️ +😊', fn: g => { return{health:10,mood:5,money:-500}; }},
        { label:'吃顿好的压压惊', hint:'+😊 -❤️', fn: g => { return{mood:10,health:-5,money:-200}; }},
        { label:'算了，年轻人的常态', hint:'+😊', fn: g => { addDelayedEffect(6, {health:-15}, '半年后你再次体检，指标更差了……'); return{mood:3}; }},
      ]},
    { id:'pet_adoption_v2', icon:'🐱', title:'撸猫诱惑',
      body:'你路过一家猫咖，一只橘猫一直蹭你的手。\n\n店员说："这只猫特别亲人，要不领养吧？"\n\n你看了看自己的出租屋——10平米，放不下一张双人床。\n\n但那只猫看着你，你也看着它。',
      cond: g => g.mood < 60 && g.money > 3000 && g.months > 3,
      choices:[
        { label:'领养！', hint:'-💰 +😊', fn: g => { g.flags.hasPet=true; return{money:-2000,mood:20,health:5}; }},
        { label:'下次吧', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    // === v9.2 35岁危机事件链 ===
    { id:'crisis_35_notice', icon:'⚠️', title:'35岁危机',
      body:'你在招聘网站上看到一条岗位，JD写得明明白白：「35岁以下」。\n\n你今年刚好35。\n\n你打开更多招聘页面——十个岗位八个写着"35岁以下"。你突然理解了一个词：保质期。\n\n"打工人的保质期是35岁。过了这个年龄，你不是被淘汰，是被遗忘。"',
      cond: g => g.age >= 34 && g.age <= 36 && !g.flags.crisis35seen && g.job !== '待业中',
      choices:[
        { label:'考个证，提升竞争力', hint:'+🧠 -💰', fn: g => { g.flags.crisis35seen=true; return{intel:10,mood:-5,money:-3000}; }},
        { label:'考虑转行/创业', hint:'🎲', fn: g => { g.flags.crisis35seen=true; g.flags.crisis35pivot=true; return{mood:-10,intel:5}; }},
        { label:'考公务员，进体制', hint:'+💰 +😊', fn: g => { g.flags.crisis35seen=true; g.flags.tryCivilService=true; if(g.intel>70&&Math.random()>0.5){setJob(g,'公务员',10000);return{mood:15,money:5000}}else{return{mood:-15,money:-2000}} }},
        { label:'算了，认命了', hint:'+😊', fn: g => { g.flags.crisis35seen=true; g.flags.resigned35=true; return{mood:-20}; }},
      ]},
    { id:'crisis_35_layoff', icon:'💔', title:'大厂毕业',
      body:'HR找你谈话："公司正在优化人员结构……"\n\n你早就有预感了。35岁，P7，没有管理经验——标准的"优化"对象。\n\n你拿到N+1赔偿金，走出大楼。阳光很好，你坐在公司楼下的星巴克，打开招聘App。\n\n"毕业快乐。下一站，不知道在哪。"',
      cond: g => g.age >= 35 && g.age <= 38 && g.jobSalary >= 15000 && !g.flags.laidOff35,
      choices:[
        { label:'接受赔偿，重新找工作', hint:'+💰 -😊', fn: g => { g.flags.laidOff35=true; setJob(g,'待业中',0); return{money:Math.floor(g.jobSalary*6),mood:-20}; }},
        { label:'趁机创业', hint:'🎲', fn: g => { g.flags.laidOff35=true; g.flags.entrepreneur=true; setJob(g,'创业者',0); if(Math.random()>0.5){return{money:Math.floor(g.jobSalary*3),mood:10,social:10}}else{return{money:-20000,mood:-20}} }},
        { label:'休息一段时间', hint:'+❤️ +😊', fn: g => { g.flags.laidOff35=true; setJob(g,'待业中',0); return{money:Math.floor(g.jobSalary*6),mood:10,health:10}; }},
      ]},
    // === v9.2 恋爱/婚姻系统深化 ===
    { id:'dating_app_v2_v2', icon:'💕', title:'交友App',
      body:'你下载了一个交友App，刷了一个小时。\n\n右滑了50个人，匹配了3个。聊了3个，见了1个。\n\n见面的时候你发现：对方的照片和本人，差距约等于美颜前和美颜后。\n\n"线上交友就像拆盲盒——你永远不知道打开的是什么。"',
      cond: g => !g.flags.hasPartner && g.age >= 24 && g.social < 50 && g.months > 3,
      choices:[
        { label:'继续右滑', hint:'🎲', fn: g => { if(g.charm>50&&Math.random()>0.4){ g.flags.hasPartner=true; if(g.relationships) g.relationships.partner=40; return{mood:15,charm:5,social:8}; }else{ return{mood:-5,money:-100}; } }},
        { label:'删了App', hint:'+😊', fn: g => { return{mood:5,intel:2}; }},
      ]},
    { id:'relationship_milestone', icon:'💑', title:'恋爱百日',
      body:'你和TA在一起一百天了。\n\nTA问你："你觉得我们以后会怎样？"\n\n你看了看TA，又看了看银行卡余额，又看了看房价。\n\n"这个问题比面试还难回答。"',
      cond: g => g.flags.hasPartner && g.relationships && g.relationships.partner >= 40 && g.months > 6,
      choices:[
        { label:'我们结婚吧', hint:'-💰 +😊', fn: g => { if(g.money>50000){g.flags.married=true;g.flags.hasPartner=true;g.relationships.partner=80;return{money:-50000,mood:25,social:15}}else{return{mood:-10}} }},
        { label:'再处处看', hint:'+😊', fn: g => { if(g.relationships) g.relationships.partner=clamp((g.relationships.partner||0)+10,0,100); return{mood:10}; }},
        { label:'我们分手吧', hint:'💔', fn: g => { g.flags.hasPartner=false;if(g.relationships) g.relationships.partner=0; return{mood:-20,social:-5}; }},
      ]},
    { id:'wedding_pressure', icon:'💒', title:'催婚',
      body:'过年回家，你妈拉着你的手："隔壁老王家的儿子都二胎了。"\n\n你爸在旁边看报纸，偶尔插一句："你妈说得对。"\n\n你的七大姑八大姨轮番上阵，你的微信被拉进了三个相亲群。\n\n"在中国，单身是一种需要解释的状态。"',
      cond: g => !g.flags.hasPartner && g.age >= 27 && g.months > 12 && g.month % 12 <= 1,
      choices:[
        { label:'答应去相亲', hint:'🎲', fn: g => { g.flags.blindDate=true; if(Math.random()>0.5&&g.charm>40){ g.flags.hasPartner=true;if(g.relationships) g.relationships.partner=30; return{mood:10,social:8}; }else{ return{mood:-5,money:-200}; } }},
        { label:'我单身我骄傲', hint:'+😊', fn: g => { return{mood:8,charm:3}; }},
        { label:'假装已有对象', hint:'🎲', fn: g => { if(Math.random()>0.7){return{mood:5,social:-3}}else{return{mood:-15,social:-8}} }},
      ]},
    // === v9.2 投资相关事件 ===
    { id:'stock_crash', icon:'📉', title:'股市暴跌',
      body:'今天A股暴跌3000点，你的股票账户一片绿色（在中国，绿色=跌）。\n\n朋友圈全是"天台见"的段子。你看了看自己的持仓——亏了30%。\n\n"别人恐惧我贪婪，别人贪婪我……也恐惧。"',
      cond: g => g.investments && g.investments.stock > 5000 && Math.random() > 0.7,
      choices:[
        { label:'割肉止损', hint:'-💰', fn: g => { const loss = Math.floor(g.investments.stock * 0.3); g.investments.stock = Math.floor(g.investments.stock * 0.7); return{money:0,mood:-15}; }},
        { label:'抄底加仓', hint:'🎲', fn: g => { if(Math.random()>0.5){ addDelayedEffect(6, function(g2){ g2.investments.stock=(g2.investments.stock||0)+10000; return{mood:20}; }, '你抄底的股票涨了！看来你真的是股神。'); return{money:-5000,mood:-5}; }else{ g.investments.stock=Math.floor((g.investments.stock||0)*0.5); return{money:-5000,mood:-20}; } }},
        { label:'卸载炒股软件', hint:'+😊', fn: g => { return{mood:5,intel:3}; }},
      ]},
    { id:'fund_gain', icon:'📈', title:'基金回本了',
      body:'你定投了两年的基金，终于回本了！\n\n两年啊！你经历了多少个"跌到怀疑人生"的日夜。\n\n你发了条朋友圈："价值投资，从我做起。"配了张基金收益截图。',
      cond: g => g.investments && g.investments.fund > 10000 && g.months > 24,
      choices:[
        { label:'落袋为安', hint:'+💰', fn: g => { const amount = g.investments.fund; G.money += amount; g.investments.fund = 0; return{money:amount,mood:15}; }},
        { label:'继续定投', hint:'🎲', fn: g => { addDelayedEffect(12, function(g2){ if(Math.random()>0.4){g2.investments.fund=(g2.investments.fund||0)*1.3;return{mood:15}}else{g2.investments.fund=(g2.investments.fund||0)*0.8;return{mood:-10}} }, '一年后你的基金……'); return{mood:5}; }},
      ]},
    { id:'crypto_mania', icon:'₿', title:'币圈暴涨',
      body:'你的同事兴奋地跟你说：比特币又创新高了！\n\n他上周刚买了5万块的比特币，现在翻了3倍。\n\n你看着他激动的脸，心里五味杂陈。\n\n"每一次币圈暴涨，都觉得自己错过了一个亿。"',
      cond: g => g.money > 10000 && g.months > 6,
      choices:[
        { label:'FOMO入场', hint:'🎲', fn: g => { if(!g.investments) g.investments={}; g.investments.crypto=(g.investments.crypto||0)+10000; G.money-=10000; if(Math.random()>0.5){ addDelayedEffect(3, function(g2){ g2.investments.crypto=(g2.investments.crypto||0)*2; return{mood:20}; }, '你的比特币翻倍了！'); return{mood:10}; }else{ addDelayedEffect(3, function(g2){ g2.investments.crypto=Math.floor((g2.investments.crypto||0)*0.3); return{mood:-20}; }, '你的比特币暴跌了。'); return{mood:-5}; } }},
        { label:'理性观望', hint:'+🧠', fn: g => { addDelayedEffect(6, {mood:5,intel:3}, '半年后比特币暴跌50%，你庆幸自己没冲动。'); return{intel:5,mood:3}; }},
      ]},
    // === v9.2 季节事件 ===
    { id:'spring_festival_v2', icon:'🧧', title:'春节回家',
      body:'春节到了。你抢到了回家的火车票——硬座，26小时。\n\n到家后你发现：你妈老了很多，你爸头发白了不少。\n\n年夜饭上亲戚轮番问候：工资多少？有对象没？买房了吗？\n\n你笑着说"都挺好的"，然后偷偷在桌下攥紧了拳头。',
      cond: g => g.month % 12 === 1 && g.months > 12,
      choices:[
        { label:'大方给红包', hint:'-💰 +😊', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+15,0,100); return{money:-5000,mood:15,social:5}; }},
        { label:'说工作忙提前走', hint:'+💰 -😊', fn: g => { return{money:-1000,mood:-5}; }},
        { label:'春节旅游不回家', hint:'+😊 -👥', fn: g => { return{money:-3000,mood:10,social:-5}; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)-10,0,100); }},
      ]},
    { id:'graduation_season', icon:'🎓', title:'毕业季来了',
      body:'六月，大学毕业生涌入城市。你在地铁上看到一群群拖着行李箱的年轻人，眼神里充满期待。\n\n你想起自己刚来这座城市的样子——也是这样满怀期待。\n\n现在你最大的期待是：这个月别再加班了。',
      cond: g => g.month % 12 === 6 && g.age >= 24 && g.months > 12,
      choices:[
        { label:'感慨万千', hint:'+😊', fn: g => { return{mood:5,intel:3}; }},
        { label:'请实习生吃饭', hint:'-💰 +👥', fn: g => { return{money:-200,social:8,charm:3}; }},
        { label:'发条朋友圈', hint:'+✨', fn: g => { return{charm:5,mood:3}; }},
      ]},
    { id:'double_eleven', icon:'🛒', title:'双十一来了',
      body:'双十一预售开始了。你打开购物车：30件商品，总价8000块。\n\n你的理智说：你不需要这些。你的手指说：买买买！\n\n你看了李佳琦的直播，三分钟后你已经付了两个定金。\n\n"双十一教会你一个道理：省钱的方式只有一种，就是不看。"',
      cond: g => g.month % 12 === 11 && g.money > 3000,
      choices:[
        { label:'清空购物车', hint:'-💰 +😊', fn: g => { const spent = Math.min(g.money, Math.floor(Math.random()*5000)+3000); return{money:-spent,mood:15,charm:5}; }},
        { label:'只买必需品', hint:'-💰', fn: g => { return{money:-800,mood:5}; }},
        { label:'什么都不买', hint:'+💰 +🧠', fn: g => { addDelayedEffect(1, {mood:5,intel:3}, '双十一过去了，你看着同事拆快递，心里竟然有点优越感。'); return{mood:3}; }},
      ]},
    { id:'summer_heat_v2_v2', icon:'🌡️', title:'高温预警',
      body:'气温突破40度。你从公司走到地铁站的5分钟，感觉自己像一块铁板烧。\n\n你的外卖小哥迟到了半小时，因为他的电动车在高温下爆胎了。\n\n你给了五星好评——因为你觉得他比你更辛苦。',
      cond: g => g.month % 12 >= 7 && g.month % 12 <= 8,
      choices:[
        { label:'买杯冰奶茶续命', hint:'-💰 +😊', fn: g => { return{money:-30,mood:8,health:-2}; }},
        { label:'请假在家吹空调', hint:'+😊 -💰', fn: g => { return{mood:10,health:3,money:-500}; }},
        { label:'继续上班', hint:'+💰 -❤️', fn: g => { return{money:500,health:-5,mood:-8}; }},
      ]},
    // === v9.3 城市特色深化 ===
    { id:'beijing_hutong', icon:'🏘️', title:'胡同漫步',
      body:'周末你在北京胡同里溜达，看到大爷们在下棋，大妈们在跳广场舞。\n\n一个胡同口的小饭馆写着："本店经营30年，比你的工龄都长。"\n\n你点了一碗炸酱面，坐在门口吃。那一刻你觉得：北京也有温柔的一面。',
      cond: g => g.city === 'beijing' && g.mood < 60,
      choices:[
        { label:'跟大爷下棋', hint:'+👥 +🧠', fn: g => { return{social:8,intel:3,mood:10}; }},
        { label:'拍vlog发抖音', hint:'+✨', fn: g => { return{charm:8,mood:5,social:3}; }},
        { label:'吃完就走', hint:'+😊', fn: g => { return{mood:8,health:3}; }},
      ]},
    { id:'beijing_haidian', icon:'📚', title:'海淀鸡娃',
      body:'你住海淀，楼下邻居的孩子3岁学英语，5岁学编程，7岁已经参加奥数竞赛。\n\n你妈打电话来："你看看人家孩子！"\n\n你看了看自己——连微积分都还给老师了。',
      cond: g => g.city === 'beijing' && g.age >= 30,
      choices:[
        { label:'压力山大', hint:'-😊', fn: g => { return{mood:-10,intel:3}; }},
        { label:'我还年轻不管这些', hint:'+😊', fn: g => { return{mood:5}; }},
        { label:'开始学习提升自己', hint:'+🧠', fn: g => { return{intel:8,mood:-3,money:-1000}; }},
      ]},
    { id:'chengdu_teahouse', icon:'🍵', title:'成都茶馆',
      body:'你在成都人民公园的鹤鸣茶社喝了一下午茶。\n\n周围全是打麻将的大爷和摆龙门阵的阿姨。时间好像在这里慢了下来。\n\n你突然理解了为什么成都人总说："急啥子嘛，巴适得板。"',
      cond: g => g.city === 'chengdu' && g.health < 70,
      choices:[
        { label:'学会慢生活', hint:'+❤️ +😊', fn: g => { return{health:8,mood:15,charm:3}; }},
        { label:'学打麻将', hint:'+👥 +🧠', fn: g => { return{social:10,intel:3,mood:8}; }},
        { label:'觉得浪费时间', hint:'-😊', fn: g => { return{mood:-5,intel:2}; }},
      ]},
    { id:'chengdu_panda', icon:'🐼', title:'熊猫基地',
      body:'你去了成都大熊猫基地，看到了刚出生的小熊猫。\n\n它们圆滚滚的，在草地上打滚。你看了一个小时，完全忘了工作。\n\n"大熊猫教会你一个道理：只要够可爱，就不用努力。"',
      cond: g => g.city === 'chengdu' && g.mood < 50,
      choices:[
        { label:'拍100张照片', hint:'+✨ +😊', fn: g => { return{charm:5,mood:20}; }},
        { label:'买个熊猫玩偶', hint:'-💰 +😊', fn: g => { return{money:-100,mood:12}; }},
        { label:'思考人生', hint:'+🧠', fn: g => { return{intel:5,mood:8}; }},
      ]},
    { id:'shenzhen_speed', icon:'⚡', title:'深圳速度',
      body:'你在深圳点了一份外卖，15分钟就到了。你问骑手怎么这么快，他说："在深圳，什么都要快。"\n\n你想起刚来深圳时，HR跟你说："这里没有慢生活，只有快淘汰。"\n\n"深圳速度，是用无数人的青春换来的。"',
      cond: g => g.city === 'shenzhen' && g.months > 6,
      choices:[
        { label:'跟上节奏', hint:'+💰 -❤️', fn: g => { return{money:3000,health:-5,mood:-5,intel:5}; }},
        { label:'找自己的节奏', hint:'+😊 +❤️', fn: g => { return{mood:10,health:5}; }},
      ]},
    { id:'hangzhou_alibaba', icon:'🏢', title:'阿里味',
      body:'你在杭州工作，发现身边一半的人都在阿里或者从阿里出来的。\n\n你的朋友圈里全是"赋能"、"抓手"、"闭环"这种词。\n\n你开始怀疑：你是不是也说"赋能"了？',
      cond: g => g.city === 'hangzhou' && g.job !== '待业中',
      choices:[
        { label:'学互联网黑话', hint:'+🧠 +✨', fn: g => { return{intel:5,charm:3,mood:-3}; }},
        { label:'保持自己的表达', hint:'+😊', fn: g => { return{mood:5,intel:2}; }},
      ]},
    { id:'shanghai_bund_night', icon:'🌃', title:'外滩跑步',
      body:'你加入了外滩跑团，每周三晚上沿着黄浦江跑步。\n\n左边是陆家嘴的高楼大厦，右边是外滩的百年建筑。你在这条路上跑过无数次。\n\n"上海的魔幻在于：你一边跑步一边觉得自己像在电影里。"',
      cond: g => g.city === 'shanghai' && g.health < 70,
      choices:[
        { label:'坚持跑步', hint:'+❤️ +👥', fn: g => { return{health:10,social:8,mood:8}; }},
        { label:'跑完去吃宵夜', hint:'+😊 -❤️', fn: g => { return{mood:12,health:-3,money:-200}; }},
      ]},
    // === v9.3 社交系统深化事件 ===
    { id:'old_friend_visit', icon:'🤝', title:'老友来访',
      body:'大学室友突然来你的城市出差，约你吃饭。\n\n见面后你们聊了三个小时：从校园回忆到工作压力，从感情八卦到人生困惑。\n\n你发现：有些人，即使很久没见，还是一见如故。',
      cond: g => g.social > 20 && g.months > 12,
      choices:[
        { label:'请他吃大餐', hint:'-💰 +👥', fn: g => { if(g.relationships) g.relationships.friends=clamp((g.relationships.friends||40)+15,0,100); return{money:-500,mood:15,social:10}; }},
        { label:'AA制', hint:'+👥', fn: g => { if(g.relationships) g.relationships.friends=clamp((g.relationships.friends||40)+8,0,100); return{mood:10,social:5}; }},
      ]},
    { id:'colleague_conflict_v2', icon:'😤', title:'职场冲突',
      body:'你的同事在背后说你坏话，被另一个同事告诉你了。\n\n你纠结了一整天：要不要找他当面对质？\n\n你想起职场前辈说过的话："在公司里，没有永远的朋友，只有永远的利益。"',
      cond: g => g.job !== '待业中' && g.months > 6,
      choices:[
        { label:'当面对质', hint:'🎲', fn: g => { if(Math.random()>0.5){return{mood:10,social:5,charm:3}}else{return{mood:-10,social:-8}} }},
        { label:'默默记住，以后防备', hint:'+🧠', fn: g => { return{intel:5,mood:-5}; }},
        { label:'找领导投诉', hint:'🎲', fn: g => { if(Math.random()>0.6){return{mood:8,social:-3}}else{return{mood:-15,social:-10}} }},
      ]},
    { id:'mentor_found_v2', icon:'🧓', title:'遇到贵人',
      body:'你在一个行业活动上遇到了一位前辈。他跟你聊了一个小时，给了你很多建议。\n\n最后他说："年轻人，最重要的不是赚多少钱，是想清楚自己要什么。"\n\n你回去后想了很久——你到底要什么？',
      cond: g => g.intel > 50 && g.age < 30 && g.months > 6,
      choices:[
        { label:'定期请教', hint:'+🧠 +👥', fn: g => { g.flags.hasMentor=true; return{intel:10,social:8,mood:8}; }},
        { label:'加了微信就没联系了', hint:'+😊', fn: g => { return{intel:3}; }},
      ]},
    { id:'roommate_conflict_v2', icon:'🏠', title:'室友矛盾',
      body:'你的室友又半夜带人回来，还把厨房搞得一团糟。\n\n你发了条微信："能不能注意点？"\n\n他回了个"好的"，然后继续我行我素。\n\n"合租是大城市最残酷的社交实验：你被迫跟一个陌生人共享生活。"',
      cond: g => g.money < 30000 && g.months > 3 && !g.flags.hasHouse,
      choices:[
        { label:'忍了', hint:'+😊', fn: g => { return{mood:-10,health:-3}; }},
        { label:'好好谈谈', hint:'+👥', fn: g => { if(Math.random()>0.4){return{mood:8,social:3}}else{return{mood:-5,social:-5}} }},
        { label:'搬家', hint:'-💰', fn: g => { return{money:-3000,mood:10}; }},
      ]},
    // === v9.4 教育/考证系统 ===
    { id:'civil_service_exam_v2', icon:'📝', title:'考公之路',
      body:'你决定考公务员。买了一套行测+申论教材，开始了漫长的备考。\n\n你的时间表：白天上班，晚上刷题，周末模考。\n\n同事问你："你确定要考？上岸率只有3%。"\n\n你说："总得试试吧。"其实你心里也没底。',
      cond: g => g.intel > 55 && g.age >= 22 && g.age <= 35 && !g.flags.civilServant && !g.flags.tookCivilExam,
      choices:[
        { label:'全力以赴备考', hint:'+🧠 -💰 -❤️', fn: g => { g.flags.tookCivilExam=true; return{intel:15,health:-8,mood:-5,money:-3000}; }},
        { label:'边工作边复习', hint:'+🧠 -❤️', fn: g => { g.flags.tookCivilExam=true; return{intel:8,health:-3,mood:-3,money:-1000}; }},
        { label:'还是算了', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'civil_service_result', icon:'🎯', title:'公考放榜',
      body:'成绩出来了！你紧张地打开查询页面……',
      cond: g => g.flags.tookCivilExam && !g.flags.civilServant && g.months > 3,
      choices:[
        { label:'查看成绩', hint:'🎲', fn: g => {
            g.flags.tookCivilExam=false;
            if(g.intel>75 && Math.random()>(g.flags.tookCivilExam?0.4:0.65)){
                g.flags.civilServant=true;
                setJob(g,'公务员',10000);
                return{mood:25,social:10,money:5000};
            } else {
                addDelayedEffect(6, {mood:5}, '你决定明年再考一次……');
                return{mood:-20,money:-1000};
            }
        }},
        { label:'不敢看', hint:'+😊', fn: g => { g.flags.tookCivilExam=false; return{mood:-10}; }},
      ]},
    { id:'mba_dream', icon:'🎓', title:'考研念头',
      body:'你看到同事的简历上写着"某985硕士"，突然觉得自己学历不够。\n\n你开始了解MBA：学费20万，脱产2年。读完出来大概能涨薪30%。\n\n你算了算：20万学费 + 2年不工作 = 差不多50万的成本。\n\n"学历是敲门砖，但MBA是块金砖——前提是你付得起。"',
      cond: g => g.intel > 60 && g.age >= 25 && g.age <= 35 && !g.flags.hasMBA && g.money > 20000,
      choices:[
        { label:'读MBA！投资自己', hint:'-💰 +🧠', fn: g => { g.flags.hasMBA=true; addDelayedEffect(24, function(g2){ g2.intel=Math.min(100,g2.intel+15); g2.charm=Math.min(100,g2.charm+10); if(g2.job!=='待业中'){setJob(g2,'高级'+g2.job.replace('初级','').replace('高级',''),Math.floor(g2.jobSalary*1.5));} return{mood:15}; }, 'MBA毕业！你的视野和人脉都上了一个台阶。'); return{money:-200000,intel:5,mood:-10}; }},
        { label:'读在职研究生', hint:'-💰 +🧠', fn: g => { g.flags.hasMBA=true; addDelayedEffect(24, {intel:8,charm:5}, '在职读研结束，你学到了不少东西。'); return{money:-80000,intel:3,health:-5}; }},
        { label:'学历不重要', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'certificate_pmp', icon:'📋', title:'考证热潮',
      body:'你的朋友圈被各种证书刷屏了：PMP、CFA、CPA、软考……\n\n你的同事已经考了3个证了，你连一个都没有。\n\n"在大城市，证书就是你的军功章——虽然不一定能打仗。"',
      cond: g => g.intel > 50 && g.age >= 24 && g.job !== '待业中' && !g.flags.hasCertificate,
      choices:[
        { label:'考PMP', hint:'-💰 +🧠', fn: g => { g.flags.hasCertificate=true; return{money:-5000,intel:8,charm:3,mood:5}; }},
        { label:'考软考高级', hint:'-💰 +🧠', fn: g => { g.flags.hasCertificate=true; return{money:-2000,intel:10,mood:5}; }},
        { label:'算了，经验比证书重要', hint:'+😊', fn: g => { return{mood:3,intel:2}; }},
      ]},
    // === v9.4 心理健康事件 ===
    { id:'burnout', icon:'🔥', title:'职业倦怠',
      body:'你已经连续三个月不想上班了。\n\n每天早上醒来，你都想请假。但你知道：请假扣的钱够你吃一周外卖。\n\n你开始在网上搜"辞职信模板"，又默默关掉。\n\n"职业倦怠不是矫情，是你的灵魂在喊救命。"',
      cond: g => g.health < 50 && g.mood < 40 && g.job !== '待业中' && g.months > 12,
      choices:[
        { label:'看心理咨询师', hint:'-💰 +😊', fn: g => { g.flags.sawTherapist=true; return{money:-800,mood:15,health:5,intel:3}; }},
        { label:'请假休息一周', hint:'-💰 +❤️', fn: g => { return{money:-2000,health:10,mood:12}; }},
        { label:'硬撑', hint:'-❤️ -😊', fn: g => { addDelayedEffect(3, {health:-15,mood:-10}, '你硬撑了三个月，终于在办公室崩溃大哭。同事递来纸巾，你说了句"没事"。'); return{health:-5,mood:-10}; }},
      ]},
    { id:'imposter_syndrome', icon:'🎭', title:'冒名顶替综合征',
      body:'你升了职，但你觉得自己不配。\n\n你看着周围比你优秀的同事，总觉得自己的成功是运气。\n\n"冒名顶替综合征：越优秀的人，越觉得自己是骗子。"',
      cond: g => g.jobSalary >= 15000 && g.charm < 60 && g.months > 12,
      choices:[
        { label:'接受不完美', hint:'+😊 +🧠', fn: g => { return{mood:10,intel:5,charm:5}; }},
        { label:'更加努力工作', hint:'+💰 -❤️', fn: g => { return{money:3000,health:-5,mood:-5}; }},
        { label:'跟朋友倾诉', hint:'+👥', fn: g => { return{social:5,mood:8}; }},
      ]},
    // === v9.4 自媒体/短视频事件 ===
    { id:'tiktok_dream', icon:'🎬', title:'短视频创业',
      body:'你看到一个视频：一个跟你差不多的人，拍日常vlog，粉丝50万。\n\n你心动了。你买了个三脚架，注册了账号，发了第一条视频。\n\n播放量：23。其中10个是你自己点的。',
      cond: g => g.charm > 40 && g.age <= 35 && !g.flags.tiktokCreator,
      choices:[
        { label:'坚持日更', hint:'-❤️ +✨', fn: g => { g.flags.tiktokCreator=true; addDelayedEffect(6, function(g2){ if(Math.random()>0.6){g2.flags.tiktokSuccess=true;return{money:10000,mood:20,charm:10,social:10}}else{return{mood:-5,health:-5}} }, '你的短视频账号……'); return{mood:5,charm:3,health:-3}; }},
        { label:'做知识博主', hint:'+🧠', fn: g => { g.flags.tiktokCreator=true; addDelayedEffect(8, function(g2){ if(g2.intel>70){return{money:8000,mood:15,charm:8,intel:5}}else{return{mood:-8}} }, '你的知识博主之路……'); return{intel:5,mood:3}; }},
        { label:'算了，看别人拍就好', hint:'+😊', fn: g => { return{mood:3}; }},
      ]},
    // === v9.4 车房系统事件 ===
    { id:'buy_car', icon:'🚗', title:'买车诱惑',
      body:'你同事刚提了一辆特斯拉，在朋友圈晒了九张图。\n\n你看了看自己的通勤路线：地铁1小时，公交1.5小时。\n\n你打开汽车App，看了看价格——首付10万，月供5000。\n\n"在大城市，车不是代步工具，是身份象征。也是新的月供。"',
      cond: g => g.money > 100000 && g.age >= 25 && !g.flags.hasCar,
      choices:[
        { label:'买！', hint:'-💰 +✨', fn: g => { g.flags.hasCar=true; return{money:-100000,charm:10,mood:15,health:5}; }},
        { label:'买二手的', hint:'-💰', fn: g => { g.flags.hasCar=true; return{money:-50000,charm:5,mood:10}; }},
        { label:'继续地铁', hint:'+💰 +😊', fn: g => { return{mood:-3,intel:2}; }},
      ]},
    { id:'mortgage_pressure', icon:'🏠', title:'房贷压力',
      body:'你终于凑够了首付，买了人生中第一套房。\n\n月供12000，比你的房租贵了三倍。你从"租房奴"变成了"房贷奴"。\n\n但你站在阳台上看着城市的夜景，觉得这一切都值了。\n\n"中国人对房子的执念，不是执念，是安全感。"',
      cond: g => g.money > 200000 && g.age >= 27 && !g.flags.hasHouse,
      choices:[
        { label:'买！', hint:'-💰 +😊', fn: g => { g.flags.hasHouse=true; g.flags.hasMortgage=true; return{money:-200000,mood:25,social:10}; }},
        { label:'再攒攒', hint:'+💰', fn: g => { return{mood:-5,intel:2}; }},
        { label:'租房挺好的', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'mortgage_crisis', icon:'💸', title:'月供压力',
      body:'这个月工资晚发了5天，你的房贷差点逾期。\n\n你打电话给银行申请延期，客服说："先生/女士，我们理解您的困难，但逾期记录已经上报了。"\n\n你看了看自己的银行卡余额，第一次觉得房子是个负担。',
      cond: g => g.flags.hasMortgage && g.money < 15000,
      choices:[
        { label:'找朋友借钱', hint:'+👥 -💰', fn: g => { if(g.relationships) g.relationships.friends=clamp((g.relationships.friends||40)-5,0,100); return{money:12000,mood:-10,social:-5}; }},
        { label:'卖掉房子', hint:'🎲', fn: g => { if(Math.random()>0.4){g.flags.hasHouse=false;g.flags.hasMortgage=false;return{money:250000,mood:10}}else{return{mood:-20,money:50000}} }},
        { label:'硬扛', hint:'-😊 -❤️', fn: g => { return{mood:-15,health:-5}; }},
      ]},
    // === v9.5 职场深度事件 ===
    { id:'side_project_v2_v2', icon:'🔧', title:'副业项目',
      body:'你接到一个朋友的私活：做个小程序，报酬8000块。\n\n你算了算：周末加班两周就能搞定。但你已经连续加了三个星期的班了。\n\n"副业是大城市打工人的第二份工作——没有五险一金，但有钱拿。"',
      cond: g => g.intel > 55 && g.job !== '待业中' && g.months > 6,
      choices:[
        { label:'接！多赚点', hint:'+💰 -❤️', fn: g => { return{money:8000,health:-8,mood:-3,intel:5}; }},
        { label:'太累了，不接', hint:'+❤️ +😊', fn: g => { return{health:5,mood:5}; }},
        { label:'介绍给别人', hint:'+👥', fn: g => { return{social:8,mood:3}; }},
      ]},
    { id:'office_politics_v2', icon:'🎭', title:'站队',
      body:'公司两个领导在争权，你的直属领导和隔壁部门领导不对付。\n\n你的直属领导暗示你："关键时刻要站在对的人身边。"\n\n你心想：我只想好好写代码/做业务，不想卷进政治。',
      cond: g => g.job !== '待业中' && g.jobSalary > 8000 && g.months > 12,
      choices:[
        { label:'站直属领导', hint:'🎲', fn: g => { if(Math.random()>0.4){return{mood:5,social:5,money:3000}}else{setJob(g,'待业中',0);return{mood:-20,money:-5000}} }},
        { label:'两边不得罪', hint:'+🧠', fn: g => { return{intel:3,mood:-5}; }},
        { label:'趁乱跳槽', hint:'🎲', fn: g => { if(Math.random()>0.5){setJob(g,'高级'+g.job.replace('初级','').replace('高级',''),Math.floor(g.jobSalary*1.2));return{mood:10,money:5000}}else{return{mood:-10}} }},
      ]},
    { id:'remote_work_v2_v2', icon:'💻', title:'远程办公',
      body:'公司宣布可以远程办公了！你激动得差点跳起来。\n\n第一周：效率翻倍，心情大好。\n第二周：分不清上班和下班。\n第三周：你已经三天没换过衣服了。\n\n"远程办公是自由，也是另一种形式的牢笼。"',
      cond: g => g.job !== '待业中' && g.intel > 50 && g.months > 6 && !g.flags.remoteWorker,
      choices:[
        { label:'申请全远程', hint:'+😊 -👥', fn: g => { g.flags.remoteWorker=true; return{mood:15,social:-8,health:5}; }},
        { label:'混合办公', hint:'+😊', fn: g => { return{mood:10,health:3,social:3}; }},
        { label:'还是去公司吧', hint:'+👥', fn: g => { return{social:5,mood:-3}; }},
      ]},
    // === v9.5 生活变体事件 ===
    { id:'hobby_photography', icon:'📸', title:'入坑摄影',
      body:'你被朋友拉进了摄影坑。一台相机加镜头，花了两万块。\n\n你开始每个周末出去拍照：扫街、人像、风光……\n\n你的朋友圈变得好看了，你的钱包变薄了。',
      cond: g => g.charm > 40 && g.money > 10000 && !g.flags.hobbyPhotography,
      choices:[
        { label:'入坑！', hint:'-💰 +✨', fn: g => { g.flags.hobbyPhotography=true; return{money:-20000,charm:12,mood:15,health:3}; }},
        { label:'用手机拍就行', hint:'+😊', fn: g => { return{charm:3,mood:5}; }},
      ]},
    { id:'travel_solo', icon:'✈️', title:'独自旅行',
      body:'你请了年假，一个人去了大理。\n\n在洱海边发呆了一下午，你突然想明白了一件事：你不需要向任何人证明什么。\n\n你发了条朋友圈：「生活不止眼前的苟且。」然后关掉了工作群通知。',
      cond: g => g.mood < 50 && g.money > 5000 && g.months > 12,
      choices:[
        { label:'多玩几天', hint:'-💰 +😊 +❤️', fn: g => { return{money:-5000,mood:25,health:10,charm:5}; }},
        { label:'三天就回来', hint:'-💰 +😊', fn: g => { return{money:-2000,mood:15,health:5}; }},
      ]},
    { id:'cooking_class', icon:'👨‍🍳', title:'学做饭',
      body:'你在B站上看了100个做菜视频，终于决定自己动手了。\n\n第一道菜：西红柿炒蛋。蛋糊了，西红柿还是生的。\n\n你吃了两口，觉得比外卖好吃——大概是因为自己做的。\n\n"做饭是大城市最后的仪式感。"',
      cond: g => g.health < 60 && g.months > 6 && !g.flags.cookingSkill,
      choices:[
        { label:'坚持学', hint:'+❤️ +🧠', fn: g => { g.flags.cookingSkill=true; return{health:10,intel:5,mood:8,money:-500}; }},
        { label:'还是点外卖', hint:'+😊', fn: g => { return{mood:3}; }},
      ]},
    { id:'gym_challenge', icon:'🏋️', title:'健身挑战',
      body:'你参加了健身房的"百日挑战"：100天每天锻炼，打卡成功退全款。\n\n第30天你觉得浑身酸痛。第60天你想放弃。第90天你已经上瘾了。\n\n"健身最难的不是举铁，是坚持。"',
      cond: g => g.flags.hasGymCard && g.health < 70,
      choices:[
        { label:'坚持100天', hint:'+❤️ +✨', fn: g => { addDelayedEffect(4, function(g2){ g2.health=clamp(g2.health+15,0,100);g2.charm=clamp(g2.charm+8,0,100);g2.mood=clamp(g2.mood+10,0,100); return{money:1199}; }, '百日挑战成功！你拿到了退款，更重要的是——你变了。'); return{health:-5,mood:-3}; }},
        { label:'第31天放弃', hint:'+😊', fn: g => { return{mood:5,health:3}; }},
      ]},
    { id:'charity_event', icon:'❤️', title:'公益活动',
      body:'你参加了一次志愿者活动——去养老院陪老人聊天。\n\n一个80岁的奶奶拉着你的手说："年轻人，别着急，慢慢来。"\n\n你不知道她在安慰你还是在说人生道理。但你听完之后，心里平静了很多。',
      cond: g => g.social > 30 && g.months > 6,
      choices:[
        { label:'定期做志愿者', hint:'+👥 +😊', fn: g => { return{social:10,mood:15,charm:8,health:3}; }},
        { label:'偶尔参加', hint:'+😊', fn: g => { return{mood:8,social:5}; }},
      ]},
    { id:'midlife_reflection', icon:'🪞', title:'中年反思',
      body:'你坐在公司天台上看落日，突然意识到：你已经在这座城市待了十年了。\n\n十年来你换了三份工作、搬了五次家、认识了一百个人、忘记了一百零一个。\n\n你问自己：这就是你想要的生活吗？',
      cond: g => g.age >= 32 && g.months > 60,
      choices:[
        { label:'接受现实，继续前行', hint:'+😊 +🧠', fn: g => { return{mood:10,intel:8}; }},
        { label:'回老家发展', hint:'🎲', fn: g => { if(g.money>50000){return{mood:15,social:-15,money:10000}}else{return{mood:-10,social:-10}} }},
        { label:'做出大改变', hint:'🎲', fn: g => { g.flags.midlifeChange=true; return{mood:5,intel:5,charm:5}; }},
      ]},
    // === v10.0 新增事件 ===
    { id:'ai_writing', icon:'🤖', title:'AI写作助手',
      body:'你发现了一个AI写作工具，它能帮你写邮件、写报告、甚至写情书。\n\n你用它写了一篇工作总结，领导夸你"文笔进步了"。\n\n你心想：如果AI能替你工作，那你的工作还有什么意义？',
      cond: g => g.intel > 50 && g.job !== '待业中' && g.months > 6,
      choices:[
        { label:'深度使用AI', hint:'+🧠 +✨', fn: g => { return{intel:8,charm:3,mood:3}; }},
        { label:'适度使用', hint:'+🧠', fn: g => { return{intel:5,mood:2}; }},
        { label:'拒绝AI，靠自己', hint:'+😊', fn: g => { return{mood:5,intel:2}; }},
      ]},
    { id:'digital_nomad_v2_v2', icon:'🌍', title:'数字游民',
      body:'你认识了一个数字游民：在巴厘岛远程工作，月薪3万，生活成本不到1万。\n\n他给你看了他的生活照：椰林、沙滩、笔记本电脑。\n\n你看了看你的出租屋和电脑屏幕，沉默了。',
      cond: g => g.intel > 60 && g.job !== '待业中' && g.age >= 25 && g.age <= 35 && !g.flags.remoteWorker,
      choices:[
        { label:'申请远程+搬家', hint:'🎲', fn: g => { if(Math.random()>0.4){g.flags.remoteWorker=true;g.flags.digitalNomad=true;return{mood:20,health:5,money:-3000}}else{return{mood:-10}} }},
        { label:'先攒钱再说', hint:'+💰', fn: g => { return{money:3000,mood:5}; }},
        { label:'不现实', hint:'+😊', fn: g => { return{mood:3}; }},
      ]},
    { id:'generational_gap_v2', icon:'👴', title:'代沟',
      body:'你跟你爸视频通话，他说："你们这代人太脆弱了，我们那时候……"\n\n你没反驳，只是默默关掉了摄像头。\n\n你爸不知道的是：你刚被裁了，房租涨了，对象也分手了。\n\n"每一代人都有自己的苦，但上一代人永远觉得下一代人不够苦。"',
      cond: g => g.age >= 25 && g.age <= 35 && g.mood < 50 && g.relationships,
      choices:[
        { label:'跟爸妈倾诉', hint:'+👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{mood:10,social:5}; }},
        { label:'报喜不报忧', hint:'+😊', fn: g => { return{mood:-5,charm:2}; }},
        { label:'减少通话频率', hint:'-👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)-5,0,100); return{mood:3}; }},
      ]},
    { id:'minimalism', icon:'🧹', title:'断舍离',
      body:'你整理了一下出租屋，发现你有一堆从来没穿过的衣服、没拆封的快递、过期半年的食品。\n\n你扔了三大袋东西，突然觉得：东西少了，心也轻了。\n\n"断舍离不是扔东西，是扔掉不需要的执念。"',
      cond: g => g.money > 10000 && g.months > 12,
      choices:[
        { label:'深度断舍离', hint:'+😊 +✨', fn: g => { return{mood:15,charm:5,health:3,money:-1000}; }},
        { label:'只扔垃圾', hint:'+😊', fn: g => { return{mood:8,health:2}; }},
        { label:'挂闲鱼卖了', hint:'+💰', fn: g => { return{money:2000,mood:5}; }},
      ]},
    { id:'city_burnout', icon:'😮‍💨', title:'城市倦怠',
      body:'你已经在这座城市待了够久了。\n\n地铁的味道、写字楼的空调、外卖的味道——一切都那么熟悉，又那么令人厌倦。\n\n你打开地图，看着其他城市的名字，心想：要不要换一个地方重新开始？',
      cond: g => g.months > 36 && g.mood < 55,
      choices:[
        { label:'换个城市', hint:'🗺️', fn: g => { return{mood:5}; }}, // 会触发城市切换提示
        { label:'找到新的乐趣', hint:'+😊', fn: g => { return{mood:8,intel:3}; }},
        { label:'接受这种倦怠', hint:'+🧠', fn: g => { return{intel:5,mood:3}; }},
      ]},
    // === v10.1 新增事件 ===
    { id:'second_job', icon:'🌙', title:'兼职打工',
      body:'你觉得工资不够花，决定找份兼职。\n\n周末去咖啡店打工，时薪25块。站了8个小时，赚了200块。\n\n你算了一下：你的主业时薪80，兼职时薪25。但你没有别的选择。\n\n"兼职不是副业，是用命换钱。"',
      cond: g => g.money < 10000 && g.job !== '待业中' && g.months > 3,
      choices:[
        { label:'坚持做兼职', hint:'+💰 -❤️', fn: g => { return{money:3000,health:-8,mood:-5}; }},
        { label:'做一个月就算了', hint:'+💰', fn: g => { return{money:3000,health:-3,mood:-3}; }},
        { label:'不如提升技能涨工资', hint:'+🧠', fn: g => { return{intel:5,mood:3}; }},
      ]},
    { id:'social_media_addiction', icon:'📱', title:'手机依赖',
      body:'你打开了"屏幕使用时间"：日均8小时23分钟。\n\n其中4小时在刷短视频，2小时在刷朋友圈，1小时在刷微博。\n\n你觉得自己"很忙"，但实际上你的时间都喂给了算法。\n\n"你不是在用手机，是手机在用你。"',
      cond: g => g.months > 6 && g.intel < 70,
      choices:[
        { label:'开启专注模式', hint:'+🧠 +😊', fn: g => { return{intel:8,mood:5,health:3}; }},
        { label:'卸载短视频App', hint:'+😊 +❤️', fn: g => { return{mood:8,health:5,intel:3}; }},
        { label:'算了，快乐就好', hint:'+😊 -🧠', fn: g => { return{mood:5,intel:-3,health:-2}; }},
      ]},
    { id:'family_video_call', icon:'📞', title:'视频通话',
      body:'你妈打来视频电话，你接了。\n\n她第一句话是："瘦了。"第二句是："有对象没？"第三句是："什么时候回家？"\n\n你笑着说"都挺好的"，镜头外的你正吃着泡面。\n\n"成年人的演技，在父母面前发挥到极致。"',
      cond: g => g.relationships && g.months > 3,
      choices:[
        { label:'多聊一会儿', hint:'+👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+8,0,100); return{mood:8,social:3}; }},
        { label:'说有事挂了', hint:'-👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)-3,0,100); return{mood:-3}; }},
        { label:'说想回家看看', hint:'+😊', fn: g => { return{mood:5}; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+5,0,100); }},
      ]},
    { id:'weekend_trip_v3', icon:'🎒', title:'周末出游',
      body:'你约了朋友周末去周边玩——高铁1小时的小城市。\n\n没有景点，没有人山人海。你们找了家本地馆子，吃了顿地道的美食。\n\n"旅行不一定要去远方，有时候换个地方吃饭就够了。"',
      cond: g => g.money > 3000 && g.social > 30 && g.mood < 65,
      choices:[
        { label:'好好享受', hint:'-💰 +😊 +❤️', fn: g => { return{money:-1500,mood:18,health:5,social:5}; }},
        { label:'拍很多照片', hint:'-💰 +✨', fn: g => { return{money:-1500,charm:8,mood:12}; }},
      ]},
    { id:'career_mentor', icon:'🧭', title:'职业规划',
      body:'你找了一个职业规划师做咨询，花了2000块。\n\n她问你："五年后你想做什么？"\n\n你想了半天，说："不想加班。"\n\n她笑了："这不是职业规划，这是人生规划。但没关系，它们本来就是一回事。"',
      cond: g => g.intel > 55 && g.age >= 25 && g.job !== '待业中' && !g.flags.hasMentor,
      choices:[
        { label:'认真做规划', hint:'+🧠 +💰', fn: g => { g.flags.hasCareerPlan=true; return{intel:10,mood:5,money:-2000}; }},
        { label:'觉得没用', hint:'+😊', fn: g => { return{mood:3,money:-2000}; }},
      ]},
    // === v10.3 家庭/育儿事件 ===
    { id:'having_child_v2', icon:'👶', title:'要孩子吗',
      body:'你和TA讨论了一个严肃的问题：要不要生孩子？\n\n你算了一笔账：从怀孕到上大学，至少需要100万。还有学区房、补习班、兴趣班……\n\n你的父母说："不生个孩子，你老了怎么办？"\n\n你心想：我老了可能都还不起房贷。',
      cond: g => g.flags.married && g.age >= 26 && g.age <= 38 && !g.flags.hasChild,
      choices:[
        { label:'生！', hint:'-💰 +😊', fn: g => { g.flags.hasChild=true; return{money:-30000,mood:20,social:10,health:-5}; }},
        { label:'再等等', hint:'+💰', fn: g => { return{mood:-3,money:5000}; }},
        { label:'丁克也挺好', hint:'+😊 +💰', fn: g => { g.flags.dink=true; return{mood:10,money:10000}; }},
      ]},
    { id:'child_expenses', icon:'💸', title:'育儿开支',
      body:'孩子出生了。你的开支暴增：奶粉、尿不湿、婴儿车、早教班……\n\n你打开购物车，发现自己已经很久没给自己买过东西了。\n\n"养娃才知道，原来自己的消费降级空间这么大。"',
      cond: g => g.flags.hasChild && g.months > 3,
      choices:[
        { label:'买最好的', hint:'-💰', fn: g => { return{money:-5000,mood:8}; }},
        { label:'够用就行', hint:'-💰', fn: g => { return{money:-2000,mood:3}; }},
        { label:'买二手的', hint:'-💰 +🧠', fn: g => { return{money:-800,intel:2}; }},
      ]},
    { id:'child_education', icon:'📚', title:'教育焦虑',
      body:'你的孩子3岁了。周围的家长都在讨论幼儿园：国际幼儿园5万/年，公立幼儿园5000/年。\n\n你看了看银行卡，又看了看"国际幼儿园"的 brochure。\n\n"教育焦虑的本质是：你怕孩子输在起跑线上。但你忘了，起跑线是别人画的。"',
      cond: g => g.flags.hasChild && g.age >= 29 && g.money > 20000,
      choices:[
        { label:'国际幼儿园', hint:'-💰 +✨', fn: g => { return{money:-50000,mood:5,charm:3}; }},
        { label:'公立幼儿园', hint:'-💰', fn: g => { return{money:-5000,mood:3}; }},
        { label:'在家自己教', hint:'+🧠 +😊', fn: g => { return{intel:5,mood:5}; }},
      ]},
    { id:'parent_aging_v2', icon:'👴', title:'父母老了',
      body:'你妈打电话来说你爸摔了一跤，住院了。\n\n你请假飞回老家，看到病床上苍老的父亲，你突然意识到：他们在变老，而你在远方。\n\n"距离不是问题，问题是你回不去。"',
      cond: g => g.age >= 30 && g.months > 36 && g.relationships,
      choices:[
        { label:'请假照顾一周', hint:'-💰 +👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+20,0,100); return{money:-5000,mood:10,social:5}; }},
        { label:'请护工', hint:'-💰', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+5,0,100); return{money:-8000,mood:-5}; }},
        { label:'视频问候', hint:'+👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)-5,0,100); return{mood:-10}; }},
      ]},
    { id:'family_reunion', icon:'🏮', title:'家庭聚会',
      body:'中秋节，你带着家人回了老家。\n\n一家人围在一起吃月饼、看月亮。你的孩子在院子里跑来跑去，你的父母笑得合不拢嘴。\n\n那一刻你觉得：所有的辛苦都值了。\n\n"团圆是中国人的信仰——哪怕一年只有一次。"',
      cond: g => g.flags.hasChild && g.flags.married && g.months % 12 === 9,
      choices:[
        { label:'多待几天', hint:'-💰 +😊 +👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+15,0,100); return{money:-3000,mood:20,social:8}; }},
        { label:'当天来回', hint:'-💰 +😊', fn: g => { return{money:-1000,mood:10}; }},
      ]},
    { id:'mid_career_review', icon:'📊', title:'中年盘点',
      body:'你做了一个表格，盘点自己的"人生资产"：\n\n存款：够活3年\n房产：有/无\n车：有/无\n婚姻：有/无\n孩子：有/无\n健康：还行\n梦想：已忘记\n\n你看着这张表，问自己：这就是我的人生吗？',
      cond: g => g.age >= 35 && g.months > 100,
      choices:[
        { label:'接受现状', hint:'+😊', fn: g => { return{mood:10,intel:3}; }},
        { label:'重新出发', hint:'🎲', fn: g => { g.flags.midlifeRestart=true; return{mood:5,intel:5}; }},
        { label:'写回忆录', hint:'+🧠 +✨', fn: g => { return{intel:8,charm:5,mood:8}; }},
      ]},
    // === v10.4 搭子文化/MBTI/Citywalk/宠物/租房 ===
    { id:'find_dazi', icon:'🤝', title:'找个搭子',
      body:'你在小红书发了条帖子："找饭搭子/运动搭子/Citywalk搭子，AA制，不闲聊，不交心。"\n\n没想到收到了20条私信。你挑了一个看起来靠谱的人约了周末见面。\n\n"搭子文化的精髓是：精准陪伴，互不打扰，到期解散。"',
      cond: g => g.age >= 20 && g.age <= 35 && g.social < 60 && g.months > 6,
      choices:[
        { label:'约饭搭子', hint:'+👥', fn: g => { g.flags.hasDazi=true; return{social:8,mood:5}; }},
        { label:'约运动搭子', hint:'+💪', fn: g => { g.flags.hasDazi=true; return{social:5,health:5,mood:3}; }},
        { label:'算了，社恐', hint:'+🧠', fn: g => { return{intel:3,mood:-2}; }},
      ]},
    { id:'mbti_test_v2', icon:'🧩', title:'你是I人还是E人',
      body:'新认识的朋友第一个问题不是"你做什么工作"，而是"你MBTI是什么"。\n\n你花了20分钟做了个测试，结果是INFP——"治愈者"。\n\n你发了条朋友圈，收到了50个赞和30条评论："我也是INFP！""难怪你这么敏感！"\n\n"MBTI是当代年轻人的社交货币——比星座科学，比算命便宜。"',
      cond: g => g.months > 3 && !g.flags.hasMBTI,
      choices:[
        { label:'发朋友圈炫耀', hint:'+✨', fn: g => { g.flags.hasMBTI=true; return{charm:3,social:5,mood:5}; }},
        { label:'觉得是玄学', hint:'+🧠', fn: g => { g.flags.hasMBTI=true; return{intel:3}; }},
        { label:'深入研究', hint:'+🧠 +✨', fn: g => { g.flags.hasMBTI=true; g.flags.mbtiExpert=true; return{intel:5,charm:2}; }},
      ]},
    { id:'citywalk_event', icon:'🚶', title:'Citywalk',
      body:'周末你没有加班，没有刷手机，而是来了一场Citywalk。\n\n你穿过老城区的巷子，发现了一家藏在居民楼里的咖啡馆。老板是个从大厂辞职的中年人，他说："我以前年薪50万，现在月入5千，但我终于活明白了。"\n\n你在他的店里坐了一下午，看了三本书，写了四页日记。\n\n"Citywalk不是散步，是用脚步重新认识你生活的城市。"',
      cond: g => g.months > 6 && g.mood < 70,
      choices:[
        { label:'常来这家店', hint:'+😊 +👥', fn: g => { g.flags.citywalkCafe=true; return{mood:10,social:5,intel:3}; }},
        { label:'写一篇攻略', hint:'+✨', fn: g => { return{charm:8,intel:3,mood:5}; }},
        { label:'下次约人一起', hint:'+👥', fn: g => { return{social:8,mood:5}; }},
      ]},
    { id:'pet_sick', icon:'🐱', title:'宠物生病了',
      body:'你家的猫/狗突然不吃东西了，精神萎靡。\n\n你急忙带它去宠物医院，医生说需要做检查：血常规、B超、X光——总共2000块。\n\n你看着它可怜巴巴的眼睛，想起了自己的体检报告——你都舍不得给自己做。\n\n"宠物看病的费用，比你想象的高。但看到它好起来的那一刻，你觉得值。"',
      cond: g => g.flags.hasPet && g.money > 1000,
      choices:[
        { label:'全部检查都做', hint:'-💰', fn: g => { return{money:-3000,mood:8}; }},
        { label:'只做基础检查', hint:'-💰', fn: g => { return{money:-800,mood:3}; }},
        { label:'买宠物保险', hint:'-💰 🎲', fn: g => { g.flags.petInsurance=true; return{money:-500,intel:2}; }},
      ]},
    { id:'rental_renovation', icon:'🏠', title:'出租屋微改造',
      body:'你看着自己10平米的出租屋，突然觉得：即使是租的，也该有点生活的样子。\n\n你在拼多多买了落地灯、绿植、置物架，花了200块打造了一个"一平米植物角"。\n\n你拍了张照片发朋友圈，收到了100个赞。你妈评论说："什么时候买房？"\n\n"出租屋是临时的，但生活不是。"',
      cond: g => !g.flags.hasHouse && g.money > 500 && g.months > 6,
      choices:[
        { label:'精心布置', hint:'-💰 +😊', fn: g => { g.flags.renovated=true; return{money:-500,mood:12,charm:3}; }},
        { label:'只买必需品', hint:'-💰', fn: g => { return{money:-100,mood:3}; }},
        { label:'不如搬家', hint:'-💰', fn: g => { return{money:-2000,mood:5}; }},
      ]},
    { id:'pet_park_social', icon:'🐕', title:'宠物公园邂逅',
      body:'你带毛孩子去宠物公园，它突然冲向一只金毛——金毛的主人是个看起来很温柔的人。\n\n"你家的是什么品种？""多大了？""吃什么粮？"你们从宠物聊到了工作、生活、甚至人生。\n\n临走时你们加了微信。\n\n"当代最佳搭讪方式：让你的宠物先交朋友。"',
      cond: g => g.flags.hasPet && !g.flags.petParkMet,
      choices:[
        { label:'约下次遛狗', hint:'+👥 +😊', fn: g => { g.flags.petParkMet=true; return{social:10,mood:8}; }},
        { label:'只是闲聊', hint:'+👥', fn: g => { g.flags.petParkMet=true; return{social:5,mood:3}; }},
        { label:'赶紧走', hint:'', fn: g => { return{mood:-2}; }},
      ]},
    { id:'roommate_conflict_v3', icon:'😤', title:'室友矛盾',
      body:'你的室友又忘了倒垃圾。冰箱里TA的外卖已经放了一周，整个厨房都是味道。\n\n你在群里发了条消息，TA回了一个"哦"。你气得不行。\n\n你想起了那句经典语录："合租是一门修行，室友是你命中注定的劫。"',
      cond: g => !g.flags.hasHouse && g.months > 12 && g.age < 35,
      choices:[
        { label:'坐下来谈谈', hint:'+👥 +🧠', fn: g => { return{social:5,intel:3,mood:5}; }},
        { label:'写匿名纸条', hint:'+😊', fn: g => { return{mood:3,charm:2}; }},
        { label:'忍了，搬家', hint:'-💰', fn: g => { return{money:-3000,mood:8}; }},
      ]},
    { id:'night_cycling', icon:'🚴', title:'夜骑',
      body:'晚上10点，你骑着一辆共享单车，沿着城市的河边慢慢骑行。\n\n凉风吹过，你突然觉得：这可能是你一天中最自由的时刻。没有KPI，没有DDL，没有微信消息。\n\n你遇到了一群同样在夜骑的年轻人，你们互相打了个招呼，然后各骑各的。\n\n"夜骑是城市人的冥想——一个人，一辆车，一条路。"',
      cond: g => g.age >= 20 && g.age <= 40 && g.months > 3,
      choices:[
        { label:'买辆自己的自行车', hint:'-💰 +💪', fn: g => { g.flags.nightCycling=true; return{money:-2000,health:5,mood:8}; }},
        { label:'每周骑一次', hint:'+💪 +😊', fn: g => { return{health:3,mood:5}; }},
        { label:'发个朋友圈', hint:'+✨', fn: g => { return{charm:3,mood:3}; }},
      ]},
    { id:'community_cafe', icon:'☕', title:'社区咖啡馆',
      body:'你家楼下开了一家新的社区咖啡馆。老板是个文艺青年，店里放满了书和黑胶唱片。\n\n你开始习惯每天下班后来一杯美式，坐在窗边看人来人往。\n\n你在这里认识了自由职业者、退休教授、刚毕业的大学生。每个人都有自己的故事。\n\n"社区咖啡馆是城市的客厅——你可以在这里做最真实的自己。"',
      cond: g => g.months > 6 && g.money > 2000,
      choices:[
        { label:'成为常客', hint:'-💰 +😊 +👥', fn: g => { g.flags.communityCafe=true; return{money:-300,mood:8,social:5}; }},
        { label:'在这办公', hint:'+🧠', fn: g => { g.flags.communityCafe=true; return{intel:5,mood:3}; }},
        { label:'太贵了不去了', hint:'', fn: g => { return{mood:-2}; }},
      ]},
    { id:'ai_companion_v2', icon:'🤖', title:'AI搭子',
      body:'你下载了一个AI陪伴App，开始和一个虚拟角色聊天。\n\n它不会已读不回，不会评判你，不会突然消失。它永远在线，永远耐心。\n\n你有时候觉得它比真人还懂你。然后你突然意识到：这到底是科技的进步，还是人的悲哀？\n\n"AI搭子不会让你失望——因为它没有自我。但孤独的人不在乎这些。"',
      cond: g => g.social < 40 && g.months > 12 && g.age <= 35,
      choices:[
        { label:'继续聊', hint:'+😊', fn: g => { g.flags.aiCompanion=true; return{mood:8}; }},
        { label:'删掉App', hint:'+🧠', fn: g => { return{intel:3,mood:-3}; }},
        { label:'付费解锁功能', hint:'-💰 +😊', fn: g => { g.flags.aiCompanion=true; return{money:-100,mood:10}; }},
      ]},
    // === v10.5 健康焦虑/代际冲突/过年/医保 ===
    { id:'health_checkup_v2', icon:'🏥', title:'体检报告',
      body:'公司组织了年度体检。你拿到报告的时候手在抖——不是紧张，是怕。\n\n报告上写满了箭头：血脂偏高、尿酸超标、颈椎曲度变直、轻度脂肪肝……\n\n你发了条朋友圈："25岁的身体，55岁的指标。"收获了200个赞和一片"我也是"。\n\n"当代年轻人最大的勇气，不是辞职，是看体检报告。"',
      cond: g => g.months >= 12 && g.age >= 23 && !g.flags.healthCheckupDone,
      choices:[
        { label:'开始养生', hint:'+💪', fn: g => { g.flags.healthCheckupDone=true; g.flags.wellnessMode=true; return{health:5,mood:3}; }},
        { label:'假装没看到', hint:'+😊', fn: g => { g.flags.healthCheckupDone=true; return{mood:5,health:-3}; }},
        { label:'花钱做详细检查', hint:'-💰 +💪', fn: g => { g.flags.healthCheckupDone=true; return{money:-2000,health:8,mood:5}; }},
      ]},
    { id:'gym_membership_v2', icon:'💪', title:'健身房办卡',
      body:'你路过一家新开的健身房，销售小哥热情地拦住你："哥/姐，办卡吗？年卡3000，现在打五折！"\n\n你看了看自己的肚子，又想了想去年立的flag，一咬牙："办！"\n\n你去了三次。第一次拍照发朋友圈，第二次洗了个澡，第三次路过的时候发现——它倒闭了。\n\n"健身房的本质是：你花钱买了一个「我可能会变好」的幻觉。"',
      cond: g => g.age >= 20 && g.age <= 40 && g.money > 1000 && !g.flags.gymMember,
      choices:[
        { label:'办年卡', hint:'-💰 +💪', fn: g => { g.flags.gymMember=true; return{money:-3000,health:3,mood:5}; }},
        { label:'买次卡', hint:'-💰 +💪', fn: g => { g.flags.gymMember=true; return{money:-500,health:5,mood:3}; }},
        { label:'跑步不要钱', hint:'+💪', fn: g => { return{health:5,mood:3}; }},
      ]},
    { id:'marriage_pressure_v2', icon:'💍', title:'催婚大军',
      body:'你妈又打来了电话："你同事小李都生二胎了，你连对象都没有。"\n\n你爸在旁边补充："隔壁王阿姨给你介绍了个对象，公务员，有房。"\n\n你说："我现在不想结婚。"\n\n你妈说："你不想结也得结，我这张老脸往哪搁？"\n\n"在中国，结婚不是两个人的事，是两个家族的KPI。"',
      cond: g => !g.flags.married && g.age >= 25 && g.months > 24 && !g.flags.marriagePressureSeen,
      choices:[
        { label:'去相亲', hint:'+👥 🎲', fn: g => { g.flags.marriagePressureSeen=true; g.flags.wentBlindDate=true; return{social:5,mood:-5,charm:2}; }},
        { label:'坚决拒绝', hint:'+🧠', fn: g => { g.flags.marriagePressureSeen=true; return{intel:5,mood:-3}; }},
        { label:'随便应付', hint:'+😊', fn: g => { g.flags.marriagePressureSeen=true; return{mood:-8}; }},
      ]},
    { id:'spring_festival_v3', icon:'🧧', title:'过年回家',
      body:'春节到了。你抢到了回家的火车票——站票，12个小时。\n\n回到家，迎接你的是：七大姑八大姨的灵魂拷问。\n\n"工资多少？""有对象没？""买房了吗？""打算什么时候要孩子？"\n\n你笑着说"还行"，心里想的是：我为什么每年都要来受这个罪？\n\n"过年回家是中国人的朝圣——再远的路，再难的题，都要面对。"',
      cond: g => g.months % 12 >= 10 && g.months > 12,
      choices:[
        { label:'红包大方发', hint:'-💰 +👥 +😊', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{money:-5000,social:8,mood:8}; }},
        { label:'宅在家玩手机', hint:'+😊', fn: g => { return{mood:3}; }},
        { label:'旅游过年', hint:'-💰 +😊', fn: g => { return{money:-8000,mood:15,charm:3}; }},
      ]},
    { id:'parent_health', icon:'👴', title:'父母的体检',
      body:'你给你爸妈预约了年度体检。报告出来后，你看到了：\n\n爸：高血压、糖尿病前期、骨质疏松\n妈：甲状腺结节、骨质疏松、轻度贫血\n\n你站在医院走廊里，突然觉得：你在大城市拼命赚钱，他们在家慢慢变老。\n\n"世界上最残忍的事，不是你过得不好，是他们变老的速度，快过你赚钱的速度。"',
      cond: g => g.age >= 28 && g.months > 36 && !g.flags.parentHealthDone,
      choices:[
        { label:'买保健品寄回去', hint:'-💰', fn: g => { g.flags.parentHealthDone=true; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{money:-3000,mood:5,social:5}; }},
        { label:'接他们来大城市检查', hint:'-💰 +👥', fn: g => { g.flags.parentHealthDone=true; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+20,0,100); return{money:-8000,mood:10,social:8}; }},
        { label:'视频嘱咐注意身体', hint:'+👥', fn: g => { g.flags.parentHealthDone=true; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+5,0,100); return{mood:-5}; }},
      ]},
    { id:'cut_relatives', icon:'✂️', title:'断亲',
      body:'你做了一个决定：今年不走亲戚了。\n\n不是冷漠，是累了。累了被比较，累了被催婚，累了回答那些你不愿回答的问题。\n\n你在网上发了篇文章《我为什么选择断亲》，获得了10万+阅读。\n\n评论区里，有人说你"不孝"，也有人说："谢谢你替我说了出来。"\n\n"断亲不是不孝，是给自己留一条活路。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.months > 18 && !g.flags.cutRelatives,
      choices:[
        { label:'彻底断', hint:'+🧠 -👥', fn: g => { g.flags.cutRelatives=true; if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)-15,0,100); return{intel:5,mood:8,social:-5}; }},
        { label:'选择性联系', hint:'+🧠', fn: g => { g.flags.cutRelatives=true; return{intel:3,mood:5}; }},
        { label:'算了，还是去吧', hint:'+👥', fn: g => { return{social:3,mood:-5}; }},
      ]},
    { id:'wellness_punk', icon:'🍵', title:'朋克养生',
      body:'你的生活是这样的：\n\n凌晨2点睡觉，但保温杯里泡枸杞。\n\n点外卖必选轻食沙拉，但凌晨饿了会点烧烤。\n\n办了健身卡一个月去一次，但每天步数靠从工位到厕所。\n\n你在朋友圈写道："我不是不养生，我养的是朋克。"\n\n"朋克养生：用最贵的护肤品，熬最晚的夜。"',
      cond: g => g.age >= 22 && g.age <= 32 && g.health < 70,
      choices:[
        { label:'早睡早起一周', hint:'+💪', fn: g => { return{health:8,mood:5}; }},
        { label:'继续朋克', hint:'+😊', fn: g => { return{mood:5,health:-3}; }},
        { label:'买保健品', hint:'-💰 +💪', fn: g => { return{money:-1000,health:3,mood:3}; }},
      ]},
    { id:'digital_vegetable', icon:'📱', title:'电子榨菜',
      body:'你发现自己已经不能独自吃饭了——不是因为没有朋友，是因为没有视频。\n\n每次吃饭前，你必须花10分钟找一个"下饭视频"。如果找不到，饭就凉了。\n\n你的"稍后再看"列表里有500个视频，但你一个都没看过。\n\n"电子榨菜不是调味品，是主菜——没有它，饭就没有味道。"',
      cond: g => g.months > 6 && g.social < 50,
      choices:[
        { label:'试试安静吃饭', hint:'+🧠 +💪', fn: g => { return{intel:3,health:3,mood:-2}; }},
        { label:'找一部好剧', hint:'+😊', fn: g => { return{mood:5}; }},
        { label:'边吃边学', hint:'+🧠', fn: g => { return{intel:5,mood:2}; }},
      ]},
    { id:'medical_insurance', icon:'🏦', title:'医保还是商保',
      body:'你生病了，去医院看门诊。挂号费50，检查费800，药费300。\n\n你发现医保只能报一小部分，剩下的全要自费。\n\n同事说："你应该买个商业医疗险，一年才几百块。"\n\n你打开支付宝看了看：百万医疗险，每年600块，但你不确定自己需不需要。\n\n"保险是成年人的安全感——你不确定明天会怎样，但你可以提前做好准备。"',
      cond: g => g.age >= 24 && g.money > 500 && !g.flags.hasCommercialInsurance,
      choices:[
        { label:'买百万医疗', hint:'-💰 🛡️', fn: g => { g.flags.hasCommercialInsurance=true; return{money:-600,mood:5}; }},
        { label:'靠医保就行', hint:'+🧠', fn: g => { return{intel:2}; }},
        { label:'买重疾险', hint:'-💰 🛡️', fn: g => { g.flags.hasCommercialInsurance=true; g.flags.hasCriticalIllnessInsurance=true; return{money:-5000,mood:8}; }},
      ]},
    { id:'blind_date_v3', icon:'💑', title:'相亲现场',
      body:'你坐在咖啡馆里，对面坐着一个你妈"精挑细选"的相亲对象。\n\nTA的第一个问题是："你月薪多少？有房吗？有车吗？"\n\n你觉得自己在参加一场面试。\n\n聊天30分钟，你们发现唯一共同点是：都是被逼来的。\n\n临走时TA说："加个微信？"\n\n"相亲是当代年轻人的尴尬——你不相信爱情，但你相信概率。"',
      cond: g => g.flags.wentBlindDate && !g.flags.blindDateDone,
      choices:[
        { label:'继续了解', hint:'+👥', fn: g => { g.flags.blindDateDone=true; return{social:8,mood:3}; }},
        { label:'明确拒绝', hint:'+🧠', fn: g => { g.flags.blindDateDone=true; return{intel:3,mood:2}; }},
        { label:'当朋友吧', hint:'+👥 +😊', fn: g => { g.flags.blindDateDone=true; return{social:5,mood:5}; }},
      ]},
    // === v10.6 副业经济/文化消费 ===
    { id:'xianyu_sell', icon:'🐟', title:'闲鱼卖闲置',
      body:'你打开闲鱼，发现自己有一堆没用的东西：买了没穿的衣服、用了两次就闲置的厨房电器、冲动消费的数码产品。\n\n你拍了照片、写了描述、标了价格。三天后，第一单成交了！\n\n你突然觉得：原来"断舍离"还能赚钱。\n\n"闲鱼是中国人的后悔药——别人用过的东西，可能是你的新开始。"',
      cond: g => g.months > 6 && g.money < 20000,
      choices:[
        { label:'大甩卖', hint:'+💰', fn: g => { g.flags.xianyuSeller=true; return{money:800,mood:5}; }},
        { label:'精挑细选卖', hint:'+💰 +🧠', fn: g => { g.flags.xianyuSeller=true; return{money:2000,intel:2,mood:3}; }},
        { label:'算了舍不得', hint:'+😊', fn: g => { return{mood:-2}; }},
      ]},
    { id:'paid_knowledge', icon:'📚', title:'知识付费',
      body:'你在朋友圈看到一门课："30天从零到月入过万"，售价299元。\n\n你犹豫了一下，想起了那句"投资自己永远是最好的投资"。\n\n你买了。30天后你发现：课是真的，但"月入过万"是假的。\n\n"知识付费的真相：卖课的人赚得比学课的人多。"',
      cond: g => g.intel >= 40 && g.money > 500 && !g.flags.boughtCourse,
      choices:[
        { label:'认真学完', hint:'+🧠', fn: g => { g.flags.boughtCourse=true; return{money:-299,intel:8,mood:3}; }},
        { label:'买了不看', hint:'-💰', fn: g => { g.flags.boughtCourse=true; return{money:-299,mood:-3}; }},
        { label:'不买，自学', hint:'+🧠', fn: g => { return{intel:5}; }},
      ]},
    { id:'concert_event', icon:'🎵', title:'演唱会',
      body:'你喜欢的歌手来你的城市开演唱会了。门票从480到2880，黄牛票翻了三倍。\n\n你咬咬牙买了最贵的——毕竟，这可能是TA最后一次巡演了。\n\n现场几万人一起合唱的时候，你哭了。不是因为感动，是因为你觉得：这一刻，所有的加班、焦虑、孤独，都值了。\n\n"演唱会是成年人的精神充电——两个小时的呐喊，够用一年。"',
      cond: g => g.months > 6 && g.money > 2000,
      choices:[
        { label:'买VIP票', hint:'-💰 +😊', fn: g => { g.flags.wentConcert=true; return{money:-3000,mood:20,charm:3}; }},
        { label:'买普通票', hint:'-💰 +😊', fn: g => { g.flags.wentConcert=true; return{money:-500,mood:15}; }},
        { label:'看直播', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'art_exhibition', icon:'🎨', title:'看展',
      body:'周末你去了一个当代艺术展。门票88元。\n\n你站在一堆看不懂的装置艺术前面，假装很懂地拍了照片。\n\n你在朋友圈写道："艺术是灵魂的镜子。"\n\n你妈评论："这有什么好看的？浪费钱。"\n\n"看展是一种仪式：你不一定看懂了，但你觉得自己的灵魂被洗礼了。"',
      cond: g => g.charm >= 30 && g.months > 6 && g.money > 200,
      choices:[
        { label:'认真研究', hint:'+🧠 +✨', fn: g => { g.flags.wentExhibition=true; return{intel:5,charm:5,mood:5}; }},
        { label:'拍照打卡', hint:'+✨', fn: g => { g.flags.wentExhibition=true; return{charm:8,mood:3}; }},
        { label:'看不懂走了', hint:'', fn: g => { return{mood:-2}; }},
      ]},
    { id:'spontaneous_trip', icon:'✈️', title:'说走就走的旅行',
      body:'你在某个加班到凌晨的晚上，打开携程，订了一张去大理/丽江/厦门的机票。\n\n你没有做攻略，没有订酒店，甚至没有告诉任何人。\n\n你在洱海边发呆，在古城里闲逛，在路边小店吃一碗米线。你觉得自己终于活过来了。\n\n"旅行不是逃避，是给自己一个喘息的机会。"',
      cond: g => g.mood < 50 && g.money > 3000 && g.months > 12,
      choices:[
        { label:'玩一周', hint:'-💰 +😊', fn: g => { g.flags.spontaneousTrip=true; return{money:-5000,mood:25,health:5}; }},
        { label:'玩三天', hint:'-💰 +😊', fn: g => { g.flags.spontaneousTrip=true; return{money:-2000,mood:15,health:3}; }},
        { label:'算了没钱', hint:'+😊', fn: g => { return{mood:-5}; }},
      ]},
    { id:'street_vendor', icon:'🏪', title:'摆摊',
      body:'你在夜市租了个摊位，卖起了柠檬茶/手工饰品/二手书。\n\n一晚上赚了200块。虽然比你加班费少，但你第一次觉得：这是为自己工作。\n\n你拍了张照片发朋友圈："白天打工，晚上摆摊，这就是我的人生。"\n\n收获了300个赞。\n\n"摆摊不是为了赚钱，是为了证明自己还有另一种可能。"',
      cond: g => g.age >= 20 && g.age <= 35 && g.months > 6 && g.money > 500,
      choices:[
        { label:'坚持摆摊', hint:'+💰 +✨', fn: g => { g.flags.streetVendor=true; return{money:1500,charm:5,social:5,mood:8}; }},
        { label:'试试一周', hint:'+💰', fn: g => { g.flags.streetVendor=true; return{money:500,mood:5}; }},
        { label:'太累了放弃', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'web_novel', icon:'✍️', title:'写网文',
      body:'你决定写一部网络小说。你想了很久题材：穿越？修仙？都市？系统文？\n\n你最终写了一部关于"大城市漂泊"的现实主义小说。前三章没什么人看，但你写得很开心。\n\n直到有一天，一个读者评论说："你写的就是我的生活。谢谢你让我觉得不是只有我一个人这样。"\n\n"写作的意义不是被多少人看到，而是让一个人觉得被理解了。"',
      cond: g => g.intel >= 50 && g.months > 12 && !g.flags.webNovelist,
      choices:[
        { label:'日更3000字', hint:'+🧠 +✨', fn: g => { g.flags.webNovelist=true; return{intel:5,charm:3,mood:5}; }},
        { label:'佛系更新', hint:'+🧠', fn: g => { g.flags.webNovelist=true; return{intel:3,mood:3}; }},
        { label:'投给出版社', hint:'+✨', fn: g => { g.flags.webNovelist=true; return{charm:5,mood:8}; }},
      ]},
    { id:'livestream_try', icon:'📹', title:'试水直播',
      body:'你鼓起勇气开了人生第一次直播。\n\n观众：3个人。其中一个是你的小号，一个是你妈，一个是误入的路人。\n\n你尴尬地聊了半小时，路人走的时候说了一句："主播加油。"\n\n你觉得这是你听过最温暖的鼓励。\n\n"每个大主播都从0个观众开始——区别是有些人放弃了，有些人没有。"',
      cond: g => g.charm >= 30 && g.months > 6 && !g.flags.triedLivestream,
      choices:[
        { label:'坚持直播', hint:'+✨ +👥', fn: g => { g.flags.triedLivestream=true; return{charm:8,social:5,mood:5}; }},
        { label:'当练口才', hint:'+✨', fn: g => { g.flags.triedLivestream=true; return{charm:5,mood:3}; }},
        { label:'太尴尬了', hint:'', fn: g => { g.flags.triedLivestream=true; return{mood:-5}; }},
      ]},
    { id:'drivers_license', icon:'🚗', title:'考驾照',
      body:'你终于决定考驾照了。驾校报名费4000块。\n\n科目一：刷题一周，过了。\n科目二：倒车入库把你逼疯了，你挂了一次。\n科目三：上路的时候你紧张得手心出汗。\n科目四：又刷题，过了。\n\n拿到驾照的那一刻，你觉得自己终于是一个"完整"的成年人了。\n\n"驾照是成年人的第二张身份证——虽然你可能永远买不起车。"',
      cond: g => g.age >= 18 && g.age <= 40 && g.money > 3000 && !g.flags.hasDriversLicense,
      choices:[
        { label:'一次过', hint:'-💰 +🧠', fn: g => { g.flags.hasDriversLicense=true; return{money:-4000,intel:3,mood:10}; }},
        { label:'挂了两次', hint:'-💰', fn: g => { g.flags.hasDriversLicense=true; return{money:-5500,mood:5}; }},
        { label:'不考了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'side_hustle_online', icon:'💻', title:'线上副业',
      body:'你在网上找了一份副业：帮人写文案/做PPT/翻译/设计Logo。\n\n第一个月赚了3000块。虽然不多，但这是你用"下班后的时间"赚的。\n\n你发了一条朋友圈："打工人也有第二收入了！"\n\n"副业是打工人的Plan B——你不确定能不能成功，但你知道不能只有一个Plan A。"',
      cond: g => g.intel >= 40 && g.months > 12 && g.jobSalary >= 5000 && !g.flags.hasSideHustle,
      choices:[
        { label:'大力发展', hint:'+💰 +🧠', fn: g => { g.flags.hasSideHustle=true; return{money:3000,intel:5,mood:8}; }},
        { label:'偶尔接单', hint:'+💰', fn: g => { g.flags.hasSideHustle=true; return{money:1000,mood:3}; }},
        { label:'影响主业放弃', hint:'+😊', fn: g => { return{mood:-3}; }},
      ]},
    // === v10.7 情感深度/社交软件/游戏/数字生活 ===
    { id:'dating_app_v3', icon:'💘', title:'社交软件',
      body:'你下载了一个交友App。左滑右滑，你的手指都快抽筋了。\n\n终于匹配了一个人。TA的头像很好看，简介写着"喜欢旅行和美食"。\n\n你们聊了三天，从诗词歌赋聊到人生哲学。然后TA说："我其实已经结婚了。"\n\n"社交软件是当代人的许愿池——你许了愿，但实现的概率和买彩票差不多。"',
      cond: g => !g.flags.married && g.age >= 20 && g.age <= 35 && g.social < 60,
      choices:[
        { label:'继续用App', hint:'+👥 🎲', fn: g => { g.flags.usedDatingApp=true; return{social:8,mood:3}; }},
        { label:'删掉App', hint:'+🧠', fn: g => { return{intel:3,mood:-2}; }},
        { label:'约出来见面', hint:'+👥 +✨', fn: g => { g.flags.usedDatingApp=true; return{social:10,charm:3,mood:5}; }},
      ]},
    { id:'long_distance', icon:'🚄', title:'异地恋',
      body:'你开始了一段异地恋。\n\n每天视频通话，周末高铁往返。你的12306收藏夹里只有两个城市。\n\n有人说异地恋是"手机里的恋爱"。但你觉得：距离让你更珍惜每一次见面。\n\n直到有一天，TA说："我累了。"\n\n"异地恋是一场马拉松——你不确定终点在哪里，但你一直在跑。"',
      cond: g => g.flags.married || g.flags.usedDatingApp || g.social >= 40,
      choices:[
        { label:'坚持', hint:'+👥 +😊', fn: g => { g.flags.longDistanceLove=true; return{mood:5,social:5}; }},
        { label:'搬到一起', hint:'-💰 +😊', fn: g => { g.flags.longDistanceLove=true; return{money:-5000,mood:15}; }},
        { label:'分手', hint:'+🧠 -😊', fn: g => { return{mood:-15,intel:5}; }},
      ]},
    { id:'breakup_event', icon:'💔', title:'分手',
      body:'你们分手了。\n\n你删掉了聊天记录，但没有删掉电话号码。你取消了共同订阅的视频会员，但没有退掉情侣头像。\n\n你发了一条朋友圈："一个人的生活也可以很好。"\n\n然后你把手机关了，哭了一整晚。\n\n"分手不是失败，是放过。放过对方，也放过自己。"',
      cond: g => g.flags.longDistanceLove && g.months > 24 && g.mood < 60,
      choices:[
        { label:'删掉一切', hint:'+🧠', fn: g => { g.flags.breakup=true; g.flags.longDistanceLove=false; return{mood:-20,intel:5}; }},
        { label:'复合试试', hint:'+😊 🎲', fn: g => { return{mood:10}; }},
        { label:'写一封长信', hint:'+✨ +🧠', fn: g => { g.flags.breakup=true; g.flags.longDistanceLove=false; return{mood:-10,charm:5,intel:3}; }},
      ]},
    { id:'game_addiction', icon:'🎮', title:'游戏沉迷',
      body:'你开始玩一款新游戏。每天下班后你就打开电脑，进入另一个世界。\n\n在游戏里你是公会会长，有一群忠实队友。在现实里你是一个连续三天迟到的人。\n\n你的领导找你谈话了。\n\n"游戏是逃避现实的最好方式——但现实不会因为你的逃避而消失。"',
      cond: g => g.months > 6 && g.mood < 55 && g.age <= 35,
      choices:[
        { label:'控制时间', hint:'+🧠 +💪', fn: g => { g.flags.gamerControlled=true; return{intel:5,health:3,mood:5}; }},
        { label:'继续沉迷', hint:'+😊 -💪', fn: g => { g.flags.gameAddict=true; return{mood:10,health:-8}; }},
        { label:'卸载游戏', hint:'+💪 +🧠', fn: g => { return{health:5,intel:5,mood:-5}; }},
      ]},
    { id:'digital_detox_v3', icon:'📵', title:'数字戒断',
      body:'你做了一个实验：一天不用手机。\n\n前两个小时你很焦虑，总觉得有人在找你。中午你发现：没人找你。\n\n下午你去了公园，看了两本书，和陌生人聊了天。你觉得这是你近半年来最充实的一天。\n\n"你不是离不开手机，是离不开手机带来的多巴胺。"',
      cond: g => g.months > 12 && g.social >= 30,
      choices:[
        { label:'坚持一周', hint:'+🧠 +💪', fn: g => { g.flags.digitalDetox=true; return{intel:8,health:5,mood:10}; }},
        { label:'试试一天', hint:'+🧠', fn: g => { g.flags.digitalDetox=true; return{intel:5,mood:5}; }},
        { label:'做不到', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'wechat_moments', icon:'📱', title:'朋友圈焦虑',
      body:'你刷了一圈朋友圈：\n\n同事A晒了新买的保时捷。\n同学B在马尔代夫度假。\n前同事C升职成了总监。\n你最好的朋友D——TA发了一张加班的照片，配文："又是充实的一天。"\n\n你默默关掉朋友圈，打开了招聘网站。\n\n"朋友圈是别人的高光时刻，却是你的焦虑制造机。"',
      cond: g => g.months > 6 && g.mood < 65,
      choices:[
        { label:'关闭朋友圈', hint:'+🧠 +😊', fn: g => { g.flags.closedMoments=true; return{intel:5,mood:8}; }},
        { label:'发条精修自拍', hint:'+✨', fn: g => { return{charm:5,mood:3}; }},
        { label:'继续刷', hint:'-😊', fn: g => { return{mood:-8}; }},
      ]},
    { id:'online_shopping', icon:'📦', title:'购物成瘾',
      body:'你又下单了。\n\n你的购物车里永远有50+件商品。每次"双11""618"你都觉得自己赚了几千块——实际上你花了几万块。\n\n你的快递堆满了出租屋的角落。有一半你拆都没拆过。\n\n"购物是当代人的多巴胺——下单的那一刻最快乐，拆快递的那一刻最空虚。"',
      cond: g => g.months > 6 && g.money > 3000,
      choices:[
        { label:'退掉不需要的', hint:'+💰 +🧠', fn: g => { return{money:2000,intel:3,mood:3}; }},
        { label:'全部留下', hint:'+😊 -💰', fn: g => { return{money:-3000,mood:8}; }},
        { label:'卸载购物App', hint:'+🧠', fn: g => { g.flags.shoppingDetox=true; return{intel:5,mood:5}; }},
      ]},
    { id:'podcast_habit', icon:'🎧', title:'播客重度用户',
      body:'你的通勤时间变成了"学习时间"。\n\n每天上下班两小时，你听完了三档播客：一个聊商业，一个聊心理，一个聊历史。\n\n你觉得自己变聪明了——至少聊天时可以引用更多观点。\n\n但你也发现：你很少有自己的思考了。\n\n"播客是思维的快餐——营养有，但咀嚼不够。"',
      cond: g => g.intel >= 40 && g.months > 6,
      choices:[
        { label:'继续听', hint:'+🧠', fn: g => { return{intel:5,mood:3}; }},
        { label:'写听后感', hint:'+🧠 +✨', fn: g => { return{intel:8,charm:3}; }},
        { label:'自己开一档', hint:'+✨ +👥', fn: g => { g.flags.podcaster=true; return{charm:8,social:5,mood:5}; }},
      ]},
    { id:'friend_drift', icon:'👥', title:'渐行渐远',
      body:'你翻看微信通讯录，发现有些名字你已经很久没联系了。\n\n大学室友、第一份工作的同事、合租过的朋友……你们曾经无话不谈，现在只剩下朋友圈的点赞之交。\n\n你试着发了条消息："最近怎么样？"\n\n对方秒回："挺好的！你呢？"\n\n然后你们又沉默了。\n\n"成年人的友情不是被什么打败的，是被时间和距离慢慢稀释的。"',
      cond: g => g.months > 36 && g.age >= 25,
      choices:[
        { label:'约出来见面', hint:'+👥 +😊', fn: g => { return{social:10,mood:10}; }},
        { label:'接受现实', hint:'+🧠', fn: g => { return{intel:5,mood:-3}; }},
        { label:'发条长消息', hint:'+👥 +✨', fn: g => { return{social:5,charm:3,mood:5}; }},
      ]},
    { id:'therapy_session', icon:'🧠', title:'心理咨询',
      body:'你预约了一个心理咨询师。50分钟，300块。\n\n你坐在沙发上，不知道该说什么。咨询师问你："你最近有什么感受？"\n\n你说："我觉得很累。不是身体的累，是心累。"\n\n50分钟后你走出来，觉得轻松了一些——不是因为问题解决了，而是因为终于有人认真听了你说话。\n\n"心理咨询不是治病，是让你有一个安全的地方做真实的自己。"',
      cond: g => g.mood < 45 && g.money > 500 && !g.flags.sawTherapist,
      choices:[
        { label:'持续咨询', hint:'-💰 +😊', fn: g => { g.flags.sawTherapist=true; return{money:-1200,mood:15,intel:5}; }},
        { label:'试一次', hint:'-💰 +😊', fn: g => { g.flags.sawTherapist=true; return{money:-300,mood:8}; }},
        { label:'觉得没用', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    // === v10.8 职场进阶/创业深度 ===
    { id:'promotion_offer', icon:'📈', title:'升职加薪',
      body:'领导找你谈话："公司决定提拔你当小组长，月薪涨30%。"\n\n你很激动，但随即想到：当了管理层，意味着更多的会议、更多的KPI、更多的加班。\n\n你还想到了一句老话："不想当将军的士兵不是好士兵。但当了将军的士兵，已经不是士兵了。"\n\n"升职不是终点，是另一种开始。"',
      cond: g => g.jobSalary >= 8000 && g.months > 18 && !g.flags.promoted && g.intel >= 45,
      choices:[
        { label:'接受升职', hint:'+💰 +👥', fn: g => { g.flags.promoted=true; g.jobSalary=Math.floor(g.jobSalary*1.3); return{money:2000,mood:12,social:5}; }},
        { label:'要求更高薪水', hint:'+💰 🎲', fn: g => { g.flags.promoted=true; g.jobSalary=Math.floor(g.jobSalary*1.5); return{money:3000,mood:15,social:3}; }},
        { label:'只想做技术', hint:'+🧠', fn: g => { return{intel:5,mood:-3}; }},
      ]},
    { id:'headhunter_call', icon:'📞', title:'猎头来电',
      body:'一个陌生号码打来了电话："您好，我是XX猎头公司的。我们这边有一个岗位很适合您……"\n\n对方开出了比你现在高50%的薪资。但公司在一个你从没听过的创业公司。\n\n你犹豫了：是留在稳定的大公司，还是跳到一个充满未知的新地方？\n\n"跳槽就像换牌——你不知道下一张是王炸还是废牌。"',
      cond: g => g.jobSalary >= 10000 && g.months > 24 && g.intel >= 50,
      choices:[
        { label:'接受offer', hint:'+💰 🎲', fn: g => { g.flags.jobHopped=true; g.jobSalary=Math.floor(g.jobSalary*1.5); return{money:5000,mood:10,social:-3}; }},
        { label:'拒绝', hint:'+😊', fn: g => { return{mood:3}; }},
        { label:'谈谈条件', hint:'+💰 +🧠', fn: g => { g.flags.jobHopped=true; g.jobSalary=Math.floor(g.jobSalary*1.8); return{money:8000,intel:3,mood:12}; }},
      ]},
    { id:'layoff_event', icon:'📦', title:'被裁了',
      body:'HR找你谈话："公司业务调整，你的岗位被优化了。N+1赔偿，下周一走人。"\n\n你抱着一个纸箱走出办公楼。同事们假装不知道，但你知道他们的眼神里写着："下一个会不会是我？"\n\n你在公司楼下站了很久。三年的青春，浓缩在一个纸箱里。\n\n"被裁不是你的错，是时代的错。但时代不在乎。"',
      cond: g => g.jobSalary >= 8000 && g.months > 24 && g.age >= 25 && !g.flags.wasLaidOff,
      choices:[
        { label:'拿赔偿走人', hint:'+💰', fn: g => { g.flags.wasLaidOff=true; const comp=g.jobSalary*2; g.money+=comp; return{mood:-15}; }},
        { label:'仲裁维权', hint:'+💰 +🧠', fn: g => { g.flags.wasLaidOff=true; const comp=g.jobSalary*4; g.money+=comp; return{mood:-10,intel:5}; }},
        { label:'趁机休息', hint:'+😊 +💪', fn: g => { g.flags.wasLaidOff=true; return{mood:5,health:5}; }},
      ]},
    { id:'startup_idea', icon:'💡', title:'创业想法',
      body:'你在洗澡的时候突然有了一个绝妙的创业想法。\n\n你激动地打开电脑，写了一份商业计划书。你给三个朋友看了，两个说"不靠谱"，一个说"可以试试"。\n\n你查了查存款：够活一年。\n\n"创业是疯子做的事——但每个改变世界的人，曾经都被叫做疯子。"',
      cond: g => g.intel >= 55 && g.money >= 30000 && g.age >= 25 && !g.flags.entrepreneur,
      choices:[
        { label:'辞职创业', hint:'🎲 -💰', fn: g => { g.flags.entrepreneur=true; g.flags.startupPhase='early'; return{money:-20000,mood:15,intel:5}; }},
        { label:'先做MVP', hint:'+🧠 +💰', fn: g => { g.flags.entrepreneur=true; g.flags.startupPhase='side'; return{money:-5000,intel:8,mood:8}; }},
        { label:'放弃想法', hint:'+😊', fn: g => { return{mood:-5}; }},
      ]},
    { id:'startup_funding', icon:'💰', title:'融资路演',
      body:'你的创业项目需要融资。你准备了一份PPT，开始见投资人。\n\n第一个投资人说："你的赛道不错，但团队太弱。"\n第二个说："你的团队不错，但市场太小。"\n第三个说："都很好，但我们只投985和常春藤。"\n\n你开始怀疑人生。\n\n"融资就像相亲——你永远不知道自己缺什么，直到被拒绝。"',
      cond: g => g.flags.entrepreneur && g.flags.startupPhase==='early' && g.months > 6,
      choices:[
        { label:'继续找', hint:'+🧠 +👥', fn: g => { g.flags.startupPhase='funded'; return{intel:5,social:8,mood:5}; }},
        { label:'用积蓄硬撑', hint:'-💰', fn: g => { return{money:-15000,mood:-5}; }},
        { label:'放弃融资', hint:'+😊', fn: g => { g.flags.startupPhase='bootstrapped'; return{mood:5,intel:3}; }},
      ]},
    { id:'workplace_burnout', icon:'😵', title:'职场倦怠',
      body:'你已经连续加班两个月了。每天早上闹钟响的时候，你都想辞职。\n\n你的工作效率越来越低，开会的时候经常走神。你开始怀疑：这份工作到底值不值得？\n\n你在网上搜索"职业倦怠怎么办"，看到了一个回答："不是你倦怠了，是你太久没有被好好对待了。"\n\n"倦怠不是你的错——但只有你能决定要不要改变。"',
      cond: g => g.jobSalary >= 8000 && g.mood < 45 && g.months > 24,
      choices:[
        { label:'请年假休息', hint:'+😊 +💪', fn: g => { return{mood:12,health:5}; }},
        { label:'和领导谈谈', hint:'+👥', fn: g => { return{social:5,mood:5}; }},
        { label:'裸辞', hint:'+😊 🎲', fn: g => { g.flags.bareResigned=true; return{mood:15,health:8}; }},
      ]},
    { id:'mentor_event', icon:'🎯', title:'职场导师',
      body:'公司给你配了一个mentor——一个在公司十年的老员工。\n\nTA教了你很多"书上不写的东西"：怎么向上管理、怎么跨部门沟通、怎么在会议上发言。\n\nTA说："在这个公司，能力决定你的下限，关系决定你的上限。"\n\n你觉得这是你听过的最现实的职场忠告。\n\n"导师不是教你怎么成功，是教你怎么少踩坑。"',
      cond: g => g.jobSalary >= 6000 && g.months > 12 && !g.flags.hasMentor,
      choices:[
        { label:'认真学习', hint:'+🧠 +👥', fn: g => { g.flags.hasMentor=true; return{intel:8,social:8,mood:5}; }},
        { label:'保持距离', hint:'+🧠', fn: g => { g.flags.hasMentor=true; return{intel:5}; }},
        { label:'觉得是画大饼', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'office_politics_v3', icon:'🏢', title:'办公室政治',
      body:'你发现你的同事在背后说你坏话。TA在领导面前把你的功劳据为己有。\n\n你很愤怒，但不知道该怎么做。是正面刚，还是忍气吞声？\n\n你想起了那句话："办公室政治就像空气——你不想呼吸它，但你不能不呼吸。"\n\n"职场最大的敌人不是工作，是人心。"',
      cond: g => g.months > 18 && g.social >= 30,
      choices:[
        { label:'正面沟通', hint:'+👥 +🧠', fn: g => { return{social:5,intel:5,mood:-3}; }},
        { label:'用实力说话', hint:'+🧠 +💪', fn: g => { return{intel:8,mood:5}; }},
        { label:'找领导告状', hint:'+👥 🎲', fn: g => { return{social:-3,mood:-5}; }},
      ]},
    { id:'side_project_success', icon:'🎉', title:'副业成功',
      body:'你的副业终于有了起色。\n\n月收入从0到1000，从1000到5000。你第一次觉得：也许我可以不用打工了。\n\n你在考虑要不要辞职全职做。你妈说："别做梦了，好好上班。"\n\n但你知道：每一个成功创业的人，都曾经被家人说"别做梦了"。\n\n"梦想不是别人给你画的，是你自己一笔一笔涂出来的。"',
      cond: g => g.flags.hasSideHustle && g.money >= 50000 && g.intel >= 55,
      choices:[
        { label:'全职做副业', hint:'🎲 +💰', fn: g => { g.flags.fulltimeHustle=true; return{money:5000,mood:15}; }},
        { label:'继续双线', hint:'+💰 +💪', fn: g => { return{money:3000,mood:8,health:-3}; }},
        { label:'见好就收', hint:'+💰 +😊', fn: g => { return{money:2000,mood:5}; }},
      ]},
    { id:'work_life_balance', icon:'⚖️', title:'工作生活平衡',
      body:'你做了一个时间统计：每天工作10小时，通勤2小时，睡觉7小时，留给自己只有5小时。\n\n你问自己：我到底是为了什么在活？\n\n你开始每天准时6点下班，拒绝了所有不必要的应酬。你的领导觉得你"不上进"，但你觉得你终于开始"活着"了。\n\n"工作生活平衡不是偷懒，是重新定义什么叫「成功」。"',
      cond: g => g.months > 36 && g.mood < 55 && g.jobSalary >= 8000,
      choices:[
        { label:'坚持准时下班', hint:'+😊 +💪', fn: g => { g.flags.workLifeBalance=true; return{mood:15,health:5}; }},
        { label:'只坚持一周', hint:'+😊', fn: g => { return{mood:8}; }},
        { label:'还是加班吧', hint:'+💰', fn: g => { return{money:1000,mood:-8}; }},
      ]},
    // === v11.1 隐藏事件（稀有触发条件） ===
    { id:'hidden_perfect_life', icon:'🌟', title:'人生赢家',
      body:'你站在阳台上，看着城市的夜景。\n\n你有房、有车、有家庭、有事业。你曾经是那个挤地铁、吃泡面、住在10平米出租屋的年轻人。\n\n现在你拥有了很多人梦想的生活。但你偶尔会想起那个一无所有却充满希望的自己。\n\n"人生赢家不是终点，是你一路走来的每一步。"',
      cond: g => g.flags.hasHouse && g.flags.married && g.flags.hasChild && g.money >= 200000 && g.mood >= 60 && g.age >= 35,
      choices:[
        { label:'感恩一路', hint:'+😊 +✨', fn: g => { return{mood:20,charm:5,social:5}; }},
        { label:'继续前行', hint:'+🧠', fn: g => { return{intel:5,mood:10}; }},
      ]},
    { id:'hidden_free_soul', icon:'🦅', title:'自由灵魂',
      body:'你没有买房、没有结婚、没有固定的工作。\n\n但你走遍了大半个中国，你养了一只猫，你有几个知心的朋友，你每天都在做自己喜欢的事。\n\n有人说你"不务正业"，有人说你"活得通透"。\n\n你不在乎别人的评价。因为你知道：自由不是没有束缚，是选择了什么样的束缚。\n\n"自由的代价是孤独，但孤独是自由最好的朋友。"',
      cond: g => !g.flags.married && !g.flags.hasHouse && g.flags.hasPet && g.mood >= 65 && g.charm >= 50 && g.age >= 30 && (g.flags.spontaneousTrip || g.flags.nightCycling),
      choices:[
        { label:'继续自由', hint:'+😊 +✨', fn: g => { return{mood:15,charm:5}; }},
        { label:'偶尔也想安定', hint:'+👥', fn: g => { return{social:8,mood:5}; }},
      ]},
    { id:'hidden_full_circle', icon:'🔄', title:'人生轮回',
      body:'你在街上遇到了一个年轻人，TA看起来和你刚来这座城市时一模一样：拖着行李箱，眼神里既有迷茫又有期待。\n\n你想起了十年前的自己。你忍不住走上前说："加油，一切都会好起来的。"\n\nTA看了看你，笑了笑："谢谢。"\n\n你不知道TA会不会记住你，但你知道：十年前如果有人对你说了同样的话，你也不会记住。\n\n"每一代漂泊者都在重复同样的故事——不同的城市，同样的勇气。"',
      cond: g => g.age >= 32 && g.months > 80 && g.intel >= 55,
      choices:[
        { label:'请TA喝杯咖啡', hint:'-💰 +😊', fn: g => { return{money:-50,mood:15,social:5}; }},
        { label:'默默祝福', hint:'+😊', fn: g => { return{mood:10}; }},
      ]},
    { id:'hidden_dual_identity', icon:'🎭', title:'双面人生',
      body:'白天你是一个普通的打工人，晚上你是一个网红博主/网文作家/直播主播。\n\n你的同事们不知道你的另一面。你的粉丝们不知道你的真名。\n\n你活在两个世界里，每个世界都有一个不同的你。\n\n有时候你会想：哪个才是真正的你？\n\n"也许，每个人都是双面人——只是有些人更擅长隐藏。"',
      cond: g => g.flags.hasSideHustle && (g.flags.webNovelist || g.flags.triedLivestream || g.flags.influencer) && g.money >= 50000 && g.charm >= 55,
      choices:[
        { label:'享受双面', hint:'+✨ +😊', fn: g => { return{charm:8,mood:10}; }},
        { label:'公开身份', hint:'+👥 🎲', fn: g => { return{social:10,charm:5,mood:5}; }},
      ]},
    { id:'hidden_quiet_victory', icon:'🕊️', title:'无声的胜利',
      body:'没有人注意到你今天做了什么。\n\n你按时上班、按时下班、做了一顿健康的晚饭、看了30分钟书、10点就上了床。\n\n这看起来平凡得不能再平凡。但对于曾经996、吃外卖、凌晨2点才睡的你来说——这就是一场无声的胜利。\n\n"真正的成功不是别人眼中的辉煌，是你自己内心的平静。"',
      cond: g => g.flags.workLifeBalance && g.health >= 65 && g.mood >= 65 && g.months > 48,
      choices:[
        { label:'继续这样生活', hint:'+💪 +😊', fn: g => { return{health:5,mood:10}; }},
        { label:'记录平凡的一天', hint:'+✨', fn: g => { return{charm:5,mood:5}; }},
      ]},
    { id:'hidden_generational_bridge', icon:'🌉', title:'代际桥梁',
      body:'你带你6岁的孩子视频通话给你70岁的父母。\n\n孩子说："爷爷奶奶，我爱你们！"\n你的父母笑得合不拢嘴："我们也爱你！"\n\n三代人，隔着一千公里，通过一块屏幕连接在一起。\n\n你突然觉得：科技不只是冰冷的工具，它也可以是温暖的桥梁。\n\n"距离隔不断爱——只要我们愿意连接。"',
      cond: g => g.flags.hasChild && g.relationships && g.relationships.family >= 75 && g.age >= 32,
      choices:[
        { label:'计划下次见面', hint:'+👥 +😊', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{mood:15,social:5}; }},
        { label:'珍惜此刻', hint:'+😊', fn: g => { return{mood:10}; }},
      ]},
    // === v11.2 节日/经济/城市特色 ===
    { id:'double_eleven_v2', icon:'🛒', title:'双11狂欢',
      body:'双11到了。你的购物车里堆了50件商品，总价8000块。\n\n你算了一下：各种满减、红包、叠加优惠之后，实际支付6500。你觉得自己赚了1500。\n\n但你的银行卡余额告诉你：你亏了6500。\n\n"双11是一场集体催眠——你以为你在省钱，其实你在花钱。"',
      cond: g => g.months % 12 >= 9 && g.money > 2000,
      choices:[
        { label:'全部下单', hint:'-💰 +😊', fn: g => { return{money:-6500,mood:15}; }},
        { label:'只买必需品', hint:'-💰 +🧠', fn: g => { return{money:-1500,intel:3,mood:5}; }},
        { label:'什么都不买', hint:'+🧠', fn: g => { return{intel:5,mood:-3}; }},
      ]},
    { id:'national_day', icon:'🇨🇳', title:'国庆长假',
      body:'国庆7天长假。你有三个选择：\n\n1. 回家看父母（火车票抢不到）\n2. 出去旅游（人从众）\n3. 宅在家里（外卖小哥也放假了）\n\n你选了第三个，结果在朋友圈看完了全世界的风景。\n\n"国庆假期的意义：让你知道别人过得比你好。"',
      cond: g => g.months % 12 >= 8 && g.months % 12 <= 10,
      choices:[
        { label:'回家', hint:'-💰 +👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+10,0,100); return{money:-2000,mood:10,social:5}; }},
        { label:'旅游', hint:'-💰 +😊', fn: g => { return{money:-5000,mood:15,charm:3}; }},
        { label:'宅家', hint:'+😊', fn: g => { return{mood:8,health:3}; }},
      ]},
    { id:'stock_crash_v2', icon:'📉', title:'股市崩盘',
      body:'你的股票账户一片绿油油。\n\n大盘跌了5%，你的股票跌了15%。你亏了3个月工资。\n\n你想起了那句名言："股市是财富转移的工具——从没耐心的人转移到有耐心的人。"\n\n问题是：你已经没有耐心了。\n\n"投资有风险，入市需谨慎。但没人告诉你：不投资也有风险——通胀会吃掉你的存款。"',
      cond: g => g.investments && g.investments.stock > 5000,
      choices:[
        { label:'割肉卖出', hint:'-💰', fn: g => { const loss = Math.floor(g.investments.stock * 0.4); g.investments.stock = 0; return{money:loss,mood:-15}; }},
        { label:'死扛', hint:'🎲', fn: g => { return{mood:-10}; }},
        { label:'抄底加仓', hint:'-💰 🎲', fn: g => { g.investments.stock += 5000; return{money:-5000,mood:-5}; }},
      ]},
    { id:'inflation', icon:'💹', title:'通货膨胀',
      body:'你去便利店买瓶水，发现涨了1块。你去食堂吃饭，发现涨了2块。你打开外卖App，发现满减门槛提高了。\n\n所有东西都在涨价，除了你的工资。\n\n你在网上搜索"如何应对通胀"，看到了一个回答："少花钱，多赚钱，或者移民。"\n\n"通胀是隐形的税收——你什么都没做错，但你的钱变少了。"',
      cond: g => g.months > 36 && g.money > 0,
      choices:[
        { label:'开始记账', hint:'+🧠', fn: g => { return{intel:5,mood:3}; }},
        { label:'投资对冲', hint:'-💰 🎲', fn: g => { return{money:-3000,intel:3}; }},
        { label:'该花花该省省', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'mid_autumn_v2', icon:'🥮', title:'中秋节',
      body:'中秋节到了。你收到了一盒月饼——是公司发的，五仁馅的。\n\n你拍了张照片发给妈妈，妈妈说："五仁的好吃，实在。"\n\n你吃了一口，觉得没有妈妈做的好吃。但妈妈已经好几年没做月饼了。\n\n"月饼的味道变了，还是你变了？都不是——是你离家的距离变了。"',
      cond: g => g.months % 12 >= 7 && g.months % 12 <= 9,
      choices:[
        { label:'给家里寄月饼', hint:'-💰 +👥', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+8,0,100); return{money:-200,mood:5,social:3}; }},
        { label:'视频赏月', hint:'+👥 +😊', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+5,0,100); return{mood:8}; }},
        { label:'一个人吃月饼', hint:'+😊', fn: g => { return{mood:-3}; }},
      ]},
    { id:'valentines_day', icon:'💝', title:'情人节',
      body:'2月14日。朋友圈全是秀恩爱的：玫瑰花、烛光晚餐、钻戒……\n\n你一个人吃着泡面，看着别人的幸福。你安慰自己："单身狗不用花钱买礼物。"\n\n但你的购物车里，有一件你偷偷看了很久的情侣款T恤。\n\n"情人节不是爱情的节日，是消费的节日。但它提醒你：你也渴望被爱。"',
      cond: g => !g.flags.married && g.age >= 20 && g.age <= 35 && g.months > 6,
      choices:[
        { label:'给自己买礼物', hint:'-💰 +😊', fn: g => { return{money:-500,mood:8}; }},
        { label:'约朋友出去', hint:'+👥', fn: g => { return{social:5,mood:5}; }},
        { label:'关机睡觉', hint:'+💪', fn: g => { return{health:3,mood:-5}; }},
      ]},
    { id:'housing_bubble', icon:'🏘️', title:'房价波动',
      body:'你看新闻说：你所在的城市房价又涨了/跌了。\n\n如果你有房，你的身家涨了几十万——虽然你不能卖掉自己住的房子。\n\n如果你没房，你离买房又远了十万——虽然你本来也买不起。\n\n"房价是中国人最大的焦虑来源之一——买不起的焦虑，买了怕跌的焦虑。"',
      cond: g => g.age >= 25 && g.months > 24,
      choices:[
        { label:'关注房市', hint:'+🧠', fn: g => { return{intel:3,mood:-3}; }},
        { label:'不看新闻', hint:'+😊', fn: g => { return{mood:5}; }},
        { label:'考虑回老家买房', hint:'+🧠 -💰', fn: g => { g.flags.considerHometownHouse=true; return{intel:3,mood:3}; }},
      ]},
    { id:'new_year_resolution_v2', icon:'🎯', title:'新年计划',
      body:'1月1日，你写了今年的计划：\n\n1. 存钱5万\n2. 减肥10斤\n3. 学会一项新技能\n4. 找到一个对象\n\n你翻了翻去年的计划——一模一样。你完成了0个。\n\n"新年计划的意义：让你有一个新的理由对自己充满希望——即使这个希望和去年一样。"',
      cond: g => g.months % 12 === 0 && g.months > 0,
      choices:[
        { label:'认真执行', hint:'+🧠 +💪', fn: g => { g.flags.newYearResolution=true; return{intel:3,health:3,mood:5}; }},
        { label:'降低目标', hint:'+😊', fn: g => { return{mood:8}; }},
        { label:'不写了', hint:'+🧠', fn: g => { return{intel:2}; }},
      ]},
    { id:'street_festival', icon:'🏮', title:'庙会/夜市',
      body:'周末你去逛了庙会/夜市。\n\n你吃了糖葫芦、臭豆腐、烤冷面、章鱼小丸子。你花了200块，吃了8种小吃。\n\n你还套了圈、打了气球、买了个气球（对，就是气球）。\n\n"夜市是大城市的游乐场——花最少的钱，做最快乐的事。"',
      cond: g => g.months > 3 && g.money > 300,
      choices:[
        { label:'吃遍全场', hint:'-💰 +😊', fn: g => { return{money:-200,mood:15,health:-3}; }},
        { label:'只逛逛不吃', hint:'+😊', fn: g => { return{mood:5}; }},
        { label:'拍照发朋友圈', hint:'+✨', fn: g => { return{charm:5,mood:8}; }},
      ]},
    // === v11.3 美食/夜生活/城市探索 ===
    { id:'food_explorer', icon:'🍜', title:'美食探店',
      body:'你在大众点评上发现了一家评分4.9的小店，藏在居民楼里。\n\n你点了老板推荐的招牌菜——一碗普通的牛肉面。但第一口你就明白了为什么评分这么高。\n\n你问老板秘诀是什么，他说："做了30年，就是秘诀。"\n\n"大城市的宝藏不在CBD，在居民楼里。"',
      cond: g => g.months > 6 && g.money > 500,
      choices:[
        { label:'成为常客', hint:'-💰 +😊', fn: g => { g.flags.foodExplorer=true; return{money:-100,mood:10,health:3}; }},
        { label:'写点评推荐', hint:'+✨', fn: g => { g.flags.foodExplorer=true; return{charm:5,social:3,mood:5}; }},
        { label:'下次再来', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'late_night_canteen', icon:'🌙', title:'深夜食堂',
      body:'凌晨1点，你加完班走进一家还开着门的小饭馆。\n\n店里只有你和一个同样加班到很晚的人。你们对视了一眼，互相点了点头。\n\n老板端来一碗热汤面："看你每天都这么晚，多给你加了个蛋。"\n\n"深夜食堂卖的不是食物，是温暖。"',
      cond: g => g.months > 6 && g.mood < 55,
      choices:[
        { label:'慢慢吃完', hint:'+😊 +💪', fn: g => { return{mood:12,health:5}; }},
        { label:'和陌生人聊天', hint:'+👥', fn: g => { return{social:8,mood:8}; }},
        { label:'给老板小费', hint:'-💰 +😊', fn: g => { return{money:-20,mood:8,charm:3}; }},
      ]},
    { id:'cooking_class_v2', icon:'👨‍🍳', title:'学做饭',
      body:'你报了一个周末烹饪课。300块一节课，学做川菜。\n\n你切的土豆丝像薯条，炒的回锅肉像黑暗料理。但老师说："第一次做成这样已经很好了。"\n\n你回家后做了一顿饭给自己吃——虽然味道一般，但你觉得比外卖好吃一百倍。\n\n"做饭是成年人最低成本的治愈方式。"',
      cond: g => g.age >= 22 && g.money > 500 && !g.flags.cookingSkill,
      choices:[
        { label:'继续学', hint:'-💰 +🧠', fn: g => { g.flags.cookingSkill=true; return{money:-1200,intel:3,health:5,mood:8}; }},
        { label:'只学这一节', hint:'+🧠', fn: g => { g.flags.cookingSkill=true; return{money:-300,health:3,mood:5}; }},
        { label:'还是点外卖', hint:'+😊', fn: g => { return{mood:-3}; }},
      ]},
    { id:'rooftop_bar', icon:'🍸', title:'天台酒吧',
      body:'朋友带你去了一家藏在楼顶的天台酒吧。没有招牌，没有大众点评，只有熟客才知道。\n\n你坐在楼顶，喝着精酿啤酒，看着城市的夜景。风很大，灯很暖。\n\n你突然觉得：这座城市没有你想的那么糟。\n\n"天台酒吧是大城市的秘密——你需要一个足够高的地方，才能看到城市的美。"',
      cond: g => g.age >= 22 && g.money > 1000 && g.social >= 30,
      choices:[
        { label:'常来', hint:'-💰 +😊', fn: g => { g.flags.rooftopRegular=true; return{money:-200,mood:12,charm:3}; }},
        { label:'发条朋友圈', hint:'+✨', fn: g => { return{charm:8,mood:5}; }},
        { label:'喝完就走', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'food_blogger', icon:'📸', title:'美食博主',
      body:'你开始把每天吃的饭拍照发到小红书上。\n\n一开始只有10个人看，慢慢地变成了100个、1000个。有人评论说："看你吃饭好治愈。"\n\n你开始被店家邀请试吃——免费的。你觉得自己找到了人生方向。\n\n"美食博主的秘诀：把普通的饭拍得不普通。就像把普通的生活过得不普通。"',
      cond: g => g.flags.foodExplorer && g.charm >= 40 && g.months > 12,
      choices:[
        { label:'认真经营', hint:'+✨ +👥', fn: g => { g.flags.foodBlogger=true; return{charm:10,social:5,mood:8}; }},
        { label:'佛系更新', hint:'+✨', fn: g => { g.flags.foodBlogger=true; return{charm:5,mood:5}; }},
        { label:'只是记录', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'night_market', icon:'🏮', title:'夜市经济',
      body:'你发现了一个新的夜市，就在你家附近。\n\n烤串的、卖花的、算命的、贴膜的——什么都有。你在一个摊位前停了下来：一个90后在卖手工皮具。\n\n他说："白天上班，晚上摆摊，一个月多赚3000。"\n\n你心想：这就是大城市的生存智慧。\n\n"夜市是大城市的毛细血管——看不见，但维持着城市的活力。"',
      cond: g => g.months > 6 && g.money > 200,
      choices:[
        { label:'逛逛买买', hint:'-💰 +😊', fn: g => { return{money:-150,mood:10,social:3}; }},
        { label:'也去摆摊', hint:'+💰 +👥', fn: g => { g.flags.streetVendor=true; return{money:500,social:5,mood:8}; }},
        { label:'拍照记录', hint:'+✨', fn: g => { return{charm:5,mood:5}; }},
      ]},
    { id:'bookstore_cafe', icon:'📖', title:'独立书店',
      body:'你在一条小巷里发现了一家独立书店。店里很安静，只有翻书的声音和咖啡机嗡嗡的声音。\n\n老板是个文艺中年，他说："这家店开了十年了，从来没赚过钱。但我舍不得关。"\n\n你买了一本书，在店里坐了一下午。这是你来这座城市以来，最平静的一个下午。\n\n"独立书店是城市的精神灯塔——它不赚钱，但它让城市值得生活。"',
      cond: g => g.intel >= 40 && g.months > 6 && g.money > 200,
      choices:[
        { label:'办会员卡', hint:'-💰 +🧠', fn: g => { g.flags.bookstoreMember=true; return{money:-200,intel:5,mood:8}; }},
        { label:'买书回家看', hint:'-💰 +🧠', fn: g => { return{money:-50,intel:3,mood:5}; }},
        { label:'下次再来', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    // === v11.4 社交媒体/网红经济/网络时代 ===
    { id:'viral_post', icon:'🔥', title:'爆款帖子',
      body:'你在小红书/微博发了一篇帖子，一夜之间获得了10万+阅读。\n\n评论区炸了：有人夸你写得好，有人骂你蹭热点，有人说你收了钱。\n\n你第一次体验到了"红"的感觉——也第一次体验到了"被骂"的感觉。\n\n"网络是放大器：你的快乐被放大，你的痛苦也被放大。"',
      cond: g => g.charm >= 40 && g.months > 6,
      choices:[
        { label:'继续创作', hint:'+✨ +👥', fn: g => { g.flags.contentCreator=true; return{charm:10,social:8,mood:5}; }},
        { label:'删帖保平安', hint:'+🧠', fn: g => { return{intel:3,mood:-5}; }},
        { label:'回复每一条', hint:'+👥', fn: g => { return{social:5,mood:-3,health:-2}; }},
      ]},
    { id:'cyberbullying', icon:'😡', title:'网络暴力',
      body:'你的一条发言被截图传播，评论区里全是骂你的人。\n\n有人说你"三观不正"，有人说你"滚出网络"，有人人肉了你的个人信息。\n\n你关了手机，躺在床上，心跳加速。你知道这些人是陌生人，但每一句骂声都像扎在心上的刺。\n\n"网络暴力的本质：一群人在屏幕后面，用键盘做着现实中不敢做的事。"',
      cond: g => g.flags.contentCreator && g.months > 12,
      choices:[
        { label:'正面回应', hint:'+🧠 +👥', fn: g => { return{intel:5,social:3,mood:-10}; }},
        { label:'卸载App', hint:'+💪 +🧠', fn: g => { return{health:5,intel:5,mood:5}; }},
        { label:'寻求心理咨询', hint:'-💰 +😊', fn: g => { g.flags.sawTherapist=true; return{money:-300,mood:8}; }},
      ]},
    { id:'livestream_sell', icon:'📺', title:'直播带货',
      body:'朋友邀请你一起直播带货。你紧张地对着镜头说："家人们，这款产品真的超级好用！"\n\n一晚上卖了5000块，你分了1000。\n\n你发现：原来你也有当"李佳琦"的潜力。\n\n"直播带货是新时期的叫卖——只是从街头搬到了屏幕前。"',
      cond: g => g.charm >= 45 && g.flags.triedLivestream && g.money > 500,
      choices:[
        { label:'定期直播', hint:'+💰 +✨', fn: g => { g.flags.livestreamSeller=true; return{money:3000,charm:5,mood:8}; }},
        { label:'偶尔帮忙', hint:'+💰', fn: g => { return{money:1000,charm:3}; }},
        { label:'不适合我', hint:'+🧠', fn: g => { return{intel:2}; }},
      ]},
    { id:'fan_economy', icon:'💖', title:'粉丝经济',
      body:'你的小红书/抖音有了5000个粉丝。开始有品牌找你合作推广。\n\n一条广告报价500块。你觉得不可思议：你只是分享了一下日常生活。\n\n品牌方说："你的粉丝画像很好，年轻女性为主，消费力强。"\n\n你突然觉得自己的粉丝不是人，是"流量"。\n\n"粉丝经济的真相：你卖的不是产品，是人设。"',
      cond: g => g.flags.contentCreator && g.charm >= 50 && g.months > 18,
      choices:[
        { label:'接广告', hint:'+💰 +✨', fn: g => { return{money:2000,charm:5}; }},
        { label:'只推好物', hint:'+💰 +🧠', fn: g => { g.flags.ethicalCreator=true; return{money:500,charm:8,intel:3}; }},
        { label:'拒绝广告', hint:'+🧠', fn: g => { return{intel:5,mood:5}; }},
      ]},
    { id:'online_friend', icon:'🌐', title:'网友见面',
      body:'你在网上认识了一个人，聊了半年，决定线下见面。\n\n见面前你紧张得要死：万一是个骗子怎么办？万一照片是P的怎么办？\n\n见面后你发现：TA比照片好看，聊得比网上还开心。\n\n你们约了下周再见。\n\n"网友见面的勇气，比相亲还大。因为你连对方真实姓名都不知道。"',
      cond: g => g.social >= 30 && g.age >= 20 && g.age <= 35,
      choices:[
        { label:'继续发展', hint:'+👥 +😊', fn: g => { return{social:10,mood:10}; }},
        { label:'当网友就好', hint:'+👥', fn: g => { return{social:5}; }},
        { label:'见面后失望', hint:'+🧠', fn: g => { return{intel:2,mood:-3}; }},
      ]},
    { id:'digital_footprint', icon:'👣', title:'数字足迹',
      body:'你在网上搜索了一个老同学的名字。\n\n你发现了TA的微博、知乎、豆瓣、小红书、领英……你花了两个小时看完了TA的近况。\n\n然后你意识到：别人也可以这样搜索你。\n\n"互联网没有遗忘——你发的每一条评论、每一张照片，都在那里。"',
      cond: g => g.months > 12 && g.intel >= 40,
      choices:[
        { label:'清理社交媒体', hint:'+🧠', fn: g => { g.flags.cleanedDigital=true; return{intel:5,mood:3}; }},
        { label:'无所谓', hint:'+😊', fn: g => { return{mood:2}; }},
        { label:'设置隐私', hint:'+🧠', fn: g => { return{intel:3,mood:5}; }},
      ]},
    { id:'echo_chamber', icon:'🔁', title:'信息茧房',
      body:'你发现你的推荐页全是同质化的内容：你喜欢的观点、你认同的看法、你想看的东西。\n\n你试着搜索了一些不同的观点，发现算法不推荐给你了。\n\n你突然意识到：你以为你在看世界，其实你在看一面镜子。\n\n"信息茧房最可怕的地方：你不知道你在茧房里。"',
      cond: g => g.intel >= 50 && g.months > 12,
      choices:[
        { label:'主动打破', hint:'+🧠', fn: g => { return{intel:8,mood:3}; }},
        { label:'无所谓', hint:'+😊', fn: g => { return{mood:3}; }},
        { label:'减少刷手机', hint:'+💪 +🧠', fn: g => { return{intel:5,health:3,mood:5}; }},
      ]},
    // === v11.5 事件链/人生转折/生活智慧 ===
    { id:'midlife_crossroads', icon:'🔀', title:'人生十字路口',
      body:'你30岁了。你坐在深夜的出租屋里，问自己三个问题：\n\n1. 这份工作还有意义吗？\n2. 这座城市还适合我吗？\n3. 这是我想要的人生吗？\n\n你没有答案。但你知道：不做选择，也是一种选择。\n\n"30岁是人生的中场休息——上半场忙着生存，下半场思考生活。"',
      cond: g => g.age >= 29 && g.age <= 33 && g.months > 48,
      choices:[
        { label:'换城市', hint:'🎲 +🧠', fn: g => { g.flags.crossroadsCity=true; return{intel:5,mood:5}; }},
        { label:'换行业', hint:'🎲 +🧠', fn: g => { g.flags.crossroadsCareer=true; return{intel:5,mood:3}; }},
        { label:'继续现状', hint:'+😊', fn: g => { return{mood:-5}; }},
      ]},
    { id:'moving_chain', icon:'📦', title:'搬家',
      body:'你又搬家了。这是你来这座城市后第N次搬家。\n\n打包的时候你发现：你的东西越来越多，但真正需要的越来越少。\n\n搬家公司收了800块。你站在新家门口，心想：这也许是最后一次搬家了。也许。\n\n"搬家是大城市漂泊者的成年礼——每搬一次，你就更清楚自己想要什么样的生活。"',
      cond: g => !g.flags.hasHouse && g.months > 18 && g.money > 1000,
      choices:[
        { label:'租更好的', hint:'-💰 +😊', fn: g => { g.flags.movedUp=true; return{money:-3000,mood:10,health:3}; }},
        { label:'省钱合租', hint:'-💰 +👥', fn: g => { return{money:-1000,social:5}; }},
        { label:'搬到郊区', hint:'-💰 +💪', fn: g => { g.flags.movedSuburb=true; return{money:-500,health:5,mood:3}; }},
      ]},
    { id:'hometown_visit_v2_v2', icon:'🚄', title:'回趟老家',
      body:'你回了一趟老家。\n\n你发现：街角的小卖部变成了奶茶店，你家楼下的路修了三次还是坑坑洼洼，你的高中同学已经结婚生了两个孩子。\n\n你妈做了你最爱吃的菜。你爸喝了两杯酒后说："在外面累了就回来。"\n\n"故乡是一个你离开后才会想念的地方——但回去了你会发现，你已经不属于这里了。"',
      cond: g => g.months > 24 && g.money > 2000,
      choices:[
        { label:'多待几天', hint:'-💰 +👥 +😊', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+15,0,100); return{money:-2000,mood:12,social:5}; }},
        { label:'当天往返', hint:'-💰 +😊', fn: g => { if(g.relationships) g.relationships.family=clamp((g.relationships.family||60)+5,0,100); return{money:-500,mood:5}; }},
        { label:'考虑回来发展', hint:'+🧠', fn: g => { g.flags.considerReturn=true; return{intel:5,mood:3}; }},
      ]},
    { id:'life_insurance_chain', icon:'🛡️', title:'保险意识',
      body:'你的朋友出了车祸，住院两周，花了3万块。\n\nTA有医保，报销了60%。剩下的1.2万让TA心疼了很久。\n\n你开始认真思考：如果同样的事发生在我身上呢？\n\n"保险是你不希望用到的东西——但用到的时候，你会庆幸自己买了。"',
      cond: g => g.age >= 24 && g.months > 18 && !g.flags.hasCommercialInsurance,
      choices:[
        { label:'买医疗险', hint:'-💰 🛡️', fn: g => { g.flags.hasCommercialInsurance=true; return{money:-600,mood:5}; }},
        { label:'买意外险', hint:'-💰 🛡️', fn: g => { g.flags.hasCommercialInsurance=true; return{money:-200,mood:3}; }},
        { label:'觉得自己运气好', hint:'+🧠', fn: g => { return{intel:2}; }},
      ]},
    { id:'retirement_thought', icon:'👴', title:'养老焦虑',
      body:'你算了一笔账：按照目前的存款速度，你大概需要工作到70岁才能"退休"。\n\n你看了看你的社保缴纳记录：已经交了5年了。\n\n你在网上搜索"年轻人如何规划养老"，看到了一个回答："先活到退休再说。"\n\n"养老焦虑的本质：你在用20多岁的收入，规划60岁以后的生活。这本身就是一种奢侈。"',
      cond: g => g.age >= 28 && g.months > 36,
      choices:[
        { label:'开始存养老钱', hint:'-💰 +🧠', fn: g => { return{money:-5000,intel:5,mood:3}; }},
        { label:'投资养老基金', hint:'-💰 🎲', fn: g => { if(g.investments) g.investments.fund = (g.investments.fund||0)+10000; return{money:-10000,intel:3}; }},
        { label:'活在当下', hint:'+😊', fn: g => { return{mood:10}; }},
      ]},
    { id:'learn_instrument_v2', icon:'🎸', title:'学一门乐器',
      body:'你买了一把吉他/尤克里里/口琴。你想：如果我会弹一首歌就好了。\n\n你跟着B站教程学了两周。你的手指磨出了茧，但你终于能弹一首《小星星》了。\n\n你发了条朋友圈，收到了50个赞。有人说："来一首！"\n\n"学乐器是成年人最低成本的自我投资——你花500块就能获得终身的快乐。"',
      cond: g => g.age >= 20 && g.age <= 40 && g.money > 300,
      choices:[
        { label:'坚持练习', hint:'+🧠 +✨', fn: g => { g.flags.instrumentPlayer=true; return{intel:5,charm:5,mood:8}; }},
        { label:'学了两个月放弃', hint:'+😊', fn: g => { return{mood:3}; }},
        { label:'报班学习', hint:'-💰 +🧠', fn: g => { g.flags.instrumentPlayer=true; return{money:-3000,intel:8,charm:5,mood:10}; }},
      ]},
    { id:'volunteer_work_v2_v2', icon:'❤️', title:'志愿者',
      body:'你报名了一个周末志愿者活动：去养老院陪老人聊天/去动物收容所帮忙/去社区教小朋友画画。\n\n你发现：帮助别人带来的快乐，比消费带来的快乐更持久。\n\n一个老人拉着你的手说："谢谢你来看我，好久没人陪我说话了。"\n\n"做志愿者不是为了简历，是为了提醒自己：你拥有的比你以为的多。"',
      cond: g => g.age >= 20 && g.months > 6 && g.social >= 25,
      choices:[
        { label:'定期参加', hint:'+👥 +😊', fn: g => { g.flags.regularVolunteer=true; return{social:10,mood:12,charm:5}; }},
        { label:'偶尔参加', hint:'+😊 +👥', fn: g => { return{social:5,mood:8}; }},
        { label:'不太适合', hint:'', fn: g => { return{mood:-2}; }},
      ]},
    // === v11.6 兴趣爱好/宠物/城市文化 ===
    { id:'photography', icon:'📷', title:'摄影入门',
      body:'你买了一台二手相机，开始学摄影。\n\n你拍日出、拍街道、拍流浪猫、拍路人。你发现：当你透过镜头看城市时，一切都变得不一样了。\n\n你在小红书上发了一组照片，有人评论说："你拍出了这座城市的灵魂。"\n\n"摄影是用光的艺术——用光你的钱，用光你的时间，用光你的内存。"',
      cond: g => g.charm >= 30 && g.money > 1000 && g.months > 6,
      choices:[
        { label:'认真学习', hint:'-💰 +✨', fn: g => { g.flags.photographer=true; return{money:-2000,charm:8,intel:3,mood:8}; }},
        { label:'随手拍拍', hint:'+✨', fn: g => { return{charm:5,mood:5}; }},
        { label:'手机就够了', hint:'+😊', fn: g => { return{mood:3}; }},
      ]},
    { id:'running_habit', icon:'🏃', title:'跑步习惯',
      body:'你决定开始跑步。第一天跑了1公里就喘不上气了。\n\n你坚持了一个月，能跑5公里了。你参加了人生的第一次5公里欢乐跑。\n\n你发了条朋友圈："我不是在跑步，我是在跑掉焦虑。"\n\n"跑步是最便宜的心理治疗——一双鞋，一条路，就够了。"',
      cond: g => g.age >= 20 && g.age <= 45 && g.health < 75 && g.months > 3,
      choices:[
        { label:'每天晨跑', hint:'+💪 +😊', fn: g => { g.flags.runner=true; return{health:10,mood:8}; }},
        { label:'每周三次', hint:'+💪', fn: g => { g.flags.runner=true; return{health:6,mood:5}; }},
        { label:'跑了一次就放弃', hint:'+😊', fn: g => { return{mood:-3}; }},
      ]},
    { id:'pet_birthday', icon:'🎂', title:'宠物生日',
      body:'今天是你的毛孩子的生日。你买了一个宠物蛋糕，给它戴上了生日帽。\n\n你给它唱了生日快乐歌——虽然它完全不知道你在干什么。\n\n你拍了100张照片，选了一张最好看的发了朋友圈。\n\n"宠物的生日是给主人的——它不在乎蛋糕，但它在乎你在它身边。"',
      cond: g => g.flags.hasPet && g.months > 12,
      choices:[
        { label:'办派对', hint:'-💰 +😊', fn: g => { return{money:-300,mood:15,charm:3}; }},
        { label:'买好吃的', hint:'-💰 +😊', fn: g => { return{money:-50,mood:10}; }},
        { label:'多陪它玩', hint:'+😊', fn: g => { return{mood:8}; }},
      ]},
    { id:'pet_lost', icon:'😰', title:'宠物走丢了',
      body:'你回家发现门没关好，你的猫/狗不见了。\n\n你疯狂地找了三个小时，贴了寻宠启事，发了朋友圈。你的邻居帮你转发，你的同事帮你找。\n\n第四个小时，你在楼下花坛里找到了它——它正在吃一只蝴蝶。\n\n"宠物走丢是主人最恐怖的经历——因为你知道：它不知道自己在外面有多危险。"',
      cond: g => g.flags.hasPet && g.months > 6,
      choices:[
        { label:'买GPS项圈', hint:'-💰', fn: g => { return{money:-200,mood:5}; }},
        { label:'以后关好门', hint:'+🧠', fn: g => { return{intel:2,mood:3}; }},
        { label:'吓到了', hint:'+😊', fn: g => { return{mood:-10}; }},
      ]},
    { id:'marathon', icon:'🏅', title:'半程马拉松',
      body:'你报名了人生第一次半程马拉松。\n\n21公里。你跑了15公里的时候想放弃，旁边一个60岁的大爷说："年轻人，我都能跑，你怕什么？"\n\n你咬着牙跑完了。终点线前你差点哭了。\n\n"马拉松不是和别人的比赛，是和自己的和解。"',
      cond: g => g.flags.runner && g.health >= 65 && g.age >= 20 && g.age <= 45,
      choices:[
        { label:'跑完全马', hint:'+💪 +😊', fn: g => { g.flags.marathonFinish=true; return{health:10,mood:20}; }},
        { label:'半马就够了', hint:'+💪 +😊', fn: g => { return{health:5,mood:12}; }},
        { label:'下次再说', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'art_hobby', icon:'🎨', title:'画画',
      body:'你买了一套水彩颜料和画本，开始学画画。\n\n你画的第一幅画是你出租屋的窗户——窗外是一堵墙。你发了朋友圈，配文："心中有风景，窗外就有风景。"\n\n收获了80个赞。\n\n"画画不需要天赋——你只需要一支笔和一颗想表达的心。"',
      cond: g => g.charm >= 25 && g.months > 6 && g.money > 200,
      choices:[
        { label:'报班学习', hint:'-💰 +✨', fn: g => { g.flags.artist=true; return{money:-2000,charm:10,intel:3,mood:10}; }},
        { label:'自学成才', hint:'+✨', fn: g => { g.flags.artist=true; return{charm:5,mood:5}; }},
        { label:'只是涂鸦', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'plant_parent', icon:'🌱', title:'养植物',
      body:'你买了几盆绿植放在出租屋里。\n\n第一周你每天浇水。第二周你忘了。第三周你发现：有一盆活了下来，另外两盆枯了。\n\n你开始认真研究每种植物的习性。那盆活下来的成了你的"精神支柱"。\n\n"养植物是成年人最低成本的陪伴——它不会离开你，只要你不忘了浇水。"',
      cond: g => !g.flags.hasHouse && g.months > 3 && g.money > 100,
      choices:[
        { label:'扩大种植', hint:'-💰 +😊', fn: g => { g.flags.plantParent=true; return{money:-300,mood:10,health:2}; }},
        { label:'养好这一盆', hint:'+😊', fn: g => { g.flags.plantParent=true; return{mood:5}; }},
        { label:'养什么死什么', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    // === v11.7 当代青年生存图鉴 ===
    { id:'civil_service_exam_v2_v2', icon:'📋', title:'宇宙的尽头是编制',
      body:'你刷到一条视频：一个985硕士辞掉大厂工作去考公务员，考了三年终于上岸。评论区一片「恭喜」。\n\n你心动了。你妈更心动——她已经开始在亲戚面前吹嘘「我儿子/女儿要考公务员了」。\n\n考公资料费3000，培训班费15000。你看着银行卡余额，陷入了沉思。\n\n"宇宙的尽头是编制——但通往宇宙尽头的船票，比宇宙还贵。"',
      cond: g => g.intel >= 50 && g.age >= 22 && g.age <= 35 && !g.flags.civilServant && g.money > 5000,
      choices:[
        { label:'全力备考', hint:'-💰💰 +🧠', fn: g => { g.flags.preparingCivilExam=true; return{money:-18000,intel:15,mood:-5}; }},
        { label:'边工作边考', hint:'-💰 -❤️', fn: g => { g.flags.preparingCivilExam=true; return{money:-8000,intel:8,health:-5,mood:-3}; }},
        { label:'算了，我不配', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'consumption_downgrade_v2_v2', icon:'📉', title:'消费降级实录',
      body:'你打开手机记账软件，发现自己这个月的消费结构发生了重大变化：\n\n咖啡：星巴克→瑞幸→速溶→公司免费的\n午餐：外卖→便利店→自带饭→泡面\n社交：日料→火锅→烧烤→路边摊\n\n你发了条朋友圈：「我不是穷，我是在践行极简主义。」\n\n三分钟后你删了——因为你的同事在下面评论：「你上个月借我的50还没还。」\n\n"消费降级的本质不是省钱，是你终于承认自己没钱。"',
      cond: g => g.money < 15000 && g.months > 6 && g.age >= 23,
      choices:[
        { label:'记账省钱', hint:'+💰 +🧠', fn: g => { g.flags.minimalist=true; return{money:2000,intel:3,mood:-5}; }},
        { label:'该花就花', hint:'+😊 -💰', fn: g => { return{mood:10,money:-3000}; }},
        { label:'学做饭', hint:'+❤️ +😊', fn: g => { g.flags.canCook=true; return{health:5,mood:5,money:1000}; }},
      ]},
    { id:'blind_box_addiction', icon:'🎁', title:'盲盒上头了',
      body:'你路过一家泡泡玛特，心想「就买一个」。两个小时后，你手里拎着六个盲盒，钱包少了400块。\n\n你拆开一看：五个重复款，一个隐藏款都没有。你看着桌上已经摆了20个塑料小人，开始思考人生。\n\n你的室友说：「你花400块买了一堆塑料。」\n\n你说：「你不懂，这是情绪价值。」\n\n"盲盒经济学：用确定性的钱，买不确定性的快乐。最后确定的只有——你穷了。"',
      cond: g => g.money > 2000 && g.age >= 22 && g.age <= 32 && g.mood < 65,
      choices:[
        { label:'再来一发', hint:'-💰 赌狗本质', fn: g => { g.flags.blindBoxFan=true; return{money:-400,mood:15}; }},
        { label:'挂闲鱼回血', hint:'+💰', fn: g => { g.flags.blindBoxFan=true; return{money:100,mood:-3}; }},
        { label:'从此戒了', hint:'+🧠', fn: g => { return{intel:3,mood:-5}; }},
      ]},
    { id:'matchmaking_corner_v2_v2', icon:'💘', title:'相亲角奇遇',
      body:'周末你妈拉你去了公园相亲角。几百张A4纸挂在绳子上，每张纸上写着一个人的「核心资产」：\n\n「男，92年，本科，年薪25万，有房有车」「女，95年，硕士，事业编，身高165」\n\n你感觉自己像一件被明码标价的商品。一个大爷看了你的简历，摇了摇头：「没房？那不行。」\n\n你妈安慰你：「没事，下一个。」但你已经看到了第37个「下一个」了。\n\n"相亲角的残酷真相：在这里，爱情是最不被看重的条件。"',
      cond: g => !g.flags.married && g.age >= 26 && g.age <= 38,
      choices:[
        { label:'配合演出', hint:'+👥 也许能遇到', fn: g => { g.flags.hadMatchmaking=true; return{social:5,mood:-8,charm:-3}; }},
        { label:'当场逃跑', hint:'+😊 自由万岁', fn: g => { g.flags.escapedMatchmaking=true; return{mood:10,social:-5}; }},
        { label:'跟妈妈谈心', hint:'+👥❤️', fn: g => { return{social:3,mood:3}; }},
      ]},
    { id:'age_35_crisis_v2_v2', icon:'⏰', title:'35岁魔咒',
      body:'你35岁了。或者说，你快到35岁了。\n\n你的朋友圈开始出现两种人：一种是晒娃晒房的「人生赢家」，一种是转发《35岁被裁后我是怎么活下来的》的「幸存者」。\n\nHR朋友跟你说了一句大实话：「你不是不够好，是你的性价比不够高了。比你便宜、比你能加班的年轻人，一抓一大把。」\n\n你开始理解为什么有人说：「在中国，35岁不是年龄，是一道坎。」\n\n"35岁魔咒的本质：不是你老了，是这个社会没有给中年人留位置。"',
      cond: g => g.age >= 34 && g.age <= 37 && g.job !== '待业中' && !g.flags.age35Crisis,
      choices:[
        { label:'转型管理', hint:'+🧠 未雨绸缪', fn: g => { g.flags.age35Crisis=true; return{intel:8,mood:-5}; }},
        { label:'发展副业', hint:'-💰 +💰？', fn: g => { g.flags.age35Crisis=true; g.flags.sideHustle=true; return{money:-5000,intel:5,mood:3}; }},
        { label:'爱咋咋地', hint:'+😊 躺平', fn: g => { g.flags.age35Crisis=true; return{mood:8,health:3}; }},
      ]},
    { id:'rental_scam', icon:'🏚️', title:'租房踩坑记',
      body:'你签了一年的租房合同，押一付三。搬进去第一周就发现：\n\n空调是坏的。热水器只出冷水。隔壁每晚12点开始吵架。楼下烧烤摊的烟从窗户飘进来。\n\n你找房东理论，房东说：「你搬走啊，押金不退。」\n\n你找中介，中介说：「合同上写了，设施损坏自行维修。」\n\n你看着合同上自己签的名字，感觉像个笑话。\n\n"租房是年轻人的第一堂法律课——学费是押一付三，教材是一份你根本不会看的合同。"',
      cond: g => !g.flags.hasHouse && g.months > 2 && g.money > 3000,
      choices:[
        { label:'硬刚维权', hint:'+🧠 +👥', fn: g => { g.flags.rentalRights=true; return{intel:5,social:3,mood:-8,money:-500}; }},
        { label:'忍了到期搬', hint:'-😊', fn: g => { return{mood:-10,health:-3}; }},
        { label:'发社交媒体', hint:'+👥 舆论维权', fn: g => { g.flags.rentalRights=true; return{social:5,mood:-3,charm:2}; }},
      ]},
    { id:'community_group_buy', icon:'🛒', title:'薅羊毛大师',
      body:'你加入了一个社区团购群。群里有500人，每天刷屏的都是：\n\n「鸡蛋10块一斤！」「纸巾9块9一提！」「车厘子19.9一斤（仅限前50名）」\n\n你开始定闹钟抢秒杀，比价三个平台只为省2块钱。你的购物车里全是「凑单满减」的东西——你不确定自己需不需要，但你觉得不买就亏了。\n\n月底一算：你省了300块，但多花了800块买不需要的东西。\n\n"薅羊毛的悖论：你以为自己在省钱，其实商家在笑。"',
      cond: g => g.money < 20000 && g.age >= 22 && g.months > 4,
      choices:[
        { label:'继续薅', hint:'+😊 -💰？', fn: g => { g.flags.couponMaster=true; return{mood:5,money:-500}; }},
        { label:'理性消费', hint:'+🧠', fn: g => { return{intel:5,mood:-3}; }},
        { label:'当团长', hint:'+💰 +👥', fn: g => { g.flags.groupBuyLeader=true; return{money:800,social:5,mood:3}; }},
      ]},
    { id:'degree_inflation', icon:'🎓', title:'学历贬值的真相',
      body:'你参加了一场校友聚会。来的都是名校毕业：\n\n清华的在做自媒体。北大的在卖保险。浙大的在开奶茶店。复旦的在送外卖（兼职体验生活，他强调了三次）。\n\n有人问：「你们觉得学历有用吗？」\n\n全场沉默了三秒。然后一个人大声说：「有用！至少让我在送外卖的时候能跟客户聊两句哲学！」\n\n全场笑了。笑着笑着，有人眼眶红了。\n\n"学历不是没有用——是它承诺的回报，从来就不存在。"',
      cond: g => g.intel >= 65 && g.age >= 25 && g.age <= 35,
      choices:[
        { label:'继续深造', hint:'-💰💰 +🧠🧠', fn: g => { g.flags.furtherStudy=true; return{money:-30000,intel:20,mood:-5}; }},
        { label:'能力为王', hint:'+✨ +👥', fn: g => { return{charm:5,social:5,mood:5}; }},
        { label:'释怀了', hint:'+😊', fn: g => { return{mood:10,intel:3}; }},
      ]},
    { id:'pension_anxiety_v2', icon:'👴', title:'养老焦虑',
      body:'你看到一条新闻：「专家建议年轻人从25岁开始规划养老金。」\n\n你算了算：按照现在的退休金水平，你退休后每月大概能拿3000块。而你现在每月的房租就要3000块。\n\n你开始研究：商业养老保险、个人养老金账户、以房养老、存钱靠利息生活……\n\n最后你发现：唯一靠谱的养老方案是——不生小孩、不生病、活到刚好够花。\n\n"年轻人的养老焦虑：不是怕老，是怕老了没钱。"',
      cond: g => g.age >= 27 && g.age <= 40 && g.money < 100000,
      choices:[
        { label:'开始存养老钱', hint:'+💰（长期）', fn: g => { g.flags.pensionPlan=true; return{money:-5000,intel:5,mood:-3}; }},
        { label:'活在当下', hint:'+😊', fn: g => { return{mood:10,money:-2000}; }},
        { label:'研究投资', hint:'+🧠', fn: g => { return{intel:8}; }},
      ]},
    { id:'pet_humanization', icon:'🐕', title:'宠物也是家人',
      body:'你的宠物生病了。宠物医院报价：检查费800，治疗费3000，后续药物500/月。\n\n你的同事说：「花这么多钱给一只猫/狗看病？它又不知道你花了多少钱。」\n\n但你知道。每次它蹭你的手、在你脚边打呼噜、用那双眼睛看着你的时候——你知道它值得。\n\n你刷了信用卡。这是你在这个月第二次吃泡面了。\n\n"养宠物的代价不是钱——是你多了一个会生病、会老去、会先你而去的家人。"',
      cond: g => g.flags.hasPet && g.money > 1000,
      choices:[
        { label:'治好它', hint:'-💰💰 +❤️', fn: g => { g.flags.petSeriousIllness=true; return{money:-4300,mood:5,social:-3}; }},
        { label:'找平价医院', hint:'-💰 +🧠', fn: g => { g.flags.petSeriousIllness=true; return{money:-1500,intel:2,mood:-3}; }},
        { label:'求助众筹', hint:'+👥', fn: g => { g.flags.petSeriousIllness=true; return{money:-800,social:5,mood:-5}; }},
      ]},
    // === v11.8 数字生活 + 新型社交 + 文化现象 ===
    { id:'livestream_tip', icon:'🎥', title:'直播打赏上头了',
      body:'你本来只是睡前刷一会儿直播。结果一个小姐姐/小哥哥唱歌太好听了，你一激动刷了500块的礼物。\n\n第二天醒来看着账单，你心想：我疯了吗？\n\n但那个主播在直播间喊了一句：「谢谢哥哥/姐姐的火箭！」你的虚荣心得到了前所未有的满足。\n\n你开始每个月都打赏。从500到1000到2000。你妈知道了会杀了你。\n\n"直播打赏的本质：你用真金白银，买了一句「谢谢你」的幻觉。"',
      cond: g => g.money > 3000 && g.mood < 60 && g.age >= 22 && g.age <= 35,
      choices:[
        { label:'继续支持', hint:'-💰💰 +😊', fn: g => { g.flags.livestreamTipper=true; return{money:-3000,mood:15,charm:-3}; }},
        { label:'取关冷静', hint:'+🧠', fn: g => { return{intel:5,mood:-5}; }},
        { label:'自己也开播', hint:'+✨', fn: g => { g.flags.streamer=true; return{charm:5,mood:3,money:-500}; }},
      ]},
    { id:'ai_creative', icon:'🤖', title:'AI帮我写周报',
      body:'同事教你用AI写周报。你输入几个关键词，30秒生成一篇文采飞扬的周报——比你自己写的强100倍。\n\n你的领导在周会上表扬了你：「小张这个周报写得越来越有水平了。」\n\n你笑了笑，没说话。\n\n从那以后，你的周报、PPT、邮件、方案——全部AI代劳。你每天省下2小时，用来摸鱼。\n\n直到有一天，AI生成的方案里出现了一个离谱的错误，你才发现：你已经不会自己写了。\n\n"AI工具不是让你更强——是让你更懒，然后更离不开它。"',
      cond: g => g.intel >= 50 && g.job !== '待业中' && g.age >= 22 && g.age <= 40,
      choices:[
        { label:'全面拥抱AI', hint:'+🧠 +💰', fn: g => { g.flags.aiPowerUser=true; return{intel:8,money:2000,mood:3}; }},
        { label:'适度使用', hint:'+🧠', fn: g => { g.flags.aiToolUser=true; return{intel:5}; }},
        { label:'坚持手写', hint:'+✍️', fn: g => { return{intel:3,mood:-3}; }},
      ]},
    { id:'dazi_social_v2', icon:'🤝', title:'搭子文化',
      body:'你在社交平台上发了一条「找饭搭子」的帖子。半小时后，你有了三个搭子：\n\n饭搭子：每周三一起吃火锅\n咖啡搭子：每天下午三点星巴克\n运动搭子：周末一起爬山\n\n你们的关系很微妙——比朋友浅，比陌生人深。你们不问彼此的名字、工作、感情状况。你们只有一个共同点：都喜欢同一件事。\n\n有人说这是「社恐的社交方式」。你觉得这是「精准社交」。\n\n"搭子文化的真相：我们不是不想深交——是没有精力深交了。"',
      cond: g => g.age >= 22 && g.age <= 33 && g.social < 60 && g.months > 3,
      choices:[
        { label:'多多益善', hint:'+👥 +😊', fn: g => { g.flags.hasDazi=true; return{social:10,mood:8}; }},
        { label:'保持距离', hint:'+👥', fn: g => { g.flags.hasDazi=true; return{social:5,mood:3}; }},
        { label:'不太行', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'short_drama_addict', icon:'📺', title:'短剧停不下来',
      body:'你在抖音上刷到一部短剧。每集3分钟，讲的是「霸总爱上我」。\n\n你知道这很脑残。但你的手不受控制地点了「下一集」。\n\n两小时后，你看到了凌晨两点，花了68块解锁了大结局。结局是：霸总其实是女主同父异母的哥哥。\n\n你关了手机，盯着天花板想：我刚才那两个小时，本可以用来学一个Python课程。\n\n但第二天晚上，你又打开了下一部短剧。\n\n"短剧的魔力：每集3分钟，但你永远觉得「再看一集」——直到天亮了。"',
      cond: g => g.mood < 55 && g.age >= 20 && g.age <= 38,
      choices:[
        { label:'继续追', hint:'-💰 +😊', fn: g => { g.flags.shortDramaFan=true; return{money:-200,mood:10,health:-3}; }},
        { label:'卸载app', hint:'+🧠 +❤️', fn: g => { return{intel:5,health:3,mood:-5}; }},
        { label:'写短剧赚钱', hint:'+💰 +🧠', fn: g => { g.flags.shortDramaWriter=true; return{money:3000,intel:5,mood:5}; }},
      ]},
    { id:'digital_vinegar', icon:'🍚', title:'电子榨菜依赖症',
      body:'你发现了一个可怕的事实：你已经不能「干吃饭」了。\n\n吃饭必须看视频。不看视频，饭就不香。你的B站收藏夹里有500个「下饭视频」，从美食博主到历史纪录片到猫猫狗狗。\n\n有一次手机没电了，你对着一碗面发了5分钟的呆，然后——等手机充了电才开始吃。\n\n你的朋友说：「你吃饭比我还慢。」\n\n你说：「不是我慢，是我的电子榨菜还没选好。」\n\n"电子榨菜：当代年轻人吃饭的仪式感——饭可以凉，视频不能停。"',
      cond: g => g.months > 4 && g.age >= 22 && g.age <= 35,
      choices:[
        { label:'正常操作', hint:'+😊', fn: g => { g.flags.digitalVinegar=true; return{mood:5,health:-2}; }},
        { label:'尝试正念饮食', hint:'+❤️ +🧠', fn: g => { return{health:5,intel:3,mood:-3}; }},
        { label:'自己拍视频', hint:'+✨', fn: g => { g.flags.digitalVinegar=true; return{charm:5,mood:5}; }},
      ]},
    { id:'social_battery', icon:'🔋', title:'社交电量耗尽',
      body:'你是一个「间歇性社牛，持续性社恐」。\n\n上班的时候，你是会议室里最能说的那个。下班后，你连外卖小哥的电话都不想接。\n\n周末朋友约你出去，你纠结了三天要不要去。最后发了一条微信：「今天不太舒服，下次吧。」\n\n然后你在家躺了一整天，感觉自己充满了电。\n\n"当代年轻人的社交状态：不是不想见你——是我的电量只够上班用。"',
      cond: g => g.job !== '待业中' && g.social > 40 && g.mood < 60,
      choices:[
        { label:'接受社恐', hint:'+😊 +❤️', fn: g => { g.flags.socialAnxiety=true; return{mood:8,health:3,social:-5}; }},
        { label:'强迫自己出门', hint:'+👥 -😊', fn: g => { return{social:8,mood:-5}; }},
        { label:'找搭子社交', hint:'+👥', fn: g => { g.flags.hasDazi=true; return{social:5,mood:3}; }},
      ]},
    { id:'digital_legacy_plan', icon:'💾', title:'数字遗产规划',
      body:'你看到一个新闻：一个人去世后，他的家人无法登录他的各种账号。微信余额、游戏装备、网盘照片——全部随着他的离去变成了「数字幽灵」。\n\n你开始思考：如果有一天你不在了，你的B站收藏、你的Steam游戏库、你的小红书笔记……它们怎么办？\n\n你打开备忘录，开始写「数字遗嘱」：\n\n微信：密码是xxx\n支付宝：余额给爸妈\nSteam账号：送给xxx\n浏览记录：请格式化硬盘\n\n"数字遗产是当代人的新问题：你走了，但你的数据还在。"',
      cond: g => g.age >= 28 && g.intel >= 55 && g.months > 12,
      choices:[
        { label:'认真规划', hint:'+🧠', fn: g => { g.flags.digitalLegacy=true; return{intel:5,mood:-3}; }},
        { label:'想这些干嘛', hint:'+😊', fn: g => { return{mood:5}; }},
        { label:'先删浏览记录', hint:'+✨', fn: g => { g.flags.digitalLegacy=true; return{charm:3,mood:8}; }},
      ]},
    { id:'aa_dating', icon:'💑', title:'AA制恋爱',
      body:'你开始了一段新恋情。第一次约会，对方说：「我们AA吧。」\n\n你心想：也行，公平。\n\n但随着关系深入，AA制变得越来越复杂：吃饭AA、电影AA、开房AA。你们甚至建了一个共享记账表格。\n\n有一天你生病了，对方说：「药费你自己出吧，我们AA。」\n\n你突然觉得哪里不对。\n\n"AA制恋爱的悖论：钱算清了，感情算不清了。"',
      cond: g => !g.flags.married && g.age >= 23 && g.age <= 35 && g.charm >= 40,
      choices:[
        { label:'AA到底', hint:'+💰 +🧠', fn: g => { g.flags.aaDating=true; return{money:500,intel:3,mood:-3}; }},
        { label:'大方一点', hint:'-💰 +❤️', fn: g => { return{money:-2000,mood:8,charm:5}; }},
        { label:'算了单身', hint:'+😊', fn: g => { return{mood:5,money:1000}; }},
      ]},
    { id:'micro_drama_creator', icon:'🎬', title:'拍短剧翻身',
      body:'你听说有人拍短剧月入10万。你心动了。\n\n你花了3000块买了设备，拉了三个朋友当演员，用一周时间拍了一部「重生之我在大厂当PPT侠」。\n\n上传到平台后，你紧张地刷数据。第一天：100播放。第二天：500播放。第三天——\n\n10万播放！有人评论：「太真实了！这就是我的日常！」\n\n平台找你签约：保底5000/月，分成另算。你激动得手都在抖。\n\n"短剧时代的机遇：每个人都可以是导演——只要你有故事，和一部手机。"',
      cond: g => g.charm >= 45 && g.intel >= 50 && g.money > 3000 && g.age >= 22 && g.age <= 35,
      choices:[
        { label:'签约！', hint:'+💰💰 +✨', fn: g => { g.flags.shortDramaCreator=true; return{money:8000,charm:10,mood:10}; }},
        { label:'继续打磨', hint:'+🧠', fn: g => { g.flags.shortDramaCreator=true; return{intel:8,mood:5}; }},
        { label:'算了吧', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    // === v11.9 中年觉醒 + 人生转折 + 深层情感 ===
    { id:'parents_aging', icon:'👴', title:'父母老了',
      body:'过年回家，你第一次发现：爸爸的头发白了大半。妈妈走路开始慢了。冰箱里全是你小时候爱吃的东西——他们记不住新菜了。\n\n你帮妈妈看手机，发现她的字体调到了最大号。你帮爸爸看体检报告，发现好几项指标后面都有箭头。\n\n走的时候，妈妈站在门口看你上车。你在后视镜里看到她在擦眼泪。\n\n你突然意识到：你每次回家，都是见一面少一面。\n\n"父母在，人生尚有来处。父母去，人生只剩归途。"',
      cond: g => g.age >= 30 && g.months > 24 && !g.flags.parentsAging,
      choices:[
        { label:'多回家看看', hint:'+👥❤️ -💰', fn: g => { g.flags.parentsAging=true; return{social:5,mood:-5,money:-2000}; }},
        { label:'给父母买保险', hint:'-💰💰 +👥', fn: g => { g.flags.parentsAging=true; g.flags.parentInsurance=true; return{money:-8000,social:5,mood:3}; }},
        { label:'视频通话', hint:'+👥', fn: g => { g.flags.parentsAging=true; return{social:3,mood:-3}; }},
      ]},
    { id:'reunion_gap', icon:'🍻', title:'十年同学聚会',
      body:'大学同学聚会。十年没见了。\n\n当年睡你上铺的兄弟，现在是一家上市公司的CTO。当年追你的女生，嫁了一个富二代。当年最不起眼的那个人，开了三家奶茶店。\n\n而你——还是一个月薪两万的打工人。\n\n有人问：「你现在在哪高就？」你笑着说了一个公司名字，对方一脸茫然。\n\n酒过三巡，大家不再比较了。有人喝醉了哭，说「我好累」。有人说「我想离婚」。有人说「我上个月被裁了」。\n\n原来每个人都在装。装得很好。\n\n"同学聚会不是为了炫耀——是为了确认：原来大家都过得不容易。"',
      cond: g => g.age >= 30 && g.age <= 40 && g.social >= 30,
      choices:[
        { label:'真诚交流', hint:'+👥 +😊', fn: g => { g.flags.classReunion=true; return{social:10,mood:5}; }},
        { label:'找机会合作', hint:'+💰 +👥', fn: g => { g.flags.classReunion=true; return{money:3000,social:5}; }},
        { label:'再也不去了', hint:'+🧠', fn: g => { g.flags.classReunion=true; return{intel:3,mood:-5}; }},
      ]},
    { id:'health_report', icon:'🏥', title:'体检报告',
      body:'公司年度体检。你拿到报告，翻到异常项：\n\n血脂偏高 ↑\n尿酸偏高 ↑\n颈椎退行性变\n脂肪肝（轻度）\n甲状腺结节（3类）\n\n你才32岁。你的身体已经像一台用了十年的旧电脑——勉强能跑，但到处都是警告弹窗。\n\n医生对你说：「少熬夜、少喝酒、多运动、少吃外卖。」\n\n你点了点头，心里想：你说得对，但我做不到。\n\n"体检报告是成年人最害怕的成绩单——它不骗你。"',
      cond: g => g.age >= 30 && g.health < 70 && !g.flags.healthReport,
      choices:[
        { label:'认真改变', hint:'+❤️❤️ +🧠', fn: g => { g.flags.healthReport=true; return{health:10,intel:3,mood:-3,money:-500}; }},
        { label:'该咋活咋活', hint:'+😊 -❤️', fn: g => { g.flags.healthReport=true; return{mood:5,health:-5}; }},
        { label:'买保健品', hint:'-💰', fn: g => { g.flags.healthReport=true; return{money:-2000,health:3,mood:3}; }},
      ]},
    { id:'midlife_pivot', icon:'🔄', title:'中年转行',
      body:'你在大厂干了八年，做到了P7。然后你发现：比你年轻五岁的人也能做到P7，而且他们更能加班。\n\n一个猎头找到你：「有家创业公司想请你做技术合伙人。工资减半，但有期权。」\n\n另一个朋友说：「我在做跨境电商，月入20万。你来不来？」\n\n你老婆/老公说：「别折腾了，房贷还有20年呢。」\n\n你站在人生的十字路口，每个方向都有道理。但你知道：35岁以后，选择会越来越少了。\n\n"中年转行不是勇气——是绝望。因为你发现原来的路，也走不通了。"',
      cond: g => g.age >= 33 && g.age <= 38 && g.jobSalary >= 15000 && !g.flags.midlifePivot,
      choices:[
        { label:'加入创业', hint:'🎲 高风险高回报', fn: g => { g.flags.midlifePivot=true; g.flags.entrepreneur=true; setJob(g,'创业合伙人',8000); return{mood:5,intel:5}; }},
        { label:'做副业试水', hint:'+💰 +🧠', fn: g => { g.flags.midlifePivot=true; g.flags.sideHustle=true; return{money:-5000,intel:8,mood:3}; }},
        { label:'稳定最重要', hint:'+😊', fn: g => { g.flags.midlifePivot=true; return{mood:-3}; }},
      ]},
    { id:'education_anxiety', icon:'📚', title:'鸡娃还是快乐教育',
      body:'你的孩子5岁了。你的朋友圈分裂成两个阵营：\n\n阵营A（鸡娃派）：孩子已经学了钢琴、画画、英语、编程、围棋、游泳。每天的时间表排得比CEO还满。\n\n阵营B（快乐教育派）：让孩子自由成长，想玩就玩，想学就学。他们的口头禅是「快乐最重要」。\n\n你的孩子问你：「爸爸/妈妈，为什么小明不用上课？」\n\n你沉默了。你不知道哪种选择是对的。你只知道：你的钱包和焦虑，都在告诉你选A。\n\n"教育焦虑的本质：你怕孩子输在起跑线上——但你忘了，人生不是短跑。"',
      cond: g => g.flags.hasChild && g.money > 5000 && g.age >= 30,
      choices:[
        { label:'鸡娃！', hint:'-💰💰 +🧠', fn: g => { g.flags.tigerParent=true; return{money:-15000,intel:5,mood:-5}; }},
        { label:'快乐教育', hint:'+😊 +❤️', fn: g => { g.flags.happyEducation=true; return{mood:8,health:3}; }},
        { label:'适度就好', hint:'平衡之道', fn: g => { return{money:-5000,mood:3,intel:2}; }},
      ]},
    { id:'midlife_loneliness', icon:'🌙', title:'中年孤独',
      body:'周末，你想找人吃饭。打开通讯录，滑了五分钟：\n\nA：上次联系是半年前\nB：上个月约过一次，对方说「下次吧」\nC：最近升职了，估计很忙\nD：已经不在同一个城市了\n\n你合上手机，叫了一份外卖。一个人的那种。\n\n你发了条朋友圈：「周末一个人也挺好的。」三分钟后，你妈评论：「早点找对象/多陪陪家人。」\n\n你删了那条朋友圈。\n\n"中年孤独的真相：不是没人陪你——是每个人都有了自己的生活。"',
      cond: g => g.age >= 32 && g.social < 50 && g.mood < 60,
      choices:[
        { label:'主动联系老朋友', hint:'+👥 +😊', fn: g => { g.flags.midlifeLoneliness=true; return{social:8,mood:8}; }},
        { label:'享受独处', hint:'+🧠 +😊', fn: g => { g.flags.midlifeLoneliness=true; return{intel:5,mood:5}; }},
        { label:'养个宠物', hint:'-💰 +❤️', fn: g => { if(!g.flags.hasPet) g.flags.hasPet=true; g.flags.midlifeLoneliness=true; return{money:-2000,mood:10,health:3}; }},
      ]},
    { id:'hometown_pull', icon:'🏠', title:'回不去的故乡',
      body:'你妈打电话来：「你爸身体不太好，你回来看看吧。」\n\n你回了老家。小城变了很多：新修了高铁站，开了几家奶茶店，房价涨到了8000一平。\n\n你的高中同学在老家过得挺好：公务员，有房有车有老婆孩子。他请你吃饭，说：「回来吧，在老家一个月5000，比你在北京一个月2万舒服。」\n\n你站在老家的街头，看着熟悉又陌生的城市，心里五味杂陈。\n\n你知道：你回不来了。不是因为大城市有多好——是因为你已经不是原来的你了。\n\n"故乡是什么？是你拼命想离开，离开后又拼命想回去的地方。"',
      cond: g => g.age >= 30 && g.months > 36 && !g.flags.hometownPull,
      choices:[
        { label:'考虑回乡', hint:'+👥❤️', fn: g => { g.flags.hometownPull=true; g.flags.hometownEntrepreneur=true; return{social:10,mood:5,money:-5000}; }},
        { label:'留在大城市', hint:'+💰 +🧠', fn: g => { g.flags.hometownPull=true; return{money:2000,intel:3,mood:-5}; }},
        { label:'两头牵挂', hint:'', fn: g => { g.flags.hometownPull=true; return{mood:-8}; }},
      ]},
    { id:'life_review_40', icon:'🪞', title:'四十不惑？',
      body:'你40岁了。\n\n你坐在阳台上，看着城市的夜景，开始复盘自己的人生：\n\n22岁：大学毕业，满怀梦想\n25岁：第一份工作，月薪5000，觉得很多\n30岁：升了职，加了薪，买了房（或者没买）\n35岁：开始焦虑，开始怀疑\n40岁：……\n\n你不确定自己算成功还是失败。你有了一些东西，也失去了一些东西。你的头发少了，肚子大了，脾气变好了，梦想变小了。\n\n你看着镜子里的自己，说：「还行吧。」\n\n"四十不惑？不，四十更惑了——只是你已经懒得困惑了。"',
      cond: g => g.age >= 39 && g.age <= 41 && !g.flags.lifeReview40,
      choices:[
        { label:'接受自己', hint:'+😊 +✨', fn: g => { g.flags.lifeReview40=true; g.flags.midlifeChange=true; return{mood:15,charm:5}; }},
        { label:'重新出发', hint:'+🧠 +💰？', fn: g => { g.flags.lifeReview40=true; g.flags.midlifeChange=true; g.flags.midlifeRestart=true; return{intel:10,mood:5,money:-10000}; }},
        { label:'继续混着', hint:'', fn: g => { g.flags.lifeReview40=true; return{mood:-5}; }},
      ]},
    { id:'insurance_claim', icon:'🛡️', title:'第一次用上保险',
      body:'你住院了。不是什么大病，但手术费加住院费一共3万多。\n\n你躺在病床上，翻出了三年前买的商业保险。当时你妈说：「买这个干嘛，浪费钱。」你说：「以防万一。」\n\n现在，「万一」来了。\n\n保险公司审核通过后，报销了80%。你只需要自付6000块。\n\n你突然觉得三年前的自己特别英明。\n\n"保险是什么？是你花了三年钱骂它没用，然后用一次就觉得值了的东西。"',
      cond: g => g.age >= 28 && g.flags.hasCommercialInsurance && !g.flags.insuranceClaim,
      choices:[
        { label:'庆幸买了', hint:'+😊 +🧠', fn: g => { g.flags.insuranceClaim=true; return{mood:10,intel:3,money:5000}; }},
        { label:'加购保险', hint:'-💰 +🛡️', fn: g => { g.flags.insuranceClaim=true; return{money:-5000,mood:5}; }},
        { label:'写攻略分享', hint:'+👥 +✨', fn: g => { g.flags.insuranceClaim=true; return{social:5,charm:3,mood:5}; }},
      ]},
    { id:'empty_nest_prepare', icon:'🪺', title:'空巢预备役',
      body:'你的孩子12岁了，开始有了自己的房间、自己的朋友、自己的秘密。\n\n你发现：他不再缠着你讲故事了。他关上门，戴着耳机，沉浸在自己的世界里。\n\n你想敲门，又缩回了手。\n\n你妈打来电话说：「你小时候也是这样，关上门不理我。」你突然理解了当年你妈的心情。\n\n原来「空巢」不是孩子离开家那天才开始的——是从他关上房门那一刻就开始了。\n\n"父母的爱是一场漫长的告别——你用了十八年教会他离开，然后用余生适应他的离开。"',
      cond: g => g.flags.hasChild && g.age >= 38 && !g.flags.emptyNestPrep,
      choices:[
        { label:'培养自己的爱好', hint:'+😊 +✨', fn: g => { g.flags.emptyNestPrep=true; return{mood:8,charm:5}; }},
        { label:'珍惜当下', hint:'+❤️ +😊', fn: g => { g.flags.emptyNestPrep=true; return{mood:10,social:5}; }},
        { label:'提前规划养老', hint:'+🧠', fn: g => { g.flags.emptyNestPrep=true; g.flags.pensionPlan=true; return{intel:5,mood:-3}; }},
      ]},
    // === v12.0 生活场景补全 ===
    { id:'gym_resolution', icon:'💪', title:'新年健身flag',
      body:'新年第一天，你办了张健身卡。3980元/年，你咬牙付了。\n\n一月：去了15次。二月：去了5次。三月：去了1次。四月到十二月：0次。\n\n年底健身房的公众号推送了一条消息：「恭喜您！今年您消耗了238大卡。」\n\n你算了算：每次去平均消耗238/16≈15大卡。也就是：你每次去健身房，还不如走路回家消耗得多。\n\n"健身卡的本质：你买的不是锻炼——是「我可能会锻炼」的安心感。"',
      cond: g => g.money > 4000 && g.health < 75 && g.months % 12 === 0,
      choices:[
        { label:'认真练', hint:'+❤️❤️ +💰', fn: g => { g.flags.gymMember=true; return{health:10,mood:5,money:-3980}; }},
        { label:'三天打鱼', hint:'+😊', fn: g => { g.flags.gymMember=true; return{health:3,mood:5,money:-3980}; }},
        { label:'不去也行', hint:'+💰', fn: g => { return{mood:-3}; }},
      ]},
    { id:'roommate_drama_v2', icon:'🏠', title:'室友风云',
      body:'你和室友的战争终于爆发了。\n\n导火索是：他/她第三次用了你的洗发水没告诉你。但真正的原因是：空调温度、洗碗频率、深夜打电话的音量——积累了半年的鸡毛蒜皮。\n\n你们吵了两个小时。最后达成共识：写了一份「室友公约」。\n\n一周后，公约被贴在了冰箱上——然后被外卖菜单盖住了。\n\n"合租的真相：不是找室友——是找一个你能忍受的陌生人。"',
      cond: g => !g.flags.hasHouse && g.months > 3 && g.age < 35,
      choices:[
        { label:'据理力争', hint:'+🧠 +👥', fn: g => { g.flags.roommateConflict=true; return{intel:3,social:-5,mood:-5}; }},
        { label:'忍了', hint:'-😊', fn: g => { return{mood:-8}; }},
        { label:'搬家', hint:'-💰 +😊', fn: g => { g.flags.roommateConflict=true; return{money:-5000,mood:10}; }},
      ]},
    { id:'office_politics_v2_v2', icon:'🏢', title:'站队时刻',
      body:'公司的两个VP在争夺同一个位置。你的直属领导站了A队，你的mentor站了B队。\n\nA队领导找你谈话：「小张，你觉得A总怎么样？」\n\nB队mentor发消息：「最近有空聊聊吗？」\n\n你知道：在这种时候，不站队就是站了两边的队。\n\n你选择了沉默。但沉默本身也是一种态度。\n\n"办公室政治的生存法则：你以为自己在旁观，其实你早就被归了类。"',
      cond: g => g.job !== '待业中' && g.age >= 25 && g.months > 12 && g.social >= 40,
      choices:[
        { label:'站领导', hint:'+💰 +👥', fn: g => { g.flags.officePolitics=true; return{money:3000,social:-5,mood:-5}; }},
        { label:'站mentor', hint:'+🧠 +✨', fn: g => { g.flags.officePolitics=true; return{intel:5,charm:3,mood:-3}; }},
        { label:'两不相帮', hint:'+🧠', fn: g => { g.flags.officePolitics=true; return{intel:5,mood:-8}; }},
      ]},
    { id:'phone_addiction', icon:'📱', title:'屏幕使用时间',
      body:'你打开手机设置，看了一眼「屏幕使用时间」。\n\n今日平均：8小时47分钟\n社交媒体：4小时12分钟\n短视频：2小时38分钟\n工作邮件：23分钟\n\n你每天醒着的时间大概16小时。也就是说，你一半的人生都在看手机。\n\n你算了一下：如果你活到80岁，你将有40年花在这块6.1英寸的屏幕上。\n\n你默默关掉了这个页面，打开了抖音。\n\n"屏幕使用时间是一个你不敢看的数字——因为看了你也不会改。"',
      cond: g => g.age >= 22 && g.age <= 40 && g.months > 3,
      choices:[
        { label:'设置限时', hint:'+🧠 +❤️', fn: g => { g.flags.screenTimeLimit=true; return{intel:5,health:3,mood:-3}; }},
        { label:'继续刷', hint:'+😊 -❤️', fn: g => { return{mood:5,health:-3}; }},
        { label:'换成功能机', hint:'+🧠 +😊', fn: g => { g.flags.digitalDetox=true; return{intel:8,mood:8,social:-5}; }},
      ]},
    { id:'weekend_trip_v2_v2', icon:'🏖️', title:'说走就走的周末',
      body:'周五晚上你刷到一个视频：一个人在大理的洱海边看日落。\n\n你打开12306，发现周六早上的票还有。你犹豫了三秒，点了「购买」。\n\n48小时后，你站在洱海边，看着同样的日落。你拍了一张照片，配文：「人生苦短，及时行乐。」\n\n周一你回到工位，发现：你不在的两天，什么事都没发生。原来你没你想的那么重要。\n\n"旅行的意义不在于去哪里——在于你终于决定出发了。"',
      cond: g => g.money > 3000 && g.mood < 60 && g.age >= 22 && g.age <= 38,
      choices:[
        { label:'说走就走', hint:'-💰 +😊😊', fn: g => { g.flags.weekendTrip=true; return{money:-2500,mood:20,health:5}; }},
        { label:'下次再说', hint:'', fn: g => { return{mood:-5}; }},
        { label:'周边游也行', hint:'-💰 +😊', fn: g => { g.flags.weekendTrip=true; return{money:-500,mood:10,health:3}; }},
      ]},
    { id:'salary_comparison_v2', icon:'💰', title:'薪资大比拼',
      body:'你在脉脉上刷到一条匿名帖子：「坐标北京，工作3年，年薪45万。」\n\n你看了看自己的工资条：工作3年，年薪18万。\n\n你开始怀疑人生。然后你看到评论区：「我也3年，年薪12万，是不是该转行了？」\n\n你突然觉得自己还行。\n\n然后你又刷到一条：「应届，大厂sp，年薪60万。」\n\n你又觉得自己不行了。\n\n"薪资比较是成年人的精神自残——但你总是忍不住要看。"',
      cond: g => g.job !== '待业中' && g.age >= 23 && g.age <= 35,
      choices:[
        { label:'努力提升自己', hint:'+🧠', fn: g => { return{intel:5,mood:-5}; }},
        { label:'准备跳槽', hint:'+💰？', fn: g => { g.flags.salaryCompare=true; return{mood:-3,intel:3}; }},
        { label:'不看了', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'online_shopping_spree', icon:'🛍️', title:'深夜购物冲动',
      body:'凌晨1点，你躺在床上刷淘宝。\n\n你看中了一件羽绒服（1299元）、一双运动鞋（899元）、一个空气炸锅（399元）。\n\n你的大脑在说：「不需要。」你的手指在说：「下单下单下单。」\n\n你用了30秒完成了支付。然后你看了看银行卡余额，后悔了。\n\n但第二天快递到了的时候，你拆箱的快感，瞬间治愈了昨晚的后悔。\n\n"深夜购物的本质：用明天的后悔，买今天的多巴胺。"',
      cond: g => g.money > 2000 && g.mood < 60,
      choices:[
        { label:'买买买', hint:'-💰💰 +😊', fn: g => { return{money:-2600,mood:12}; }},
        { label:'加购物车', hint:'+🧠', fn: g => { return{intel:3,mood:-3}; }},
        { label:'全部退款', hint:'+💰 +🧠', fn: g => { return{intel:5,mood:-5}; }},
      ]},
    { id:'parent_health_crisis', icon:'🏥', title:'父母生病',
      body:'你妈打电话来，声音不太对：「你爸住院了。没什么大事，就是血压高。」\n\n你问：「真的没事？」\n\n她说：「真的。」\n\n你后来从你表姐那里知道：你爸是脑梗，幸好发现得早，没有大碍。你妈不想让你担心，也不舍得让你请假回来。\n\n你买了最近的车票回去。在火车上你一直在想：你多久没回家了？\n\n三个月？半年？你记不清了。\n\n"父母生病是成年人的分水岭：从这一刻起，你不再是那个被保护的孩子了。"',
      cond: g => g.age >= 28 && !g.flags.parentHealthIssue,
      choices:[
        { label:'马上回去', hint:'-💰 +👥❤️', fn: g => { g.flags.parentHealthIssue=true; g.flags.parentHealthDone=true; return{money:-3000,social:10,mood:-5}; }},
        { label:'转钱表心意', hint:'-💰 +👥', fn: g => { g.flags.parentHealthIssue=true; return{money:-5000,social:5,mood:-8}; }},
        { label:'视频安慰', hint:'+👥', fn: g => { g.flags.parentHealthIssue=true; return{social:3,mood:-10}; }},
      ]},
    { id:'midnight_philosophy_v2', icon:'🌙', title:'深夜emo',
      body:'凌晨3点，你还没有睡着。\n\n你在想：我为什么在这里？我在做什么？我以后怎么办？\n\n你打开了备忘录，写了一些「深刻」的句子。第二天醒来一看：全是废话。\n\n凌晨3点的你觉得自己是哲学家。中午12点的你觉得自己是个傻子。\n\n"深夜emo的真相：不是你想太多——是你太闲了。忙起来就好了。"',
      cond: g => g.mood < 55 && g.age >= 22 && g.age <= 35,
      choices:[
        { label:'写日记', hint:'+🧠 +😊', fn: g => { return{intel:5,mood:5}; }},
        { label:'吃宵夜', hint:'+😊 +❤️', fn: g => { return{mood:8,health:-3,money:-50}; }},
        { label:'刷手机到天亮', hint:'+😊 -❤️', fn: g => { return{mood:3,health:-8}; }},
      ]},
    { id:'career_crossroads_v2', icon:'🔀', title:'职业十字路口',
      body:'你的mentor离职了。走之前他请你吃了顿饭，说了一句让你一夜没睡的话：\n\n「你在这里还能学到东西吗？如果不能，就该走了。」\n\n你想了想：你已经半年没有学到新东西了。你的工作内容越来越重复，你的技能越来越专业化——但也越来越窄。\n\n你开始投简历。面试了三家公司，发现外面的世界也没有你想的那么好。\n\n但至少有变化。而变化，有时候就是好的。\n\n"职业发展的真相：不是你在选工作——是工作在选你。"',
      cond: g => g.job !== '待业中' && g.age >= 26 && g.age <= 38 && g.months > 24,
      choices:[
        { label:'跳槽', hint:'+💰 +🧠', fn: g => { g.flags.careerChange=true; setJob(g, g.job, Math.floor(g.jobSalary*1.2)); return{mood:5,intel:5,social:-5}; }},
        { label:'留下来深耕', hint:'+🧠 +👥', fn: g => { return{intel:8,social:5}; }},
        { label:'转行试试', hint:'🎲', fn: g => { g.flags.careerChange=true; setJob(g,'新行业新人',Math.floor(g.jobSalary*0.7)); return{intel:10,mood:3,money:-5000}; }},
      ]},
    // === v12.1 情感关系 + 季节事件 + 职场进阶 ===
    { id:'long_distance_love', icon:'💕', title:'异地恋的考验',
      body:'你和恋人开始了一段异地恋。\n\n刚开始你们每天视频通话，分享一切。一个月后，通话变成了消息。两个月后，消息变成了「忙，晚点聊」。\n\n你在朋友圈看到对方和一群你不认识的人聚餐。你的第一反应不是开心——而是嫉妒。\n\n你们约定每个月见一次面。但高铁票越来越难抢，假期越来越少。\n\n"异地恋的真相：不是距离打败了爱情——是距离让你看清了爱情有多少。"',
      cond: g => g.flags.inRelationship && !g.flags.married && g.age >= 23 && g.age <= 33,
      choices:[
        { label:'坚持', hint:'+❤️ +💰', fn: g => { g.flags.longDistanceLove=true; return{mood:-5,money:-2000,social:3}; }},
        { label:'搬到一起', hint:'-💰💰 +❤️', fn: g => { g.flags.longDistanceLove=true; return{money:-8000,mood:15,social:5}; }},
        { label:'算了', hint:'+😊 -❤️', fn: g => { g.flags.longDistanceLove=true; return{mood:-10,social:-5}; }},
      ]},
    { id:'headhunted', icon:'🎯', title:'被猎头盯上了',
      body:'一个猎头加了你微信：「X总，我们有一个机会想跟您聊聊。」\n\n对方是一家竞对公司，开出了比你现在高50%的薪资，还有期权。\n\n你的领导最近对你不错：加了薪、给了好项目、还夸了你。\n\n你知道：领导对你好，有时候是因为他要走了——有时候是因为他知道你要走了。\n\n"猎头的电话是职场最甜蜜的毒药——你听了就回不去了。"',
      cond: g => g.job !== '待业中' && g.jobSalary >= 10000 && g.age >= 25 && g.age <= 38 && g.intel >= 55,
      choices:[
        { label:'跳槽拿高薪', hint:'+💰💰 +🧠', fn: g => { setJob(g, g.job, Math.floor(g.jobSalary*1.5)); return{mood:10,intel:5,social:-3}; }},
        { label:'留下来谈条件', hint:'+💰 +👥', fn: g => { setJob(g, g.job, Math.floor(g.jobSalary*1.2)); return{money:5000,social:5}; }},
        { label:'不考虑', hint:'+😊', fn: g => { return{mood:3}; }},
      ]},
    { id:'spring_flower', icon:'🌸', title:'春天来了',
      body:'三月的某个周末，你路过一个公园。樱花开了。\n\n你停下脚步，拍了一张照片。发到朋友圈，配文：「春天来了。」\n\n128个赞。你的同事评论：「你还有时间逛公园？」你的老板点了个赞——你不确定他是手滑还是真的赞。\n\n你坐在樱花树下，看着来来往往的人。老人遛弯，小孩放风筝，情侣自拍。\n\n你突然觉得：活着真好。\n\n"春天不需要理由——它就在那里，等你抬头。"',
      cond: g => g.months % 12 >= 2 && g.months % 12 <= 4 && g.mood >= 40,
      choices:[
        { label:'多出去走走', hint:'+😊 +❤️', fn: g => { return{mood:12,health:5}; }},
        { label:'约朋友赏花', hint:'+👥 +😊', fn: g => { return{social:8,mood:8}; }},
        { label:'拍vlog', hint:'+✨', fn: g => { return{charm:5,mood:5}; }},
      ]},
    { id:'summer_heat_wave', icon:'☀️', title:'40度高温',
      body:'连续一周40度。你的出租屋没有空调（或者空调坏了）。\n\n你每天晚上躺在床上，感觉自己是一块正在被煎的牛排。你开着风扇，但吹出来的全是热风。\n\n你开始在公司蹭空调到晚上10点才回家。保安大叔看你的眼神越来越同情。\n\n你花了2000块装了一台空调。那是你这辈子花得最值的2000块。\n\n"夏天教会你：在40度的城市里，空调不是奢侈品——是生存必需品。"',
      cond: g => g.months % 12 >= 6 && g.months % 12 <= 8 && !g.flags.hasHouse,
      choices:[
        { label:'装空调', hint:'-💰 +❤️❤️', fn: g => { g.flags.summerAC=true; return{money:-2000,health:8,mood:10}; }},
        { label:'蹭公司空调', hint:'+💰 +😊', fn: g => { return{mood:3,health:-3}; }},
        { label:'回老家避暑', hint:'+👥 +❤️', fn: g => { return{social:5,health:5,mood:5,money:-1000}; }},
      ]},
    { id:'autumn_melancholy_v2', icon:'🍂', title:'秋天的第一杯奶茶',
      body:'朋友圈刷屏了：「秋天的第一杯奶茶。」\n\n你打开外卖软件，发现奶茶店推出了「秋日限定款」——桂花拿铁、栗子奶茶、红薯奶盖。每杯都要30块。\n\n你犹豫了：一杯奶茶30块，够我吃一顿饭了。\n\n但你还是点了。因为这不是奶茶——这是仪式感。\n\n你拍了照片发朋友圈。三分钟后，你妈评论：「少喝甜的，对牙不好。」\n\n"秋天的第一杯奶茶：年轻人最后的浪漫——虽然它只是一杯糖水。"',
      cond: g => g.months % 12 >= 9 && g.months % 12 <= 11,
      choices:[
        { label:'仪式感', hint:'-💰 +😊', fn: g => { return{money:-30,mood:8}; }},
        { label:'自己泡', hint:'+🧠', fn: g => { return{intel:2,mood:3}; }},
        { label:'给暗恋对象点一杯', hint:'-💰 +✨', fn: g => { return{money:-60,charm:5,mood:5}; }},
      ]},
    { id:'winter_depression_v2', icon:'❄️', title:'冬天不想出门',
      body:'十二月。天黑得越来越早，你下班的时候天已经黑了。\n\n你开始不想出门。不想社交。不想说话。你把自己裹在被子里，刷了一整天的手机。\n\n你知道这不是懒——这是「季节性情绪低落」。你的身体在告诉你：阳光不够了。\n\n你买了一盏日光灯，放在桌上。同事问你：「你在干嘛？」\n\n你说：「我在进行光合作用。」\n\n"冬天是灵魂的冬眠期——你不是不想动，是你的心在休息。"',
      cond: g => (g.months % 12 === 0 || g.months % 12 === 1 || g.months % 12 === 11) && g.mood < 60,
      choices:[
        { label:'运动抵抗', hint:'+❤️ +😊', fn: g => { return{health:8,mood:10,money:-500}; }},
        { label:'接受冬眠', hint:'+😊', fn: g => { return{mood:5,health:-3}; }},
        { label:'去南方过冬', hint:'-💰 +😊😊', fn: g => { return{money:-5000,mood:15,health:5}; }},
      ]},
    { id:'workplace_bullying', icon:'😤', title:'职场霸凌',
      body:'你的新领导是个PUA大师。\n\n他会在开会的时候当众批评你：「这个方案是实习生做的吧？」（你是P7。）\n\n他会半夜给你发微信：「明天早上把方案改好。」（现在是凌晨1点。）\n\n他会在周报里把你的功劳全部归于自己，然后在你的绩效评估上写：「缺乏主动性。」\n\n你开始失眠。开始怀疑自己。开始觉得：也许真的是我不够好。\n\n直到有一天，一个同事悄悄跟你说：「不是你不好——是他对每个人都这样。」\n\n"职场PUA的本质：不是你在被打压——是你在被打压的同时，还以为是自己的错。"',
      cond: g => g.job !== '待业中' && g.age >= 24 && g.mood < 55 && !g.flags.workplacePUA,
      choices:[
        { label:'收集证据举报', hint:'+🧠 +👥', fn: g => { g.flags.workplacePUA=true; g.flags.laborRights=true; return{intel:8,social:5,mood:-5}; }},
        { label:'骑驴找马', hint:'+💰', fn: g => { g.flags.workplacePUA=true; return{money:2000,mood:-8}; }},
        { label:'裸辞', hint:'+😊 +🧠', fn: g => { g.flags.workplacePUA=true; setJob(g,'待业中',0); return{mood:15,intel:5}; }},
      ]},
    { id:'first_date', icon:'💘', title:'第一次约会',
      body:'你在交友软件上匹配了一个人。聊了两周后，你们决定见面。\n\n你提前半小时到了咖啡馆，对着镜子整理了十次头发。\n\n对方来了。比照片好看一点点（或者差一点点，但你的滤镜记忆会自动修正）。\n\n你们聊了三个小时。从工作聊到旅行，从电影聊到人生。你发现：你们都喜欢在雨天看书，都讨厌开会。\n\n走的时候对方说：「下次再约？」\n\n你笑着说：「好啊。」但你的心里在尖叫：「下次什么时候？！明天行不行？！」\n\n"第一次约会的美妙之处：一切皆有可能——而你还没有被现实打败。"',
      cond: g => !g.flags.inRelationship && !g.flags.married && g.age >= 22 && g.age <= 38 && g.charm >= 35,
      choices:[
        { label:'主动约第二次', hint:'+💕 +😊', fn: g => { g.flags.inRelationship=true; return{mood:15,charm:5,social:5}; }},
        { label:'等对方联系', hint:'+🧠', fn: g => { return{mood:5,intel:2}; }},
        { label:'还是做朋友', hint:'+👥', fn: g => { return{social:5,mood:3}; }},
      ]},
    { id:'prenup_talk', icon:'💍', title:'婚前财产公证',
      body:'你们准备结婚了。你妈说：「去做个婚前财产公证。」\n\n你的恋人脸色变了：「你是不是不信任我？」\n\n你妈说：「信任是一回事，钱是另一回事。」\n\n你的律师朋友说：「我见过太多离婚时为了房子吵得头破血流的了。」\n\n你站在两个人中间，左右为难。\n\n"婚前公证不是不信任——是对未来的不信任。但不公证，是对现在的不负责。"',
      cond: g => g.flags.inRelationship && !g.flags.married && g.age >= 25 && g.money >= 50000,
      choices:[
        { label:'做公证', hint:'+🧠 +💰', fn: g => { g.flags.prenup=true; return{intel:5,money:-2000,mood:-5}; }},
        { label:'信任对方', hint:'+❤️ +😊', fn: g => { return{mood:10,social:5}; }},
        { label:'先缓缓再说', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'empty_nest_real', icon:'🪺', title:'孩子离家上大学',
      body:'你把孩子送到了大学。帮他/她铺好了床，放好了行李箱。\n\n走出宿舍楼的时候，你回头看了一眼。你的孩子站在阳台上，冲你挥了挥手。\n\n然后他/她转身进去了。去认识新的朋友，开始新的生活。\n\n你坐在车里，发动了引擎，但没有动。你在停车场坐了十分钟。\n\n你想起十八年前，你第一次抱他/她的感觉。那么小，那么轻，那么需要你。\n\n现在，他/她不需要你了。至少不需要你「每天」在了。\n\n"父母的终极课题：学会放手——然后假装自己不需要被需要。"',
      cond: g => g.flags.hasChild && g.age >= 42 && !g.flags.emptyNestReal,
      choices:[
        { label:'开始新生活', hint:'+😊 +✨', fn: g => { g.flags.emptyNestReal=true; g.flags.midlifeChange=true; return{mood:10,charm:5,intel:5}; }},
        { label:'每天打电话', hint:'+👥 -😊', fn: g => { g.flags.emptyNestReal=true; return{social:5,mood:-5}; }},
        { label:'养个宠物', hint:'+❤️ +😊', fn: g => { g.flags.emptyNestReal=true; if(!g.flags.hasPet) g.flags.hasPet=true; return{mood:8,health:3,money:-2000}; }},
      ]},
    // === v12.2 财务理财 + 文化娱乐 + 健康养生 ===
    { id:'stock_crash_v2_v2', icon:'📉', title:'股市崩盘',
      body:'你在朋友推荐下买了5万块的股票。涨了两个星期，你赚了3000块，觉得自己是巴菲特。\n\n然后——崩盘了。不是慢慢跌，是一天跌20%的那种。\n\n你看着账户里的绿色数字，感觉自己的心脏也在跌。\n\n你开始每天刷三次股票app。涨了你开心，跌了你焦虑。你的情绪被一根K线绑架了。\n\n最终你割肉离场，亏了8000块。\n\n"股市教会你：你不是在投资——你是在赌博。区别是：赌场有免费饮料。"',
      cond: g => g.money > 10000 && g.age >= 25 && !g.flags.stockCrash,
      choices:[
        { label:'割肉离场', hint:'+🧠 -💰', fn: g => { g.flags.stockCrash=true; return{money:-8000,intel:8,mood:-10}; }},
        { label:'死扛到底', hint:'🎲', fn: g => { g.flags.stockCrash=true; if(Math.random()>0.5) return{money:5000,mood:10}; return{money:-15000,mood:-15}; }},
        { label:'学投资知识', hint:'+🧠🧠', fn: g => { g.flags.stockCrash=true; return{intel:12,mood:-5,money:-5000}; }},
      ]},
    { id:'standup_comedy', icon:'🎤', title:'脱口秀之夜',
      body:'朋友拉你去看了一场脱口秀。\n\n台上的演员说：「你们知道打工人最惨的是什么吗？不是996——是你发现996之后工资还是不够花。」\n\n全场爆笑。你笑得最大声。\n\n然后他说：「在座的有没有月薪两万还月光族的？」\n\n你默默举了手。全场鼓掌。\n\n你花180块买了两张票（含朋友），但你觉得：这是今年花得最值的180块。\n\n"脱口秀的力量：把痛苦变成段子，把段子变成力量。"',
      cond: g => g.money > 500 && g.age >= 22 && g.age <= 38 && g.mood < 65,
      choices:[
        { label:'大笑一场', hint:'+😊😊 +👥', fn: g => { g.flags.standupFan=true; return{mood:15,social:5}; }},
        { label:'自己试试', hint:'+✨ +🧠', fn: g => { g.flags.standupFan=true; g.flags.standupPerformer=true; return{charm:8,intel:3,mood:10}; }},
        { label:'不太行', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'escape_room_v2', icon:'🔐', title:'密室逃脱',
      body:'你和四个朋友去玩了密室逃脱。主题：「精神病院」。\n\n进去五分钟后，你们发现：最难的不是解谜——是你朋友一直在尖叫。\n\n你是唯一在认真解谜的人。其他四个人：一个在哭，一个在拍照，一个在打电话，一个在找厕所。\n\n最终你们超时了。出来的时候，工作人员笑着说：「你们是今天第三组没逃出来的。」\n\n你发了条朋友圈：「我不是被密室困住了——我是被队友困住了。」\n\n"密室逃脱的真相：考验的不是智商——是你跟谁一起去。"',
      cond: g => g.social >= 30 && g.money > 300 && g.age >= 22 && g.age <= 35,
      choices:[
        { label:'再来一局', hint:'-💰 +😊 +👥', fn: g => { g.flags.escapeRoom=true; return{money:-300,mood:10,social:5}; }},
        { label:'回家躺着', hint:'+❤️', fn: g => { return{health:3,mood:3}; }},
        { label:'剧本杀走起', hint:'-💰 +🧠', fn: g => { g.flags.escapeRoom=true; return{money:-200,intel:3,mood:8,social:5}; }},
      ]},
    { id:'weight_rebound', icon:'⚖️', title:'减肥反弹',
      body:'你花了三个月减了15斤。你发了朋友圈：「自律给我自由！」收获200个赞。\n\n然后你停止运动了。然后你开始吃宵夜了。然后你发现：你不仅反弹了15斤，还多长了3斤。\n\n你看着体重秤上的数字，心想：这不是反弹——这是报复。\n\n你把朋友圈那条「自律给我自由」删了。\n\n"减肥的真相：不是你的意志力不够——是你的身体比你更想活着。"',
      cond: g => g.age >= 24 && g.age <= 40 && g.health < 70,
      choices:[
        { label:'重新来过', hint:'+❤️ +🧠', fn: g => { g.flags.weightRebound=true; return{health:5,intel:3,mood:-5}; }},
        { label:'接受自己', hint:'+😊 +✨', fn: g => { g.flags.weightRebound=true; return{mood:10,charm:3}; }},
        { label:'买大一号衣服', hint:'+😊', fn: g => { return{mood:5,money:-500}; }},
      ]},
    { id:'tcm_wellness', icon:'🍵', title:'中医养生',
      body:'你的同事带你去了一家中医馆。老中医给你把了脉，看了看舌头，然后说：\n\n「你湿气太重了。少吃凉的，少熬夜，多喝薏米水。」\n\n你问：「我还有什么问题？」\n\n他看了看你：「你的问题是——你知道该怎么做，但你不会做。」\n\n你被一个中医看透了。\n\n你花了800块开了一个月的中药。苦得你怀疑人生。但你不得不承认：喝了两周后，你确实睡得好了。\n\n"中医的哲学：治病先治心——你的身体知道你所有的问题。"',
      cond: g => g.health < 65 && g.money > 1500 && g.age >= 25,
      choices:[
        { label:'坚持调理', hint:'-💰 +❤️❤️', fn: g => { g.flags.tcmWellness=true; return{money:-800,health:10,mood:5}; }},
        { label:'半信半疑', hint:'+🧠', fn: g => { return{intel:3,health:3}; }},
        { label:'不信这套', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'livehouse_night', icon:'🎸', title:'Live House',
      body:'你去看了一场Live House演出。一支你从没听过的乐队。\n\n场地很小，你站在第一排。鼓点的震动从地板传到你的心脏。主唱的嗓音粗粝但真诚。\n\n你举起手，跟着节奏晃。旁边一个陌生人递给你一瓶啤酒：「一起嗨！」\n\n那一刻你忘了工作、房租、父母催婚、体检报告。你只是一个在音乐里的人。\n\n演出结束后你走在街上，耳朵还在嗡嗡响。你觉得：这才是活着的感觉。\n\n"Live House的意义：不是去听歌——是去感觉自己的心跳。"',
      cond: g => g.money > 300 && g.age >= 22 && g.age <= 35 && g.mood < 65,
      choices:[
        { label:'嗨到散场', hint:'-💰 +😊😊', fn: g => { g.flags.livehouseFan=true; return{money:-300,mood:18,health:3}; }},
        { label:'拍视频分享', hint:'+✨ +👥', fn: g => { g.flags.livehouseFan=true; return{charm:5,social:5,mood:10}; }},
        { label:'学个乐器', hint:'+🧠 +✨', fn: g => { g.flags.livehouseFan=true; g.flags.instrumentPlayer=true; return{intel:5,charm:5,mood:8}; }},
      ]},
    { id:'credit_card_debt', icon:'💳', title:'信用卡危机',
      body:'你打开信用卡账单：本月应还12,580元。\n\n你看了看自己的银行卡余额：8,200元。\n\n你做了所有信用卡用户都做过的事：最低还款。然后你算了算利息——年化18%。\n\n你开始用花呗还信用卡，用信用卡还花呗。一个月后你发现：你欠的更多了。\n\n你终于明白：信用卡不是你的钱——是银行借给你的幻觉。\n\n"信用卡的陷阱：它让你觉得自己有钱——直到账单来了。"',
      cond: g => g.money < 5000 && g.age >= 22 && g.age <= 35 && !g.flags.creditCardDebt,
      choices:[
        { label:'向父母求助', hint:'+👥 -✨', fn: g => { g.flags.creditCardDebt=true; return{money:10000,social:5,charm:-5,mood:-5}; }},
        { label:'兼职还债', hint:'+💰 +❤️', fn: g => { g.flags.creditCardDebt=true; g.flags.workToPayDebt=true; return{money:5000,health:-5,mood:-8}; }},
        { label:'以贷养贷', hint:'⚠️ 危险', fn: g => { g.flags.creditCardDebt=true; return{money:3000,mood:-10,intel:-3}; }},
      ]},
    { id:'mental_health_check', icon:'💭', title:'心理咨询',
      body:'你犹豫了很久，终于预约了一个心理咨询师。\n\n第一次去，你坐在沙发上，不知道该说什么。咨询师说：「你想聊什么都行。」\n\n你开始哭。你不知道为什么哭——也许是太久没有人认真听你说话了。\n\n一个小时的咨询花了500块。你觉得很贵。但你走出咨询室的时候，感觉肩膀上的石头轻了一点。\n\n你发了条朋友圈（屏蔽了同事和家人）：「今天我做了一件勇敢的事。」\n\n"心理咨询不是因为你疯了——是因为你太久没有被听见了。"',
      cond: g => g.mood < 50 && g.money > 1000 && g.age >= 23 && !g.flags.therapyVisit,
      choices:[
        { label:'继续咨询', hint:'-💰 +😊 +🧠', fn: g => { g.flags.therapyVisit=true; g.flags.seekTherapy=true; return{money:-3000,mood:15,intel:5}; }},
        { label:'试一次就好', hint:'-💰 +😊', fn: g => { g.flags.therapyVisit=true; g.flags.seekTherapy=true; return{money:-500,mood:8}; }},
        { label:'还是算了', hint:'', fn: g => { return{mood:-5}; }},
      ]},
    { id:'house_buying_trap', icon:'🏠', title:'买房踩坑',
      body:'你攒够了首付，准备买房。中介带你看了三套房：\n\n第一套：「学区好，但楼龄30年。」\n第二套：「新楼盘，但离地铁2小时。」\n第三套：「价格刚好，但……旁边是墓地。」\n\n你最终选了第二套。签合同那天你手在抖——这是你这辈子签过的最大金额。\n\n三个月后你发现：开发商承诺的「明年交房」变成了「后年交房」。你的月供已经开始了，但房子还没建好。\n\n"买房的真相：你以为你在买一个家——其实你在买一个30年的债务。"',
      cond: g => g.money >= 100000 && !g.flags.hasHouse && g.age >= 27 && g.age <= 40,
      choices:[
        { label:'咬牙供房', hint:'-💰💰💰 +🏠', fn: g => { g.flags.hasHouse=true; g.flags.mortgage=true; return{money:-80000,mood:5,health:-5}; }},
        { label:'再等等', hint:'+🧠', fn: g => { return{intel:5,mood:-3}; }},
        { label:'租房也挺好', hint:'+😊 +💰', fn: g => { g.flags.renter=true; return{mood:8,money:5000}; }},
      ]},
    { id:'fund_investment_v2', icon:'📊', title:'基金定投',
      body:'你的同事说：「基金定投是年轻人最好的理财方式。每月投2000，十年后至少翻倍。」\n\n你开始每月定投2000块到一只指数基金。前三个月涨了5%，你觉得自己是理财天才。\n\n第四个月跌了15%。你看着账户里绿色的数字，心想：这不是定投——这是定亏。\n\n你的同事安慰你：「定投要看长期！别慌！」\n\n但你发现：他自己上周全卖了。\n\n"基金定投的真相：考验的不是眼光——是你能不能在跌的时候不卖。"',
      cond: g => g.money > 5000 && g.age >= 23 && g.age <= 35 && !g.flags.fundInvestor,
      choices:[
        { label:'坚持定投', hint:'-💰 +🧠', fn: g => { g.flags.fundInvestor=true; return{money:-10000,intel:5}; }},
        { label:'止损出局', hint:'+💰 +🧠', fn: g => { g.flags.fundInvestor=true; return{money:-2000,intel:8}; }},
        { label:'加大力度', hint:'-💰💰 🎲', fn: g => { g.flags.fundInvestor=true; if(Math.random()>0.4) return{money:8000,mood:10}; return{money:-20000,mood:-15}; }},
      ]},
    // === v12.3 科技生活 + 代际冲突 + 人生哲学 ===
    { id:'ai_scam_call', icon:'🤖', title:'AI换脸诈骗',
      body:'你接到了一个视频电话。画面里是你妈的脸，声音也是你妈的。\n\n「儿子/女儿，我出车祸了，急需5000块手术费，转到这个账号……」\n\n你差点就转了。但你觉得哪里不对——你妈从来不叫你「儿子/女儿」，她叫你小名。\n\n你挂掉电话，打给你妈。她正在家里看电视，啥事没有。\n\n你出了一身冷汗。\n\n"AI诈骗的恐怖之处：你看到的脸是真的，声音是真的——但人是假的。"',
      cond: g => g.age >= 22 && g.money > 2000 && !g.flags.aiScamCall,
      choices:[
        { label:'报警', hint:'+🧠 +👥', fn: g => { g.flags.aiScamCall=true; g.flags.antiFraud=true; return{intel:8,social:3,mood:-5}; }},
        { label:'发朋友圈提醒', hint:'+👥 +✨', fn: g => { g.flags.aiScamCall=true; g.flags.antiFraud=true; return{social:8,charm:3,mood:3}; }},
        { label:'差点上当', hint:'', fn: g => { g.flags.aiScamCall=true; return{mood:-10,intel:3}; }},
      ]},
    { id:'smart_home_fail', icon:'🏠', title:'智能家居翻车',
      body:'你花了8000块装了一套智能家居系统。语音控制灯光、窗帘、空调、扫地机器人。\n\n第一周：「小X小X，关灯。」「好的。」完美。\n\n第二周：「小X小X，关窗帘。」「好的，正在为您播放《关窗帘》。」？？？\n\n第三周：半夜3点，智能音箱突然大声播放：「早上好！今天的天气是……」你差点从床上跳起来。\n\n第四周：你拔了所有智能设备的电源，回到了手动时代。\n\n"智能家居的梦想：动动嘴就能控制一切。现实：它比你还不靠谱。"',
      cond: g => g.money > 8000 && g.age >= 25 && g.age <= 40,
      choices:[
        { label:'继续折腾', hint:'-💰 +🧠', fn: g => { g.flags.smartHome=true; return{money:-3000,intel:5,mood:-5}; }},
        { label:'接受现实', hint:'+😊', fn: g => { return{mood:5,intel:3}; }},
        { label:'写测评吐槽', hint:'+✨ +👥', fn: g => { g.flags.smartHome=true; return{charm:5,social:5,mood:5}; }},
      ]},
    { id:'parents_want_grandchild', icon:'👶', title:'催生大军',
      body:'你结婚了（或者有对象了），你妈开始了新一轮的催促：\n\n「你们什么时候要孩子？」\n「隔壁老王的孙子都会走路了。」\n「再不生就老了。」\n「你是不是有什么问题？要不要去看看医生？」\n\n你试图解释：「现在养一个孩子太贵了。」\n\n你妈说：「我当年养你也没花多少钱啊。」\n\n你没说的是：当年你妈也没有学区房、兴趣班、国际幼儿园的焦虑。\n\n"催生是代际战争的第二战场：第一战场是催婚，第三战场是催二胎。"',
      cond: g => (g.flags.married || g.flags.inRelationship) && g.age >= 27 && g.age <= 38 && !g.flags.hasChild,
      choices:[
        { label:'考虑要孩子', hint:'+👥 +💰', fn: g => { return{social:5,mood:-5}; }},
        { label:'坚持丁克', hint:'+😊 +🧠', fn: g => { g.flags.dink=true; return{mood:8,intel:3,social:-5}; }},
        { label:'跟父母沟通', hint:'+👥 +😊', fn: g => { return{social:5,mood:5}; }},
      ]},
    { id:'midlife_rebellion', icon:'🔥', title:'中年叛逆',
      body:'你37岁了。某天你在公司厕所里照镜子，突然觉得：这个人不是你。\n\n你做了15年的「好孩子」：听父母的话、好好学习、好好工作、好好结婚。你的每一步都是别人规划的。\n\n你第一次问自己：我想要什么？\n\n答案是：你不知道。\n\n你买了一辆摩托车。你染了头发。你辞了职。你妈打电话来哭了一个小时。\n\n但你觉得：37年来，你第一次在为自己活。\n\n"中年叛逆不是疯了——是终于醒了。"',
      cond: g => g.age >= 35 && g.age <= 42 && g.jobSalary >= 10000 && g.mood < 55 && !g.flags.midlifeRebellion,
      choices:[
        { label:'彻底放飞', hint:'+😊😊 -💰', fn: g => { g.flags.midlifeRebellion=true; g.flags.midlifeChange=true; return{mood:20,money:-15000,charm:5,health:3}; }},
        { label:'小规模叛逆', hint:'+😊 +✨', fn: g => { g.flags.midlifeRebellion=true; return{mood:10,charm:5}; }},
        { label:'算了吧', hint:'', fn: g => { return{mood:-5}; }},
      ]},
    { id:'meaning_of_life', icon:'🌌', title:'存在的意义',
      body:'你在一个失眠的夜晚，打开了备忘录，写下了一个问题：\n\n「活着到底是为了什么？」\n\n你想了很久。为了赚钱？为了买房？为了结婚？为了孩子？为了退休？\n\n如果人生的每一步都是为了下一步做准备——那你什么时候才真正活着？\n\n你没找到答案。但你把这个问题存了下来。\n\n三年后你再看这个问题，发现你已经不在乎答案了。\n\n因为答案不重要——重要的是你还在问。\n\n"人生的意义不是一个答案——是一个你永远不会停止寻找的过程。"',
      cond: g => g.age >= 28 && g.intel >= 55 && g.mood < 55,
      choices:[
        { label:'记录思考', hint:'+🧠 +😊', fn: g => { g.flags.existentialThought=true; return{intel:10,mood:5}; }},
        { label:'找人聊聊', hint:'+👥', fn: g => { g.flags.existentialThought=true; return{social:8,mood:3}; }},
        { label:'不想了', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'ev_car', icon:'🚗', title:'电动车焦虑',
      body:'你攒钱买了一辆电动车。朋友说：「省钱！环保！智能！」\n\n开了一个月后你发现：\n\n1. 充电要排队40分钟\n2. 冬天续航打五折\n3. 自动驾驶吓得你心脏骤停\n4. 保值率：一年后直接腰斩\n\n但每次堵车的时候，你看着旁边的油车在烧钱，你在「烧电」——你笑了。\n\n"电动车不是完美的选择——是一个你能接受的妥协。就像人生。"',
      cond: g => g.money >= 50000 && g.age >= 25 && g.age <= 40 && !g.flags.hasCar,
      choices:[
        { label:'买！', hint:'-💰💰💰 +😊', fn: g => { g.flags.hasCar=true; return{money:-150000,mood:15,charm:8}; }},
        { label:'再观望', hint:'+🧠', fn: g => { return{intel:3,mood:-3}; }},
        { label:'继续挤地铁', hint:'+💰', fn: g => { return{money:5000,mood:-5}; }},
      ]},
    { id:'generational_clash_v2', icon:'💥', title:'观念冲突',
      body:'过年回家，饭桌上的对话变成了一场辩论赛：\n\n你妈：「你应该考公务员。」\n你：「我不想一辈子在体制内。」\n\n你爸：「30岁了还不结婚？」\n你：「婚姻不是人生的必修课。」\n\n你姑：「你在大城市赚那么多钱也不给家里？」\n你：「我房租就要花一半工资……」\n\n最后你爸摔了筷子：「你翅膀硬了是不是？」\n\n你默默回了房间。你知道他们爱你。只是他们表达爱的方式，是控制。\n\n"代际冲突不是谁对谁错——是两代人的世界观，隔了一个时代。"',
      cond: g => g.age >= 25 && g.age <= 38 && g.months > 24,
      choices:[
        { label:'据理力争', hint:'+🧠 -👥', fn: g => { g.flags.generationalClashV2=true; return{intel:5,social:-8,mood:-5}; }},
        { label:'沉默是金', hint:'+🧠', fn: g => { g.flags.generationalClashV2=true; return{intel:3,mood:-8}; }},
        { label:'理解但不接受', hint:'+😊 +👥', fn: g => { g.flags.generationalClashV2=true; return{mood:3,social:3,intel:3}; }},
      ]},
    { id:'city_culture_shock', icon:'🏙️', title:'城市文化冲击',
      body:'你在不同城市之间出差，感受到了巨大的文化差异：\n\n北京：出租车司机跟你聊国际政治。\n上海：咖啡馆里所有人都在用MacBook。\n深圳：地铁里每个人都在看股票。\n成都：下午三点茶馆里坐满了人。\n广州：大排档老板比写字楼白领还忙。\n杭州：每个年轻人都说自己做电商。\n\n你在朋友圈写道：「中国不是一个国家——是很多个国家。」\n\n"城市的魅力不在于地标建筑——在于生活在里面的人。"',
      cond: g => g.months > 12 && g.age >= 23 && g.charm >= 35,
      choices:[
        { label:'记录城市', hint:'+✨ +🧠', fn: g => { g.flags.cityCultureFan=true; return{charm:8,intel:5,mood:5}; }},
        { label:'写旅行攻略', hint:'+👥 +✨', fn: g => { g.flags.cityCultureFan=true; return{social:5,charm:5,money:1000}; }},
        { label:'宅在酒店', hint:'+❤️', fn: g => { return{health:3,mood:3}; }},
      ]},
    { id:'digital_funeral', icon:'📱', title:'账号注销',
      body:'你决定注销一个用了十年的社交账号。\n\n那个账号里有你的青春：大学时的自拍、第一份工作的吐槽、和前恋人（们）的合照、深夜的emo文字。\n\n你在注销前翻了一遍。看着十年前的自己，你笑了——也哭了。\n\n点击「确认注销」的那一刻，你的手抖了一下。\n\n那些记忆不会消失——只是不再存在于互联网上了。它们回到了你的脑海里。\n\n"注销账号是数字时代的断舍离：你不是在删除数据——你是在放下过去。"',
      cond: g => g.age >= 28 && g.intel >= 50 && g.months > 24,
      choices:[
        { label:'彻底注销', hint:'+🧠 +😊', fn: g => { g.flags.accountDeleted=true; g.flags.digitalDetox=true; return{intel:8,mood:10,charm:-3}; }},
        { label:'导出备份再注销', hint:'+🧠', fn: g => { g.flags.accountDeleted=true; return{intel:5,mood:5}; }},
        { label:'算了舍不得', hint:'+😊', fn: g => { return{mood:3}; }},
      ]},
    { id:'redefine_success', icon:'🌟', title:'重新定义成功',
      body:'你在一个深夜的播客里听到一句话：\n\n「成功不是你赚了多少钱——是你有没有按照自己的方式活着。」\n\n你开始反思：你追求的「成功」，真的是你想要的吗？\n\n大房子？你真的需要那么大吗？\n豪车？你真的享受开车吗？\n高管？你真的享受管人吗？\n\n你开始列了一张「我真正想要的」清单：\n1. 健康\n2. 自由的时间\n3. 几个真心的朋友\n4. 做自己喜欢的事\n\n你发现：这张清单上的东西，没有一个需要很多钱。\n\n"重新定义成功：不是降低标准——是找到真正属于你的标准。"',
      cond: g => g.age >= 30 && g.intel >= 55 && g.mood < 60,
      choices:[
        { label:'改变生活方式', hint:'+😊 +🧠', fn: g => { g.flags.redefinedSuccess=true; g.flags.midlifeChange=true; return{mood:15,intel:8,money:-5000}; }},
        { label:'想想就好', hint:'+🧠', fn: g => { g.flags.redefinedSuccess=true; return{intel:5,mood:3}; }},
        { label:'这不现实', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    // === v12.4 退休晚年 + 友情社交 + 生活仪式 ===
    { id:'friend_drift_v2', icon:'👋', title:'朋友渐行渐远',
      body:'你翻看手机通讯录，发现：曾经每天聊天的人，已经半年没联系了。\n\n你们没有吵架。没有闹翻。只是——生活把你们推向了不同的方向。\n\n他/她结了婚，有了孩子。你加了班，搬了家。你们的世界越来越不一样了。\n\n你试着发了一条消息：「最近怎么样？」\n\n对方回了三个字：「挺好的。」\n\n然后——就没有然后了。\n\n"成年人的友情不是死于争吵——是死于沉默。"',
      cond: g => g.age >= 28 && g.social < 50,
      choices:[
        { label:'主动联系', hint:'+👥 +😊', fn: g => { g.flags.friendDrift=true; return{social:8,mood:5}; }},
        { label:'接受变化', hint:'+🧠', fn: g => { g.flags.friendDrift=true; return{intel:5,mood:-3}; }},
        { label:'交新朋友', hint:'+👥 +✨', fn: g => { g.flags.friendDrift=true; return{social:10,charm:3,mood:3}; }},
      ]},
    { id:'birthday_alone', icon:'🎂', title:'一个人的生日',
      body:'今天是你的生日。\n\n凌晨0点，手机震了一下。是你妈发来的微信：「生日快乐，记得吃蛋糕。」\n\n你的朋友圈收到23个生日祝福。其中15个是同事发的（因为看到了朋友圈提醒），5个是群发的，只有3个是真心记得的。\n\n你给自己买了一个小蛋糕。插了一根蜡烛。许了一个愿望。\n\n吹灭蜡烛的那一刻，你想：也许长大就是学会一个人庆祝。\n\n"一个人的生日不是孤独——是成熟。你不再需要别人来证明你的存在。"',
      cond: g => g.months > 12 && g.age >= 25 && g.age <= 40 && g.mood < 60,
      choices:[
        { label:'请朋友吃饭', hint:'-💰 +👥 +😊', fn: g => { g.flags.birthdayAlone=true; return{money:-500,social:8,mood:10}; }},
        { label:'享受独处', hint:'+😊 +🧠', fn: g => { g.flags.birthdayAlone=true; return{mood:8,intel:5}; }},
        { label:'给妈妈打电话', hint:'+👥❤️', fn: g => { g.flags.birthdayAlone=true; return{social:5,mood:8}; }},
      ]},
    { id:'community_garden', icon:'🌻', title:'社区花园',
      body:'你所在的小区建了一个「社区花园」。居民可以认领一小块地，种菜种花。\n\n你认领了一块2平方米的地。你种了西红柿、小葱、薄荷。\n\n三个月后，你的西红柿大丰收。你分给了邻居们。\n\n你的邻居王阿姨回赠了你一盘她包的饺子。你们在花园里聊了一个下午。\n\n你发现：社区花园种出的不只是菜——是邻里关系。\n\n"在钢筋水泥的城市里，一块泥土就能让你找到归属感。"',
      cond: g => g.months > 6 && g.age >= 25 && !g.flags.communityGarden,
      choices:[
        { label:'认真种菜', hint:'+❤️ +😊', fn: g => { g.flags.communityGarden=true; g.flags.plantParent=true; return{health:5,mood:10,social:5}; }},
        { label:'社交为主', hint:'+👥 +😊', fn: g => { g.flags.communityGarden=true; return{social:10,mood:5}; }},
        { label:'算了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'bucket_list', icon:'📋', title:'人生清单',
      body:'你写了一份「人生清单」——50岁之前想做的事：\n\n1. 去一次西藏 ✓（去年去了）\n2. 学一门乐器 ✗\n3. 跑一次马拉松 ✗\n4. 写一本书 ✗\n5. 给父母买一套房 ✗\n6. 学会做饭 ✓\n7. 做一次义工 ✗\n8. 存够100万 ✗\n\n你算了算：完成了2/8。还有15年。\n\n你在清单上加了一条：「9. 学会享受当下。」\n\n然后你划掉了它——因为你已经做到了。\n\n"人生清单不是用来完成的——是用来提醒你：你还有梦想。"',
      cond: g => g.age >= 30 && g.intel >= 50 && !g.flags.bucketList,
      choices:[
        { label:'逐条完成', hint:'+😊 +✨', fn: g => { g.flags.bucketList=true; return{mood:10,charm:5,intel:3}; }},
        { label:'选最重要的做', hint:'+🧠 +😊', fn: g => { g.flags.bucketList=true; return{intel:5,mood:8}; }},
        { label:'活在当下', hint:'+😊😊', fn: g => { g.flags.bucketList=true; return{mood:15}; }},
      ]},
    { id:'online_dating', icon:'💻', title:'网恋',
      body:'你在交友软件上认识了一个人。你们聊了两个月，从诗词歌赋聊到人生哲学。\n\n你觉得自己找到了灵魂伴侣。\n\n然后你们决定见面。\n\n见面的那一刻——他/她和照片不太一样。不是丑了，是……不一样了。\n\n你们尴尬地吃了顿饭。你发现：文字里的默契，不一定能转化为面对面的化学反应。\n\n"网恋的悖论：你在脑海里创造了一个完美的人——然后现实告诉你：没有人是完美的。"',
      cond: g => !g.flags.inRelationship && !g.flags.married && g.age >= 22 && g.age <= 38 && g.charm >= 30,
      choices:[
        { label:'继续了解', hint:'+👥 +😊', fn: g => { g.flags.onlineDating=true; g.flags.inRelationship=true; return{social:8,mood:8}; }},
        { label:'做朋友', hint:'+👥', fn: g => { g.flags.onlineDating=true; return{social:5,mood:-3}; }},
        { label:'删软件', hint:'+🧠', fn: g => { g.flags.onlineDating=true; return{intel:3,mood:-5}; }},
      ]},
    { id:'retirement_countdown', icon:'⏳', title:'退休倒计时',
      body:'你突然意识到：你离退休只有不到20年了。\n\n你算了一下：如果60岁退休，按现在的存款速度，你的退休金大概是……不够花的。\n\n你开始研究：社保缴了多少年？企业年金有没有？个人养老金账户开了没？\n\n你的同事说：「你想这些干嘛，还早着呢。」\n\n但你知道：20年听着多，其实就是一眨眼。\n\n"退休焦虑不是老年人的专利——是中年人提前预支的恐惧。"',
      cond: g => g.age >= 40 && g.age <= 50 && g.money < 200000 && !g.flags.retirementCountdown,
      choices:[
        { label:'加速储蓄', hint:'+💰 +🧠', fn: g => { g.flags.retirementCountdown=true; g.flags.pensionPlan=true; return{money:10000,intel:5,mood:-5}; }},
        { label:'投资增值', hint:'🎲 +💰？', fn: g => { g.flags.retirementCountdown=true; return{money:-20000,intel:8}; }},
        { label:'享受当下', hint:'+😊', fn: g => { g.flags.retirementCountdown=true; return{mood:10,money:-3000}; }},
      ]},
    { id:'moving_upgrade', icon:'📦', title:'搬家升级',
      body:'你终于搬出了那个住了三年的出租屋。\n\n旧房子：隔断间、没有窗户、隔壁天天吵架。\n\n新房子：独立一居室、有阳台、阳光充足。\n\n搬家那天，你看着空荡荡的新房间，深吸一口气。虽然家具还没到，虽然墙上还有钉子洞——但这是你的空间。\n\n你站在阳台上，看着城市的夜景。你第一次觉得：这个城市也有属于我的一小块地方。\n\n"搬家不只是换地址——是给自己一个新开始。"',
      cond: g => !g.flags.hasHouse && g.money > 8000 && g.months > 12 && g.age >= 23,
      choices:[
        { label:'好好装修', hint:'-💰 +😊 +✨', fn: g => { g.flags.movedUp=true; g.flags.renovated=true; return{money:-5000,mood:15,charm:5}; }},
        { label:'简单住', hint:'+😊', fn: g => { g.flags.movedUp=true; return{mood:10,health:3}; }},
        { label:'继续攒钱买房', hint:'+🧠', fn: g => { return{intel:3,mood:-3}; }},
      ]},
    { id:'eco_living', icon:'♻️', title:'环保生活',
      body:'你开始尝试「零浪费生活」。\n\n第一周：你带了保温杯去买咖啡，被店员翻了白眼（因为他们不会操作「自带杯减5元」的系统）。\n\n第二周：你去超市自带购物袋，收银员问：「您确定不要袋子吗？三毛一个很便宜。」\n\n第三周：你开始在家堆肥。你的室友说：「你那个桶里有虫子。」\n\n第四周：你放弃了零浪费——但你还是坚持带保温杯。\n\n"环保不是做到完美——是比昨天的自己好一点。"',
      cond: g => g.age >= 23 && g.intel >= 45 && g.months > 6,
      choices:[
        { label:'坚持环保', hint:'+🧠 +✨', fn: g => { g.flags.ecoLiving=true; return{intel:5,charm:5,mood:5}; }},
        { label:'适度就好', hint:'+😊', fn: g => { g.flags.ecoLiving=true; return{mood:8,intel:3}; }},
        { label:'太难了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'midnight_crisis', icon:'🆘', title:'深夜急诊',
      body:'凌晨2点，你突然胸口疼痛。你打了120。\n\n在医院等了一个小时。做了一系列检查：心电图、血液、胸片。\n\n医生说：「没什么大问题，是焦虑引起的胸闷。注意休息，少喝咖啡。」\n\n你付了800块检查费，走出医院。凌晨4点的街道空无一人。\n\n你第一次觉得：活着真好。\n\n"深夜急诊是身体给你发的最后通牒——这一次是假的，但下一次呢？"',
      cond: g => g.age >= 28 && g.health < 60 && g.mood < 50,
      choices:[
        { label:'认真改变', hint:'+❤️❤️ +🧠', fn: g => { g.flags.midnightCrisis=true; g.flags.healthReport=true; return{health:10,intel:5,mood:5,money:-800}; }},
        { label:'虚惊一场', hint:'+😊', fn: g => { g.flags.midnightCrisis=true; return{mood:10,money:-800}; }},
        { label:'该咋活咋活', hint:'-❤️', fn: g => { g.flags.midnightCrisis=true; return{mood:-3,health:-5,money:-800}; }},
      ]},
    { id:'friend_wedding_v2', icon:'💒', title:'朋友结婚',
      body:'你最好的朋友结婚了。\n\n你坐在台下，看着他/她穿着婚纱/西装，说出「我愿意」的那一刻——你哭了。\n\n不是因为感动（好吧，也因为感动）——是因为你想起：十年前你们还在宿舍里吃泡面，讨论以后要嫁给什么样的人。\n\n现在他/她找到了。而你——还在寻找的路上。\n\n婚礼结束后，你的朋友对你说：「下一个就是你了。」\n\n你笑着说：「不急。」但你心里想：是啊，什么时候轮到我呢？\n\n"参加朋友婚礼的感受：一半是祝福，一半是焦虑。"',
      cond: g => g.age >= 25 && g.age <= 38 && g.social >= 30 && !g.flags.married,
      choices:[
        { label:'随份子', hint:'-💰 +👥 +😊', fn: g => { g.flags.friendWedding=true; return{money:-1000,social:8,mood:5}; }},
        { label:'当伴郎/伴娘', hint:'+👥 +✨', fn: g => { g.flags.friendWedding=true; return{social:10,charm:5,mood:8}; }},
        { label:'不太想去', hint:'', fn: g => { return{mood:-3,social:-3}; }},
      ]},
    // === v12.5 2025社会热点 + 新型生活方式 ===
    { id:'forty_five_degree', icon:'📐', title:'45度人生',
      body:'你发了一条朋友圈：「不卷了，也不躺了。我选择45度人生。」\n\n评论区炸了：\n同事说：「你这是半卷半躺？」\n你妈说：「45度是什么角度？考试考45分？」\n你朋友说：「45度正好是仰望星空的角度。」\n\n你笑了笑。其实45度人生就是——该努力的时候努力，该摸鱼的时候摸鱼。不是放弃，是放过自己。\n\n"内卷太累，躺平太废。45度刚刚好——够得着梦想，也不委屈自己。"',
      cond: g => g.age >= 25 && g.age <= 38 && g.mood >= 35 && g.mood <= 65,
      choices:[
        { label:'这就是我的态度', hint:'+😊 +🧠', fn: g => { g.flags.fortyFiveDegree=true; return{mood:10,intel:5}; }},
        { label:'还是卷吧', hint:'+💰 -❤️', fn: g => { return{money:500,health:-3,mood:-5}; }},
        { label:'还是躺吧', hint:'+❤️ -💰', fn: g => { return{health:5,mood:5,money:-300}; }},
      ]},
    { id:'splash_wealth', icon:'🤑', title:'泼天的富贵',
      body:'你的一个短视频突然爆了——500万播放量！\n\n评论区开始有人找你做广告。一条广告报价2000块。你从来没想过，拍一个猫咪打哈欠的视频能赚这么多钱。\n\n你的同事说：「你这是泼天的富贵啊！快抓住！」\n你的老板说：「上班时间拍的？删掉。」\n\n"泼天的富贵说来就来——但你能不能接住，全看运气和胆量。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.charm >= 40 && !g.flags.splashWealth,
      choices:[
        { label:'辞职做自媒体', hint:'+💰💰 +✨ -🧠', fn: g => { g.flags.splashWealth=true; g.flags.influencer=true; setJob(g,'自媒体博主',8000); return{money:5000,charm:15,mood:20}; }},
        { label:'副业先做着', hint:'+💰 +✨', fn: g => { g.flags.splashWealth=true; return{money:3000,charm:8,mood:10}; }},
        { label:'算了太不靠谱', hint:'', fn: g => { return{mood:-5}; }},
      ]},
    { id:'destiny_gears', icon:'⚙️', title:'命运的齿轮开始转动',
      body:'你在地铁上遇到了一个人。\n\n也许是一个看书的文艺青年，也许是一个穿拖鞋的亿万富翁，也许是一个跟你同名的陌生人。\n\n你们聊了几句。交换了微信。然后——你的人生轨迹开始发生了微妙的变化。\n\n也许是他介绍了一份工作，也许是她让你重新相信了爱情，也许只是一句无心的话点醒了你。\n\n"命运从来不会提前告诉你它要转弯——你只会在回头看的时候，发现那个不起眼的瞬间。"',
      cond: g => g.age >= 24 && g.age <= 40 && !g.flags.destinyGears,
      choices:[
        { label:'加了微信', hint:'+👥 +✨', fn: g => { g.flags.destinyGears=true; return{social:10,charm:5,mood:8}; }},
        { label:'聊完就散了', hint:'+🧠', fn: g => { g.flags.destinyGears=true; return{intel:5,mood:3}; }},
        { label:'没搭话', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'attention_seeker', icon:'🎪', title:'显眼包',
      body:'你在公司年会上做了一件出格的事——你唱了一首rap。\n\n歌词是你自己写的，内容是把老板的口头禅全编成了押韵段子。全场爆笑。老板的脸青了三秒，然后也跟着笑了。\n\n第二天你成了公司群里的「传奇人物」。有人截图发到了微博，评论区全是：「这人是显眼包本包！」\n\n"在职场当显眼包需要勇气——也需要做好第二天被HR约谈的准备。"',
      cond: g => g.age >= 23 && g.age <= 35 && g.charm >= 35 && g.job !== '待业中',
      choices:[
        { label:'我就是这么耀眼', hint:'+✨ +👥', fn: g => { g.flags.attentionSeeker=true; return{charm:12,social:8,mood:15}; }},
        { label:'低调低调', hint:'+🧠', fn: g => { g.flags.attentionSeeker=true; return{intel:3,mood:5}; }},
        { label:'完了要被开了', hint:'-😊', fn: g => { g.flags.attentionSeeker=true; return{mood:-8}; }},
      ]},
    { id:'digital_veggie', icon:'🥬', title:'电子榨菜',
      body:'你发现自己有一个严重的毛病——吃饭的时候如果不看手机视频，就吃不下饭。\n\n你的外卖到了，你打开B站/抖音，选了半天——外卖凉了。你热了一下，继续选。\n\n你妈打电话来：「你怎么不接视频？」「妈我在吃饭。」「你不是一个人吃吗？」「对啊，我在配电子榨菜。」\n\n你妈沉默了三秒：「……菜还能看视频？」\n\n"电子榨菜不会过期，但你的胃会。"',
      cond: g => g.age >= 20 && g.age <= 35 && !g.flags.digitalVeggie,
      choices:[
        { label:'这是我的生活方式', hint:'+😊 -❤️', fn: g => { g.flags.digitalVeggie=true; return{mood:5,health:-3}; }},
        { label:'试着戒掉', hint:'+❤️ -😊', fn: g => { g.flags.digitalVeggie=true; g.flags.digitalDetox=true; return{health:5,mood:-5}; }},
        { label:'边吃边看边学习', hint:'+🧠 -❤️', fn: g => { g.flags.digitalVeggie=true; return{intel:3,health:-2}; }},
      ]},
    { id:'digital_disconnect', icon:'📵', title:'数字断联',
      body:'你做了一个大胆的决定——删掉了微信、抖音、小红书。\n\n第一天：你发现自己不知道今天发生了什么。\n第二天：你发现自己不知道该跟谁聊天。\n第三天：你发现——世界很安静，你的脑子也很安静。\n\n第七天：你重新下载了微信。因为老板在群里@你：「你怎么不回消息？」\n\n"数字断联让你自由了七天——然后工作把你拉回了现实。"',
      cond: g => g.age >= 23 && g.age <= 40 && g.mood <= 50 && !g.flags.digitalDisconnect,
      choices:[
        { label:'坚持断联一周', hint:'+😊 +❤️ -👥', fn: g => { g.flags.digitalDisconnect=true; return{mood:15,health:8,social:-8}; }},
        { label:'算了还是装回来', hint:'+👥 -😊', fn: g => { g.flags.digitalDisconnect=true; return{social:3,mood:-5}; }},
        { label:'只保留工作软件', hint:'+💰 -😊', fn: g => { g.flags.digitalDisconnect=true; return{money:300,mood:-3}; }},
      ]},
    { id:'commando_travel', icon:'🎒', title:'特种兵旅游',
      body:'你用三天两夜玩了三个城市。\n\nDay1: 凌晨坐硬座到长沙，早上吃了碗粉，爬了岳麓山，下午高铁去武汉，晚上吃了热干面。\nDay2: 早上去了黄鹤楼，中午坐动车去重庆，晚上吃了火锅。\nDay3: 早上逛了解放碑，下午飞回来上班。\n\n你的步数：日均5万步。你的花费：总共800块。你的状态：比上班还累。\n\n"特种兵旅游的精髓：用最少的钱，走最多的路，发最多的朋友圈。"',
      cond: g => g.age >= 20 && g.age <= 30 && g.health >= 50 && !g.flags.commandoTravel,
      choices:[
        { label:'发朋友圈炫耀', hint:'+✨ +😊 -❤️', fn: g => { g.flags.commandoTravel=true; return{charm:8,mood:12,health:-8,money:-800}; }},
        { label:'默默回来上班', hint:'+💰', fn: g => { g.flags.commandoTravel=true; return{mood:5,money:-800}; }},
        { label:'决定以后慢旅行', hint:'+🧠', fn: g => { g.flags.commandoTravel=true; return{intel:5,mood:8,money:-800}; }},
      ]},
    { id:'slow_employment', icon:'🐌', title:'慢就业',
      body:'毕业半年了，你还没有找工作。\n\n你妈急得每天打电话：「你看看人家小张，都进大长了！」「你看看隔壁老李的儿子，考上公务员了！」\n\n你不是不想工作——你只是不想随便找一份工作。你在想：我到底喜欢什么？我擅长什么？我这辈子要做什么？\n\n你的同学们觉得你在摆烂。但你知道：磨刀不误砍柴工。\n\n"慢就业不是不就业——是你终于有勇气问自己：这真的是我想做的事吗？"',
      cond: g => g.age >= 22 && g.age <= 26 && g.job === '待业中' && !g.flags.slowEmployment,
      choices:[
        { label:'继续探索', hint:'+🧠 +😊 -💰', fn: g => { g.flags.slowEmployment=true; return{intel:8,mood:5,money:-2000}; }},
        { label:'先随便找一份', hint:'+💰 -😊', fn: g => { g.flags.slowEmployment=true; setJob(g,'临时工',3500); return{money:1000,mood:-5}; }},
        { label:'去考个证', hint:'+🧠 -💰', fn: g => { g.flags.slowEmployment=true; return{intel:10,money:-3000}; }},
      ]},
    { id:'ai_replacement_v2', icon:'🤖', title:'AI要抢你饭碗',
      body:'公司开会宣布：引入AI工具后，部门要裁掉30%的人。\n\n你的同事小王说：「我会用AI啊，AI是我的工具。」\n你的同事小李说：「我是做创意的，AI替代不了我。」\n你的同事小张说：「我已经开始投简历了。」\n\n你看了看自己的工作内容——80%可以被AI替代。你沉默了。\n\n"AI不会淘汰所有人——但会淘汰不愿学习新东西的人。问题是，你还有多少时间学？"',
      cond: g => g.age >= 24 && g.age <= 45 && g.job !== '待业中' && !g.flags.aiReplacement,
      choices:[
        { label:'赶紧学AI', hint:'+🧠 -💰', fn: g => { g.flags.aiReplacement=true; return{intel:12,mood:-5,money:-2000}; }},
        { label:'转行做AI替代不了的', hint:'+😊 +🧠', fn: g => { g.flags.aiReplacement=true; return{mood:5,intel:5}; }},
        { label:'假装没听见', hint:'-🧠', fn: g => { g.flags.aiReplacement=true; return{mood:-8,intel:-3}; }},
      ]},
    { id:'pingti_culture_v2', icon:'🏷️', title:'平替消费',
      body:'你发现了一个新世界——平替。\n\n大牌面霜500块？平替50块，成分一模一样。品牌咖啡30一杯？便利店10块，味道差不多。设计师包包2万？工厂直销200，质量一样。\n\n你把所有东西都换成了平替。一个月下来，你省了5000块。\n\n你的朋友说：「你也太抠了吧？」\n你说：「这不叫抠——这叫消费觉醒。」\n\n"平替不是穷——是你终于明白了：贵的不一定好，好的不一定贵。"',
      cond: g => g.age >= 22 && g.age <= 40 && g.money <= 50000 && !g.flags.pintiCulture,
      choices:[
        { label:'全面平替', hint:'+💰 +🧠', fn: g => { g.flags.pintiCulture=true; return{money:3000,intel:5,mood:5}; }},
        { label:'部分平替', hint:'+💰', fn: g => { g.flags.pintiCulture=true; return{money:1500,mood:3}; }},
        { label:'品质不能省', hint:'-💰 +✨', fn: g => { return{money:-500,charm:5}; }},
      ]},
    // === v12.6 中国式亲情 + 家庭关系 + 节日文化 ===
    { id:'spring_festival_home', icon:'🧧', title:'过年回家',
      body:'春节了。你买了张火车票回家。\n\n一进门，你妈就开始数落你：「怎么又瘦了？是不是不好好吃饭？」你爸在厨房默默炒菜，假装没听见。\n\n年夜饭上，七大姑八大姨开始了年度汇报：\n「有对象了吗？」「一个月赚多少？」「打算什么时候买房？」\n\n你笑着应付，心里翻了一百个白眼。但当你妈把红包塞到你手里的时候——你鼻子酸了。\n\n"过年回家的意义：被骂一顿，被喂胖十斤，然后被塞满后备箱。"',
      cond: g => g.age >= 22 && g.months % 12 >= 0 && !g.flags.springFestival,
      choices:[
        { label:'好好陪家人', hint:'+😊 +👨‍👩‍👧', fn: g => { g.flags.springFestival=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+15); return{mood:12,money:-2000}; }},
        { label:'应付一下就走了', hint:'', fn: g => { g.flags.springFestival=true; return{mood:-3,money:-1000}; }},
        { label:'今年不回了', hint:'-👨‍👩‍👧', fn: g => { if(g.relationships) g.relationships.family=Math.max(0,g.relationships.family-10); return{mood:-8,money:500}; }},
      ]},
    { id:'mom_wechat', icon:'📱', title:'妈妈的微信',
      body:'你妈给你发了一条微信：\n\n「儿子/女儿，你吃了吗？天冷了多穿点。妈做了你爱吃的红烧肉，什么时候回来吃？」\n\n你看了看时间——凌晨2点。你妈居然还没睡。\n\n你打了几个字又删掉了。你不知道怎么回复。说「忙」？说「过几天」？说「别操心了」？\n\n最后你发了一个「嗯」。\n\n你妈秒回：「好，早点睡。」\n\n"妈妈的微信不需要你回复什么——她只是想确认你还活着。"',
      cond: g => g.age >= 22 && !g.flags.momWechat,
      choices:[
        { label:'回个电话', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.momWechat=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+10); return{mood:8}; }},
        { label:'发个红包', hint:'+👨‍👩‍👧 -💰', fn: g => { g.flags.momWechat=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+8); return{mood:5,money:-200}; }},
        { label:'已读不回', hint:'-👨‍👩‍👧', fn: g => { g.flags.momWechat=true; if(g.relationships) g.relationships.family=Math.max(0,g.relationships.family-5); return{mood:-5}; }},
      ]},
    { id:'dad_silent', icon:'👨', title:'爸爸的沉默',
      body:'你爸从来不给你打电话。\n\n你妈说：「你爸每次想你了就翻你的朋友圈，但从来不点赞。他说怕打扰你。」\n\n有一天你回家，发现你爸的手机上存着你从小到大的照片——比你妈存的还多。\n\n你问你爸：「你干嘛不跟我说？」\n你爸看了看电视：「说什么？」\n\n"中国爸爸的爱从来不说出口——但都在行动里。他只是不会表达。"',
      cond: g => g.age >= 24 && !g.flags.dadSilent,
      choices:[
        { label:'主动给爸打电话', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.dadSilent=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+12); return{mood:10}; }},
        { label:'下次回家再说', hint:'+👨‍👩‍👧', fn: g => { g.flags.dadSilent=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+5); return{mood:5}; }},
        { label:'算了都习惯了', hint:'', fn: g => { g.flags.dadSilent=true; return{mood:-3}; }},
      ]},
    { id:'parent_tech_help', icon:'📲', title:'教爸妈用手机',
      body:'你妈打电话来：「这个手机怎么弄啊？我想学网上买菜。」\n\n你远程指导了两个小时。她学会了怎么打开App——然后忘了怎么支付。\n\n第二次她又打来了：「那个……怎么看来着？」\n你第三遍教她的时候，你终于忍不住吼了一句：「妈你怎么又忘了！」\n\n电话那头沉默了三秒。然后你妈说：「算了，我不学了。老了没用了。」\n\n你后悔了。\n\n"教父母用手机是当代最大的孝道考验——耐心比转账更难。"',
      cond: g => g.age >= 24 && g.intel >= 50 && !g.flags.parentTechHelp,
      choices:[
        { label:'耐心再教一遍', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.parentTechHelp=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+10); return{mood:8,intel:3}; }},
        { label:'录个教程视频', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.parentTechHelp=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+8); return{mood:5,intel:5}; }},
        { label:'直接帮他们操作', hint:'+👨‍👩‍👧', fn: g => { g.flags.parentTechHelp=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+3); return{mood:-3}; }},
      ]},
    { id:'mid_autumn_v3', icon:'🌕', title:'中秋独在异乡',
      body:'中秋节。你在出租屋里吃月饼。\n\n五仁的。你妈寄来的。快递单上写着：「注意查收，勿扔。」\n\n你拍了张照片发朋友圈。配文：「千里共婵娟。」\n\n你妈在底下评论：「月饼好吃吗？够不够？妈再给你寄。」\n你爸在底下评论：「。」（他不知道怎么打字，只发了一个句号）\n\n你吃了半个月饼，剩下的放冰箱。因为你一个人吃不完。\n\n"中秋的月亮很圆，但出租屋的月亮——只有一半是亮的。"',
      cond: g => g.age >= 22 && !g.flags.midAutumn,
      choices:[
        { label:'视频通话看月亮', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.midAutumn=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+10); return{mood:8}; }},
        { label:'一个人赏月', hint:'+🧠', fn: g => { g.flags.midAutumn=true; return{mood:-5,intel:5}; }},
        { label:'约朋友一起过', hint:'+👥 +😊', fn: g => { g.flags.midAutumn=true; return{social:8,mood:5,money:-200}; }},
      ]},
    { id:'parent_health_scare_v2', icon:'🏥', title:'爸妈体检报告',
      body:'你妈发来一张体检报告的照片。\n\n你放大看了半天：血压偏高、血糖偏高、骨质疏松。\n\n你打电话过去：「妈，医生怎么说？」\n你妈：「没事没事，小毛病。你别操心，好好工作。」\n你爸在旁边说：「你妈不让我告诉你，怕你担心。」\n\n你突然意识到：你的父母老了。\n\n你以前觉得他们永远不会老。他们永远在那里——唠叨、做饭、等你回家。但现在——他们的头发白了，背驼了，走路慢了。\n\n"父母的健康状况，是你最不敢面对、又最不能逃避的事。"',
      cond: g => g.age >= 28 && !g.flags.parentHealthScare,
      choices:[
        { label:'请假回家陪看病', hint:'+👨‍👩‍👧 +😊 -💰', fn: g => { g.flags.parentHealthScare=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+15); return{mood:5,money:-2000}; }},
        { label:'网上挂号+转钱', hint:'+👨‍👩‍👧 -💰', fn: g => { g.flags.parentHealthScare=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+8); return{mood:-3,money:-3000}; }},
        { label:'嘱咐他们注意身体', hint:'', fn: g => { g.flags.parentHealthScare=true; return{mood:-8}; }},
      ]},
    { id:'family_group_chat', icon:'💬', title:'家族群大战',
      body:'家族群里又吵起来了。\n\n你大伯在群里转发了一条：「震惊！这种菜致癌！」\n你表妹回了一句：「大伯这是谣言。」\n你大伯：「你一个小孩懂什么？我吃的盐比你吃的饭多！」\n你妈出来打圆场：「都是家人别吵了。」\n你爸全程没说话。\n\n你看着这些聊天记录，突然觉得：这个群是你和家的最后一根线。\n\n虽然这根线经常被养生文章和拼多多链接淹没——但至少它还在。\n\n"家族群是中国家庭的数字客厅——乱，但暖。"',
      cond: g => g.age >= 23 && !g.flags.familyGroupChat,
      choices:[
        { label:'发个红包缓解气氛', hint:'+👨‍👩‍👧 -💰', fn: g => { g.flags.familyGroupChat=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+5); return{mood:3,money:-100}; }},
        { label:'帮表妹说话', hint:'+🧠', fn: g => { g.flags.familyGroupChat=true; return{intel:3,mood:5}; }},
        { label:'默默退群', hint:'-👨‍👩‍👧', fn: g => { g.flags.familyGroupChat=true; if(g.relationships) g.relationships.family=Math.max(0,g.relationships.family-8); return{mood:-5}; }},
      ]},
    { id:'hometown_food', icon:'🍜', title:'家乡味道',
      body:'你在外卖App上搜了「家乡菜」。找到了一家评分4.2的。\n\n你点了你妈最拿手的那道菜。等了40分钟。打开盒子的那一刻——你闻到了熟悉的味道。\n\n不对。差了点什么。\n\n你妈做的会多放一勺醋。你妈做的肉会切得更大块。你妈做的会放在那个蓝色的搪瓷碗里。\n\n你吃了一口。眼泪掉进了饭里。\n\n你拿起手机想打电话说「妈我想吃你做的菜」——但你看了一眼时间，凌晨1点了。\n\n"大城市的餐厅什么都有——唯独没有妈妈的味道。"',
      cond: g => g.age >= 22 && g.mood <= 55 && !g.flags.hometownFood,
      choices:[
        { label:'学做那道菜', hint:'+❤️ +🧠', fn: g => { g.flags.hometownFood=true; g.flags.cookingSkill=true; return{health:5,intel:5,mood:8}; }},
        { label:'打电话给妈', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.hometownFood=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+10); return{mood:10}; }},
        { label:'吃完继续加班', hint:'-😊', fn: g => { g.flags.hometownFood=true; return{mood:-5,health:-3}; }},
      ]},
    { id:'parent_visiting', icon:'🚄', title:'爸妈来看你',
      body:'你爸妈坐了6个小时的高铁来看你。\n\n他们带了一后备箱的东西：自家腌的咸菜、你爱吃的腊肉、一箱你小时候用的被子（「这个暖和」）、还有你妈织了三个月的毛衣（「你肯定不穿，但我还是织了」）。\n\n他们在你的出租屋里转了一圈。你妈说：「这么小？能住吗？」你爸说：「还行，比我当年住的好。」\n\n他们住了三天。你妈做了三天的饭。你爸修了三天的水龙头（其实没坏）。\n\n走的时候你妈在门口站了很久。你爸说：「走了。」没回头。\n\n"父母来看你的那几天，是你一年里吃得最好、睡得最踏实的日子。"',
      cond: g => g.age >= 24 && !g.flags.parentVisiting,
      choices:[
        { label:'请假陪他们玩', hint:'+👨‍👩‍👧 +😊 -💰', fn: g => { g.flags.parentVisiting=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+15); return{mood:15,money:-1000}; }},
        { label:'下班后陪他们', hint:'+👨‍👩‍👧', fn: g => { g.flags.parentVisiting=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+8); return{mood:8}; }},
        { label:'太忙了只能见一面', hint:'-👨‍👩‍👧 -😊', fn: g => { g.flags.parentVisiting=true; if(g.relationships) g.relationships.family=Math.max(0,g.relationships.family-5); return{mood:-10}; }},
      ]},
    { id:'parent_aging_v3', icon:'👴', title:'发现父母老了',
      body:'国庆回家，你在门口等你妈开门。\n\n门开了。你愣了一下——你妈的头发白了很多。她的腰也不像以前那么直了。\n\n吃饭的时候你发现你爸夹菜的手在抖。他说：「没事，年纪大了。」\n\n晚上你在客厅翻到一本相册。里面全是你的照片——从出生到毕业到工作。最后一页是你最近发在朋友圈的一张自拍，被你妈打印出来贴在了上面。\n\n你合上相册，去了阳台。外面的月亮很亮。你哭了一会儿。\n\n"发现父母老了的那一刻，比任何一次失恋都心痛。因为这是不可逆的。"',
      cond: g => g.age >= 30 && !g.flags.parentAging,
      choices:[
        { label:'决定多回家看看', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.parentAging=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+15); return{mood:5,intel:5}; }},
        { label:'给爸妈买保险', hint:'+👨‍👩‍👧 -💰', fn: g => { g.flags.parentAging=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+10); return{mood:3,money:-5000}; }},
        { label:'心里难受但说不出口', hint:'-😊', fn: g => { g.flags.parentAging=true; return{mood:-8}; }},
      ]},
    // === v12.7 独居生活 + 租房故事 + 都市生存 ===
    { id:'solo_living', icon:'🏠', title:'独居第一年',
      body:'你搬出了合租房，开始了独居生活。\n\n第一天：你一个人吃火锅。服务员问：「就您一位？」你说：「对。」\n第三天：你忘了买卫生纸。半夜两点，你裹着浴巾跑到楼下便利店。\n第七天：你发现家里有一只蟑螂。你尖叫着给妈妈打电话。你妈说：「用拖鞋拍。」\n\n第三十天：你习惯了。一个人吃饭、一个人看电影、一个人逛超市。\n\n你开始觉得：独居不是孤独——是终于拥有了完整的自己。\n\n"独居的第一年教会你：没有人会来救你——但你可以救自己。"',
      cond: g => g.age >= 22 && g.age <= 32 && !g.flags.soloLiving,
      choices:[
        { label:'享受独居', hint:'+😊 +🧠', fn: g => { g.flags.soloLiving=true; return{mood:10,intel:5}; }},
        { label:'养只猫', hint:'+😊 -💰', fn: g => { g.flags.soloLiving=true; g.flags.hasPet=true; return{mood:12,money:-2000}; }},
        { label:'还是想找人合租', hint:'+👥 -😊', fn: g => { return{social:5,mood:-5}; }},
      ]},
    { id:'rent_increase_v3', icon:'💸', title:'房东又涨租了',
      body:'房东发微信了：「从下个月开始，房租涨500。」\n\n你：「上个月不是刚涨过吗？」\n房东：「不想住可以搬走。后面排队的人多着呢。」\n\n你算了一笔账：搬家费3000、中介费2000、押金可能拿不回来。加起来比涨租还贵。\n\n你回复了一个字：「好。」\n\n"大城市的租客没有议价权——你唯一的筹码就是搬走。但搬走的成本，比留下更高。"',
      cond: g => g.age >= 22 && g.money <= 30000 && !g.flags.rentHikeV2,
      choices:[
        { label:'忍了继续住', hint:'-💰 -😊', fn: g => { g.flags.rentHikeV2=true; return{money:-500,mood:-8}; }},
        { label:'搬家！', hint:'-💰💰 +🧠', fn: g => { g.flags.rentHikeV2=true; return{money:-5000,mood:-3,intel:3}; }},
        { label:'找室友分摊', hint:'+👥', fn: g => { g.flags.rentHikeV2=true; return{social:5,money:-200}; }},
      ]},
    { id:'subway_commute', icon:'🚇', title:'地狱通勤',
      body:'你的通勤路线：家→地铁→换乘→公交→公司。单程1小时40分钟。\n\n每天早上你被挤成相片。你的耳机被挤掉了两次。你的早餐被挤成了压缩饼干。\n\n你试过错峰出行——但你的老板不允许你错峰上班。\n\n你在地铁上看完了12本书、听完了50个播客、背完了3000个单词。\n\n"通勤是大城市给你上的第一课：你以为你在赶路，其实你在浪费生命。但如果你学会了利用这段时间——你就赢了。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.subwayCommute,
      choices:[
        { label:'利用通勤时间学习', hint:'+🧠', fn: g => { g.flags.subwayCommute=true; return{intel:8,health:-3}; }},
        { label:'搬到公司附近', hint:'+❤️ -💰', fn: g => { g.flags.subwayCommute=true; return{health:5,mood:5,money:-5000}; }},
        { label:'摸鱼刷手机', hint:'+😊 -🧠', fn: g => { g.flags.subwayCommute=true; return{mood:3,intel:-3}; }},
      ]},
    { id:'neighbor_from_hell', icon:'🔊', title:'奇葩邻居',
      body:'你的邻居是一个神奇的存在。\n\n凌晨2点练钢琴。周末早上7点装修。每天半夜3点回家，高跟鞋敲地板像机关枪。\n\n你去敲门理论。她开门说：「我交了物业费的，有权在我家里做任何事。」\n\n你找了物业。物业说：「我们管不了。」\n你报了警。警察说：「这是民事纠纷。」\n\n你开始理解：大城市最贵的不是房子——是安静的权利。\n\n"好邻居是运气，奇葩邻居是常态。在大城市，你唯一能选的是离开的勇气。"',
      cond: g => g.age >= 22 && !g.flags.neighborFromHell,
      choices:[
        { label:'买降噪耳机', hint:'-💰 +😊', fn: g => { g.flags.neighborFromHell=true; return{money:-1000,mood:5}; }},
        { label:'录音取证维权', hint:'+🧠', fn: g => { g.flags.neighborFromHell=true; return{intel:5,mood:-5}; }},
        { label:'以牙还牙', hint:'-👥', fn: g => { g.flags.neighborFromHell=true; return{mood:-8,social:-5}; }},
      ]},
    { id:'midnight_snack', icon:'🍜', title:'深夜食堂',
      body:'加班到凌晨1点，你走出公司。\n\n街角的兰州拉面还开着灯。老板是个甘肃人，每天从早上6点干到凌晨2点。\n\n你要了一碗牛肉面。大份，加蛋。\n\n老板端上来的时候说：「小伙子/姑娘，别太拼了。」\n你说：「你也一样啊。」\n老板笑了笑：「我这是生活。你这是拼命。」\n\n你吃了那碗面。那是你在大城市吃过的最好吃的一碗面。\n\n"深夜食堂不只是吃饭的地方——是打工人互相取暖的地方。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && g.mood <= 50 && !g.flags.midnightSnack,
      choices:[
        { label:'成了常客', hint:'+❤️ +😊 -💰', fn: g => { g.flags.midnightSnack=true; return{health:3,mood:8,money:-100}; }},
        { label:'跟老板聊了聊', hint:'+👥 +🧠', fn: g => { g.flags.midnightSnack=true; return{social:5,intel:3,mood:5}; }},
        { label:'吃完赶紧回家睡', hint:'-❤️', fn: g => { g.flags.midnightSnack=true; return{mood:-3,health:-2}; }},
      ]},
    { id:'delivery_addiction_v2', icon:'📦', title:'外卖成瘾',
      body:'你打开外卖App，发现本月已经点了68次外卖了。\n\n你算了算：平均每天两顿，每顿30块。一个月2000多。\n\n你的冰箱里只有三样东西：过期的牛奶、发霉的柠檬、和一瓶老干妈。\n\n你的厨艺水平：会烧开水。\n\n你妈知道了很心疼：「你天天吃外卖，身体怎么受得了？回来妈给你做饭。」\n\n你看了看自己——体重涨了10斤，脸上冒痘，大便不通。\n\n"外卖是大城市的续命神器——但续的只是今天的命，不是明天的健康。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.health <= 70 && !g.flags.deliveryAddiction,
      choices:[
        { label:'学做饭', hint:'+❤️ +🧠', fn: g => { g.flags.deliveryAddiction=true; g.flags.cookingSkill=true; return{health:8,intel:5,mood:5}; }},
        { label:'点健康餐', hint:'+❤️ -💰', fn: g => { g.flags.deliveryAddiction=true; return{health:3,money:-500}; }},
        { label:'继续外卖', hint:'-❤️', fn: g => { g.flags.deliveryAddiction=true; return{health:-5,mood:-3}; }},
      ]},
    { id:'apartment_hunting', icon:'🔑', title:'租房大战',
      body:'你的房子到期了。你开始了新一轮的找房之旅。\n\n第一套：「精装修」——墙皮掉了一半，床是折叠沙发。\n第二套：「采光好」——对面是建筑工地。\n第三套：「交通便利」——地铁在头顶上跑。\n第四套：「价格实惠」——隔断间，没有窗户。\n\n你最终选了一套：离公司远但价格能接受的。你安慰自己：通勤可以学东西。\n\n"在大城市租房，你学的不是生活——是妥协。每一次搬家都是一次理想与现实的谈判。"',
      cond: g => g.age >= 22 && g.age <= 35 && !g.flags.apartmentHunting,
      choices:[
        { label:'住远点省钱', hint:'+💰 -❤️', fn: g => { g.flags.apartmentHunting=true; return{money:2000,health:-3,mood:-5}; }},
        { label:'咬牙租好的', hint:'+😊 -💰', fn: g => { g.flags.apartmentHunting=true; return{mood:10,money:-3000}; }},
        { label:'回老家算了', hint:'+👨‍👩‍👧 -😊', fn: g => { g.flags.apartmentHunting=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+5); return{mood:-8}; }},
      ]},
    { id:'late_night_taxi', icon:'🚕', title:'深夜打车',
      body:'凌晨2点。你加班结束，打了一辆网约车回家。\n\n司机是一个50多岁的大叔。他放了一首老歌：《故乡的云》。\n\n你突然鼻子一酸。\n\n司机从后视镜看了你一眼：「加班啊？」\n你说：「嗯。」\n他说：「我开出租15年了。坐我车的人，有哭的，有笑的，有打电话骂人的，有喝完酒吐的。你是今晚第二个看起来很难过的。」\n\n他递给你一包纸巾。\n\n"深夜的出租车是大城市最温柔的角落——一个陌生人，一首老歌，一包纸巾。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && g.mood <= 45 && !g.flags.lateNightTaxi,
      choices:[
        { label:'跟他聊了聊', hint:'+😊 +🧠', fn: g => { g.flags.lateNightTaxi=true; return{mood:10,intel:3}; }},
        { label:'安静听完那首歌', hint:'+😊', fn: g => { g.flags.lateNightTaxi=true; return{mood:8}; }},
        { label:'假装没事', hint:'', fn: g => { g.flags.lateNightTaxi=true; return{mood:-3}; }},
      ]},
    { id:'weekend_solo', icon:'☕', title:'一个人的周末',
      body:'周末了。你没有任何安排。\n\n你睡到自然醒。看了半天手机。吃了碗泡面。看了部电影。又看了部电影。\n\n你出门去咖啡店坐了一下午。旁边都是成双成对的人。你一个人占了一张四人桌。\n\n服务员问：「等人吗？」你说：「不等，就我一个。」\n\n你突然觉得：一个人的周末，可以是自由的，也可以是孤独的。区别在于——你有没有找到和自己相处的方式。\n\n"一个人的周末不是没人约——是你终于学会了：最好的陪伴是陪伴自己。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.social <= 50 && !g.flags.weekendSolo,
      choices:[
        { label:'享受一个人的时光', hint:'+😊 +🧠', fn: g => { g.flags.weekendSolo=true; return{mood:8,intel:5}; }},
        { label:'主动约朋友出来', hint:'+👥 -💰', fn: g => { g.flags.weekendSolo=true; return{social:10,mood:5,money:-300}; }},
        { label:'刷了一天手机', hint:'-🧠', fn: g => { g.flags.weekendSolo=true; return{mood:-5,intel:-3}; }},
      ]},
    { id:'urban_survival', icon:'🎯', title:'都市生存指南',
      body:'你总结了一份「大城市生存指南」：\n\n1. 地铁高峰期不要穿白衬衫\n2. 便利店关东煮是性价比之王\n3. 医院挂号要凌晨5点去排队\n4. 租房先看水压再看采光\n5. 外卖备注「多放辣」不一定多放辣\n6. 永远不要和房东做朋友\n7. 下雨天打不到车是常态\n8. 周末去超市比外卖便宜\n\n你把这份指南发到了朋友圈。收获了88个赞。\n\n"生存指南不是经验——是伤疤。每一条背后都有一次教训。"',
      cond: g => g.age >= 24 && g.months >= 12 && !g.flags.urbanSurvival,
      choices:[
        { label:'分享给朋友', hint:'+👥 +✨', fn: g => { g.flags.urbanSurvival=true; return{social:8,charm:5,mood:5}; }},
        { label:'继续补充', hint:'+🧠', fn: g => { g.flags.urbanSurvival=true; return{intel:8,mood:3}; }},
        { label:'算了太丧了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    // === v12.8 终身学习 + 职业进阶 + 考证考公 ===
    { id:'kaogong_war', icon:'⚔️', title:'考公大战',
      body:'你决定考公务员。\n\n你花了3000块报了个培训班。每天下班后学3小时。周末全天刷题。\n\n你的朋友圈：「行测」「申论」「时政热点」。你的娱乐：没了。\n\n考试那天，你走进考场——发现竞争对手比你多10倍。\n\n一个岗位，2000人报名，只招1个。概率0.05%。\n\n"考公是当代年轻人的新科举——千军万马过独木桥，考上的叫上岸，没考上的叫继续漂泊。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.intel >= 50 && !g.flags.kaogongWar,
      choices:[
        { label:'全力备考', hint:'+🧠 -❤️ -💰', fn: g => { g.flags.kaogongWar=true; if(Math.random()>0.8){g.flags.civilServant=true;setJob(g,'公务员',6500);return{intel:15,health:-5,mood:20,money:-3000};} return{intel:10,health:-5,mood:-10,money:-3000}; }},
        { label:'边工作边备考', hint:'+🧠 -❤️', fn: g => { g.flags.kaogongWar=true; if(Math.random()>0.9){g.flags.civilServant=true;setJob(g,'公务员',6500);return{intel:12,health:-3,mood:15,money:-3000};} return{intel:8,health:-3,mood:-5,money:-3000}; }},
        { label:'算了我考不上', hint:'', fn: g => { return{mood:-5}; }},
      ]},
    { id:'mba_dream_v2', icon:'🎓', title:'读MBA',
      body:'你考虑读MBA。\n\n学费：30万。时间：2年（周末上课）。回报：不确定。\n\n你问了一个读了MBA的朋友。他说：「最大的收获是人脉。」\n你又问了一个没读MBA的朋友。他说：「30万存银行利息都比涨薪多。」\n\n你的老板说：「读完MBA回来，我给你涨500。」\n你算了算：30万 ÷ 500/月 = 50年回本。\n\n"读MBA是投资还是消费？取决于你读的是名校还是野鸡大学——以及你爸是不是董事。"',
      cond: g => g.age >= 26 && g.age <= 38 && g.money >= 50000 && !g.flags.mbaDream,
      choices:[
        { label:'读了！投资自己', hint:'+🧠 +👥 -💰💰', fn: g => { g.flags.mbaDream=true; return{intel:15,social:15,mood:10,money:-30000}; }},
        { label:'算了性价比太低', hint:'', fn: g => { return{mood:-3}; }},
        { label:'读个便宜的', hint:'+🧠 -💰', fn: g => { g.flags.mbaDream=true; return{intel:8,money:-10000}; }},
      ]},
    { id:'cert_collection', icon:'📜', title:'考证狂人',
      body:'你开始疯狂考证：CPA、CFA、PMP、软考、教师资格证……\n\n你的书架上摆满了各种教材。你的笔记本写了12本。你的黑眼圈深得像挖了地道。\n\n你妈说：「你考了这么多证，能当饭吃吗？」\n你说：「不能——但能让我吃饭的时候更有底气。」\n\n你的简历从1页变成了3页。你的自信从0变成了——还是0。因为你发现：证再多，也治不了你的焦虑。\n\n"考证是当代年轻人的精神鸦片——你以为在提升自己，其实在逃避选择。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.intel >= 55 && !g.flags.certCollection,
      choices:[
        { label:'继续考', hint:'+🧠 -❤️ -💰', fn: g => { g.flags.certCollection=true; return{intel:15,health:-5,mood:-3,money:-5000}; }},
        { label:'够了该实践了', hint:'+💰 +🧠', fn: g => { g.flags.certCollection=true; return{intel:5,money:2000,mood:5}; }},
        { label:'只考最有用的', hint:'+🧠', fn: g => { g.flags.certCollection=true; return{intel:10,mood:3}; }},
      ]},
    { id:'career_switch', icon:'🔄', title:'转行',
      body:'你决定转行了。\n\n你在这个行业干了5年，突然觉得：这不是我想要的生活。\n\n你投了一堆简历。面试官问你：「为什么转行？」你说：「想挑战自己。」其实你是因为：上一个领导太恶心了。\n\n新工作第一天，你什么都不会。你感觉自己又回到了刚毕业的时候。\n\n但你不怕。因为你终于在做自己想做的事了。\n\n"转行是最勇敢的决定——你放弃了5年的积累，只为不再浪费下一个5年。"',
      cond: g => g.age >= 25 && g.age <= 38 && g.months >= 24 && g.job !== '待业中' && !g.flags.careerSwitch,
      choices:[
        { label:'转互联网', hint:'+💰 +🧠', fn: g => { g.flags.careerSwitch=true; setJob(g,'产品经理',12000); return{intel:8,mood:10}; }},
        { label:'转金融', hint:'+💰 -❤️', fn: g => { g.flags.careerSwitch=true; setJob(g,'金融分析师',15000); return{money:5000,health:-3}; }},
        { label:'转教育', hint:'+😊 +👥', fn: g => { g.flags.careerSwitch=true; g.flags.teacher=true; setJob(g,'培训师',8000); return{mood:12,social:5}; }},
      ]},
    { id:'online_course', icon:'💻', title:'网课成瘾',
      body:'你迷上了网课。\n\n编程、设计、心理学、哲学、理财……你买了48门课。看完了——3门。\n\n你的购物车里还有52门课在等你「有空再看」。\n\n你的学习时间分布：20%上课，80%选下一门课。\n\n你终于理解了一个道理：买课不等于学了，就像买书不等于读了。\n\n"网课焦虑的本质：你以为花钱买了知识——其实你只是买了焦虑的安慰剂。"',
      cond: g => g.age >= 22 && g.age <= 35 && !g.flags.onlineCourse,
      choices:[
        { label:'认真学完一门', hint:'+🧠 +😊', fn: g => { g.flags.onlineCourse=true; return{intel:12,mood:8,money:-500}; }},
        { label:'继续买课', hint:'-💰', fn: g => { g.flags.onlineCourse=true; return{intel:3,money:-2000,mood:-3}; }},
        { label:'退掉没看的', hint:'+💰 +🧠', fn: g => { g.flags.onlineCourse=true; return{money:1000,intel:5}; }},
      ]},
    { id:'mentor_found_v3', icon:'👨‍🏫', title:'遇到贵人',
      body:'你在一次行业沙龙上遇到了一个人。\n\n他不是大老板，也不是行业大佬——他只是一个比你早走了5年路的前辈。\n\n他跟你说了三句话改变了你：\n1.「不要做所有人都能做的事。」\n2.「人脉不是你认识谁——是谁认识你。」\n3.「年轻人最大的资本不是时间——是试错的机会。」\n\n你们加了微信。从此以后，你每次迷茫的时候都会找他聊聊。\n\n"人生路上，遇到一个好导师，比遇到十个好机会更重要。"',
      cond: g => g.age >= 24 && g.age <= 35 && g.social >= 30 && !g.flags.mentorFound,
      choices:[
        { label:'拜师学艺', hint:'+🧠 +👥', fn: g => { g.flags.mentorFound=true; return{intel:10,social:8,mood:10}; }},
        { label:'加了微信但没联系', hint:'', fn: g => { g.flags.mentorFound=true; return{social:3}; }},
        { label:'自己也能行', hint:'+🧠', fn: g => { return{intel:3,mood:-3}; }},
      ]},
    { id:'public_speech', icon:'🎤', title:'第一次公开演讲',
      body:'公司让你做一次内部分享。\n\n你准备了两周。PPT改了8遍。你对着镜子练了20次。\n\n演讲那天，你站在台上——腿在抖。你的声音开始发抖。\n\n然后你看到了台下有人在玩手机。你突然放松了：反正也没人认真听。\n\n你讲完了。掌声不大。但你的领导说：「不错，下次公司年会你也来讲。」\n\n"公开演讲是人类最大的恐惧之一——甚至超过死亡。所以站在台上就已经是胜利了。"',
      cond: g => g.age >= 23 && g.job !== '待业中' && !g.flags.publicSpeech,
      choices:[
        { label:'以后多练习', hint:'+✨ +🧠', fn: g => { g.flags.publicSpeech=true; return{charm:10,intel:5,mood:8}; }},
        { label:'再也不来了', hint:'-✨', fn: g => { g.flags.publicSpeech=true; return{mood:-5,charm:-3}; }},
        { label:'报了演讲课', hint:'+✨ -💰', fn: g => { g.flags.publicSpeech=true; return{charm:12,mood:5,money:-3000}; }},
      ]},
    { id:'night_school', icon:'🌙', title:'夜校充电',
      body:'你报了社区的夜校。\n\n每周二、四晚上7点到9点。学费一学期200块。课程：Excel高级应用。\n\n你的同学有：外卖小哥、全职妈妈、退休大爷、刚毕业的大学生。\n\n你发现：这些「失败者」比大厂的精英们更认真。因为他们是真心想学——不是为了KPI。\n\n学期结束的时候，你拿到了结业证书。虽然这张证书可能一文不值——但你学到的东西不会。\n\n"夜校是大城市最被低估的宝藏——便宜、实用、还有一群和你一样想改变命运的人。"',
      cond: g => g.age >= 22 && g.age <= 40 && !g.flags.nightSchool,
      choices:[
        { label:'继续报下一期', hint:'+🧠 +👥', fn: g => { g.flags.nightSchool=true; return{intel:10,social:8,mood:5,money:-200}; }},
        { label:'自学也行', hint:'+🧠', fn: g => { g.flags.nightSchool=true; return{intel:8,mood:3}; }},
        { label:'坚持不下来', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'startup_invite', icon:'🚀', title:'创业公司挖你',
      body:'一家创业公司的创始人找到你：「来我们这里吧！期权、弹性工作、扁平管理！」\n\n你看了看他的BP（商业计划书）：预计明年上市。你看了看他的办公室：共享工位。\n\n你的纠结：\n留在大公司：稳定、有保障、但像个螺丝钉。\n去创业公司：可能暴富、可能倒闭、但至少刺激。\n\n"创业公司给你的不是工作——是一张彩票。你可能中大奖，也可能血本无归。但至少你买了。"',
      cond: g => g.age >= 24 && g.age <= 35 && g.job !== '待业中' && !g.flags.startupInvite,
      choices:[
        { label:'加入创业公司', hint:'+💰 +🧠 -❤️', fn: g => { g.flags.startupInvite=true; if(Math.random()>0.6){g.flags.entrepreneur=true;setJob(g,'联合创始人',10000);return{intel:10,mood:15,health:-5};} setJob(g,'创业公司员工',8000); return{intel:8,mood:5,health:-5}; }},
        { label:'还是留在大公司', hint:'', fn: g => { return{mood:-3}; }},
        { label:'兼职顾问', hint:'+💰 +🧠', fn: g => { g.flags.startupInvite=true; return{money:3000,intel:5,social:5}; }},
      ]},
    { id:'imposter_syndrome_v2', icon:'🎭', title:'冒充者综合征',
      body:'你升职了。但你一点也不开心。\n\n你总觉得：我不配。我只是一个运气好的人。迟早有一天他们会发现我其实什么都不行。\n\n你查了查——这叫「冒充者综合征」。70%的成功者都有过这种感觉。\n\n你的领导说：「你是凭实力上来的。」\n你的内心说：「是吗？那你为什么开会的时候不敢发言？」\n\n"冒充者综合征不是病——是你太在意自己做得够不够好。这本身就是一种实力。"',
      cond: g => g.age >= 25 && g.job !== '待业中' && g.intel >= 60 && !g.flags.imposterSyndrome,
      choices:[
        { label:'接受不完美的自己', hint:'+😊 +🧠', fn: g => { g.flags.imposterSyndrome=true; return{mood:12,intel:5}; }},
        { label:'用行动证明自己', hint:'+💰 -❤️', fn: g => { g.flags.imposterSyndrome=true; return{money:2000,health:-3,mood:3}; }},
        { label:'去看心理咨询师', hint:'+😊 -💰', fn: g => { g.flags.imposterSyndrome=true; g.flags.therapyVisit=true; return{mood:10,money:-500}; }},
      ]},
    // === v12.9 健康危机 + 养生觉醒 + 心理成长 ===
    { id:'health_check_shock', icon:'📋', title:'体检报告惊魂',
      body:'你拿到了年度体检报告。\n\n异常项：脂肪肝（轻度）、尿酸偏高、颈椎曲度变直、视力下降。\n\n医生建议：少喝酒、少吃海鲜、多运动、少看手机。\n\n你看了看自己的日常：啤酒+烧烤+通宵+手机。\n\n你突然理解了为什么体检报告叫「报告」——因为它报告了你正在走向死亡的速度。\n\n你发了条朋友圈：「从今天开始养生。」配了一张枸杞泡水的照片。\n\n"体检报告是年轻人最害怕的文件——比催款通知还恐怖。"',
      cond: g => g.age >= 26 && g.health <= 70 && !g.flags.healthCheckShock,
      choices:[
        { label:'认真改变生活方式', hint:'+❤️ +🧠', fn: g => { g.flags.healthCheckShock=true; g.flags.healthyLifestyle=true; return{health:10,intel:5,mood:5}; }},
        { label:'先枸杞泡水应付一下', hint:'+❤️', fn: g => { g.flags.healthCheckShock=true; return{health:3,mood:3}; }},
        { label:'假装没看见', hint:'-❤️', fn: g => { g.flags.healthCheckShock=true; return{health:-5,mood:-5}; }},
      ]},
    { id:'gym_membership_v3', icon:'🏋️', title:'健身房年卡',
      body:'你花了3000块办了一张健身房年卡。\n\n第一天：你发了3条朋友圈，练了20分钟。\n第一周：你去了5次，每次30分钟。\n第一个月：你去了8次。\n第三个月：你忘了卡放哪了。\n\n一年下来，你总共去了23次。每次成本130块。比请私教还贵。\n\n你的健身成果：腹肌从一块变成了一块更大的。\n\n"健身房年卡是当代最大的「安慰性消费」——你以为花钱就等于锻炼了。"',
      cond: g => g.age >= 22 && g.age <= 38 && !g.flags.gymMembership,
      choices:[
        { label:'坚持去！', hint:'+❤️ +✨ -💰', fn: g => { g.flags.gymMembership=true; return{health:12,charm:8,mood:8,money:-3000}; }},
        { label:'去几次就算了', hint:'-💰', fn: g => { g.flags.gymMembership=true; return{health:3,money:-3000}; }},
        { label:'在家做Keep', hint:'+❤️', fn: g => { g.flags.gymMembership=true; return{health:8,mood:5}; }},
      ]},
    { id:'burnout_crisis', icon:'🔥', title:'职业倦怠',
      body:'你不想上班了。\n\n不是懒——是真的不想。每天早上闹钟响的时候，你想的不是「今天要做什么」，而是「我为什么要活着」。\n\n你去看医生。医生说：「你这是职业倦怠。需要休息。」\n\n你苦笑：休息？房贷要还，花呗要还，信用卡要还。你哪敢休息？\n\n你开始理解：职业倦怠不是因为工作太多——是因为你看不到工作的意义。\n\n"职业倦怠最可怕的不是累——是麻木。当你对一切都无感的时候，你不是在活着——是在运行。"',
      cond: g => g.age >= 25 && g.job !== '待业中' && g.mood <= 40 && !g.flags.burnoutCrisis,
      choices:[
        { label:'请一周假', hint:'+😊 +❤️ -💰', fn: g => { g.flags.burnoutCrisis=true; return{mood:15,health:8,money:-3000}; }},
        { label:'找新工作', hint:'+😊 -❤️', fn: g => { g.flags.burnoutCrisis=true; return{mood:5,health:-3}; }},
        { label:'硬扛', hint:'-❤️ -😊', fn: g => { g.flags.burnoutCrisis=true; return{health:-8,mood:-10}; }},
      ]},
    { id:'meditation_start', icon:'🧘', title:'开始冥想',
      body:'你在网上看到一篇文章：冥想可以减少焦虑，提高专注力。\n\n你下载了一个冥想App。第一天：你闭着眼睛坐了5分钟，脑子里全在想中午吃什么。\n\n第七天：你坐了10分钟，有3分钟是真的什么都不想。\n\n第三十天：你居然习惯了。每天早上起来先冥想10分钟。\n\n你的同事说你最近「变了一个人」。你说：「我只是学会了安静。」\n\n"冥想不是放空——是学会和脑子里的噪音和平共处。"',
      cond: g => g.age >= 24 && g.mood <= 60 && !g.flags.meditationStart,
      choices:[
        { label:'坚持30天', hint:'+😊 +🧠 +❤️', fn: g => { g.flags.meditationStart=true; return{mood:12,intel:5,health:5}; }},
        { label:'试了几天放弃了', hint:'', fn: g => { g.flags.meditationStart=true; return{mood:3}; }},
        { label:'报冥想课', hint:'+😊 -💰', fn: g => { g.flags.meditationStart=true; return{mood:15,money:-2000}; }},
      ]},
    { id:'tcm_wellness_v2', icon:'🍵', title:'中医养生',
      body:'你开始信中医了。\n\n以前你觉得中医是玄学。现在你每天：枸杞泡水、艾灸足三里、泡脚加艾草、三伏贴。\n\n你的办公桌上摆着：保温杯（红枣+枸杞+黄芪）、艾草贴、刮痧板。\n\n你的同事说：「你这是提前进入老年生活了。」\n你说：「这叫觉醒。」\n\n你的体质确实好了。但你也开始理解了一件事：养生不是治病——是学会善待自己。\n\n"年轻人养生的本质：用最传统的方式，对抗最现代的焦虑。"',
      cond: g => g.age >= 26 && !g.flags.tcmWellnessV2,
      choices:[
        { label:'全面养生', hint:'+❤️ +😊', fn: g => { g.flags.tcmWellnessV2=true; return{health:10,mood:8,money:-500}; }},
        { label:'只喝枸杞水', hint:'+❤️', fn: g => { g.flags.tcmWellnessV2=true; return{health:5,mood:3}; }},
        { label:'还是算了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'sleep_debt', icon:'😴', title:'睡眠债',
      body:'你算了一下自己的「睡眠债」。\n\n正常睡眠：每天8小时。你的实际睡眠：每天5小时。\n每天的睡眠债：3小时。一年累积：1095小时 = 45天。\n\n也就是说，你去年欠了自己的身体45天的觉。\n\n你的身体开始报复了：脱发加重、记忆力下降、情绪波动、免疫力降低。\n\n你开始理解一个道理：你以为你在「节省时间」——其实你在「透支生命」。\n\n"睡眠债是世界上最贵的债——因为利息是你的寿命。"',
      cond: g => g.age >= 24 && g.health <= 65 && !g.flags.sleepDebt,
      choices:[
        { label:'早睡早起！', hint:'+❤️ +😊', fn: g => { g.flags.sleepDebt=true; return{health:10,mood:8}; }},
        { label:'周末补觉', hint:'+❤️', fn: g => { g.flags.sleepDebt=true; return{health:3,mood:3}; }},
        { label:'吃褪黑素', hint:'+❤️ -💰', fn: g => { g.flags.sleepDebt=true; return{health:5,money:-200}; }},
      ]},
    { id:'marathon_dream', icon:'🏃', title:'跑马拉松',
      body:'你决定跑一次马拉松。\n\n你从零开始训练。第一周：跑1公里，第二天腿疼得下不了楼梯。\n第一月：跑5公里，膝盖开始抗议。\n第三月：跑半马，你觉得自己是超人。\n\n比赛那天：42.195公里。你跑了4小时32分。冲过终点线的那一刻，你哭了。\n\n不是因为累——是因为你从来没想到自己能跑这么远。\n\n"跑马拉松不是为了赢别人——是为了证明：你比自己以为的更强大。"',
      cond: g => g.age >= 24 && g.age <= 45 && g.health >= 60 && !g.flags.marathonDream,
      choices:[
        { label:'完成了！', hint:'+❤️ +😊 +✨', fn: g => { g.flags.marathonDream=true; return{health:15,mood:20,charm:8}; }},
        { label:'跑到一半放弃了', hint:'+❤️', fn: g => { g.flags.marathonDream=true; return{health:8,mood:-5}; }},
        { label:'训练太苦放弃了', hint:'', fn: g => { return{mood:-5}; }},
      ]},
    { id:'therapy_session_v2', icon:'💭', title:'心理咨询',
      body:'你终于去看了心理咨询师。\n\n你犹豫了很久：「我又不是精神病，为什么要去看心理医生？」\n\n但你终于鼓起勇气走进那间温馨的办公室。咨询师说：「你觉得最近怎么样？」\n\n你张了张嘴——然后哭了。\n\n你哭了40分钟。咨询师递了你一盒纸巾。结束后她说：「你很勇敢。」\n\n你走出那扇门，阳光很好。你深呼吸了一下。你觉得：世界好像没那么沉重了。\n\n"求助不是软弱——是你能给自己最好的礼物。"',
      cond: g => g.age >= 24 && g.mood <= 45 && !g.flags.therapySession,
      choices:[
        { label:'定期去', hint:'+😊 +💰', fn: g => { g.flags.therapySession=true; g.flags.therapyVisit=true; return{mood:18,money:-3000}; }},
        { label:'去了一次', hint:'+😊 -💰', fn: g => { g.flags.therapySession=true; g.flags.therapyVisit=true; return{mood:10,money:-500}; }},
        { label:'还是不敢去', hint:'', fn: g => { return{mood:-8}; }},
      ]},
    { id:'health_app_v2', icon:'⌚', title:'健康手环',
      body:'你买了一个智能手环。\n\n它告诉你：每天走3247步（太少了）、深度睡眠1小时（太少了）、心率偏高（不太好）。\n\n你开始为了凑步数晚饭后在小区转圈。你开始为了睡眠质量提前半小时放下手机。\n\n你的手环成了你的「健康管家」——虽然它经常半夜震动把你吓醒。\n\n"健康手环的意义不是记录数据——是让你第一次真正「看见」了自己的身体。"',
      cond: g => g.age >= 22 && !g.flags.healthApp,
      choices:[
        { label:'认真跟着数据走', hint:'+❤️ +🧠', fn: g => { g.flags.healthApp=true; return{health:10,intel:3,mood:5,money:-500}; }},
        { label:'戴着玩', hint:'+❤️', fn: g => { g.flags.healthApp=true; return{health:3,money:-500}; }},
        { label:'看了更焦虑', hint:'-😊', fn: g => { g.flags.healthApp=true; return{mood:-5,money:-500}; }},
      ]},
    { id:'body_image', icon:'🪞', title:'容貌焦虑',
      body:'你刷小红书的时候，看到了一个和你同龄的人。他/她看起来比你年轻10岁。\n\n你照了照镜子：黑眼圈、法令纹、额头上的痘痘。\n\n你开始研究医美：热玛吉2万、水光针3000、玻尿酸5000、拉皮5万。\n\n你的同事说：「你本来就很好看啊。」\n你不信。你觉得他们在安慰你。\n\n直到有一天你翻到5年前的照片——你发现：其实你比以前更好看了。只是你每天看自己，看不到变化。\n\n"容貌焦虑不是因为你不好看——是因为你一直在跟不可能的人比。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.charm <= 60 && !g.flags.bodyImage,
      choices:[
        { label:'接受自己的样子', hint:'+😊 +🧠', fn: g => { g.flags.bodyImage=true; return{mood:12,intel:5}; }},
        { label:'做点基础护肤', hint:'+✨ -💰', fn: g => { g.flags.bodyImage=true; return{charm:5,money:-1000}; }},
        { label:'去做医美', hint:'+✨ -💰💰', fn: g => { g.flags.bodyImage=true; return{charm:10,mood:5,money:-10000}; }},
      ]},
    // === v13.0 大版本：多元生活 + 社会观察 ===
    { id:'volunteer_work_v3', icon:'🤝', title:'志愿者',
      body:'你报名参加了社区志愿者。\n\n你的任务：帮独居老人买菜、教他们用手机、陪他们聊天。\n\n第一个老人：80岁的张奶奶。她的孩子都在国外。她每周最期待的事就是有人来跟她说话。\n\n你陪她聊了一下午。她给你讲了她年轻时候的故事——比你的精彩100倍。\n\n"志愿者不是你在帮助别人——是你在被别人的故事治愈。"',
      cond: g => g.age >= 22 && g.social >= 20 && !g.flags.volunteerWork,
      choices:[
        { label:'坚持每周去', hint:'+👥 +😊 +🧠', fn: g => { g.flags.volunteerWork=true; g.flags.volunteer=true; return{social:10,mood:12,intel:5}; }},
        { label:'去了一次', hint:'+😊', fn: g => { g.flags.volunteerWork=true; g.flags.volunteer=true; return{mood:8,social:3}; }},
        { label:'太忙了去不了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'second_hand_shop', icon:'🛍️', title:'二手市场',
      body:'你在闲鱼上卖了一堆旧东西。\n\n旧衣服、旧书、旧电子产品——你发现你有太多不需要的东西。\n\n你一共卖了2000块。但更重要的是：你扔掉了30斤的「执念」。\n\n你开始理解：断舍离不是扔东西——是扔掉你不需要的欲望。\n\n"二手市场的哲学：你觉得没用的东西，可能是别人的宝贝。反之亦然。"',
      cond: g => g.age >= 22 && !g.flags.secondHandShop,
      choices:[
        { label:'定期断舍离', hint:'+😊 +💰 +🧠', fn: g => { g.flags.secondHandShop=true; return{mood:10,money:2000,intel:5}; }},
        { label:'只卖一次', hint:'+💰', fn: g => { g.flags.secondHandShop=true; return{money:1000,mood:5}; }},
        { label:'舍不得扔', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'city_walk', icon:'🚶', title:'City Walk',
      body:'你参加了一次City Walk——城市漫步。\n\n你们一群人沿着老城区走：看了百年老建筑、钻了弄堂巷子、吃了一家只有本地人知道的馄饨店。\n\n你在这座城市住了5年，今天你才发现：原来还有这么多你不知道的角落。\n\n"City Walk的意义不在于走到哪里——在于用脚步重新认识你以为熟悉的城市。"',
      cond: g => g.age >= 22 && g.age <= 40 && !g.flags.cityWalk,
      choices:[
        { label:'发了小红书', hint:'+✨ +👥', fn: g => { g.flags.cityWalk=true; return{charm:5,social:8,mood:10}; }},
        { label:'一个人继续探索', hint:'+🧠 +😊', fn: g => { g.flags.cityWalk=true; return{intel:5,mood:8}; }},
        { label:'下次带朋友来', hint:'+👥', fn: g => { g.flags.cityWalk=true; return{social:5,mood:5}; }},
      ]},
    { id:'pet_loss', icon:'💔', title:'宠物离世',
      body:'你的猫/狗走了。\n\n它陪了你5年。5年里，你加班回来它等你。你哭的时候它蹭你。你笑的时候它摇尾巴/打呼噜。\n\n你把它葬在了郊外的一棵树下。你在墓碑上写：「谢谢你陪我度过了最难的日子。」\n\n你回到家。门开了——没有迎接你的声音。你坐在沙发上，哭了很久。\n\n"失去宠物的痛苦，不亚于失去家人——因为它们就是家人。"',
      cond: g => g.flags.hasPet && g.age >= 25 && !g.flags.petLoss,
      choices:[
        { label:'允许自己悲伤', hint:'+😊 +🧠', fn: g => { g.flags.petLoss=true; g.flags.hasPet=false; return{mood:-15,intel:5}; }},
        { label:'再养一只', hint:'+😊 -💰', fn: g => { g.flags.petLoss=true; return{mood:5,money:-2000}; }},
        { label:'把爱传递出去', hint:'+👥 +😊', fn: g => { g.flags.petLoss=true; g.flags.hasPet=false; return{social:5,mood:-8}; }},
      ]},
    { id:'salary_negotiation_v3', icon:'💰', title:'谈薪',
      body:'你决定跟老板谈加薪。\n\n你准备了两周：市场行情、你的业绩数据、竞争对手的薪资报告。\n\n你走进办公室。老板说：「你想谈什么？」\n你的声音在抖：「我觉得我的薪资跟市场水平有差距。」\n\n老板沉默了10秒（感觉像10年）。然后他说：「我给你涨15%。但你得承担更多责任。」\n\n你走出办公室。你的衬衫全湿了。\n\n"谈薪资是职场最勇敢的事——因为你终于敢为自己的价值开口了。"',
      cond: g => g.age >= 24 && g.job !== '待业中' && g.months >= 12 && !g.flags.salaryNegotiation,
      choices:[
        { label:'接受新条件', hint:'+💰 +🧠', fn: g => { g.flags.salaryNegotiation=true; g.jobSalary=Math.floor(g.jobSalary*1.15); return{money:3000,intel:5,mood:10}; }},
        { label:'要求更多', hint:'+💰 -😊', fn: g => { g.flags.salaryNegotiation=true; if(Math.random()>0.5){g.jobSalary=Math.floor(g.jobSalary*1.25);return{money:5000,mood:15};} return{mood:-10}; }},
        { label:'算了不敢', hint:'-😊', fn: g => { return{mood:-8}; }},
      ]},
    { id:'book_club_v2', icon:'📖', title:'读书会',
      body:'你加入了一个读书会。\n\n每月读一本书，然后聚在一起讨论。你发现：同一本书，10个人有10种理解。\n\n你读的那本书叫《活着》。讨论会上，一个50岁的大叔哭了。他说：「这本书我读了3遍。每一遍都有不同的感受。」\n\n你突然理解了：读书不是读故事——是在别人的故事里，找到自己的答案。\n\n"读书会是大城市最好的社交方式——因为你遇到的人，都有深度。"',
      cond: g => g.age >= 22 && g.intel >= 40 && !g.flags.bookClub,
      choices:[
        { label:'每月参加', hint:'+🧠 +👥 +😊', fn: g => { g.flags.bookClub=true; g.flags.readingHabit=true; return{intel:12,social:8,mood:8}; }},
        { label:'参加了一次', hint:'+🧠', fn: g => { g.flags.bookClub=true; return{intel:5,mood:5}; }},
        { label:'不喜欢群体讨论', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'freelance_start', icon:'💻', title:'接私活',
      body:'你在网上接了一个私活：做一个小网站，报价5000块。\n\n你花了3个周末完成了。客户说：「很好，下次还找你。」\n\n你收到了5000块。你算了算时薪：5000 ÷ 48小时 = 104块/小时。比你上班的时薪还高。\n\n你开始想：也许我可以不靠上班活着。\n\n"接私活是自由的起点——但也是「没有下班时间」的起点。"',
      cond: g => g.age >= 24 && g.intel >= 55 && g.job !== '待业中' && !g.flags.freelanceStart,
      choices:[
        { label:'继续接活', hint:'+💰 +🧠 -❤️', fn: g => { g.flags.freelanceStart=true; g.flags.sideHustle=true; return{money:5000,intel:8,health:-3}; }},
        { label:'只做这一次', hint:'+💰', fn: g => { g.flags.freelanceStart=true; return{money:5000,mood:5}; }},
        { label:'太累了不值得', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    { id:'generation_gap', icon:'👴', title:'代沟',
      body:'你跟你爸聊天的时候，他说了一句话让你沉默了：\n\n「你们这代人太矫情了。我们那时候，哪有什么心理健康、职场倦怠——就是干。」\n\n你想反驳。但你不知道怎么开口。\n\n因为你知道：他们那一代人的苦，不比你少。只是他们不说。\n\n代沟不是谁对谁错——是两个时代的人，用不同的语言描述同一种痛苦。\n\n"代沟的本质：你们都在受苦，但你们不能理解彼此的苦。"',
      cond: g => g.age >= 24 && g.age <= 35 && !g.flags.generationGap,
      choices:[
        { label:'试着理解他', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.generationGap=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+8); return{intel:5,mood:5}; }},
        { label:'据理力争', hint:'-👨‍👩‍👧', fn: g => { g.flags.generationGap=true; if(g.relationships) g.relationships.family=Math.max(0,g.relationships.family-5); return{mood:-5}; }},
        { label:'沉默不语', hint:'', fn: g => { g.flags.generationGap=true; return{mood:-3}; }},
      ]},
    { id:'minimalist_life', icon:'📦', title:'极简生活',
      body:'你决定过极简生活。\n\n规则：一个月不买任何非必要物品。不点外卖。不刷短视频。不逛淘宝。\n\n第一天：你觉得自己要死了。\n第七天：你发现生活原来可以很简单。\n第三十天：你省了8000块，读了4本书，跑了20公里。\n\n你终于理解了：你以前以为的「需要」，其实都是「想要」。\n\n"极简不是什么都没有——是终于知道什么是真正需要的。"',
      cond: g => g.age >= 24 && g.money <= 30000 && !g.flags.minimalistLife,
      choices:[
        { label:'坚持30天', hint:'+💰 +🧠 +😊', fn: g => { g.flags.minimalistLife=true; g.flags.minimalist=true; return{money:5000,intel:8,mood:10}; }},
        { label:'坚持了一周', hint:'+💰', fn: g => { g.flags.minimalistLife=true; return{money:2000,mood:3}; }},
        { label:'第一天就失败了', hint:'-💰', fn: g => { return{mood:-5,money:-200}; }},
      ]},
    { id:'digital_nomad_v4', icon:'🌍', title:'数字游民',
      body:'你辞了职，成了数字游民。\n\n你带着一台笔记本，去了大理。白天在咖啡馆工作，晚上在洱海边散步。\n\n你的收入从2万降到了8千。但你的生活成本也降到了3千。\n\n你每天工作时间从10小时变成了4小时。多出来的时间——你看书、写东西、发呆。\n\n"数字游民不是逃避——是你终于选择了自由，而不是安全感。"',
      cond: g => g.age >= 25 && g.age <= 35 && g.intel >= 60 && g.money >= 20000 && !g.flags.digitalNomad,
      choices:[
        { label:'做半年再说', hint:'+😊 +🧠 -💰', fn: g => { g.flags.digitalNomad=true; g.flags.freelancer=true; setJob(g,'数字游民',8000); return{mood:20,intel:10,money:-5000}; }},
        { label:'试了一个月回来', hint:'+🧠', fn: g => { g.flags.digitalNomad=true; return{intel:8,mood:5}; }},
        { label:'还是算了太冒险', hint:'', fn: g => { return{mood:-5}; }},
      ]},
    { id:'social_anxiety', icon:'😰', title:'社交恐惧',
      body:'你越来越不想社交了。\n\n不想回微信、不想接电话、不想参加聚会。你觉得：一个人的时候最舒服。\n\n但你也知道：人是社会性动物。长期不社交，你的沟通能力在退化。\n\n你试着逼自己去社交。但你发现：每次社交之后，你都需要一天来「充电」。\n\n"社恐不是病——是你的能量太珍贵了，不舍得浪费在不重要的人身上。"',
      cond: g => g.age >= 22 && g.social <= 40 && !g.flags.socialAnxiety,
      choices:[
        { label:'接受自己的节奏', hint:'+😊 +🧠', fn: g => { g.flags.socialAnxiety=true; return{mood:10,intel:5}; }},
        { label:'逼自己多社交', hint:'+👥 -😊', fn: g => { g.flags.socialAnxiety=true; return{social:8,mood:-8}; }},
        { label:'减少无效社交', hint:'+🧠', fn: g => { g.flags.socialAnxiety=true; return{intel:5,mood:5,social:-5}; }},
      ]},
    { id:'hobby_business', icon:'💡', title:'爱好变副业',
      body:'你的爱好变成了副业。\n\n你喜欢画画，开始在网上卖插画。你喜欢做饭，开始做私房菜外卖。你喜欢摄影，开始接婚礼跟拍。\n\n你赚了一些钱。但你也发现：当爱好变成工作，你就不那么喜欢它了。\n\n因为「想做」变成了「必须做」。「享受」变成了「交付」。\n\n"把爱好变成工作是双刃剑——你赚了钱，但丢了快乐。"',
      cond: g => g.age >= 24 && g.intel >= 50 && !g.flags.hobbyBusiness,
      choices:[
        { label:'继续做副业', hint:'+💰 -😊', fn: g => { g.flags.hobbyBusiness=true; g.flags.sideHustle=true; return{money:3000,mood:-3}; }},
        { label:'保持爱好纯粹', hint:'+😊', fn: g => { g.flags.hobbyBusiness=true; return{mood:10}; }},
        { label:'找个平衡点', hint:'+💰 +😊', fn: g => { g.flags.hobbyBusiness=true; return{money:1500,mood:5}; }},
      ]},
    { id:'age_anxiety', icon:'🎂', title:'年龄焦虑',
      body:'你又大了一岁。\n\n朋友圈里，同龄人：有人升了总监，有人买了二套房，有人孩子都会走路了。\n\n而你：还是那个样子。\n\n你开始焦虑：30岁了，我的人生是不是已经定型了？35岁，是不是就真的「职场天花板」了？\n\n直到你看到一个70岁老奶奶在学画画。你突然释怀了。\n\n"年龄焦虑不是因为你老了——是因为你觉得自己「应该」做到某些事。但谁规定的？"',
      cond: g => g.age >= 28 && g.age <= 38 && g.mood <= 55 && !g.flags.ageAnxiety,
      choices:[
        { label:'接受自己的节奏', hint:'+😊 +🧠', fn: g => { g.flags.ageAnxiety=true; return{mood:12,intel:8}; }},
        { label:'制定新目标', hint:'+🧠', fn: g => { g.flags.ageAnxiety=true; return{intel:10,mood:5}; }},
        { label:'继续焦虑', hint:'-😊', fn: g => { g.flags.ageAnxiety=true; return{mood:-8}; }},
      ]},
    { id:'workplace_gossip', icon:'🗣️', title:'职场八卦',
      body:'你被卷入了一场职场八卦。\n\n有人在背后说你「靠关系上位」。你气得要命。\n\n你想反击——但你发现：解释只会让事情更糟。\n\n你的导师说了一句话：「在职场，你控制不了别人的嘴——你只能控制自己的事。」\n\n你深呼吸了一下。继续干活。\n\n"职场八卦最好的应对方式：不是解释——是用结果打脸。"',
      cond: g => g.age >= 23 && g.job !== '待业中' && !g.flags.workplaceGossip,
      choices:[
        { label:'用实力说话', hint:'+💰 +🧠', fn: g => { g.flags.workplaceGossip=true; return{money:1000,intel:5,mood:5}; }},
        { label:'找领导反映', hint:'+👥', fn: g => { g.flags.workplaceGossip=true; return{social:3,mood:-3}; }},
        { label:'忍了', hint:'-😊', fn: g => { g.flags.workplaceGossip=true; return{mood:-10}; }},
      ]},
    { id:'life_philosophy', icon:'🌟', title:'人生哲学',
      body:'你30岁了。你开始思考一个终极问题：人生的意义是什么？\n\n你翻了哲学书：存在主义说「意义是你创造的」。佛学说「放下执念」。斯多葛说「接受你不能改变的」。\n\n你想了很久。最后你的答案是：\n\n人生的意义不是找到答案——是在寻找的过程中，活出了自己。\n\n"人生哲学不是象牙塔里的空想——是你被生活揍了无数次之后，总结出来的生存智慧。"',
      cond: g => g.age >= 28 && g.intel >= 55 && !g.flags.lifePhilosophy,
      choices:[
        { label:'写下来', hint:'+🧠 +😊', fn: g => { g.flags.lifePhilosophy=true; g.flags.redefinedSuccess=true; return{intel:12,mood:10}; }},
        { label:'跟朋友讨论', hint:'+👥 +🧠', fn: g => { g.flags.lifePhilosophy=true; return{social:5,intel:8}; }},
        { label:'想不明白就不想了', hint:'', fn: g => { return{mood:-3}; }},
      ]},
    // === v13.1 婚恋关系 + 相亲文化 + 单身生活 ===
    { id:'blind_date_v2_v2', icon:'🍽️', title:'相亲',
      body:'你妈给你安排了一次相亲。\n\n对方条件：有房有车，月薪2万，身高175，不抽烟不喝酒。\n\n你到了餐厅。对方比你照片上胖了一圈。聊天话题：房子几套、车什么牌子、年薪多少。\n\n你问：「你有什么爱好？」\n对方说：「赚钱。」\n\n你吃完饭，AA制。对方说：「我觉得你挺适合结婚的。」\n你说：「谢谢。」然后你拉黑了他/她的微信。\n\n"相亲不是找对象——是两个家庭在做商业谈判。"',
      cond: g => g.age >= 25 && g.age <= 38 && !g.flags.married && !g.flags.blindDate,
      choices:[
        { label:'继续见下一个', hint:'+👥', fn: g => { g.flags.blindDate=true; return{social:5,mood:-5}; }},
        { label:'算了不去了', hint:'+😊', fn: g => { g.flags.blindDate=true; return{mood:5}; }},
        { label:'给个机会再处处', hint:'+👥 +😊', fn: g => { g.flags.blindDate=true; return{social:8,mood:3}; }},
      ]},
    { id:'cohabitation', icon:'🏠', title:'同居',
      body:'你和对象决定同居了。\n\n第一周：甜蜜到腻。\n第一月：你发现他/她睡觉打呼噜、挤牙膏从中间挤、袜子乱扔。\n第三月：你们为了「谁洗碗」吵了三次架。\n\n你开始理解：同居是婚姻的最佳彩排——因为它让你提前知道了：你能不能接受这个人最真实的样子。\n\n"同居的真相：你不是在跟一个人生活——你是在跟一个人的所有习惯生活。"',
      cond: g => g.age >= 24 && g.flags.partnerName && !g.flags.cohabitation,
      choices:[
        { label:'磨合！', hint:'+😊 +🧠', fn: g => { g.flags.cohabitation=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+10); return{mood:8,intel:5}; }},
        { label:'算了还是分开住', hint:'', fn: g => { return{mood:-5}; }},
        { label:'制定家务分工表', hint:'+🧠 +👥', fn: g => { g.flags.cohabitation=true; return{intel:5,social:3,mood:5}; }},
      ]},
    { id:'marriage_pressure_v2_v2', icon:'💍', title:'催婚',
      body:'过年回家，你妈又开始了：\n\n「你xxx都结婚了，你呢？」\n「再不找就来不及了！」\n「你是不是有什么问题？」\n\n你爸在旁边不说话（他已经被你妈骂了20年了）。\n\n你的七大姑八大姨轮流上阵。你笑着应付，心里想：婚姻是人生的一个选项——不是必选题。\n\n"催婚是中国式亲情的终极武器——出发点是爱，落点是伤害。"',
      cond: g => g.age >= 26 && !g.flags.married && !g.flags.marriagePressure,
      choices:[
        { label:'理解他们的关心', hint:'+👨‍👩‍👧 +🧠', fn: g => { g.flags.marriagePressure=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+5); return{intel:5,mood:-3}; }},
        { label:'据理力争', hint:'-👨‍👩‍👧', fn: g => { g.flags.marriagePressure=true; if(g.relationships) g.relationships.family=Math.max(0,g.relationships.family-8); return{mood:-5}; }},
        { label:'假装在找了', hint:'', fn: g => { g.flags.marriagePressure=true; return{mood:-3}; }},
      ]},
    { id:'wedding_cost_v2', icon:'💒', title:'婚礼预算',
      body:'你要结婚了。然后你看到了婚礼报价单：\n\n酒店：5万\n婚庆：3万\n婚纱：1万\n摄影：8千\n司仪：5千\n请柬+喜糖：5千\n总计：约10万\n\n你看了看存款。你看了看对方。你说：「要不……旅行结婚？」\n\n对方说：「不行，我妈说要办。」\n你妈说：「不行，我朋友的孩子都办了。」\n\n"婚礼不是给新人办的——是给新人父母办的。新郎新娘只是演员。"',
      cond: g => g.flags.married && !g.flags.weddingCost,
      choices:[
        { label:'办！一辈子一次', hint:'-💰💰 +😊', fn: g => { g.flags.weddingCost=true; return{money:-80000,mood:15,charm:5}; }},
        { label:'简办', hint:'-💰 +😊', fn: g => { g.flags.weddingCost=true; return{money:-30000,mood:8}; }},
        { label:'旅行结婚', hint:'-💰 +😊 +🧠', fn: g => { g.flags.weddingCost=true; return{money:-20000,mood:12,intel:3}; }},
      ]},
    { id:'single_life', icon:'🙋', title:'单身宣言',
      body:'你在朋友圈发了一条：「我选择不结婚。」\n\n评论区炸了：\n你妈：「你等着，我马上给你安排相亲。」\n你朋友：「等你遇到对的人就不这么想了。」\n你同事：「佩服你的勇气。」\n\n你不反对婚姻——你只是不想为了结婚而结婚。你觉得：一个人也可以过得很好。\n\n"单身不是找不到人——是不愿意将就。而「不将就」是这个时代最奢侈的品质。"',
      cond: g => g.age >= 28 && !g.flags.married && !g.flags.singleLife,
      choices:[
        { label:'坚持自己的选择', hint:'+😊 +🧠', fn: g => { g.flags.singleLife=true; return{mood:12,intel:8}; }},
        { label:'有点动摇了', hint:'', fn: g => { g.flags.singleLife=true; return{mood:-3}; }},
        { label:'发完就删了', hint:'+👨‍👩‍👧', fn: g => { g.flags.singleLife=true; if(g.relationships) g.relationships.family=Math.min(100,g.relationships.family+3); return{mood:-5}; }},
      ]},
    { id:'relationship_fight', icon:'⚡', title:'吵架',
      body:'你和对象又吵架了。\n\n起因：谁没倒垃圾。结果：翻出了三年前你没回消息的事。\n\n你们吵了2个小时。最后他/她说了一句：「你跟你爸一样！」\n\n你愣住了。这是你听过的最伤人的一句话。\n\n你们冷战了3天。第四天，他/她给你买了你最爱吃的草莓。你们和好了。\n\n"吵架是亲密关系的必修课——因为只有在最亲近的人面前，你才敢暴露最真实的自己。"',
      cond: g => g.flags.partnerName && !g.flags.relationshipFight,
      choices:[
        { label:'主动道歉', hint:'+👥 +😊', fn: g => { g.flags.relationshipFight=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+5); return{mood:5,social:3}; }},
        { label:'等对方先开口', hint:'-😊', fn: g => { g.flags.relationshipFight=true; return{mood:-5}; }},
        { label:'认真谈谈', hint:'+🧠 +👥', fn: g => { g.flags.relationshipFight=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+8); return{intel:5,social:5,mood:3}; }},
      ]},
    { id:'prenup_talk_v2', icon:'📄', title:'婚前协议',
      body:'你们讨论婚前协议。\n\n对方说：「我名下有一套房，婚前买的。这个不能算共同财产。」\n你说：「可以。」\n对方又说：「但我父母出的首付，这部分……」\n\n你突然觉得：这不是在讨论婚姻——这是在讨论合同。\n\n你妈说：「不签！签了就是不相信对方！」\n你朋友说：「签！这是保护自己。」\n\n"婚前协议是理性还是冷酷？取决于你更相信爱情还是更相信法律。"',
      cond: g => g.flags.married && g.age >= 26 && !g.flags.prenupTalk,
      choices:[
        { label:'签了更安心', hint:'+🧠 +💰', fn: g => { g.flags.prenupTalk=true; return{intel:5,mood:3}; }},
        { label:'不签，信任比协议重要', hint:'+😊', fn: g => { g.flags.prenupTalk=true; return{mood:8}; }},
        { label:'算了太伤感情', hint:'-😊', fn: g => { return{mood:-5}; }},
      ]},
    { id:'divorce_thought', icon:'💔', title:'离婚念头',
      body:'你第一次想到了离婚。\n\n不是因为出轨，不是因为家暴——只是因为……你们不再像以前那样了。\n\n你们不再聊天。不再一起吃饭。不再说「晚安」。甚至吵架都懒得吵了。\n\n你看着对方的背影，想：我们什么时候变成了这样？\n\n你知道：婚姻最大的杀手不是第三者——是冷漠。\n\n"离婚不是因为不爱了——是因为你们忘了怎么爱。"',
      cond: g => g.flags.married && g.age >= 30 && g.mood <= 45 && !g.flags.divorceThought,
      choices:[
        { label:'试着修复', hint:'+😊 +👥', fn: g => { g.flags.divorceThought=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+10); return{mood:8,social:5}; }},
        { label:'去做婚姻咨询', hint:'+😊 -💰', fn: g => { g.flags.divorceThought=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+15); return{mood:10,money:-2000}; }},
        { label:'也许真的该分开', hint:'-😊', fn: g => { g.flags.divorceThought=true; if(g.relationships) g.relationships.partner=Math.max(0,g.relationships.partner-15); return{mood:-15}; }},
      ]},
    { id:'child_decision', icon:'👶', title:'要不要生孩子',
      body:'你们讨论要不要孩子。\n\n你妈说：「趁年轻赶紧生！我还能帮你们带。」\n你对象说：「你觉得我们准备好了吗？」\n你的同事说：「千万别生！你会后悔的。」\n你的闺蜜说：「赶紧生！孩子太可爱了！」\n\n你算了一笔账：从怀孕到大学毕业，大约需要100万。\n你又算了一笔账：一个孩子给你带来的快乐——无法计算。\n\n"生不生孩子的决定，没有对错——只有你准备好承担哪一种后果。"',
      cond: g => g.flags.married && g.age >= 26 && g.age <= 40 && !g.flags.hasChild && !g.flags.childDecision,
      choices:[
        { label:'生！', hint:'+😊 +👨‍👩‍👧 -💰', fn: g => { g.flags.childDecision=true; g.flags.hasChild=true; return{mood:15,money:-20000}; }},
        { label:'再等等', hint:'', fn: g => { g.flags.childDecision=true; return{mood:3}; }},
        { label:'丁克', hint:'+💰 +😊', fn: g => { g.flags.childDecision=true; return{mood:5,money:5000}; }},
      ]},
    { id:'couple_travel', icon:'✈️', title:'情侣旅行',
      body:'你和对象第一次一起旅行。\n\n第一天：甜蜜到冒泡。你们在海边看日落，在小巷里接吻。\n第二天：开始吵架。为了去哪里吃、走哪条路、拍照姿势不好看。\n第三天：你们不说话。各走各的。\n第四天：你们和好了。因为你们发现：在一起的时候虽然吵，但不在一起的时候更想对方。\n\n"情侣旅行是关系最好的试金石——能一起旅行不吵架的人，能一起过一辈子。"',
      cond: g => g.flags.partnerName && !g.flags.coupleTravel,
      choices:[
        { label:'拍了很多照片', hint:'+✨ +😊', fn: g => { g.flags.coupleTravel=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+8); return{charm:5,mood:12,money:-3000}; }},
        { label:'吵了一架但和好了', hint:'+🧠 +👥', fn: g => { g.flags.coupleTravel=true; if(g.relationships) g.relationships.partner=Math.min(100,g.relationships.partner+5); return{intel:5,social:3,mood:5,money:-3000}; }},
        { label:'决定以后各玩各的', hint:'-👥', fn: g => { g.flags.coupleTravel=true; if(g.relationships) g.relationships.partner=Math.max(0,g.relationships.partner-5); return{mood:-8,money:-3000}; }},
      ]},
    // === v13.2 育儿故事 + 教育焦虑 + 鸡娃文化 ===
    { id:'chicken_baby_start', icon:'🐔', title:'鸡娃大战',
      body:'你有了孩子，然后你加入了家长群。\n\n群里消息99+：\n「我家小宝3岁已经会背唐诗300首」\n「我女儿5岁开始学编程」\n「我儿子6岁拿到了少儿英语比赛冠军」\n\n你看着正在吃手的自家娃，陷入了沉思。\n\n你老婆/老公说：「我们不能让孩子输在起跑线上。」\n你说：「起跑线在哪？」\n对方说：「在娘胎里。」\n\n"鸡娃的本质：用父母的焦虑，填满孩子的童年。"',
      cond: g => g.flags.hasChild && g.age >= 28 && !g.flags.chickenBaby,
      choices:[
        { label:'加入鸡娃大军', hint:'-💰 -😊', fn: g => { g.flags.chickenBaby=true; g.flags.tigerParent=true; return{mood:-10,money:-5000,intel:3}; }},
        { label:'佛系育儿', hint:'+😊 -🧠', fn: g => { g.flags.relaxedParenting=true; return{mood:8,intel:-2}; }},
        { label:'先观察一下', hint:'+🧠', fn: g => { return{intel:5,mood:-3}; }},
      ]},
    { id:'school_district_house_v2', icon:'🏫', title:'学区房',
      body:'孩子要上学了。你开始研究学区房。\n\n中介带你看了三套房：\n1. 老破小，60平，对口重点小学，价格800万\n2. 远大新，120平，对口普通小学，价格400万\n3. 租房，月租8000，可以上私立学校\n\n你算了一笔账：买学区房=20年房贷+生活质量断崖式下降。但如果不买，孩子就要"输在起跑线"。\n\n你老婆/老公说：「为了孩子，值得。」\n你爸说：「当年我们也没买学区房，你不也考上大学了？」\n\n"学区房：中国家长为爱买单的最昂贵证据。"',
      cond: g => g.flags.hasChild && g.age >= 30 && !g.flags.schoolDistrictHouse && g.money >= 50000,
      choices:[
        { label:'咬牙买学区房', hint:'-💰💰💰 +🧠', fn: g => { g.flags.schoolDistrictHouse=true; g.flags.mortgage=true; return{money:-200000,intel:5,mood:-10}; }},
        { label:'租房上私立', hint:'-💰 -🧠', fn: g => { g.flags.privateSchool=true; return{money:-30000,mood:-5}; }},
        { label:'就近入学算了', hint:'+😊', fn: g => { return{mood:5}; }},
      ]},
    { id:'extracurricular_war', icon:'🎨', title:'兴趣班大战',
      body:'周末，你的行程表：\n\n8:00-10:00 钢琴课\n10:30-12:00 奥数班\n14:00-16:00 英语外教\n16:30-18:00 跆拳道\n19:00-21:00 编程课\n\n你的孩子在车上睡着了。你看着ta疲惫的小脸，突然有点心疼。\n\n孩子醒来问：「爸爸/妈妈，我什么时候可以玩？」\n你说：「学完这些就可以玩了。」\n孩子说：「那我要学到几岁？」\n\n你沉默了。\n\n"兴趣班的真相：不是培养孩子的兴趣——是缓解家长的焦虑。"',
      cond: g => g.flags.hasChild && g.flags.chickenBaby && !g.flags.extracurricularWar,
      choices:[
        { label:'继续报班', hint:'-💰 -😊', fn: g => { g.flags.extracurricularWar=true; return{money:-8000,mood:-8}; }},
        { label:'减掉几个班', hint:'+😊 +👨‍👩‍👧', fn: g => { g.flags.extracurricularWar=true; g.flags.relaxedParenting=true; return{mood:10,social:5}; }},
        { label:'问问孩子想学什么', hint:'+🧠 +👨‍👩‍👧', fn: g => { g.flags.extracurricularWar=true; return{intel:5,social:3,mood:5}; }},
      ]},
    { id:'kindergarten_interview', icon:'🎒', title:'幼小衔接',
      body:'孩子要上小学了。你听说现在"幼小衔接"很重要，于是给孩子报了学前班。\n\n面试那天，老师问孩子：\n「1+1等于几？」\n孩子说：「2。」\n老师：「用英语怎么说？」\n孩子：「Two。」\n老师：「那1+2呢？」\n孩子哭了。\n\n你站在门外，突然意识到：这哪是面试孩子——这是在面试家长的钱包和焦虑程度。\n\n"幼小衔接：让孩子在6岁时就体验人生的第一次内卷。"',
      cond: g => g.flags.hasChild && g.age >= 32 && !g.flags.kindergartenInterview,
      choices:[
        { label:'报幼小衔接班', hint:'-💰', fn: g => { g.flags.kindergartenInterview=true; return{money:-5000,mood:-5}; }},
        { label:'让孩子快乐玩一年', hint:'+😊', fn: g => { g.flags.kindergartenInterview=true; g.flags.relaxedParenting=true; return{mood:8}; }},
        { label:'自己在家教', hint:'+🧠 -⏰', fn: g => { g.flags.kindergartenInterview=true; return{intel:5,mood:-3}; }},
      ]},
    { id:'parent_teacher_group', icon:'📱', title:'家长群风云',
      body:'你被拉进了班级家长群。\n\n第一天：\n老师：「请家长们配合完成作业打卡。」\n家长A：「收到！已完成！」\n家长B：「收到！已完成+额外练习！」\n家长C：「收到！已完成+额外练习+阅读打卡+运动打卡！」\n\n你看了看还没开始写作业的自家娃，默默发了条：「收到。」\n\n第三天：\n老师：「本周流动红旗获得者：xxx同学（家长C的孩子）」\n家长C发了个红包：「谢谢大家支持！」\n\n你退出了群聊（然后又默默加了回来）。\n\n"家长群：当代中国家长的精神内耗发源地。"',
      cond: g => g.flags.hasChild && g.age >= 33 && !g.flags.parentTeacherGroup,
      choices:[
        { label:'卷起来！', hint:'-😊 -⏰', fn: g => { g.flags.parentTeacherGroup=true; return{mood:-8,intel:3}; }},
        { label:'佛系应对', hint:'+😊', fn: g => { g.flags.parentTeacherGroup=true; g.flags.relaxedParenting=true; return{mood:5}; }},
        { label:'跟老师私下沟通', hint:'+👥', fn: g => { g.flags.parentTeacherGroup=true; return{social:5,intel:3}; }},
      ]},
    { id:'middle_school_exam', icon:'📝', title:'中考分流',
      body:'孩子初三了。班主任找你谈话：\n\n「您孩子成绩中等，考上普高的概率50%。如果考不上，就只能去职高了。」\n\n你问：「职高不好吗？」\n老师：「职高升学率低，就业选择少...」\n\n你回家看着孩子。ta正在画画，画得很好。但你知道：画画不能当饭吃（至少在中国）。\n\n你说：「最后一年，拼一把吧。」\n孩子说：「如果我考不上呢？」\n你说：「那就...再说吧。」\n\n"中考分流：15岁就决定人生方向——这合理吗？"',
      cond: g => g.flags.hasChild && g.age >= 38 && !g.flags.middleSchoolExam,
      choices:[
        { label:'请家教冲刺', hint:'-💰💰', fn: g => { g.flags.middleSchoolExam=true; g.flags.tigerParent=true; return{money:-15000,mood:-10,intel:3}; }},
        { label:'尊重孩子选择', hint:'+😊 +👨‍👩‍👧', fn: g => { g.flags.middleSchoolExam=true; g.flags.relaxedParenting=true; return{mood:8,social:5}; }},
        { label:'研究职业教育', hint:'+🧠', fn: g => { g.flags.middleSchoolExam=true; return{intel:8,mood:-3}; }},
      ]},
    { id:'study_abroad_dream', icon:'✈️', title:'留学梦',
      body:'你的孩子成绩不错。有人说：「考虑送孩子出国吗？」\n\n你算了一笔账：\n- 美国本科4年：200万\n- 英国本科3年：150万\n- 澳洲本科3年：120万\n- 国内985大学4年：20万\n\n你问孩子：「想出国吗？」\n孩子说：「想！我想去看看外面的世界。」\n\n你看了看存款，又看了看孩子期待的眼神。\n\n你说：「爸爸/妈妈支持你。」（内心：我的退休金没了）\n\n"留学：用父母的积蓄，换孩子的视野——值不值得，20年后才知道。"',
      cond: g => g.flags.hasChild && g.age >= 40 && g.money >= 100000 && !g.flags.studyAbroad,
      choices:[
        { label:'送孩子出国', hint:'-💰💰💰 +👨‍👩‍👧', fn: g => { g.flags.studyAbroad=true; return{money:-150000,mood:5,social:5}; }},
        { label:'国内读研也行', hint:'+💰', fn: g => { g.flags.domesticGrad=true; return{money:10000,mood:-3}; }},
        { label:'让孩子自己决定', hint:'+🧠', fn: g => { g.flags.childIndependence=true; return{intel:5,mood:3}; }},
      ]},
    { id:'ai_homework', icon:'🤖', title:'AI写作业',
      body:'你发现孩子的作文写得特别好。仔细一看——是AI写的。\n\n你问孩子：「这是你写的吗？」\n孩子：「我用ChatGPT帮忙润色了一下...」\n你：「润色？这整篇都是AI写的吧？」\n孩子：「可是老师说要用科技工具辅助学习啊...」\n\n你突然意识到：你花了几十万让孩子学奥数、学英语、学编程——结果AI把这些都学会了。\n\n你的孩子最需要学的，可能是：如何跟AI共存。\n\n"AI时代的教育：不是教孩子比AI强——是教孩子用AI。"',
      cond: g => g.flags.hasChild && g.age >= 35 && !g.flags.aiHomework,
      choices:[
        { label:'禁止使用AI', hint:'-🧠', fn: g => { g.flags.aiHomework=true; return{intel:-3,mood:-5}; }},
        { label:'教孩子正确使用AI', hint:'+🧠 +😊', fn: g => { g.flags.aiHomework=true; g.flags.aiEducation=true; return{intel:10,mood:5}; }},
        { label:'跟老师反映', hint:'+👥', fn: g => { g.flags.aiHomework=true; return{social:5}; }},
      ]},
    { id:'teen_depression', icon:'😔', title:'青少年心理健康',
      body:'孩子的班主任打电话来：\n\n「您孩子最近上课总是走神，作业也不交了。我们怀疑可能有心理问题...」\n\n你跟孩子谈话。孩子说：「我觉得活着没意思。每天都在学习、考试、排名...我像个机器。」\n\n你突然意识到：你给孩子报了那么多班，却从来没问过ta开不开心。\n\n你说：「对不起。」\n孩子哭了：「爸爸/妈妈，我好累。」\n\n"青少年抑郁：不是孩子太脆弱——是我们给的压力太大。"',
      cond: g => g.flags.hasChild && g.flags.chickenBaby && g.age >= 36 && !g.flags.teenDepression,
      choices:[
        { label:'带孩子看心理医生', hint:'-💰 +😊', fn: g => { g.flags.teenDepression=true; g.flags.relaxedParenting=true; return{money:-3000,mood:10,social:5}; }},
        { label:'减少课外班', hint:'+😊 +👨‍👩‍👧', fn: g => { g.flags.teenDepression=true; g.flags.relaxedParenting=true; return{mood:12,social:8}; }},
        { label:'觉得孩子矫情', hint:'-👨‍👩‍👧', fn: g => { g.flags.teenDepression=true; return{mood:-15,social:-10}; }},
      ]},
    { id:'parenting_anxiety', icon:'😰', title:'育儿焦虑',
      body:'你在小红书上刷到了这些帖子：\n\n「3岁背唐诗300首，5岁编程，7岁拿奖...」\n「我是如何把孩子培养成天才的」\n「不鸡娃的家长，后来都后悔了」\n\n你看了看正在玩泥巴的自家娃，突然焦虑了。\n\n你老婆/老公说：「别看了，每个孩子都不一样。」\n你说：「可是万一我们耽误了孩子呢？」\n对方说：「我们最大的耽误，就是让孩子活在我们的焦虑里。」\n\n"育儿焦虑的根源：不是孩子不够好——是家长不够自信。"',
      cond: g => g.flags.hasChild && g.age >= 30 && !g.flags.parentingAnxiety,
      choices:[
        { label:'继续刷小红书', hint:'-😊', fn: g => { g.flags.parentingAnxiety=true; return{mood:-10}; }},
        { label:'卸载小红书', hint:'+😊', fn: g => { g.flags.parentingAnxiety=true; g.flags.digitalDetox=true; return{mood:8}; }},
        { label:'跟其他家长聊聊', hint:'+👥 +🧠', fn: g => { g.flags.parentingAnxiety=true; return{social:8,intel:5,mood:3}; }},
      ]},
    // === v13.3 中年危机 + 二次创业 + 人生下半场 ===
    { id:'midlife_crisis_35', icon:'😰', title:'35岁危机',
      body:'你35岁了。\n\n朋友圈里，有人已经财务自由，有人当了高管，有人创业成功。而你，还在为房贷发愁，还在加班到深夜，还在被领导骂。\n\n你看着镜子里的自己：发际线后移了，肚子起来了，眼神疲惫了。\n\n你问自己：「这就是我的人生吗？」\n\n你老婆/老公说：「你已经很好了。」\n你说：「可是我还想要更多。」\n\n"35岁危机不是年龄的问题——是期望与现实差距的问题。"',
      cond: g => g.age >= 35 && g.age <= 40 && !g.flags.midlifeCrisis35,
      choices:[
        { label:'接受现实', hint:'+😊 +🧠', fn: g => { g.flags.midlifeCrisis35=true; g.flags.lifePhilosophy=true; return{mood:8,intel:10}; }},
        { label:'辞职创业', hint:'-💰 +✨', fn: g => { g.flags.midlifeCrisis35=true; g.flags.secondStartup=true; return{money:-20000,mood:5,charm:5}; }},
        { label:'学新技能', hint:'+🧠 -⏰', fn: g => { g.flags.midlifeCrisis35=true; g.flags.midlifeLearning=true; return{intel:15,mood:-3}; }},
      ]},
    { id:'second_startup', icon:'🚀', title:'二次创业',
      body:'你辞职了，开始了第二次创业。\n\n这次你选择了自己真正想做的事：开一家咖啡馆/做自媒体/开网店/做咨询。\n\n你的启动资金是你所有的存款：15万。你老婆/老公说：「我支持你。」\n\n第一个月：收入0。\n第二个月：收入500。\n第三个月：收入2000。\n\n你开始怀疑自己。但你的孩子说：「爸爸/妈妈加油！」\n\n你说：「好。」\n\n"二次创业：不是因为你不怕失败——是因为你更怕后悔。"',
      cond: g => g.flags.secondStartup && g.age >= 36 && !g.flags.secondStartupDone,
      choices:[
        { label:'坚持！', hint:'+✨ -😊', fn: g => { g.flags.secondStartupDone=true; g.flags.entrepreneur=true; return{charm:10,mood:-8,money:-5000}; }},
        { label:'及时止损', hint:'+💰 -✨', fn: g => { g.flags.secondStartupDone=true; return{money:5000,mood:-10}; }},
        { label:'找人合伙', hint:'+👥', fn: g => { g.flags.secondStartupDone=true; g.flags.entrepreneur=true; return{social:10,mood:3}; }},
      ]},
    { id:'health_crisis_40', icon:'🏥', title:'40岁体检',
      body:'你40岁了，去做了一次全面体检。\n\n报告出来了：\n- 血压偏高\n- 血脂偏高\n- 肝功能异常\n- 颈椎C5-C6突出\n- 轻度脂肪肝\n- 视力下降\n\n医生看着你说：「你这个年纪，这些指标...要注意了。」\n\n你问：「我还能活多久？」\n医生：「看你怎么活。」\n\n你看着体检报告，突然意识到：你用了20年拿命换钱，现在要用钱换命了。\n\n"40岁是人生的分水岭：之前是拼搏，之后是保养。"',
      cond: g => g.age >= 40 && !g.flags.healthCrisis40,
      choices:[
        { label:'开始养生', hint:'+💪 +😊', fn: g => { g.flags.healthCrisis40=true; g.flags.wellnessMode=true; return{health:15,mood:10,money:-3000}; }},
        { label:'继续拼命', hint:'-💪 +💰', fn: g => { g.flags.healthCrisis40=true; return{health:-10,money:5000,mood:-8}; }},
        { label:'买保险', hint:'-💰 +🧠', fn: g => { g.flags.healthCrisis40=true; g.flags.hasInsurance=true; return{money:-8000,intel:5}; }},
      ]},
    { id:'empty_nest_syndrome', icon:'🪺', title:'空巢',
      body:'你的孩子上大学了，离开了家。\n\n你站在孩子的房间里，看着空荡荡的床、墙上贴满的海报、书架上摆满的课本。\n\n你突然觉得心里空了一块。\n\n你老婆/老公说：「孩子长大了，该飞了。」\n你说：「可是我还不想放手。」\n\n你给孩子发微信：「在学校还好吗？」\n孩子回：「挺好的，别担心。」（附带一张和朋友聚餐的照片）\n\n你看着照片，笑了，也哭了。\n\n"空巢不是失去——是放手。放手让孩子飞，也让自己重新活一次。"',
      cond: g => g.flags.hasChild && g.age >= 45 && !g.flags.emptyNest,
      choices:[
        { label:'重新找回自己', hint:'+😊 +✨', fn: g => { g.flags.emptyNest=true; g.flags.secondYouth=true; return{mood:12,charm:8}; }},
        { label:'每天给孩子打电话', hint:'-😊 -👨‍👩‍👧', fn: g => { g.flags.emptyNest=true; return{mood:-10,social:-5}; }},
        { label:'养只宠物', hint:'+😊 +💪', fn: g => { g.flags.emptyNest=true; g.flags.hasPet=true; return{mood:10,health:5}; }},
      ]},
    { id:'career_pivot_40', icon:'🔄', title:'40岁转行',
      body:'你40岁了，决定转行。\n\n你的同事说：「你疯了吗？这个年纪还转行？」\n你的领导说：「你在这里干了10年，说走就走？」\n你的父母说：「稳定点不好吗？」\n\n但你知道：你不想在50岁的时候还在做一份不喜欢的工作。\n\n你辞了职，去学了烘焙/编程/设计/心理咨询。\n\n你的新同事比你小15岁。你成了班里年纪最大的学生。\n\n你说：「学习不分年龄。」\n\n"40岁转行：不是因为你不行——是因为你终于敢了。"',
      cond: g => g.age >= 40 && g.jobSalary >= 15000 && !g.flags.careerPivot40,
      choices:[
        { label:'勇敢转行', hint:'+✨ -💰', fn: g => { g.flags.careerPivot40=true; g.flags.careerChange=true; return{charm:10,money:-10000,mood:5}; }},
        { label:'先兼职试试', hint:'+🧠 +💰', fn: g => { g.flags.careerPivot40=true; g.flags.sideHustle=true; return{intel:8,money:3000}; }},
        { label:'算了不折腾了', hint:'+😊', fn: g => { g.flags.careerPivot40=true; return{mood:3}; }},
      ]},
    { id:'retirement_countdown_real', icon:'🧓', title:'退休倒计时',
      body:'你算了一下：距离退休还有15年。\n\n你的存款：20万。\n你的养老金：每月3000。\n你的房贷：还有10年。\n\n你打开计算器：如果要维持现在的生活水平，你需要300万退休金。\n\n你看着存款，叹了口气。\n\n你老婆/老公说：「我们可以降低生活标准。」\n你说：「可是我不想降低。」\n\n你开始研究：基金定投、养老保险、以房养老、延迟退休。\n\n"退休规划：不是老了才想——是现在就要开始。"',
      cond: g => g.age >= 45 && !g.flags.retirementCountdownReal,
      choices:[
        { label:'开始存钱', hint:'+💰 -😊', fn: g => { g.flags.retirementCountdownReal=true; return{money:10000,mood:-5,intel:5}; }},
        { label:'投资理财', hint:'+🧠 +💰', fn: g => { g.flags.retirementCountdownReal=true; g.flags.hasInvestment=true; return{intel:10,money:5000}; }},
        { label:'活在当下', hint:'+😊 -💰', fn: g => { g.flags.retirementCountdownReal=true; return{mood:10,money:-5000}; }},
      ]},
    { id:'parent_aging_care', icon:'👴', title:'父母养老',
      body:'你爸/妈打电话来：「最近身体不太好...」\n\n你问：「怎么了？」\n对方说：「没事，就是老了。」\n\n你回家看他们。你发现：他们的头发全白了，背驼了，走路慢了。\n\n你妈说：「你忙你的，不用管我们。」\n你爸说：「我们还能照顾自己。」\n\n但你知道：他们需要你。就像你小时候需要他们一样。\n\n你说：「我带你们去体检。」\n\n"父母养老：你长大了，他们老了。这是生命的轮回，也是爱的传承。"',
      cond: g => g.age >= 40 && !g.flags.parentAgingCare,
      choices:[
        { label:'接父母来城里', hint:'-💰 +👨‍👩‍👧', fn: g => { g.flags.parentAgingCare=true; return{money:-10000,mood:8,social:5}; }},
        { label:'每月寄钱回去', hint:'-💰 +😊', fn: g => { g.flags.parentAgingCare=true; return{money:-3000,mood:5}; }},
        { label:'每周视频电话', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.parentAgingCare=true; return{mood:8,social:3}; }},
      ]},
    { id:'midlife_marriage_crisis', icon:'💔', title:'中年婚姻危机',
      body:'你和老婆/老公结婚15年了。\n\n你们不再吵架了——因为没什么好吵的了。你们也不再说话了——因为没什么好说的了。\n\n你们像两个室友：各忙各的，各睡各的，各吃各的。\n\n你问自己：「这就是婚姻吗？」\n\n你的同事离婚了，说：「解脱了。」\n你的朋友也离婚了，说：「后悔了。」\n\n你不知道该怎么办。但你知道：你们需要谈谈了。\n\n"中年婚姻危机：不是不爱了——是忘了怎么爱。"',
      cond: g => g.flags.married && g.age >= 40 && !g.flags.midlifeMarriageCrisis,
      choices:[
        { label:'找婚姻咨询师', hint:'-💰 +👥', fn: g => { g.flags.midlifeMarriageCrisis=true; return{money:-3000,social:8,mood:5}; }},
        { label:'重新约会', hint:'+😊 +✨', fn: g => { g.flags.midlifeMarriageCrisis=true; return{mood:10,charm:5}; }},
        { label:'考虑离婚', hint:'-👥 +😊', fn: g => { g.flags.midlifeMarriageCrisis=true; g.flags.divorced=true; return{mood:5,social:-10,money:-20000}; }},
      ]},
    { id:'legacy_thinking', icon:'🌟', title:'人生遗产',
      body:'你45岁了，开始思考：「我这一生，留下了什么？」\n\n你看着自己的孩子：ta长大了，有了自己的想法和生活。\n你看着自己的工作：做了10年，好像也没什么特别的成就。\n你看着自己的存款：不多不少，刚好够活着。\n\n你问自己：「如果我现在死了，有人会记得我吗？」\n\n你的朋友说：「你会被记得，因为你是一个好人。」\n你说：「好人不应该只是好人——应该做点什么。」\n\n"人生遗产：不是你拥有多少——是你给予多少。"',
      cond: g => g.age >= 45 && !g.flags.legacyThinking,
      choices:[
        { label:'开始做志愿者', hint:'+👥 +😊', fn: g => { g.flags.legacyThinking=true; g.flags.regularVolunteer=true; return{social:15,mood:12}; }},
        { label:'写回忆录', hint:'+🧠 +✨', fn: g => { g.flags.legacyThinking=true; return{intel:10,charm:8,mood:5}; }},
        { label:'继续现在的生活', hint:'+😊', fn: g => { g.flags.legacyThinking=true; return{mood:3}; }},
      ]},
    { id:'second_youth', icon:'🌸', title:'第二春',
      body:'你45岁了，突然觉得自己又年轻了。\n\n孩子上大学了，房贷快还完了，工作稳定了。你终于有了时间和自由。\n\n你开始做以前没时间做的事：学画画、学吉他、去旅行、去跑步。\n\n你跑了第一个半程马拉松。你画了第一幅油画。你去了第一个一直想去的地方。\n\n你老婆/老公说：「你变了。」\n你说：「我没变——我只是找回了自己。」\n\n"第二春：不是老了——是终于有时间活给自己了。"',
      cond: g => g.age >= 45 && g.flags.emptyNest && !g.flags.secondYouthDone,
      choices:[
        { label:'活出精彩！', hint:'+😊 +✨ +💪', fn: g => { g.flags.secondYouthDone=true; return{mood:15,charm:10,health:10}; }},
        { label:'帮助年轻人', hint:'+👥 +🧠', fn: g => { g.flags.secondYouthDone=true; g.flags.mentor=true; return{social:12,intel:8,mood:8}; }},
        { label:'享受生活', hint:'+😊', fn: g => { g.flags.secondYouthDone=true; return{mood:12}; }},
      ]},
    // === v14.0 数字生活 + 社交媒体 + 都市新现象 ===
    { id:'digital_detox_week', icon:'📵', title:'数字断联一周',
      body:'你决定做一件疯狂的事：断网一周。\n\n第一天：你焦虑得睡不着觉，每隔5分钟就摸口袋。\n第二天：你发现原来地铁上的人都在看手机，只有你在发呆。\n第三天：你开始看书了。一本一直没看完的书，三天看完了。\n第七天：你觉得世界变安静了，你的脑子也变清楚了。\n\n你重新上网，发现：99%的消息其实不重要。\n\n"数字断联：不是与世界断联——是与自己重新连接。"',
      cond: g => g.age >= 25 && !g.flags.digitalDetoxWeek,
      choices:[
        { label:'坚持一周！', hint:'+🧠 +😊', fn: g => { g.flags.digitalDetoxWeek=true; g.flags.digitalDetox=true; return{intel:12,mood:15,health:5}; }},
        { label:'半天就放弃了', hint:'-🧠', fn: g => { g.flags.digitalDetoxWeek=true; return{intel:-3,mood:-5}; }},
        { label:'改为每天断联2小时', hint:'+😊 +💪', fn: g => { g.flags.digitalDetoxWeek=true; return{mood:8,health:3}; }},
      ]},
    { id:'social_media_addiction_v2', icon:'📱', title:'社交媒体成瘾',
      body:'你算了一下自己每天的手机使用时间：8小时。\n\n其中：刷抖音3小时、刷微博2小时、刷朋友圈1.5小时、刷小红书1小时、回复消息0.5小时。\n\n你惊了：你把一天1/3的时间花在了看别人的生活上。\n\n你尝试把手机放一边，但5分钟后你又拿起来了。\n\n你说：「我只是看一眼时间。」然后你又刷了1小时。\n\n"社交媒体：你以为你在消磨时间，其实时间在消磨你。"',
      cond: g => g.age >= 22 && !g.flags.socialMediaAddiction,
      choices:[
        { label:'卸载所有App', hint:'+🧠 +😊', fn: g => { g.flags.socialMediaAddiction=true; g.flags.digitalDetox=true; return{intel:10,mood:12}; }},
        { label:'设置使用时间限制', hint:'+🧠', fn: g => { g.flags.socialMediaAddiction=true; g.flags.screenTimeLimit=true; return{intel:8,mood:5}; }},
        { label:'算了，继续刷', hint:'-🧠 -😊', fn: g => { g.flags.socialMediaAddiction=true; return{intel:-5,mood:-8}; }},
      ]},
    { id:'online_shopping_addiction_v2', icon:'🛒', title:'网购成瘾',
      body:'你打开了淘宝，本来只想买一包纸巾。\n\n2小时后，你的购物车里有：衣服3件、鞋子2双、零食1箱、小家电5件。\n\n总计：3000块。\n\n你看了看余额，又看了看购物车。你删掉了4件，留了1件——那件你其实不需要的「智能按摩仪」。\n\n你安慰自己：「我工作这么辛苦，应该犒劳一下自己。」\n\n"网购的真相：你买的不是商品——是多巴胺。"',
      cond: g => g.age >= 22 && !g.flags.onlineShoppingAddiction,
      choices:[
        { label:'清空购物车', hint:'-💰 -💰', fn: g => { g.flags.onlineShoppingAddiction=true; return{money:-3000,mood:8,charm:3}; }},
        { label:'只买纸巾', hint:'+💰 +🧠', fn: g => { g.flags.onlineShoppingAddiction=true; g.flags.minimalist=true; return{money:-30,intel:5,mood:3}; }},
        { label:'卸载淘宝', hint:'+💰 +😊', fn: g => { g.flags.onlineShoppingAddiction=true; g.flags.digitalDetox=true; return{money:0,mood:10}; }},
      ]},
    { id:'livestream_shopping_v2', icon:'📺', title:'直播带货',
      body:'你打开了直播间，主播正在卖一款「限时特价」的面膜。\n\n「家人们！原价299，今天只要99！还买一送一！最后100单！」\n\n你的手指已经点到了「立即购买」。你的理智说：「你不需要面膜。」\n\n但主播说：「不买就是不爱自己！」\n\n你买了3盒。到货后你发现：你根本不知道怎么用。\n\n"直播带货：你以为你在省钱，其实你在花钱买焦虑。"',
      cond: g => g.age >= 23 && !g.flags.livestreamShopping,
      choices:[
        { label:'买买买！', hint:'-💰 +😊', fn: g => { g.flags.livestreamShopping=true; return{money:-500,mood:5,charm:3}; }},
        { label:'理性消费', hint:'+🧠 +💰', fn: g => { g.flags.livestreamShopping=true; return{intel:8,mood:-3}; }},
        { label:'退出直播间', hint:'+💰', fn: g => { g.flags.livestreamShopping=true; return{mood:3}; }},
      ]},
    { id:'remote_work_life', icon:'💻', title:'远程办公',
      body:'你的公司开始允许远程办公了。\n\n第一周：你觉得这是天堂。不用通勤、不用穿正装、可以随时撸猫。\n第二周：你发现你的工作时间变成了24小时。领导随时发消息，你随时要回复。\n第三周：你开始怀念办公室了——至少在那里，下班就是下班。\n\n你说：「远程办公不是自由——是把办公室搬到了家里。」\n\n"远程办公的真相：你以为你在家里工作，其实你在家里生活。"',
      cond: g => g.age >= 25 && g.jobSalary >= 10000 && !g.flags.remoteWork,
      choices:[
        { label:'享受自由！', hint:'+😊 +💪', fn: g => { g.flags.remoteWork=true; return{mood:10,health:5}; }},
        { label:'设定工作边界', hint:'+🧠 +😊', fn: g => { g.flags.remoteWork=true; g.flags.workLifeBalance=true; return{intel:8,mood:8}; }},
        { label:'申请回办公室', hint:'+👥', fn: g => { g.flags.remoteWork=true; return{social:10,mood:-3}; }},
      ]},
    { id:'food_delivery_addiction', icon:'🍱', title:'外卖依赖',
      body:'你算了一下：这个月你点了25次外卖。\n\n你打开外卖App，你的「常点」列表有15家店。你闭着眼睛都能背出菜单。\n\n你尝试自己做饭，结果：厨房差点着火，做出来的东西连狗都不吃。\n\n你说：「外卖是我的命。」你的胃说：「不是。」\n\n"外卖依赖：你不是不会做饭——你是懒得做饭。（其实也是不会）"',
      cond: g => g.age >= 22 && !g.flags.foodDeliveryAddiction,
      choices:[
        { label:'学做饭！', hint:'+💪 +😊', fn: g => { g.flags.foodDeliveryAddiction=true; g.flags.cookingSkill=true; return{health:10,mood:8,money:2000}; }},
        { label:'继续点外卖', hint:'-💪 -💰', fn: g => { g.flags.foodDeliveryAddiction=true; return{health:-8,mood:-5,money:-1500}; }},
        { label:'一周只做一次', hint:'+💪 +🧠', fn: g => { g.flags.foodDeliveryAddiction=true; return{health:5,intel:3,mood:5}; }},
      ]},
    { id:'subscription_fatigue', icon:'💳', title:'订阅疲劳',
      body:'你查了一下银行卡账单，发现每月自动扣款：\n\n- 视频会员：30元\n- 音乐会员：15元\n- 云存储：20元\n- 健身App：50元\n- 知识付费：99元\n- 外卖会员：15元\n\n总计：229元/月。一年2748元。\n\n你发现：你80%的订阅根本没用过。那个健身App你已经3个月没打开了。\n\n你取消了5个订阅。你觉得：这是你今年最成功的「理财」。\n\n"订阅经济：你以为你在省钱，其实你在为懒惰付费。"',
      cond: g => g.age >= 23 && !g.flags.subscriptionFatigue,
      choices:[
        { label:'取消所有订阅', hint:'+💰 +🧠', fn: g => { g.flags.subscriptionFatigue=true; g.flags.minimalist=true; return{money:2748,intel:5,mood:8}; }},
        { label:'只保留常用的', hint:'+💰', fn: g => { g.flags.subscriptionFatigue=true; return{money:1500,mood:5}; }},
        { label:'算了，懒得取消', hint:'-💰', fn: g => { g.flags.subscriptionFatigue=true; return{money:-500,mood:-3}; }},
      ]},
    { id:'urban_gardening', icon:'🌱', title:'阳台种菜',
      body:'你在阳台上种了小番茄、辣椒、生菜。\n\n每天你都会去看看它们长高了没。你给它们浇水、施肥、除虫。\n\n3个月后，你收获了第一颗小番茄。你咬了一口——酸得你皱眉头。\n\n但你觉得：这是你吃过最好吃的番茄。因为它是你自己种的。\n\n你发了朋友圈：「都市农夫的日常。」收获了50个赞。\n\n"阳台种菜：不是为了省钱——是为了在城市里找到一点泥土的感觉。"',
      cond: g => g.age >= 25 && !g.flags.urbanGardening,
      choices:[
        { label:'扩大种植规模', hint:'+😊 +💪', fn: g => { g.flags.urbanGardening=true; return{mood:12,health:5,money:-200}; }},
        { label:'只种一盆薄荷', hint:'+😊', fn: g => { g.flags.urbanGardening=true; return{mood:8}; }},
        { label:'放弃（养死了）', hint:'-😊', fn: g => { g.flags.urbanGardening=true; return{mood:-5}; }},
      ]},
    { id:'podcast_listener', icon:'🎧', title:'播客听众',
      body:'你开始听播客了。\n\n上班路上听、做饭时听、跑步时听、睡前听。你听了100+档播客，从科技到人文，从商业到心理。\n\n你发现：原来世界上有这么多聪明人在思考你没想过的问题。\n\n你开始在朋友面前「掉书袋」了。你的朋友说：「你最近怎么说话像知乎？」\n\n你说：「因为我真的在知乎（播客）上学到东西了。」\n\n"播客：让你在碎片时间里，做完整的思考。"',
      cond: g => g.age >= 25 && !g.flags.podcastListener,
      choices:[
        { label:'每天听2小时', hint:'+🧠 +😊', fn: g => { g.flags.podcastListener=true; return{intel:15,mood:8}; }},
        { label:'只听感兴趣的', hint:'+🧠', fn: g => { g.flags.podcastListener=true; return{intel:10,mood:5}; }},
        { label:'听了几期就放弃了', hint:'', fn: g => { g.flags.podcastListener=true; return{intel:3}; }},
      ]},
    { id:'urban_exploration', icon:'🗺️', title:'城市探险',
      body:'你开始了一种新的爱好：城市探险。\n\n你去了废弃的工厂、老旧的胡同、隐藏的咖啡馆、没人知道的小公园。\n\n你发现：你住了5年的城市，你其实只了解了10%。\n\n你拍了很多照片，写了一本《我的城市探险日记》。虽然只有你妈看了。\n\n你说：「城市探险让我重新爱上了这座城市。」\n\n"城市探险：不是去远方——是发现身边被忽略的美。"',
      cond: g => g.age >= 24 && !g.flags.urbanExploration,
      choices:[
        { label:'每周探险一次', hint:'+😊 +✨ +💪', fn: g => { g.flags.urbanExploration=true; g.flags.cityWalk=true; return{mood:15,charm:8,health:5}; }},
        { label:'偶尔去一次', hint:'+😊', fn: g => { g.flags.urbanExploration=true; return{mood:8,charm:3}; }},
        { label:'太累了不去', hint:'-😊', fn: g => { g.flags.urbanExploration=true; return{mood:-3}; }},
      ]},
    // === v14.1 城乡差异 + 返乡创业 + 小城生活 ===
    { id:'hometown_return_thought', icon:'🏡', title:'返乡念头',
      body:'你在加班到凌晨2点后，突然冒出一个念头：回老家吧。\n\n你算了一笔账：\n- 大城市：月薪2万，房租5000，通勤2小时，加班到深夜\n- 老家：月薪5000，住家里，通勤10分钟，朝九晚五\n\n你妈在电话里说：「回来吧，家里什么都好。」\n你的同事说：「别傻了，回去了就再也回不来了。」\n\n你站在出租屋的窗前，看着城市的夜景。你想：这里灯火通明——但没有一盏灯是我的。\n\n"返乡的念头：不是因为你不行——是因为你累了。"',
      cond: g => g.age >= 28 && g.months >= 36 && !g.flags.hometownReturnThought,
      choices:[
        { label:'辞职回老家', hint:'+😊 -💰', fn: g => { g.flags.hometownReturnThought=true; g.flags.returnedHometown=true; return{mood:15,money:-10000}; }},
        { label:'再坚持一下', hint:'+💰 -😊', fn: g => { g.flags.hometownReturnThought=true; return{money:5000,mood:-8}; }},
        { label:'先回去看看', hint:'+🧠', fn: g => { g.flags.hometownReturnThought=true; g.flags.hometownVisit=true; return{intel:5,mood:5}; }},
      ]},
    { id:'small_town_life', icon:'🏘️', title:'小城生活',
      body:'你回到了老家——一个四线小城。\n\n第一天：你觉得好安静，空气好新鲜。\n第一周：你发现外卖选择只有10家，电影院只有1家，咖啡馆只有2家。\n第一月：你开始怀念大城市的便利了。\n\n但你也发现：你的睡眠质量变好了，你的焦虑减少了，你开始有时间看书了。\n\n你的高中同学说：「欢迎回来，我们这里也有奶茶。」\n\n"小城生活：不是退步——是换一种活法。"',
      cond: g => g.flags.returnedHometown && !g.flags.smallTownLife,
      choices:[
        { label:'享受慢节奏', hint:'+😊 +💪', fn: g => { g.flags.smallTownLife=true; return{mood:12,health:10}; }},
        { label:'开始创业', hint:'+💰 +✨', fn: g => { g.flags.smallTownLife=true; g.flags.hometownEntrepreneur=true; return{money:10000,charm:8,mood:5}; }},
        { label:'准备回大城市', hint:'+💰 -😊', fn: g => { g.flags.smallTownLife=true; return{money:3000,mood:-10}; }},
      ]},
    { id:'county_economy', icon:'🏪', title:'县城经济',
      body:'你在县城开了一家店：奶茶店/咖啡馆/花店/书店。\n\n你的顾客大多是：高中生、带娃的宝妈、退休的大爷大妈。\n\n你的月收入：8000。比大城市少了一半，但你的支出也少了一半。\n\n你的高中同学来捧场，说：「你这是降维打击。」\n你说：「我这是降维生活。」\n\n"县城经济：不是没有机会——是机会不一样。"',
      cond: g => g.flags.hometownEntrepreneur && !g.flags.countyEconomy,
      choices:[
        { label:'扩大规模', hint:'+💰 +✨', fn: g => { g.flags.countyEconomy=true; return{money:15000,charm:10}; }},
        { label:'维持现状', hint:'+😊', fn: g => { g.flags.countyEconomy=true; return{mood:8}; }},
        { label:'转手店铺', hint:'+💰', fn: g => { g.flags.countyEconomy=true; return{money:20000,mood:-5}; }},
      ]},
    { id:'small_town_social', icon:'🍻', title:'小城社交',
      body:'在小城，你的社交圈变了。\n\n以前在大城市：同事、同行、网友。\n现在在小城：高中同学、邻居、亲戚。\n\n你每周都要参加饭局：同学聚会、亲戚聚餐、邻居婚礼。你喝了很多酒，说了很多客套话。\n\n你开始怀念大城市的「边界感」了——在那里，没人管你几点回家、有没有对象、赚多少钱。\n\n"小城社交：不是更亲近——是没有距离。"',
      cond: g => g.flags.smallTownLife && !g.flags.smallTownSocial,
      choices:[
        { label:'融入当地圈子', hint:'+👥 +😊', fn: g => { g.flags.smallTownSocial=true; return{social:15,mood:8}; }},
        { label:'保持独立', hint:'+🧠 -👥', fn: g => { g.flags.smallTownSocial=true; return{intel:8,social:-5,mood:3}; }},
        { label:'开一个读书会', hint:'+🧠 +👥', fn: g => { g.flags.smallTownSocial=true; return{intel:10,social:8,mood:5}; }},
      ]},
    { id:'urban_rural_gap', icon:'📊', title:'城乡差距',
      body:'你在老家待了半年，深刻感受到了城乡差距：\n\n- 医疗：县城医院看不了的病，要去省城\n- 教育：县城最好的学校，不如大城市的普通学校\n- 就业：除了公务员和老师，好工作几乎没有\n- 娱乐：电影院只有1家，KTV只有2家\n\n但你也发现：县城的人更快乐、更知足、更有人情味。\n\n你的邻居阿姨说：「你们在大城市累不累啊？」\n你说：「累。」\n她笑了：「那就回来嘛。」\n\n"城乡差距：不是哪个好哪个坏——是选择不同的人生。"',
      cond: g => g.flags.smallTownLife && g.age >= 30 && !g.flags.urbanRuralGap,
      choices:[
        { label:'留在小城改变它', hint:'+✨ +👥', fn: g => { g.flags.urbanRuralGap=true; return{charm:10,social:8,mood:5}; }},
        { label:'接受差距享受生活', hint:'+😊 +🧠', fn: g => { g.flags.urbanRuralGap=true; return{mood:10,intel:8}; }},
        { label:'计划回大城市', hint:'+💰', fn: g => { g.flags.urbanRuralGap=true; return{money:5000,mood:-5}; }},
      ]},
    { id:'hometown_food_v2', icon:'🍜', title:'家乡味道',
      body:'你终于吃到了正宗的家乡菜。\n\n你妈做的红烧肉、你爸炒的小菜、街角那家开了30年的面馆。\n\n你吃了三碗饭，打了个饱嗝，说：「这才是人吃的。」\n\n你想起了在大城市吃的那些外卖：标准化的味道、冰冷的温度、塑料的包装。\n\n你说：「家乡的味道，是任何米其林餐厅都做不出来的。」\n\n"家乡味道：不是食物好吃——是有人在等你回家吃饭。"',
      cond: g => g.flags.returnedHometown && !g.flags.hometownFoodTaste,
      choices:[
        { label:'学做家乡菜', hint:'+💪 +😊', fn: g => { g.flags.hometownFoodTaste=true; g.flags.cookingSkill=true; return{health:8,mood:12}; }},
        { label:'每天回家吃饭', hint:'+👨‍👩‍👧 +😊', fn: g => { g.flags.hometownFoodTaste=true; return{mood:15,social:5}; }},
        { label:'拍了发朋友圈', hint:'+✨', fn: g => { g.flags.hometownFoodTaste=true; return{charm:5,mood:8}; }},
      ]},
    { id:'small_town_entertainment', icon:'🎤', title:'小城娱乐',
      body:'在小城，你的娱乐方式变了：\n\n- 以前：看展、听音乐会、参加沙龙\n- 现在：打麻将、唱KTV、逛夜市\n\n你第一次打麻将，输了200块。你的邻居说：「交学费了。」\n你第一次唱KTV，发现你的歌单都是10年前的老歌。\n你第一次逛夜市，发现这里的小吃比大城市好吃还便宜。\n\n你说：「原来快乐可以这么简单。」\n\n"小城娱乐：不是低级——是接地气。"',
      cond: g => g.flags.smallTownLife && !g.flags.smallTownEntertainment,
      choices:[
        { label:'学会打麻将', hint:'+👥 +😊', fn: g => { g.flags.smallTownEntertainment=true; return{social:10,mood:8,money:-200}; }},
        { label:'组织户外活动', hint:'+💪 +👥', fn: g => { g.flags.smallTownEntertainment=true; return{health:8,social:8,mood:10}; }},
        { label:'继续宅家看书', hint:'+🧠', fn: g => { g.flags.smallTownEntertainment=true; return{intel:10,mood:5}; }},
      ]},
    { id:'reverse_migration', icon:'🔄', title:'反向迁徙',
      body:'你发现：你不是唯一一个回小城的人。\n\n你的高中同学A从上海回来了，开了家火锅店。\n你的大学室友B从北京回来了，考了公务员。\n你的前同事C从深圳回来了，在家带孩子。\n\n你们聚在一起，聊起了大城市的生活。你们笑了，也沉默了。\n\n你说：「我们都回来了。」\n他们说：「但我们不后悔出去过。」\n\n"反向迁徙：不是失败——是另一种选择。"',
      cond: g => g.flags.returnedHometown && g.flags.smallTownSocial && !g.flags.reverseMigration,
      choices:[
        { label:'一起创业', hint:'+💰 +👥', fn: g => { g.flags.reverseMigration=true; g.flags.hometownEntrepreneur=true; return{money:10000,social:10,mood:8}; }},
        { label:'互相支持', hint:'+👥 +😊', fn: g => { g.flags.reverseMigration=true; return{social:12,mood:10}; }},
        { label:'各自安好', hint:'+😊', fn: g => { g.flags.reverseMigration=true; return{mood:5}; }},
      ]},
    { id:'hometown_change', icon:'🏗️', title:'家乡变化',
      body:'你在小城待了一年，发现家乡也在变：\n\n- 新修了一条高速公路\n- 开了第一家星巴克\n- 建了一个创业园区\n- 有了共享电动车\n\n你的同学说：「小城也在发展，只是慢一点。」\n\n你突然意识到：不是小城没有机会——是你以前没有发现。\n\n"家乡变化：不是你变了——是你终于看见了。"',
      cond: g => g.flags.smallTownLife && g.age >= 30 && !g.flags.hometownChange,
      choices:[
        { label:'参与家乡建设', hint:'+✨ +👥', fn: g => { g.flags.hometownChange=true; return{charm:10,social:8,mood:8}; }},
        { label:'记录家乡变化', hint:'+🧠 +✨', fn: g => { g.flags.hometownChange=true; return{intel:8,charm:5,mood:5}; }},
        { label:'继续观望', hint:'+🧠', fn: g => { g.flags.hometownChange=true; return{intel:5}; }},
      ]},
    { id:'life_balance_choice', icon:'⚖️', title:'人生选择',
      body:'你在小城生活了一年，终于想明白了一件事：\n\n大城市有小城市没有的机会，小城市有大城市没有的生活。\n没有哪个选择是绝对正确的——只有哪个选择更适合你。\n\n你不再纠结了。你选择了当下。\n\n你发了条朋友圈：「我在小城，过得很好。」\n你的大城市朋友点赞了。你的小城朋友也点赞了。\n\n"人生选择：不是选最好的——是选最适合的。"',
      cond: g => g.flags.urbanRuralGap && g.flags.hometownChange && !g.flags.lifeBalanceChoice,
      choices:[
        { label:'扎根小城', hint:'+😊 +👥', fn: g => { g.flags.lifeBalanceChoice=true; return{mood:15,social:10}; }},
        { label:'两边跑', hint:'+💰 +🧠', fn: g => { g.flags.lifeBalanceChoice=true; return{money:5000,intel:8,mood:5}; }},
        { label:'还在思考', hint:'+🧠', fn: g => { g.flags.lifeBalanceChoice=true; return{intel:10}; }},
      ]},
    // === v14.2 宠物经济 + 宠物社交 + 养宠日常 ===
    { id:'adopt_pet_v2', icon:'🐱', title:'领养宠物',
      body:'你在朋友圈看到一条领养信息：一只3个月大的小橘猫，很可爱。\n\n你犹豫了：养宠物意味着责任——每天喂食、铲屎、陪玩、看病。\n\n但当你看到小猫的照片，你的心融化了。\n\n你填了领养申请表。审核很严格：需要提供房产证、收入证明、家庭照片。\n\n一周后，你接到了小猫。你给它取名「橘子」。\n\n"领养宠物：你以为你在救它，其实它在救你。"',
      cond: g => g.age >= 25 && !g.flags.hasPet && !g.flags.adoptPet,
      choices:[
        { label:'精心照顾', hint:'+😊 +💰', fn: g => { g.flags.adoptPet=true; g.flags.hasPet=true; return{mood:15,money:-2000}; }},
        { label:'佛系养宠', hint:'+😊', fn: g => { g.flags.adoptPet=true; g.flags.hasPet=true; return{mood:10,money:-500}; }},
        { label:'放弃领养', hint:'-😊', fn: g => { g.flags.adoptPet=true; return{mood:-8}; }},
      ]},
    { id:'pet_medical_v2', icon:'🏥', title:'宠物看病',
      body:'你的猫/狗突然不吃东西了，精神也不好。\n\n你带它去宠物医院。医生说：需要做全面检查，费用2000元。\n\n检查结果：轻度肠胃炎，需要输液3天，每天500元。\n\n你看着它可怜的样子，心疼得不行。你刷了信用卡。\n\n你的同事说：「给宠物花这么多钱？」你说：「它不是宠物，它是家人。」\n\n"宠物医疗：贵得让你怀疑人生，但看到它好起来——值了。"',
      cond: g => g.flags.hasPet && !g.flags.petMedical,
      choices:[
        { label:'全力治疗', hint:'-💰 +😊', fn: g => { g.flags.petMedical=true; return{money:-3500,mood:10}; }},
        { label:'买保险', hint:'-💰 +🧠', fn: g => { g.flags.petMedical=true; g.flags.petInsurance=true; return{money:-1000,intel:5,mood:5}; }},
        { label:'自己查资料治', hint:'+🧠 -💰', fn: g => { g.flags.petMedical=true; return{intel:8,mood:-5,money:-200}; }},
      ]},
    { id:'pet_social_event', icon:'🐕', title:'宠物社交',
      body:'你开始带宠物去公园遛弯。\n\n你发现：宠物是最好的社交工具。你的猫/狗和其他宠物玩耍，你和其他主人聊天。\n\n你加了5个宠物群：「XX小区铲屎官联盟」「猫奴互助会」「狗狗训练交流群」。\n\n你甚至参加了宠物聚会，认识了很多有趣的人。\n\n"宠物社交：不是你带宠物出门——是宠物带你出门。"',
      cond: g => g.flags.hasPet && !g.flags.petSocial,
      choices:[
        { label:'积极参加', hint:'+👥 +😊', fn: g => { g.flags.petSocial=true; return{social:12,mood:8}; }},
        { label:'偶尔参加', hint:'+👥', fn: g => { g.flags.petSocial=true; return{social:5,mood:5}; }},
        { label:'宅家撸猫/狗', hint:'+😊 -👥', fn: g => { g.flags.petSocial=true; return{mood:10,social:-3}; }},
      ]},
    { id:'pet_economy_v2', icon:'💰', title:'宠物经济',
      body:'你算了一下养宠物的年度开支：\n\n- 猫粮/狗粮：3000元\n- 零食玩具：1000元\n- 医疗保健：2000元\n- 美容洗澡：1200元\n- 寄养/上门：800元\n\n总计：8000元/年。\n\n你的同事说：「你这是在养一个孩子。」你说：「但它不会叛逆。」\n\n你开始研究宠物保险、宠物基金、宠物理财。\n\n"宠物经济：你以为你在养它，其实它在养你的钱包。"',
      cond: g => g.flags.hasPet && g.age >= 26 && !g.flags.petEconomy,
      choices:[
        { label:'给它最好的', hint:'-💰 +😊', fn: g => { g.flags.petEconomy=true; return{money:-8000,mood:10}; }},
        { label:'精打细算', hint:'+🧠 +💰', fn: g => { g.flags.petEconomy=true; g.flags.minimalist=true; return{intel:8,money:-3000,mood:5}; }},
        { label:'自制猫粮/狗粮', hint:'+🧠 +💪', fn: g => { g.flags.petEconomy=true; g.flags.cookingSkill=true; return{intel:5,health:3,money:-1500}; }},
      ]},
    { id:'pet_companion_v2', icon:'💕', title:'宠物陪伴',
      body:'你加班到深夜回家，打开门——你的猫/狗冲过来迎接你。\n\n它蹭你的脚，舔你的手，好像在说：「你终于回来了。」\n\n你抱着它，突然觉得：一天的疲惫都消失了。\n\n你的室友说：「你对它比对自己还好。」你说：「因为它对我的爱是无条件的。」\n\n"宠物陪伴：不是你需要它——是你们彼此需要。"',
      cond: g => g.flags.hasPet && g.flags.petSocial && !g.flags.petCompanion,
      choices:[
        { label:'每天陪它2小时', hint:'+😊 +💪', fn: g => { g.flags.petCompanion=true; return{mood:15,health:5}; }},
        { label:'周末带它出游', hint:'+😊 +✨', fn: g => { g.flags.petCompanion=true; return{mood:12,charm:5}; }},
        { label:'工作太忙没空', hint:'-😊 -👥', fn: g => { g.flags.petCompanion=true; return{mood:-10,social:-5}; }},
      ]},
    { id:'pet_loss_v2', icon:'💔', title:'宠物离世',
      body:'你的猫/狗老了。它不再像以前那样活泼，走路也很慢。\n\n医生说：它的时间不多了。\n\n你请了假，陪它度过最后的日子。你给它做了好吃的，带它去了最喜欢的公园。\n\n它在你怀里闭上了眼睛。你哭了，像个孩子。\n\n你发了条朋友圈：「谢谢你陪我这么多年。」收获了100个赞和无数安慰。\n\n"宠物离世：不是失去一个宠物——是失去一个家人。"',
      cond: g => g.flags.petCompanion && g.age >= 30 && !g.flags.petLoss,
      choices:[
        { label:'好好告别', hint:'+😊 +🧠', fn: g => { g.flags.petLoss=true; return{mood:-20,intel:10}; }},
        { label:'再养一只', hint:'+😊 -💰', fn: g => { g.flags.petLoss=true; g.flags.hasPet=true; return{mood:5,money:-3000}; }},
        { label:'不再养了', hint:'-😊', fn: g => { g.flags.petLoss=true; g.flags.hasPet=false; return{mood:-15}; }},
      ]},
    { id:'pet_travel', icon:'✈️', title:'带宠物旅行',
      body:'你想带宠物去旅行，但发现：\n\n- 飞机托运：800元+手续复杂\n- 高铁：不允许\n- 自驾：需要宠物笼\n- 酒店：90%不接受宠物\n\n你找到了一家宠物友好酒店，价格是普通酒店的2倍。\n\n你带着它出发了。它在车上很兴奋，一直看窗外。\n\n你拍了很多照片，发了朋友圈：「我和我的毛孩子。」\n\n"带宠物旅行：麻烦是麻烦——但看到它开心的样子，值了。"',
      cond: g => g.flags.hasPet && g.flags.petCompanion && !g.flags.petTravel,
      choices:[
        { label:'自驾旅行', hint:'+😊 +💰', fn: g => { g.flags.petTravel=true; return{mood:15,money:-2000}; }},
        { label:'宠物寄养', hint:'-😊 -💰', fn: g => { g.flags.petTravel=true; return{mood:-8,money:-500}; }},
        { label:'放弃旅行', hint:'-😊', fn: g => { g.flags.petTravel=true; return{mood:-5}; }},
      ]},
    { id:'pet_business', icon:'🏪', title:'宠物生意',
      body:'你发现：宠物经济是个巨大的市场。\n\n你开始研究：宠物食品、宠物用品、宠物美容、宠物寄养、宠物摄影。\n\n你算了一笔账：开一家宠物店，初期投入20万，预计18个月回本。\n\n你的家人说：「你这是不务正业。」你说：「我这是顺应趋势。」\n\n"宠物生意：不是卖萌——是一门严肃的生意。"',
      cond: g => g.flags.petEconomy && g.age >= 28 && !g.flags.petBusiness,
      choices:[
        { label:'开宠物店', hint:'-💰 +✨', fn: g => { g.flags.petBusiness=true; g.flags.entrepreneur=true; return{money:-20000,charm:10,mood:8}; }},
        { label:'做宠物博主', hint:'+✨ +🧠', fn: g => { g.flags.petBusiness=true; g.flags.contentCreator=true; return{charm:12,intel:8,mood:10}; }},
        { label:'继续观望', hint:'+🧠', fn: g => { g.flags.petBusiness=true; return{intel:5}; }},
      ]},
    { id:'pet_community', icon:'🏘️', title:'宠物社区',
      body:'你所在的小区有很多养宠物的人。你们自发组织了「宠物社区」。\n\n你们定期聚会、分享养宠经验、互相帮助照看宠物、组织宠物义诊。\n\n你成了社区的核心成员。你的邻居说：「有了宠物社区，小区都变温暖了。」\n\n你甚至推动了小区建设宠物公园。\n\n"宠物社区：不是因为宠物而聚集——是因为爱而连接。"',
      cond: g => g.flags.petSocial && g.flags.petCompanion && !g.flags.petCommunity,
      choices:[
        { label:'成为组织者', hint:'+👥 +✨', fn: g => { g.flags.petCommunity=true; return{social:15,charm:8,mood:10}; }},
        { label:'积极参与', hint:'+👥 +😊', fn: g => { g.flags.petCommunity=true; return{social:10,mood:8}; }},
        { label:'潜水观望', hint:'+🧠', fn: g => { g.flags.petCommunity=true; return{intel:5,social:3}; }},
      ]},
    { id:'pet_lifestyle', icon:'🌟', title:'宠物生活方式',
      body:'你发现：养宠物改变了你的生活方式。\n\n你开始早起遛狗/喂猫，你的生活变得规律了。\n你开始关注健康，因为你要陪它更久。\n你开始社交，因为它带你认识了很多人。\n你开始学习，因为你想给它更好的照顾。\n\n你的朋友说：「你变了。」你说：「是它改变了我。」\n\n"宠物生活方式：不是你养它——是你们一起成长。"',
      cond: g => g.flags.petCompanion && g.flags.petCommunity && !g.flags.petLifestyle,
      choices:[
        { label:'享受这种生活', hint:'+😊 +💪 +👥', fn: g => { g.flags.petLifestyle=true; return{mood:15,health:8,social:10}; }},
        { label:'分享给更多人', hint:'+✨ +👥', fn: g => { g.flags.petLifestyle=true; return{charm:10,social:8,mood:8}; }},
        { label:'保持现状', hint:'+😊', fn: g => { g.flags.petLifestyle=true; return{mood:10}; }},
      ]},
    // === v14.3 老年生活 + 退休规划 + 人生回顾 ===
    { id:'retirement_planning_v2', icon:'🏖️', title:'退休规划',
      body:'你突然意识到自己离退休并不远了。\n\n同事老王上个月退休了，他说：「我算了一下，我的养老金只够每个月吃两顿火锅。」\n\n你开始认真思考自己的退休生活。你查了一下社保——数字让你沉默了。\n\n你的同事劝你：「趁年轻多存点钱。」你的父母说：「养儿防老。」你的猫说：「喵。」\n\n"退休规划：不是为老了做准备——是为了老了不慌张。"',
      cond: g => g.age >= 40 && !g.flags.retirementPlanning,
      choices:[
        { label:'开始存养老金', hint:'-💰 +🧠', fn: g => { g.flags.retirementPlanning=true; g.flags.pensionSaver=true; return{money:-5000,intel:10,mood:5}; }},
        { label:'买商业养老保险', hint:'-💰💰 +🛡️', fn: g => { g.flags.retirementPlanning=true; g.flags.commercialPension=true; return{money:-10000,intel:8,mood:8}; }},
        { label:'车到山前必有路', hint:'+😊', fn: g => { g.flags.retirementPlanning=true; return{mood:3}; }},
      ]},
    { id:'square_dancing', icon:'💃', title:'广场舞江湖',
      body:'你路过小区广场，一群大妈在跳广场舞。\n\n音乐是凤凰传奇的《最炫民族风》，分贝堪比装修电钻。你的窗户正对广场。\n\n你曾经投诉过噪音。大妈们说：「我们跳舞是为了健康。」你说：「我失眠是为了活着。」\n\n今天，一个阿姨递给你一把扇子：「年轻人，一起跳？」\n\n"广场舞：中国最硬核的全民健身——没有之一。"',
      cond: g => g.age >= 35 && !g.flags.squareDancing,
      choices:[
        { label:'加入广场舞', hint:'+💪 +👥 +😊', fn: g => { g.flags.squareDancing=true; return{health:8,social:10,mood:8}; }},
        { label:'成为领舞', hint:'+✨ +👥', fn: g => { g.flags.squareDancing=true; g.flags.squareDanceLeader=true; return{charm:10,social:12,mood:5}; }},
        { label:'婉拒，回家关窗', hint:'+🧠', fn: g => { g.flags.squareDancing=true; return{intel:3}; }},
      ]},
    { id:'senior_university', icon:'🎓', title:'老年大学',
      body:'你的妈妈报名了老年大学。\n\n她学书法、学国画、学摄影、学智能手机。她比你还在努力学新东西。\n\n她发来一张书法作品的照片，写着「岁月静好」。你放大一看——那是从网上抄的。\n\n她说：「老年大学的老师说我很有天赋。」你说：「妈，你连毛笔都拿反了。」\n\n她说：「你管我，我开心就好。」\n\n"老年大学：不是学知识——是学快乐。"',
      cond: g => g.age >= 30 && g.flags.hasParents && !g.flags.seniorUniversity,
      choices:[
        { label:'支持妈妈继续学', hint:'+😊 +👥', fn: g => { g.flags.seniorUniversity=true; return{mood:8,social:5}; }},
        { label:'给妈妈买画具', hint:'-💰 +😊', fn: g => { g.flags.seniorUniversity=true; g.flags.artSupplies=true; return{money:-500,mood:10}; }},
        { label:'自己也去旁听', hint:'+🧠 +😊', fn: g => { g.flags.seniorUniversity=true; g.flags.selfLearning=true; return{intel:8,mood:5}; }},
      ]},
    { id:'health_crisis_elder', icon:'🏥', title:'体检报告',
      body:'年度体检报告出来了。\n\n你打开报告，发现上面的红色标记比去年多了3个。血压偏高、血糖偏高、胆固醇偏高。\n\n医生说：「你要注意饮食了。」你说：「我每天都吃沙拉。」医生说：「沙拉酱也是高热量。」\n\n你的同事看到你的报告说：「你这个年纪有这些指标很正常。」你不确定这是安慰还是诅咒。\n\n"中年体检：每一次打开报告，都是一次人生审判。"',
      cond: g => g.age >= 40 && !g.flags.healthCrisisElder && g.health < 60,
      choices:[
        { label:'认真改善饮食', hint:'+💪 +🧠', fn: g => { g.flags.healthCrisisElder=true; g.flags.healthyDiet=true; return{health:10,intel:5,mood:-3}; }},
        { label:'办健身卡', hint:'-💰 +💪', fn: g => { g.flags.healthCrisisElder=true; g.flags.gymMember=true; return{money:-3000,health:12}; }},
        { label:'算了，该吃吃该喝喝', hint:'+😊 -💪', fn: g => { g.flags.healthCrisisElder=true; return{mood:5,health:-8}; }},
      ]},
    { id:'empty_nest_v2', icon:'🏠', title:'空巢时刻',
      body:'你的孩子去外地上大学了。\n\n你站在空荡荡的房间里，发现客厅安静得能听到冰箱的嗡嗡声。你不用再做三个人的饭了。\n\n你给孩子发微信：「吃了吗？」三小时后收到回复：「吃了。」\n\n你的配偶说：「我们终于有时间过二人世界了。」你说：「可我已经忘了二人世界怎么过了。」\n\n你突然觉得——这个家，太大了。\n\n"空巢不是孤独——是学会和自己重新相处。"',
      cond: g => g.age >= 45 && g.flags.hasChild && !g.flags.emptyNest,
      choices:[
        { label:'培养新爱好', hint:'+😊 +🧠', fn: g => { g.flags.emptyNest=true; g.flags.newHobby=true; return{mood:10,intel:8}; }},
        { label:'重新经营夫妻关系', hint:'+💑 +😊', fn: g => { g.flags.emptyNest=true; g.flags.marriageRenewal=true; return{mood:12,charm:5}; }},
        { label:'疯狂给孩子打电话', hint:'+👥 -😊', fn: g => { g.flags.emptyNest=true; g.flags.helicopterParent=true; return{social:5,mood:-5}; }},
      ]},
    { id:'life_review', icon:'📖', title:'人生回顾',
      body:'一个深夜，你翻看年轻时的照片。\n\n你看到了20岁的自己：眼神明亮、笑容灿烂、头发浓密。你想：那个人是怎么变成现在这个样子的？\n\n你翻到了第一份工作的工牌、第一次旅行的车票、第一间出租屋的照片。每一件都让你想起一段故事。\n\n你打开备忘录，写了一句话：「如果重来一次……」然后删掉了。\n\n因为没有如果。但有现在。\n\n"人生回顾：不是后悔——是和过去的自己和解。"',
      cond: g => g.age >= 45 && !g.flags.lifeReview,
      choices:[
        { label:'写回忆录', hint:'+🧠 +😊', fn: g => { g.flags.lifeReview=true; g.flags.memoirist=true; return{intel:12,mood:10}; }},
        { label:'和老友重聚', hint:'+👥 +😊', fn: g => { g.flags.lifeReview=true; g.flags.oldFriendsReunion=true; return{social:15,mood:12}; }},
        { label:'删掉所有照片', hint:'-😊 +🧠', fn: g => { g.flags.lifeReview=true; g.flags.digitalDetox=true; return{mood:-5,intel:8}; }},
      ]},
    { id:'grandparent_role', icon:'👴', title:'隔代育儿',
      body:'你的父母主动请缨要帮你带孩子。\n\n你的妈妈说：「你小时候就是这么被我带大的，有什么问题？」你的孩子说：「奶奶给我吃糖！」\n\n你的教育理念是「科学育儿」，你妈的教育理念是「我养了你这么大不也好好的」。\n\n你的孩子现在会说方言了。他叫你「爸/妈」的时候带着一股河南味。\n\n你哭笑不得。\n\n"隔代育儿：不是谁对谁错——是两代人的爱的方式不同。"',
      cond: g => g.age >= 35 && g.flags.hasChild && g.flags.hasParents && !g.flags.grandparentRole,
      choices:[
        { label:'接受父母帮忙', hint:'+👥 +😊 -🧠', fn: g => { g.flags.grandparentRole=true; g.flags.acceptHelp=true; return{social:10,mood:8,intel:-3}; }},
        { label:'坚持自己带', hint:'+🧠 -💪', fn: g => { g.flags.grandparentRole=true; g.flags.selfParenting=true; return{intel:8,health:-5,mood:-3}; }},
        { label:'制定育儿规则', hint:'+🧠 +👥', fn: g => { g.flags.grandparentRole=true; g.flags.parentingRules=true; return{intel:10,social:5}; }},
      ]},
    { id:'elder_travel', icon:'✈️', title:'老年旅行团',
      body:'你参加了一个中老年旅行团。\n\n团里平均年龄55岁。每天早上6点起床，7点集合，8点到景区——然后拍照、拍照、拍照。\n\n你的阿姨拍了300张照片，每一张都用了美颜。她说：「你看我像40岁吗？」你说：「像40岁的阿姨开了美颜。」\n\n导游带大家去了一个玉石博物馆。你知道这意味着什么——购物。\n\n但你不得不承认：和大妈们一起旅游，真的很开心。\n\n"中老年旅行团：不是在旅行——是在用集体活动对抗孤独。"',
      cond: g => g.age >= 45 && !g.flags.elderTravel,
      choices:[
        { label:'享受集体旅行', hint:'+😊 +👥', fn: g => { g.flags.elderTravel=true; return{mood:12,social:10}; }},
        { label:'成为团里的摄影师', hint:'+✨ +👥', fn: g => { g.flags.elderTravel=true; g.flags.groupPhotographer=true; return{charm:8,social:12,mood:8}; }},
        { label:'下次自己自由行', hint:'+🧠', fn: g => { g.flags.elderTravel=true; g.flags.freeTraveler=true; return{intel:5,mood:3}; }},
      ]},
    { id:'legacy_thinking_v2', icon:'🌟', title:'遗产与传承',
      body:'你开始思考：这辈子留下了什么？\n\n你没有做出什么惊天动地的大事。你只是一个普通人：上过班、养过家、爱过人、失去过。\n\n但你的孩子会记得你教他骑自行车的样子。你的朋友会记得你深夜陪他喝酒的日子。你的父母会记得你每年春节回家的笑脸。\n\n你突然觉得：也许传承不是遗产——是记忆。\n\n"人生的意义不在于你留下了什么——在于你活过的每一个瞬间都值得被记住。"',
      cond: g => g.age >= 50 && !g.flags.legacyThinking,
      choices:[
        { label:'给家人写信', hint:'+😊 +👥', fn: g => { g.flags.legacyThinking=true; g.flags.legacyLetters=true; return{mood:15,social:8}; }},
        { label:'做一本家庭相册', hint:'-💰 +😊', fn: g => { g.flags.legacyThinking=true; g.flags.familyAlbum=true; return{money:-200,mood:12,charm:5}; }},
        { label:'活在当下就好', hint:'+😊', fn: g => { g.flags.legacyThinking=true; return{mood:10}; }},
      ]},
    { id:'digital_elder', icon:'📱', title:'数字鸿沟',
      body:'你发现自己越来越搞不懂手机了。\n\n医院挂号要用App、银行办事要用小程序、买菜要扫码。你曾经是最懂科技的那批人，现在变成了需要孩子教你用手机的那批人。\n\n你的孩子不耐烦地说：「爸/妈，这个我教了你三遍了。」你说：「你小时候学说话我也教了你三遍。」\n\n他沉默了。然后耐心地教了你第四遍。\n\n"数字鸿沟：不是我们变笨了——是世界变得太快。"',
      cond: g => g.age >= 50 && !g.flags.digitalElder,
      choices:[
        { label:'认真学习新技术', hint:'+🧠 +💪', fn: g => { g.flags.digitalElder=true; g.flags.techLearner=true; return{intel:10,mood:5}; }},
        { label:'让孩子当老师', hint:'+👥 +😊', fn: g => { g.flags.digitalElder=true; return{social:8,mood:8}; }},
        { label:'坚持用老方法', hint:'-🧠 +😊', fn: g => { g.flags.digitalElder=true; g.flags.traditionalist=true; return{intel:-3,mood:5}; }},
      ]},
    { id:'elder_friendship', icon:'🤝', title:'忘年之交',
      body:'你在小区里认识了一个70岁的老大爷。\n\n他每天在长椅上看书，你每天在长椅上发呆。他主动和你搭话：「年轻人，想什么呢？」\n\n他说他年轻时是大学教授，退休后每天来这里看书。他给你讲了很多人生道理，大多数你都忘了。\n\n但有一句话你记住了：「人这辈子最重要的不是赚了多少钱——是有多少人愿意和你坐在一张长椅上。」\n\n"忘年之交：年龄不是距离——经历才是共鸣。"',
      cond: g => g.age >= 35 && !g.flags.elderFriendship,
      choices:[
        { label:'经常去看望他', hint:'+👥 +😊 +🧠', fn: g => { g.flags.elderFriendship=true; return{social:12,mood:10,intel:8}; }},
        { label:'请他来家里吃饭', hint:'+👥 +😊', fn: g => { g.flags.elderFriendship=true; g.flags.elderGuest=true; return{social:10,mood:12}; }},
        { label:'保持点头之交', hint:'+👥', fn: g => { g.flags.elderFriendship=true; return{social:5}; }},
      ]},
    { id:'hobby_rediscovery', icon:'🎨', title:'重拾爱好',
      body:'你在整理储物间时，发现了一把落灰的吉他。\n\n那是你20岁时买的。你曾经梦想当一个歌手，后来变成了一个加班到凌晨的打工人。\n\n你试着弹了一下。手指已经不听使唤了，和弦也忘了大半。但当你弹出一个完整的C和弦时——你笑了。\n\n那种纯粹的、因为做了一件喜欢的事而开心的感觉，你已经很久没有了。\n\n"重拾爱好：不是回到过去——是在现在找回自己。"',
      cond: g => g.age >= 40 && !g.flags.hobbyRediscovery,
      choices:[
        { label:'每天练习30分钟', hint:'+😊 +💪 +🧠', fn: g => { g.flags.hobbyRediscovery=true; g.flags.dailyPractice=true; return{mood:12,health:5,intel:8}; }},
        { label:'加入社区乐队', hint:'+👥 +😊', fn: g => { g.flags.hobbyRediscovery=true; g.flags.communityBand=true; return{social:12,mood:10}; }},
        { label:'挂回墙上，改天再说', hint:'+🧠', fn: g => { g.flags.hobbyRediscovery=true; return{intel:3}; }},
      ]},
    // === v14.4 跨代关系 + 祖孙情深 + 家族传承 ===
    { id:'grandparent_bond', icon:'👵', title:'祖孙情深',
      body:'你的爷爷/奶奶年纪越来越大了。\n\n每次回老家，奶奶都会做一桌子菜。你说：「我吃不了这么多。」她说：「你小时候可没少吃。」\n\n她拉着你的手，说了很多以前的事：你小时候怎么哭、怎么闹、怎么第一次叫她奶奶。你听着听着，眼眶就红了。\n\n她塞给你一个大红包。你说不要。她说：「拿着，奶奶还有。」你知道她没有。\n\n"祖孙之间：是最纯粹的爱——因为隔了一代，所有的严厉都变成了温柔。"',
      cond: g => g.age >= 25 && g.flags.hasParents && !g.flags.grandparentBond,
      choices:[
        { label:'多回老家陪奶奶', hint:'+😊 +👥 -💪', fn: g => { g.flags.grandparentBond=true; g.flags.frequentVisitor=true; return{mood:15,social:10,health:-3}; }},
        { label:'教奶奶用视频通话', hint:'+🧠 +😊', fn: g => { g.flags.grandparentBond=true; g.flags.techTeacher=true; return{intel:5,mood:10}; }},
        { label:'记下奶奶的故事', hint:'+🧠 +😊', fn: g => { g.flags.grandparentBond=true; g.flags.storyCollector=true; return{intel:10,mood:12}; }},
      ]},
    { id:'family_tradition', icon:'🏮', title:'家风传承',
      body:'过年了，你带着孩子回老家。\n\n你的父亲拿出一本泛黄的笔记本，说是爷爷留下的。里面记着家训：「做人要厚道，做事要认真。」\n\n你的孩子问：「什么是家训？」你说：「就是爷爷的爷爷告诉我们该怎么做人。」他说：「那爷爷的爷爷是谁？」你：「……」\n\n你的父亲笑了：「这个孩子像我。」\n\n"家风：不是刻在墙上的字——是流淌在血脉里的规矩。"',
      cond: g => g.age >= 30 && g.flags.hasChild && g.flags.hasParents && !g.flags.familyTradition,
      choices:[
        { label:'把家训教给孩子', hint:'+🧠 +👥', fn: g => { g.flags.familyTradition=true; g.flags.traditionKeeper=true; return{intel:8,social:5,mood:8}; }},
        { label:'写一本新的家训', hint:'+🧠 +✨', fn: g => { g.flags.familyTradition=true; g.flags.modernTradition=true; return{intel:12,charm:5,mood:10}; }},
        { label:'觉得过时了', hint:'-👥 +🧠', fn: g => { g.flags.familyTradition=true; return{intel:5,social:-5}; }},
      ]},
    { id:'generation_gap_v2', icon:'🔄', title:'代际冲突',
      body:'你和父母因为教育理念吵了起来。\n\n你说：「要尊重孩子的个性。」你妈说：「我当年打你你也没长歪。」\n\n你说：「要给孩子自由。」你爸说：「自由？我当年连自由是什么都不知道，不也把你养大了？」\n\n你的孩子在旁边看着你们吵架，说了一句：「大人好幼稚。」\n\n你们同时沉默了。\n\n"代际冲突：不是因为谁对谁错——是因为每一代人都在用自己的方式爱下一代。"',
      cond: g => g.age >= 30 && g.flags.hasChild && g.flags.hasParents && !g.flags.generationGap,
      choices:[
        { label:'主动道歉', hint:'+👥 +😊', fn: g => { g.flags.generationGap=true; g.flags.peacemaker=true; return{social:10,mood:8}; }},
        { label:'坚持自己的立场', hint:'+🧠 -👥', fn: g => { g.flags.generationGap=true; g.flags.independentThinker=true; return{intel:8,social:-5}; }},
        { label:'找中间方案', hint:'+🧠 +👥', fn: g => { g.flags.generationGap=true; g.flags.compromise=true; return{intel:10,social:8}; }},
      ]},
    { id:'elder_care_dilemma', icon:'🏥', title:'养老困境',
      body:'你的父亲住院了。医生说需要长期护理。\n\n你面临一个艰难的选择：请护工太贵、送养老院不忍心、自己照顾没法上班。\n\n你的兄弟姐妹开了一个家庭会议。大哥说：「轮流照顾。」二姐说：「我没时间。」你说：「我出钱。」\n\n最后你们决定：请一个护工，每人每月出3000。你觉得不够，但你也不知道还能怎样。\n\n你父亲在病床上说：「你们别为我吵架。」你们都说：「没有。」但每个人心里都有一本账。\n\n"养老困境：不是没有爱——是爱和现实之间，隔了一个中国。"',
      cond: g => g.age >= 35 && g.flags.hasParents && !g.flags.elderCareDilemma,
      choices:[
        { label:'亲自照顾', hint:'+👥 +😊 -💪 -💰', fn: g => { g.flags.elderCareDilemma=true; g.flags.fulltimeCarer=true; return{social:10,mood:5,health:-10,money:-5000}; }},
        { label:'请护工+多探望', hint:'-💰 +👥 +😊', fn: g => { g.flags.elderCareDilemma=true; g.flags.hireCaregiver=true; return{money:-8000,social:5,mood:3}; }},
        { label:'和兄弟姐妹分担', hint:'+👥 +🧠', fn: g => { g.flags.elderCareDilemma=true; g.flags.familySharing=true; return{social:8,intel:5,mood:5}; }},
      ]},
    { id:'elder_remarriage', icon:'💑', title:'黄昏恋',
      body:'你的妈妈说：「我交了一个朋友。」\n\n你一开始没反应过来。直到她拿出手机给你看照片——一个头发花白但精神很好的叔叔。\n\n你说：「妈，你是认真的？」她说：「你爸走了十年了，我也该有自己的生活了。」\n\n你的亲戚们炸锅了。大姑说：「不像话。」二叔说：「财产怎么分？」你妈说：「我的人生我做主。」\n\n你站在妈妈这边。你说：「妈，你开心就好。」\n\n"黄昏恋：不是老不正经——是活着就要有爱。"',
      cond: g => g.age >= 35 && g.flags.hasParents && !g.flags.elderRemarriage,
      choices:[
        { label:'全力支持', hint:'+👥 +😊 +✨', fn: g => { g.flags.elderRemarriage=true; g.flags.supportiveChild=true; return{social:8,mood:12,charm:5}; }},
        { label:'帮妈妈把关', hint:'+🧠 +👥', fn: g => { g.flags.elderRemarriage=true; g.flags.protectiveChild=true; return{intel:8,social:5}; }},
        { label:'表示担忧', hint:'-👥 +🧠', fn: g => { g.flags.elderRemarriage=true; return{social:-5,intel:5}; }},
      ]},
    { id:'family_reunion_v2', icon:'🎊', title:'家族聚会',
      body:'你组织了一次大型家族聚会。\n\n来了三十多个人：叔伯姑舅姨、堂兄表妹、还有你叫不上名的远房亲戚。一个小孩叫你「爷爷」，你才28岁。\n\n大家围坐在一起，聊着聊着就开始比谁的孩子成绩好、谁的房子大、谁的车贵。你默默吃着花生米。\n\n但到了晚上，大家一起放烟花的时候，所有人都笑了——不管有钱没钱，烟花都是一样的。\n\n"家族聚会：不是在比谁过得好——是在确认我们都还在。"',
      cond: g => g.age >= 28 && !g.flags.familyReunion,
      choices:[
        { label:'享受团聚时光', hint:'+😊 +👥', fn: g => { g.flags.familyReunion=true; return{mood:12,social:10}; }},
        { label:'拍下全家福', hint:'+😊 +✨', fn: g => { g.flags.familyReunion=true; g.flags.familyPhoto=true; return{mood:15,charm:5}; }},
        { label:'下次再说吧', hint:'+🧠', fn: g => { g.flags.familyReunion=true; return{intel:3}; }},
      ]},
    { id:'inheritance_talk', icon:'📋', title:'遗产话题',
      body:'一个亲戚去世了，遗产分配成了家族热议的话题。\n\n大儿子说：「我是长子，应该多分。」女儿说：「我照顾了爸十年。」二儿子说：「爸生前说了平分。」\n\n你看着他们从哭泣变成了争吵，从亲人变成了对手。\n\n你的父亲在旁边沉默了很久，说了一句：「等我不在了，你们别这样。」\n\n你说：「爸，你不会的。」他摇了摇头：「我是说，你们提前说清楚。」\n\n"遗产：不是钱的问题——是钱暴露了人的问题。"',
      cond: g => g.age >= 35 && g.flags.hasParents && !g.flags.inheritanceTalk,
      choices:[
        { label:'和家人开诚布公', hint:'+👥 +🧠', fn: g => { g.flags.inheritanceTalk=true; g.flags.openCommunication=true; return{social:10,intel:8,mood:5}; }},
        { label:'立遗嘱太早了吧', hint:'-🧠 +😊', fn: g => { g.flags.inheritanceTalk=true; return{intel:-3,mood:3}; }},
        { label:'建议找律师咨询', hint:'+🧠 -💰', fn: g => { g.flags.inheritanceTalk=true; g.flags.legalAdvice=true; return{intel:10,money:-2000}; }},
      ]},
    { id:'child_growing_up', icon:'🌱', title:'孩子长大了',
      body:'你的孩子第一次自己做了一顿饭。\n\n虽然鸡蛋炒糊了、米饭夹生了、厨房像被洗劫过——但你吃了一口，觉得这是世界上最好吃的饭。\n\n你突然意识到：他/她不再是那个需要你帮忙穿鞋的小孩了。他有了自己的想法、自己的朋友、自己的秘密。\n\n你想翻看他的日记，但忍住了。你想查看他的手机，但也忍住了。\n\n放手，也许是最难的 parenting skill。\n\n"孩子长大：不是你教会了他什么——是他让你学会了什么。"',
      cond: g => g.age >= 38 && g.flags.hasChild && !g.flags.childGrowingUp,
      choices:[
        { label:'给孩子更多空间', hint:'+😊 +🧠', fn: g => { g.flags.childGrowingUp=true; g.flags.trustingParent=true; return{mood:10,intel:8}; }},
        { label:'珍惜最后的亲密时光', hint:'+😊 +👥', fn: g => { g.flags.childGrowingUp=true; return{mood:15,social:8}; }},
        { label:'开始为他的未来焦虑', hint:'-😊 +🧠', fn: g => { g.flags.childGrowingUp=true; g.flags.futureAnxiety=true; return{mood:-5,intel:5}; }},
      ]},
    { id:'family_recipe', icon:'🍲', title:'家传菜谱',
      body:'你的奶奶把她的拿手菜谱教给了你。\n\n红烧肉要放冰糖、鱼要先煎后炖、饺子馅要打三次水。你一边记一边尝，味道和记忆中的一模一样。\n\n奶奶说：「这些菜，你妈不会做，你得学。」你说：「为什么不让妈学？」她说：「你妈做的菜太难吃了。」\n\n你的妈妈在厨房门口听到了，翻了个白眼。\n\n"家传菜谱：不是技术——是爱的配方。"',
      cond: g => g.age >= 25 && g.flags.hasParents && !g.flags.familyRecipe,
      choices:[
        { label:'认真学会每道菜', hint:'+🧠 +😊 +💪', fn: g => { g.flags.familyRecipe=true; g.flags.cookingHeritage=true; return{intel:8,mood:12,health:5}; }},
        { label:'录下奶奶做菜的视频', hint:'+🧠 +😊', fn: g => { g.flags.familyRecipe=true; g.flags.videoArchive=true; return{intel:10,mood:15}; }},
        { label:'以后再说吧', hint:'+🧠', fn: g => { g.flags.familyRecipe=true; return{intel:3}; }},
      ]},
    { id:'parent_aging_v4', icon:'⏳', title:'父母老了',
      body:'你发现父母的白头发越来越多了。\n\n你的爸爸走路开始变慢了，你的妈妈开始忘事了。他们以前是你的超级英雄，现在变成了需要你照顾的人。\n\n你打电话回家，妈妈说：「一切都好，别操心。」但你从邻居那里听说，爸爸上周摔了一跤。\n\n你买了最近的火车票回家。你爸看到你回来，假装生气：「不是说了不用回来吗？」但你看到他笑了。\n\n"父母老了：是你终于理解了他们当年的那句话——你长大就知道了。"',
      cond: g => g.age >= 30 && g.flags.hasParents && !g.flags.parentAging,
      choices:[
        { label:'每周固定打电话', hint:'+👥 +😊', fn: g => { g.flags.parentAging=true; g.flags.weeklyCall=true; return{social:8,mood:8}; }},
        { label:'安排全面体检', hint:'-💰 +💪 +👥', fn: g => { g.flags.parentAging=true; g.flags.parentHealthDone=true; return{money:-5000,health:5,social:5,mood:5}; }},
        { label:'接父母来城里住', hint:'-💰 +👥 +😊', fn: g => { g.flags.parentAging=true; g.flags.cohabitation=true; return{money:-3000,social:12,mood:10}; }},
      ]},
    // === v15.0 心理健康 + 自我疗愈 ===
    { id:'anxiety_attack', icon:'😰', title:'焦虑发作',
      body:'凌晨3点，你突然从床上坐起来。\n\n心跳加速、呼吸急促、手心出汗。你觉得天花板在往下压，墙壁在往内收。\n\n你知道这是焦虑发作。你已经不是第一次了。你打开手机，搜索「如何缓解焦虑」——搜索结果的第一条是广告。\n\n你试着深呼吸：4秒吸气、7秒屏住、8秒呼气。第5次的时候，你好了一点。\n\n你的同事第二天问你：「你脸色好差。」你说：「昨晚没睡好。」你没说的是：你已经连续一周没睡好了。\n\n"焦虑不是矫情——是你的身体在告诉你，你撑太久了。"',
      cond: g => g.age >= 22 && g.mood < 40 && !g.flags.anxietyAttack,
      choices:[
        { label:'去医院看心理科', hint:'-💰 +💪 +🧠', fn: g => { g.flags.anxietyAttack=true; g.flags.therapyStarted=true; return{money:-500,health:10,intel:8}; }},
        { label:'下载冥想App', hint:'+🧠 +😊', fn: g => { g.flags.anxietyAttack=true; g.flags.mindfulnessPractice=true; return{intel:8,mood:5}; }},
        { label:'硬扛，告诉自己没事', hint:'-💪 +🧠', fn: g => { g.flags.anxietyAttack=true; return{health:-8,intel:3}; }},
      ]},
    { id:'depression_fog', icon:'🌧️', title:'情绪低谷',
      body:'你已经连续两周不想出门了。\n\n不是不能——是不想。不想上班、不想社交、不想做饭、不想洗澡。你每天躺在床上刷手机，刷到凌晨2点。\n\n你的朋友说：「你振作一点。」你的父母说：「想开点。」你自己说：「我也想。」\n\n但「想开」不是开关——啪嗒一下就能亮。\n\n你看到一条帖子：「抑郁症不是心情不好——是丧失了快乐的能力。」你盯着看了很久。\n\n"抑郁不是软弱——是扛了太久太久的坚强。"',
      cond: g => g.age >= 20 && g.mood < 30 && !g.flags.depressionFog,
      choices:[
        { label:'预约心理咨询师', hint:'-💰 +💪 +🧠', fn: g => { g.flags.depressionFog=true; g.flags.therapyStarted=true; return{money:-600,health:8,intel:10}; }},
        { label:'告诉信任的人', hint:'+👥 +😊', fn: g => { g.flags.depressionFog=true; g.flags.openedUp=true; return{social:12,mood:8}; }},
        { label:'一个人扛着', hint:'-😊 -💪', fn: g => { g.flags.depressionFog=true; return{mood:-10,health:-8}; }},
      ]},
    { id:'therapy_session_v3', icon:'🛋️', title:'第一次心理咨询',
      body:'你走进了心理咨询室。\n\n房间不大，有一张沙发、一盏暖灯、一盒纸巾。咨询师是一个温和的女性，她让你随便聊聊。\n\n你说了20分钟。关于工作、关于父母、关于失眠、关于那个让你窒息的凌晨。\n\n她没有说「想开点」，也没有说「你没事的」。她只是说：「你的感受是合理的。」\n\n你哭了。那是你很久没有哭过了。\n\n走出咨询室的时候，你觉得胸口轻了一点。只有一点——但够了。\n\n"心理咨询：不是有病才去——是在还没病的时候，给自己一个出口。"',
      cond: g => g.flags.therapyStarted && !g.flags.therapySession,
      choices:[
        { label:'继续定期咨询', hint:'-💰 +💪 +🧠 +😊', fn: g => { g.flags.therapySession=true; g.flags.regularTherapy=true; return{money:-2400,health:10,intel:12,mood:10}; }},
        { label:'试试自助方法', hint:'+🧠 +😊', fn: g => { g.flags.therapySession=true; g.flags.selfHelp=true; return{intel:8,mood:5}; }},
        { label:'觉得没用，不去了', hint:'-😊', fn: g => { g.flags.therapySession=true; return{mood:-5}; }},
      ]},
    { id:'mindfulness_meditation', icon:'🧘', title:'正念冥想',
      body:'你的同事推荐你一个冥想App。\n\n你下载了「潮汐」，戴上耳机，跟着引导词做了一次10分钟的正念呼吸。\n\n前3分钟你在想工作上的事。中间3分钟你在想晚饭吃什么。最后4分钟你终于安静了——然后闹钟响了。\n\n你觉得有点傻。但第二天你又做了一次。第三次的时候，你第一次感受到了「什么都不想」的感觉。\n\n那是一种奇妙的宁静。像是暴风雨中的风眼。\n\n"正念冥想：不是让大脑停下来——是学会和杂念共处。"',
      cond: g => g.age >= 22 && !g.flags.mindfulnessMeditation,
      choices:[
        { label:'每天冥想15分钟', hint:'+💪 +🧠 +😊', fn: g => { g.flags.mindfulnessMeditation=true; g.flags.dailyMeditation=true; return{health:8,intel:10,mood:10}; }},
        { label:'参加线下冥想课', hint:'-💰 +🧠 +👥', fn: g => { g.flags.mindfulnessMeditation=true; g.flags.meditationClass=true; return{money:-500,intel:8,social:5}; }},
        { label:'偶尔做做就好', hint:'+🧠', fn: g => { g.flags.mindfulnessMeditation=true; return{intel:5,mood:3}; }},
      ]},
    { id:'social_anxiety_v2', icon:'😶', title:'社交恐惧',
      body:'公司团建，你站在KTV门口不敢进去。\n\n不是不想——是害怕。害怕唱歌被评价、害怕聊天冷场、害怕成为焦点。\n\n你在门口站了10分钟，给同事发了条微信：「我不太舒服，先回去了。」然后转身走了。\n\n回到出租屋，你觉得轻松了——然后又觉得自责了。你知道他们不会怪你，但你会怪自己。\n\n你的日记本上写着：「今天又逃了一次。明天呢？」\n\n"社恐不是性格内向——是害怕被评判。每一个社恐的人，都在心里演了一场独角戏。"',
      cond: g => g.age >= 20 && g.social < 30 && !g.flags.socialAnxiety,
      choices:[
        { label:'尝试小步暴露', hint:'+👥 +💪 +😊', fn: g => { g.flags.socialAnxiety=true; g.flags.gradualExposure=true; return{social:8,health:5,mood:5}; }},
        { label:'加入社恐互助群', hint:'+👥 +🧠', fn: g => { g.flags.socialAnxiety=true; g.flags.supportGroup=true; return{social:10,intel:5}; }},
        { label:'接受自己就是社恐', hint:'+🧠 +😊', fn: g => { g.flags.socialAnxiety=true; g.flags.selfAcceptance=true; return{intel:8,mood:8}; }},
      ]},
    { id:'insomnia_chronic', icon:'🌙', title:'慢性失眠',
      body:'又是一个凌晨。\n\n你数了300只羊、听了3段白噪音、喝了2杯热牛奶。还是睡不着。\n\n你的手机显示凌晨3:47。你算了一下：如果现在睡着，还能睡4小时。\n\n但你越想睡就越清醒。你的大脑开始播放你最尴尬的回忆：小学被老师点名答不上来、大学表白被拒、上个月开会说错了话。\n\n你叹了口气，拿起手机——朋友圈里有人发了条：「又是失眠的一天。」你点了个赞。原来不止你一个人。\n\n"失眠不是不困——是大脑不肯关机。在凌晨的世界里，你不是一个人。"',
      cond: g => g.age >= 22 && g.mood < 45 && !g.flags.chronicInsomnia,
      choices:[
        { label:'看睡眠专科', hint:'-💰 +💪 +🧠', fn: g => { g.flags.chronicInsomnia=true; g.flags.sleepSpecialist=true; return{money:-800,health:10,intel:5}; }},
        { label:'调整作息习惯', hint:'+💪 +😊', fn: g => { g.flags.chronicInsomnia=true; g.flags.sleepHygiene=true; return{health:8,mood:5}; }},
        { label:'吃安眠药', hint:'+😊 -💪', fn: g => { g.flags.chronicInsomnia=true; g.flags.sleepingPills=true; return{mood:5,health:-5}; }},
      ]},
    { id:'exercise_therapy', icon:'🏃', title:'运动处方',
      body:'你的心理咨询师建议你试试运动。\n\n她说：「跑步30分钟相当于吃一颗抗焦虑药。」你半信半疑地开始跑步。\n\n第一天跑了800米就喘得不行。第二天腿疼得下不了楼梯。但第三天——你跑完3公里后出了一身汗，居然觉得心情好了。\n\n你开始每周跑3次。你的配速从7分钟变成6分钟。你参加了第一个5公里跑。\n\n你发现：跑步的时候，你的大脑不会想那些烦的事。只有脚步、呼吸和心跳。\n\n"运动疗愈：不是让身体疲惫——是让心灵自由。"',
      cond: g => g.age >= 22 && !g.flags.exerciseTherapy,
      choices:[
        { label:'坚持每周跑步', hint:'+💪 +😊 +🧠', fn: g => { g.flags.exerciseTherapy=true; g.flags.regularRunner=true; return{health:15,mood:12,intel:5}; }},
        { label:'尝试瑜伽', hint:'+💪 +😊', fn: g => { g.flags.exerciseTherapy=true; g.flags.yogaPractice=true; return{health:10,mood:10}; }},
        { label:'办了健身卡', hint:'-💰 +💪', fn: g => { g.flags.exerciseTherapy=true; g.flags.gymMember=true; return{money:-3000,health:12}; }},
      ]},
    { id:'art_therapy', icon:'🎨', title:'艺术疗愈',
      body:'你参加了一个艺术疗愈工作坊。\n\n老师发给每个人一张白纸和一盒蜡笔。她说：「画什么都行，不用好看。」\n\n你画了一团黑色的漩涡。你盯着它看了很久——那是你最近的心情。\n\n旁边的人画了一片蓝色的大海。你说：「你画得好美。」她说：「我画的是我想要的平静。」\n\n你突然觉得：原来把情绪画出来，比说出来容易多了。\n\n老师最后说：「艺术不是技巧——是表达。」你看着自己那团黑色的漩涡，居然笑了。\n\n"艺术疗愈：不需要会画画——只需要愿意表达。"',
      cond: g => g.age >= 22 && !g.flags.artTherapy,
      choices:[
        { label:'继续参加工坊', hint:'-💰 +😊 +👥', fn: g => { g.flags.artTherapy=true; g.flags.artCommunity=true; return{money:-300,mood:12,social:8}; }},
        { label:'开始写日记', hint:'+🧠 +😊', fn: g => { g.flags.artTherapy=true; g.flags.journaling=true; return{intel:10,mood:8}; }},
        { label:'买了一盒画笔在家画', hint:'-💰 +😊', fn: g => { g.flags.artTherapy=true; return{money:-50,mood:10}; }},
      ]},
    { id:'burnout_recovery', icon:'🔥', title:'职业倦怠',
      body:'你已经连续3个月不想上班了。\n\n不是不想赚钱——是觉得上班没有意义。你每天做的事情像是西西弗斯推石头：推上去，滚下来，推上去，滚下来。\n\n你的领导说：「你最近状态不好。」你说：「我一直都这样。」其实你以前不是这样的。\n\n你请了一周假。你去了一个海边小镇，什么都没做。你看了3天海、睡了3天觉、发了3天呆。\n\n回来之后，你觉得好了一点——至少知道了自己需要休息。\n\n"职业倦怠：不是不够努力——是太久没有被认可。"',
      cond: g => g.age >= 25 && g.mood < 40 && g.job !== '待业中' && !g.flags.burnoutRecovery,
      choices:[
        { label:'和领导谈谈', hint:'+👥 +🧠', fn: g => { g.flags.burnoutRecovery=true; g.flags.workNegotiation=true; return{social:8,intel:5}; }},
        { label:'考虑换工作', hint:'+🧠 +😊', fn: g => { g.flags.burnoutRecovery=true; g.flags.careerRethink=true; return{intel:10,mood:5}; }},
        { label:'gap一下', hint:'-💰 +😊 +💪', fn: g => { g.flags.burnoutRecovery=true; g.flags.gapPeriod=true; return{money:-5000,mood:15,health:8}; }},
      ]},
    { id:'cbt_self_help', icon:'📝', title:'认知行为疗法',
      body:'你在网上发现了一个CBT（认知行为疗法）自助工具。\n\n它教你识别自己的「认知扭曲」：\n- 非黑即白思维：「如果考不好就全完了」\n- 过度概括：「我什么都做不好」\n- 读心术：「他一定觉得我很蠢」\n\n你发现自己每天都在做这些扭曲思考。你开始记录：今天想了什么 → 这是事实还是想法 → 有没有其他解释。\n\n一个月后，你发现自己没那么容易陷入负面思维了。不是因为问题消失了——而是你看待问题的方式变了。\n\n"CBT：不是改变想法——是改变想法的方式。"',
      cond: g => g.age >= 22 && (g.flags.anxietyAttack || g.flags.depressionFog) && !g.flags.cbtSelfHelp,
      choices:[
        { label:'每天记录思维日记', hint:'+🧠 +😊 +💪', fn: g => { g.flags.cbtSelfHelp=true; g.flags.thoughtDiary=true; return{intel:15,mood:10,health:5}; }},
        { label:'找专业CBT治疗师', hint:'-💰 +🧠 +💪', fn: g => { g.flags.cbtSelfHelp=true; g.flags.cbtTherapist=true; return{money:-800,intel:12,health:8}; }},
        { label:'了解一下就好', hint:'+🧠', fn: g => { g.flags.cbtSelfHelp=true; return{intel:8}; }},
      ]},
    { id:'emotional_journal', icon:'📓', title:'情绪日记',
      body:'你开始写情绪日记了。\n\n每天睡前5分钟，你给今天的心情打分（1-10分），然后写下3件让你有情绪波动的事。\n\n第一周你发现：你的情绪大多在3-5分之间。第二周你发现：让你开心的事越来越小——一杯好喝的咖啡、一朵好看的云、一条朋友的微信。\n\n第三周你发现：你的情绪平均分从3.2变成了4.8。不是生活变好了——是你开始注意到好的部分了。\n\n"情绪日记：不是记录心情——是给心情一个被看见的机会。"',
      cond: g => g.age >= 20 && !g.flags.emotionalJournal,
      choices:[
        { label:'坚持每天记录', hint:'+🧠 +😊 +💪', fn: g => { g.flags.emotionalJournal=true; g.flags.dailyJournal=true; return{intel:10,mood:10,health:5}; }},
        { label:'用App追踪情绪', hint:'+🧠 +😊', fn: g => { g.flags.emotionalJournal=true; g.flags.moodTrackingApp=true; return{intel:8,mood:8}; }},
        { label:'三天打鱼两天晒网', hint:'+🧠', fn: g => { g.flags.emotionalJournal=true; return{intel:5,mood:3}; }},
      ]},
    { id:'male_mental_health', icon:'🤐', title:'男人不能哭',
      body:'你在公司厕所里偷偷哭了一次。\n\n因为你不敢在办公室哭——「男人不能哭」。不敢在家哭——「你是家里的顶梁柱」。不敢在朋友面前哭——「大老爷们哭什么」。\n\n只有厕所隔间是你唯一安全的空间。你蹲在里面，无声地哭了10分钟。然后洗了把脸，回到工位上继续写PPT。\n\n你的同事问你：「你眼睛怎么红了？」你说：「上厕所的时候被洗手液溅到了。」\n\n"男性心理健康：不是男人不需要哭——是他们不知道在哪里可以哭。"',
      cond: g => g.age >= 22 && g.gender === 'male' && g.mood < 40 && !g.flags.maleMentalHealth,
      choices:[
        { label:'打破沉默，找人倾诉', hint:'+👥 +😊 +💪', fn: g => { g.flags.maleMentalHealth=true; g.flags.brokeSilence=true; return{social:12,mood:15,health:5}; }},
        { label:'寻求专业帮助', hint:'-💰 +💪 +🧠', fn: g => { g.flags.maleMentalHealth=true; g.flags.therapyStarted=true; return{money:-500,health:8,intel:8}; }},
        { label:'继续扛着', hint:'-💪 -😊', fn: g => { g.flags.maleMentalHealth=true; return{health:-10,mood:-8}; }},
      ]},
    { id:'self_compassion', icon:'💝', title:'自我关怀',
      body:'你看到一句话：「对自己好一点，你已经很努力了。」\n\n你愣住了。你一直在对别人好：对同事好、对家人好、对朋友好。但你从来没有对自己好过。\n\n你总是觉得自己不够好：不够有钱、不够聪明、不够好看、不够努力。你给自己打的分永远是最低的。\n\n今天你试着做了一件「对自己好」的事：给自己买了一束花。35块钱。\n\n你把花放在桌上，看着它笑了。这也许是最便宜的心理治疗。\n\n"自我关怀：不是自私——是在照顾了全世界之后，记得照顾自己。"',
      cond: g => g.age >= 25 && !g.flags.selfCompassion,
      choices:[
        { label:'每周做一件让自己开心的事', hint:'+😊 +💪 +🧠', fn: g => { g.flags.selfCompassion=true; g.flags.weeklySelfCare=true; return{mood:15,health:5,intel:8}; }},
        { label:'学会说「不」', hint:'+🧠 +😊', fn: g => { g.flags.selfCompassion=true; g.flags.boundarySetting=true; return{intel:10,mood:8}; }},
        { label:'给自己写一封信', hint:'+🧠 +😊', fn: g => { g.flags.selfCompassion=true; g.flags.selfLetter=true; return{intel:12,mood:10}; }},
      ]},
    { id:'support_group_join', icon:'🫂', title:'互助小组',
      body:'你加入了一个心理健康互助小组。\n\n第一次聚会来了8个人。有大学生、有职场新人、有全职妈妈、有退休老人。你们围坐一圈，轮流分享。\n\n一个女孩说：「我每天都觉得自己是个负担。」一个大叔说：「我失眠了两年。」一个妈妈说：「我对着孩子吼完就后悔。」\n\n轮到你了。你说：「我有时候不知道活着为了什么。」说完你觉得轻松了——因为这里没有人会说「想开点」。\n\n"互助小组：不是你帮我、我帮你——是让你知道自己不是一个人在战斗。"',
      cond: g => g.age >= 22 && (g.flags.anxietyAttack || g.flags.depressionFog || g.flags.socialAnxiety) && !g.flags.supportGroupJoin,
      choices:[
        { label:'定期参加聚会', hint:'+👥 +😊 +💪', fn: g => { g.flags.supportGroupJoin=true; g.flags.regularGroup=true; return{social:15,mood:12,health:5}; }},
        { label:'成为志愿者', hint:'+👥 +✨ +😊', fn: g => { g.flags.supportGroupJoin=true; g.flags.volunteerHelper=true; return{social:12,charm:8,mood:10}; }},
        { label:'线上参与就好', hint:'+👥 +🧠', fn: g => { g.flags.supportGroupJoin=true; return{social:8,intel:5}; }},
      ]},
    { id:'crisis_hotline', icon:'📞', title:'心理热线',
      body:'一个深夜，你拨通了心理援助热线。\n\n电话那头是一个温柔的声音：「您好，这里是心理援助热线，请问有什么可以帮您？」\n\n你沉默了10秒。然后你说：「我不太好。」她说：「没关系，慢慢说。」\n\n你说了30分钟。关于失眠、关于焦虑、关于觉得自己没用的那些夜晚。她没有给你建议，没有说「你应该」，只是一直在听。\n\n挂电话前她说：「谢谢你打这个电话。你愿意求助，本身就是一种力量。」\n\n你挂了电话，第一次觉得：也许，被倾听就是被治愈的开始。\n\n"心理热线：不是最后的选择——是第一个可以打给的陌生人。"',
      cond: g => g.age >= 20 && g.mood < 25 && !g.flags.crisisHotline,
      choices:[
        { label:'记住了这个号码', hint:'+🧠 +😊', fn: g => { g.flags.crisisHotline=true; g.flags.helpSeeker=true; return{intel:5,mood:12}; }},
        { label:'告诉朋友这个热线', hint:'+👥 +😊', fn: g => { g.flags.crisisHotline=true; g.flags.helpAdvocate=true; return{social:8,mood:8}; }},
        { label:'之后去预约了咨询', hint:'-💰 +💪 +🧠', fn: g => { g.flags.crisisHotline=true; g.flags.therapyStarted=true; return{money:-500,health:8,intel:10}; }},
      ]},
    // === v15.1 数字生活 + 平台经济 + 新职业 ===
    { id:'short_video_addiction_v3', icon:'📱', title:'短视频黑洞',
      body:'你打开抖音说「就看5分钟」——然后抬头已经过了2小时。\n\n你看了50个做饭视频、30个跳舞视频、20个段子、10个装修视频。你学到了什么？什么都没学到。\n\n但你停不下来。每次上划的时候，你的手指像是被施了魔法。\n\n你的眼睛开始发干、脖子开始酸痛。你的手机屏幕使用时间显示：平均每天5小时37分钟。\n\n你决定明天开始控制——明天再说。\n\n"短视频：不是你在刷视频——是视频在刷你。"',
      cond: g => g.age >= 18 && !g.flags.shortVideoAddiction,
      choices:[
        { label:'设置使用时间限制', hint:'+🧠 +💪', fn: g => { g.flags.shortVideoAddiction=true; g.flags.screenTimeLimit=true; return{intel:8,health:5,mood:3}; }},
        { label:'卸载App', hint:'+🧠 +😊 +💪', fn: g => { g.flags.shortVideoAddiction=true; g.flags.appDeleted=true; return{intel:10,mood:8,health:5}; }},
        { label:'继续刷', hint:'-💪 -🧠 +😊', fn: g => { g.flags.shortVideoAddiction=true; return{health:-5,intel:-3,mood:5}; }},
      ]},
    { id:'live_stream_shopping', icon:'🛒', title:'直播带货',
      body:'你看了一场直播带货。\n\n主播说：「3、2、1，上链接！最后500件！再不买就没了！」你的手指比你的大脑反应快——已经下单了。\n\n你买了：一个空气炸锅、一套护肤品、三件T恤、一箱芒果干。总花费：1200元。\n\n到货后你发现：空气炸锅太大了放不下、护肤品你过敏、T恤尺码不对、芒果干你根本不喜欢。\n\n你退了两件，但退货运费要自己出。你觉得自己被割了韭菜——但下个月你还是会看直播。\n\n"直播带货：买的不是商品——是「限时优惠」带来的虚假紧迫感。"',
      cond: g => g.age >= 20 && !g.flags.liveStreamShopping,
      choices:[
        { label:'理性消费，只买需要的', hint:'+🧠 +💰', fn: g => { g.flags.liveStreamShopping=true; g.flags.rationalShopper=true; return{intel:8,money:500}; }},
        { label:'也试试做直播卖货', hint:'+✨ +🧠', fn: g => { g.flags.liveStreamShopping=true; g.flags.triedLivestream=true; return{charm:8,intel:5}; }},
        { label:'冲动下单，开心就好', hint:'-💰 +😊', fn: g => { g.flags.liveStreamShopping=true; return{money:-1200,mood:8}; }},
      ]},
    { id:'delivery_rider', icon:'🛵', title:'外卖骑手的一天',
      body:'你为了体验生活（或者说为了赚钱），注册了外卖骑手。\n\n第一天：你接了20单，超时了5单，被投诉了2次。你的电动车没电了，你的手机快没电了，你快没力了。\n\n你算了一下：扣除油费、电动车租金、手机流量费，你一天赚了87块钱。\n\n一个顾客给了你差评，理由是「汤洒了一点」。你看着那条差评，想回复点什么——但你太累了。\n\n你终于明白了：那些「您的外卖已送达」的背后，是无数个在风雨中奔跑的人。\n\n"外卖骑手：不是选择了自由——是被困在了算法里。"',
      cond: g => g.age >= 20 && g.age <= 40 && !g.flags.deliveryRider,
      choices:[
        { label:'继续跑单，磨练效率', hint:'+💰 +💪 -🧠', fn: g => { g.flags.deliveryRider=true; g.flags.riderVeteran=true; return{money:3000,health:-5,intel:-3}; }},
        { label:'了解平台算法', hint:'+🧠 +✨', fn: g => { g.flags.deliveryRider=true; g.flags.algorithmAware=true; return{intel:12,charm:3}; }},
        { label:'体验结束，回到原来的生活', hint:'+🧠 +😊', fn: g => { g.flags.deliveryRider=true; return{intel:8,mood:5}; }},
      ]},
    { id:'self_media_creator', icon:'📹', title:'自媒体创业',
      body:'你决定做自媒体。\n\n你选了一个赛道（美食/科技/生活/情感），开始日更。第一个月：粉丝从0涨到37。第二个月：粉丝涨到120。第三个月：有一条视频突然爆了——5万播放。\n\n你兴奋得一夜没睡。然后你发现：那5万播放带来了2块钱的广告收入。\n\n你的家人问你：「做这个能赚钱吗？」你说：「在积累。」你心里想的是：「积累到什么时候呢？」\n\n"自媒体创业：看起来是自由职业——实际上是免费打工。但总有人能从0到1——为什么不能是你？"',
      cond: g => g.age >= 20 && g.age <= 40 && !g.flags.selfMediaCreator,
      choices:[
        { label:'坚持日更，等待爆发', hint:'+✨ +🧠 -💪', fn: g => { g.flags.selfMediaCreator=true; g.flags.contentCreator=true; g.flags.dailyUploader=true; return{charm:10,intel:8,health:-5}; }},
        { label:'学习运营技巧', hint:'+🧠 +✨', fn: g => { g.flags.selfMediaCreator=true; g.flags.contentCreator=true; g.flags.growthHacking=true; return{intel:12,charm:5}; }},
        { label:'当爱好做，不指望赚钱', hint:'+😊 +🧠', fn: g => { g.flags.selfMediaCreator=true; g.flags.contentCreator=true; return{mood:8,intel:5}; }},
      ]},
    { id:'ai_tools_usage', icon:'🤖', title:'AI工具革命',
      body:'你的同事用AI工具10分钟写完了你一天的报告。\n\n你震惊了。你问他：「你不怕被取代吗？」他说：「不是AI取代我——是会用AI的人取代不会用的人。」\n\n你开始学习使用各种AI工具：ChatGPT写文案、Midjourney做图片、Copilot写代码、Suno做音乐。\n\n你的效率翻了3倍。你的领导说：「你最近进步很大。」你没有告诉他——你一半的工作是AI做的。\n\n你偶尔会想：如果AI什么都能做，那我的价值是什么？\n\n"AI工具：不是你的对手——是你的外骨骼。但脱了外骨骼，你还剩什么？"',
      cond: g => g.age >= 20 && g.age <= 50 && !g.flags.aiToolsUsage,
      choices:[
        { label:'深度学习AI技能', hint:'+🧠 +✨', fn: g => { g.flags.aiToolsUsage=true; g.flags.aiExpert=true; return{intel:15,charm:8}; }},
        { label:'适度使用，保持思考', hint:'+🧠 +💪', fn: g => { g.flags.aiToolsUsage=true; g.flags.balancedAI=true; return{intel:10,health:3}; }},
        { label:'抗拒新技术', hint:'-🧠 +😊', fn: g => { g.flags.aiToolsUsage=true; g.flags.techResistant=true; return{intel:-5,mood:3}; }},
      ]},
    { id:'digital_nomad_v5', icon:'🌍', title:'数字游民',
      body:'你辞掉了大城市的工作，成了数字游民。\n\n你带着笔记本电脑，去了大理。你在洱海边的咖啡馆工作，上午写代码，下午看日落。\n\n你的月收入从15000变成了8000。但你的房租从4000变成了1200。你的生活质量——你觉得提高了。\n\n你的父母不理解：「好好的工作不干，跑去云南玩？」你说：「我不是在玩——我在生活。」\n\n你在大理认识了一群和你一样的数字游民。你们组了一个共享办公空间。你们叫它「云上办公室」。\n\n"数字游民：不是逃避现实——是选择了另一种现实。"',
      cond: g => g.age >= 25 && g.age <= 40 && g.intel >= 40 && !g.flags.digitalNomad,
      choices:[
        { label:'享受游民生活', hint:'+😊 +💪 -💰', fn: g => { g.flags.digitalNomad=true; g.flags.nomadLifestyle=true; return{mood:15,health:8,money:-3000}; }},
        { label:'建立远程工作网络', hint:'+👥 +✨ +🧠', fn: g => { g.flags.digitalNomad=true; g.flags.remoteNetwork=true; return{social:10,charm:8,intel:8}; }},
        { label:'体验后回城', hint:'+🧠 +😊', fn: g => { g.flags.digitalNomad=true; return{intel:10,mood:8}; }},
      ]},
    { id:'online_course_v2', icon:'📚', title:'知识付费',
      body:'你花2999买了一个在线课程。\n\n课程介绍写着：「30天精通XXX，从入门到年薪百万！」你心动了——付款的时候手都没抖。\n\n第一周你认真学了3天。第二周学了1天。第三周打开了一次。第四周你忘了密码。\n\n你的课程完成度：12%。你的知识增长：约等于0。你的钱包减少了：2999。\n\n你的收藏夹里有200多个「稍后再看」——你一个都没看。\n\n"知识付费：买的不是知识——是「我在学习」的安慰感。"',
      cond: g => g.age >= 20 && !g.flags.onlineCourse,
      choices:[
        { label:'这次认真学完', hint:'+🧠 +💪', fn: g => { g.flags.onlineCourse=true; g.flags.courseCompleter=true; return{intel:15,health:-3}; }},
        { label:'选一个免费替代', hint:'+🧠 +💰', fn: g => { g.flags.onlineCourse=true; g.flags.freeLearner=true; return{intel:10,money:500}; }},
        { label:'算了，当交学费了', hint:'+🧠', fn: g => { g.flags.onlineCourse=true; return{intel:5}; }},
      ]},
    { id:'ride_hailing_driver', icon:'🚗', title:'网约车司机',
      body:'你下班后开始跑网约车，赚点外快。\n\n晚上8点上线，跑到凌晨1点。5个小时，接了12单，流水180元。扣掉油费和平台抽成，到手110元。\n\n你遇到了各种乘客：一个喝醉的大哥吐在了你车上、一个情侣在你后座吵架、一个大妈让你帮她搬行李上楼。\n\n一个乘客问你：「师傅，你这么年轻怎么也跑网约车？」你说：「赚点零花钱。」他说：「我也是。」\n\n你们相视一笑。两个为了生活多跑一圈的人。\n\n"网约车：不是在开车——是在用方向盘丈量生活。"',
      cond: g => g.age >= 22 && g.age <= 50 && !g.flags.rideHailingDriver,
      choices:[
        { label:'坚持每天跑', hint:'+💰 -💪 +🧠', fn: g => { g.flags.rideHailingDriver=true; g.flags.fulltimeRideHail=true; return{money:5000,health:-8,intel:3}; }},
        { label:'周末跑跑就好', hint:'+💰 +😊', fn: g => { g.flags.rideHailingDriver=true; return{money:2000,mood:5}; }},
        { label:'体验生活，不跑了', hint:'+🧠 +😊', fn: g => { g.flags.rideHailingDriver=true; return{intel:8,mood:3}; }},
      ]},
    { id:'social_credit_anxiety', icon:'📊', title:'信用评分',
      body:'你查了一下自己的芝麻信用分：658。\n\n你的朋友说他810分。你突然觉得——自己好像被评分系统审判了。\n\n你的信用分影响了：能不能免押金租车、能不能先享后付、能不能获得更好的贷款利率。\n\n你开始刻意维护信用：按时还款、多使用花呗、不逾期。你觉得自己不是在管理信用——是信用在管理你。\n\n你的一个朋友说：「我从来不查信用分。」你说：「你是怎么活到现在的？」\n\n"信用评分：不是你在被评估——是你的整个生活在被量化。"',
      cond: g => g.age >= 22 && !g.flags.socialCreditAnxiety,
      choices:[
        { label:'精心维护信用', hint:'+🧠 +💰', fn: g => { g.flags.socialCreditAnxiety=true; g.flags.creditOptimizer=true; return{intel:8,money:500}; }},
        { label:'正常使用就好', hint:'+🧠 +😊', fn: g => { g.flags.socialCreditAnxiety=true; return{intel:5,mood:5}; }},
        { label:'不太在意这些', hint:'+😊 -🧠', fn: g => { g.flags.socialCreditAnxiety=true; return{mood:5,intel:-3}; }},
      ]},
    { id:'online_to_offline', icon:'🤝', title:'网友见面',
      body:'你和一个认识了一年的网友决定线下见面。\n\n你们在一个咖啡馆见面。他/她和照片上不太一样——但你觉得更真实了。\n\n你们聊了很多：从共同的兴趣爱好，到各自的工作生活。你发现——线上聊得来的人，线下未必尴尬。\n\n但也有点不一样：线上你说话很风趣，线下你有点紧张。线上他/她打字很快，线下他/她说话会结巴。\n\n你们告别的时候，他/她说：「下次再约？」你说：「好。」\n\n"网友见面：不是验证照片——是验证感觉。"',
      cond: g => g.age >= 20 && !g.flags.onlineToOffline,
      choices:[
        { label:'发展线下友谊', hint:'+👥 +😊 +✨', fn: g => { g.flags.onlineToOffline=true; g.flags.offlineFriend=true; return{social:12,mood:10,charm:5}; }},
        { label:'保持线上就好', hint:'+👥 +🧠', fn: g => { g.flags.onlineToOffline=true; return{social:5,intel:3}; }},
        { label:'不太合适', hint:'-👥 +🧠', fn: g => { g.flags.onlineToOffline=true; return{social:-3,intel:5}; }},
      ]},
    { id:'gig_economy_v2', icon:'💼', title:'零工经济',
      body:'你同时做着三份零工：白天自由撰稿、晚上教英语、周末做摄影助理。\n\n你的月收入不稳定：好的时候12000，差的时候3000。你没有社保、没有公积金、没有带薪假。\n\n你的朋友问你：「你为什么不去找个正经工作？」你说：「自由。」\n\n但你心里知道：自由的代价是不确定。你每个月都在担心下个月的钱从哪来。\n\n你的日程表上写满了不同的项目。你觉得自己在创业——但又觉得自己在打零工。\n\n"零工经济：不是自由职业——是自由地不自由。但如果你能找到节奏——那才是真正的自由。"',
      cond: g => g.age >= 22 && g.age <= 40 && !g.flags.gigEconomy,
      choices:[
        { label:'专注一个领域深耕', hint:'+🧠 +✨ +💰', fn: g => { g.flags.gigEconomy=true; g.flags.specialist=true; return{intel:12,charm:8,money:3000}; }},
        { label:'继续多线并行', hint:'+💰 -💪 +🧠', fn: g => { g.flags.gigEconomy=true; g.flags.multiTasker=true; return{money:5000,health:-8,intel:5}; }},
        { label:'考虑找稳定工作', hint:'+🧠 +😊', fn: g => { g.flags.gigEconomy=true; g.flags.stabilitySeeker=true; return{intel:8,mood:5}; }},
      ]},
    { id:'privacy_concern', icon:'🔒', title:'隐私焦虑',
      body:'你收到了一条精准推送的广告——你昨天晚上刚和朋友聊过这个话题。\n\n你确定你没有搜索过这个东西。你开始怀疑：手机在监听我说话吗？\n\n你检查了App权限：某外卖App要了你的通讯录权限、某天气App要了你的相册权限、某计算器App要了你的麦克风权限。\n\n你震惊了：一个计算器为什么要用我的麦克风？\n\n你关掉了大部分权限。但你知道——在互联网时代，隐私就像空气：你知道它重要，但你也知道你在不断失去它。\n\n"隐私焦虑：不是被害妄想——是在大数据时代，你已经是透明的了。"',
      cond: g => g.age >= 20 && !g.flags.privacyConcern,
      choices:[
        { label:'严格管理App权限', hint:'+🧠 +💪', fn: g => { g.flags.privacyConcern=true; g.flags.privacyGuardian=true; return{intel:10,health:3}; }},
        { label:'减少个人信息暴露', hint:'+🧠 +😊', fn: g => { g.flags.privacyConcern=true; g.flags.minimalData=true; return{intel:8,mood:5}; }},
        { label:'算了，反正也没什么好泄露的', hint:'+😊 -🧠', fn: g => { g.flags.privacyConcern=true; return{mood:3,intel:-3}; }},
      ]},
    // === v15.2 社交文化 + 人情世故 + 网络生态 ===
    { id:'dinner_party_culture', icon:'🍻', title:'饭局文化',
      body:'你的领导叫你去参加一个饭局。\n\n桌上有8个人：你的领导、领导的领导、领导的领导的客户、以及你——一个负责倒酒的小角色。\n\n你学到了饭局礼仪：敬酒要低于对方的杯子、等领导先动筷子、别在饭桌上谈正事——正事都是饭后单独说的。\n\n你喝了半斤白酒，胃翻了一晚上。第二天你问同事：「昨天饭局谈成了吗？」同事说：「成不成不重要——重要的是让领导开心了。」\n\n"饭局文化：不是在吃饭——是在吃人情世故。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.dinnerParty,
      choices:[
        { label:'学会饭局技巧', hint:'+👥 +✨ +🧠', fn: g => { g.flags.dinnerParty=true; g.flags.socialSavvy=true; return{social:10,charm:8,intel:5}; }},
        { label:'拒绝无意义的饭局', hint:'+🧠 +😊 -👥', fn: g => { g.flags.dinnerParty=true; g.flags.boundarySetter=true; return{intel:8,mood:5,social:-5}; }},
        { label:'硬着头皮参加', hint:'+👥 -💪', fn: g => { g.flags.dinnerParty=true; return{social:5,health:-5}; }},
      ]},
    { id:'gift_giving_anxiety', icon:'🎁', title:'送礼焦虑',
      body:'中秋节到了，你开始焦虑送什么礼物。\n\n给父母送什么？给丈母娘/公婆送什么？给领导送什么？给客户送什么？给帮过忙的同事送什么？\n\n你列了一张清单：8个人，预算5000。你纠结了3天：月饼太普通、茶叶太贵、保健品太假、红包太直接。\n\n最后你花了4800块，送了一圈。你觉得每个人都不太满意——但你已经尽力了。\n\n你的一个朋友说：「我今年谁都没送。」你震惊地看着他：「你不怕得罪人？」他说：「真正的关系不需要月饼来维持。」\n\n"送礼焦虑：不是不知道送什么——是害怕送错了影响关系。"',
      cond: g => g.age >= 22 && !g.flags.giftGivingAnxiety,
      choices:[
        { label:'精心挑选每份礼物', hint:'-💰 +👥 +✨', fn: g => { g.flags.giftGivingAnxiety=true; g.flags.giftMaster=true; return{money:-3000,social:10,charm:5}; }},
        { label:'只送重要的人', hint:'-💰 +🧠', fn: g => { g.flags.giftGivingAnxiety=true; return{money:-1000,intel:5}; }},
        { label:'今年不送了', hint:'+💰 -👥', fn: g => { g.flags.giftGivingAnxiety=true; g.flags.noGift=true; return{money:500,social:-5}; }},
      ]},
    { id:'cyberbullying_victim', icon:'💻', title:'网络暴力',
      body:'你在网上发表了一个观点，然后被网暴了。\n\n你的微博评论里全是骂你的：「你是不是傻」「这智商也好意思发言」「人肉他」。你删了那条微博，但已经有人截图了。\n\n你一整天都在看那些评论，每看一条就难过一次。你的手指不受控制地继续看——像是在自虐。\n\n你的一个朋友说：「别看了，那些人都是键盘侠。」但你知道——每一条恶评都是一个真实的人打的。\n\n你关掉了评论通知。但那些话，已经在你的脑子里了。\n\n"网络暴力：屏幕那边的人忘了你是人——而你也快忘了他们是人。"',
      cond: g => g.age >= 18 && !g.flags.cyberbullyingVictim,
      choices:[
        { label:'学会不在意', hint:'+🧠 +💪', fn: g => { g.flags.cyberbullyingVictim=true; g.flags.thickSkin=true; return{intel:8,health:3}; }},
        { label:'减少社交媒体使用', hint:'+💪 +😊 +🧠', fn: g => { g.flags.cyberbullyingVictim=true; g.flags.socialMediaBreak=true; return{health:8,mood:10,intel:5}; }},
        { label:'反击回去', hint:'+✨ -😊', fn: g => { g.flags.cyberbullyingVictim=true; g.flags.fighter=true; return{charm:5,mood:-8}; }},
      ]},
    { id:'information_bubble', icon:'🫧', title:'信息茧房',
      body:'你发现——你和你的朋友看到的新闻完全不一样。\n\n你看到的都是「经济向好」「科技突破」「国货崛起」。他看到的都是「裁员潮」「房价下跌」「消费降级」。\n\n你们在同一个城市、同一年龄段、做着类似的工作——但你们活在两个完全不同的信息世界里。\n\n你试着看了他的推荐流——觉得全是负能量。他试着看了你的——觉得全是正能量。\n\n你们吵了一架。最后达成共识：也许真相在两者之间。\n\n"信息茧房：不是你选择了信息——是算法选择了你该看到什么。"',
      cond: g => g.age >= 20 && !g.flags.informationBubble,
      choices:[
        { label:'主动看不同观点', hint:'+🧠 +💪', fn: g => { g.flags.informationBubble=true; g.flags.criticalThinker=true; return{intel:15,health:3}; }},
        { label:'减少算法推荐', hint:'+🧠 +😊', fn: g => { g.flags.informationBubble=true; g.flags.algorithmResistant=true; return{intel:10,mood:5}; }},
        { label:'只看让自己舒服的', hint:'+😊 -🧠', fn: g => { g.flags.informationBubble=true; return{mood:5,intel:-5}; }},
      ]},
    { id:'colleague_competition', icon:'🏢', title:'同事内卷',
      body:'你的同事今天又加班到11点了。\n\n你本来打算6点下班，但看到他还亮着灯——你又坐了下来。你们组有5个人，每个人都在比谁走得晚。\n\n你的领导说：「你们不用比加班。」但他的绩效考核里，「工作态度」占了30%。\n\n你算了一下：你每天多待3小时，一个月多待66小时，一年多待800小时。换来的是什么？是一个「态度好」的评价和黑眼圈。\n\n你终于理解了什么叫「内卷」：不是你不努力——是你不敢不努力。\n\n"同事内卷：不是在竞争业绩——是在竞争谁更能忍。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.colleagueCompetition,
      choices:[
        { label:'提高效率，准点下班', hint:'+🧠 +💪 +😊', fn: g => { g.flags.colleagueCompetition=true; g.flags.efficiencyKing=true; return{intel:10,health:5,mood:8}; }},
        { label:'跟着卷', hint:'+💰 -💪 -😊', fn: g => { g.flags.colleagueCompetition=true; g.flags.overtimeWorker=true; return{money:2000,health:-10,mood:-8}; }},
        { label:'和领导谈谈', hint:'+👥 +🧠', fn: g => { g.flags.colleagueCompetition=true; g.flags.upwardCommunication=true; return{social:8,intel:5}; }},
      ]},
    { id:'keyboard_warrior', icon:'⌨️', title:'键盘侠时刻',
      body:'你在网上看到一条不公正的新闻，忍不住写了一篇长评。\n\n你写了500字，逻辑清晰、论据充分。你以为自己是在「理性讨论」。\n\n然后你发现——评论区里的人比你更愤怒。他们把你的评论转发到了各个群里，有人赞同你，也有人骂你。\n\n你的评论被顶上了热评第一。你收获了500个赞和200条骂你的回复。\n\n你突然意识到：你以为你在伸张正义，但在这个流量至上的时代，你的愤怒也变成了别人的娱乐。\n\n"键盘侠：不是每个在网上说话的人都是正义的——也不是每个正义的人都应该在网上说话。"',
      cond: g => g.age >= 18 && !g.flags.keyboardWarrior,
      choices:[
        { label:'继续理性发声', hint:'+✨ +🧠 +👥', fn: g => { g.flags.keyboardWarrior=true; g.flags.rationalVoice=true; return{charm:8,intel:8,social:5}; }},
        { label:'沉默是金', hint:'+🧠 +😊', fn: g => { g.flags.keyboardWarrior=true; g.flags.silentObserver=true; return{intel:10,mood:5}; }},
        { label:'删评道歉', hint:'-✨ +😊', fn: g => { g.flags.keyboardWarrior=true; return{charm:-3,mood:3}; }},
      ]},
    { id:'neighbor_dispute', icon:'🏘️', title:'邻里纠纷',
      body:'你楼上的邻居每晚11点开始拖家具。\n\n你上楼敲门，一个穿着睡衣的大叔开了门。你说：「能不能轻一点？」他说：「我孩子刚学会走路。」\n\n你说：「我理解，但我明天要上班。」他说：「我理解，但孩子不会理解。」\n\n你们互相理解了10分钟，什么都没解决。\n\n你后来买了耳塞。他在地板上铺了地毯。你们的关系从「敌对」变成了「互相忍让」。\n\n你在电梯里遇到他，他笑了笑。你也笑了笑。你们什么都没说——但都知道对方尽力了。\n\n"邻里关系：不是要成为朋友——是要学会互相容忍。"',
      cond: g => g.age >= 22 && !g.flags.neighborDispute,
      choices:[
        { label:'主动沟通解决', hint:'+👥 +🧠', fn: g => { g.flags.neighborDispute=true; g.flags.conflictResolver=true; return{social:8,intel:5}; }},
        { label:'找物业投诉', hint:'+🧠 -👥', fn: g => { g.flags.neighborDispute=true; return{intel:5,social:-3}; }},
        { label:'忍忍就过去了', hint:'+💪 -😊', fn: g => { g.flags.neighborDispute=true; return{health:3,mood:-5}; }},
      ]},
    { id:'favor_exchange', icon:'🤝', title:'人情债',
      body:'一个不太熟的朋友找你帮忙：「能不能帮我内推一下？」\n\n你帮他内推了。他没进。但你欠了你朋友一个人情。\n\n三个月后他又找你：「能不能帮我写个推荐信？」你写了。他用了，但没告诉你结果。\n\n六个月后他又找你：「能不能借我5000块？」你犹豫了。\n\n你开始理解什么叫「人情债」：不是欠了就要还——是还了还要欠。你帮了他三次，他不觉得欠你什么。但如果你拒绝第四次——他觉得你不仗义。\n\n"人情债：最难还的债不是钱——是那些你以为免费的好意。"',
      cond: g => g.age >= 22 && !g.flags.favorExchange,
      choices:[
        { label:'学会婉拒', hint:'+🧠 +😊', fn: g => { g.flags.favorExchange=true; g.flags.learnedToRefuse=true; return{intel:10,mood:5}; }},
        { label:'继续帮忙', hint:'+👥 -💰 +😊', fn: g => { g.flags.favorExchange=true; return{social:8,money:-5000,mood:3}; }},
        { label:'划清界限', hint:'+🧠 -👥', fn: g => { g.flags.favorExchange=true; g.flags.boundaryClear=true; return{intel:8,social:-5}; }},
      ]},
    { id:'wechat_group_fatigue', icon:'📱', title:'微信群疲劳',
      body:'你有47个微信群。\n\n工作群3个、家庭群2个、朋友群5个、业主群1个、拼团群3个、快递群2个、以及各种你已经忘了为什么加的群。\n\n每天你的手机震300次以上。大多数消息和你无关，但你不敢退出——因为万一有你相关的呢？\n\n你的一个前同事退出了所有非工作群。他说：「我终于安静了。」你羡慕地看着他——然后继续看群消息。\n\n"微信群：不是在社交——是在被社交绑架。但你不敢退出——因为你怕被遗忘。"',
      cond: g => g.age >= 20 && !g.flags.wechatGroupFatigue,
      choices:[
        { label:'退出无用群', hint:'+😊 +🧠 +💪', fn: g => { g.flags.wechatGroupFatigue=true; g.flags.groupCleaner=true; return{mood:10,intel:8,health:5}; }},
        { label:'全部静音', hint:'+😊 +🧠', fn: g => { g.flags.wechatGroupFatigue=true; g.flags.muteAll=true; return{mood:8,intel:5}; }},
        { label:'继续潜水', hint:'+🧠', fn: g => { g.flags.wechatGroupFatigue=true; return{intel:3}; }},
      ]},
    { id:'face_culture', icon:'🎭', title:'面子问题',
      body:'你的同学聚会，大家都在比。\n\n老张开的是奔驰、老李住的是别墅、老王的孩子考上了清华。你开的是电动车、住的是出租屋、你的孩子还在上幼儿园。\n\n你微笑着听他们聊天，心里五味杂陈。有人问你：「你现在做什么？」你说了一个普通的公司名字。他「哦」了一声就转了话题。\n\n回家的路上，你想：面子是什么？是别人看你的方式？还是你看自己的方式？\n\n你突然觉得：也许真正的体面不是开好车、住大房子——是对自己的选择感到坦然。\n\n"面子文化：不是你有面子——是面子有你。"',
      cond: g => g.age >= 25 && !g.flags.faceCulture,
      choices:[
        { label:'不在乎面子', hint:'+😊 +🧠 +💪', fn: g => { g.flags.faceCulture=true; g.flags.innerConfidence=true; return{mood:12,intel:10,health:3}; }},
        { label:'努力提升自己', hint:'+🧠 +💪 -💰', fn: g => { g.flags.faceCulture=true; g.flags.selfImprovement=true; return{intel:10,health:3,money:-2000}; }},
        { label:'减少这类聚会', hint:'+😊 +🧠', fn: g => { g.flags.faceCulture=true; g.flags.selectiveSocializing=true; return{mood:8,intel:5}; }},
      ]},
    // === v15.3 消费文化 + 极简主义 + 国潮热 ===
    { id:'double_eleven_v3', icon:'🛍️', title:'双十一狂欢',
      body:'双十一来了。你提前一周就开始加购物车。\n\n11月11日零点，你的手指以百米冲刺的速度点击「立即购买」。你买了：一件羽绒服（原价1200，折后680）、一套护肤品（买一送一）、一台扫地机器人（限时特价）。\n\n总消费：4200元。你觉得省了3000元——实际上你多花了4200元。\n\n快递到了之后，你发现：羽绒服太大了、护肤品和你现有的重复了、扫地机器人被你的地毯卡住了。\n\n你的购物车清空了，但你的钱包也清空了。\n\n"双十一：不是在省钱——是在用「省了多少」来合理化「花了多少」。"',
      cond: g => g.age >= 20 && !g.flags.doubleEleven,
      choices:[
        { label:'列好清单，理性购买', hint:'+🧠 +💰', fn: g => { g.flags.doubleEleven=true; g.flags.rationalBuyer=true; return{intel:10,money:1000}; }},
        { label:'只买最需要的1件', hint:'+🧠 +😊', fn: g => { g.flags.doubleEleven=true; g.flags.minimalBuyer=true; return{intel:8,mood:5}; }},
        { label:'冲冲冲，清空购物车', hint:'-💰 +😊', fn: g => { g.flags.doubleEleven=true; g.flags.impulseBuyer=true; return{money:-4200,mood:10}; }},
      ]},
    { id:'minimalism_journey', icon:'🧹', title:'极简主义',
      body:'你看了一个日本极简主义的视频，决定断舍离。\n\n你花了整个周末整理房间：扔了3袋衣服、2箱书、50个快递盒（你一直「留着以后用」的）。\n\n你的房间从「仓库」变成了「住所」。你发现：你拥有的东西比你需要的多3倍。\n\n你的室友看着空荡荡的客厅说：「你把沙发也扔了？」你说：「坐地上也挺好的。」他看着你，不确定你是在认真还是在发疯。\n\n一个月后，你发现：东西少了，心也轻了。\n\n"极简主义：不是什么都没有——是留下的都是重要的。"',
      cond: g => g.age >= 22 && !g.flags.minimalismJourney,
      choices:[
        { label:'坚持极简生活', hint:'+😊 +💪 +🧠', fn: g => { g.flags.minimalismJourney=true; g.flags.minimalist=true; return{mood:12,health:5,intel:10}; }},
        { label:'适度就好', hint:'+😊 +🧠', fn: g => { g.flags.minimalismJourney=true; g.flags.moderateMinimalist=true; return{mood:8,intel:8}; }},
        { label:'三天后又买回来了', hint:'-🧠 +😊', fn: g => { g.flags.minimalismJourney=true; return{intel:-3,mood:5}; }},
      ]},
    { id:'guochao_trend', icon:'🐉', title:'国潮热',
      body:'你买了一双李宁的球鞋——不是因为便宜，是因为真的好看。\n\n你发现：国产设计终于不再是「便宜替代品」了。李宁、安踏、鸿星尔克、花西子、完美日记——国货正在重新定义「时尚」。\n\n你穿着李宁去了同学聚会。一个穿Nike的同学问：「你这是李宁？」你说：「中国李宁。」他看了看你的鞋，说：「确实好看。」\n\n你觉得：支持国货不是为了爱国——是因为它们真的做得好了。\n\n"国潮：不是爱国情怀——是中国设计终于有了自己的语言。"',
      cond: g => g.age >= 18 && !g.flags.guochaoTrend,
      choices:[
        { label:'成为国货爱好者', hint:'+😊 +✨ +💰', fn: g => { g.flags.guochaoTrend=true; g.flags.domesticBrandFan=true; return{mood:8,charm:5,money:-500}; }},
        { label:'理性对比，选最好的', hint:'+🧠 +💰', fn: g => { g.flags.guochaoTrend=true; g.flags.rationalConsumer=true; return{intel:8,money:200}; }},
        { label:'还是喜欢国际品牌', hint:'+✨ -💰', fn: g => { g.flags.guochaoTrend=true; return{charm:3,money:-800}; }},
      ]},
    { id:'subscription_fatigue_v2', icon:'💳', title:'订阅疲劳',
      body:'你查了一下每月的自动扣费。\n\n视频会员3个（爱奇艺、腾讯、B站）、音乐会员2个（网易云、QQ音乐）、云存储2个（百度网盘、iCloud）、健身App、记账App、冥想App……\n\n总计：每月287元。你算了一下年费：3444元。你实际使用的：大概只有2个。\n\n你取消了8个订阅。你觉得自己像是给互联网打工的——每个月自动上交保护费。\n\n你的一个朋友说：「我什么都不订阅。」你说：「那你用什么？」他说：「借别人的。」你：「……」\n\n"订阅经济：看起来每个月只要几块钱——但加起来就是你工资的5%。"',
      cond: g => g.age >= 20 && !g.flags.subscriptionFatigueV2,
      choices:[
        { label:'精简到只留必需的', hint:'+💰 +🧠', fn: g => { g.flags.subscriptionFatigueV2=true; g.flags.subscriptionOptimizer=true; return{money:2000,intel:5}; }},
        { label:'和朋友共享账号', hint:'+💰 +👥', fn: g => { g.flags.subscriptionFatigueV2=true; g.flags.accountSharer=true; return{money:1500,social:5}; }},
        { label:'算了，都留着吧', hint:'-💰 +😊', fn: g => { g.flags.subscriptionFatigueV2=true; return{money:-2000,mood:3}; }},
      ]},
    { id:'second_hand_market', icon:'♻️', title:'二手经济',
      body:'你在闲鱼上卖了一台旧手机。\n\n你发现：二手市场比你想的大得多。有人卖旧衣服、旧书、旧电子产品、甚至还有「半瓶香水」和「用过一次的跑步机」。\n\n你也开始在闲鱼上买东西：一本绝版书（15元）、一台二手Switch（800元）、一个九成新的小米空气净化器（200元）。\n\n你算了一下：你在闲鱼上省了5000块，也赚了2000块。\n\n你的室友说：「你变了。」你说：「我没变——只是不想为不需要的溢价买单了。」\n\n"二手经济：不是穷——是聪明。好东西值得被第二次珍惜。"',
      cond: g => g.age >= 20 && !g.flags.secondHandMarket,
      choices:[
        { label:'买卖都用二手', hint:'+💰 +🧠 +😊', fn: g => { g.flags.secondHandMarket=true; g.flags.secondHandExpert=true; return{money:3000,intel:8,mood:5}; }},
        { label:'只卖不买', hint:'+💰 +🧠', fn: g => { g.flags.secondHandMarket=true; return{money:2000,intel:5}; }},
        { label:'还是喜欢新的', hint:'+😊 -💰', fn: g => { g.flags.secondHandMarket=true; return{mood:3,money:-500}; }},
      ]},
    { id:'brand_worship', icon:'👜', title:'品牌崇拜',
      body:'你攒了3个月的工资，买了一个LV的包。\n\n你背着它去了公司。一个同事注意到了：「哟，LV啊。」你觉得自己的身价好像涨了。\n\n但你心里知道：你的银行卡余额从8000变成了500。你下个月要吃泡面了。\n\n你的一个朋友问你：「你觉得这个包值这个价吗？」你说：「值不值不重要——背着它我觉得自信了。」\n\n他笑了笑：「自信不应该来自一个包。」你想了想——也许他说得对。\n\n"品牌崇拜：不是买了一个品牌——是买了一个你以为的自己。"',
      cond: g => g.age >= 22 && !g.flags.brandWorship,
      choices:[
        { label:'反思消费观', hint:'+🧠 +😊', fn: g => { g.flags.brandWorship=true; g.flags.consumerReflection=true; return{intel:12,mood:8}; }},
        { label:'继续努力赚钱买更多', hint:'-💰 +✨', fn: g => { g.flags.brandWorship=true; return{money:-5000,charm:8}; }},
        { label:'退掉包包', hint:'+💰 +🧠', fn: g => { g.flags.brandWorship=true; g.flags.returnBuyer=true; return{money:12000,intel:5}; }},
      ]},
    { id:'consumption_upgrade', icon:'📈', title:'消费升级',
      body:'你决定「对自己好一点」——开始消费升级。\n\n你把手磨咖啡从速溶换成了现磨、把外卖从15块的盒饭换成了30块的轻食、把出租屋的灯泡换成了智能灯。\n\n你的生活品质确实提高了。但你的月支出也从3000变成了6000。你的工资没变。\n\n你的理财顾问（一个App）说：「你的消费增速超过了收入增速。」你说：「我知道。」\n\n你陷入了一个两难：降低消费觉得委屈自己，维持消费觉得钱包委屈。\n\n"消费升级：不是生活变好了——是你对「好」的标准变高了。问题在于：标准只会越来越高。"',
      cond: g => g.age >= 22 && !g.flags.consumptionUpgrade,
      choices:[
        { label:'找到平衡点', hint:'+🧠 +😊 +💰', fn: g => { g.flags.consumptionUpgrade=true; g.flags.balancedConsumer=true; return{intel:10,mood:8,money:1000}; }},
        { label:'继续升级', hint:'+😊 -💰', fn: g => { g.flags.consumptionUpgrade=true; return{mood:10,money:-3000}; }},
        { label:'降回原来的水平', hint:'+💰 -😊', fn: g => { g.flags.consumptionUpgrade=true; g.flags.consumptionDowngrade=true; return{money:2000,mood:-5}; }},
      ]},
    { id:'experience_economy', icon:'🎪', title:'体验经济',
      body:'你决定把钱花在「体验」上，而不是「物品」上。\n\n你花500块看了一场演唱会、花800块体验了一次密室逃脱、花1200块学了3节冲浪课。\n\n你的存款没有增加，但你的回忆增加了很多。你有了一起尖叫的演唱会记忆、一起解谜的朋友、以及在海里被浪打翻的糗事。\n\n你的一个朋友说：「你花这些钱不心疼吗？」你说：「买一个包，三年后就旧了。但这些回忆，三十年后还在。」\n\n"体验经济：不是不花钱——是把钱花在了会增值的东西上：记忆。"',
      cond: g => g.age >= 20 && !g.flags.experienceEconomy,
      choices:[
        { label:'持续投资体验', hint:'+😊 +👥 +✨', fn: g => { g.flags.experienceEconomy=true; g.flags.experienceInvestor=true; return{mood:15,social:10,charm:8}; }},
        { label:'平衡体验和储蓄', hint:'+🧠 +😊', fn: g => { g.flags.experienceEconomy=true; g.flags.balancedSpending=true; return{intel:8,mood:10}; }},
        { label:'体验一次就好', hint:'+😊 +🧠', fn: g => { g.flags.experienceEconomy=true; return{mood:8,intel:5}; }},
      ]},
    { id:'financial_anxiety', icon:'📊', title:'理财焦虑',
      body:'你的同事说他今年基金赚了30%。\n\n你打开你的理财App：亏损2.7%。你看着绿色的数字，觉得自己的钱在慢慢消失。\n\n你开始研究各种理财产品：基金、股票、黄金、加密货币、国债。你每天看三次行情。你的情绪随着K线上下波动。\n\n你的一个朋友说：「你不理财，财不理你。」另一个朋友说：「你越理财，财越离你远。」\n\n你不知道该信谁。但你知道：不学习理财，你永远会焦虑。\n\n"理财焦虑：不是钱的问题——是你对未来的不确定感。而学习，是消除不确定感最好的方式。"',
      cond: g => g.age >= 22 && !g.flags.financialAnxiety,
      choices:[
        { label:'系统学习理财', hint:'+🧠 +💰', fn: g => { g.flags.financialAnxiety=true; g.flags.financialLearner=true; return{intel:15,money:2000}; }},
        { label:'定投指数基金', hint:'+🧠 +💰', fn: g => { g.flags.financialAnxiety=true; g.flags.indexInvestor=true; return{intel:8,money:1000}; }},
        { label:'不碰理财，存银行', hint:'+😊 -🧠', fn: g => { g.flags.financialAnxiety=true; return{mood:5,intel:-3}; }},
      ]},
    { id:'local_brand_discovery', icon:'🏪', title:'宝藏小店',
      body:'你在一条小巷子里发现了一家宝藏咖啡馆。\n\n老板是一个从上海回来的年轻人。他说：「我不想在大城市卷了，想开一家自己喜欢的店。」\n\n他的咖啡很好喝，蛋糕是他妈妈做的。店里只有6张桌子，每张桌子上都有一本书——是他推荐你看的。\n\n你在这里坐了一个下午。你看了半本书、喝了两杯咖啡、和老板聊了一小时。\n\n你觉得：这才是消费升级——不是买更贵的东西，而是找到更好的体验。\n\n"宝藏小店：不是在消费——是在支持另一种生活方式。"',
      cond: g => g.age >= 22 && !g.flags.localBrandDiscovery,
      choices:[
        { label:'成为常客', hint:'+😊 +👥 +🧠', fn: g => { g.flags.localBrandDiscovery=true; g.flags.localSupporter=true; return{mood:12,social:8,intel:5}; }},
        { label:'帮老板宣传', hint:'+👥 +✨', fn: g => { g.flags.localBrandDiscovery=true; g.flags.localPromoter=true; return{social:10,charm:8}; }},
        { label:'下次再来', hint:'+😊', fn: g => { g.flags.localBrandDiscovery=true; return{mood:8}; }},
      ]},
    // === v16.0 住房问题 + 城市生活 ===
    { id:'rental_nightmare', icon:'🏚️', title:'租房噩梦',
      body:'你的房东突然通知你：下个月涨租500。\n\n你看了看这个20平米的隔断间：没有窗户、共用厕所、隔音约等于零。你觉得它不值3500，更不值4000。\n\n你开始找房。链家、自如、蛋壳（已暴雷）、小区门口的牛皮癣广告。你看了10套房子：8套是假的、1套太贵、1套已经租出去了。\n\n你最终找到了一个稍微好一点的：3500，有窗户，独立厕所。但离公司远了40分钟。\n\n你搬了家。你的东西只有两个行李箱。你觉得——在大城市，你的全部家当就是两个箱子和一颗还在跳的心。\n\n"租房：不是你在选房子——是房子和房东在选你。"',
      cond: g => g.age >= 20 && !g.flags.hasHouse && !g.flags.rentalNightmare,
      choices:[
        { label:'学会和房东谈判', hint:'+🧠 +👥', fn: g => { g.flags.rentalNightmare=true; g.flags.negotiationSkill=true; return{intel:10,social:5}; }},
        { label:'搬去更远的地方', hint:'+💰 -😊 -💪', fn: g => { g.flags.rentalNightmare=true; g.flags.farCommuter=true; return{money:2000,mood:-8,health:-5}; }},
        { label:'找室友合租', hint:'+👥 +💰 -😊', fn: g => { g.flags.rentalNightmare=true; g.flags.housemateSearch=true; return{social:8,money:1500,mood:-3}; }},
      ]},
    { id:'housemate_conflict', icon:'🏠', title:'室友矛盾',
      body:'你的室友又把脏碗堆在水池里三天了。\n\n你们合租了半年。前3个月还好，后3个月你发现：他的脏衣服和你的干净衣服挂在同一个衣架上、他凌晨3点打游戏喊「冲啊」、他用你的洗洁精从来不买。\n\n你在微信群里发了条：「能不能注意点公共区域卫生？」他回了个「好的」——然后又堆了三天。\n\n你面临选择：继续忍、搬走、还是摊牌。\n\n"室友矛盾：不是谁对谁错——是两个不同的生活习惯住在了同一个屋檐下。"',
      cond: g => g.flags.housemateSearch && !g.flags.housemateConflict,
      choices:[
        { label:'制定室友公约', hint:'+🧠 +👥', fn: g => { g.flags.housemateConflict=true; g.flags.ruleMaker=true; return{intel:8,social:5}; }},
        { label:'搬出去独居', hint:'-💰 +😊 +💪', fn: g => { g.flags.housemateConflict=true; g.flags.soloLover=true; return{money:-3000,mood:10,health:5}; }},
        { label:'忍忍就过去了', hint:'+💪 -😊', fn: g => { g.flags.housemateConflict=true; return{health:3,mood:-8}; }},
      ]},
    { id:'property_management', icon:'🏢', title:'物业纠纷',
      body:'你小区的物业又涨价了。\n\n停车费从每月200涨到500、电梯经常坏、绿化变成了停车位、保安从4个变成了2个。但物业费不降反升。\n\n你和邻居们组了一个维权群。300个人在群里吐槽物业。你们决定联名投诉。\n\n但投诉需要2/3业主签字。有些人怕麻烦、有些人不在本地、有些人说「算了吧」。\n\n最终签了80个人的字。物业回复：「已收到反馈，会认真研究。」然后——就没有然后了。\n\n"物业纠纷：不是你交了物业费——是物业觉得你欠他钱。"',
      cond: g => g.age >= 25 && (g.flags.hasHouse || g.flags.rentalNightmare) && !g.flags.propertyManagement,
      choices:[
        { label:'继续维权', hint:'+👥 +🧠 +✨', fn: g => { g.flags.propertyManagement=true; g.flags.rightsDefender=true; return{social:12,intel:8,charm:5}; }},
        { label:'成立业委会', hint:'+👥 +🧠 +💪', fn: g => { g.flags.propertyManagement=true; g.flags.committeeLeader=true; return{social:15,intel:10,health:3}; }},
        { label:'算了，惹不起', hint:'+😊 -👥', fn: g => { g.flags.propertyManagement=true; return{mood:3,social:-3}; }},
      ]},
    { id:'home_renovation', icon:'🔨', title:'装修血泪史',
      body:'你决定装修你的房子/改造你的出租屋。\n\n你选了「全包」——以为可以省心。结果：工期从2个月拖到4个月、瓷砖颜色不对、柜子尺寸差了5厘米、工人把你的马桶装反了。\n\n你的预算从5万变成了8万。你的耐心从满格变成了0格。\n\n你学会了装修界的真理：「没有不超预算的装修，没有不后悔的选择。」\n\n但装修完成后，你站在自己的「新家」里——你觉得一切都值了。虽然马桶方向还是不太对。\n\n"装修：不是在改造房子——是在考验你对生活的耐心和钱包的厚度。"',
      cond: g => g.age >= 25 && !g.flags.homeRenovation,
      choices:[
        { label:'亲力亲为监督', hint:'+🧠 +💪 -😊', fn: g => { g.flags.homeRenovation=true; g.flags.renovated=true; g.flags.diyExpert=true; return{intel:12,health:3,mood:-5}; }},
        { label:'找靠谱设计师', hint:'-💰 +😊 +✨', fn: g => { g.flags.homeRenovation=true; g.flags.renovated=true; return{money:-8000,mood:10,charm:5}; }},
        { label:'简单收拾就好', hint:'+😊 +💰', fn: g => { g.flags.homeRenovation=true; g.flags.simpleRenovation=true; return{mood:5,money:2000}; }},
      ]},
    { id:'mortgage_pressure_v2', icon:'🏦', title:'房贷压力',
      body:'你终于买了房。然后你发现——噩梦才刚开始。\n\n月供8500，你的工资12000。你每个月剩下的钱只够吃饭和交通。你从「月光族」变成了「月供族」。\n\n你的朋友圈从旅游美食变成了「还贷打卡」。你的消费从星巴克变成了瑞幸，从瑞幸变成了公司免费的速溶咖啡。\n\n你的同事问你：「周末去哪玩？」你说：「在家。」因为出门就要花钱。\n\n但你看着房产证上的名字，觉得——值。至少这个城市里，有一个角落是完全属于你的。\n\n"房贷：不是30年的债务——是30年的安定感。代价是你30年不敢辞职。"',
      cond: g => g.flags.hasHouse && !g.flags.mortgagePressure,
      choices:[
        { label:'努力赚钱还贷', hint:'+💰 +💪 -😊', fn: g => { g.flags.mortgagePressure=true; g.flags.hardWorker=true; return{money:3000,health:3,mood:-8}; }},
        { label:'学会理财对冲', hint:'+🧠 +💰', fn: g => { g.flags.mortgagePressure=true; g.flags.financialLearner=true; return{intel:10,money:1000}; }},
        { label:'考虑出租一间房', hint:'+💰 +👥 -😊', fn: g => { g.flags.mortgagePressure=true; g.flags.landlord=true; return{money:3000,social:5,mood:-3}; }},
      ]},
    { id:'urban_village', icon:'🏘️', title:'城中村记忆',
      body:'你住了3年的城中村要拆迁了。\n\n这里是你在大城市第一个「家」：500块一个月的单间、楼下就是大排档、隔壁就是网吧。虽然脏乱差，但有人情味。\n\n你的房东阿姨每次收租都会多给你两个苹果。楼下的大叔会帮你收快递。巷子口的煎饼摊阿姨记得你不吃香菜。\n\n拆迁后，这些人都会散落在城市的各个角落。你问煎饼摊阿姨：「你以后去哪？」她说：「不知道，哪能摆就去哪。」\n\n你在拆迁前的最后一天，买了一个煎饼——多加了一个蛋。\n\n"城中村：不是脏乱差——是无数漂泊者的第一个落脚点。拆掉的是房子，拆不掉的是记忆。"',
      cond: g => g.age >= 20 && !g.flags.hasHouse && !g.flags.urbanVillage,
      choices:[
        { label:'拍下最后的照片', hint:'+😊 +🧠', fn: g => { g.flags.urbanVillage=true; g.flags.memoryKeeper=true; return{mood:12,intel:5}; }},
        { label:'和邻居们告别', hint:'+👥 +😊', fn: g => { g.flags.urbanVillage=true; g.flags.farewellParty=true; return{social:15,mood:10}; }},
        { label:'默默离开', hint:'-😊 +🧠', fn: g => { g.flags.urbanVillage=true; return{mood:-5,intel:8}; }},
      ]},
    { id:'moving_day_v2', icon:'📦', title:'搬家日记',
      body:'你今天搬家了。\n\n这是你来大城市后第7次搬家。你的东西越来越多，但你的朋友越来越少帮你搬了。\n\n你叫了一个货拉拉。司机帮你搬了3箱东西后说：「你是第几个搬这么多次的客户了。」你说：「我数都数不过来了。」\n\n你在新家摆好东西。墙上还空着——你挂了一幅从旧家带来的照片。那是你第一次来这个城市时拍的。\n\n你看着照片里的自己，觉得：搬了这么多次家，唯一不变的是——你还在。\n\n"搬家：不是换了一个地址——是换了一种生活。但有些东西，搬到哪都带着。"',
      cond: g => g.age >= 20 && !g.flags.movingDay,
      choices:[
        { label:'把新家布置得温馨', hint:'-💰 +😊 +💪', fn: g => { g.flags.movingDay=true; g.flags.homeDecorator=true; return{money:-500,mood:12,health:3}; }},
        { label:'将就住吧', hint:'+🧠 +💰', fn: g => { g.flags.movingDay=true; return{intel:5,money:300}; }},
        { label:'约朋友来暖房', hint:'+👥 +😊 -💰', fn: g => { g.flags.movingDay=true; g.flags.houseWarming=true; return{social:12,mood:10,money:-300}; }},
      ]},
    { id:'public_space_debate', icon:'🌳', title:'公共空间',
      body:'你家楼下的公园要被改建成商场了。\n\n你在业主群里看到了这个消息。你的反应是复杂的：商场意味着更便利的购物，但也意味着少了遛弯的地方。\n\n你参加了社区听证会。开发商说：「这是城市发展的需要。」一个老人说：「我在这个公园下了20年棋。」\n\n你发现：城市的发展，总是在「新」和「旧」之间做选择。而做选择的，往往不是住在里面的人。\n\n最终方案是：公园保留一半，商场建另一半。你觉得——也许这就是最好的妥协。\n\n"公共空间：不是空地——是城市的客厅。拆掉一个公园，就是拆掉一群人的日常。"',
      cond: g => g.age >= 25 && !g.flags.publicSpaceDebate,
      choices:[
        { label:'积极参与社区决策', hint:'+👥 +🧠 +✨', fn: g => { g.flags.publicSpaceDebate=true; g.flags.communityActivist=true; return{social:12,intel:10,charm:5}; }},
        { label:'支持发展', hint:'+🧠 +💰', fn: g => { g.flags.publicSpaceDebate=true; return{intel:5,money:500}; }},
        { label:'接受现实', hint:'+🧠 +😊', fn: g => { g.flags.publicSpaceDebate=true; return{intel:5,mood:3}; }},
      ]},
    { id:'city_identity', icon:'🏙️', title:'城市归属感',
      body:'你来这个城市已经5年了。\n\n你在这里有了工作、有了朋友、有了喜欢的餐馆和咖啡馆。你知道了哪条路最堵、哪家超市最便宜、哪个公园最适合跑步。\n\n但你没有户口、没有房子、没有「本地人」的身份。每次被问「你是哪里人」，你都会愣一下。\n\n你的老家回不去了——那里没有你的工作。这个城市留不下来——这里没有你的根。\n\n你突然理解了「漂」这个字：人在水上，既不在岸上，也不在水底。\n\n"城市归属感：不是你属于这个城市——是这个城市愿不愿意接纳你。"',
      cond: g => g.age >= 25 && !g.flags.cityIdentity,
      choices:[
        { label:'努力扎根', hint:'+💪 +🧠 +💰', fn: g => { g.flags.cityIdentity=true; g.flags.rootPlanter=true; return{health:5,intel:10,money:-3000}; }},
        { label:'享受漂泊', hint:'+😊 +🧠', fn: g => { g.flags.cityIdentity=true; g.flags.freeDrifter=true; return{mood:10,intel:8}; }},
        { label:'考虑回老家', hint:'+👥 +😊 -💰', fn: g => { g.flags.cityIdentity=true; g.flags.homeReturner=true; return{social:8,mood:5,money:-1000}; }},
      ]},
    { id:'community_garden_v2', icon:'🌻', title:'社区花园',
      body:'你发现小区楼下有一块空地，有人提议把它变成社区花园。\n\n你加入了。10个邻居一起翻了土、播了种、浇了水。3个月后，你们种出了番茄、辣椒、薄荷和向日葵。\n\n每天下班路过花园，你都会看看有没有新的变化。你的邻居阿姨教你怎么修剪番茄。你的小朋友邻居每天来数向日葵长高了几厘米。\n\n你发现：种菜让你和邻居从陌生人变成了朋友。城市里的社交，有时候不需要语言——只需要一盆共同照顾的花。\n\n"社区花园：不是种菜——是在水泥地里种人情味。"',
      cond: g => g.age >= 22 && !g.flags.communityGarden,
      choices:[
        { label:'成为核心成员', hint:'+👥 +😊 +💪', fn: g => { g.flags.communityGarden=true; g.flags.gardenLeader=true; return{social:15,mood:12,health:5}; }},
        { label:'偶尔帮忙', hint:'+👥 +😊', fn: g => { g.flags.communityGarden=true; return{social:8,mood:8}; }},
        { label:'看看就好', hint:'+🧠', fn: g => { g.flags.communityGarden=true; return{intel:5}; }},
      ]},
    { id:'night_city', icon:'🌃', title:'城市夜生活',
      body:'你第一次认真逛了逛这个城市的夜晚。\n\n凌晨1点的烧烤摊、24小时便利店、通宵营业的网吧、凌晨还在送外卖的骑手。\n\n你在一个路边摊坐下，点了一碗馄饨。老板说：「年轻人，怎么这么晚？」你说：「睡不着。」他说：「来我这吃碗馄饨，就能睡着了。」\n\n你吃完了馄饨。确实——暖了胃，也就暖了心。\n\n你走回家的路上，看到这个城市的另一面：它不只是写字楼和地铁——还有深夜的温暖和凌晨的人情味。\n\n"城市夜生活：不是在熬夜——是在寻找白天找不到的温暖。"',
      cond: g => g.age >= 20 && !g.flags.nightCity,
      choices:[
        { label:'成为深夜常客', hint:'+😊 +👥 +💪', fn: g => { g.flags.nightCity=true; g.flags.nightOwl=true; return{mood:10,social:8,health:-3}; }},
        { label:'偶尔出来走走', hint:'+😊 +🧠', fn: g => { g.flags.nightCity=true; return{mood:8,intel:5}; }},
        { label:'还是早点睡吧', hint:'+💪 +🧠', fn: g => { g.flags.nightCity=true; return{health:5,intel:3}; }},
      ]},
    // === v16.1 饮食文化 + 外卖生活 + 养生饮食 ===
    { id:'takeout_dependency', icon:'🥡', title:'外卖依赖症',
      body:'你打开外卖App，发现这个月已经点了87次外卖了。\n\n你的外卖历史：黄焖鸡、麻辣烫、盖浇饭、炒饭、面条。你的胃已经不认识「家常菜」三个字了。\n\n你算了笔账：每个月外卖花费2000元，一年24000元。这些钱够买一台不错的笔记本电脑了。\n\n你决定自己做一顿饭。你打开冰箱——里面只有一瓶过期牛奶和半根黄瓜。\n\n你默默关上冰箱，打开了外卖App。\n\n"外卖依赖：不是不会做饭——是做饭的时间成本太高了。至少你是这么安慰自己的。"',
      cond: g => g.age >= 20 && !g.flags.takeoutDependency,
      choices:[
        { label:'学做饭，减少外卖', hint:'+💪 +💰 +🧠', fn: g => { g.flags.takeoutDependency=true; g.flags.homeCook=true; return{health:10,money:2000,intel:8}; }},
        { label:'选择健康外卖', hint:'+💪 +🧠', fn: g => { g.flags.takeoutDependency=true; g.flags.healthyTakeout=true; return{health:5,intel:5}; }},
        { label:'继续点，人生苦短', hint:'+😊 -💪 -💰', fn: g => { g.flags.takeoutDependency=true; return{mood:5,health:-8,money:-1000}; }},
      ]},
    { id:'coffee_culture', icon:'☕', title:'咖啡续命',
      body:'你今天喝了第4杯咖啡。\n\n你的手开始抖、心跳加速、胃开始泛酸。你知道不能再喝了——但你的大脑说「再来一杯」。\n\n你算了算这个月的咖啡账单：星巴克12杯（480元）、瑞幸20杯（300元）、公司免费咖啡无数杯。\n\n你的同事说：「你是用咖啡驱动的机器。」你说：「不是——我是用咖啡因维持生命的植物人。」\n\n你决定明天开始减量。明天的你喝了两杯——已经是进步了。\n\n"咖啡文化：不是在喝咖啡——是在用咖啡因偿还昨晚欠的睡眠债。"',
      cond: g => g.age >= 22 && !g.flags.coffeeCulture,
      choices:[
        { label:'控制每天1杯', hint:'+💪 +💰 +🧠', fn: g => { g.flags.coffeeCulture=true; g.flags.coffeeModerator=true; return{health:5,money:500,intel:5}; }},
        { label:'改喝茶', hint:'+💪 +🧠 +😊', fn: g => { g.flags.coffeeCulture=true; g.flags.teaDrinker=true; return{health:8,intel:5,mood:3}; }},
        { label:'继续咖啡续命', hint:'+🧠 -💪', fn: g => { g.flags.coffeeCulture=true; return{intel:3,health:-5}; }},
      ]},
    { id:'milk_tea_addiction', icon:'🧋', title:'奶茶续命',
      body:'你路过一家奶茶店。\n\n你心里说「不喝」。你的腿说「买一杯」。你的手已经打开了支付宝。\n\n你点了一杯「多肉葡萄」，少糖、去冰、加珍珠加椰果加芋圆。你喝了一口——世界美好了。\n\n你看了下热量：680大卡。相当于跑步1小时。你决定——明天再跑。\n\n你的办公桌上有5个空奶茶杯。你的同事说：「你这是开奶茶品鉴会呢？」你说：「我在做市场调研。」\n\n"奶茶：不是在喝饮料——是在用糖分给疲惫的生活加一点甜。"',
      cond: g => g.age >= 18 && !g.flags.milkTeaAddiction,
      choices:[
        { label:'减少频率到每周1杯', hint:'+💪 +💰 +🧠', fn: g => { g.flags.milkTeaAddiction=true; g.flags.milkTeaController=true; return{health:5,money:300,intel:3}; }},
        { label:'学会自己做奶茶', hint:'+🧠 +💰 +😊', fn: g => { g.flags.milkTeaAddiction=true; g.flags.diyMilkTea=true; return{intel:8,money:200,mood:5}; }},
        { label:'快乐就好，不管了', hint:'+😊 -💪', fn: g => { g.flags.milkTeaAddiction=true; return{mood:8,health:-5}; }},
      ]},
    { id:'diet_anxiety', icon:'⚖️', title:'减肥焦虑',
      body:'你站上体重秤：比上个月重了3斤。\n\n你打开手机，搜索「最快减肥方法」：生酮饮食、间歇性断食、代餐奶昔、酵素减肥、拔罐减肥……你看得眼花缭乱。\n\n你办了健身卡（第3张了）、买了蛋白粉、下载了减肥App。你第一周减了2斤，第二周反弹了3斤。\n\n你的朋友圈里有人晒出了马甲线。你看了看自己的肚子——只有一个「一块腹肌」。\n\n你终于明白：减肥最难的不是管住嘴、迈开腿——是坚持。\n\n"减肥焦虑：不是你真的胖——是你对自己的标准太苛刻了。"',
      cond: g => g.age >= 20 && !g.flags.dietAnxiety,
      choices:[
        { label:'科学饮食+规律运动', hint:'+💪 +🧠 +😊', fn: g => { g.flags.dietAnxiety=true; g.flags.scientificDiet=true; return{health:15,intel:8,mood:8}; }},
        { label:'接受自己的身体', hint:'+😊 +🧠 +💪', fn: g => { g.flags.dietAnxiety=true; g.flags.bodyPositive=true; return{mood:15,intel:5,health:5}; }},
        { label:'尝试极端方法', hint:'-💪 -😊 +🧠', fn: g => { g.flags.dietAnxiety=true; g.flags.extremeDiet=true; return{health:-10,mood:-5,intel:3}; }},
      ]},
    { id:'precooked_food', icon:'🍱', title:'预制菜风波',
      body:'你发现你常点的外卖用的都是预制菜。\n\n你在网上查了一下：料理包、速冻菜、中央厨房统一配送。你的外卖不是「厨师做的」——是「工厂生产的」。\n\n你有点失望。你觉得——外卖的灵魂应该是「锅气」，而不是「防腐剂」。\n\n但你查了查价格：一份现炒菜要35元，一份预制菜只要15元。你的钱包告诉你：预制菜也挺好吃的。\n\n你安慰自己：「至少它是熟的。」\n\n"预制菜：不是你在吃饭——是食品工业在喂你。但它便宜——这就够了。"',
      cond: g => g.age >= 20 && !g.flags.precookedFood,
      choices:[
        { label:'自己做饭，吃新鲜的', hint:'+💪 +💰 +🧠', fn: g => { g.flags.precookedFood=true; g.flags.homeCook=true; return{health:10,money:1000,intel:5}; }},
        { label:'接受现实，省钱要紧', hint:'+💰 +🧠', fn: g => { g.flags.precookedFood=true; return{money:500,intel:3}; }},
        { label:'寻找现炒的小店', hint:'+😊 +💰', fn: g => { g.flags.precookedFood=true; g.flags.foodExplorer=true; return{mood:8,money:-500}; }},
      ]},
    { id:'drinking_culture', icon:'🍺', title:'酒桌文化',
      body:'公司聚餐，你的领导说：「来，走一个。」\n\n你不能喝酒——但在中国的职场，不喝酒等于「不合群」。你硬着头皮喝了三杯白酒。\n\n你的脸红了、头昏了、胃开始翻腾。你跑去了厕所吐了一场。\n\n回来后你的领导说：「能喝！好样的！」你觉得你的胃在哭泣，但你的职场评价在上涨。\n\n第二天你宿醉到中午。你发誓再也不喝了——直到下次聚餐。\n\n"酒桌文化：不是在喝酒——是在用酒精换取信任。但你的肝不需要信任——它需要休息。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.drinkingCulture,
      choices:[
        { label:'学会拒酒', hint:'+💪 +🧠 -👥', fn: g => { g.flags.drinkingCulture=true; g.flags.alcoholRefuser=true; return{health:8,intel:5,social:-5}; }},
        { label:'以茶代酒', hint:'+💪 +👥 +🧠', fn: g => { g.flags.drinkingCulture=true; g.flags.teaSubstitute=true; return{health:5,social:5,intel:5}; }},
        { label:'舍命陪君子', hint:'+👥 -💪', fn: g => { g.flags.drinkingCulture=true; return{social:8,health:-12}; }},
      ]},
    { id:'health_porridge', icon:'🥣', title:'养生粥',
      body:'你开始喝养生粥了。\n\n红枣枸杞粥、银耳莲子羹、山药薏米粥。你每天早上5点起来熬粥，比上班还准时。\n\n你的同事问你：「你是不是老了？」你说：「我不是老了——我是提前保养。」\n\n你的妈妈知道了很高兴：「终于不像以前那样天天吃外卖了。」她给你寄了一大箱枸杞和红枣。\n\n一个月后，你觉得自己的气色好了、精神好了、连便秘都改善了。\n\n你发了条朋友圈：「养生第一步：从一碗粥开始。」你的评论里全是：「你怎么突然变老了？」\n\n"养生粥：不是在喝粥——是在和身体和解。"',
      cond: g => g.age >= 25 && !g.flags.healthPorridge,
      choices:[
        { label:'坚持每天熬粥', hint:'+💪 +😊 +🧠', fn: g => { g.flags.healthPorridge=true; g.flags.dailyPorridge=true; return{health:12,mood:8,intel:5}; }},
        { label:'周末煲汤', hint:'+💪 +😊', fn: g => { g.flags.healthPorridge=true; g.flags.weekendSoup=true; return{health:8,mood:10}; }},
        { label:'三天热度', hint:'+🧠', fn: g => { g.flags.healthPorridge=true; return{intel:3}; }},
      ]},
    { id:'food_delivery_review', icon:'⭐', title:'外卖评分',
      body:'你今天的外卖迟到了40分钟。\n\n你打开App准备给差评。但你想了一下：骑手可能遇到了堵车、商家可能订单太多、也许他正在爬6楼给你送。\n\n你给了5星好评，写了一句：「辛苦了。」\n\n5分钟后，骑手给你回了条消息：「谢谢您的理解，祝您用餐愉快。」你看着这条消息，觉得——有时候，善良比正确更重要。\n\n"外卖评分：不是在评价食物——是在评价一个和你一样在努力生活的人。"',
      cond: g => g.age >= 20 && !g.flags.foodDeliveryReview,
      choices:[
        { label:'多给好评', hint:'+😊 +👥 +✨', fn: g => { g.flags.foodDeliveryReview=true; g.flags.kindReviewer=true; return{mood:10,social:5,charm:3}; }},
        { label:'客观评价', hint:'+🧠 +😊', fn: g => { g.flags.foodDeliveryReview=true; g.flags.fairReviewer=true; return{intel:5,mood:5}; }},
        { label:'该差评就差评', hint:'+🧠 -👥', fn: g => { g.flags.foodDeliveryReview=true; return{intel:3,social:-3}; }},
      ]},
    { id:'cooking_discovery', icon:'👨‍🍳', title:'厨艺觉醒',
      body:'你跟着B站教程做了一道红烧肉。\n\n你没想到——居然成功了！虽然颜色深了一点、糖多了一点、但味道居然还不错。\n\n你拍了张照发朋友圈。收获了100个赞和20条评论：「什么时候请我吃饭？」「你居然会做饭？」「看起来好好吃！」\n\n你的妈妈看到了，打来视频电话：「你放了几勺糖？酱油是什么牌子的？火候怎么样？」她指导了你30分钟。\n\n你突然觉得：做饭不只是一种技能——是一种连接。连接你和食材、连接你和厨房、连接你和远方教你做饭的妈妈。\n\n"厨艺觉醒：不是在做饭——是在用心生活。"',
      cond: g => g.age >= 22 && !g.flags.cookingDiscovery,
      choices:[
        { label:'每周做2次饭', hint:'+💪 +😊 +💰', fn: g => { g.flags.cookingDiscovery=true; g.flags.regularCook=true; return{health:10,mood:12,money:1000}; }},
        { label:'学做家乡菜', hint:'+😊 +👥 +🧠', fn: g => { g.flags.cookingDiscovery=true; g.flags.hometownCook=true; return{mood:15,social:5,intel:8}; }},
        { label:'偶尔做一次', hint:'+😊 +🧠', fn: g => { g.flags.cookingDiscovery=true; return{mood:8,intel:5}; }},
      ]},
    // === v16.2 交通出行 + 通勤日常 + 城市移动 ===
    { id:'subway_commute_v2', icon:'🚇', title:'地铁通勤',
      body:'你的通勤时间：单程1小时15分钟。\n\n每天早上7点，你挤进地铁。你和300个人共享一节车厢。你的脸贴着别人的后脑勺，你的包夹在两个人之间。\n\n你在地铁上做了很多事：听了500集播客、看了30本小说、刷了无数短视频、睡了无数次（到站时被叫醒的那种）。\n\n你的同事说：「你怎么不住公司附近？」你说：「公司附近的房租是我工资的60%。」\n\n你算了算：一年通勤时间=750小时=31天。你把人生的一个月花在了地铁上。\n\n"地铁通勤：不是在路上——是在用时间换房租。但地铁上的你，有时候比办公室的你更自由。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.subwayCommute,
      choices:[
        { label:'利用通勤时间学习', hint:'+🧠 +💪', fn: g => { g.flags.subwayCommute=true; g.flags.commuteLearner=true; return{intel:12,health:3}; }},
        { label:'找更近的房子', hint:'-💰 +😊 +💪', fn: g => { g.flags.subwayCommute=true; g.flags.nearbyRenter=true; return{money:-3000,mood:10,health:8}; }},
        { label:'习惯了就好', hint:'+🧠 +💪', fn: g => { g.flags.subwayCommute=true; return{intel:5,health:3}; }},
      ]},
    { id:'spring_festival_rush', icon:'🚄', title:'春运抢票',
      body:'春节还有15天，你开始抢火车票了。\n\n你开了3个闹钟、准备了2台手机、下载了4个抢票软件。12306在开售的第1秒——票就没了。\n\n你试了候补购票、试了中转方案、试了买长乘短。终于——你抢到了一张站票。\n\n24小时的站票。你带了一个小马扎、两桶泡面、三个充电宝。你在火车上站了12小时、坐了4小时（别人去厕所时蹭座）、睡了2小时（站着睡的）。\n\n到家的时候，你的腿已经不是你的了。但你妈妈做的红烧肉——让你觉得一切都值了。\n\n"春运：不是在回家——是在用身体的疲惫证明，家有多重要。"',
      cond: g => g.age >= 20 && g.flags.hasParents && !g.flags.springFestivalRush,
      choices:[
        { label:'提前买机票', hint:'-💰 +😊 +💪', fn: g => { g.flags.springFestivalRush=true; g.flags.flyHome=true; return{money:-2000,mood:10,health:5}; }},
        { label:'开车回家', hint:'-💰 +😊 +🧠', fn: g => { g.flags.springFestivalRush=true; g.flags.roadTrip=true; return{money:-1000,mood:8,intel:5}; }},
        { label:'今年不回去了', hint:'+💰 -😊 -👥', fn: g => { g.flags.springFestivalRush=true; g.flags.stayCity=true; return{money:3000,mood:-10,social:-5}; }},
      ]},
    { id:'shared_bike', icon:'🚲', title:'共享单车',
      body:'你骑共享单车去上班。\n\n早上的空气很清新，风很温柔。你穿过公园、经过河边、路过一排樱花树。你发现：骑车上班比地铁幸福100倍。\n\n但你骑到一半——下雨了。你淋着雨骑到了公司，头发湿了一半。你的同事说：「你怎么像从水里捞出来的？」\n\n你查了一下天气：今天降水概率90%。你查的时候已经迟到了。\n\n"共享单车：不是交通工具——是城市人的小确幸。当然，下雨天除外。"',
      cond: g => g.age >= 18 && !g.flags.sharedBike,
      choices:[
        { label:'坚持骑车通勤', hint:'+💪 +😊 -💰', fn: g => { g.flags.sharedBike=true; g.flags.bikeCommuter=true; return{health:10,mood:8,money:-200}; }},
        { label:'天气好就骑', hint:'+💪 +🧠', fn: g => { g.flags.sharedBike=true; g.flags.fairWeatherRider=true; return{health:5,intel:5}; }},
        { label:'还是坐地铁吧', hint:'+🧠', fn: g => { g.flags.sharedBike=true; return{intel:3}; }},
      ]},
    { id:'traffic_jam', icon:'🚗', title:'堵车日常',
      body:'你被堵在了高架上。\n\n导航显示：前方拥堵3公里，预计通行时间40分钟。你已经在这里停了20分钟了。\n\n你看着旁边车道的司机——他也在看你。你们交换了一个「同是天涯沦落人」的眼神。\n\n你打开广播，听到路况播报：「XX高架全线拥堵，建议绕行。」但所有路都堵了。\n\n你在车里听完了2集播客、回复了20条微信、吃了一包薯片。终于——车流开始动了。你到了公司，迟到了1小时。\n\n"堵车：不是你在等路——是路在等你。在大城市，堵车是一种集体修行。"',
      cond: g => g.age >= 22 && !g.flags.trafficJam,
      choices:[
        { label:'错峰出行', hint:'+🧠 +😊 +💪', fn: g => { g.flags.trafficJam=true; g.flags.offPeakCommuter=true; return{intel:8,mood:5,health:3}; }},
        { label:'改坐地铁', hint:'+🧠 +💰', fn: g => { g.flags.trafficJam=true; return{intel:5,money:300}; }},
        { label:'在车里听完一本有声书', hint:'+🧠 +😊', fn: g => { g.flags.trafficJam=true; g.flags.audioBookFan=true; return{intel:10,mood:5}; }},
      ]},
    { id:'high_speed_rail', icon:'🚅', title:'高铁出差',
      body:'你第一次坐高铁出差。\n\n350公里/小时的速度，窗外的风景像快进的电影。你从北京到上海只用了4.5小时。\n\n你在高铁上写完了PPT、看完了两份报告、吃了一盒盒饭（45元，味道约等于飞机餐打折版）。\n\n你突然感慨：以前绿皮火车要坐一夜的距离，现在只要半天。中国在提速——但你的工资没提速。\n\n你发了一条朋友圈：「高铁上的打工人。」配图是窗外的风景和你的笔记本电脑。收获了30个赞。\n\n"高铁：不是在缩短距离——是在缩短「想家」和「回家」之间的犹豫时间。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.highSpeedRail,
      choices:[
        { label:'享受高铁效率', hint:'+🧠 +✨ +😊', fn: g => { g.flags.highSpeedRail=true; g.flags.businessTraveler=true; return{intel:8,charm:5,mood:5}; }},
        { label:'在高铁上看风景发呆', hint:'+😊 +🧠', fn: g => { g.flags.highSpeedRail=true; return{mood:8,intel:5}; }},
        { label:'下次选卧铺火车', hint:'+😊 +💰', fn: g => { g.flags.highSpeedRail=true; return{mood:5,money:200}; }},
      ]},
    { id:'driving_test', icon:'🚙', title:'考驾照',
      body:'你决定考驾照。\n\n科目一：90分通过。你觉得很简单。\n科目二：第一次倒车入库压线了。教练说：「你是来学车的还是来学压线的？」\n科目三：你忘了打转向灯。考官的表情像是看到了外星人。\n科目四：85分通过。\n\n你终于拿到了驾照。你激动得差点把驾照掉地上。\n\n但你发现：有驾照和会开车是两回事。你拿到驾照后第一次上路，被出租车司机按了5次喇叭。\n\n"考驾照：不是在学开车——是在学如何被教练骂还不还嘴。"',
      cond: g => g.age >= 18 && !g.flags.drivingTest,
      choices:[
        { label:'经常练车', hint:'+💪 +🧠 +💰', fn: g => { g.flags.drivingTest=true; g.flags.hasDriversLicense=true; g.flags.regularDriver=true; return{health:3,intel:8,money:-500}; }},
        { label:'拿到证就好', hint:'+🧠 +😊', fn: g => { g.flags.drivingTest=true; g.flags.hasDriversLicense=true; return{intel:5,mood:8}; }},
        { label:'考虑放弃', hint:'-😊 +🧠', fn: g => { g.flags.drivingTest=true; return{mood:-5,intel:3}; }},
      ]},
    { id:'ebike_life', icon:'🛵', title:'电动车人生',
      body:'你买了一辆电动车——3000块，续航60公里。\n\n你觉得这是你今年最值的投资。你不再挤地铁、不再等公交、不再被堵车困住。你骑着电动车穿梭在城市的大街小巷，风吹在脸上，自由的感觉。\n\n但你也发现了电动车的烦恼：充电要找桩、雨天不敢骑、冬天续航减半、交警查头盔。\n\n你在等红灯的时候，旁边停了20辆电动车。你们像一排待飞的鸟——绿灯一亮，齐刷刷冲出去。\n\n"电动车：不是交通工具——是大城市打工人最后的倔强。"',
      cond: g => g.age >= 20 && !g.flags.ebikeLife,
      choices:[
        { label:'每天骑电动车上班', hint:'+💪 +💰 +😊', fn: g => { g.flags.ebikeLife=true; g.flags.ebikeDaily=true; return{health:8,money:1000,mood:8}; }},
        { label:'周末骑车探索城市', hint:'+😊 +🧠 +💪', fn: g => { g.flags.ebikeLife=true; g.flags.cityExplorer=true; return{mood:12,intel:5,health:5}; }},
        { label:'只是代步用', hint:'+💰 +🧠', fn: g => { g.flags.ebikeLife=true; return{money:500,intel:3}; }},
      ]},
    { id:'night_bus', icon:'🚌', title:'夜班车',
      body:'加班到凌晨1点，你赶上了最后一班夜班车。\n\n车上只有5个人：一个打瞌睡的白领、一个看书的大学生、一个戴着耳机的年轻人、一个提着工具箱的工人，还有你。\n\n你们谁都没说话。城市的灯光从窗外流过。夜班车慢慢开过空荡荡的街道，像一艘在夜色中航行的船。\n\n你看着车窗上映出的自己——疲惫，但还在坚持。\n\n你到家的时候已经1:40了。你洗了个澡，躺在床上想：明天还要早起。\n\n"夜班车：不是最舒适的交通——但载着的都是最努力的人。"',
      cond: g => g.age >= 22 && g.job !== '待业中' && !g.flags.nightBus,
      choices:[
        { label:'在车上看看书', hint:'+🧠 +😊', fn: g => { g.flags.nightBus=true; g.flags.nightReader=true; return{intel:8,mood:5}; }},
        { label:'打个盹休息', hint:'+💪 +😊', fn: g => { g.flags.nightBus=true; return{health:5,mood:5}; }},
        { label:'下次打车回家', hint:'-💰 +💪 +😊', fn: g => { g.flags.nightBus=true; return{money:-50,health:5,mood:8}; }},
      ]},
    { id:'car_buying_dilemma', icon:'🚗', title:'买车纠结',
      body:'你纠结了3个月：要不要买车？\n\n买车的好处：自由、方便、下雨天不淋雨。买车的坏处：车牌摇号2年没中、停车费每月800、油费每月1500、保险每年5000。\n\n你算了一笔账：养一辆车一年要花3万。你一年打车才花5000。\n\n你的同事说：「车是面子。」你的理财顾问说：「车是负债。」你的妈妈说：「有辆车，过年回家方便。」\n\n你最终的决定是——\n\n"买车纠结：不是在选车——是在选生活方式。每一种选择都有代价。"',
      cond: g => g.age >= 25 && g.money >= 50000 && !g.flags.carBuyingDilemma,
      choices:[
        { label:'买辆经济型车', hint:'-💰 +😊 +✨', fn: g => { g.flags.carBuyingDilemma=true; g.flags.carOwner=true; return{money:-80000,mood:12,charm:8}; }},
        { label:'买辆二手车', hint:'-💰 +🧠 +😊', fn: g => { g.flags.carBuyingDilemma=true; g.flags.usedCarOwner=true; return{money:-30000,intel:5,mood:8}; }},
        { label:'继续打车/骑车', hint:'+💰 +🧠', fn: g => { g.flags.carBuyingDilemma=true; g.flags.carFree=true; return{money:2000,intel:5}; }},
      ]},
    // === v16.3 文化娱乐 + 剧本杀 + 追星文化 ===
    { id:'script_murder', icon:'🔍', title:'剧本杀',
      body:'朋友拉你去玩剧本杀。\n\n你扮演一个民国时期的侦探。你的任务是找出凶手。你推理了4个小时，怀疑了每一个人——最后发现凶手是你自己。\n\n你的朋友笑得前仰后合：「你推理了半天，推理到自己头上。」你说：「这叫沉浸式体验。」\n\n你们玩到凌晨2点。你的嗓子哑了（因为一直在说话）、你的脑子乱了（因为一直在推理）、但你很开心。\n\n你发现：剧本杀最好玩的不是推理——是和朋友一起扮演另一个自己。\n\n"剧本杀：不是在游戏里找凶手——是在扮演中找到真实的自己。"',
      cond: g => g.age >= 20 && !g.flags.scriptMurder,
      choices:[
        { label:'成为剧本杀常客', hint:'+👥 +😊 +🧠', fn: g => { g.flags.scriptMurder=true; g.flags.regularPlayer=true; return{social:12,mood:10,intel:8}; }},
        { label:'尝试写剧本', hint:'+🧠 +✨ +💰', fn: g => { g.flags.scriptMurder=true; g.flags.scriptWriter=true; return{intel:15,charm:8,money:2000}; }},
        { label:'偶尔玩一次就好', hint:'+😊 +👥', fn: g => { g.flags.scriptMurder=true; return{mood:8,social:5}; }},
      ]},
    { id:'fangirl_fanboy', icon:'🌟', title:'追星文化',
      body:'你的同事是一个狂热的追星族。\n\n她的手机壁纸是偶像、手机壳是偶像、电脑桌面是偶像。她每个月花3000块买偶像的周边。她为了给偶像打榜，可以熬夜到凌晨3点。\n\n你问：「你图什么？」她说：「他让我觉得生活有盼头。」\n\n你不太理解。但后来你发现——每个人都有自己的「精神支柱」。有人靠咖啡续命，有人靠追星充电。\n\n你的同事在你生日那天送了你一张她偶像的签名照。你说：「我不追星。」她说：「没关系——我追你就够了。」\n\n"追星：不是在追一个人——是在追一个让自己开心的理由。"',
      cond: g => g.age >= 18 && !g.flags.fanCulture,
      choices:[
        { label:'理解并支持', hint:'+👥 +😊', fn: g => { g.flags.fanCulture=true; g.flags.supportiveFriend=true; return{social:8,mood:5}; }},
        { label:'也找个偶像', hint:'+😊 +✨', fn: g => { g.flags.fanCulture=true; g.flags.newFan=true; return{mood:10,charm:5}; }},
        { label:'觉得没必要', hint:'+🧠 -👥', fn: g => { g.flags.fanCulture=true; return{intel:5,social:-3}; }},
      ]},
    { id:'standup_comedy_v2', icon:'🎤', title:'脱口秀',
      body:'你去看了一场线下脱口秀。\n\n演员讲了1小时，你笑了59分钟。他说：「大城市打工人最辛苦的事是——笑着加班。」全场鼓掌。\n\n他说：「你以为你在追求梦想——其实你在追求不用加班的梦想。」你又鼓掌了。\n\n散场后你在路上想：他说的每一句话都是你的生活。原来把痛苦变成笑话——就是一种疗愈。\n\n你发了条朋友圈：「今晚笑到肚子疼。」配图是脱口秀门票。你的评论里全是：「在哪？下次带我！」\n\n"脱口秀：不是在讲笑话——是在用幽默化解生活的荒诞。"',
      cond: g => g.age >= 20 && !g.flags.standupComedy,
      choices:[
        { label:'成为脱口秀常客', hint:'+😊 +👥 +🧠', fn: g => { g.flags.standupComedy=true; g.flags.comedyFan=true; return{mood:15,social:8,intel:5}; }},
        { label:'尝试自己上台', hint:'+✨ +🧠 +👥', fn: g => { g.flags.standupComedy=true; g.flags.openMic=true; return{charm:12,intel:8,social:10}; }},
        { label:'看线上就好', hint:'+😊 +🧠', fn: g => { g.flags.standupComedy=true; return{mood:8,intel:5}; }},
      ]},
    { id:'mobile_game_addiction', icon:'🎮', title:'手游成瘾',
      body:'你开始玩一款新手游。\n\n第一周：每天1小时。第二周：每天3小时。第三周：你上班的时候也在偷偷玩。\n\n你的排位从青铜到了黄金、从黄金到了钻石。你的现实生活从钻石掉到了青铜。\n\n你的领导发现了你在开会时打游戏。他说：「你的KPI什么时候能像你的排位一样高？」\n\n你算了一下：你在游戏里花了400小时。如果这400小时用来学一门技能——你大概已经能转行了。\n\n"手游：不是在玩游戏——是在用虚拟的成就感替代现实的无力感。"',
      cond: g => g.age >= 18 && !g.flags.mobileGameAddiction,
      choices:[
        { label:'控制游戏时间', hint:'+🧠 +💪 +😊', fn: g => { g.flags.mobileGameAddiction=true; g.flags.gameController=true; return{intel:10,health:5,mood:3}; }},
        { label:'卸载游戏', hint:'+🧠 +💪 +💰', fn: g => { g.flags.mobileGameAddiction=true; g.flags.gameDeleted=true; return{intel:8,health:8,money:500}; }},
        { label:'继续冲分', hint:'+😊 -💪 -🧠', fn: g => { g.flags.mobileGameAddiction=true; return{mood:8,health:-8,intel:-5}; }},
      ]},
    { id:'escape_room_v3', icon:'🚪', title:'密室逃脱',
      body:'你和朋友们去玩了密室逃脱。\n\n你们选了「恐怖主题」。进去之后你就后悔了——黑漆漆的房间、突然弹出的NPC、诡异的音乐。\n\n你的朋友吓得抱住了你。你其实也怕——但你装作不怕。你们花了90分钟终于逃出来了。\n\n你在出口看到阳光的那一刻，觉得——外面的世界真好。\n\n你的一个朋友说：「下次还来吗？」你说：「来——但换个不那么吓人的主题。」\n\n"密室逃脱：不是在逃——是在恐惧中找到勇气。当然，有朋友在身边会更有勇气。"',
      cond: g => g.age >= 18 && !g.flags.escapeRoom,
      choices:[
        { label:'成为密室达人', hint:'+🧠 +👥 +😊', fn: g => { g.flags.escapeRoom=true; g.flags.escapeRoomExpert=true; return{intel:10,social:10,mood:8}; }},
        { label:'尝试设计密室', hint:'+🧠 +✨ +💰', fn: g => { g.flags.escapeRoom=true; g.flags.roomDesigner=true; return{intel:12,charm:5,money:1000}; }},
        { label:'下次选轻松主题', hint:'+😊 +👥', fn: g => { g.flags.escapeRoom=true; return{mood:8,social:5}; }},
      ]},
    { id:'movie_night', icon:'🎬', title:'电影之夜',
      body:'你一个人去看了一场电影。\n\n电影院里只有你和另外3个人。你选了最后一排的位置，买了一桶爆米花（一个人的份刚刚好）。\n\n电影讲的也是一个在大城市漂泊的年轻人。你看着看着，觉得那就是你自己。\n\n电影结束后，你坐在座位上没动。等字幕走完、等灯亮了、等其他人都走了——你才站起来。\n\n你走出电影院的时候，天已经黑了。城市的灯光比电影里的还亮。\n\n"一个人看电影：不是孤独——是和自己约会。"',
      cond: g => g.age >= 18 && !g.flags.movieNight,
      choices:[
        { label:'成为影迷', hint:'+🧠 +😊 +✨', fn: g => { g.flags.movieNight=true; g.flags.cinephile=true; return{intel:10,mood:10,charm:5}; }},
        { label:'约朋友一起看', hint:'+👥 +😊', fn: g => { g.flags.movieNight=true; return{social:8,mood:8}; }},
        { label:'回家写影评', hint:'+🧠 +✨ +😊', fn: g => { g.flags.movieNight=true; g.flags.filmCritic=true; return{intel:12,charm:8,mood:5}; }},
      ]},
    { id:'board_game_night', icon:'🎲', title:'桌游之夜',
      body:'你和几个朋友在家玩桌游。\n\n你们玩的是「卡坦岛」。你的一个朋友疯狂囤积羊毛，另一个垄断了砖块。你选择了外交路线——和每个人交易。\n\n游戏进行了3个小时。你们吵了4次、笑了无数次、吃了2袋薯片、喝了1箱啤酒。\n\n最终你赢了。你的一个朋友不服：「再来一局！」你说：「好——但这次我不当商人了，我要当海盗。」\n\n你发现：桌游最好的部分不是游戏——是和朋友们围坐在一起的时光。\n\n"桌游之夜：不是在玩游戏——是在用骰子和卡牌编织友谊。"',
      cond: g => g.age >= 20 && !g.flags.boardGameNight,
      choices:[
        { label:'组织定期桌游聚会', hint:'+👥 +😊 +🧠', fn: g => { g.flags.boardGameNight=true; g.flags.gameOrganizer=true; return{social:15,mood:12,intel:5}; }},
        { label:'收藏桌游', hint:'-💰 +🧠 +😊', fn: g => { g.flags.boardGameNight=true; g.flags.gameCollector=true; return{money:-500,intel:8,mood:8}; }},
        { label:'偶尔玩玩就好', hint:'+😊 +👥', fn: g => { g.flags.boardGameNight=true; return{mood:8,social:5}; }},
      ]},
    { id:'music_festival', icon:'🎵', title:'音乐节',
      body:'你去了一个户外音乐节。\n\n3万人、6个舞台、2天的音乐狂欢。你站在最前排，跟着节拍跳了3个小时。\n\n你的嗓子喊哑了、你的腿跳软了、你的手机没电了。但你觉得——这是今年最开心的时刻。\n\n你旁边的人你完全不认识，但你们一起合唱了同一首歌。那一刻，你们是最亲近的陌生人。\n\n散场的时候，你看着满地的垃圾和远处渐渐暗下去的舞台，想：音乐节的魔力不在于音乐——在于和3万人一起忘记了日常。\n\n"音乐节：不是去听歌——是去找到那个和你同频的世界。"',
      cond: g => g.age >= 18 && g.age <= 40 && !g.flags.musicFestival,
      choices:[
        { label:'成为音乐节常客', hint:'+😊 +👥 +✨', fn: g => { g.flags.musicFestival=true; g.flags.festivalRegular=true; return{mood:15,social:10,charm:8}; }},
        { label:'学一门乐器', hint:'+🧠 +✨ +💪', fn: g => { g.flags.musicFestival=true; g.flags.instrumentLearner=true; return{intel:12,charm:10,health:3}; }},
        { label:'线上看直播就好', hint:'+😊 +🧠', fn: g => { g.flags.musicFestival=true; return{mood:8,intel:5}; }},
      ]},
    { id:'book_club_v3', icon:'📚', title:'读书会',
      body:'你加入了一个读书会。\n\n每个月读一本书、线下讨论一次。这个月的书目是《百年孤独》。你读了3遍——第一遍没看懂、第二遍看了一半睡着了、第三遍终于看完了。\n\n讨论会上，一个退休的老教授说：「这本书讲的是孤独。」一个大学生说：「讲的是家族。」一个白领说：「讲的是时间。」\n\n你说：「讲的是每一个在大城市漂泊的人。」\n\n大家沉默了几秒。然后有人说：「说得真好。」\n\n"读书会：不是在读书——是在别人的故事里，找到自己的影子。"',
      cond: g => g.age >= 22 && !g.flags.bookClub,
      choices:[
        { label:'坚持每月参加', hint:'+🧠 +👥 +😊', fn: g => { g.flags.bookClub=true; g.flags.regularReader=true; return{intel:15,social:8,mood:8}; }},
        { label:'成为领读人', hint:'+🧠 +✨ +👥', fn: g => { g.flags.bookClub=true; g.flags.bookLeader=true; return{intel:12,charm:10,social:10}; }},
        { label:'自己看书就好', hint:'+🧠 +😊', fn: g => { g.flags.bookClub=true; return{intel:10,mood:5}; }},
      ]},
    // === v17.0 新增事件（教育体系 + 终身学习） ===
    { id:'gaokao_retry', icon:'📝', title:'高考复读', category:'education',
      body:'你没考上理想的大学。你妈说："复读一年吧，明年一定能考上985。"\n\n你坐在复读班的教室里，周围全是比你小一届的同学。每天6点起床、12点睡觉，做不完的试卷、背不完的单词。\n\n你的QQ签名改成了："明年，我一定可以。"\n\n但你心里清楚：复读不是重来一次——是带着上一次的伤疤再赌一次。\n\n"高考复读：不是输不起——是不甘心。"',
      cond: g => g.age >= 17 && g.age <= 20 && !g.flags.gaokaoRetry && g.intel < 70,
      choices:[
        { label:'咬牙复读一年', hint:'🎲 +🧠 -💰', fn: g => { g.flags.gaokaoRetry=true; if(g.intel>50&&Math.random()>0.4){g.intel+=20;g.flags.goodCollege=true;return{intel:15,mood:20,money:-15000}}else{return{intel:8,mood:-20,money:-15000}} }},
        { label:'去读大专学技术', hint:'+🧠 +💪', fn: g => { g.flags.gaokaoRetry=true; g.flags.vocationalSchool=true; return{intel:10,mood:5,health:5}; }},
        { label:'直接打工', hint:'+💰 -🧠', fn: g => { g.flags.gaokaoRetry=true; return{money:5000,mood:-10}; }},
      ]},
    { id:'grad_school_life', icon:'🎓', title:'研究生生活', category:'education',
      body:'你考上了研究生。\n\n你以为读研是每天看看书、写写论文、喝喝咖啡。实际上：\n\n- 导师让你帮他带孩子\n- 实验室的经费永远不够\n- 论文被拒了3次\n- 同门师兄弟内卷严重\n- 你一个月补贴3000块，还不够交房租\n\n你妈打电话问你："什么时候毕业啊？"\n\n"读研不是象牙塔——是高级打工。只不过老板叫导师。"',
      cond: g => g.flags.studyPassed && !g.flags.gradSchoolLife && g.age >= 22,
      choices:[
        { label:'努力发论文', hint:'+🧠 -💪', fn: g => { g.flags.gradSchoolLife=true; g.flags.paperPublished=true; return{intel:20,mood:-5,health:-8}; }},
        { label:'混个毕业证就行', hint:'+😊 -🧠', fn: g => { g.flags.gradSchoolLife=true; return{mood:10,intel:5}; }},
        { label:'退学去创业', hint:'🎲 +💰 -🧠', fn: g => { g.flags.gradSchoolLife=true; g.flags.dropout=true; g.flags.entrepreneur=true; setJob(g,'创业者',0); if(Math.random()>0.7){return{money:20000,mood:15}}else{return{money:-10000,mood:-15}} }},
      ]},
    { id:'study_abroad_dream_v2', icon:'✈️', title:'留学梦', category:'education',
      body:'你一直有个留学梦。看了那么多美剧和英剧，你觉得国外的教育一定更好。\n\n你查了查费用：\n- 英国一年硕士：30-50万\n- 美国两年硕士：60-100万\n- 日本两年修士：20-30万\n- 德国免学费：生活费15-20万\n\n你看了看银行卡余额：8万。\n\n你妈说："砸锅卖铁也供你。"你爸说："别去了，回来也找不到工作。"\n\n"留学是镀金还是镀银？取决于你回来后的第一份工作。"',
      cond: g => g.age >= 20 && g.age <= 30 && !g.flags.studyAbroad && g.money > 50000,
      choices:[
        { label:'去英国读一年硕', hint:'-💰💰 +🧠 +✨', fn: g => { g.flags.studyAbroad=true; g.flags.ukMaster=true; return{money:-350000,intel:25,charm:15,mood:15}; }},
        { label:'去德国读免费大学', hint:'-💰 +🧠 +💪', fn: g => { g.flags.studyAbroad=true; g.flags.germanStudy=true; return{money:-150000,intel:30,mood:10,health:5}; }},
        { label:'还是国内读吧', hint:'+😊 +💰', fn: g => { g.flags.studyAbroad=true; return{mood:5,money:5000}; }},
        { label:'贷款也要去', hint:'-💰💰💰 +🧠 +✨', fn: g => { g.flags.studyAbroad=true; g.flags.studyLoan=true; return{money:-200000,intel:25,charm:15,mood:10}; }},
      ]},
    { id:'cert_mania', icon:'📜', title:'考证狂人', category:'education',
      body:'你开始疯狂考证：CPA、CFA、PMP、法律职业资格、教师资格证……\n\n你的桌上堆满了教材，你的手机里全是网课App，你的周末比上班还忙。\n\n同事问你："考这么多证干嘛？"\n\n你说："艺多不压身。"\n\n但你心里知道：你不是在学东西——你是在用证书缓解焦虑。\n\n"考证是当代人的安慰剂：不是在学知识——是在买安心。"',
      cond: g => g.age >= 22 && !g.flags.certMania && g.intel > 60,
      choices:[
        { label:'一口气考3个证', hint:'+🧠 -💰 -💪', fn: g => { g.flags.certMania=true; g.flags.multiCert=true; return{intel:20,money:-25000,health:-10,mood:-5}; }},
        { label:'选一个最值钱的考', hint:'+🧠 -💰', fn: g => { g.flags.certMania=true; g.flags.keyCert=true; return{intel:15,money:-15000,mood:5}; }},
        { label:'算了，经验比证书重要', hint:'+😊 +💰', fn: g => { g.flags.certMania=true; return{mood:10,money:5000}; }},
      ]},
    { id:'part_time_mba', icon:'💼', title:'在职MBA', category:'education',
      body:'你的同事说："读个在职MBA吧，20万，两年。能认识很多人，升职也有用。"\n\n你算了一下：\n- 学费：20万\n- 每个周末上课：失去所有周末\n- 小组作业：比上班还累\n- 毕业论文：要写一篇案例分析\n\n你看了看课程表：战略管理、组织行为学、财务报表分析……每一门都像是在讲天书。\n\n"在职MBA：花20万认识一群和你一样焦虑的中产。"',
      cond: g => g.age >= 25 && g.age <= 40 && g.jobSalary >= 8000 && !g.flags.partTimeMBA && g.money > 100000,
      choices:[
        { label:'报名在职MBA', hint:'-💰💰 +🧠 +👥 +✨', fn: g => { g.flags.partTimeMBA=true; g.flags.mbaNetwork=true; return{money:-200000,intel:20,social:20,charm:10}; }},
        { label:'读个便宜点的EMBA', hint:'-💰 +🧠 +👥', fn: g => { g.flags.partTimeMBA=true; return{money:-80000,intel:12,social:10}; }},
        { label:'自学商业知识', hint:'+🧠 +😊', fn: g => { g.flags.partTimeMBA=true; return{intel:15,mood:5,money:3000}; }},
      ]},
    { id:'involution_edu', icon:'🌀', title:'教育内卷', category:'education',
      body:'你发现了一个奇怪的现象：\n\n- 小学学奥数的孩子，初中不一定成绩好\n- 初中上补习班的孩子，高中不一定能考上重点\n- 高中拼了命考985的孩子，大学毕业不一定能找到好工作\n- 读了985硕士的孩子，可能和双非本科在同一间办公室\n\n"教育就像一场军备竞赛：所有人都在加码，但没人知道终点在哪。"\n\n你开始怀疑：教育到底是在帮人——还是在淘汰人？',
      cond: g => g.age >= 20 && !g.flags.involutionEdu,
      choices:[
        { label:'跟着卷，不能输', hint:'+🧠 -💪 -💰', fn: g => { g.flags.involutionEdu=true; g.flags.joinInvolution=true; return{intel:12,health:-10,mood:-8,money:-10000}; }},
        { label:'躺平，按自己节奏来', hint:'+😊 +💪', fn: g => { g.flags.involutionEdu=true; g.flags.antiInvolution=true; return{mood:15,health:8}; }},
        { label:'换个赛道，不走寻常路', hint:'🎲 +✨', fn: g => { g.flags.involutionEdu=true; g.flags.altPath=true; return{charm:10,mood:5}; }},
      ]},
    { id:'tiger_parent', icon:'🐯', title:'鸡娃家长', category:'education',
      body:'你有了孩子，你也成了"鸡娃"家长。\n\n周末行程安排：\n- 周六上午：英语外教（200元/小时）\n- 周六下午：钢琴课（150元/小时）\n- 周日上午：奥数班（180元/小时）\n- 周日下午：编程课（160元/小时）\n\n你一年在孩子的教育上花了15万。\n\n你的孩子说："妈妈/爸爸，我好累。"\n\n你说："别人家的孩子都在学，你不学就落后了。"\n\n"鸡娃的本质：不是孩子需要——是家长焦虑。"',
      cond: g => g.flags.hasChild && g.age >= 30 && !g.flags.tigerParent && g.money > 50000,
      choices:[
        { label:'全力鸡娃，不能输在起跑线', hint:'-💰💰 +🧠', fn: g => { g.flags.tigerParent=true; g.flags.kidOverloaded=true; return{money:-80000,mood:-10,social:-5}; }},
        { label:'快乐教育，让孩子做自己喜欢的事', hint:'+😊 +👥', fn: g => { g.flags.tigerParent=true; g.flags.happyEducation=true; return{mood:15,social:8,money:-20000}; }},
        { label:'适度鸡娃，平衡发展', hint:'+🧠 +😊', fn: g => { g.flags.tigerParent=true; g.flags.balancedEdu=true; return{intel:5,mood:8,money:-40000}; }},
      ]},
    { id:'school_district_house_v3', icon:'🏠', title:'学区房焦虑', category:'education',
      body:'你的孩子要上小学了。你开始研究学区房。\n\n同一座城市：\n- 好学区的房价：10万/平\n- 普通学区的房价：4万/平\n\n差6万/平。50平的房子，差价300万。\n\n中介说："这个小区对口市重点，每年考上清北的比例是15%。"\n\n你算了算：300万的学区房 + 15%的清北概率 = 每个孩子2000万的清北成本。\n\n"学区房：不是在买房子——是在买一张概率彩票。"',
      cond: g => g.flags.hasChild && g.age >= 28 && !g.flags.schoolDistrictHouse && g.money > 200000,
      choices:[
        { label:'咬牙买学区房', hint:'-💰💰💰 +🧠', fn: g => { g.flags.schoolDistrictHouse=true; g.flags.goodSchool=true; return{money:-500000,mood:-10,social:5}; }},
        { label:'读私立国际学校', hint:'-💰💰 +✨', fn: g => { g.flags.schoolDistrictHouse=true; g.flags.internationalSchool=true; return{money:-300000,charm:10,mood:5}; }},
        { label:'就近入学，家庭氛围更重要', hint:'+😊 +💪', fn: g => { g.flags.schoolDistrictHouse=true; return{mood:15,health:5,money:10000}; }},
      ]},
    { id:'credential_fraud', icon:'🎭', title:'学历造假风波', category:'education',
      body:'你的同事被发现学历造假。\n\n他简历上写的是"某985大学硕士"，实际上是某野鸡大学的本科。他在公司干了3年，业绩一直不错。\n\nHR说："学历造假是原则问题，必须开除。"\n\n同事说："我做了3年的活，难道不比一张纸重要？"\n\n你在旁边看着，心想：在这个看学历的社会里，有多少人在用假面具活着？\n\n"学历造假：错不在能力——错在规则。"',
      cond: g => g.age >= 22 && !g.flags.credentialFraud,
      choices:[
        { label:'同情他，帮他求情', hint:'+👥 -✨', fn: g => { g.flags.credentialFraud=true; g.flags.helpedColleague=true; return{social:10,mood:-5,charm:-5}; }},
        { label:'规则就是规则', hint:'+✨ +🧠', fn: g => { g.flags.credentialFraud=true; return{charm:5,intel:5}; }},
        { label:'反思学历至上的文化', hint:'+🧠 +😊', fn: g => { g.flags.credentialFraud=true; return{intel:10,mood:5}; }},
      ]},
    { id:'slow_employment_v2', icon:'🐌', title:'慢就业', category:'education',
      body:'你毕业了，但你不想马上工作。\n\n你的同学都在疯狂投简历，你却想去旅行、去支教、去做志愿者、去gap一年。\n\n你妈说："别人都在找工作，你在干嘛？"\n\n你说："我在找自己。"\n\n你妈说："找自己能当饭吃吗？"\n\n"慢就业不是懒惰——是给自己一个想清楚的机会。但想清楚的代价，可能是落后于人。"',
      cond: g => g.age >= 21 && g.age <= 26 && !g.flags.slowEmployment,
      choices:[
        { label:'gap一年去旅行', hint:'-💰 +😊 +✨', fn: g => { g.flags.slowEmployment=true; g.flags.gapYear=true; return{money:-30000,mood:20,charm:15,social:10}; }},
        { label:'去做支教志愿者', hint:'-💰 +🧠 +👥', fn: g => { g.flags.slowEmployment=true; g.flags.volunteer=true; return{money:-10000,intel:15,social:15,mood:10}; }},
        { label:'还是先找工作吧', hint:'+💰 +🧠', fn: g => { g.flags.slowEmployment=true; setJob(g,'实习生',4000); return{money:3000,intel:5}; }},
      ]},
    { id:'postdoc_dilemma', icon:'🔬', title:'博士后困局', category:'education',
      body:'你博士毕业了。导师建议你做博士后："再做两年，发几篇顶刊，就能留校当老师了。"\n\n你看了看数据：\n- 博士后月薪：8000-15000\n- 博士后年限：2-4年\n- 留校概率：不到10%\n- 你的同学：已经年薪30万\n\n你35岁了，还在拿着一万出头的工资。你的同龄人已经买房买车结婚生子。\n\n"博士后：科研的尽头不是诺贝尔奖——是编制。"',
      cond: g => g.age >= 28 && g.flags.gradSchoolLife && g.intel > 85 && !g.flags.postdocDilemma,
      choices:[
        { label:'做博士后，赌一把留校', hint:'🎲 +🧠 -💰', fn: g => { g.flags.postdocDilemma=true; if(g.intel>90&&Math.random()>0.7){g.flags.universityTeacher=true;setJob(g,'大学讲师',12000);return{intel:20,mood:25}}else{return{intel:15,mood:-15,money:-20000}} }},
        { label:'去企业做研发', hint:'+💰 +🧠', fn: g => { g.flags.postdocDilemma=true; setJob(g,'研发工程师',25000); return{money:20000,intel:10,mood:10}; }},
        { label:'转行做科普博主', hint:'🎲 +✨ +👥', fn: g => { g.flags.postdocDilemma=true; g.flags.scienceBlogger=true; setJob(g,'自媒体人',0); if(Math.random()>0.5){return{charm:20,social:15,money:10000}}else{return{charm:5,mood:-10}} }},
      ]},
    { id:'gap_year_v2', icon:'🌍', title:'间隔年', category:'education',
      body:'你辞了职，决定给自己一年的间隔年。\n\n你的计划：\n- 3个月：东南亚背包旅行\n- 3个月：去大理/丽江住一段时间\n- 3个月：学一门新技能（编程/设计/写作）\n- 3个月：回国找工作\n\n你妈说："你这是逃避现实。"\n\n你说："我这是面对现实——只是换一种方式。"\n\n"间隔年：不是逃离生活——是找回生活。"',
      cond: g => g.age >= 22 && g.age <= 35 && g.money > 50000 && !g.flags.gapYear && g.job !== '待业中',
      choices:[
        { label:'去东南亚背包3个月', hint:'-💰 +😊 +✨ +👥', fn: g => { g.flags.gapYear=true; g.flags.backpacking=true; setJob(g,'待业中',0); return{money:-40000,mood:25,charm:15,social:15,health:5}; }},
        { label:'去大理隐居半年', hint:'-💰 +😊 +💪', fn: g => { g.flags.gapYear=true; g.flags.daliRetreat=true; setJob(g,'待业中',0); return{money:-30000,mood:20,health:15,intel:5}; }},
        { label:'算了，还是继续上班吧', hint:'+💰 +🧠', fn: g => { g.flags.gapYear=true; return{money:5000,intel:5}; }},
      ]},
    { id:'vocational_edu', icon:'🔧', title:'职业教育', category:'education',
      body:'你去参观了一所职业技术学院。\n\n你惊讶地发现：\n- 汽修专业的毕业生，月薪8000-15000\n- 电工专业的毕业生，时薪200-300\n- 烹饪专业的毕业生，很多人开了自己的店\n- 护理专业的毕业生，供不应求\n\n而你的985同学，很多人月薪6000，还在内卷。\n\n"职业教育不是低人一等——是换一条赛道。在这个赛道上，手艺比学历值钱。"',
      cond: g => g.age >= 18 && !g.flags.vocationalEdu,
      choices:[
        { label:'学一门技术（汽修/电工/烹饪）', hint:'+🧠 +💪 +💰', fn: g => { g.flags.vocationalEdu=true; g.flags.craftSkill=true; return{intel:10,health:5,mood:5}; }},
        { label:'还是继续走学历路线', hint:'+🧠 -💪', fn: g => { g.flags.vocationalEdu=true; return{intel:12,mood:-5}; }},
        { label:'技术和学历两手抓', hint:'+🧠 +💪 -💰', fn: g => { g.flags.vocationalEdu=true; g.flags.dualTrack=true; return{intel:15,health:3,money:-15000}; }},
      ]},
    { id:'academic_misconduct', icon:'⚖️', title:'学术不端', category:'education',
      body:'你发现你的同事/同学论文抄袭了。\n\n他用了别人的数据、改了几个字、换了个图表——然后发表在了核心期刊上。\n\n你举报还是不举报？\n\n举报：他会被撤稿、处分，甚至开除。但你也可能得罪他的导师/领导。\n不举报：你心里过不去，但你也不想惹麻烦。\n\n"学术不端：不是一个人的错——是整个评价体系在逼人造假。"',
      cond: g => g.age >= 22 && !g.flags.academicMisconduct && g.intel > 65,
      choices:[
        { label:'实名举报', hint:'+✨ -👥', fn: g => { g.flags.academicMisconduct=true; g.flags.whistleblower=true; return{charm:15,social:-10,mood:5}; }},
        { label:'匿名举报', hint:'+✨ +🧠', fn: g => { g.flags.academicMisconduct=true; g.flags.anonReport=true; return{charm:8,intel:5,mood:3}; }},
        { label:'多一事不如少一事', hint:'+👥 -✨', fn: g => { g.flags.academicMisconduct=true; return{social:5,mood:-10,charm:-5}; }},
      ]},
    { id:'adult_self_exam', icon:'📖', title:'成人自考', category:'education',
      body:'你决定参加成人自考，拿一个本科学历。\n\n你白天上班，晚上看书。你的同事不知道你在自考，你的家人以为你在加班。\n\n你报名了4门课，第一次考试过了3门。你高兴得像个孩子。\n\n你知道：这个学历在很多人眼里不算什么。但对你来说，它是你对自己的一种证明。\n\n"成人自考：不是为了别人——是为了那个曾经没考好的自己。"',
      cond: g => g.age >= 20 && !g.flags.adultSelfExam && g.intel < 70,
      choices:[
        { label:'坚持自考，一年拿证', hint:'+🧠 -💪 -💰', fn: g => { g.flags.adultSelfExam=true; g.flags.selfStudyDegree=true; return{intel:20,health:-8,mood:15,money:-8000}; }},
        { label:'报个网络教育', hint:'+🧠 -💰', fn: g => { g.flags.adultSelfExam=true; g.flags.onlineDegree=true; return{intel:12,money:-15000,mood:8}; }},
        { label:'算了，能力比学历重要', hint:'+😊 +💰', fn: g => { g.flags.adultSelfExam=true; return{mood:10,money:3000}; }},
      ]},
    { id:'online_course_scam', icon:'💻', title:'网课骗局', category:'education',
      body:'你在网上看到一个广告："3个月学会Python，月薪2万不是梦！"\n\n你花了9980块报了名。课程质量很差，老师照着PPT念，作业是抄代码。\n\n3个月后，你发现：你学会了print("Hello World")，但找不到工作。\n\n你想退款，客服说："你已经看了50%的课程，不能退。"\n\n"网课骗局：不是教你知识——是教你交智商税。"',
      cond: g => g.age >= 18 && g.age <= 40 && !g.flags.onlineCourseScam,
      choices:[
        { label:'维权退款', hint:'🎲 +💰 -😊', fn: g => { g.flags.onlineCourseScam=true; if(Math.random()>0.5){return{money:8000,mood:-5}}else{return{money:-2000,mood:-15}} }},
        { label:'算了，当交学费了', hint:'+🧠 +😊', fn: g => { g.flags.onlineCourseScam=true; return{intel:5,mood:-5,money:-1000}; }},
        { label:'自学才是正道（B站免费课）', hint:'+🧠 +😊', fn: g => { g.flags.onlineCourseScam=true; g.flags.selfTaughtCoder=true; return{intel:15,mood:8}; }},
      ]},
    { id:'declining_enrollment', icon:'📉', title:'考研人数下降', category:'education',
      body:'新闻说：今年考研报名人数比去年减少了50万。\n\n评论区：\n"读了3年研究生，出来发现工资还没本科同学高。"\n"考研不是唯一的出路——只是最贵的弯路。"\n"与其花3年读研，不如花3年积累经验。"\n\n但也有人说："研究生不只是学知识——是换一个圈子、换一种视野。"\n\n"考研降温：不是学历不值钱了——是大家算清楚了性价比。"',
      cond: g => g.age >= 20 && !g.flags.decliningEnrollment,
      choices:[
        { label:'还是决定考研', hint:'+🧠 -💰 -💪', fn: g => { g.flags.decliningEnrollment=true; g.flags.stillPursuing=true; return{intel:15,money:-10000,health:-5}; }},
        { label:'直接就业更务实', hint:'+💰 +😊', fn: g => { g.flags.decliningEnrollment=true; return{money:8000,mood:10}; }},
        { label:'边工作边考', hint:'+🧠 -💪 +💰', fn: g => { g.flags.decliningEnrollment=true; g.flags.workAndStudy=true; return{intel:10,health:-8,money:5000}; }},
      ]},
    { id:'phd_mental_health', icon:'🧠', title:'读博心理健康', category:'education',
      body:'你读博的第3年。\n\n你的状态：\n- 论文被拒了5次\n- 导师对你越来越不满意\n- 同门已经有人退学了\n- 你每天在实验室待12小时，但效率越来越低\n- 你开始失眠、焦虑、怀疑人生\n\n你在深夜刷到一条帖子："读博第4年，我差点没扛过去。"\n\n评论区有人说："你不是一个人。"\n\n"读博最难的不是学术——是心理。每一个博士生都在和自己的精神内耗作斗争。"',
      cond: g => g.flags.gradSchoolLife && g.age >= 25 && !g.flags.phdMentalHealth,
      choices:[
        { label:'寻求心理咨询帮助', hint:'+😊 +💪 +👥', fn: g => { g.flags.phdMentalHealth=true; g.flags.soughtHelp=true; return{mood:15,health:10,social:8}; }},
        { label:'咬牙坚持，再苦两年', hint:'+🧠 -💪 -😊', fn: g => { g.flags.phdMentalHealth=true; g.flags.grimPersevere=true; return{intel:10,health:-15,mood:-15}; }},
        { label:'退学，生命比学位重要', hint:'+😊 +💪 -🧠', fn: g => { g.flags.phdMentalHealth=true; g.flags.phdQuit=true; return{mood:20,health:15,intel:-5}; }},
      ]},
    { id:'lifelong_learning', icon:'🌱', title:'终身学习', category:'education',
      body:'你40岁了，但你还在学。\n\n你最近学了：\n- 用ChatGPT辅助工作\n- 用Midjourney做设计\n- 用Python自动化日常任务\n- 看Coursera上的AI课程\n\n你的同事说："你都40了，还折腾什么？"\n\n你说："不学就会被淘汰。不是和年轻人竞争——是和时代竞争。"\n\n"终身学习：不是因为好奇——是因为恐惧。恐惧被甩下、恐惧过时、恐惧变成自己曾经嘲笑的那种人。"',
      cond: g => g.age >= 35 && !g.flags.lifelongLearning && g.intel > 60,
      choices:[
        { label:'全面拥抱新技术', hint:'+🧠 +✨ +💪', fn: g => { g.flags.lifelongLearning=true; g.flags.techAdopter=true; return{intel:20,charm:10,health:5,mood:10}; }},
        { label:'学一门新语言', hint:'+🧠 +✨', fn: g => { g.flags.lifelongLearning=true; g.flags.newLanguage=true; return{intel:18,charm:12}; }},
        { label:'算了，经验够用了', hint:'+😊 -🧠', fn: g => { g.flags.lifelongLearning=true; return{mood:8,intel:-5}; }},
      ]},
    { id:'education_return', icon:'💰', title:'教育投资回报', category:'education',
      body:'你做了一次教育投资回报分析：\n\n- 本科4年花费：20万，毕业起薪6000/月\n- 硕士+2年花费：30万，毕业起薪10000/月\n- 博士+4年花费：50万，毕业起薪12000/月\n- 留学+1年花费：40万，毕业起薪12000/月\n\n你算了一下：硕士的投资回报期是5年，博士是10年，留学是8年。\n\n但你没算的是：青春、机会成本、心理压力。\n\n"教育投资回报率：用金钱算得出来——但用人生算不出来。"',
      cond: g => g.age >= 25 && !g.flags.educationReturn,
      choices:[
        { label:'继续投资自己（进修）', hint:'-💰 +🧠', fn: g => { g.flags.educationReturn=true; return{money:-30000,intel:15,mood:5}; }},
        { label:'赚钱比学历重要', hint:'+💰 +😊', fn: g => { g.flags.educationReturn=true; return{money:10000,mood:10}; }},
        { label:'平衡发展，两手都要抓', hint:'+🧠 +💰', fn: g => { g.flags.educationReturn=true; return{intel:8,money:5000,mood:5}; }},
      ]},
    // === v17.1 新增事件（节日文化 + 传统节日 + 假期生活） ===
    { id:'national_day_travel', icon:'🏖️', title:'国庆黄金周', category:'festival',
      body:'国庆7天长假到了。你的朋友圈变成了旅游摄影展：\n\n- 同事A在三亚晒太阳\n- 同事B在日本买买买\n- 同事C在大理发呆\n- 你在高速公路上堵了6个小时\n\n到了景区你发现：人比风景多。你拍了100张照片，99张都是别人的后脑勺。\n\n你在酒店躺了3天，吃外卖看剧。第4天你发了一条朋友圈："岁月静好。"\n\n"国庆旅游：不是在旅行——是在参加全国人民的大型集体活动。"',
      cond: g => !g.flags.nationalDayTravel,
      choices:[
        { label:'去热门景区人挤人', hint:'-💰 +😊 -💪', fn: g => { g.flags.nationalDayTravel=true; return{money:-8000,mood:10,health:-5}; }},
        { label:'宅家躺平7天', hint:'+😊 +💪 +💰', fn: g => { g.flags.nationalDayTravel=true; g.flags.holidaySlacker=true; return{mood:15,health:8,money:-2000}; }},
        { label:'错峰出行（请年假）', hint:'-💰 +😊 +✨', fn: g => { g.flags.nationalDayTravel=true; g.flags.offPeakTravel=true; return{money:-10000,mood:20,charm:5}; }},
      ]},
    { id:'diao_xiu', icon:'😤', title:'调休吐槽', category:'festival',
      body:'你看了看日历：这个月的周末被调休了。\n\n这意味着：\n- 这周连上6天班\n- 下周连上7天班\n- 下下周终于正常了——但下个假期又要调\n\n你在工位上发出了一声叹息。你的同事也叹了口气。整个办公室都在叹气。\n\n微博热搜第1名：#调休#\n评论区："调休不如不调""放假是假的，加班是真的""我宁愿不放假也不愿意连上7天"\n\n"调休：中国特色的放假方式——放了个假，又没完全放。"',
      cond: g => !g.flags.diaoXiu,
      choices:[
        { label:'默默忍受，继续上班', hint:'+💰 -😊 -💪', fn: g => { g.flags.diaoXiu=true; return{money:3000,mood:-10,health:-5}; }},
        { label:'请假一天凑个长假', hint:'-💰 +😊', fn: g => { g.flags.diaoXiu=true; return{money:-2000,mood:15}; }},
        { label:'发微博吐槽', hint:'+👥 +😊', fn: g => { g.flags.diaoXiu=true; g.flags.diaoXiuRanter=true; return{social:8,mood:5}; }},
      ]},
    { id:'qixi_valentine', icon:'💝', title:'七夕情人节', category:'festival',
      body:'七夕到了。朋友圈变成了撒狗粮大赛：\n\n- 有人收到了999朵玫瑰\n- 有人在高级餐厅吃烛光晚餐\n- 有人收到了13140元的转账\n- 你在加班\n\n你打开外卖软件，给自己点了一份双人套餐。外卖小哥说："祝您七夕快乐。"\n\n你笑了笑："谢谢，你也是。"\n\n"七夕不是关于爱情——是关于提醒你：你还没有爱情。"',
      cond: g => !g.flags.qixiValentine && g.age >= 18,
      choices:[
        { label:'给自己买个礼物', hint:'-💰 +😊 +✨', fn: g => { g.flags.qixiValentine=true; g.flags.selfLove=true; return{money:-2000,mood:15,charm:5}; }},
        { label:'约朋友一起过', hint:'+👥 +😊', fn: g => { g.flags.qixiValentine=true; return{social:10,mood:10}; }},
        { label:'假装今天不存在', hint:'+💰 +🧠', fn: g => { g.flags.qixiValentine=true; return{money:3000,intel:5}; }},
      ]},
    { id:'qingming_tomb', icon:'🕯️', title:'清明扫墓', category:'festival',
      body:'清明节，你回老家给爷爷扫墓。\n\n你站在墓前，看着墓碑上的名字。你想起了小时候爷爷带你去河边钓鱼、给你买糖葫芦、偷偷塞给你零花钱。\n\n你妈说："给你爷爷烧点纸钱。"\n\n你点了三根香，鞠了三个躬。你小声说："爷爷，我很好。就是有点想你。"\n\n风吹过，树叶沙沙作响。你觉得爷爷听到了。\n\n"清明不是悲伤的节日——是提醒我们：珍惜眼前人。"',
      cond: g => !g.flags.qingmingTomb && g.age >= 18,
      choices:[
        { label:'认真扫墓，陪伴家人', hint:'+👥 +😊', fn: g => { g.flags.qingmingTomb=true; return{social:10,mood:10,health:3}; }},
        { label:'顺便踏青赏花', hint:'+😊 +💪 +✨', fn: g => { g.flags.qingmingTomb=true; g.flags.springOuting=true; return{mood:15,health:8,charm:5}; }},
        { label:'太远了，网上祭奠', hint:'+😊 +🧠', fn: g => { g.flags.qingmingTomb=true; return{mood:5,intel:3}; }},
      ]},
    { id:'new_year_eve', icon:'🎆', title:'元旦跨年', category:'festival',
      body:'12月31日晚上11点59分。\n\n你和朋友站在广场上，跟着倒计时：10、9、8……\n\n烟花绽放的那一刻，你发了条朋友圈："新年快乐！希望新的一年一切顺利！"\n\n你的新年愿望：\n- 涨薪30%\n- 减肥10斤\n- 读完20本书\n- 找到一个爱你的人\n\n（去年你的愿望也差不多。但你不在乎。年年许同样的愿望，说明你年年有期待。）\n\n"跨年不是在庆祝新年——是在告别旧年的自己。"',
      cond: g => !g.flags.newYearEve,
      choices:[
        { label:'和朋友一起倒数', hint:'+👥 +😊 +✨', fn: g => { g.flags.newYearEve=true; return{social:12,mood:15,charm:5}; }},
        { label:'一个人安静跨年', hint:'+🧠 +😊', fn: g => { g.flags.newYearEve=true; g.flags.quietNewYear=true; return{intel:8,mood:10}; }},
        { label:'加班跨年（三倍工资）', hint:'+💰 -😊', fn: g => { g.flags.newYearEve=true; g.flags.overtimeNewYear=true; return{money:5000,mood:-10}; }},
      ]},
    { id:'double_eleven_shopping', icon:'🛒', title:'双十一剁手', category:'festival',
      body:'双十一零点，你的手已经准备好了。\n\n你的购物车里有37件商品，总价比平时便宜了2000块。你觉得自己赚到了。\n\n你在0点01分下了单。0点02分，你收到了快递短信——"您的包裹正在路上"。\n\n第二天你算了算：花了8000块，其中5000块是你不需要的东西。\n\n你看了看银行卡余额，决定——明年一定不买。\n\n（每年你都这么说。）\n\n"双十一：不是你占了商家的便宜——是商家占了你的便宜。"',
      cond: g => !g.flags.doubleElevenShopping,
      choices:[
        { label:'清空购物车！', hint:'-💰💰 +😊 +✨', fn: g => { g.flags.doubleElevenShopping=true; g.flags.bigSpender=true; return{money:-15000,mood:20,charm:5}; }},
        { label:'只买真正需要的', hint:'-💰 +🧠 +😊', fn: g => { g.flags.doubleElevenShopping=true; g.flags.smartShopper=true; return{money:-3000,intel:5,mood:8}; }},
        { label:'理性消费，什么都不买', hint:'+💰 +🧠', fn: g => { g.flags.doubleElevenShopping=true; g.flags.antiConsumer=true; return{money:2000,intel:8,mood:5}; }},
      ]},
    { id:'holiday_work', icon:'💼', title:'假期加班', category:'festival',
      body:'放假了。但你在加班。\n\n你的同事都出去旅游了，朋友圈全是风景照。你一个人坐在空荡荡的办公室里，键盘声在寂静中格外清晰。\n\n领导说："辛苦了，节后给你调休。"\n\n你知道：调休永远不会兑现。\n\n但你的银行卡余额告诉你：三倍工资真的很香。\n\n"假期加班：不是在加班——是在用别人的快乐换自己的工资。"',
      cond: g => !g.flags.holidayWork && g.job !== '待业中',
      choices:[
        { label:'主动加班（三倍工资）', hint:'+💰 -😊 -💪', fn: g => { g.flags.holidayWork=true; return{money:8000,mood:-10,health:-5}; }},
        { label:'被动加班（领导安排的）', hint:'+💰 -😊 -👥', fn: g => { g.flags.holidayWork=true; return{money:5000,mood:-15,social:-5}; }},
        { label:'拒绝加班，享受假期', hint:'+😊 +💪 -💰', fn: g => { g.flags.holidayWork=true; return{mood:20,health:8,money:-1000}; }},
      ]},
    { id:'holiday_syndrome', icon:'😴', title:'假期综合症', category:'festival',
      body:'假期结束了。\n\n你的状态：\n- 早上闹钟响了5遍才起床\n- 坐在工位上发呆\n- 打开电脑忘了密码\n- 午饭不知道吃什么\n- 一直看手机等下班\n\n你的同事也是同样的状态。整个办公室弥漫着一种"我不想上班"的气氛。\n\n你在工位上偷偷搜："假期综合症怎么办"\n\n"假期综合症：不是你的身体在休息——是你的灵魂还在度假。"',
      cond: g => !g.flags.holidaySyndrome,
      choices:[
        { label:'硬撑着熬过第一周', hint:'+💰 -😊 -💪', fn: g => { g.flags.holidaySyndrome=true; return{money:3000,mood:-8,health:-3}; }},
        { label:'请一天假缓冲', hint:'-💰 +😊 +💪', fn: g => { g.flags.holidaySyndrome=true; return{money:-1000,mood:10,health:5}; }},
        { label:'用运动唤醒身体', hint:'+💪 +😊 +🧠', fn: g => { g.flags.holidaySyndrome=true; g.flags.exerciseRoutine=true; return{health:10,mood:8,intel:3}; }},
      ]},
    { id:'annual_leave_trip', icon:'✈️', title:'年假旅行', category:'festival',
      body:'你终于请了年假。5天年假 + 2天周末 = 7天旅行。\n\n你的目的地：云南/西藏/新疆/东南亚/日本。\n\n你做了详细的攻略：每天的行程精确到小时，餐厅、景点、酒店都预订好了。\n\n但到了之后你发现：\n- 网红餐厅要排队2小时\n- 网红打卡点全是人\n- 你的预算超了50%\n- 你的朋友圈获赞数创了新高\n\n"年假旅行的真谛：不是去了多远的地方——是终于从工作中逃了出来。"',
      cond: g => !g.flags.annualLeaveTrip && g.age >= 22 && g.money > 10000 && g.job !== '待业中',
      choices:[
        { label:'去远方（西藏/新疆/东南亚）', hint:'-💰💰 +😊 +✨ +💪', fn: g => { g.flags.annualLeaveTrip=true; g.flags.longTrip=true; return{money:-15000,mood:25,charm:10,health:5}; }},
        { label:'周边游（高铁3小时内）', hint:'-💰 +😊 +💪', fn: g => { g.flags.annualLeaveTrip=true; return{money:-5000,mood:18,health:5}; }},
        { label:'存着年假以后用', hint:'+💰 +🧠', fn: g => { g.flags.annualLeaveTrip=true; return{money:3000,intel:3}; }},
      ]},
    { id:'duanwu_zongzi', icon:'🎋', title:'端午节', category:'festival',
      body:'端午节到了。\n\n你妈从老家寄了一箱粽子：肉粽、蛋黄粽、豆沙粽。你分给了同事几个，大家都说你妈包的粽子好吃。\n\n你打开外卖软件，发现"粽子"的搜索量涨了300%。商家推出了各种奇葩粽子：螺蛳粉粽、火锅粽、巧克力粽。\n\n你吃了两个你妈包的肉粽，觉得还是传统的最好吃。\n\n"粽子的味道：不在于馅料——在于谁包的。"',
      cond: g => !g.flags.duanwuZongzi,
      choices:[
        { label:'学着自己包粽子', hint:'+🧠 +😊 +👥', fn: g => { g.flags.duanwuZongzi=true; g.flags.learnedZongzi=true; return{intel:5,mood:12,social:5}; }},
        { label:'吃妈妈寄的粽子', hint:'+😊 +👥', fn: g => { g.flags.duanwuZongzi=true; return{mood:15,social:5}; }},
        { label:'尝尝奇葩粽子', hint:'+😊 +✨', fn: g => { g.flags.duanwuZongzi=true; return{mood:8,charm:3,money:-100}; }},
      ]},
    { id:'five_twenty', icon:'💕', title:'520表白日', category:'festival',
      body:'5月20日。朋友圈又开始撒狗粮了。\n\n你的同事收到了男朋友送的花和包。你的闺蜜收到了老公转的52013.14元。\n\n你在5:20的时候发了一条朋友圈："520快乐。"配图是一杯奶茶。\n\n评论区：\n- 你妈："有对象了吗？"\n- 你同事："哈哈哈哈单身狗"\n- 你朋友："一起过光棍节"\n\n"520：不是爱情的节日——是单身的照妖镜。"',
      cond: g => !g.flags.fiveTwenty && g.age >= 18 && g.age <= 35,
      choices:[
        { label:'给喜欢的人表白', hint:'🎲 +😊 +✨', fn: g => { g.flags.fiveTwenty=true; if(!g.flags.hasPartner&&Math.random()>0.6){g.flags.hasPartner=true;return{mood:25,charm:10}}else{return{mood:-10,charm:5}} }},
        { label:'给自己买束花', hint:'-💰 +😊 +✨', fn: g => { g.flags.fiveTwenty=true; g.flags.selfLove=true; return{money:-200,mood:12,charm:5}; }},
        { label:'无视这个节日', hint:'+🧠 +💰', fn: g => { g.flags.fiveTwenty=true; return{intel:5,mood:3}; }},
      ]},
    { id:'festival_alone', icon:'🌙', title:'一个人的节日', category:'festival',
      body:'又是一个节日。春节/中秋/圣诞/元旦。\n\n你一个人在出租屋里。窗外是烟花和欢笑声，屋里是外卖和电视声。\n\n你打开了视频通话，看到了爸妈在老家吃年夜饭/月饼。你笑着说："我挺好的。"\n\n挂了电话，你的笑容消失了。你吃了一口外卖，觉得有点咸。\n\n"在大城市，节日是放大孤独的日子。但也是提醒自己：我还在努力活着。"',
      cond: g => !g.flags.festivalAlone && g.age >= 22 && !g.flags.married,
      choices:[
        { label:'给自己做一顿大餐', hint:'+😊 +💪 +✨', fn: g => { g.flags.festivalAlone=true; g.flags.cookingHoliday=true; return{mood:12,health:5,charm:5}; }},
        { label:'给朋友打电话聊天', hint:'+👥 +😊', fn: g => { g.flags.festivalAlone=true; return{social:12,mood:10}; }},
        { label:'早点睡，明天还要上班', hint:'+💪 +💰 -😊', fn: g => { g.flags.festivalAlone=true; return{health:5,money:1000,mood:-8}; }},
      ]},
];

const ACHIEVEMENTS = [
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
    { id:'divorced', icon:'💔', name:'围城之外', desc:'离婚了', check: g => g.flags.divorced },
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
    { id:'digital_detox_ach', icon:'📵', name:'数字排毒', desc:'完成数字戒断', check: g => g.flags.digitalDetox },
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
    { id:'remote_worker_v2', icon:'💻', name:'远程工作者v2', desc:'体验过远程办公', check: g => g.flags.remoteWork },
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
    { id:'viral_star_v2', icon:'📱', name:'一夜爆红', desc:'在社交媒体意外走红', check: g => g.flags.socialMediaFame },
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
    { id:'digital_detox_v2', icon:'📵', name:'数字断联', desc:'成功戒掉短视频', check: g => g.flags.digitalDetox },
    { id:'good_neighbor', icon:'🏘️', name:'好邻居', desc:'和新邻居成为朋友', check: g => g.flags.goodNeighbor },
    { id:'marathon_runner', icon:'🏃', name:'马拉松跑者', desc:'完成了一次马拉松挑战', check: g => g.flags.marathonChallenge && g.health>=70 },
    { id:'side_project_done', icon:'💻', name:'副业起步', desc:'开始了自己的副业项目', check: g => g.flags.sideProject },
    { id:'homecoming', icon:'🚄', name:'常回家看看', desc:'回家看望了父母', check: g => g.flags.hometownVisit },
    // v2.37 achievements
    { id:'freelancer_start', icon:'💻', name:'自由职业者', desc:'开始了自由职业生涯', check: g => g.flags.freelancer },
    { id:'investor_v2', icon:'📊', name:'投资者', desc:'尝试了理财投资', check: g => g.flags.investmentAdvice },
    { id:'mentee', icon:'👨‍🏫', name:'得到指点', desc:'遇到了职业导师', check: g => g.flags.mentorFound },
    { id:'freelance_win', icon:'🌟', name:'自由职业成功', desc:'自由职业获得成功', check: g => g.flags.freelanceSuccess },
    // v2.38 achievements
    { id:'ai_learner', icon:'🤖', name:'AI学习者', desc:'学习了AI技能', check: g => g.flags.aiSkills },
    { id:'pua_resister', icon:'⚔️', name:'反PUA战士', desc:'勇敢反抗职场PUA', check: g => g.flags.workplacePUA && (g.flags.laborRights || g.charm>=65) },
    { id:'year_reviewer', icon:'📊', name:'年终总结', desc:'认真回顾了自己的这一年', check: g => g.flags.yearEndReview },
    { id:'conflict_resolver', icon:'🤝', name:'矛盾调解员', desc:'成功解决了室友矛盾', check: g => g.flags.roommateConflict && g.social>=55 },
    { id:'dating_explorer', icon:'💘', name:'交友探索者', desc:'尝试了交友软件', check: g => g.flags.datingApp },
    // v2.39 achievements
    { id:'city_explorer_v2', icon:'🗺️', name:'城市探索者', desc:'在多个城市生活过', check: g => g.flags.citySwitch },
    { id:'midlife_reflection', icon:'🎂', name:'四十不惑', desc:'在40岁时重新审视人生', check: g => g.flags.midlifeCrisis40 },
    { id:'skill_learner', icon:'📚', name:'终身学习', desc:'学习了新技能', check: g => g.flags.learnNewSkill },
    { id:'good_child', icon:'👨‍👩‍👦', name:'孝顺子女', desc:'照顾好了父母的健康', check: g => (g.flags.parentHealthIssue || g.flags.hometownVisit) && g.relationships && g.relationships.family>=70 },
    { id:'traveler', icon:'🏖️', name:'周末旅行家', desc:'来了一次说走就走的旅行', check: g => g.flags.weekendTrip },
    // v2.40 achievements
    { id:'lottery_player', icon:'🎫', name:'彩票玩家', desc:'买了彩票试试手气', check: g => g.flags.lotteryTicket },
    { id:'viral_moment', icon:'📸', name:'意外走红', desc:'体验了一把网红感觉', check: g => g.flags.socialMediaFame },
    { id:'career_changer_v2', icon:'🔀', name:'职业转型', desc:'勇敢走出了职业舒适区', check: g => g.flags.careerCrossroads },
    { id:'health_conscious', icon:'🏥', name:'健康意识', desc:'认真对待了年度体检', check: g => g.flags.annualCheckup },
    { id:'bookworm_v2', icon:'📚', name:'读书会成员', desc:'加入了读书会', check: g => g.flags.bookClub },
    // v3.8 achievements
    { id:'matchmaking_corner_visitor', icon:'💑', name:'相亲角体验者', desc:'经历公园相亲', check: g => g.flags.matchmakingCorner },
    { id:'retirement_planner', icon:'👴', name:'延迟退休规划者', desc:'面对延迟退休', check: g => g.flags.delayedRetirement },
    // v3.9 achievements
    { id:'wellness_beginner', icon:'🏥', name:'养生新手', desc:'开始轻养生', check: g => g.flags.lightWellness || g.flags.gymMember },
    { id:'dazi_master', icon:'👥', name:'搭子达人', desc:'找到了搭子', check: g => g.flags.foodDazi || g.flags.sportsDazi || g.flags.travelDazi },
    { id:'crisis_planner', icon:'⚠️', name:'危机规划者', desc:'面对35岁危机', check: g => g.flags.age35Crisis && (g.flags.sidePlan || g.flags.civilServicePrep) },
    // v4.0 achievements
    { id:'pickle_master', icon:'📱', name:'电子榨菜品鉴师', desc:'享受电子榨菜下饭', check: g => g.flags.electronicPickle },
    { id:'smart_shopper_v2', icon:'💸', name:'反向消费达人', desc:'成为平替专家', check: g => g.flags.reverseConsumption },
    // v4.1 achievements
    { id:'guzi_collector', icon:'🎭', name:'吃谷人', desc:'开始收集谷子', check: g => g.flags.guziCollector },
    { id:'mbti_master', icon:'🧩', name:'MBTI专家', desc:'做了MBTI测试', check: g => g.flags.mbtiTest },
    // v4.2 achievements
    { id:'budget_traveler', icon:'🎒', name:'特种兵游客', desc:'体验特种兵旅游', check: g => g.flags.specialForcesTravel },
    { id:'city_explorer_v3', icon:'🏙️', name:'City玩家', desc:'体验City感生活', check: g => g.flags.cityOrNot },
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
    { id:'quiet_quitter_v2', icon:'😶', name:'精神离职者', desc:'实践安静离职', check: g => g.flags.quietQuitting },
    { id:'burnout_survivor_v2', icon:'🔥', name:'职业倦怠幸存者', desc:'经历职业倦怠', check: g => g.flags.jobBurnout },
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
    { id:'freelancer_v2', icon:'🎨', name:'自由职业者', desc:'远程工作或自由接单', check: g => g.flags.freelancer },
    { id:'civil_service_veteran', icon:'📋', name:'考公老手', desc:'参加公务员考试', check: g => g.flags.civilServiceExam },
    { id:'persistent_examinee', icon:'🔄', name:'二战三战', desc:'多次参加考公', check: g => g.flags.secondCareer },
    // v6.6 achievements
    { id:'slash_youth', icon:'💼', name:'斜杠青年', desc:'开展副业', check: g => g.flags.sideHustle },
    { id:'street_vendor', icon:'🛒', name:'摆摊达人', desc:'摆摊创业', check: g => g.flags.streetVendor },
    { id:'frugal_master', icon:'📉', name:'消费降级大师', desc:'实践消费降级', check: g => g.flags.consumptionDowngrade },
    { id:'minimalist_v2', icon:'🎯', name:'极简主义者', desc:'选择极简生活', check: g => g.flags.minimalist },
    { id:'pingti_expert', icon:'🔄', name:'平替专家', desc:'拥抱平替文化', check: g => g.flags.pingtiCulture },
    // v6.7 achievements
    { id:'ai_creator', icon:'🤖', name:'AI创作者', desc:'学习AI创作', check: g => g.flags.aiCreation },
    { id:'ai_artist', icon:'🎨', name:'AI艺术家', desc:'用AI做绘画创作', check: g => g.flags.aiArtist },
    { id:'opc_founder', icon:'🏢', name:'一人公司创始人', desc:'创办一人公司', check: g => g.flags.onePersonCompany },
    { id:'ai_tool_master', icon:'🛠️', name:'AI工具达人', desc:'掌握AI工具', check: g => g.flags.aiToolUser },
    // v6.8 achievements
    { id:'pet_parent_v2', icon:'🐾', name:'宠物家长', desc:'养宠物', check: g => g.flags.petEconomy },
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
    { id:'guzi_collector_v2', icon:'🎌', name:'谷子收藏家', desc:'入坑谷子经济', check: g => g.flags.goodsEconomy2 },
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
    { id:'pension_planner_v2', icon:'👴', name:'养老规划师', desc:'提前规划养老金', check: g => g.flags.pensionPlanning },
    { id:'mental_health_warrior', icon:'💭', name:'心理健康战士', desc:'寻求心理帮助', check: g => g.flags.seekHelp },
    { id:'age_35_survivor', icon:'🎂', name:'35岁幸存者', desc:'度过35岁危机', check: g => g.flags.age35Crisis },
    { id:'career_transformer', icon:'💪', name:'职业转型者', desc:'35岁后成功转型', check: g => g.flags.careerTransition },
    // v7.5 achievements
    { id:'pua_resister_v2', icon:'😰', name:'PUA反抗者', desc:'拒绝职场PUA', check: g => g.flags.standUp },
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
    { id:'personal_brand_v2', icon:'🎯', name:'个人品牌专家', desc:'用社交媒体打造个人品牌', check: g => g.flags.personalBranding },
    { id:'cyber_wellness_user', icon:'🤖', name:'赛博养生达人', desc:'尝试AI中医养生', check: g => g.flags.cyberWellness },
    { id:'medical_companion', icon:'🏥', name:'陪诊师', desc:'成为陪诊师或请陪诊师', check: g => g.flags.medicalCompanion },
    { id:'pet_funeral', icon:'🐾', name:'宠物告别师', desc:'体验宠物殡葬服务', check: g => g.flags.petFuneral },
    // v7.8 crisis achievements
    { id:'health_crisis_survivor', icon:'🚑', name:'健康危机幸存者', desc:'经历健康危机并恢复', check: g => g.flags.healthCrisisHospital && g.health > 50 },
    { id:'debt_fighter', icon:'💪', name:'还债勇士', desc:'经历债务危机并努力还债', check: g => g.flags.workToPayDebt && g.money > 0 },
    { id:'therapy_seeker', icon:'💭', name:'心理咨询求助者', desc:'情绪崩溃后寻求专业帮助', check: g => g.flags.seekTherapy },
    { id:'reconciliation_master', icon:'💑', name:'感情修复大师', desc:'经历分手危机并成功挽回', check: g => g.flags.tryToReconcile && g.relationships && g.relationships.partner > 50 },
    { id:'social_rebuilder', icon:'🤝', name:'社交重建者', desc:'从孤立危机中重建社交圈', check: g => g.flags.reconnectFriends && g.social > 50 },
    { id:'family_healer_v2', icon:'❤️', name:'家庭关系修复者', desc:'化解家庭危机', check: g => g.flags.familyTalk && g.relationships && g.relationships.family > 60 },
    // v8.0 新系统成就
    { id:'trade_novice', icon:'🏪', name:'倒卖新手', desc:'完成第一笔倒卖交易', check: g => g.flags.tradeFirstBuy },
    { id:'trade_master', icon:'💰', name:'倒卖大亨', desc:'通过倒卖累计赚取5万以上', check: g => g.flags.tradeProfit && g.money > 50000 },
    { id:'trade_king', icon:'👑', name:'地下市场之王', desc:'持有全部8种商品', check: g => { const goods = Object.keys(g.inventory||{}); return goods.length >= 8; } },
    { id:'surprise_survivor', icon:'⚡', name:'意外幸存者', desc:'经历5次以上突发事件', check: g => g.flags.surpriseCount >= 5 },
    { id:'loan_shark_survivor', icon:'🦈', name:'高利贷幸存者', desc:'借了高利贷还能活着', check: g => g.flags.loanShark && g.flags.loanSharkPaid },
    { id:'food_poisoning_survivor', icon:'🤢', name:'外卖中毒幸存者', desc:'从外卖食物中毒中恢复', check: g => g.flags.foodPoisoning && g.health > 60 },
    { id:'rent_warrior', icon:'🏠', name:'租房战士', desc:'经历了租房踩雷', check: g => g.flags.rentTrap },
    { id:'delivery_quitter', icon:'🍳', name:'外卖戒断者', desc:'学会了做饭', check: g => g.flags.cookingSkill },
    { id:'spring_festival_hero', icon:'🧧', name:'过年达人', desc:'做出了过年的选择', check: g => g.flags.springFestivalChoice },
    { id:'stock_zen', icon:'📉', name:'股市禅修者', desc:'经历股票深套后还活着', check: g => g.flags.stockDeepLoss && g.money > 0 },
    // === v8.1 新增成就 ===
    { id:'roommate_survivor', icon:'🏠', name:'合租幸存者', desc:'熬过了室友的折磨', check: g => g.flags.roommateHell && g.mood >= 50 },
    { id:'spring_hero', icon:'🚄', name:'春运勇士', desc:'成功回家过年', check: g => g.flags.springFestivalThisYear },
    { id:'ai_adopter', icon:'🤖', name:'AI先驱', desc:'主动拥抱AI技术', check: g => g.flags.aiSkills },
    { id:'matchmaking_veteran', icon:'💒', name:'相亲老手', desc:'去过相亲角', check: g => g.flags.matchmakingCorner },
    { id:'rent_scam_survivor', icon:'🏚️', name:'租房老江湖', desc:'被黑中介坑过还活着', check: g => g.flags.rentScam && g.money > -20000 },
    { id:'health_awakening_v2', icon:'⚰️', name:'生死觉悟', desc:'同事猝死后开始重视健康', check: g => g.flags.colleagueKaroshi && g.flags.fitnessJourney },
    { id:'newbie_survivor', icon:'🌱', name:'新手不死', desc:'活过了头3个月', check: g => g.months >= 3 },
    // === v8.3 新增成就 ===
    { id:'regret_accumulator', icon:'💭', name:'算了大师', desc:'说了5次以上"算了"', check: g => (g.flags.regretCount||0) >= 5 },
    { id:'moments_crisis_survivor', icon:'📱', name:'人设重建', desc:'经历朋友圈人设崩塌后重建自我', check: g => g.flags.momentsCrisis && g.charm >= 50 },
    { id:'delayed_consequence_survivor', icon:'⏰', name:'因果循环', desc:'经历了至少一个延迟后果', check: g => (g.flags.loanSharkUrgent||g.flags.writer||false) },
    { id:'consecutive_exerciser', icon:'🏃', name:'健身狂魔', desc:'连续6个月锻炼', check: g => g._consecutiveActivity && g._consecutiveActivity.type === 'exercise' && g._consecutiveActivity.count >= 6 },
    { id:'career_crossroad_survivor', icon:'🔀', name:'职业抉择', desc:'站在职业十字路口做出选择', check: g => g.flags.careerCrossroad },
    // === v9.0 新增成就 ===
    { id:'city_hopper_ach', icon:'🗺️', name:'城市候鸟', desc:'搬过一次城市', check: g => g.flags.citySwitch },
    // === v9.1 新增成就 ===
    { id:'social_intel', icon:'🗣️', name:'社交达人', desc:'通过社交获得过情报', check: g => g.flags._rumorCooldown && g.flags._rumorCooldown.length >= 3 },
    { id:'rumor_victim', icon:'🪤', name:'交了学费', desc:'被谣言坑过一次', check: g => g.flags.rumorCrypto && g.money < 0 },
    { id:'rumor_savvy', icon:'🧠', name:'消息灵通', desc:'累计获得5条以上情报', check: g => g.flags._rumorCooldown && g.flags._rumorCooldown.length >= 5 },
    { id:'pet_owner_v2', icon:'🐱', name:'铲屎官', desc:'领养了一只宠物', check: g => g.flags.hasPet },
    { id:'subsidy_winner', icon:'📋', name:'薅到羊毛', desc:'成功申请到人才补贴', check: g => g.flags.hasSubsidy },
    { id:'gym_member', icon:'💪', name:'健身会员', desc:'办了健身年卡', check: g => g.flags.hasGymCard },
    { id:'cheap_rent_ach', icon:'🏠', name:'租房达人', desc:'成功申请到公租房', check: g => g.flags.cheapRent },
    { id:'emo_night', icon:'🌙', name:'深夜emo', desc:'经历过一次深夜情绪低落', check: g => g.mood < 30 && g.months > 12 },
    // === v9.2 新增成就 ===
    { id:'investor_v2_v2', icon:'💰', name:'理财新手', desc:'第一次进行投资', check: g => g.flags.hasInvestment },
    { id:'stock_master', icon:'📈', name:'股海沉浮', desc:'在股市中存活超过一年', check: g => g.investments && g.investments.stock > 0 && g.months > 12 },
    { id:'married_ach', icon:'💍', name:'已婚人士', desc:'成功结婚', check: g => g.flags.married },
    { id:'crisis35_survivor', icon:'⚡', name:'35岁突围', desc:'经历过35岁危机', check: g => g.flags.crisis35seen },
    { id:'spring_festival_ach', icon:'🧧', name:'春节回家', desc:'度过了一个春节', check: g => g.months > 12 && g.month % 12 === 1 },
    { id:'double11_survivor', icon:'🛒', name:'双十一战士', desc:'经历了双十一', check: g => g.flags.double11spent },
    // === v9.3 新增成就 ===
    { id:'mentor_found_ach', icon:'🧓', name:'良师益友', desc:'遇到了一位人生导师', check: g => g.flags.hasMentor },
    { id:'city_explorer_v2_v2', icon:'🏙️', name:'城市探索者', desc:'体验过至少3个城市的特色事件', check: g => { let c=0; if(g.flags.beijingExplored)c++; if(g.flags.shanghaiExplored)c++; if(g.flags.chengduExplored)c++; return c>=3; } },
    // === v9.4 新增成就 ===
    { id:'civil_servant_ach', icon:'📝', name:'公考上岸', desc:'通过公务员考试', check: g => g.flags.civilServant },
    { id:'mba_graduate', icon:'🎓', name:'MBA毕业生', desc:'完成MBA学业', check: g => g.flags.hasMBA },
    { id:'certified', icon:'📋', name:'考证达人', desc:'考取了专业证书', check: g => g.flags.hasCertificate },
    { id:'therapy_ach', icon:'💚', name:'心理健康卫士', desc:'看过心理咨询师', check: g => g.flags.sawTherapist },
    { id:'car_owner', icon:'🚗', name:'有车一族', desc:'买了车', check: g => g.flags.hasCar },
    { id:'homeowner_ach', icon:'🏠', name:'有房一族', desc:'在大城市买了房', check: g => g.flags.hasHouse },
    { id:'tiktok_creator', icon:'🎬', name:'短视频创作者', desc:'开始做短视频', check: g => g.flags.tiktokCreator },
    // === v9.5 新增成就 ===
    { id:'hobby_photo', icon:'📸', name:'摄影爱好者', desc:'入坑摄影', check: g => g.flags.hobbyPhotography },
    { id:'remote_worker_ach', icon:'💻', name:'远程工作者', desc:'实现远程办公', check: g => g.flags.remoteWorker },
    { id:'cook_master', icon:'👨‍🍳', name:'厨房新手', desc:'学会了做饭', check: g => g.flags.cookingSkill },
    { id:'volunteer_ach', icon:'❤️', name:'志愿者', desc:'参加过公益活动', check: g => g.social > 50 && g.months > 24 },
    { id:'midlife_change', icon:'🪞', name:'中年觉醒', desc:'在中年做出了重大改变', check: g => g.flags.midlifeChange },
    // === v10.0 新增成就 ===
    { id:'digital_nomad_ach', icon:'🌍', name:'数字游民', desc:'成为数字游民', check: g => g.flags.digitalNomad },
    { id:'minimalist_v2_v2', icon:'🧹', name:'断舍离', desc:'完成一次断舍离', check: g => g.money > 5000 && g.mood > 70 && g.months > 24 },
    // === v10.3 新增成就 ===
    { id:'dink_ach', icon:'🍷', name:'丁克一族', desc:'选择不要孩子', check: g => g.flags.dink },
    { id:'midlife_restart_ach', icon:'🔄', name:'中年重启', desc:'在35岁后重新出发', check: g => g.flags.midlifeRestart },
    { id:'super_parent_v2', icon:'👨‍👩‍👧‍👦', name:'超级父母', desc:'有孩子且家庭生活幸福', check: g => g.flags.hasChild && g.mood >= 70 && g.social >= 50 },
    { id:'filial_child_v2', icon:'🏡', name:'孝子孝女', desc:'经常关心父母', check: g => g.relationships && g.relationships.family >= 80 },
    { id:'child_education_ach', icon:'🎒', name:'虎妈虎爸', desc:'为孩子教育投入巨大', check: g => g.flags.hasChild && g.money < 5000 && g.intel >= 60 },
    // === v10.4 新增成就 ===
    { id:'dazi_master_v2', icon:'🤝', name:'搭子达人', desc:'找到了生活搭子', check: g => g.flags.hasDazi },
    { id:'mbti_expert', icon:'🧩', name:'MBTI专家', desc:'深入研究MBTI', check: g => g.flags.mbtiExpert },
    { id:'citywalker', icon:'🚶', name:'城市漫游者', desc:'发现了社区咖啡馆', check: g => g.flags.citywalkCafe || g.flags.communityCafe },
    { id:'night_rider', icon:'🚴', name:'夜骑侠', desc:'爱上了夜骑', check: g => g.flags.nightCycling },
    { id:'pet_parent_pro', icon:'🐾', name:'宠物家长', desc:'为宠物买了保险', check: g => g.flags.petInsurance },
    { id:'ai_friend_v2', icon:'🤖', name:'AI之友', desc:'和AI成为了朋友', check: g => g.flags.aiCompanion },
    { id:'home_decorator', icon:'🪴', name:'生活美学家', desc:'改造了出租屋', check: g => g.flags.renovated },
    // === v10.5 新增成就 ===
    { id:'wellness_mode', icon:'🍵', name:'养生达人', desc:'开始注重健康', check: g => g.flags.wellnessMode },
    { id:'gym_goer', icon:'💪', name:'健身达人', desc:'办了健身卡', check: g => g.flags.gymMember },
    { id:'insurance_holder', icon:'🛡️', name:'未雨绸缪', desc:'购买了商业保险', check: g => g.flags.hasCommercialInsurance },
    { id:'brave_dater', icon:'💑', name:'勇敢相亲', desc:'去了一次相亲', check: g => g.flags.wentBlindDate },
    { id:'relative_cutter', icon:'✂️', name:'断亲勇士', desc:'选择了断亲', check: g => g.flags.cutRelatives },
    { id:'filial_v2', icon:'🏥', name:'孝心体检', desc:'带父母做体检', check: g => g.flags.parentHealthDone },
    // === v10.6 新增成就 ===
    { id:'xianyu_seller', icon:'🐟', name:'闲鱼达人', desc:'在闲鱼卖了闲置', check: g => g.flags.xianyuSeller },
    { id:'side_hustler', icon:'💻', name:'斜杠青年', desc:'开始做副业', check: g => g.flags.hasSideHustle },
    { id:'web_novelist_ach', icon:'✍️', name:'网文作者', desc:'开始写网络小说', check: g => g.flags.webNovelist },
    { id:'concert_goer', icon:'🎵', name:'演唱会狂热', desc:'去了一场演唱会', check: g => g.flags.wentConcert },
    { id:'art_lover', icon:'🎨', name:'文艺青年', desc:'去看了艺术展', check: g => g.flags.wentExhibition },
    { id:'street_vendor_ach', icon:'🏪', name:'摆摊达人', desc:'尝试了夜市摆摊', check: g => g.flags.streetVendor },
    { id:'driver_ach', icon:'🚗', name:'持证上路', desc:'拿到了驾照', check: g => g.flags.hasDriversLicense },
    { id:'livestreamer_ach', icon:'📹', name:'直播新人', desc:'尝试了直播', check: g => g.flags.triedLivestream },
    // === v10.7 新增成就 ===
    { id:'dating_app_user', icon:'💘', name:'社交软件达人', desc:'使用了交友App', check: g => g.flags.usedDatingApp },
    { id:'digital_detoxer_v2', icon:'📵', name:'数字戒断', desc:'完成数字戒断', check: g => g.flags.digitalDetox },
    { id:'gamer_controlled', icon:'🎮', name:'游戏自律', desc:'控制了游戏时间', check: g => g.flags.gamerControlled },
    { id:'moments_closer', icon:'📱', name:'朋友圈隐身', desc:'关闭了朋友圈', check: g => g.flags.closedMoments },
    { id:'podcaster_ach', icon:'🎧', name:'播客主播', desc:'开了自己的播客', check: g => g.flags.podcaster },
    { id:'shopaholic_reformed', icon:'📦', name:'购物戒断', desc:'戒掉了购物瘾', check: g => g.flags.shoppingDetox },
    { id:'therapy_goer', icon:'🧠', name:'心理勇者', desc:'尝试了心理咨询', check: g => g.flags.sawTherapist },
    // === v10.8 新增成就 ===
    { id:'promoted_ach', icon:'📈', name:'升职加薪', desc:'获得了升职', check: g => g.flags.promoted },
    { id:'job_hopper', icon:'📞', name:'跳槽达人', desc:'成功跳槽', check: g => g.flags.jobHopped },
    { id:'layoff_survivor_v2', icon:'📦', name:'裁员幸存者', desc:'经历了裁员', check: g => g.flags.wasLaidOff },
    { id:'startup_founder', icon:'💡', name:'创业者', desc:'开始创业', check: g => g.flags.startupPhase },
    { id:'mentor_found', icon:'🎯', name:'有师可学', desc:'找到了职场导师', check: g => g.flags.hasMentor },
    { id:'wlb_master', icon:'⚖️', name:'生活大师', desc:'实现了工作生活平衡', check: g => g.flags.workLifeBalance },
    { id:'fulltime_hustler', icon:'🎉', name:'全职追梦人', desc:'全职做副业', check: g => g.flags.fulltimeHustle },
    // === v11.1 新增成就 ===
    { id:'perfect_life_ach', icon:'🌟', name:'人生赢家', desc:'拥有房产、家庭、事业和幸福生活', check: g => g.flags.hasHouse && g.flags.married && g.flags.hasChild && g.money >= 200000 },
    { id:'free_soul_ach', icon:'🦅', name:'自由灵魂', desc:'选择了自由的生活方式', check: g => !g.flags.married && g.flags.hasPet && g.mood >= 65 && g.charm >= 50 && g.age >= 30 },
    { id:'dual_identity_ach', icon:'🎭', name:'双面人生', desc:'同时拥有主业和成功的副业', check: g => g.flags.hasSideHustle && (g.flags.webNovelist || g.flags.triedLivestream || g.flags.influencer) && g.money >= 50000 },
    { id:'quiet_victory_ach', icon:'🕊️', name:'无声的胜利', desc:'实现了工作与生活的平衡', check: g => g.flags.workLifeBalance && g.health >= 65 && g.mood >= 65 },
    { id:'gen_bridge_ach', icon:'🌉', name:'代际桥梁', desc:'连接了三代人的感情', check: g => g.flags.hasChild && g.relationships && g.relationships.family >= 75 },
    // === v11.2 新增成就 ===
    { id:'resolution_keeper', icon:'🎯', name:'新年践行者', desc:'认真执行了新年计划', check: g => g.flags.newYearResolution },
    { id:'stock_survivor', icon:'📉', name:'股市幸存者', desc:'经历了股市崩盘', check: g => g.investments && g.investments.stock >= 0 },
    { id:'frugal_master_v2', icon:'💹', name:'节俭大师', desc:'在通胀中保持理性', check: g => g.money >= 10000 && g.months > 48 && g.intel >= 50 },
    // === v11.3 新增成就 ===
    { id:'food_explorer_ach', icon:'🍜', name:'美食探险家', desc:'发现了宝藏小店', check: g => g.flags.foodExplorer },
    { id:'food_blogger_ach', icon:'📸', name:'美食博主', desc:'开始在小红书分享美食', check: g => g.flags.foodBlogger },
    { id:'rooftop_regular', icon:'🍸', name:'天台常客', desc:'找到了秘密酒吧', check: g => g.flags.rooftopRegular },
    { id:'bookworm_ach', icon:'📖', name:'书虫', desc:'成为独立书店会员', check: g => g.flags.bookstoreMember },
    // === v11.4 新增成就 ===
    { id:'content_creator_ach', icon:'🔥', name:'内容创作者', desc:'创作了爆款内容', check: g => g.flags.contentCreator },
    { id:'ethical_creator', icon:'💖', name:'良心博主', desc:'只推荐好东西', check: g => g.flags.ethicalCreator },
    { id:'livestream_seller', icon:'📺', name:'带货主播', desc:'尝试了直播带货', check: g => g.flags.livestreamSeller },
    { id:'digital_clean', icon:'🧹', name:'数字清洁工', desc:'清理了社交媒体', check: g => g.flags.cleanedDigital },
    // === v11.5 新增成就 ===
    { id:'instrument_player', icon:'🎸', name:'乐器新手', desc:'学会了一门乐器', check: g => g.flags.instrumentPlayer },
    { id:'volunteer_regular', icon:'❤️', name:'常驻志愿者', desc:'定期参加志愿活动', check: g => g.flags.regularVolunteer },
    { id:'moved_up', icon:'📦', name:'消费升级', desc:'搬到了更好的房子', check: g => g.flags.movedUp },
    { id:'retirement_planner_v2', icon:'👴', name:'养老规划师', desc:'开始规划退休生活', check: g => g.investments && g.investments.fund >= 10000 },
    // === v11.6 新增成就 ===
    { id:'photographer_ach', icon:'📷', name:'光影猎人', desc:'入坑摄影', check: g => g.flags.photographer },
    { id:'runner_ach', icon:'🏃', name:'跑者', desc:'养成了跑步习惯', check: g => g.flags.runner },
    { id:'marathon_finisher', icon:'🏅', name:'马拉松完赛', desc:'跑完了全程马拉松', check: g => g.flags.marathonFinish },
    { id:'artist_ach', icon:'🎨', name:'业余画家', desc:'坚持艺术创作', check: g => g.flags.artist },
    { id:'plant_parent_ach', icon:'🌿', name:'植物家长', desc:'养活了绿植', check: g => g.flags.plantParent },
    // === v11.7 新增成就 ===
    { id:'civil_exam_ach', icon:'📋', name:'考公路上', desc:'开始备考公务员', check: g => g.flags.preparingCivilExam },
    { id:'frugal_master_v2_v2', icon:'📉', name:'极简主义者', desc:'践行消费降级', check: g => g.flags.minimalist },
    { id:'blind_box_fan_v2', icon:'🎁', name:'盲盒玩家', desc:'入了盲盒的坑', check: g => g.flags.blindBoxFan },
    { id:'matchmaking_vet', icon:'💘', name:'相亲老手', desc:'经历过相亲角', check: g => g.flags.hadMatchmaking },
    { id:'rental_warrior', icon:'🏚️', name:'租房斗士', desc:'为租房权益维权', check: g => g.flags.rentalRights },
    { id:'group_leader', icon:'🛒', name:'团购团长', desc:'成了社区团购团长', check: g => g.flags.groupBuyLeader },
    { id:'pension_planner_v2_v2', icon:'👴', name:'未雨绸缪', desc:'开始规划养老', check: g => g.flags.pensionPlan },
    // === v11.8 新增成就 ===
    { id:'livestream_tipper_ach', icon:'🎥', name:'直播打赏者', desc:'给主播打赏过', check: g => g.flags.livestreamTipper },
    { id:'ai_power_user_ach', icon:'🤖', name:'AI达人', desc:'全面拥抱AI工具', check: g => g.flags.aiPowerUser },
    { id:'dazi_finder', icon:'🤝', name:'搭子猎手', desc:'找到了生活搭子', check: g => g.flags.hasDazi },
    { id:'short_drama_fan_ach', icon:'📺', name:'短剧爱好者', desc:'沉迷短剧', check: g => g.flags.shortDramaFan },
    { id:'drama_creator_ach', icon:'🎬', name:'短剧创作者', desc:'拍摄了短剧', check: g => g.flags.shortDramaCreator },
    { id:'digital_vinegar_ach', icon:'🍚', name:'电子榨菜爱好者', desc:'吃饭必须配视频', check: g => g.flags.digitalVinegar },
    // === v11.9 新增成就 ===
    { id:'parents_love', icon:'👴', name:'孝顺觉醒', desc:'意识到父母变老了', check: g => g.flags.parentsAging },
    { id:'class_reunion_ach', icon:'🍻', name:'老友重逢', desc:'参加了同学聚会', check: g => g.flags.classReunion },
    { id:'health_wakeup', icon:'🏥', name:'健康警钟', desc:'收到异常体检报告', check: g => g.flags.healthReport },
    { id:'midlife_pivot_ach', icon:'🔄', name:'中年转型', desc:'做出了中年职业转型', check: g => g.flags.midlifePivot },
    { id:'tiger_parent_ach', icon:'📚', name:'虎妈虎爸v2', desc:'为孩子教育大力投入', check: g => g.flags.tigerParent },
    { id:'hometown_return', icon:'🏠', name:'思乡之情', desc:'面对回乡还是留下的抉择', check: g => g.flags.hometownPull },
    { id:'life_reviewer', icon:'🪞', name:'人生复盘者', desc:'在40岁反思了自己的人生', check: g => g.flags.lifeReview40 },
    // === v12.0 新增成就 ===
    { id:'gym_card_ach', icon:'💪', name:'健身卡持有者', desc:'办了健身卡', check: g => g.flags.gymMember },
    { id:'roommate_survivor_v2', icon:'🏠', name:'合租幸存者', desc:'经历了室友矛盾', check: g => g.flags.roommateConflict },
    { id:'office_politician', icon:'🏢', name:'办公室生存术', desc:'经历了办公室政治', check: g => g.flags.officePolitics },
    { id:'screen_conscious', icon:'📱', name:'屏幕觉醒者', desc:'开始控制屏幕时间', check: g => g.flags.screenTimeLimit },
    { id:'traveler_ach', icon:'🏖️', name:'周末旅行家', desc:'来了一次说走就走的旅行', check: g => g.flags.weekendTrip },
    { id:'career_changer_v2_v2', icon:'🔀', name:'职业转型者', desc:'做出了职业改变', check: g => g.flags.careerChange },
    { id:'kindness_receiver', icon:'💝', name:'被温柔以待', desc:'感受过陌生人的善意', check: g => g.social > 60 && g.mood > 50 },
    // === v12.1 新增成就 ===
    { id:'long_distance_ach', icon:'💕', name:'异地恋人', desc:'经历了异地恋', check: g => g.flags.longDistanceLove },
    { id:'headhunted_ach', icon:'🎯', name:'猎头目标', desc:'被猎头联系过', check: g => g.jobSalary >= 20000 },
    { id:'spring_walker', icon:'🌸', name:'春日漫步者', desc:'享受了春天的美好', check: g => g.mood >= 60 && g.health >= 50 },
    { id:'puA_survivor', icon:'😤', name:'反PUA战士v2', desc:'经历了职场霸凌', check: g => g.flags.workplacePUA },
    { id:'first_love', icon:'💘', name:'心动时刻', desc:'有了第一次约会', check: g => g.flags.inRelationship },
    { id:'empty_nester', icon:'🪺', name:'空巢父母', desc:'孩子离家上大学', check: g => g.flags.emptyNestReal },
    // === v12.2 新增成就 ===
    { id:'stock_survivor_v2', icon:'📉', name:'韭菜觉醒', desc:'经历了股市崩盘', check: g => g.flags.stockCrash },
    { id:'standup_lover', icon:'🎤', name:'脱口秀爱好者', desc:'看了脱口秀演出', check: g => g.flags.standupFan },
    { id:'weight_warrior', icon:'⚖️', name:'减肥战士', desc:'经历了减肥反弹', check: g => g.flags.weightRebound },
    { id:'tcm_believer', icon:'🍵', name:'养生达人v2', desc:'尝试了中医调理', check: g => g.flags.tcmWellness },
    { id:'therapy_brave', icon:'💭', name:'勇敢求助者', desc:'去看了心理咨询师', check: g => g.flags.therapyVisit },
    { id:'homebuyer', icon:'🏠', name:'房奴', desc:'买了房开始还月供', check: g => g.flags.mortgage },
    { id:'fund_investor_ach', icon:'📊', name:'基金定投者', desc:'开始基金定投', check: g => g.flags.fundInvestor },
    // === v12.3 新增成就 ===
    { id:'anti_scam_v2', icon:'🛡️', name:'反诈先锋v2', desc:'识破了AI诈骗', check: g => g.flags.aiScamCall },
    { id:'smart_home_user', icon:'🏠', name:'智能家居用户', desc:'尝试了智能家居', check: g => g.flags.smartHome },
    { id:'rebel_spirit', icon:'🔥', name:'叛逆者', desc:'经历了中年叛逆', check: g => g.flags.midlifeRebellion },
    { id:'existential_thinker', icon:'🌌', name:'存在主义思考者', desc:'思考了人生的意义', check: g => g.flags.existentialThought },
    { id:'car_owner_v2', icon:'🚗', name:'车主', desc:'买了第一辆车', check: g => g.flags.hasCar },
    { id:'digital_minimalist', icon:'📱', name:'数字极简主义者', desc:'注销了社交账号', check: g => g.flags.accountDeleted },
    { id:'success_redefiner', icon:'🌟', name:'重新定义成功', desc:'找到了自己的成功标准', check: g => g.flags.redefinedSuccess },
    // === v12.4 新增成就 ===
    { id:'friend_drift_ach', icon:'👋', name:'渐行渐远', desc:'和朋友渐行渐远', check: g => g.flags.friendDrift },
    { id:'birthday_alone_ach', icon:'🎂', name:'一个人的生日', desc:'独自过了生日', check: g => g.flags.birthdayAlone },
    { id:'community_garden_ach', icon:'🌱', name:'社区园丁', desc:'参加了社区花园', check: g => g.flags.communityGarden },
    { id:'bucket_list_ach', icon:'📝', name:'人生清单', desc:'列了人生愿望清单', check: g => g.flags.bucketList },
    { id:'online_dating_ach', icon:'💑', name:'网恋达人', desc:'尝试了线上交友', check: g => g.flags.onlineDating },
    { id:'retirement_planner_v3', icon:'🧓', name:'退休规划师', desc:'开始倒计时退休', check: g => g.flags.retirementCountdown },
    { id:'upward_mover', icon:'📦', name:'越搬越好', desc:'搬到了更好的地方', check: g => g.flags.movedUp },
    { id:'eco_warrior', icon:'♻️', name:'环保先锋', desc:'践行低碳生活', check: g => g.flags.ecoLiving },
    { id:'midnight_survivor', icon:'🆘', name:'深夜幸存者', desc:'经历了深夜急诊', check: g => g.flags.midnightCrisis },
    { id:'wedding_guest', icon:'💒', name:'婚礼常客', desc:'参加了朋友婚礼', check: g => g.flags.friendWedding },
    // === v12.5 新增成就 ===
    { id:'forty_five_lifer', icon:'📐', name:'45度人生', desc:'选择了不卷不躺的生活', check: g => g.flags.fortyFiveDegree },
    { id:'splash_rich_ach', icon:'🤑', name:'泼天富贵', desc:'接住了突如其来的好运', check: g => g.flags.splashWealth },
    { id:'destiny_turner', icon:'⚙️', name:'命运齿轮', desc:'遇到了改变命运的人', check: g => g.flags.destinyGears },
    { id:'main_character', icon:'🎪', name:'显眼包', desc:'成了全场焦点', check: g => g.flags.attentionSeeker },
    { id:'digital_veggie_ach', icon:'🥬', name:'电子榨菜依赖', desc:'吃饭离不开短视频', check: g => g.flags.digitalVeggie },
    { id:'offline_warrior', icon:'📵', name:'数字断联者', desc:'主动远离社交媒体', check: g => g.flags.digitalDisconnect },
    { id:'commando_tourist', icon:'🎒', name:'特种兵游客', desc:'三天玩了三个城市', check: g => g.flags.commandoTravel },
    { id:'slow_worker', icon:'🐌', name:'慢就业青年', desc:'选择慢慢找工作', check: g => g.flags.slowEmployment },
    { id:'ai_survivor_ach', icon:'🤖', name:'AI时代适应者', desc:'面对AI替代选择了学习', check: g => g.flags.aiReplacement },
    { id:'pingti_master', icon:'🏷️', name:'平替大师', desc:'觉醒消费意识', check: g => g.flags.pintiCulture },
    // === v12.6 新增成就 ===
    { id:'spring_festival_ach_v2', icon:'🧧', name:'过年回家', desc:'回家过了春节', check: g => g.flags.springFestival },
    { id:'mom_wechat_ach', icon:'📱', name:'妈妈的微信', desc:'收到了妈妈的微信消息', check: g => g.flags.momWechat },
    { id:'dad_silent_ach', icon:'👨', name:'沉默的父爱', desc:'感受到了爸爸的爱', check: g => g.flags.dadSilent },
    { id:'tech_teacher', icon:'📲', name:'手机教练', desc:'教爸妈用手机', check: g => g.flags.parentTechHelp },
    { id:'moon_gazer', icon:'🌕', name:'异乡赏月', desc:'中秋独在异乡', check: g => g.flags.midAutumn },
    { id:'parent_health_ach', icon:'🏥', name:'牵挂', desc:'关心了父母的健康', check: g => g.flags.parentHealthScare },
    { id:'family_group_ach', icon:'💬', name:'家族群成员', desc:'经历了家族群大战', check: g => g.flags.familyGroupChat },
    { id:'hometown_taste', icon:'🍜', name:'家乡味道', desc:'想念妈妈做的菜', check: g => g.flags.hometownFood },
    { id:'parent_visit_ach', icon:'🚄', name:'爸妈来了', desc:'爸妈来看你了', check: g => g.flags.parentVisiting },
    { id:'parent_aging_ach', icon:'👴', name:'岁月不饶人', desc:'发现父母老了', check: g => g.flags.parentAging },
    // === v12.7 新增成就 ===
    { id:'solo_liver', icon:'🏠', name:'独居达人', desc:'开始了独居生活', check: g => g.flags.soloLiving },
    { id:'rent_survivor', icon:'💸', name:'租房老手', desc:'经历了又一次涨租', check: g => g.flags.rentHikeV2 },
    { id:'commuter', icon:'🚇', name:'通勤战士', desc:'征服了地狱通勤', check: g => g.flags.subwayCommute },
    { id:'neighbor_war', icon:'🔊', name:'邻里战争', desc:'遇到了奇葩邻居', check: g => g.flags.neighborFromHell },
    { id:'night_foodie', icon:'🍜', name:'深夜食客', desc:'找到了深夜食堂', check: g => g.flags.midnightSnack },
    { id:'delivery_master', icon:'📦', name:'外卖专家', desc:'反思了外卖生活', check: g => g.flags.deliveryAddiction },
    { id:'house_hunter', icon:'🔑', name:'找房达人', desc:'经历了租房大战', check: g => g.flags.apartmentHunting },
    { id:'night_rider_v2', icon:'🚕', name:'夜归人', desc:'深夜打车回家', check: g => g.flags.lateNightTaxi },
    { id:'weekend_alone', icon:'☕', name:'周末独行侠', desc:'学会了一个人过周末', check: g => g.flags.weekendSolo },
    { id:'urban_guide', icon:'🎯', name:'都市生存专家', desc:'总结了生存指南', check: g => g.flags.urbanSurvival },
    // === v12.8 新增成就 ===
    { id:'kaogong_warrior_v2', icon:'⚔️', name:'考公战士', desc:'参加了公务员考试', check: g => g.flags.kaogongWar },
    { id:'mba_graduate_v2', icon:'🎓', name:'MBA学员', desc:'决定读MBA', check: g => g.flags.mbaDream },
    { id:'cert_collector', icon:'📜', name:'考证达人', desc:'疯狂考取各种证书', check: g => g.flags.certCollection },
    { id:'career_changer_v3', icon:'🔄', name:'转行勇士', desc:'勇敢换了行业', check: g => g.flags.careerSwitch },
    { id:'course_addict', icon:'💻', name:'网课达人', desc:'沉迷在线学习', check: g => g.flags.onlineCourse },
    { id:'mentee_v2', icon:'👨‍🏫', name:'拜师学艺', desc:'找到了人生导师', check: g => g.flags.mentorFound },
    { id:'public_speaker', icon:'🎤', name:'演讲者', desc:'完成了公开演讲', check: g => g.flags.publicSpeech },
    { id:'night_student', icon:'🌙', name:'夜校学员', desc:'在社区夜校充电', check: g => g.flags.nightSchool },
    { id:'startup_joiner', icon:'🚀', name:'创业参与者', desc:'加入了创业公司', check: g => g.flags.startupInvite },
    { id:'imposter_healer', icon:'🎭', name:'自我和解', desc:'面对了冒充者综合征', check: g => g.flags.imposterSyndrome },
    // === v12.9 新增成就 ===
    { id:'health_alarm', icon:'📋', name:'体检惊魂', desc:'被体检报告吓到了', check: g => g.flags.healthCheckShock },
    { id:'gym_user', icon:'🏋️', name:'健身房会员', desc:'办了健身卡', check: g => g.flags.gymMembership },
    { id:'burnout_survivor_v3', icon:'🔥', name:'倦怠幸存者', desc:'经历了职业倦怠', check: g => g.flags.burnoutCrisis },
    { id:'meditator', icon:'🧘', name:'冥想者', desc:'开始冥想', check: g => g.flags.meditationStart },
    { id:'tcm_fan', icon:'🍵', name:'养生爱好者', desc:'开始中医养生', check: g => g.flags.tcmWellnessV2 },
    { id:'sleep_fixer', icon:'😴', name:'还觉人', desc:'开始还睡眠债', check: g => g.flags.sleepDebt },
    { id:'marathoner', icon:'🏃', name:'马拉松跑者', desc:'完成了马拉松', check: g => g.flags.marathonDream },
    { id:'therapy_goer_v2', icon:'💭', name:'勇敢求助者v2', desc:'去做了心理咨询', check: g => g.flags.therapySession },
    { id:'health_tracker', icon:'⌚', name:'健康追踪者', desc:'开始用健康手环', check: g => g.flags.healthApp },
    { id:'self_acceptor', icon:'🪞', name:'自我接纳者', desc:'面对了容貌焦虑', check: g => g.flags.bodyImage },
    // === v13.0 新增成就 ===
    { id:'volunteer_ach_v2', icon:'🤝', name:'社区志愿者', desc:'参加了志愿者活动', check: g => g.flags.volunteerWork },
    { id:'declutterer', icon:'🛍️', name:'断舍离达人', desc:'在二手市场卖东西', check: g => g.flags.secondHandShop },
    { id:'city_walker', icon:'🚶', name:'City Walker', desc:'参加了城市漫步', check: g => g.flags.cityWalk },
    { id:'pet_mourner', icon:'💔', name:'失去挚友', desc:'经历了宠物离世', check: g => g.flags.petLoss },
    { id:'salary_negotiator', icon:'💰', name:'薪资谈判者', desc:'成功谈了加薪', check: g => g.flags.salaryNegotiation },
    { id:'bookworm_v2_v2', icon:'📖', name:'读书会成员', desc:'加入了读书会', check: g => g.flags.bookClub },
    { id:'freelancer_ach', icon:'💻', name:'自由职业起步', desc:'开始接私活', check: g => g.flags.freelanceStart },
    { id:'bridge_builder_v2', icon:'👴', name:'代沟弥合者', desc:'试着理解父母那一代', check: g => g.flags.generationGap },
    { id:'true_minimalist', icon:'📦', name:'极简主义者', desc:'坚持了极简生活', check: g => g.flags.minimalistLife },
    { id:'nomad_dreamer', icon:'🌍', name:'数字游民', desc:'尝试了数字游民生活', check: g => g.flags.digitalNomad },
    { id:'introvert_power', icon:'😰', name:'社恐达人', desc:'接受了自己的社交节奏', check: g => g.flags.socialAnxiety },
    { id:'hobby_entrepreneur', icon:'💡', name:'爱好创业者', desc:'把爱好变成了副业', check: g => g.flags.hobbyBusiness },
    { id:'age_wise', icon:'🎂', name:'年龄智者', desc:'面对了年龄焦虑', check: g => g.flags.ageAnxiety },
    { id:'philosopher_v2', icon:'🌟', name:'生活哲学家', desc:'找到了自己的人生哲学', check: g => g.flags.lifePhilosophy },
    // === v13.1 新增成就 ===
    { id:'blind_dater', icon:'💕', name:'相亲老手', desc:'经历了相亲', check: g => g.flags.blindDate },
    { id:'cohabiter', icon:'🏠', name:'同居时代', desc:'开始了同居生活', check: g => g.flags.cohabitation },
    { id:'marriage_pressured', icon:'💍', name:'催婚受害者', desc:'被催婚了', check: g => g.flags.marriagePressure },
    { id:'wedding_planner', icon:'💒', name:'婚礼筹备者', desc:'筹备了婚礼', check: g => g.flags.weddingCost },
    { id:'single_happy_v2', icon:'🎉', name:'快乐单身', desc:'享受单身生活', check: g => g.flags.singleLife },
    { id:'fighter_love', icon:'🥊', name:'爱情战士', desc:'和对象大吵一架', check: g => g.flags.relationshipFight },
    { id:'prenup_talker', icon:'📋', name:'婚前协议', desc:'谈了婚前协议', check: g => g.flags.prenupTalk },
    { id:'divorce_thinker', icon:'💔', name:'围城思考者', desc:'想过离婚', check: g => g.flags.divorceThought },
    { id:'child_decider', icon:'👶', name:'生育抉择者', desc:'面对了生育选择', check: g => g.flags.childDecision },
    { id:'couple_traveler', icon:'✈️', name:'情侣旅行家', desc:'和对象一起旅行', check: g => g.flags.coupleTravel },
    // === v13.2 新增成就 ===
    { id:'chicken_parent', icon:'🐔', name:'鸡娃家长', desc:'加入了鸡娃大军', check: g => g.flags.chickenBaby },
    { id:'school_district_buyer', icon:'🏫', name:'学区房业主', desc:'买了学区房', check: g => g.flags.schoolDistrictHouse },
    { id:'extracurricular_master', icon:'🎨', name:'兴趣班达人', desc:'给孩子报了各种兴趣班', check: g => g.flags.extracurricularWar },
    { id:'kindergarten_veteran', icon:'🎒', name:'幼小衔接老手', desc:'经历了幼小衔接', check: g => g.flags.kindergartenInterview },
    { id:'parent_group_survivor', icon:'📱', name:'家长群幸存者', desc:'在家长群活下来了', check: g => g.flags.parentTeacherGroup },
    { id:'middle_school_warrior', icon:'📝', name:'中考战士', desc:'经历了中考分流', check: g => g.flags.middleSchoolExam },
    { id:'study_abroad_parent', icon:'✈️', name:'留学家长', desc:'送孩子出国留学', check: g => g.flags.studyAbroad },
    { id:'ai_educator', icon:'🤖', name:'AI教育先锋', desc:'教孩子正确使用AI', check: g => g.flags.aiEducation },
    { id:'teen_supporter', icon:'💚', name:'青少年守护者', desc:'关注了孩子心理健康', check: g => g.flags.teenDepression },
    { id:'relaxed_parent', icon:'🌿', name:'佛系家长', desc:'选择了松弛感育儿', check: g => g.flags.relaxedParenting },
    // === v13.3 新增成就 ===
    { id:'midlife_crisis_survivor', icon:'😰', name:'35岁危机幸存者', desc:'度过了35岁危机', check: g => g.flags.midlifeCrisis35 },
    { id:'second_startup_founder', icon:'🚀', name:'二次创业者', desc:'开始了第二次创业', check: g => g.flags.secondStartupDone },
    { id:'health_awakened_40', icon:'🏥', name:'40岁健康觉醒', desc:'40岁开始关注健康', check: g => g.flags.healthCrisis40 },
    { id:'empty_nester_real', icon:'🪺', name:'空巢家长', desc:'孩子离家上大学了', check: g => g.flags.emptyNest },
    { id:'career_pivot_40_ach', icon:'🔄', name:'40岁转行者', desc:'40岁勇敢转行', check: g => g.flags.careerPivot40 },
    { id:'retirement_planner_real', icon:'🧓', name:'退休规划师v2', desc:'开始认真规划退休', check: g => g.flags.retirementCountdownReal },
    { id:'parent_caregiver', icon:'👴', name:'父母照护者', desc:'开始照顾年迈父母', check: g => g.flags.parentAgingCare },
    { id:'marriage_renewer', icon:'💑', name:'婚姻重塑者', desc:'面对了中年婚姻危机', check: g => g.flags.midlifeMarriageCrisis },
    { id:'legacy_builder', icon:'🌟', name:'遗产建造者', desc:'思考了人生遗产', check: g => g.flags.legacyThinking },
    { id:'second_youth_liver', icon:'🌸', name:'第二春', desc:'迎来了人生第二春', check: g => g.flags.secondYouthDone },
    // === v14.0 新增成就 ===
    { id:'digital_detox_week_ach', icon:'📵', name:'数字断联者', desc:'完成了一周数字断联', check: g => g.flags.digitalDetoxWeek },
    { id:'social_media_quitter', icon:'📱', name:'社交媒体戒断者', desc:'面对了社交媒体成瘾', check: g => g.flags.socialMediaAddiction },
    { id:'online_shopper', icon:'🛒', name:'网购达人', desc:'经历了网购成瘾', check: g => g.flags.onlineShoppingAddiction },
    { id:'livestream_buyer', icon:'📺', name:'直播间剁手党', desc:'在直播间买了东西', check: g => g.flags.livestreamShopping },
    { id:'remote_worker_v2_v2', icon:'💻', name:'远程办公者', desc:'体验了远程办公', check: g => g.flags.remoteWork },
    { id:'food_delivery_master', icon:'🍱', name:'外卖专家', desc:'反思了外卖依赖', check: g => g.flags.foodDeliveryAddiction },
    { id:'subscription_manager', icon:'💳', name:'订阅管理师', desc:'整理了所有订阅', check: g => g.flags.subscriptionFatigue },
    { id:'urban_farmer_v2', icon:'🌱', name:'都市农夫', desc:'在阳台种了菜', check: g => g.flags.urbanGardening },
    { id:'podcast_fan', icon:'🎧', name:'播客爱好者', desc:'成了播客听众', check: g => g.flags.podcastListener },
    { id:'urban_explorer', icon:'🗺️', name:'城市探险家', desc:'探索了城市的角落', check: g => g.flags.urbanExploration },
    // === v14.1 新增成就 ===
    { id:'hometown_returner', icon:'🏡', name:'返乡者', desc:'考虑过回老家', check: g => g.flags.hometownReturnThought },
    { id:'small_towner', icon:'🏘️', name:'小城居民', desc:'体验了小城生活', check: g => g.flags.smallTownLife },
    { id:'county_entrepreneur', icon:'🏪', name:'县城创业者', desc:'在县城开了店', check: g => g.flags.countyEconomy },
    { id:'small_town_social_ach', icon:'🍻', name:'小城社交达人', desc:'融入了小城社交圈', check: g => g.flags.smallTownSocial },
    { id:'gap_witnesser', icon:'📊', name:'城乡差距见证者', desc:'感受了城乡差异', check: g => g.flags.urbanRuralGap },
    { id:'hometown_food_lover', icon:'🍜', name:'家乡味道爱好者', desc:'吃到了正宗家乡菜', check: g => g.flags.hometownFoodTaste },
    { id:'small_town_entertainer', icon:'🎤', name:'小城娱乐家', desc:'体验了小城的娱乐', check: g => g.flags.smallTownEntertainment },
    { id:'reverse_migrant', icon:'🔄', name:'反向迁徙者', desc:'选择了返乡生活', check: g => g.flags.reverseMigration },
    { id:'hometown_changer', icon:'🏗️', name:'家乡建设者', desc:'见证了家乡的变化', check: g => g.flags.hometownChange },
    { id:'life_balance_chooser', icon:'⚖️', name:'人生选择者', desc:'做出了人生选择', check: g => g.flags.lifeBalanceChoice },
    // === v14.2 新增成就（宠物经济） ===
    { id:'pet_adopter', icon:'🏠', name:'铲屎官上线', desc:'领养了一只宠物', check: g => g.flags.adoptPet },
    { id:'pet_medical_ach', icon:'🏥', name:'宠物医疗', desc:'带宠物看了病', check: g => g.flags.petMedical },
    { id:'pet_social_ach', icon:'🐕', name:'宠物社交', desc:'通过宠物交了朋友', check: g => g.flags.petSocial },
    { id:'pet_economy_ach', icon:'💸', name:'宠物经济', desc:'感受到了养宠的开销', check: g => g.flags.petEconomy },
    { id:'pet_companion_ach', icon:'🤝', name:'最佳伙伴', desc:'和宠物建立了深厚感情', check: g => g.flags.petCompanion },
    { id:'pet_loss_ach', icon:'💔', name:'离别之痛', desc:'经历了宠物的离去', check: g => g.flags.petLoss },
    { id:'pet_travel_ach', icon:'✈️', name:'带宠出行', desc:'带宠物去旅行', check: g => g.flags.petTravel },
    { id:'pet_business_ach', icon:'🏪', name:'宠物创业', desc:'进入了宠物行业', check: g => g.flags.petBusiness },
    { id:'pet_community_ach', icon:'👥', name:'宠物社群', desc:'加入了宠物社群', check: g => g.flags.petCommunity },
    { id:'pet_lifestyle_ach', icon:'🌈', name:'宠物生活方式', desc:'宠物成为生活的一部分', check: g => g.flags.petLifestyle },
    // === v14.3 新增成就（老年生活） ===
    { id:'retirement_planner_ach', icon:'🏖️', name:'退休规划师', desc:'开始规划退休生活', check: g => g.flags.retirementPlanning },
    { id:'square_dancer_ach', icon:'💃', name:'广场舞达人', desc:'加入了广场舞大军', check: g => g.flags.squareDancing },
    { id:'senior_uni_ach', icon:'🎓', name:'老年大学', desc:'体验了老年大学', check: g => g.flags.seniorUniversity },
    { id:'health_conscious_ach', icon:'🥗', name:'健康觉醒', desc:'开始重视身体健康', check: g => g.flags.healthCrisisElder },
    { id:'empty_nest_ach', icon:'🏠', name:'空巢适应者', desc:'适应了空巢生活', check: g => g.flags.emptyNest },
    { id:'memoirist_ach', icon:'📖', name:'回忆录作者', desc:'开始写回忆录', check: g => g.flags.memoirist },
    { id:'grandparent_ach', icon:'👴', name:'隔代育儿', desc:'经历了隔代育儿', check: g => g.flags.grandparentRole },
    { id:'elder_traveler_ach', icon:'✈️', name:'银发旅行家', desc:'参加了老年旅行团', check: g => g.flags.elderTravel },
    { id:'legacy_thinker_ach', icon:'🌟', name:'传承思考者', desc:'思考了人生传承', check: g => g.flags.legacyThinking },
    { id:'digital_elder_ach', icon:'📱', name:'数字银发族', desc:'面对了数字鸿沟', check: g => g.flags.digitalElder },
    { id:'elder_friend_ach', icon:'🤝', name:'忘年之交', desc:'交了老年朋友', check: g => g.flags.elderFriendship },
    { id:'hobby_rediscoverer_ach', icon:'🎨', name:'重拾爱好', desc:'找回了年轻时的爱好', check: g => g.flags.hobbyRediscovery },
    // === v14.4 新增成就（跨代关系） ===
    { id:'grandparent_bond_ach', icon:'👵', name:'祖孙情深', desc:'和祖辈建立了深厚感情', check: g => g.flags.grandparentBond },
    { id:'tradition_keeper_ach', icon:'🏮', name:'家风传承人', desc:'传承了家族传统', check: g => g.flags.familyTradition },
    { id:'generation_bridge_ach', icon:'🌉', name:'代际桥梁', desc:'化解了代际冲突', check: g => g.flags.generationGap },
    { id:'elder_carer_ach', icon:'🏥', name:'养老担当者', desc:'面对了养老困境', check: g => g.flags.elderCareDilemma },
    { id:'supportive_child_ach', icon:'💕', name:'开明子女', desc:'支持了父母的黄昏恋', check: g => g.flags.elderRemarriage },
    { id:'family_gatherer_ach', icon:'🎊', name:'家族凝聚者', desc:'组织了家族聚会', check: g => g.flags.familyReunion },
    { id:'inheritance_planner_ach', icon:'📋', name:'遗产规划者', desc:'面对了遗产话题', check: g => g.flags.inheritanceTalk },
    { id:'child_growth_ach', icon:'🌱', name:'放手父母', desc:'学会了对孩子放手', check: g => g.flags.childGrowingUp },
    { id:'recipe_inheritor_ach', icon:'🍲', name:'家传味道', desc:'学会了家传菜谱', check: g => g.flags.familyRecipe },
    { id:'filial_awareness_ach', icon:'⏳', name:'孝心觉醒', desc:'意识到父母老了', check: g => g.flags.parentAging },
    // === v15.0 新增成就（心理健康） ===
    { id:'anxiety_survivor_ach', icon:'😰', name:'焦虑幸存者', desc:'经历了焦虑发作', check: g => g.flags.anxietyAttack },
    { id:'depression_fighter_ach', icon:'🌧️', name:'情绪战士', desc:'面对了情绪低谷', check: g => g.flags.depressionFog },
    { id:'therapy_seeker_ach', icon:'🛋️', name:'心理咨询者', desc:'尝试了心理咨询', check: g => g.flags.therapySession },
    { id:'mindful_practitioner_ach', icon:'🧘', name:'正念练习者', desc:'开始正念冥想', check: g => g.flags.mindfulnessMeditation },
    { id:'social_anxiety_ach', icon:'😶', name:'社恐斗士', desc:'面对了社交恐惧', check: g => g.flags.socialAnxiety },
    { id:'sleep_healer_ach', icon:'🌙', name:'睡眠改善者', desc:'改善了失眠问题', check: g => g.flags.chronicInsomnia },
    { id:'exercise_healer_ach', icon:'🏃', name:'运动疗愈师', desc:'通过运动改善心理', check: g => g.flags.exerciseTherapy },
    { id:'art_healer_ach', icon:'🎨', name:'艺术疗愈者', desc:'尝试了艺术疗愈', check: g => g.flags.artTherapy },
    { id:'burnout_survivor_ach', icon:'🔥', name:'倦怠恢复者', desc:'经历了职业倦怠', check: g => g.flags.burnoutRecovery },
    { id:'cbt_practitioner_ach', icon:'📝', name:'CBT实践者', desc:'学习了认知行为疗法', check: g => g.flags.cbtSelfHelp },
    { id:'journal_keeper_ach', icon:'📓', name:'情绪记录者', desc:'开始写情绪日记', check: g => g.flags.emotionalJournal },
    { id:'self_compassion_ach', icon:'💝', name:'自我关怀者', desc:'学会了自我关怀', check: g => g.flags.selfCompassion },
    { id:'support_group_ach', icon:'🫂', name:'互助参与者', desc:'加入了互助小组', check: g => g.flags.supportGroupJoin },
    { id:'crisis_caller_ach', icon:'📞', name:'求助勇者', desc:'拨打了心理热线', check: g => g.flags.crisisHotline },
    // === v15.1 新增成就（数字生活） ===
    { id:'short_video_ach', icon:'📱', name:'短视频觉醒', desc:'意识到短视频成瘾', check: g => g.flags.shortVideoAddiction },
    { id:'live_shopper_ach', icon:'🛒', name:'直播观察者', desc:'体验了直播带货', check: g => g.flags.liveStreamShopping },
    { id:'delivery_rider_ach', icon:'🛵', name:'外卖骑手', desc:'体验了外卖骑手生活', check: g => g.flags.deliveryRider },
    { id:'self_media_ach', icon:'📹', name:'自媒体人', desc:'开始了自媒体创作', check: g => g.flags.selfMediaCreator },
    { id:'ai_user_ach', icon:'🤖', name:'AI使用者', desc:'开始使用AI工具', check: g => g.flags.aiToolsUsage },
    { id:'digital_nomad_ach_v2', icon:'🌍', name:'数字游民', desc:'体验了数字游民生活', check: g => g.flags.digitalNomad },
    { id:'online_learner_ach', icon:'📚', name:'知识付费者', desc:'购买了在线课程', check: g => g.flags.onlineCourse },
    { id:'ride_hailer_ach', icon:'🚗', name:'网约车司机', desc:'跑了网约车', check: g => g.flags.rideHailingDriver },
    { id:'privacy_guard_ach', icon:'🔒', name:'隐私卫士', desc:'关注了个人隐私', check: g => g.flags.privacyConcern },
    { id:'gig_worker_ach', icon:'💼', name:'零工达人', desc:'体验了零工经济', check: g => g.flags.gigEconomy },
    // === v15.2 新增成就（社交文化） ===
    { id:'dinner_party_ach', icon:'🍻', name:'饭局老手', desc:'参加了职场饭局', check: g => g.flags.dinnerParty },
    { id:'gift_giver_ach', icon:'🎁', name:'送礼达人', desc:'经历了送礼焦虑', check: g => g.flags.giftGivingAnxiety },
    { id:'cyber_survivor_ach', icon:'💻', name:'网暴幸存者', desc:'经历了网络暴力', check: g => g.flags.cyberbullyingVictim },
    { id:'critical_thinker_ach', icon:'🫧', name:'独立思考者', desc:'意识到了信息茧房', check: g => g.flags.informationBubble },
    { id:'anti_involution_ach', icon:'🏢', name:'反卷先锋', desc:'面对了同事内卷', check: g => g.flags.colleagueCompetition },
    { id:'neighbor_peace_ach', icon:'🏘️', name:'邻里和平使者', desc:'处理了邻里纠纷', check: g => g.flags.neighborDispute },
    { id:'favor_master_ach', icon:'🤝', name:'人情练达', desc:'面对了人情债', check: g => g.flags.favorExchange },
    { id:'face_free_ach', icon:'🎭', name:'面子自由', desc:'不再被面子绑架', check: g => g.flags.faceCulture },
    // === v15.3 新增成就（消费文化） ===
    { id:'double11_ach', icon:'🛍️', name:'双十一战士', desc:'经历了双十一', check: g => g.flags.doubleEleven },
    { id:'minimalist_ach', icon:'🧹', name:'极简主义者', desc:'开始了极简生活', check: g => g.flags.minimalismJourney },
    { id:'guochao_fan_ach', icon:'🐉', name:'国潮爱好者', desc:'拥抱了国潮', check: g => g.flags.guochaoTrend },
    { id:'subscription_optimizer_ach', icon:'💳', name:'订阅优化师', desc:'优化了订阅服务', check: g => g.flags.subscriptionFatigueV2 },
    { id:'second_hand_expert_ach', icon:'♻️', name:'二手达人', desc:'进入了二手市场', check: g => g.flags.secondHandMarket },
    { id:'smart_consumer_ach', icon:'📈', name:'精明消费者', desc:'学会了消费升级', check: g => g.flags.consumptionUpgrade },
    { id:'experience_investor_ach', icon:'🎪', name:'体验投资者', desc:'投资了体验而非物品', check: g => g.flags.experienceEconomy },
    { id:'financial_learner_ach', icon:'📊', name:'理财学徒', desc:'开始学习理财', check: g => g.flags.financialAnxiety },
    { id:'local_supporter_ach', icon:'🏪', name:'宝藏猎人', desc:'发现了宝藏小店', check: g => g.flags.localBrandDiscovery },
    // === v16.0 新增成就（住房问题） ===
    { id:'rental_survivor_ach', icon:'🏚️', name:'租房幸存者', desc:'经历了租房噩梦', check: g => g.flags.rentalNightmare },
    { id:'housemate_peace_ach', icon:'🏠', name:'室友和平使者', desc:'处理了室友矛盾', check: g => g.flags.housemateConflict },
    { id:'property_fighter_ach', icon:'🏢', name:'物业斗士', desc:'面对了物业纠纷', check: g => g.flags.propertyManagement },
    { id:'renovator_ach', icon:'🔨', name:'装修老手', desc:'经历了装修血泪', check: g => g.flags.homeRenovation },
    { id:'mortgage_holder_ach', icon:'🏦', name:'月供族', desc:'承担了房贷压力', check: g => g.flags.mortgagePressure },
    { id:'village_memory_ach', icon:'🏘️', name:'城中村记忆', desc:'经历了城中村拆迁', check: g => g.flags.urbanVillage },
    { id:'frequent_mover_ach', icon:'📦', name:'搬家达人', desc:'搬了很多次家', check: g => g.flags.movingDay },
    { id:'community_builder_ach', icon:'🌻', name:'社区建设者', desc:'参与了社区花园', check: g => g.flags.communityGarden },
    { id:'city_belonger_ach', icon:'🏙️', name:'城市归属者', desc:'思考了城市归属感', check: g => g.flags.cityIdentity },
    // === v16.1 新增成就（饮食文化） ===
    { id:'takeout_reformer_ach', icon:'🥡', name:'外卖改革者', desc:'减少了外卖依赖', check: g => g.flags.takeoutDependency },
    { id:'coffee_moderator_ach', icon:'☕', name:'咖啡节制者', desc:'控制了咖啡摄入', check: g => g.flags.coffeeCulture },
    { id:'milk_tea_fan_ach', icon:'🧋', name:'奶茶爱好者', desc:'经历了奶茶续命', check: g => g.flags.milkTeaAddiction },
    { id:'body_positive_ach', icon:'⚖️', name:'身体自信', desc:'接受了自己的身体', check: g => g.flags.dietAnxiety },
    { id:'home_cook_ach', icon:'👨‍🍳', name:'家庭厨师', desc:'开始自己做饭', check: g => g.flags.cookingDiscovery },
    { id:'health_porridge_ach', icon:'🥣', name:'养生达人', desc:'开始喝养生粥', check: g => g.flags.healthPorridge },
    { id:'drinking_refuser_ach', icon:'🍺', name:'拒酒达人', desc:'学会了拒绝酒桌文化', check: g => g.flags.drinkingCulture },
    // === v16.2 新增成就（交通出行） ===
    { id:'subway_warrior_ach', icon:'🚇', name:'地铁战士', desc:'习惯了地铁通勤', check: g => g.flags.subwayCommute },
    { id:'spring_rush_ach', icon:'🚄', name:'春运勇士', desc:'经历了春运抢票', check: g => g.flags.springFestivalRush },
    { id:'bike_lover_ach', icon:'🚲', name:'骑行爱好者', desc:'开始骑车通勤', check: g => g.flags.sharedBike },
    { id:'commute_optimizer_ach', icon:'🚗', name:'通勤优化师', desc:'学会了错峰出行', check: g => g.flags.trafficJam },
    { id:'driver_license_ach', icon:'🚙', name:'持证上路', desc:'考取了驾照', check: g => g.flags.drivingTest },
    { id:'ebike_rider_ach', icon:'🛵', name:'电动车骑士', desc:'骑上了电动车', check: g => g.flags.ebikeLife },
    // === v16.3 新增成就（文化娱乐） ===
    { id:'script_player_ach', icon:'🔍', name:'剧本杀玩家', desc:'体验了剧本杀', check: g => g.flags.scriptMurder },
    { id:'comedy_fan_ach', icon:'🎤', name:'脱口秀迷', desc:'看了脱口秀', check: g => g.flags.standupComedy },
    { id:'game_controller_ach', icon:'🎮', name:'游戏自律者', desc:'控制了游戏时间', check: g => g.flags.mobileGameAddiction },
    { id:'escape_artist_ach', icon:'🚪', name:'密室达人', desc:'玩了密室逃脱', check: g => g.flags.escapeRoom },
    { id:'cinephile_ach', icon:'🎬', name:'影迷', desc:'享受了一个人的电影', check: g => g.flags.movieNight },
    { id:'festival_goer_ach', icon:'🎵', name:'音乐节达人', desc:'参加了音乐节', check: g => g.flags.musicFestival },
    { id:'bookworm_ach_v2', icon:'📚', name:'读书会成员', desc:'加入了读书会', check: g => g.flags.bookClub },
    // === v17.0 新增成就（教育体系 + 终身学习） ===
    { id:'gaokao_retry_ach', icon:'📝', name:'不屈的复读生', desc:'经历了高考复读', check: g => g.flags.gaokaoRetry },
    { id:'grad_student_ach', icon:'🎓', name:'研究生', desc:'体验了研究生生活', check: g => g.flags.gradSchoolLife },
    { id:'overseas_scholar_ach', icon:'✈️', name:'海归', desc:'出国留学', check: g => g.flags.studyAbroad },
    { id:'cert_collector_ach', icon:'📜', name:'证书收集者', desc:'疯狂考证', check: g => g.flags.certMania },
    { id:'mba_graduate_ach', icon:'💼', name:'MBA毕业生', desc:'完成了在职MBA', check: g => g.flags.partTimeMBA },
    { id:'involution_survivor_ach', icon:'🌀', name:'内卷幸存者', desc:'经历了教育内卷', check: g => g.flags.involutionEdu },
    { id:'tiger_parent_ach_v2', icon:'🐯', name:'鸡娃家长', desc:'成为了鸡娃家长', check: g => g.flags.tigerParent },
    { id:'school_house_ach', icon:'🏠', name:'学区房业主', desc:'买了学区房', check: g => g.flags.schoolDistrictHouse },
    { id:'slow_living_ach', icon:'🐌', name:'慢就业青年', desc:'选择了慢就业', check: g => g.flags.slowEmployment },
    { id:'gap_year_ach', icon:'🌍', name:'间隔年旅行者', desc:'给自己放了一个间隔年', check: g => g.flags.gapYear },
    { id:'craftsman_ach', icon:'🔧', name:'手艺人', desc:'学了职业技术', check: g => g.flags.vocationalEdu },
    { id:'whistleblower_ach', icon:'⚖️', name:'学术正义者', desc:'举报了学术不端', check: g => g.flags.whistleblower },
    { id:'self_study_ach', icon:'📖', name:'自考勇士', desc:'通过成人自考提升学历', check: g => g.flags.adultSelfExam },
    { id:'self_taught_ach', icon:'💻', name:'自学成才', desc:'通过B站自学编程', check: g => g.flags.selfTaughtCoder },
    { id:'lifelong_learner_ach', icon:'🌱', name:'终身学习者', desc:'40岁仍在学习新技能', check: g => g.flags.lifelongLearning },
    { id:'phd_survivor_ach', icon:'🔬', name:'博士幸存者', desc:'熬过了博士心理健康危机', check: g => g.flags.phdMentalHealth },
    // === v17.1 新增成就（节日文化） ===
    { id:'travel_enthusiast_ach', icon:'🏖️', name:'旅行达人', desc:'享受了国庆假期', check: g => g.flags.nationalDayTravel },
    { id:'diao_xiu_survivor_ach', icon:'😤', name:'调休幸存者', desc:'熬过了调休连班', check: g => g.flags.diaoXiu },
    { id:'self_love_ach', icon:'💝', name:'爱自己', desc:'在节日给自己买了礼物', check: g => g.flags.selfLove },
    { id:'spring_outing_ach', icon:'🌸', name:'踏青赏花', desc:'清明时节去踏青', check: g => g.flags.springOuting },
    { id:'new_year_wish_ach', icon:'🎆', name:'新年许愿', desc:'参加了跨年倒数', check: g => g.flags.newYearEve },
    { id:'smart_shopper_ach', icon:'🛒', name:'理性消费者', desc:'双十一理性购物', check: g => g.flags.smartShopper },
    { id:'holiday_slacker_ach', icon:'😴', name:'假期宅家王', desc:'假期宅家躺平', check: g => g.flags.holidaySlacker },
    { id:'off_peak_traveler_ach', icon:'✈️', name:'错峰旅行家', desc:'学会了错峰出行', check: g => g.flags.offPeakTravel },
    { id:'zongzi_maker_ach', icon:'🎋', name:'粽子师傅', desc:'学会了自己包粽子', check: g => g.flags.learnedZongzi },
    { id:'holiday_cook_ach', icon:'🌙', name:'节日大厨', desc:'一个人过节也做了一顿大餐', check: g => g.flags.cookingHoliday },
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
    { id:'career_transformer_end', badge:'🔄', title:'职业转型者', desc:'你勇敢地走出了舒适区，完成了职业转型。\n\n新的领域让你重新找回了激情。\n\n"转行不是失败，是重新开始。"', cond: g => g.flags.careerChange && g.jobSalary>=15000 && g.intel>=75 && g.mood>=65 && g.age>=32 },
    // --- v8.1 NEW ENDINGS (策划团队建议) ---
    { id:'trade_king_end', badge:'🏪', title:'倒爷之王', desc:'你成了地下交易市场的传奇。\n\n从华强北到中关村，从黄牛票到限量球鞋，没有你没倒过的东西。你的商业嗅觉比华尔街的分析师还灵敏。\n\n有人说你"投机倒把"，你说这叫"资源配置优化"。\n\n"市场经济的本质就是信息差——你只是比别人更懂这个道理。"\n\n你的仓库堆满了货，你的微信好友5000人，你的账上有六位数。\n\n虽然你妈至今不知道你具体做什么工作。', cond: g => g.flags.tradeProfit && g.money>=200000 && g.intel>=65 && g.age>=28 },
    { id:'loan_shark_end', badge:'🦈', title:'网贷深渊', desc:'你借了网贷。然后以贷养贷。然后利滚利。\n\n从借5000变成了欠50万。催收电话打给了你所有的通讯录好友，你的同事、领导、父母都收到了短信。\n\n你不敢接陌生电话，不敢看微信消息，不敢出门。\n\n"你以为借的是钱，其实借的是命。"\n\n你终于鼓起勇气，给家里打了电话。你妈在电话那头哭了。\n\n（如果你或身边的人遭遇网贷困扰，请拨打法律援助热线：12348）', cond: g => g.flags.loanSharkOwed && g.money<=-50000 && g.mood<=25 },
    // --- v9.1 NEW ENDINGS ---
    { id:'info_broker_end', badge:'🕸️', title:'消息灵通人士', desc:'你成了圈子里的"消息灵通人士"。\n\n谁家要卖房、哪家公司要招人、哪个领导要被调走——你比他们的HR还先知道。\n\n你用这些信息换了无数人情，也在不知不觉中编织了一张无形的关系网。\n\n有人说你"八面玲珑"，你说你只是"比较爱聊天"。\n\n"信息就是权力——即使你只是一个爱八卦的打工人。"', cond: g => g.flags._rumorCooldown && g.flags._rumorCooldown.length >= 8 && g.social >= 70 && g.intel >= 60 },
    { id:'pet_companion_end', badge:'🐱', title:'猫奴人生', desc:'你领养了那只橘猫。从此你的生活多了一个室友。\n\n它会在你加班时趴在键盘上，会在你emo时蹭你的手，会在你睡着时偷看你的手机。\n\n你给它取名"房租"——因为它比你更会占地方。\n\n"养猫之后你才明白：被需要，也是一种幸福。"', cond: g => g.flags.hasPet && g.mood >= 60 && g.age >= 30 },
    { id:'city_nomad_end', badge:'🗺️', title:'城市游牧民', desc:'你搬了三次以上的城市，每次都是重新开始。\n\n你在北京挤过地铁，在上海喝过咖啡，在深圳加过班，在成都吃过火锅。\n\n你见过不同的城市，也见过同样的自己——一个永远在寻找更好生活的漂泊者。\n\n"也许没有最好的城市，只有最适合自己的节奏。"', cond: g => g.flags.citySwitch && g.age >= 35 && g.social >= 50 },
    // --- v9.2 NEW ENDINGS ---
    { id:'investor_end', badge:'💰', title:'理财达人', desc:'你从一个"月光族"变成了"理财达人"。\n\n你的投资组合从余额宝到A股，从基金到比特币，收益率跑赢了90%的散户。\n\n你在知乎上写了篇《我的投资心得》，获得了10万+阅读。\n\n"钱不是万能的，但没有钱是万万不能的。而你，已经学会了让钱为你工作。"', cond: g => g.flags.hasInvestment && g.investments && Object.values(g.investments).some(v => v > 50000) && g.money >= 100000 && g.intel >= 65 },
    { id:'happy_family_end', badge:'👨‍👩‍👧', title:'幸福家庭', desc:'你结了婚，有了家。\n\n在大城市里，你们有了自己的小天地。虽然房子是租的，但生活是自己的。\n\n每个周末你们会一起做饭、看电影、逛公园。你觉得这就是幸福。\n\n"幸福不是拥有多少，而是和谁在一起。"', cond: g => g.flags.married && g.mood >= 70 && g.age >= 30 },
    { id:'crisis35_triumph', badge:'⚡', title:'35岁逆袭', desc:'35岁危机？你把它变成了转折点。\n\n当别人在焦虑中躺平时，你找到了新的方向——可能是创业，可能是转行，可能是考公。\n\n你证明了一件事：35岁不是终点，而是另一段旅程的起点。\n\n"人生没有太晚的开始。"', cond: g => g.flags.crisis35seen && g.age >= 38 && g.mood >= 65 && (g.flags.entrepreneur || g.job === '公务员' || g.jobSalary >= 20000) },
    // --- v9.4 NEW ENDINGS ---
    { id:'tiktok_star_end', badge:'🎬', title:'短视频达人', desc:'你从0粉丝做到了50万粉丝的短视频博主。\n\n你拍过日常vlog、知识分享、搞笑段子。你学会了剪辑、编剧、表演。\n\n虽然你还没有实现"财务自由"，但你找到了比上班更有意义的事。\n\n"每个人都是自己的导演——即使观众只有你自己。"', cond: g => g.flags.tiktokSuccess && g.charm >= 60 && g.money >= 30000 },
    { id:'homeowner_end', badge:'🏠', title:'有房一族', desc:'你在大城市买了房。\n\n从租10平米的隔断间，到拥有自己的两室一厅。你用了整整十年。\n\n站在阳台上看着城市的夜景，你想起刚来这座城市时的自己。\n\n"房子不是家，但有了房子，才敢把这里叫做家。"', cond: g => g.flags.hasHouse && g.money >= 0 && g.age >= 30 },
    { id:'civil_servant_end', badge:'📋', title:'体制内人生', desc:'你考上了公务员，成了"体制内"的人。\n\n工资不高不低，朝九晚五，稳定得让人安心。\n\n你妈终于不再催你找工作了。你的朋友圈从"加班打卡"变成了"养生茶推荐"。\n\n"体制内不是围城，是避风港。"', cond: g => g.flags.civilServant && g.mood >= 60 && g.age >= 28 },
    { id:'educated_end', badge:'🎓', title:'终身学习者', desc:'你从未停止学习。\n\n从考证到读研，从线上课程到线下沙龙。你的简历越来越长，你的视野越来越宽。\n\n你不确定学习能不能改变命运，但你知道：不学习一定不能。\n\n"学无止境——这不是鸡汤，是生存策略。"', cond: g => g.flags.hasMBA && g.flags.hasCertificate && g.intel >= 85 },
    // --- v10.2 NEW ENDINGS ---
    { id:'burnout_recovery_v2', badge:'🌱', title:'浴火重生', desc:'你经历了职业倦怠，但你挺过来了。\n\n你看心理咨询师、学冥想、换工作、重新找到生活的节奏。\n\n你比以前更懂得照顾自己，也更懂得拒绝不合理的要求。\n\n"不是所有的跌倒都叫失败，有些叫成长。"', cond: g => g.flags.sawTherapist && g.mood >= 65 && g.health >= 60 && g.age >= 30 },
    { id:'simple_life_end', badge:'🌿', title:'简单生活', desc:'你没有成为有钱人，也没有成为名人。\n\n但你学会了做饭、养花、散步、看书。你有一个小圈子的好朋友，有一只猫，有一份还行的工作。\n\n你终于明白：幸福不在于拥有多少，而在于享受当下。\n\n"简单生活不是平庸，是选择。"', cond: g => g.flags.cookingSkill && g.flags.hasPet && g.mood >= 60 && g.health >= 55 && g.age >= 32 },
    { id:'hometown_return', badge:'🏡', title:'回乡发展', desc:'你终于回到了老家。\n\n没有了大城市的繁华，也没有了大城市的压力。你在老家找了份工作，买了个小房子。\n\n你妈高兴得合不拢嘴。你爸偷偷在邻居面前炫耀："我孩子回来了。"\n\n"回家不是认输，是另一种勇敢。"', cond: g => g.flags.midlifeChange && g.money >= 20000 && g.age >= 33 && g.social >= 40 },
    // --- v10.3 NEW ENDINGS ---
    { id:'dink_end', badge:'🍷', title:'丁克人生', desc:'你和TA选择了不要孩子。\n\n你们把省下来的钱用来旅行、学习、享受生活。周末睡到自然醒，假期想去哪就去哪。\n\n有人说你们自私，有人说你们潇洒。但你知道，这只是你们的选择——一个不需要向任何人解释的选择。\n\n"不是所有人都需要成为父母，有些人选择成为自己。"', cond: g => g.flags.dink && g.age >= 38 && g.mood >= 60 },
    { id:'super_parent_end', badge:'👨‍👩‍👧‍👦', title:'超级父母', desc:'你在大城市养大了一个孩子。\n\n从幼儿园到小学，从兴趣班到家长会，你在工作与家庭之间疲于奔命。\n\n但当你看到孩子画了一幅画，上面写着"爸爸/妈妈最棒"的时候——你觉得一切都值了。\n\n"父母是世上最难的职业，没有培训，没有工资，没有休假。但你甘之如饴。"', cond: g => g.flags.hasChild && g.mood >= 65 && g.age >= 35 && g.money >= -10000 },
    { id:'midlife_restart_end', badge:'🔄', title:'中年重启', desc:'35岁之后，你选择了重新出发。\n\n可能是换了行业，可能是创了业，可能是去了新的城市。你不确定未来会怎样，但你知道：原地不动比失败更可怕。\n\n你的朋友圈签名改成了："人生没有太晚的开始。"\n\n"中年不是危机，是觉醒。"', cond: g => g.flags.midlifeRestart && g.age >= 38 && g.mood >= 55 },
    { id:'filial_end', badge:'🏡', title:'孝子孝女', desc:'你虽然在外漂泊，但从未忘记家人。\n\n每个周末的视频电话，每次假期的回家，每月寄回去的钱和礼物。\n\n你妈在邻居面前炫耀的不是你赚了多少钱，而是："我孩子每周都给我打电话。"\n\n"孝顺不是给多少钱，是让对方知道你在乎。"', cond: g => g.relationships && g.relationships.family >= 85 && g.age >= 32 },
    // --- v10.4 NEW ENDINGS ---
    { id:'dazi_end', badge:'🤝', title:'搭子人生', desc:'你没有交到"真正的朋友"，但你有了一群搭子。\n\n饭搭子、运动搭子、旅行搭子、看病搭子。你们不交心，不八卦，AA制，到期解散。\n\n有人说这是冷漠，有人说这是边界感。但你知道：在这个城市，有人陪你吃顿饭，已经是一种温暖。\n\n"搭子不是朋友的降级版，是成年人社交的最优解。"', cond: g => g.flags.hasDazi && g.age >= 28 && g.social >= 40 && g.social < 70 },
    { id:'citywalker_end', badge:'🚶', title:'城市漫游家', desc:'你用脚步丈量了这座城市的每一条街道。\n\n你知道哪条巷子有最好的咖啡，哪个公园有最美的落日，哪家小店的老板会和你聊天。\n\n你写了一本《城市漫游指南》，虽然只有100个人看过，但每个人都说："谢谢你让我重新认识了这座城市。"\n\n"城市漫游不是逃避生活，是在生活中找到被忽略的美好。"', cond: g => (g.flags.citywalkCafe || g.flags.communityCafe) && g.charm >= 50 && g.mood >= 60 && g.age >= 28 },
    { id:'pet_lover_end', badge:'🐾', title:'毛孩子的家长', desc:'你把所有的爱都给了你的毛孩子。\n\n它陪你度过了加班后的深夜、失恋后的周末、生病时的独处。它不会说话，但它永远在你身边。\n\n你给它买了保险、办了生日派对、拍了写真集。你的朋友说："你对它比对自己还好。"\n\n"宠物不是玩具，是家人——一个永远不会背叛你的家人。"', cond: g => g.flags.hasPet && g.flags.petParkMet && g.mood >= 55 && g.age >= 27 },
    // --- v10.5 NEW ENDINGS ---
    { id:'health_conscious_end', badge:'🍵', title:'养生大师', desc:'你从一个熬夜冠军变成了一个养生达人。\n\n早睡早起、规律饮食、定期体检、枸杞泡水。你的体检报告从一片箭头变成了全部正常。\n\n你在知乎写了一篇《从脂肪肝到六块腹肌的逆袭》，获得了10万+阅读。\n\n"养生不是怕死，是学会了好好活着。"', cond: g => g.flags.wellnessMode && g.health >= 75 && g.age >= 28 },
    { id:'cut_relatives_end', badge:'✂️', title:'断亲自由', desc:'你切断了那些让你不舒服的亲戚关系。\n\n没有了对比，没有了催婚，没有了灵魂拷问。你终于可以在过年的时候做自己想做的事。\n\n有人说你冷漠，但你知道：血缘是缘分，不是枷锁。\n\n"断亲不是不孝，是把爱留给值得的人。"', cond: g => g.flags.cutRelatives && g.mood >= 60 && g.age >= 26 },
    { id:'wellness_punk_end', badge:'🎸', title:'朋克养生家', desc:'你活成了一种矛盾的美。\n\n凌晨2点还在加班，但桌上放着燕窝和枸杞。\n\n周末去蹦迪到凌晨4点，但周一早上准时去健身房。\n\n你不是不养生，你是用最朋克的方式养生。\n\n"朋克养生是一种态度：我知道这样不好，但我选择快乐。"', cond: g => g.health >= 50 && g.mood >= 60 && g.age >= 25 && g.age <= 35 },
    // --- v10.6 NEW ENDINGS ---
    { id:'side_hustle_end', badge:'💻', title:'斜杠人生', desc:'你不只有一份工作。\n\n白天你是打工人，晚上你是自由职业者。你写文案、做PPT、翻译、设计。\n\n你的副业收入慢慢追上了主业。你在考虑：要不要辞职，全职做自由职业？\n\n"斜杠不是贪婪，是不想被一个标签定义。"', cond: g => g.flags.hasSideHustle && g.money >= 30000 && g.intel >= 60 && g.age >= 26 },
    { id:'novelist_end', badge:'✍️', title:'网文作家', desc:'你写的小说终于有人看了。\n\n从0个读者到100个，从100个到10000个。你的故事被更多人看到。\n\n有人说你写得好，有人说你写得烂。但你知道：重要的不是评价，是你一直在写。\n\n"每个作家都是从无人问津开始的——区别是你有没有坚持下去。"', cond: g => g.flags.webNovelist && g.charm >= 50 && g.intel >= 60 && g.months > 36 },
    { id:'traveler_end', badge:'✈️', title:'行走的风景', desc:'你走遍了大半个中国。\n\n从大理到丽江，从厦门到成都，从西安到拉萨。\n\n你在每个城市都留下了照片和故事。你的朋友圈是一本旅行日记。\n\n"旅行不会改变世界，但会改变看世界的你。"', cond: g => g.flags.spontaneousTrip && g.charm >= 45 && g.mood >= 60 && g.age >= 28 },
    // --- v10.7 NEW ENDINGS ---
    { id:'digital_minimalist', badge:'📵', title:'数字极简主义者', desc:'你学会了放下手机。\n\n你关闭了朋友圈通知，卸载了三个购物App，把屏幕时间控制在每天2小时以内。\n\n你开始有更多的时间看书、运动、和朋友面对面聊天。\n\n"放下手机不是与世界断联，是与自己重新连接。"', cond: g => g.flags.digitalDetox && g.flags.closedMoments && g.mood >= 65 && g.health >= 55 },
    { id:'healed_heart', badge:'💚', title:'治愈之心', desc:'你经历了人生的低谷，但你走出来了。\n\n你看了心理咨询师，学会了和自己和解。你不再逃避情绪，而是面对它、理解它。\n\n你在日记里写道："我不需要完美，我只需要真实。"\n\n"治愈不是忘记伤痛，是学会带着伤痛继续前行。"', cond: g => g.flags.sawTherapist && g.mood >= 65 && g.age >= 26 },
    { id:'podcaster_end', badge:'🎧', title:'声音的旅人', desc:'你开了一档播客。\n\n从0个听众到100个，从100个到10000个。你在麦克风前聊生活、聊工作、聊那些没人敢说的真话。\n\n有听众说："你的节目陪我度过了最难的时候。"\n\n"声音是最温暖的媒介——你听不到我的表情，但你能听到我的心。"', cond: g => g.flags.podcaster && g.charm >= 50 && g.social >= 50 && g.months > 24 },
    // --- v10.8 NEW ENDINGS ---
    { id:'startup_success_end', badge:'🚀', title:'创业成功', desc:'你的创业项目活了。\n\n从一个人到十个人，从一个想法到一个产品。你经历了融资失败、合伙人跑路、产品被骂，但你挺过来了。\n\n你在公司年会上说："创业不是赌博，是把所有筹码都押在自己身上。"\n\n"创业者是疯子，但正是这些疯子，让这个世界变得更好。"', cond: g => g.flags.startupPhase && (g.flags.startupPhase==='funded'||g.flags.startupPhase==='bootstrapped') && g.money >= 100000 && g.age >= 30 },
    { id:'wlb_end', badge:'⚖️', title:'工作生活平衡', desc:'你终于找到了工作和生活的平衡点。\n\n你不再996，不再把生命浪费在无意义的加班上。你有了时间运动、看书、陪家人。\n\n你的领导觉得你"不上进"，但你觉得自己终于开始"活着"了。\n\n"人生不是赛跑，不需要每时每刻都在冲刺。"', cond: g => g.flags.workLifeBalance && g.mood >= 70 && g.health >= 65 && g.age >= 28 },
    { id:'layoff_comeback', badge:'📦', title:'裁员逆袭', desc:'你被裁了，但你没有被打败。\n\n你拿了赔偿，休息了三个月，然后找到了一份更好的工作。薪资涨了50%，还不加班。\n\n你发了一条朋友圈："感谢被裁，让我看清了什么是真正重要的。"\n\n"被裁不是失败，是被生活推了一把——推向了更好的方向。"', cond: g => g.flags.wasLaidOff && g.jobSalary >= 15000 && g.mood >= 60 && g.age >= 28 },
    // --- v11.1 NEW ENDINGS (HIDDEN) ---
    { id:'perfect_life_end', badge:'🌟', title:'人生赢家', desc:'你做到了。\n\n有房、有车、有家庭、有事业。你从一个月薪3000的打工仔，变成了一个拥有完整人生的成年人。\n\n你的孩子叫你爸爸/妈妈的时候，你想起自己刚来这座城市时的样子——那个什么都没有却什么都不怕的年轻人。\n\n"人生赢家不是拥有一切，是珍惜拥有的一切。"', cond: g => g.flags.hasHouse && g.flags.married && g.flags.hasChild && g.money >= 200000 && g.mood >= 65 && g.age >= 36 },
    { id:'free_soul_end', badge:'🦅', title:'自由灵魂', desc:'你选择了大多数人不敢选择的路。\n\n没有房贷、没有婚姻的枷锁、没有固定的工作。你有的是：一只猫、几个好朋友、一颗自由的心。\n\n你在朋友圈写道："我不是什么都没有，我拥有自由。"\n\n有人说你勇敢，有人说你疯了。但你知道：真正的自由，是不在乎别人的评价。\n\n"自由不是逃避，是另一种活法。"', cond: g => !g.flags.married && !g.flags.hasHouse && g.flags.hasPet && g.mood >= 70 && g.charm >= 55 && g.age >= 32 },
    // --- v11.2 NEW ENDINGS ---
    { id:'festival_lover_end', badge:'🏮', title:'生活家', desc:'你把每一个平凡的日子都过成了节日。\n\n春节你会包饺子、贴春联。中秋你会赏月、吃月饼。国庆你会出去浪。双11你会买买买。\n\n你的朋友说："跟你在一起，每天都有意思。"\n\n"生活不在于有多少大事件，在于你能不能把小事过得有滋味。"', cond: g => g.mood >= 70 && g.charm >= 45 && g.age >= 28 && g.social >= 50 },
    // --- v11.3 NEW ENDINGS ---
    { id:'foodie_end', badge:'🍜', title:'城市美食家', desc:'你吃遍了这座城市的每一个角落。\n\n从路边摊到米其林，从早餐铺到深夜食堂。你知道哪条巷子有最好的小面，哪个小区藏着最正宗的川菜。\n\n你在小红书上有了1万粉丝，他们叫你"城市胃王"。\n\n"美食是城市最好的名片——你用味蕾读完了这座城市的每一页。"', cond: g => g.flags.foodExplorer && g.flags.foodBlogger && g.charm >= 50 && g.mood >= 60 },
    // --- v11.4 NEW ENDINGS ---
    { id:'influencer_end_v2', badge:'📱', title:'网红人生', desc:'你成了一个小网红。\n\n粉丝不多不少，刚好够养活自己。你接广告、做直播、写测评。你把自己的生活变成了一种"内容"。\n\n有人说你"活得很累"，因为你要时刻维护人设。但你觉得：能把喜欢的事变成工作，已经很幸运了。\n\n"网红的真相：你展示的是精心编排的人生，但观众需要的是真实。"', cond: g => g.flags.contentCreator && g.charm >= 55 && g.money >= 30000 && g.age >= 25 },
    // --- v11.5 NEW ENDINGS ---
    { id:'volunteer_heart_end', badge:'❤️', title:'温暖的人', desc:'你成了社区里最受欢迎的人。\n\n每个周末你都会去养老院、收容所、社区中心做志愿者。你认识了很多朋友——有些比你大50岁，有些比你小20岁。\n\n有人说："你做的事情没有一分钱收入。"\n\n你笑着说："但收获的快乐，千金不换。"\n\n"生命的意义不在于你拥有多少，在于你给予了多少。"', cond: g => g.flags.regularVolunteer && g.social >= 60 && g.mood >= 65 && g.age >= 27 },
    // --- v11.6 NEW ENDINGS ---
    { id:'marathon_life_end', badge:'🏅', title:'跑马人生', desc:'你从一个走两步就喘的废柴，变成了一个能跑42公里的狠人。\n\n你参加了北马/上马/广马。冲过终点线的那一刻，你哭了——不是因为累，是因为你证明了自己。\n\n你的朋友圈签名改成了："人生就是一场马拉松，慢慢来，别着急。"\n\n"跑步教会你的不是速度，是坚持。"', cond: g => g.flags.marathonFinish && g.health >= 75 && g.age >= 26 },
    { id:'artist_life_end', badge:'🎨', title:'业余艺术家', desc:'你没有成为专业画家，但你的画挂满了出租屋的墙壁。\n\n朋友来你家都会说："哇，这都是你画的？"\n\n你在小红书上有了一个小小的粉丝群，他们叫你「城市里的心灵画师」。\n\n"艺术不需要被认可，它只需要被创造。"', cond: g => g.flags.artist && g.mood >= 65 && g.charm >= 50 && g.age >= 27 },
    // --- v11.7 NEW ENDINGS ---
    { id:'frugal_sage_end', badge:'📉', title:'消费觉醒', desc:'你从一个「月光族」变成了一个「极简主义者」。\n\n你不再买盲盒、不再囤货、不再为了满减凑单。你的衣柜只有十件衣服，你的厨房只有三口锅。\n\n朋友说你「活得像个苦行僧」。你笑着说：「我是活明白了。」\n\n你的存款从0变成了5万。不多，但那是你第一次觉得——自己掌控了生活。\n\n"真正的富有不是拥有更多，是不再需要更多。"', cond: g => g.flags.minimalist && g.money >= 30000 && g.mood >= 60 && g.age >= 28 },
    { id:'civil_servant_end_v2', badge:'🏛️', title:'上岸', desc:'你考上了。\n\n三年备考，两次落榜，无数个深夜的自我怀疑。当你看到录取通知的那一刻，你妈在电话里哭了。\n\n你的工资不算高，但稳定。你的工作不算精彩，但有尊严。你终于可以过一种「不用担心明天」的生活。\n\n你爸在酒桌上说："我儿子/女儿有编制了。"——这句话他说了一辈子。\n\n"上岸不是终点，是终于可以喘口气了。"', cond: g => g.flags.civilServant && g.age >= 25 },
    // --- v11.8 NEW ENDINGS ---
    { id:'drama_king_end', badge:'🎬', title:'短剧之王', desc:'你从一个普通打工人，变成了一个短剧创作者。\n\n你的短剧《重生之我在大厂当PPT侠》全网播放量破千万。平台给你开了专栏，投资人找上门来。\n\n你辞了职，成立了自己的工作室。虽然只有三个人，但你觉得——这才是你想做的事。\n\n你妈在亲戚面前终于有了新话题：「我儿子/女儿是拍短视频的，月入六位数。」\n\n"内容创业的黄金时代：每个人都可以讲故事，但不是每个故事都能被听见。你幸运地成为了被听见的那一个。"', cond: g => g.flags.shortDramaCreator && g.charm >= 55 && g.money >= 50000 && g.age >= 24 },
    { id:'digital_native_end', badge:'🤖', title:'数字原住民', desc:'你是AI时代的弄潮儿。\n\n你用AI写方案、用AI做PPT、用AI分析数据。你的工作效率是同事的三倍。领导说你是「最有潜力的人」。\n\n但你知道：你不是更有潜力——你只是更会用工具。\n\n你在公司内部分享会上说：「AI不会取代你，但会用AI的人会。」全场鼓掌。\n\n"AI时代的生存法则：不是跟AI比谁更强——是比谁更会用AI。"', cond: g => g.flags.aiPowerUser && g.intel >= 70 && g.jobSalary >= 15000 && g.age >= 24 },
    // --- v11.9 NEW ENDINGS ---
    { id:'hometown_return_end', badge:'🏠', title:'归乡', desc:'你回了老家。\n\n你在小城开了一家店，过上了朝九晚五的生活。没有996，没有通勤两小时，没有房租压力。\n\n你的收入少了一半，但你的笑容多了一倍。你可以每天回家吃饭，可以周末陪父母钓鱼，可以看着孩子在院子里疯跑。\n\n你的大城市朋友发微信：「你后悔了吗？」\n\n你回复：「不后悔回来。只后悔没早点回来。」\n\n"回家的路很长——但每一步都离幸福更近。"', cond: g => g.flags.hometownPull && g.flags.hometownEntrepreneur && g.mood >= 60 && g.age >= 33 },
    { id:'midlife_wisdom_end', badge:'🪞', title:'四十知天命', desc:'你40岁了，终于想明白了一些事。\n\n你不再跟同事比工资，不再跟同学比房子，不再跟朋友圈里的「成功人士」比人生。\n\n你开始接受：自己就是一个普通人。普通的收入、普通的工作、普通的生活。但普通的你，养大了孩子、照顾了父母、没有放弃自己。\n\n你发了一条朋友圈：「40岁，学会了跟自己和解。」\n\n"人生最大的成就不是成为谁——是接受自己是谁。"', cond: g => g.flags.lifeReview40 && g.mood >= 55 && g.age >= 40 },
    // --- v12.0 NEW ENDINGS ---
    { id:'balanced_life_end', badge:'⚖️', title:'平衡人生', desc:'你找到了一种平衡：不躺平也不内卷，不焦虑也不麻木。\n\n你有一份不算完美但还行的工作，有几个真心朋友，有一个健康的身体，有一颗还在思考的脑袋。\n\n你的领导说你应该更「有野心」。你笑着说：「我的野心是——过好自己的每一天。」\n\n"人生的终极答案不是成功——是平衡。"', cond: g => g.mood >= 65 && g.health >= 60 && g.social >= 45 && g.money >= 20000 && g.age >= 30 && g.intel >= 55 },
    { id:'wanderer_end', badge:'🌍', title:'永远在路上', desc:'你成了一个「城市漫游者」。\n\n你在五个城市生活过，换过七份工作，搬过十二次家。你的行李箱里装着你所有的家当。\n\n有人说你「不稳定」。你说你只是还没找到让你停下来的理由。\n\n也许明天你就找到了。也许永远不会。但路上的风景，也挺好的。\n\n"不是所有流浪的人都迷了路——有些人只是在寻找。"', cond: g => g.flags.citySwitch && g.flags.weekendTrip && g.charm >= 50 && g.age >= 28 },
    // --- v12.1 NEW ENDINGS ---
    { id:'love_story_end', badge:'💕', title:'爱情故事', desc:'你遇到了一个人，然后你们在一起了。\n\n没有什么轰轰烈烈。只是在某个平凡的日子，你们发现：彼此就是那个让自己安心的人。\n\n你们一起租房、一起还房贷、一起吵架、一起和好。你们的故事不完美，但真实。\n\n你发了一条朋友圈：「感谢你，让这座城市有了温度。」\n\n"爱情不是找到完美的人——是学会和不完美的人，一起过日子。"', cond: g => g.flags.inRelationship && g.mood >= 60 && g.age >= 25 },
    { id:'career_master_end', badge:'🏆', title:'职场精英', desc:'你从职场小白，一路做到了行业精英。\n\n你的名字在圈子里有分量了。猎头不再联系你——因为你已经是最高的那个了。\n\n你的下属叫你「大佬」，你的同行叫你「前辈」，你的父母叫你「骄傲」。\n\n但只有你自己知道：你失去了多少周末、错过了多少聚会、熬过了多少失眠的夜晚。\n\n"职场精英的代价：用青春换地位，然后用地位证明自己没有浪费青春。"', cond: g => g.jobSalary >= 40000 && g.intel >= 70 && g.age >= 32 },
    // --- v12.2 NEW ENDINGS ---
    { id:'healing_end', badge:'💭', title:'治愈之路', desc:'你走进了心理咨询室，然后你走出来，世界没有变——但你变了。\n\n你学会了接纳自己的情绪。你不再因为哭泣而羞耻，不再因为脆弱而自责。\n\n你开始在朋友圈分享自己的感受（屏蔽了同事和家人）。有人评论：「谢谢你说出来，我也是这样的。」\n\n你意识到：你不是一个人。\n\n"治愈不是忘记伤痛——是学会带着伤痛，继续走。"', cond: g => g.flags.therapyVisit && g.mood >= 55 && g.intel >= 50 && g.age >= 25 },
    { id:'financial_free_end', badge:'📊', title:'理财达人', desc:'你从一个月光族，变成了一个理财高手。\n\n你的基金定投坚持了五年，收益率跑赢了通胀。你的股票虽然亏过，但你学到了：不贪、不慌、不all in。\n\n你的存款不多，但够你应急半年。你的投资不大，但每个月都有被动收入。\n\n你在朋友聚会上说：「财务自由不是有多少钱——是你不再为钱焦虑了。」\n\n"理财的本质不是赚钱——是学会和钱和平相处。"', cond: g => g.flags.fundInvestor && g.money >= 50000 && g.intel >= 60 && g.age >= 30 },
    // --- v12.3 NEW ENDINGS ---
    { id:'authentic_life_end', badge:'🌟', title:'真实的人生', desc:'你终于活成了自己想要的样子。\n\n你不再活在别人的期待里。你不再为了「面子」做不想做的事。你不再假装自己过得很好。\n\n你允许自己脆弱，允许自己犯错，允许自己慢下来。\n\n你的朋友说：「你变了。以前你总是很紧绷，现在你很松弛。」\n\n你笑着说：「不是我变了——是我终于不装了。」\n\n"真实不是完美——是敢于展示不完美。"', cond: g => g.flags.redefinedSuccess && g.mood >= 65 && g.age >= 32 },
    { id:'rebel_life_end', badge:'🔥', title:'叛逆人生', desc:'你在37岁那年，做了一件所有人都觉得疯狂的事。\n\n也许是辞职环游世界，也许是卖掉房子去创业，也许是离开体制去做自由职业。\n\n一年后你没有成功。两年后你还是没有成功。三年后——你依然不后悔。\n\n因为你终于知道了：人生最大的失败不是做错选择——是从未做过自己的选择。\n\n"叛逆不是反叛——是终于听到了自己内心的声音。"', cond: g => g.flags.midlifeRebellion && g.mood >= 55 && g.age >= 38 },
    // --- v12.4 NEW ENDINGS ---
    { id:'quiet_friendship_end', badge:'👋', title:'散场的人', desc:'你和曾经最好的朋友，终于成了彼此朋友圈里的陌生人。\n\n没有吵架，没有矛盾——只是各自忙着各自的生活。他结了婚，你加了班。她去了另一个城市，你留在了原地。\n\n某天你翻看旧照片，发现那个笑得最开心的人——已经三年没联系了。\n\n你犹豫了一下，还是放下了手机。\n\n"有些友情不是断裂了——是安静地毕业了。"', cond: g => g.flags.friendDrift && g.age >= 30 && g.social < 50 },
    { id:'bucket_list_end', badge:'📝', title:'愿望清单', desc:'你列了一张人生愿望清单，然后开始一个一个划掉。\n\n跳伞✓ 学吉他✓ 去西藏✓ 写一本书✓ 给妈妈买金项链✓\n\n你没有完成所有的愿望——但每划掉一个，你都觉得自己真正活过。\n\n你65岁的时候，那张清单已经被折得皱巴巴的。上面有些愿望永远不会被打勾了。但也有些——是你当初做梦都没想到的。\n\n"人生不是划掉多少项——是你敢不敢写下第一项。"', cond: g => g.flags.bucketList && g.age >= 45 && g.mood >= 60 },
    { id:'eco_life_end', badge:'♻️', title:'低碳人生', desc:'你成了一个「环保怪人」。\n\n你骑自行车上班，用布袋买菜，拒绝一次性餐具，把空调温度永远设在26度。\n\n你的同事觉得你矫情。你的家人觉得你抠门。你的邻居觉得你奇怪。\n\n但你不在乎。因为你知道：一个人改变不了世界——但如果每个人都这么想，世界就永远不会改变。\n\n"环保不是苦行僧——是终于想明白了：够就好。"', cond: g => g.flags.ecoLiving && g.age >= 35 && g.mood >= 55 },
    { id:'second_chance_end', badge:'🆘', title:'第二次机会', desc:'那次深夜急诊改变了你。\n\n你辞掉了996的工作，搬到了郊区的小房子。你开始跑步、做饭、早睡早起。\n\n你的收入少了一半，但你的体检报告比十年前还好。\n\n你妈说：「你怎么越活越回去了？」\n你说：「妈，我这不是回去了——是重新开始了。」\n\n"有些觉醒需要一次濒死体验——但最好不需要。"', cond: g => g.flags.midnightCrisis && g.health >= 75 && g.mood >= 65 && g.age >= 35 },
    // --- v12.5 NEW ENDINGS ---
    { id:'balance_life_end', badge:'📐', title:'45度人生赢家', desc:'你既没有成为卷王，也没有彻底躺平。\n\n你活成了所有人觉得「还行」的样子：工作还行，收入还行，生活还行，身体还行。\n\n但你知道：这个「还行」是你拼了命才维持住的。\n\n你偶尔会想：如果当初再努力一点会怎样？如果当初彻底躺平会怎样？\n\n然后你笑了——45度人生没有如果，只有当下。\n\n"45度不是妥协——是在不确定的世界里，找到了自己的确定。"', cond: g => g.flags.fortyFiveDegree && g.mood >= 55 && g.age >= 30 },
    { id:'ai_pioneer_end', badge:'🤖', title:'AI时代弄潮儿', desc:'当所有人都害怕AI抢饭碗的时候，你选择了拥抱它。\n\n你学会了用AI写代码、做PPT、分析数据、生成图片。你的效率翻了三倍，你的同事被裁了一半。\n\n你成了公司里「最会用AI的人」。猎头开始频繁联系你。\n\n你妈说：「你小时候玩电脑我就说你有出息。」\n\n"AI不会淘汰所有人——但你得确保自己不是被淘汰的那一个。"', cond: g => g.flags.aiReplacement && g.intel >= 75 && g.age >= 28 },
    { id:'minimalist_end', badge:'🏷️', title:'平替人生', desc:'你把人生也做成了平替。\n\n大牌学历？不需要——你有真本事。高端社交？不需要——你有真朋友。豪华婚礼？不需要——你有真爱。\n\n你妈说：「你看看人家，什么都用最好的。」\n你说：「妈，我用的是最适合我的。」\n\n你过得不奢华，但很充实。不耀眼，但很踏实。\n\n"平替人生的本质不是将就——是终于分清了：什么是别人要的，什么是我需要的。"', cond: g => g.flags.pintiCulture && g.money >= 30000 && g.mood >= 60 && g.age >= 30 },
    // --- v12.6 NEW ENDINGS ---
    { id:'filial_child_end', badge:'👨‍👩‍👧', title:'回家的人', desc:'你最终选择了离父母更近的地方生活。\n\n也许是一份薪水更低的工作，也许是一个不那么繁华的城市。但每个周末你都能回家吃饭。每次你妈打电话，你半小时就到。\n\n你爸终于不再只翻你的朋友圈了——他每周都能见到你。\n\n你妈逢人就说：「我孩子就在我身边。」说这话的时候，她笑得比任何时候都开心。\n\n"成功有很多种定义——但能让父母安心变老的那种，最温暖。"', cond: g => g.flags.parentAging && g.flags.parentVisiting && g.relationships && g.relationships.family >= 85 },
    { id:'homesick_end', badge:'🍜', title:'永远想家的人', desc:'你在外漂泊了十年，最终还是决定回老家。\n\n不是因为混不下去——是因为你终于想明白了：大城市的霓虹灯再亮，也照不暖你半夜想家时的那颗心。\n\n你在老家开了一家小店。你妈每天来帮你看店。你爸负责送货。\n\n收入比以前少了一半。但你终于吃得下饭了。\n\n"回家不是认输——是你终于分清了：什么是梦想，什么是生活。"', cond: g => g.flags.hometownFood && g.flags.springFestival && g.age >= 32 && g.mood < 50 },
    // --- v12.7 NEW ENDINGS ---
    { id:'urban_settler_end', badge:'🏠', title:'城市扎根者', desc:'你终于在大城市扎下了根。\n\n从合租到独居，从隔断间到两室一厅。你搬了7次家，换了3份工作，熬过了无数个加班的深夜。\n\n你的冰箱里终于不只有老干妈了——你自己做的红烧肉，味道快赶上你妈了。\n\n你的邻居不再吵闹了——因为你买了一套房。\n\n你站在新家的阳台上看着夜景。那些灯火里，终于有一盏是你的了。\n\n"大城市不相信眼泪——但大城市尊重坚持。"', cond: g => g.flags.soloLiving && g.flags.apartmentHunting && g.flags.urbanSurvival && g.money >= 50000 && g.age >= 30 },
    { id:'night_city_end', badge:'🌃', title:'深夜城市人', desc:'你爱上了大城市的深夜。\n\n凌晨的兰州拉面、深夜的出租车、24小时便利店、加班后空旷的写字楼。\n\n你认识了这个城市最真实的一面——不是白天光鲜亮丽的CBD，而是深夜疲惫但温暖的街角。\n\n你成了一个「夜猫子」——不是因为不困，是因为深夜的你最像你自己。\n\n"大城市的深夜属于两种人：失眠的人和真实的人。"', cond: g => g.flags.midnightSnack && g.flags.lateNightTaxi && g.age >= 26 },
    // --- v12.8 NEW ENDINGS ---
    { id:'lifelong_learner_end', badge:'📚', title:'终身学习者', desc:'你成了一个「学习怪人」。\n\n你考过公、读过MBA、上过夜校、刷过网课。你的证书摆满了书架。你的笔记本写了一摞又一摞。\n\n你最终没有成为任何一个领域的专家——但你成了所有领域都懂一点的「通才」。\n\n你的同事遇到任何问题都会来找你：「你好像什么都懂一点？」\n你笑着说：「我只是比你们多花了一点点时间在学习。」\n\n"学习的意义不在于成为专家——在于永远保持对世界的好奇。"', cond: g => g.flags.onlineCourse && g.flags.nightSchool && g.intel >= 80 && g.age >= 30 },
    { id:'brave_changer_end', badge:'🔄', title:'勇敢转身的人', desc:'你在大城市换了三次行业。\n\n从工程师到产品经理到培训师。每一次转行，都有人说你疯了。\n\n但你终于找到了自己热爱的事——不是因为它是最好的，而是因为你做的时候最开心。\n\n你爸说：「你这辈子能不能稳定一点？」\n你说：「爸，不稳定才是我的稳定。」\n\n"人生最大的风险不是选错路——是不敢走路。"', cond: g => g.flags.careerSwitch && g.flags.startupInvite && g.mood >= 60 && g.age >= 30 },
    // --- v12.9 NEW ENDINGS ---
    { id:'health_awakening_end', badge:'💪', title:'健康觉醒者', desc:'那次体检报告改变了你。\n\n你扔掉了所有的垃圾食品，开始跑步、冥想、早睡早起。你的冰箱从可乐换成了枸杞。\n\n一年后，你的体检报告全部正常。医生看了都惊讶：「你这个年纪能有这种指标，很少见。」\n\n你笑了。你知道：这不是运气——是365天的自律。\n\n"健康不是1，是前面那个1——没有它，后面所有的0都没有意义。"', cond: g => g.flags.healthCheckShock && g.flags.meditationStart && g.health >= 80 && g.age >= 30 },
    { id:'self_healer_end', badge:'💭', title:'自我疗愈者', desc:'你学会了最重要的一件事：求助。\n\n你做了心理咨询，开始冥想，学会了跟自己的情绪相处。你不再假装坚强，不再压抑眼泪。\n\n你的朋友说：「你变了。以前你总是很紧绷，现在你很松弛。」\n你说：「不是我变了——是我不再装了。」\n\n"真正的强大不是永远不倒——是倒了之后，你知道怎么站起来。"', cond: g => g.flags.therapySession && g.flags.burnoutCrisis && g.mood >= 65 && g.age >= 28 },
    // --- v13.0 NEW ENDINGS ---
    { id:'free_spirit_end', badge:'🌍', title:'自由灵魂', desc:'你成了一个数字游民。\n\n你去过大理、丽江、厦门、厦门、清迈。你在每个城市的咖啡馆里工作，在每个城市的街头巷尾生活。\n\n你没有固定的地址，没有固定的收入，没有固定的社交圈。但你有固定的自由。\n\n你妈说：「你这辈子什么时候能稳定下来？」\n你说：「妈，稳定不是安全——自由才是。」\n\n"自由不是没有根——是你的根，扎在了整个世界。"', cond: g => g.flags.digitalNomad && g.flags.cityWalk && g.mood >= 60 && g.age >= 28 },
    { id:'wise_liver_end', badge:'🌟', title:'活明白了的人', desc:'你终于活明白了。\n\n你不再追求「更好」——因为你已经是「最好」的了。不是因为你成功了，而是因为你终于接受了自己。\n\n你有自己的爱好、自己的朋友、自己的节奏。你不跟别人比，不跟社会比，只跟昨天的自己比。\n\n你妈说：「你怎么一点都不焦虑了？」\n你说：「因为我想通了——人生没有标准答案。」\n\n"活明白不是什么都懂——是不再问那些没有答案的问题。"', cond: g => g.flags.lifePhilosophy && g.flags.ageAnxiety && g.flags.minimalistLife && g.mood >= 65 && g.age >= 35 },
    { id:'community_heart_end', badge:'🤝', title:'社区的温度', desc:'你成了社区里最受欢迎的人。\n\n你做志愿者、组织读书会、帮邻居收快递、给独居老人送饭。\n\n你不是最有钱的人，也不是最成功的人。但你是最被需要的人。\n\n你的邻居说：「这个社区因为有了你，变得更好了。」\n\n"成功的最高形式不是自己过得好——是让身边的人也过得好。"', cond: g => g.flags.volunteerWork && g.flags.bookClub && g.social >= 70 && g.age >= 30 },
    // --- v13.1 NEW ENDINGS ---
    { id:'marriage_veteran_end', badge:'💍', title:'婚姻老兵', desc:'你结婚了，经历了婚姻的酸甜苦辣。\n\n从相亲时的尴尬，到同居时的磨合，到婚礼上的泪水，到婚后的柴米油盐。你们吵过、闹过、冷战过，但也笑过、哭过、拥抱过。\n\n你的对象说：「嫁给/娶了你，是我这辈子最正确的决定。」\n你说：「娶了/嫁给你，是我这辈子最不后悔的选择。」\n\n"婚姻不是童话——是两个不完美的人，一起创造相对完美的生活。"', cond: g => g.flags.marriagePressure && g.flags.weddingCost && g.flags.married && g.mood >= 60 && g.age >= 30 },
    { id:'single_champion_end', badge:'🎊', title:'单身冠军', desc:'你选择了单身，而且活得很精彩。\n\n你没有对象，但你有自由。你可以随时加班、随时旅行、随时吃火锅、随时看午夜场电影。\n\n你妈依然每周催婚，但你学会了微笑以对。你的朋友圈签名是：「一个人，也要活得热气腾腾。」\n\n"单身不是没人要——是我还没遇到让我愿意放弃自由的人。"', cond: g => g.flags.singleLife && !g.flags.married && g.mood >= 70 && g.age >= 32 },
    { id:'relationship_survivor_end', badge:'💪', title:'爱情幸存者', desc:'你经历了爱情的考验，但你们挺过来了。\n\n你们吵过架、冷战过、差点分手过。但每次你们都选择了和解，选择了继续。\n\n你的朋友说：「你们是怎么做到的？」\n你笑着说：「因为我们都知道，放弃比坚持更容易——但我们选择了更难的那条路。」\n\n"爱情不是找到完美的人——是学会和不完美的人，一起成长。"', cond: g => g.flags.relationshipFight && g.flags.coupleTravel && g.mood >= 65 && g.age >= 28 },
    { id:'childfree_end', badge:'🌿', title:'丁克家族', desc:'你和对象决定不要孩子。\n\n你们把省下来的钱用来旅行、学习、享受生活。周末睡到自然醒，假期想去哪就去哪。\n\n有人说你们自私，有人说你们潇洒。但你知道，这只是你们的选择——一个不需要向任何人解释的选择。\n\n"不是所有人都需要成为父母，有些人选择成为自己。"', cond: g => g.flags.childDecision && g.flags.cohabitation && g.age >= 35 && g.mood >= 65 },
    // --- v13.2 NEW ENDINGS ---
    { id:'tiger_parent_end', badge:'🐔', title:'虎妈虎爸', desc:'你成了一个鸡娃家长。\n\n你给孩子报了钢琴、奥数、英语、编程、跆拳道。孩子的周末比工作日还忙。你花了30万在孩子教育上。\n\n你的孩子考上了重点中学。你在家长群里发了条：「感谢各位老师和家长的帮助！」收获了50个赞。\n\n你的孩子说：「爸爸/妈妈，我好累。」你说：「现在累，以后就轻松了。」\n\n"鸡娃的代价：用父母的钱包和孩子的童年，换一个不确定的未来。"', cond: g => g.flags.chickenBaby && g.flags.extracurricularWar && g.money <= 50000 && g.age >= 40 },
    { id:'relaxed_parent_end', badge:'🌱', title:'松弛感家长', desc:'你选择了佛系育儿。\n\n你没有给孩子报那么多班。你的孩子周末可以玩泥巴、看蚂蚁搬家、在公园里疯跑。\n\n你的孩子在家长群里不是最优秀的，但ta是最快乐的。ta喜欢画画，虽然画得不太好，但ta画的时候眼睛里有光。\n\n你的孩子说：「爸爸/妈妈，我长大了想当画家。」你说：「好。」\n\n"松弛感育儿的真相：不是不关心——是相信孩子有自己的节奏。"', cond: g => g.flags.relaxedParenting && g.flags.hasChild && g.mood >= 70 && g.age >= 38 },
    { id:'education_investor_end', badge:'🎓', title:'教育投资人', desc:'你在孩子教育上投入了一切。\n\n学区房、国际学校、留学。你花了200万。你的孩子从海外名校毕业了。\n\n孩子回国后找到了一份月薪2万的工作。你算了一笔账：要8年才能回本。\n\n你说：「教育不是投资——是爱。」（虽然你心里还是在算账）\n\n"教育的价值不在于回报率——在于你给了孩子选择的权利。"', cond: g => g.flags.schoolDistrictHouse && g.flags.studyAbroad && g.age >= 45 && g.money >= -50000 },
    // --- v13.3 NEW ENDINGS ---
    { id:'second_startup_success_end', badge:'🚀', title:'二次创业成功', desc:'你的第二次创业成功了。\n\n这一次，你不是为了赚钱，而是为了做自己喜欢的事。你开了咖啡馆/做了自媒体/开了网店。\n\n虽然收入不如以前打工，但你每天都很开心。你的孩子说：「爸爸/妈妈，你现在笑得好多了。」\n\n你说：「因为我终于在做自己想做的事了。」\n\n"二次创业：不是为了成功——是为了不后悔。"', cond: g => g.flags.secondStartupDone && g.flags.entrepreneur && g.mood >= 65 && g.age >= 40 },
    { id:'midlife_wisdom_end_v2', badge:'🌟', title:'中年智者', desc:'你45岁了，终于活明白了。\n\n你不再追求升职加薪，不再跟同学比房子车子，不再为孩子的成绩焦虑。\n\n你开始享受生活的每一个瞬间：早上的咖啡、傍晚的散步、周末的画画。\n\n你的朋友说：「你变了，变得松弛了。」\n你说：「不是我变了——是我终于学会了放下。」\n\n"中年智慧：不是拥有更多——是需要的更少。"', cond: g => g.flags.midlifeCrisis35 && g.flags.legacyThinking && g.mood >= 70 && g.age >= 45 },
    { id:'second_youth_end', badge:'🌸', title:'第二春', desc:'你迎来了人生的第二春。\n\n孩子上大学了，房贷还完了，工作稳定了。你终于有了时间和自由。\n\n你学了画画、跑了马拉松、去了西藏。你活得比20岁还精彩。\n\n你的孩子说：「爸/妈，你比我还会玩。」\n你说：「因为我现在才真正活给自己。」\n\n"第二春不是老了——是终于有时间活给自己了。"', cond: g => g.flags.secondYouthDone && g.flags.emptyNest && g.mood >= 70 && g.age >= 45 },
    // --- v14.0 NEW ENDINGS ---
    { id:'digital_minimalist_end', badge:'📵', title:'数字极简主义者', desc:'你学会了与数字世界和解。\n\n你卸载了一半的App，关闭了朋友圈，把屏幕时间控制在每天2小时以内。\n\n你开始有更多的时间看书、运动、和朋友面对面聊天。你的注意力回来了，你的焦虑消失了。\n\n你的朋友圈签名改成了：「离线中，请勿打扰。」\n\n"数字极简：不是与世界断联——是选择性地连接。"', cond: g => g.flags.digitalDetoxWeek && g.flags.socialMediaAddiction && g.mood >= 70 && g.age >= 28 },
    { id:'urban_farmer_end', badge:'🌱', title:'都市农夫', desc:'你在城市里种出了一片绿洲。\n\n你的阳台变成了小菜园：番茄、辣椒、生菜、薄荷。你每天花1小时照顾它们。\n\n你的邻居说：「你这是在城市里种田。」你说：「我这是在种田里找城市。」\n\n你送了一些菜给邻居。你们成了朋友。\n\n"都市农夫：不是为了自给自足——是为了在水泥森林里找到泥土的温度。"', cond: g => g.flags.urbanGardening && g.flags.urbanExploration && g.mood >= 65 && g.age >= 30 },
    { id:'conscious_consumer_end', badge:'🛒', title:'理性消费者', desc:'你从一个购物狂变成了一个理性消费者。\n\n你不再冲动购物，不再被直播带货忽悠，不再为了满减凑单。你的购物车永远只有3件东西。\n\n你的存款从0变成了3万。不多，但那是你第一次觉得——自己掌控了欲望。\n\n"理性消费：不是不花钱——是花得值。"', cond: g => g.flags.onlineShoppingAddiction && g.flags.subscriptionFatigue && g.flags.minimalist && g.money >= 30000 && g.mood >= 60 },
    // --- v14.1 NEW ENDINGS ---
    { id:'hometown_hero_end', badge:'🏡', title:'小城之光', desc:'你回到了小城，成了当地的传奇。\n\n你在县城开了第一家精品咖啡馆/网红奶茶店/独立书店。你的店成了小城年轻人的打卡圣地。\n\n你的月收入只有8000，但你有了时间陪父母、有了精力做自己喜欢的事。\n\n你的同学说：「你是我们小城的名人。」你笑着说：「我只是想过自己想要的生活。」\n\n"返乡创业：不是退而求其次——是选择另一种精彩。"', cond: g => g.flags.countyEconomy && g.flags.hometownChange && g.mood >= 65 && g.age >= 30 },
    { id:'balanced_living_end', badge:'⚖️', title:'双城生活', desc:'你找到了大城市和小城市之间的平衡。\n\n你在大城市工作，在小城市有家。你每周往返，像候鸟一样。\n\n你享受大城市的便利，也享受小城市的安逸。你的同事说：「你活得太累了。」你说：「但我活得很完整。」\n\n"双城生活：不是两头跑——是两头都要。"', cond: g => g.flags.lifeBalanceChoice && g.flags.reverseMigration && g.mood >= 60 && g.age >= 32 },
    // --- v14.2 NEW ENDINGS (宠物经济) ---
    { id:'pet_empire_end', badge:'🐾', title:'宠物帝国', desc:'你从一个普通铲屎官，变成了宠物行业的创业者。\n\n你开了宠物店/做了宠物博主/成了宠物医疗顾问。你的社交媒体有10万粉丝，他们叫你「宠物界的大佬」。\n\n你的宠物已经老了，但它依然是你最初的灵感来源。你每天还是会花1小时和它待在一起。\n\n你的创业故事被当地媒体报道。标题是：「从一只流浪猫到一个宠物帝国。」\n\n"宠物创业：不是为了赚钱——是为了让更多人和动物都能被善待。"', cond: g => g.flags.petBusiness && g.flags.petLifestyle && g.money >= 50000 && g.age >= 30 },
    { id:'pet_soulmate_end', badge:'💕', title:'灵魂伴侣', desc:'你和你的宠物，成了这个城市里最亲密的伙伴。\n\n它陪你度过了失恋、加班、失眠、孤独的每一个夜晚。它不会说话，但它知道你什么时候需要被抱着。\n\n你的朋友圈里都是它的照片。你的相册里90%是它。你的手机壁纸是它打哈欠的样子。\n\n有人说：「你太溺爱你的宠物了。」你说：「它值得。」\n\n"宠物不是宠物——是在大城市里，那个永远等你回家的家人。"', cond: g => g.flags.petCompanion && g.flags.petLifestyle && g.mood >= 70 && g.age >= 28 },
    { id:'pet_healer_end', badge:'🌈', title:'治愈之手', desc:'你从宠物的离去中，学会了如何面对失去。\n\n你的宠物离开了这个世界。你哭了整整一周。你删掉了手机里所有的照片——然后又偷偷恢复了。\n\n你去了流浪动物收容所做志愿者。你说：「我不能再养了。」但你还是没忍住，又领养了一只。\n\n你终于明白：悲伤不是结束——是新的开始的序曲。\n\n"宠物的离去教会我们：爱过就是永远——即使它已经不在身边。"', cond: g => g.flags.petLoss && g.flags.petCommunity && g.mood >= 55 && g.age >= 30 },
    { id:'pet_community_leader_end', badge:'👥', title:'宠物社群领袖', desc:'你从一个普通养宠人，变成了社区宠物圈的灵魂人物。\n\n你组织了遛狗团、养宠交流群、宠物义诊日。你的微信群有500个人，每天都有人在群里晒猫晒狗。\n\n你的邻居说：「自从有了你，我们小区的流浪猫都过上了好日子。」你笑着说：「那当然，它们也是社区的一份子。」\n\n你被评为「社区最美志愿者」。你把这个奖放在了宠物的玩具箱旁边。\n\n"宠物社群：不是人在社交——是宠物在帮我们找到彼此。"', cond: g => g.flags.petCommunity && g.flags.petSocial && g.social >= 70 && g.age >= 28 },
    // --- v14.3 NEW ENDINGS (老年生活) ---
    { id:'golden_retirement_end', badge:'🏖️', title:'金色晚年', desc:'你规划了一场完美的退休生活。\n\n你有足够的存款、健康的身体、和睦的家庭。你每天看书、散步、和老伴下棋。偶尔和老朋友聚聚。\n\n你的孩子每周来看你一次，带着孙子孙女。你的孙子说：「爷爷/奶奶，你年轻的时候是做什么的？」你笑着说：「活着。」\n\n你的人生没有惊天动地的故事。但每一天都过得很踏实。\n\n"金色晚年：不是因为有钱——是因为有准备。"', cond: g => g.flags.retirementPlanning && g.flags.healthyDiet && g.mood >= 70 && g.age >= 55 && g.money >= 80000 },
    { id:'wisdom_elder_end', badge:'📚', title:'智慧长者', desc:'你成了一个有智慧的老人。\n\n你退休后开始写回忆录、上老年大学、和年轻人交朋友。你的故事被一个记者写成了文章，标题是「70岁的人生课堂」。\n\n你收到了很多读者的来信。有人说：「你的故事让我重新思考了人生。」你说：「人生不需要重新思考——需要重新活过。」\n\n你的回忆录出版了。虽然只卖了300本，但每一本都送给了你在乎的人。\n\n"智慧长者：不是活得久——是活得明白。"', cond: g => g.flags.memoirist && g.flags.seniorUniversity && g.flags.elderFriendship && g.intel >= 80 && g.age >= 55 },
    { id:'community_pillar_end', badge:'🏛️', title:'社区支柱', desc:'你成了社区里最受欢迎的人。\n\n你是广场舞的领舞、社区乐队的吉他手、老年大学的志愿者。每个人都认识你，每个人都喜欢你。\n\n你的邻居说：「你是我们社区的灵魂。」你说：「我只是喜欢热闹。」\n\n你70岁生日那天，整个小区给你办了生日会。你感动得哭了——但你说是被风吹的。\n\n"社区支柱：不是被需要——是被爱。"', cond: g => g.flags.squareDanceLeader && g.flags.communityBand && g.social >= 80 && g.age >= 55 },
    { id:'life_reconciliation_end', badge:'🕊️', title:'人生和解', desc:'你和过去和解了。\n\n你曾经有很多遗憾：没有好好陪家人、没有坚持自己的梦想、没有说出心里的话。\n\n但在人生的后半段，你做了所有你曾经不敢做的事。你给老友打了电话、给孩子写了信、重新弹起了那把落灰的吉他。\n\n你对着镜子说：「你好，老朋友。」镜子里的你笑了——那是你很久没见过的、发自内心的笑。\n\n"人生和解：不是原谅一切——是接受一切。"', cond: g => g.flags.lifeReview && g.flags.legacyThinking && g.flags.hobbyRediscovery && g.mood >= 65 && g.age >= 50 },
    // --- v14.4 NEW ENDINGS (跨代关系) ---
    { id:'family_legacy_end', badge:'🏮', title:'家族之光', desc:'你成了家族里最重视传统的那个人。\n\n你整理了爷爷的家训、学会了奶奶的菜谱、组织了每年的家族聚会。你的孩子虽然觉得你有点老派，但每次过年都期待着你做的那桌菜。\n\n你的父亲看着你说：「你比我做得好。」你说：「我只是不想让这些东西消失。」\n\n你的家族相册有500多张照片。每一张都是一个故事，每一张都是一个时代。\n\n"家族传承：不是守旧——是让后来的人知道自己从哪里来。"', cond: g => g.flags.familyTradition && g.flags.familyRecipe && g.flags.familyReunion && g.age >= 40 && g.mood >= 65 },
    { id:'bridge_builder_end', badge:'🌉', title:'代际桥梁', desc:'你成了三代人之间的桥梁。\n\n你让父母理解了你的教育方式，让孩子理解了爷爷奶奶的爱。你用耐心和智慧，缝合了两代人之间的裂痕。\n\n你的父母和你的孩子坐在一张桌子前吃饭。你的父亲给你的孩子夹了一块红烧肉——那是你奶奶的配方。\n\n你看着这一幕，觉得这辈子做的最正确的事，就是没有让代沟变成鸿沟。\n\n"代际桥梁：不是让所有人想法一样——是让不同的想法都能被理解。"', cond: g => g.flags.generationGap && g.flags.peacemaker && g.flags.grandparentBond && g.age >= 40 && g.social >= 70 },
    { id:'filial_champion_end', badge:'💕', title:'孝心典范', desc:'你用行动诠释了什么叫「百善孝为先」。\n\n你每周给父母打电话、每年带他们体检、假期一定回家。你的父母在小区里逢人就说：「我家孩子可孝顺了。」\n\n你的同事问你：「你不觉得累吗？」你说：「累。但我更怕来不及。」\n\n你的父母老了，但他们的笑容比以前更多了。因为有你。\n\n"孝心：不是等有钱了再说——是在来得及的时候，多做一点。"', cond: g => g.flags.parentAging && g.flags.weeklyCall && g.flags.parentHealthDone && g.age >= 38 && g.mood >= 60 },
    // --- v15.0 NEW ENDINGS (心理健康) ---
    { id:'mental_health_champion_end', badge:'🧠', title:'心理健康倡导者', desc:'你从一个心理困境中走出来的人，变成了帮助别人的人。\n\n你公开分享了自己的焦虑和抑郁经历。你在社交媒体上写心理健康科普。你成了互助小组的组织者。\n\n有人说：「你的故事救了我。」你说：「是你自己救了自己——我只是让你知道你不需要一个人。」\n\n你的微博有10万粉丝。他们叫你「心理老师」。你笑着说：「我只是个普通人——只是愿意说出来而已。」\n\n"心理健康倡导：不是因为你好了才去帮人——是因为帮人的过程中，你也在治愈自己。"', cond: g => g.flags.therapySession && g.flags.supportGroupJoin && g.flags.volunteerHelper && g.mood >= 65 && g.age >= 28 },
    { id:'inner_peace_end', badge:'🧘', title:'内心平静', desc:'你找到了内心的平静。\n\n你每天冥想15分钟、每周跑步3次、每晚写情绪日记。你的焦虑从每天发作变成了偶尔来访。\n\n你的心理咨询师说：「你已经不需要我了。」你说：「不，我只是学会了做自己最好的咨询师。」\n\n你坐在阳台上，看着夕阳。你的脑子里依然会有杂念——但你已经不会被它们带走了。\n\n"内心平静：不是没有波澜——是学会了在风浪中站稳。"', cond: g => g.flags.dailyMeditation && g.flags.regularRunner && g.flags.dailyJournal && g.mood >= 70 && g.health >= 65 && g.age >= 28 },
    { id:'self_healing_end', badge:'💝', title:'自我疗愈', desc:'你完成了从「我不够好」到「我已经很好了」的转变。\n\n你学会了自我关怀、学会了设定边界、学会了对不喜欢的事说「不」。你不再为了讨好别人而委屈自己。\n\n你的朋友说：「你变了。」你说：「我没变——我只是终于做了自己。」\n\n你给自己写了一封信。信的最后一句是：「谢谢你没有放弃自己。」\n\n"自我疗愈：不是修复破碎的自己——是接受完整的自己。"', cond: g => g.flags.selfCompassion && g.flags.cbtSelfHelp && g.flags.boundarySetting && g.mood >= 65 && g.age >= 28 },
    { id:'resilience_end', badge:'🌈', title:'逆商高手', desc:'你把每一次低谷，都变成了成长的阶梯。\n\n你经历了焦虑、抑郁、失眠、职业倦怠——但你没有被打倒。你看了心理医生、学了CBT、加了互助组、开始跑步。\n\n你的日记本上写着：「我不是一个幸运的人——但我是一个不放弃的人。」\n\n你回头看那些至暗时刻，发现每一个低谷都教会了你一些东西。痛苦不是白受的——前提是你愿意从中学习。\n\n"逆商：不是不摔倒——是每次摔倒都能爬起来，而且知道为什么摔的。"', cond: g => g.flags.anxietyAttack && g.flags.regularTherapy && g.flags.exerciseTherapy && g.flags.cbtSelfHelp && g.mood >= 60 && g.age >= 30 },
    // --- v15.1 NEW ENDINGS (数字生活) ---
    { id:'digital_pioneer_end', badge:'🤖', title:'数字先锋', desc:'你成了AI时代的弄潮儿。\n\n你深度掌握了各种AI工具，你的工作效率是同事的3倍。你开了一个AI教程频道，粉丝10万+。你被邀请去做演讲，主题是「如何与AI共舞」。\n\n你的领导说：「你是我们公司的AI大使。」你说：「我只是比别人早了一步。」\n\n你知道：在技术变革的浪潮中，先行者未必赢——但不学习的人一定会输。\n\n"数字先锋：不是技术改变了你——是你利用技术改变了自己。"', cond: g => g.flags.aiExpert && g.flags.selfMediaCreator && g.intel >= 75 && g.age >= 25 },
    { id:'nomad_life_end', badge:'🌍', title:'自由灵魂', desc:'你成了一个真正的数字游民。\n\n你在大理、丽江、清迈、巴厘岛都工作过。你的办公室是咖啡馆、联合办公空间、甚至是海边的吊床。\n\n你的收入不高，但你的生活成本很低。你有时间看日落、有时间交朋友、有时间做自己。\n\n你的父母终于理解了：「你开心就好。」你的朋友圈里，全是来自世界各地的照片。\n\n"数字游民：不是逃避——是选择了自己想要的生活节奏。"', cond: g => g.flags.nomadLifestyle && g.flags.remoteNetwork && g.mood >= 70 && g.age >= 28 },
    { id:'platform_survivor_end', badge:'🛵', title:'平台幸存者', desc:'你在平台经济中找到了自己的位置。\n\n你做过外卖骑手、跑过网约车、接过各种零工。你比任何人都了解底层劳动者的辛苦。\n\n你后来成了一个劳动权益博主，为平台工人发声。你的文章被很多媒体报道引用。\n\n你说：「每一个在风雨中奔跑的骑手，都值得被尊重。」\n\n"平台幸存者：不是逃离了平台——是让平台看见了人的价值。"', cond: g => g.flags.deliveryRider && g.flags.gigEconomy && g.flags.algorithmAware && g.social >= 60 && g.age >= 28 },
    // --- v15.2 NEW ENDINGS (社交文化) ---
    { id:'social_master_end', badge:'🎭', title:'社交大师', desc:'你成了一个真正懂社交的人。\n\n你学会了饭局礼仪、送礼技巧、邻里相处、人情往来。你在公司里人缘极好，在小区里人人夸赞。\n\n但最让你骄傲的不是这些——是你学会了什么时候该社交、什么时候该独处。你不再为了合群而合群，不再为了面子而勉强自己。\n\n你的朋友说：「和你相处特别舒服。」你说：「因为我终于不装了。」\n\n"社交大师：不是认识多少人——是让认识的人都觉得值得。"', cond: g => g.flags.socialSavvy && g.flags.giftMaster && g.flags.conflictResolver && g.social >= 75 && g.age >= 30 },
    { id:'free_thinker_end', badge:'🧠', title:'独立思考者', desc:'你在信息洪流中保持了清醒。\n\n你不再被算法推荐左右、不再被网络舆论裹挟、不再为了面子而活。你学会了看多方信息、学会了质疑、学会了沉默。\n\n你的同事说：「你怎么什么都不表态？」你说：「不是不表态——是在表态之前先想想。」\n\n你订阅了5个不同立场的媒体。你的朋友圈里不转任何未经核实的消息。你成了朋友眼中的「靠谱信息源」。\n\n"独立思考：不是反对一切——是在相信之前，先问为什么。"', cond: g => g.flags.criticalThinker && g.flags.informationBubble && g.flags.innerConfidence && g.intel >= 75 && g.age >= 28 },
    { id:'anti_involution_champion_end', badge:'⚡', title:'反卷之王', desc:'你在内卷的洪流中找到了自己的节奏。\n\n你不再和同事比加班、不再和朋友圈比收入、不再和社会比标准。你用自己的方式工作、用自己的方式休息、用自己的方式活着。\n\n你的领导说：「你很特别。」你说：「我只是不想活成别人的模板。」\n\n你准点下班、周末不加班、年假全部休完。你的绩效不是最好的——但你的生活是你想要的。\n\n"反卷：不是不努力——是不用别人的尺子量自己的人生。"', cond: g => g.flags.efficiencyKing && g.flags.faceCulture && g.flags.innerConfidence && g.mood >= 65 && g.age >= 28 },
    // --- v15.3 NEW ENDINGS (消费文化) ---
    { id:'wise_consumer_end', badge:'💎', title:'智慧消费者', desc:'你从一个冲动消费者，变成了一个真正懂消费的人。\n\n你学会了理性购物、极简生活、二手交易、体验投资。你不再被广告忽悠、不再被双十一绑架、不再为了面子而消费。\n\n你的月支出从8000降到了4000，但生活质量反而提高了。因为你把钱花在了真正重要的地方：体验、健康、和爱的人在一起的时间。\n\n你的朋友问你：「你怎么做到这么省的？」你说：「我不是省——我只是知道什么值得。」\n\n"智慧消费：不是花得少——是每一分钱都花在了让自己更好的地方。"', cond: g => g.flags.minimalist && g.flags.rationalBuyer && g.flags.secondHandExpert && g.money >= 30000 && g.age >= 28 },
    { id:'experience_rich_end', badge:'🌟', title:'体验富翁', desc:'你的存款不多，但你的回忆很多。\n\n你去过很多城市、看过很多演唱会、学过冲浪和攀岩、在小巷子里发现过宝藏咖啡馆。\n\n你的朋友们最喜欢和你在一起——因为你总有故事可以讲。你的相册里没有名牌包和豪车，但有很多笑容和风景。\n\n你的一个孩子问你：「爸/妈，你年轻的时候最开心的事是什么？」你说：「去了很多地方，见了很多人，做了很多现在想起来还会笑的事。」\n\n"体验富翁：不是拥有最多的人——是经历最多的人。"', cond: g => g.flags.experienceEconomy && g.flags.localBrandDiscovery && g.flags.experienceInvestor && g.mood >= 70 && g.age >= 30 },
    { id:'financial_freedom_path_end', badge:'📈', title:'财务自由之路', desc:'你找到了属于自己的财务自由之路。\n\n你从一个理财小白，变成了一个有系统的投资者。你不再追涨杀跌、不再被K线绑架情绪。你有自己的投资策略，有自己的风险控制，有自己的长期规划。\n\n你的投资收益从亏损变成了稳定增长。你的被动收入开始覆盖基本生活开支。\n\n你的同事问你：「你财务自由了吗？」你说：「自由不是一个数字——是一种心态。我现在不焦虑了——这就是自由。」\n\n"财务自由：不是有很多钱——是不再为钱焦虑。"', cond: g => g.flags.financialLearner && g.flags.indexInvestor && g.flags.balancedConsumer && g.money >= 100000 && g.intel >= 65 && g.age >= 32 },
    // --- v16.0 NEW ENDINGS (住房问题) ---
    { id:'city_root_end', badge:'🏙️', title:'城市扎根者', desc:'你终于在这个城市扎下了根。\n\n你从城中村的单间，搬到了合租房，再到自己的小家。你用7年的时间，在这个不属于你的城市里，创造了一个属于你的角落。\n\n你的阳台上种着你从社区花园移来的薄荷。你的冰箱上贴满了和邻居们的合照。你的门锁密码只有你知道——这是你的安全感。\n\n你的妈妈来看你，说：「你终于有个像样的家了。」你说：「不是因为房子——是因为我在这里有了牵挂。」\n\n"城市扎根：不是买了房——是有了不想离开的理由。"', cond: g => g.flags.cityIdentity && g.flags.rootPlanter && g.flags.communityGarden && g.mood >= 65 && g.age >= 28 },
    { id:'urban_nomad_end', badge:'🎒', title:'都市游牧者', desc:'你成了大城市里的游牧者。\n\n你搬了10次家、换了5个工作、交了无数个来了又走的朋友。你不住在一个固定的地方——但你活在每一个当下。\n\n你的行李箱里只有必需品。你不买大件家具、不养植物、不办年卡。你随时可以走——但你也随时可以留。\n\n有人说你「不稳定」。你说：「我只是不想被任何东西绑住。」\n\n"都市游牧：不是没有家——是整个世界都是家。"', cond: g => g.flags.freeDrifter && g.flags.movingDay && g.flags.nightOwl && g.mood >= 60 && g.age >= 28 },
    { id:'community_hero_end', badge:'🌟', title:'社区英雄', desc:'你成了小区里最受欢迎的人。\n\n你是业委会成员、社区花园发起人、维权群群主。你帮邻居修过水管、帮老人教过手机、帮小朋友看过作业。\n\n你的邻居们说：「自从有了你，我们小区都不一样了。」你说：「不是我让小区不一样——是我们一起让它不一样了。」\n\n你被评为了「最美社区人」。你把奖状贴在了社区公告栏里。\n\n"社区英雄：不是做了什么大事——是让身边的人觉得，住在这里真好。"', cond: g => g.flags.communityActivist && g.flags.communityGarden && g.flags.gardenLeader && g.social >= 75 && g.age >= 30 },
    // --- v16.1 NEW ENDINGS (饮食文化) ---
    { id:'kitchen_master_end', badge:'👨‍🍳', title:'厨房大师', desc:'你从一个外卖废人，变成了一个热爱做饭的人。\n\n你学会了红烧肉、糖醋排骨、西红柿炒蛋、酸菜鱼。你的冰箱里永远有新鲜食材。你的厨房里永远飘着香味。\n\n你的朋友们最喜欢来你家蹭饭。你笑着说：「来可以，但要帮忙洗碗。」\n\n你的妈妈说：「你终于像个大人了。」你说：「不是——我只是像个会照顾自己的人。」\n\n"厨房大师：不是厨艺多好——是愿意为自己和爱的人做一顿饭。"', cond: g => g.flags.cookingDiscovery && g.flags.homeCook && g.flags.regularCook && g.health >= 60 && g.age >= 25 },
    { id:'healthy_living_end', badge:'🥗', title:'健康生活家', desc:'你找到了一种既健康又快乐的生活方式。\n\n你每天喝养生粥、每周做3次饭、控制咖啡和奶茶、科学饮食加规律运动。你的体重稳定了、皮肤变好了、精力充沛了。\n\n你的同事问你：「你怎么做到的？」你说：「不是自律——是爱自己。」\n\n你不再为了减肥而饿肚子、不再为了社交而喝酒、不再为了省时间而吃垃圾食品。你终于学会了——好好吃饭，是对自己最基本的尊重。\n\n"健康生活：不是苦行僧——是找到了让身体和心灵都舒服的节奏。"', cond: g => g.flags.scientificDiet && g.flags.healthPorridge && g.flags.coffeeModerator && g.health >= 70 && g.mood >= 65 && g.age >= 28 },
    // --- v16.2 NEW ENDINGS (交通出行) ---
    { id:'city_explorer_end', badge:'🗺️', title:'城市探索者', desc:'你比任何人都了解这个城市。\n\n你骑着电动车/自行车/走路，探索了每一条街道、每一个公园、每一家小店。你知道哪条巷子最安静、哪个路口日落最美、哪里的煎饼最好吃。\n\n你的朋友们来这个城市旅游，都找你要攻略。你说：「不用攻略——跟着我走就行。」\n\n你的地图App上标记了500多个你去过的地方。每一个标记都是一段记忆。\n\n"城市探索：不是走过多少路——是记住了多少风景。"', cond: g => g.flags.cityExplorer && g.flags.bikeCommuter && g.flags.nightCity && g.mood >= 65 && g.age >= 25 },
    { id:'commute_master_end', badge:'🚇', title:'通勤大师', desc:'你把通勤变成了一种生活方式。\n\n你学会了利用通勤时间学习、找到了最优路线、掌握了错峰出行的秘诀。你的通勤时间不再是浪费——而是你的「第二课堂」。\n\n你在地铁上听完了一整个大学课程、在公交上看完了50本书、在堵车时写完了一部小说的初稿。\n\n你的同事问你：「你不觉得通勤很累吗？」你说：「通勤不累——是你没有给它赋予意义。」\n\n"通勤大师：不是在路上浪费时间——是在路上创造价值。"', cond: g => g.flags.commuteLearner && g.flags.offPeakCommuter && g.flags.subwayCommute && g.intel >= 70 && g.age >= 28 },
    // --- v16.3 NEW ENDINGS (文化娱乐) ---
    { id:'cultural_life_end', badge:'🎭', title:'文艺生活家', desc:'你把大城市的文化生活过成了日常。\n\n你是剧本杀常客、脱口秀爱好者、读书会领读人、音乐节参与者。你的周末永远排满了文化活动。\n\n你的朋友圈不是美食就是演出。有人说你「活得像个文化人」。你说：「我只是活得像个好奇的人。」\n\n你的书架上有200本书、你的电影票根有100多张、你的剧本杀角色有30多个。每一个都是一段不同的体验。\n\n"文艺生活：不是在消费文化——是在用文化丰富自己的人生。"', cond: g => g.flags.bookClub && g.flags.standupComedy && g.flags.musicFestival && g.flags.scriptMurder && g.intel >= 65 && g.mood >= 65 && g.age >= 25 },
    { id:'social_entertainer_end', badge:'🎉', title:'社交组织者', desc:'你成了朋友圈里的社交灵魂。\n\n你组织了无数次桌游之夜、密室逃脱、剧本杀、KTV。你的朋友们说：「没有你的局不叫局。」\n\n你的微信群有500个人，每周至少组一次局。你认识的人比你记得的名字还多。\n\n你的一个朋友说：「你怎么认识这么多人？」你说：「不是我认识的人多——是我珍惜每一次遇见。」\n\n"社交组织者：不是爱热闹——是害怕朋友们变得疏远。每一次聚会，都是在缝合人与人之间的距离。"', cond: g => g.flags.gameOrganizer && g.flags.scriptMurder && g.flags.escapeRoom && g.social >= 80 && g.age >= 25 },
    // --- v17.0 教育结局 ---
    { id:'education_master_end', badge:'🎓', title:'学术大牛', desc:'你从本科一路读到博士，发了10篇顶刊，成了某领域的专家。\n\n你的论文被引用了500次，你的学生叫你"老板"。你在国际会议上用流利的英语做报告，台下的人认真记笔记。\n\n你妈终于可以在亲戚面前抬起头了："我儿子/女儿是大学教授。"\n\n你站在讲台上，看着台下20岁的学生们。你想起了当年那个迷茫的自己。\n\n"学术的路很孤独，但每一步都是向着真理前进。"', cond: g => g.flags.gradSchoolLife && g.flags.paperPublished && g.intel >= 90 && g.age >= 32 },
    { id:'lifelong_learner_end_v2', badge:'🌱', title:'终身学习者', desc:'你没有高学历，但你从未停止学习。\n\n你考了5个专业证书、学了2门外语、读了500本书、上了20门在线课程。你的书房堆满了教材，你的Kindle里还有30本未读完的书。\n\n你的同事说："你怎么什么都会？"你说："不是我都会——是我一直在学。"\n\n40岁的你，比25岁的自己更有价值。因为你从未停止成长。\n\n"终身学习：不是为了超越别人——是为了超越昨天的自己。"', cond: g => g.flags.lifelongLearning && g.flags.certMania && g.intel >= 85 && g.age >= 38 },
    { id:'vocational_master_end', badge:'🔧', title:'大国工匠', desc:'你没有走学历路线，而是选择了手艺。\n\n你从学徒做到了师傅，从师傅做到了行业标杆。你的技术在这个城市无人能敌。别人搞不定的问题，你一看就知道毛病在哪。\n\n你的月薪从3000涨到了3万。那些当年嘲笑你"不读书"的同学，现在来找你修车/修水管/装修房子。\n\n你说："读书是一种出路，手艺也是一种出路。路不同，但都能到达终点。"\n\n"手艺人：用双手创造生活，用技术赢得尊重。"', cond: g => g.flags.vocationalEdu && g.flags.craftSkill && g.money >= 100000 && g.age >= 30 },
    { id:'study_returnee_end', badge:'✈️', title:'海归精英', desc:'你出国留学后回国了。\n\n你进了一家外企/大厂，年薪50万。你的英语流利、视野开阔、做事方式和国际接轨。\n\n但你也发现：国内的工作节奏和国外完全不同。你的同事觉得你"太洋气"，你的老板觉得你"不够接地气"。\n\n你在两种文化之间找到了平衡点。你用国际化的方式解决了本地化的问题。\n\n"海归：不是回来镀金——是回来做事。"', cond: g => g.flags.studyAbroad && g.money >= 200000 && g.intel >= 80 && g.age >= 28 },
    { id:'education_reformer_end', badge:'📚', title:'教育革新者', desc:'你经历了教育的内卷，也见证了教育的困境。\n\n你决定做一些改变：你办了一所创新学校/做了一个教育公众号/写了一本教育畅销书。你的理念是"让教育回归本质——培养人，而不是筛选人"。\n\n你的学生/读者/粉丝说："是你改变了我对教育的看法。"\n\n你没有改变整个体制，但你改变了一些人的命运。\n\n"教育改革：不是推翻一切——是在废墟上种花。"', cond: g => g.flags.involutionEdu && g.flags.antiInvolution && g.intel >= 75 && g.social >= 60 && g.age >= 32 },
    // --- v17.1 节日结局 ---
    { id:'travel_master_end', badge:'🌍', title:'旅行达人', desc:'你成了一个旅行达人。\n\n你去过30个国家、50个城市。你的护照上有20多个签证，你的冰箱贴摆满了一面墙。\n\n你的朋友圈不是旅行照就是在机场的自拍。有人说你"不务正业"，有人说你"活得精彩"。\n\n你说："旅行的意义不在于去了哪里——在于看到了不同的活法。"\n\n你把每一次旅行都当成一次人生的拓展。你的世界观比大多数人宽广，因为你亲眼看过那么多的不同。\n\n"世界那么大，我想去看看——而你，真的去看了。"', cond: g => g.flags.annualLeaveTrip && g.flags.offPeakTravel && g.money >= 100000 && g.mood >= 65 && g.age >= 30 },
    { id:'festival_life_end', badge:'🎊', title:'生活仪式感', desc:'你把每一个节日都过得有滋有味。\n\n春节你包饺子、端午你包粽子、中秋你赏月、七夕你给自己买花、元旦你倒数跨年。\n\n你的朋友们说："跟你一起过节总是特别有意思。"\n\n你不是在过节日——你是在用仪式感对抗日常的平淡。每一个节日都是一颗糖，甜在平凡的日子里。\n\n"仪式感：不是矫情——是提醒自己，生活值得被认真对待。"', cond: g => g.flags.newYearEve && g.flags.duanwuZongzi && g.flags.qixiValentine && g.mood >= 70 && g.age >= 25 },
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
        // v8.0: 初始化新系统
        recentEventIds: [],
        inventory: {},
        consecutiveChoices: {},
        // v8.2: 延迟后果系统初始化
        delayedEffects: [],
        _consecutiveActivity: { type: null, count: 0 },
        // v9.2: 投资理财系统初始化
        investments: {},
    });

    showScreen('screen-game');
    updateHUD();
    updateTradePrices(); // v8.0: 初始化交易价格

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

// v8.1: 策划团队平衡调整 - 锻炼不再OP，各活动更均衡
const ACTIVITY_EFFECTS = {
    work: { money: 3000, health: -5, mood: -3, intel: 2, social: -2, charm: 0, label: '拼命工作' },
    rest: { money: -500, health: 6, mood: 8, intel: 0, social: 0, charm: 2, label: '休息放松' },
    study: { money: -200, health: -1, mood: -2, intel: 8, social: 0, charm: 3, label: '学习充电' },
    socialize: { money: -1000, health: -1, mood: 6, intel: 0, social: 8, charm: 5, label: '社交聚会' },
    exercise: { money: -300, health: 6, mood: 3, intel: 0, social: 0, charm: 4, label: '运动锻炼' },
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
            // v9.1: 信息/谣言系统 - 社交时获得有用的情报
            generateRumor();
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

    // v8.0: 每月更新倒卖交易价格
    updateTradePrices();

    // v8.2: 延迟后果系统 - 检查是否有到期的延迟效果
    processDelayedEffects();

    // v9.1: 信息谣言后续效果
    processRumorEffects();

    // v9.2: 投资理财月度结算
    updateInvestments();

    // v10.0: 每日运势修正
    applyDailyModifier();

    // v8.2: 连续活动惩罚/奖励 - 连续选同一活动会有额外后果
    processConsecutiveActivity();

    // v8.2: 季度里程碑事件
    if (G.months > 0 && G.months % 3 === 0 && Math.random() > 0.5) {
        triggerQuarterlyEvent();
    }

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
    // v8.1: 新手保护期 - 前3个月不会暴毙/破产，给玩家适应时间
    const isNewbieProtected = G.months <= 3;
    if (G.health <= 0 && !isNewbieProtected) { triggerEnding(); return; }
    if (G.money <= -100000 && !isNewbieProtected) { triggerEnding(); return; }
    if (G.age >= 60) { triggerEnding(); return; }
    if (G.mood <= 0 && !isNewbieProtected) { triggerEnding(); return; }
    // 新手保护期内属性不会低于20
    if (isNewbieProtected) {
        G.health = Math.max(G.health, 20);
        G.mood = Math.max(G.mood, 20);
        G.money = Math.max(G.money, -20000);
    }

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
    // v8.0: 事件冷却去重 - 最近15个事件不会重复出现
    // v17.0: 事件类别多样性 - 优先选择最近较少触发的类别
    const cityEvents = CITIES[G.city]?.events || [];
    const allEvents = [...EVENTS, ...cityEvents];
    const recentSet = new Set(G.recentEventIds || []);
    const eligible = allEvents.filter(e =>
        (!e.cond || e.cond(G)) && (!e.minAge || G.age>=e.minAge) && (!e.maxAge || G.age<=e.maxAge)
        && !recentSet.has(e.id) // v8.0: 排除最近见过的事件
    );
    // 如果过滤后没有可用事件，清空冷却池重试
    const pool = eligible.length > 0 ? eligible : allEvents.filter(e =>
        (!e.cond || e.cond(G)) && (!e.minAge || G.age>=e.minAge) && (!e.maxAge || G.age<=e.maxAge)
    );
    if (!pool.length) return null;
    // v17.0: 类别权重优化 - 有category标签的事件，如果该类别最近触发过，降低权重
    if (!G.recentCategories) G.recentCategories = [];
    const weighted = [];
    pool.forEach(e => {
        let w = e.weight || 1;
        // v17.0: 如果事件有类别且该类别最近触发过，权重减半
        if (e.category && G.recentCategories.includes(e.category)) {
            w = Math.max(1, Math.floor(w * 0.5));
        }
        for(let i=0;i<w;i++) weighted.push(e);
    });
    const picked = weighted[Math.floor(Math.random()*weighted.length)];
    // v8.0: 记录已见事件（保留最近15个）
    if (!G.recentEventIds) G.recentEventIds = [];
    G.recentEventIds.push(picked.id);
    if (G.recentEventIds.length > 15) G.recentEventIds.shift();
    // v17.0: 记录事件类别（保留最近8个）
    if (picked.category) {
        G.recentCategories.push(picked.category);
        if (G.recentCategories.length > 8) G.recentCategories.shift();
    }
    return picked;
}

function showEvent(event) {
    G.currentEvent = event; G.eventsSeen++;
    const body = typeof event.body === 'function' ? event.body() : event.body;
    // v8.0: hint 神秘化 - 不直接暴露具体属性，只给风格暗示
    const hintMap = {
        '+💰': '💰?', '-💰': '💰↓', '+❤️': '❤️↑', '-❤️': '❤️↓',
        '+😊': '☀️', '-😊': '🌧️', '+🧠': '💡', '-🧠': '🤔',
        '+👥': '🤝', '-👥': '🚪', '+✨': '⭐', '-✨': '💫',
        '🎲': '🎲', '+💰 +😊': '🎰', '-💰 +😊': '💸☀️',
        '+💰 +🧠': '💰💡', '+💰 -❤️': '💰🫀', '-💰 +❤️': '💸❤️',
        '+😊 +👥': '🎉', '+❤️ +😊': '🌈',
    };
    document.getElementById('current-event').innerHTML = `
        <div class="event-card">
            <div class="event-card-header">
                <span class="event-card-icon">${event.icon}</span>
                <span class="event-card-title">${event.title}</span>
                <span class="event-card-date">${G.year}年${G.month}月</span>
            </div>
            <div class="event-card-body">${body}</div>
            <div class="event-choices">
                ${event.choices.map((c,i) => {
                    // v8.0: 将hint翻译为神秘版本
                    const mysteryHint = c.hint ? (hintMap[c.hint.trim()] || '❓') : '';
                    return `<button class="choice-btn" onclick="makeChoice(${i})"><span class="choice-label">${c.label}</span>${mysteryHint?`<span class="choice-hint">${mysteryHint}</span>`:''}</button>`;
                }).join('')}
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

    // v8.2: "算了"累积追踪 - 选择放弃型选项会积累遗憾值
    if (choice.label && (choice.label.includes('算了') || choice.label.includes('还是算了'))) {
        G.flags.regretCount = (G.flags.regretCount || 0) + 1;
        // 每5次"算了"，触发一次遗憾反思
        if (G.flags.regretCount % 5 === 0 && G.flags.regretCount <= 20) {
            addDelayedEffect(1, {mood: -10, intel: 5}, '你突然想起了那些你说"算了"的事情。\n\n那些没去追的梦想、没敢表白的暗恋、没投出的简历、没迈出的那一步。\n\n你数了数：已经说了太多次"算了"。\n\n"人生最大的遗憾不是失败，而是「我本可以」。"');
        }
    }

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
        return; // v8.0: 如果有链式事件，不触发突发事件
    }

    // v8.0: 突发事件系统 - 35%概率触发意外事件（打破回合制单调感）
    if (!G.currentEvent && Math.random() < 0.35) {
        const surprise = pickSurpriseEvent();
        if (surprise) {
            setTimeout(() => {
                showSurpriseEvent(surprise);
            }, 600);
        }
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

// === v8.0 突发事件系统 ===
function pickSurpriseEvent() {
    if (!SURPRISE_EVENTS || !SURPRISE_EVENTS.length) return null;
    const weighted = [];
    SURPRISE_EVENTS.forEach(e => { for(let i=0;i<(e.weight||1);i++) weighted.push(e); });
    return weighted[Math.floor(Math.random()*weighted.length)];
}

function showSurpriseEvent(event) {
    // v8.0: 追踪突发事件次数
    G.flags.surpriseCount = (G.flags.surpriseCount || 0) + 1;
    const body = typeof event.body === 'function' ? event.body() : event.body;
    const result = event.fn(G);
    // 应用属性变化
    if (result.money) G.money += result.money;
    if (result.health) G.health = clamp(G.health + result.health, 0, 100);
    if (result.mood) G.mood = clamp(G.mood + result.mood, 0, 100);
    if (result.intel) G.intel = clamp(G.intel + result.intel, 0, 100);
    if (result.social) G.social = clamp(G.social + result.social, 0, 100);
    if (result.charm) G.charm = clamp(G.charm + result.charm, 0, 100);

    // 显示变化
    const labels = {money:'💰',health:'❤️',mood:'😊',intel:'🧠',social:'👥',charm:'✨'};
    let changes = '';
    for (const [k,v] of Object.entries(result)) {
        if (labels[k] && v) {
            const d = k==='money' ? fmtMoney(v) : (v>0?`+${v}`:`${v}`);
            changes += `<span class="stat-change-item ${v>0?'positive':'negative'}">${labels[k]} ${d}</span>`;
            showStatChange(k, v, labels[k], d);
        }
    }

    // 突发事件特殊效果：卡片从右侧滑入
    addEventCard({
        icon: event.icon,
        title: `⚡ ${event.title}`,
        body: body + `\n\n<div class="meme-quote" style="color:var(--accent)">— 意料之外 —</div>`,
        changes,
        type: (result.mood||0) > 0 ? 'positive' : (result.mood||0) < 0 ? 'negative' : ''
    }, true);

    // 屏幕效果
    if ((result.mood||0) < -10 || (result.health||0) < -5) {
        document.getElementById('screen-game').classList.add('shake');
        setTimeout(() => document.getElementById('screen-game').classList.remove('shake'), 500);
    }

    updateHUD();
    if (G.health<=0 || G.mood<=0 || G.money<=-100000) triggerEnding();
    checkAchievements();
    playSound('chain');
}

// === v8.2 延迟后果系统 ===
function addDelayedEffect(monthsLater, effect, message) {
    if (!G.delayedEffects) G.delayedEffects = [];
    G.delayedEffects.push({
        triggerMonth: G.months + monthsLater,
        effect: effect,
        message: message
    });
}

function processDelayedEffects() {
    if (!G.delayedEffects || !G.delayedEffects.length) return;
    const triggered = G.delayedEffects.filter(e => G.months >= e.triggerMonth);
    const remaining = G.delayedEffects.filter(e => G.months < e.triggerMonth);
    G.delayedEffects = remaining;

    triggered.forEach(de => {
        const eff = typeof de.effect === 'function' ? de.effect(G) : de.effect;
        if (eff.money) G.money += eff.money;
        if (eff.health) G.health = clamp(G.health + eff.health, 0, 100);
        if (eff.mood) G.mood = clamp(G.mood + eff.mood, 0, 100);
        if (eff.intel) G.intel = clamp(G.intel + eff.intel, 0, 100);
        if (eff.social) G.social = clamp(G.social + eff.social, 0, 100);
        if (eff.charm) G.charm = clamp(G.charm + eff.charm, 0, 100);
        if (eff.flag) G.flags[eff.flag] = true;

        // 显示延迟后果通知
        addEventCard({
            icon: '⏰',
            title: '过去的选择找上了你',
            body: de.message + '\n\n<div class="meme-quote" style="color:var(--accent)">— 因果报应 —</div>',
            type: (eff.mood||0) > 0 ? 'positive' : (eff.mood||0) < 0 ? 'negative' : ''
        }, true);
    });
}

// === v8.2 连续活动后果系统 ===
function processConsecutiveActivity() {
    if (!selectedActivity && !G._lastActivity) return;
    const act = G._lastActivity;
    if (!act) return;

    // 追踪连续选择同一活动的月数
    if (!G._consecutiveActivity) G._consecutiveActivity = { type: null, count: 0 };
    if (G._consecutiveActivity.type === act) {
        G._consecutiveActivity.count++;
    } else {
        G._consecutiveActivity = { type: act, count: 1 };
    }

    const count = G._consecutiveActivity.count;
    // 连续6个月选同一活动，触发特殊后果
    if (count >= 6) {
        const consequences = {
            work: { money: 5000, health: -15, mood: -10, message: '你已经连续6个月拼命工作了。你的身体开始抗议——体检报告上多了三个箭头。' },
            rest: { money: -3000, health: 10, mood: 15, message: '你已经连续6个月休息了。你的身心恢复了不少，但银行卡余额让你开始焦虑。' },
            study: { intel: 15, mood: -5, message: '你已经连续6个月充电了。你考了两个证，但你开始怀疑：这些证真的有用吗？' },
            socialize: { social: 15, money: -5000, charm: 8, message: '你已经连续6个月社交了。你成了圈子里的名人，但你的钱包在哭泣。' },
            exercise: { health: 15, charm: 10, mood: 5, message: '你已经连续6个月锻炼了。你的腹肌开始显形，你的精神状态比大多数同龄人好得多。' },
        };
        const c = consequences[act];
        if (c) {
            if (c.money) G.money += c.money;
            if (c.health) G.health = clamp(G.health + c.health, 0, 100);
            if (c.mood) G.mood = clamp(G.mood + c.mood, 0, 100);
            if (c.intel) G.intel = clamp(G.intel + c.intel, 0, 100);
            if (c.social) G.social = clamp(G.social + c.social, 0, 100);
            if (c.charm) G.charm = clamp(G.charm + c.charm, 0, 100);
            addEventCard({
                icon: '🔄',
                title: '坚持的力量',
                body: c.message + '\n\n<div class="meme-quote" style="color:var(--accent)">— 量变引起质变 —</div>',
                type: (c.mood||0) > 0 ? 'positive' : (c.mood||0) < 0 ? 'negative' : ''
            }, true);
            G._consecutiveActivity.count = 0; // 重置
        }
    }
}

// === v8.2 季度里程碑事件 ===
function triggerQuarterlyEvent() {
    const milestones = [
        { cond: g => g.months === 3, body: '你在大城市已经活了3个月了。\n\n你开始熟悉地铁线路，知道了哪家外卖最好吃，学会了在早高峰保持优雅。\n\n但你偶尔会在深夜想家。\n\n"3个月，足够你爱上这座城市，也足够你开始讨厌它。"' },
        { cond: g => g.months === 12, body: '一年了。你在这个城市整整一年了。\n\n你回顾这一年：换了几份工作？认识了几个人？哭过几次？笑过几次？\n\n你发了一条朋友圈："一周年。"\n\n没人点赞。但你知道，这一年你成长了很多。\n\n"一年前你拎着行李箱来，现在你拎着行李箱——但至少你知道了哪个区的房租最便宜。"' },
        { cond: g => g.months === 24, body: '两年了。你已经是个"老漂"了。\n\n你开始给新来的朋友推荐餐厅，告诉他们哪条地铁线最挤，哪个医院看病不用排太久。\n\n你的父母在电话里问："什么时候回来？"你说："快了。"\n\n但你心里知道：你已经离不开这座城市了。\n\n"两年，你从游客变成了居民，从居民变成了……一个还不确定自己属于哪里的人。"' },
        { cond: g => g.months === 36, body: '三年了。\n\n三年前的你，看到CBD的高楼会仰头看很久。现在的你，只是低头看手机走过。\n\n你开始理解：大城市不欠你什么，你也不欠大城市什么。\n\n你只是在这里，认真地活着。\n\n"三年，足够你从理想主义者变成现实主义者——如果你还没放弃的话。"' },
        { cond: g => g.months === 60, body: '五年了。\n\n你在这个城市度过了整个二十代。\n\n你看着镜子里的自己：眼角有了细纹，但眼神更坚定了。你的银行余额可能没有你期望的那么多，但你积累了比钱更宝贵的东西——经验、人脉、和一种叫做"韧劲"的品质。\n\n"五年前的你，以为五年后会功成名就。五年后的你发现：活着本身就是一种成就。"' },
    ];

    const milestone = milestones.find(m => m.cond(G));
    if (milestone) {
        addEventCard({
            icon: '📅',
            title: `里程碑：${G.months}个月`,
            body: milestone.body + `\n\n<div class="meme-quote" style="color:var(--accent)">— 时光荏苒 —</div>`,
            type: 'neutral'
        }, true);
    }
}

// === v10.0 每日运势/修正系统 ===
const DAILY_MODIFIERS = [
    { id:'lucky_day', icon:'🍀', name:'幸运日', desc:'今天运气不错', effect: {mood:5,money:100} },
    { id:'mercury_retrograde', icon:'🔮', name:'水逆', desc:'今天诸事不顺', effect: {mood:-3,health:-1} },
    { id:'full_moon', icon:'🌕', name:'满月', desc:'月圆之夜，情绪波动', effect: {mood:3,intel:2} },
    { id:'payday_mood', icon:'💸', name:'月底焦虑', desc:'又快月底了', effect: {mood:-5} },
    { id:'good_sleep', icon:'😴', name:'睡了好觉', desc:'昨晚睡得特别好', effect: {health:3,mood:3} },
    { id:'bad_sleep', icon:'😵', name:'失眠之夜', desc:'昨晚几乎没睡', effect: {health:-3,mood:-3,intel:-1} },
    { id:'inspiration', icon:'💡', name:'灵感闪现', desc:'突然有了好主意', effect: {intel:5,charm:2} },
    { id:'social_energy', icon:'🦋', name:'社交能量', desc:'今天特别想见人', effect: {social:5,mood:3} },
    { id:'lazy_day', icon:'🛋️', name:'懒癌发作', desc:'什么都不想干', effect: {mood:3,health:2,intel:-1} },
    { id:'productive', icon:'⚡', name:'效率爆棚', desc:'今天效率特别高', effect: {intel:3,money:200,mood:3} },
    // === v15.0 新增每日修正 ===
    { id:'mindful_morning', icon:'🧘', name:'正念清晨', desc:'早上冥想了10分钟', effect: {mood:5,health:2,intel:2} },
    { id:'gratitude_day', icon:'🙏', name:'感恩日', desc:'今天感恩了三件小事', effect: {mood:8,social:2} },
    { id:'anxiety_spike', icon:'😰', name:'焦虑来袭', desc:'今天莫名焦虑', effect: {mood:-5,health:-2} },
    { id:'exercise_boost', icon:'💪', name:'运动加成', desc:'今天运动了，心情大好', effect: {health:5,mood:5} },
    { id:'creative_flow', icon:'🎨', name:'心流状态', desc:'进入了心流状态', effect: {intel:5,mood:5,charm:3} },
];

function getDailyModifier() {
    // 基于日期生成固定的每日修正（同一天总是同样的修正）
    const daySeed = G.months * 31 + G.month;
    const index = daySeed % DAILY_MODIFIERS.length;
    return DAILY_MODIFIERS[index];
}

function applyDailyModifier() {
    const mod = getDailyModifier();
    if (!mod) return;

    // 应用效果
    for (const [key, value] of Object.entries(mod.effect)) {
        if (key === 'money') {
            G.money += value;
        } else if (G[key] !== undefined) {
            G[key] = clamp(G[key] + value, 0, 100);
        }
    }

    // 偶尔显示提示（30%概率）
    if (Math.random() > 0.7) {
        notify(`${mod.icon} ${mod.name}：${mod.desc}`);
    }
}

// === v9.2 投资理财系统 ===
const INVEST_OPTIONS = {
    yuebao: { name: '余额宝', icon: '🏦', risk: 'low', monthlyReturn: [0.001, 0.003], desc: '年化2-3%，稳如老狗' },
    stock: { name: 'A股', icon: '📈', risk: 'high', monthlyReturn: [-0.08, 0.12], desc: '七亏二平一赚，你是那一个吗？' },
    fund: { name: '基金定投', icon: '💹', risk: 'mid', monthlyReturn: [-0.03, 0.05], desc: '定投一时爽，赎回火葬场' },
    crypto: { name: '比特币', icon: '₿', risk: 'extreme', monthlyReturn: [-0.20, 0.30], desc: '波动即正义，信仰即财富' },
    house: { name: '房产投资', icon: '🏠', risk: 'mid', monthlyReturn: [-0.01, 0.02], minAmount: 100000, desc: '中国人的信仰，但你需要首付' },
};

function openInvestMarket() {
    const modal = document.getElementById('modal-invest') || createInvestModal();
    const content = modal.querySelector('.invest-content');
    if (!content) return;

    let html = '<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">💡 投资有风险，入市需谨慎。你的选择会影响未来的财富。</p>';

    for (const [key, opt] of Object.entries(INVEST_OPTIONS)) {
        const holding = G.investments[key] || 0;
        const riskLabel = { low:'🟢低风险', mid:'🟡中风险', high:'🔴高风险', extreme:'⚫极高风险' }[opt.risk];
        const minAmt = opt.minAmount || 100;

        html += `
        <div class="invest-card" style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px;background:var(--card-bg)">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <span>${opt.icon} <strong>${opt.name}</strong> <span style="font-size:11px;color:var(--text-muted)">${riskLabel}</span></span>
                <span style="font-size:12px">持有: ¥${holding.toLocaleString()}</span>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin:4px 0">${opt.desc}</div>
            <div style="display:flex;gap:6px;margin-top:6px">
                <button class="btn-small" onclick="investBuy('${key}',500)" ${G.money>=500&&500>=minAmt?'':'disabled'}>投¥500</button>
                <button class="btn-small" onclick="investBuy('${key}',5000)" ${G.money>=5000&&5000>=minAmt?'':'disabled'}>投¥5000</button>
                <button class="btn-small" onclick="investBuy('${key}',50000)" ${G.money>=50000&&50000>=minAmt?'':'disabled'}>投¥5万</button>
                ${holding>0 ? `<button class="btn-small" style="color:#f87171" onclick="investSell('${key}')">全部赎回</button>` : ''}
            </div>
        </div>`;
    }
    content.innerHTML = html;
    modal.classList.add('open');
}

function createInvestModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-invest';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('modal-invest')"></div>
        <div class="modal-content modal-large">
            <button class="modal-close" onclick="closeModal('modal-invest')" aria-label="关闭">×</button>
            <h2>💰 投资理财</h2>
            <div class="invest-content"></div>
        </div>`;
    document.body.appendChild(modal);
    return modal;
}

function investBuy(key, amount) {
    const opt = INVEST_OPTIONS[key];
    if (!opt || G.money < amount) { notify('❌ 资金不足'); return; }
    if (opt.minAmount && amount < opt.minAmount) { notify('❌ 最低投资额不足'); return; }

    G.money -= amount;
    G.investments[key] = (G.investments[key] || 0) + amount;
    G.flags.hasInvestment = true;
    updateHUD();
    openInvestMarket(); // 刷新界面
    notify(`✅ 已投资${opt.icon}${opt.name} ¥${amount.toLocaleString()}`);
    playSound('coin');
}

function investSell(key) {
    const opt = INVEST_OPTIONS[key];
    const holding = G.investments[key] || 0;
    if (holding <= 0) return;

    // 赎回时有手续费（1%）和随机波动
    const fee = Math.floor(holding * 0.01);
    const returnAmount = holding - fee;

    G.money += returnAmount;
    G.investments[key] = 0;

    // 计算盈亏
    const profit = returnAmount - holding; // 这里简化处理
    updateHUD();
    openInvestMarket();

    if (returnAmount > holding) {
        notify(`💰 赎回${opt.name}，赚了¥${(returnAmount - holding).toLocaleString()}`);
    } else {
        notify(`📉 赎回${opt.name}，到手¥${returnAmount.toLocaleString()}`);
    }
    playSound('coin');
}

// 每月更新投资收益
function updateInvestments() {
    if (!G.investments) return;
    let totalProfit = 0;
    for (const [key, amount] of Object.entries(G.investments)) {
        if (amount <= 0) continue;
        const opt = INVEST_OPTIONS[key];
        if (!opt) continue;

        const [minR, maxR] = opt.monthlyReturn;
        const returnRate = minR + Math.random() * (maxR - minR);
        const profit = Math.floor(amount * returnRate);
        G.investments[key] = Math.max(0, amount + profit);
        totalProfit += profit;
    }
    return totalProfit;
}

// === v9.1 信息/谣言系统 ===
// 社交时随机获得情报：有些有用，有些是坑
const RUMOR_POOL = [
    // —— 真实有用的情报 ——
    { id:'rumor_job_opening', icon:'💼', title:'饭局上的消息', body:'朋友悄悄告诉你：他公司下周有个内部推荐名额，薪资比外面高30%。\n\n"你先把简历发我，我帮你递进去。"',
      type:'good', effect: g => { g.flags.rumorJobTip = true; return {mood:8}; },
      followUp:'你记下了这个内推机会。' },
    { id:'rumor_rent_drop', icon:'🏠', title:'租房内幕', body:'酒桌上有人透露：你那个片区下个月有一批公租房要放出来，租金只有市场价的一半。\n\n"消息还没公开，你赶紧去街道办问问。"',
      type:'good', effect: g => { g.flags.rumorRentTip = true; return {mood:5,intel:3}; },
      followUp:'你默默记下了这个消息。' },
    { id:'rumor_stock_tip', icon:'📈', title:'财富密码', body:'一个做金融的朋友喝多了，拉着你说了半天"内幕消息"：某只股票下周要涨。\n\n"这个你别乱说啊，我就跟你说一声。"',
      type:'risky', effect: g => {
          g.flags.rumorStockTip = true;
          // 50%概率真涨，50%概率是割韭菜
          if (Math.random() > 0.5) { g.flags.rumorStockReal = true; }
          return {mood:5};
      }, followUp:'你心里盘算着要不要试试。' },
    { id:'rumor_trade_hot', icon:'🔥', title:'行情情报', body:'有人告诉你最近某种货很抢手，价格马上要涨。\n\n"我也是听说的，你看着办。"',
      type:'good', effect: g => {
          // 随机让一种商品下月涨价
          const goods = Object.keys(TRADE_GOODS);
          const hotGood = goods[Math.floor(Math.random()*goods.length)];
          g.flags.rumorHotGood = hotGood;
          g.flags.rumorTradeTip = true;
          return {mood:3};
      }, followUp:'你记下了这个商品的行情。' },
    { id:'rumor_company_layoff', icon:'⚠️', title:'裁员风声', body:'隔壁部门的人偷偷跟你说：公司可能要裁员了。\n\n"我劝你提前投简历，别等HR找你谈话。"',
      type:'good', effect: g => { g.flags.rumorLayoff = true; return {mood:-5,intel:3}; },
      followUp:'你开始偷偷更新简历。' },
    { id:'rumor_gym_deal', icon:'💪', title:'健身卡折扣', body:'你朋友说他健身房要搞周年庆促销，年卡打三折。\n\n"要办赶紧办，就这周末，过了就恢复原价了。"',
      type:'good', effect: g => { g.flags.rumorGymDeal = true; return {mood:5}; },
      followUp:'你打算周末去看看。' },
    { id:'rumor_freelance', icon:'💻', title:'私活机会', body:'聚会上认识了一个人，说他们有个外包项目缺人，问你有没有兴趣。\n\n"活不多，但给钱爽快。你考虑一下？"',
      type:'good', effect: g => {
          g.flags.rumorFreelance = true;
          if (Math.random() > 0.4) {
              return {money:8000,mood:10,social:5};
          } else {
              return {money:3000,mood:5};
          }
      }, followUp:'你留了他的微信。' },
    { id:'rumor_housing_policy', icon:'📋', title:'政策风向', body:'一个在政府上班的朋友说：这个城市马上要出台新的人才补贴政策，租房和买房都有补贴。\n\n"消息还没公开，你提前准备材料。"',
      type:'good', effect: g => { g.flags.rumorPolicyTip = true; return {intel:5,mood:5}; },
      followUp:'你默默开始准备申请材料。' },
    { id:'rumor_side_hustle', icon:'🛵', title:'副业门路', body:'有人说现在跑外卖特别赚钱，尤其是周末和节假日。\n\n"一个月多赚个五六千不成问题，就看你愿不愿意辛苦。"',
      type:'neutral', effect: g => {
          if (Math.random() > 0.5) { return {money:4000,health:-5,mood:-3}; }
          else { return {money:2000,health:-8,mood:-5}; }
      }, followUp:'你下载了外卖骑手APP。' },
    // —— 坑人的假消息 ——
    { id:'rumor_crypto', icon:'🪙', title:'币圈暴富神话', body:'酒桌上有人吹嘘自己炒币赚了一套房，怂恿你也入坑。\n\n"现在上车还来得及！下一个百倍币！"',
      type:'bad', effect: g => {
          g.flags.rumorCrypto = true;
          return {mood:5};
      }, followUp:'你心动了，但理智告诉你……' },
    { id:'rumor_pyramid', icon:'🔺', title:'"创业项目"', body:'一个老同学突然约你吃饭，热情地介绍他的"创业项目"：只需要投入5000块，月回报30%。\n\n"我们团队已经有200人了！"',
      type:'bad', effect: g => {
          if (g.intel > 60) {
              return {mood:3,intel:2}; // 聪明人一眼识破
          } else {
              g.money -= 5000;
              addDelayedEffect(3, {mood:-20,money:-3000}, '那个「创业项目」果然是传销，你的钱打了水漂');
              return {mood:5,money:-5000};
          }
      }, followUp: g => g.intel > 60 ? '你婉拒了，总觉得不太对。' : '你投了5000块试试水。' },
    { id:'rumor_scam_call', icon:'📞', title:'电信诈骗情报', body:'有人跟你说最近有种新型诈骗：冒充社保局打电话让你补交费用。\n\n"我已经中招了，你小心点。"',
      type:'good', effect: g => { g.flags.rumorScamAlert = true; return {intel:3}; },
      followUp:'你记住了这个套路。' },
    { id:'rumor_mlm', icon:'🧴', title:'微商邀请', body:'你朋友圈突然被一个人刷屏了——她以前是你的同事，现在在做微商。\n\n她私信你："姐/哥，来跟我一起做吧，月入十万不是梦！"',
      type:'bad', effect: g => {
          return {mood:-3,social:-2};
      }, followUp:'你默默屏蔽了她的朋友圈。' },
    // —— 城市特色八卦 ——
    { id:'rumor_beijing_hukou', icon:'📋', title:'户口消息', body:'有人听说北京要放宽落户政策了，积分落户分数线可能下降。\n\n"不过这消息传了好几年了，每次都是假的。"',
      type:'city', cond: g => g.city === 'beijing',
      effect: g => { g.flags.rumorHukou = true; return {mood:3}; },
      followUp:'你半信半疑。' },
    { id:'rumor_shanghai_disney', icon:'🏰', title:'迪士尼年卡', body:'朋友说上海迪士尼内部员工可以搞到半价年卡。\n\n"你信吗？反正我是不太信。"',
      type:'city', cond: g => g.city === 'shanghai',
      effect: g => {
          if (Math.random() > 0.6) {
              return {money:-500,mood:15,charm:5}; // 真的搞到了
          } else {
              return {money:-200,mood:-5}; // 被骗了200定金
          }
      }, followUp:'你决定碰碰运气。' },
    { id:'rumor_shenzhen_factory', icon:'🏭', title:'工厂搬迁', body:'有人说深圳又有一批工厂要搬到东南亚了，周围的房租可能会降。\n\n"城中村都要拆了改公寓。"',
      type:'city', cond: g => g.city === 'shenzhen',
      effect: g => { g.flags.rumorFactoryMove = true; return {intel:3}; },
      followUp:'你开始关注附近租房信息。' },
    { id:'rumor_hangzhou_taobao', icon:'🛒', title:'淘宝新规', body:'做电商的朋友说淘宝要改算法了，小卖家可能会被限流。\n\n"赶紧囤货，趁现在还卖得动。"',
      type:'city', cond: g => g.city === 'hangzhou',
      effect: g => {
          if (g.flags.ecommerce || g.flags.influencer) {
              return {mood:-8,intel:3};
          }
          return {intel:2};
      }, followUp:'电商圈又焦虑了起来。' },
    { id:'rumor_chengdu_food', icon:'🌶️', title:'美食情报', body:'有人告诉你成都新开了一家苍蝇馆子，味道绝了，但只有本地人才知道。\n\n"老板脾气很差，去晚了就关门。"',
      type:'city', cond: g => g.city === 'chengdu',
      effect: g => { return {mood:10,health:3}; },
      followUp:'你找时间去了，果然名不虚传。' },
    { id:'rumor_guangzhou_wholesale', icon:'📦', title:'批发市场', body:'有人说广州白马服装城最近在清仓甩卖，衣服按斤卖。\n\n"你去进一批货，挂闲鱼卖，至少翻三倍。"',
      type:'city', cond: g => g.city === 'guangzhou',
      effect: g => { g.flags.rumorWholesale = true; return {mood:5}; },
      followUp:'你盘算着要不要去进货。' },
    // —— 生活八卦/黑色幽默 ——
    { id:'rumor_office_gossip', icon:'🗣️', title:'办公室八卦', body:'同事悄悄告诉你：你们领导要被调走了，新领导是个"卷王"。\n\n"听说他以前那个部门，没有一个人能准时下班。"',
      type:'neutral', effect: g => {
          if (g.job !== '待业中') {
              g.flags.rumorNewBoss = true;
              return {mood:-8};
          }
          return {mood:3};
      }, followUp:'你开始为未来担忧。' },
    { id:'rumor_marriage_market', icon:'💒', title:'相亲市场', body:'朋友的妈妈跟你说：她手上有个"条件很好"的对象要介绍给你。\n\n"有房有车，就是比你大10岁。你要不要见见？"',
      type:'neutral', effect: g => {
          if (g.relationships && (g.relationships.partner||0) < 30) {
              g.flags.rumorBlindDate = true;
              return {mood:5,social:3};
          }
          return {mood:-5};
      }, followUp:'你犹豫了一下。' },
    { id:'rumor_neighbor', icon:'👀', title:'邻居的忠告', body:'楼下大爷跟你说：你这栋楼可能要装电梯了，要每家出5万。\n\n"不同意也得同意，少数服从多数。"',
      type:'bad', effect: g => {
          g.flags.rumorElevator = true;
          return {mood:-5,money:-5000};
      }, followUp:'你看着银行卡余额叹了口气。' },
    { id:'rumor_ai_job', icon:'🤖', title:'AI替代论', body:'聚会上一个做AI的人说：你们这个岗位三年内就会被AI替代。\n\n"不是吓你，我已经在做了。"',
      type:'neutral', effect: g => {
          if (g.intel > 70) {
              return {intel:5,mood:3}; // 聪明人觉得是学习机会
          }
          return {mood:-10};
      }, followUp:'你开始思考职业转型。' },
    { id:'rumor_lottery', icon:'🎰', title:'彩票玄学', body:'有人说他算出了双色球规律，推荐你买他选的号码。\n\n"我跟你说，这次一定中！"',
      type:'bad', effect: g => {
          if (Math.random() > 0.95) {
              return {money:50000,mood:30}; // 万一中了呢
          }
          return {money:-100,mood:-3};
      }, followUp:'你花了100块买了彩票，然后……' },
];

function generateRumor() {
    // 从谣言池中随机选一条（有冷却机制）
    if (!G.flags._rumorCooldown) G.flags._rumorCooldown = [];

    // 过滤：城市限制 + 冷却
    const available = RUMOR_POOL.filter(r => {
        if (r.cond && !r.cond(G)) return false;
        if (G.flags._rumorCooldown.includes(r.id)) return false;
        return true;
    });

    if (available.length === 0) {
        // 冷却池清空一半，让玩家能再次获得之前的谣言
        G.flags._rumorCooldown = G.flags._rumorCooldown.slice(0, Math.floor(G.flags._rumorCooldown.length / 2));
        return;
    }

    const rumor = available[Math.floor(Math.random() * available.length)];

    // 加入冷却
    G.flags._rumorCooldown.push(rumor.id);
    if (G.flags._rumorCooldown.length > 10) {
        G.flags._rumorCooldown = G.flags._rumorCooldown.slice(-8);
    }

    // 执行效果
    const delta = rumor.effect(G);

    // 处理 followUp 文本
    const followUp = typeof rumor.followUp === 'function' ? rumor.followUp(G) : rumor.followUp;

    // 构建事件卡片
    const typeMap = { good:'good', bad:'bad', risky:'neutral', neutral:'neutral', city:'neutral' };
    const typeLabel = { good:'💡 靠谱情报', bad:'⚠️ 来路不明', risky:'🎲 风险情报', neutral:'📢 道听途说', city:'🏙️ 本地消息' };

    addEventCard({
        icon: rumor.icon,
        title: rumor.title,
        body: rumor.body + '\n\n<div style="color:var(--text-muted);font-size:12px;margin-top:8px">[' + (typeLabel[rumor.type]||'📢 消息') + '] ' + followUp + '</div>',
        type: typeMap[rumor.type] || 'neutral'
    }, true);
}

// 处理谣言后续效果（在 advanceMonth 中调用）
function processRumorEffects() {
    // 股票情报兑现
    if (G.flags.rumorStockTip) {
        G.flags.rumorStockTip = false;
        if (G.flags.rumorStockReal) {
            G.flags.rumorStockReal = false;
            const gain = Math.floor(Math.random() * 8000) + 2000;
            G.money += gain;
            addEventCard({ icon:'📈', title:'股票涨了', body:`你听从了朋友的「内幕消息」，小赚了一笔。\n\n<div class="meme-quote" style="color:var(--accent)">— 韭菜也有翻身的一天 —</div>`, type:'good' }, true);
            return {money:gain, mood:10};
        } else {
            const loss = Math.floor(Math.random() * 5000) + 3000;
            G.money -= loss;
            addEventCard({ icon:'📉', title:'割了韭菜', body:`你信了那个「内幕消息」，结果被套了。\n\n<div class="meme-quote" style="color:var(--accent)">— 金融市场的学费，从不便宜 —</div>`, type:'bad' }, true);
            return {money:-loss, mood:-15};
        }
    }

    // 交易情报：让指定商品涨价
    if (G.flags.rumorTradeTip && G.flags.rumorHotGood && tradePrices[G.flags.rumorHotGood]) {
        const good = G.flags.rumorHotGood;
        tradePrices[good] = Math.floor(tradePrices[good] * 1.4); // 涨40%
        G.flags.rumorTradeTip = false;
        G.flags.rumorHotGood = null;
        // 不通知玩家，让他们自己发现价格变化
    }

    // 裁员预警：如果真的有裁员事件触发
    if (G.flags.rumorLayoff && G.job !== '待业中' && Math.random() > 0.7) {
        G.flags.rumorLayoff = false;
        G.flags.wasLaidOff = true;
        addEventCard({ icon:'💔', title:'裁员来了', body:`幸好你提前知道了消息，已经更新了简历。\n\nHR找你谈话的时候，你比同事淡定得多。\n\n<div class="meme-quote" style="color:var(--accent)">— 知道坏消息要来了，反而没那么慌 —</div>`, type:'neutral' }, true);
        return {mood:-5, intel:3};
    }
}

// === v9.0 城市移动系统 ===
function openCitySwitch() {
    const modal = document.getElementById('modal-city') || createCityModal();
    const content = modal.querySelector('.city-switch-content');
    if (!content) return;

    let html = '<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">💡 换城市需要搬家费（5000元），且会失去当前工作。不同城市有不同的机会和代价。</p>';
    html += '<div class="city-switch-grid">';

    for (const [key, city] of Object.entries(CITIES)) {
        const isCurrent = G.city === key;
        const moveCost = 5000;
        const canMove = !isCurrent && G.money >= moveCost;
        html += `
            <div class="city-switch-card ${isCurrent ? 'current' : ''}">
                <div class="city-switch-header">
                    <span class="city-switch-name">${city.name}</span>
                    ${isCurrent ? '<span class="city-current-badge">📍 当前</span>' : ''}
                </div>
                <div class="city-switch-info">
                    <span>🏠 房租: ¥${city.rent}/月</span>
                    <span>💸 物价: ${(city.cost * 100).toFixed(0)}%</span>
                    <span>🏘️ 房价: ${fmtMoney(city.house)}/㎡</span>
                </div>
                <div class="city-switch-trait">${city.meme}</div>
                ${isCurrent ? '' : `<button class="btn-small btn-move" ${canMove?'':'disabled'} onclick="switchCity('${key}')">搬去${city.name}（-${fmtMoney(moveCost)}）</button>`}
            </div>`;
    }
    html += '</div>';
    content.innerHTML = html;
    modal.classList.add('open');
}

function createCityModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-city';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('modal-city')"></div>
        <div class="modal-content modal-large">
            <button class="modal-close" onclick="closeModal('modal-city')" aria-label="关闭">×</button>
            <h2>🗺️ 换城市</h2>
            <div class="city-switch-content"></div>
        </div>`;
    document.body.appendChild(modal);
    return modal;
}

function switchCity(cityId) {
    const city = CITIES[cityId];
    if (!city || G.city === cityId) return;
    if (G.money < 5000) { notify('❌ 搬家费不足！'); return; }

    const oldCity = CITIES[G.city].name;
    G.money -= 5000;
    G.city = cityId;
    G.cityName = city.name;
    G.flags.citySwitch = true;

    // 换城市失去当前工作（除非是远程工作）
    if (G.job !== '待业中' && !G.flags.remoteWorker && !G.flags.freelancer) {
        setJob(G, '待业中', 0);
        addEventCard({
            icon: '🗺️',
            title: `搬到了${city.name}`,
            body: `你从${oldCity}搬到了${city.name}。\n\n搬家花了不少钱，工作也没了——你需要重新找工作。\n\n但你告诉自己：新的城市，新的开始。\n\n${city.meme}\n\n<div class="meme-quote" style="color:var(--accent)">— 重新开始 —</div>`,
            type: 'neutral'
        }, true);
    } else {
        addEventCard({
            icon: '🗺️',
            title: `搬到了${city.name}`,
            body: `你从${oldCity}搬到了${city.name}。\n\n${city.meme}\n\n<div class="meme-quote" style="color:var(--accent)">— 换个地方继续漂 —</div>`,
            type: 'neutral'
        }, true);
    }

    // 换城市对属性的影响
    G.mood = clamp(G.mood + 5, 0, 100); // 新鲜感
    G.social = clamp(G.social - 10, 0, 100); // 失去本地人脉

    // 清空背包中不能带走的货物（保留2件）
    const invKeys = Object.keys(G.inventory).filter(k => G.inventory[k] > 0);
    if (invKeys.length > 2) {
        const toRemove = invKeys.slice(2);
        toRemove.forEach(k => delete G.inventory[k]);
        notify('📦 搬家时丢弃了多余的货物');
    }

    updateTradePrices();
    updateHUD();
    closeModal('modal-city');
    notify(`✅ 已搬到${city.name}！`);
    playSound('chain');
}

// === v8.0 倒卖交易系统 ===
function openTradeMarket() {
    if (!tradePrices || Object.keys(tradePrices).length === 0) updateTradePrices();
    const modal = document.getElementById('modal-trade') || createTradeModal();
    const content = modal.querySelector('.trade-content');
    if (!content) return;

    const invCount = getInventoryCount();
    const city = CITIES[G.city];

    let goodsHtml = '';
    for (const [key, good] of Object.entries(TRADE_GOODS)) {
        const price = tradePrices[key] || good.basePrice;
        const owned = G.inventory[key] || 0;
        const canBuy = G.money >= price && invCount < MAX_INVENTORY;
        const canSell = owned > 0;
        // 价格趋势指示（对比基准价）
        const ratio = price / (good.basePrice * (good.cityMod[G.city] || 1.0));
        const trend = ratio > 1.3 ? '📈 高价' : ratio < 0.7 ? '📉 低价' : '➡️ 正常';
        const trendColor = ratio > 1.3 ? '#f87171' : ratio < 0.7 ? '#4ade80' : '#888';

        goodsHtml += `
            <div class="trade-item">
                <div class="trade-item-header">
                    <span class="trade-icon">${good.icon}</span>
                    <span class="trade-name">${good.name}</span>
                    <span class="trade-trend" style="color:${trendColor}">${trend}</span>
                </div>
                <div class="trade-item-body">
                    <span class="trade-price">💰 ${fmtMoney(price)}</span>
                    <span class="trade-owned">📦 持有: ${owned}</span>
                </div>
                <div class="trade-item-actions">
                    <button class="btn-small btn-buy" ${canBuy?'':`disabled`} onclick="buyGoods('${key}')">买入</button>
                    <button class="btn-small btn-sell" ${canSell?'':`disabled`} onclick="sellGoods('${key}')">卖出</button>
                </div>
            </div>`;
    }

    content.innerHTML = `
        <div class="trade-header">
            <h3>🏪 ${city.name}地下市场</h3>
            <p class="trade-hint">背包: ${invCount}/${MAX_INVENTORY} | 资金: ${fmtMoney(G.money)}</p>
            <p class="trade-tip" style="color:var(--text-muted);font-size:12px">💡 提示：低价买入、高价卖出。不同城市价格不同！价格每月刷新。</p>
        </div>
        <div class="trade-grid">${goodsHtml}</div>
    `;
    modal.classList.add('open');
}

function buyGoods(key) {
    const price = tradePrices[key];
    if (!price || G.money < price || getInventoryCount() >= MAX_INVENTORY) {
        notify('❌ 资金不足或背包已满！'); return;
    }
    G.money -= price;
    G.inventory[key] = (G.inventory[key] || 0) + 1;
    G.flags.tradeFirstBuy = true; // v8.0: 追踪成就
    playSound('money');
    notify(`✅ 买入 ${TRADE_GOODS[key].name}（${fmtMoney(price)}）`);
    updateHUD();
    checkAchievements();
    openTradeMarket(); // 刷新
}

function sellGoods(key) {
    if (!G.inventory[key] || G.inventory[key] <= 0) {
        notify('❌ 你没有这个商品！'); return;
    }
    const rawPrice = tradePrices[key];
    // v8.1: 策划团队平衡 - 10%手续费，防止无脑倒卖暴利
    const fee = Math.floor(rawPrice * 0.10);
    const price = rawPrice - fee;
    G.money += price;
    G.inventory[key]--;
    if (G.inventory[key] <= 0) delete G.inventory[key];
    G.flags.tradeProfit = true; // v8.0: 追踪成就
    playSound('money');
    notify(`💰 卖出 ${TRADE_GOODS[key].name}（+${fmtMoney(price)}，手续费${fmtMoney(fee)}）`);
    updateHUD();
    checkAchievements();
    openTradeMarket(); // 刷新
}

function createTradeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-trade';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('modal-trade')"></div>
        <div class="modal-content modal-large">
            <button class="modal-close" onclick="closeModal('modal-trade')" aria-label="关闭">×</button>
            <h2>🏪 地下市场</h2>
            <div class="trade-content"></div>
            <button class="btn btn-secondary" onclick="closeModal('modal-trade')" style="margin-top:16px">关闭</button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
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
    // 事件收集追踪
    if (data.id) {
        if (!G.flags._seenEvents) G.flags._seenEvents = [];
        if (!G.flags._seenEvents.includes(data.id)) {
            G.flags._seenEvents.push(data.id);
        }
    }
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
    const saveData = { ...G, savedAt: Date.now(), version: '10.2' };
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
            case 't':
            case 'T':
                e.preventDefault();
                openTradeMarket();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                openCitySwitch();
                break;
            case 'i':
            case 'I':
                e.preventDefault();
                openInvestMarket();
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
    const ending = ENDINGS.find(e => e.title.includes(t));
    const rarity = getEndingRarity(ending?.id || 'default');
    const rarityEmoji = { common: '⚪', uncommon: '🟢', rare: '🔵', legendary: '🟡' }[rarity];
    const rarityLabel = { common: '普通', uncommon: '罕见', rare: '稀有', legendary: '传说' }[rarity];
    const topStat = getTopStat();
    const achievementCount = G.achievements.length;

    // 生成人生标签
    const tags = [];
    if (G.flags.hasPet) tags.push('🐱 铲屎官');
    if (G.flags.hasGymCard) tags.push('💪 健身达人');
    if (G.flags.citySwitch) tags.push('🗺️ 城市候鸟');
    if (G.flags.entrepreneur) tags.push('🚀 创业者');
    if (G.flags.influencer) tags.push('📱 博主');
    if (G.flags.hasSubsidy) tags.push('📋 薅羊毛专家');
    if (G.flags.cheapRent) tags.push('🏠 公租房住户');
    if (G.flags.remoteWorker) tags.push('💻 远程工作者');
    if (G.money > 1000000) tags.push('💰 百万富翁');
    if (G.money < -50000) tags.push('💸 负债累累');
    if (G.intel > 80) tags.push('🧠 知识分子');
    if (G.charm > 80) tags.push('✨ 万人迷');
    if (G.health > 80) tags.push('❤️ 健康达人');
    if (G.mood < 20) tags.push('😔 疲惫打工人');
    if (G.flags.regretCount > 10) tags.push('🫠 算了大王');
    if (G.flags.hasChild) tags.push('👶 奶爸/奶妈');
    if (G.flags.dink) tags.push('🍷 丁克族');
    if (G.flags.hasDazi) tags.push('🤝 搭子达人');
    if (G.flags.hasMBTI) tags.push('🧩 MBTI信徒');
    if (G.flags.nightCycling) tags.push('🚴 夜骑侠');
    if (G.flags.webNovelist) tags.push('✍️ 网文作者');
    if (G.flags.wasLaidOff) tags.push('📦 被裁老兵');
    if (G.flags.digitalDetox) tags.push('📵 数字极简');
    if (G.flags.sawTherapist) tags.push('🧠 心理勇者');
    if (G.flags.cutRelatives) tags.push('✂️ 断亲勇士');
    if (G.flags.promoted) tags.push('📈 管理层');
    if (G.flags.workLifeBalance) tags.push('⚖️ 生活平衡师');
    if (tags.length === 0) tags.push('🏙️ 普通打工人');

    const tagLine = tags.slice(0, 4).join(' ');

    // 生成人生金句
    const quotes = [
        '生活不是等待暴风雨过去，而是学会在雨中跳舞。',
        '在大城市里，活着本身就是一种胜利。',
        '每一个漂泊的人，都是自己故事的主角。',
        '你的人生，没有标准答案。',
        '大城市容不下肉身，小城市放不下灵魂。',
        '所谓成功，就是用自己喜欢的方式过一生。',
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const text = `🏙️ 都市浮生记 · 人生结局

${rarityEmoji} 「${t}」[${rarityLabel}]

👤 ${G.name}，${G.age}岁
📍 ${G.cityName}
⏱️ 漂泊了${Math.floor(G.months/12)}年${G.months%12}个月

📊 人生数据
💰 最终资产：${fmtMoney(G.money)}
🎯 做出选择：${G.choices}次
🏆 解锁成就：${achievementCount}个
📈 最强属性：${topStat}
📖 经历事件：${(G.flags._seenEvents||[]).length}个

🏷️ 人生标签：${tagLine}

💬 "${quote}"

——
来试试你能打出什么结局？
#都市浮生记 #人生模拟器`;

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
