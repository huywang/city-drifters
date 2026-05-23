// ============================================
// 都市浮生记 - Game Engine v34.4
// ============================================


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
    // v26.0: 渲染座右铭选择器
    renderMottoGrid();
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
        // v26.0: 人生座右铭
        motto: selectedMotto,
    });

    // v26.0: 应用座右铭初始加成
    if (selectedMotto) {
        const mottoData = LIFE_MOTTOS.find(m => m.id === selectedMotto);
        if (mottoData && mottoData.bonus) {
            if (mottoData.bonus.intel) G.intel = clamp(G.intel + mottoData.bonus.intel, 0, 100);
            if (mottoData.bonus.charm) G.charm = clamp(G.charm + mottoData.bonus.charm, 0, 100);
            if (mottoData.bonus.mood) G.mood = clamp(G.mood + mottoData.bonus.mood, 0, 100);
            if (mottoData.bonus.health) G.health = clamp(G.health + mottoData.bonus.health, 0, 100);
            if (mottoData.bonus.social) G.social = clamp(G.social + mottoData.bonus.social, 0, 100);
            if (mottoData.bonus.money) G.money += mottoData.bonus.money;
        }
    }

    showScreen('screen-game');
    updateHUD();
    updateTradePrices(); // v8.0: 初始化交易价格

    const log = document.getElementById('event-log');
    log.innerHTML = '';

    const diffEmoji = diff.emoji;
    const mottoText = selectedMotto ? LIFE_MOTTOS.find(m => m.id === selectedMotto)?.text : '';
    addEventCard({ icon: '🚀', title: `${bg.name} · 来到${city.name}`, body: bg.intro + `\n\n<div class="meme-quote">${city.meme}</div>`, type: 'milestone' }, false);
    addEventCard({ icon: '📍', title: `新起点 ${diffEmoji} ${diff.label}`, body: `你来到了${city.name}——"${city.trait}"。\n\n房租：${fmtMoney(city.rent)}/月\n生活成本：${city.cost>1.1?'较高':city.cost>1.0?'适中':'还行'}\n难度：${diff.label}${legacy.points>0?`\n传承加成：+${legacyBonus}点`:''}${mottoText?`\n座右铭：「${mottoText}」`:''}\n\n每个伟大的故事都从一间出租屋开始。`, type: 'special' }, false);

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

    // v27.0: 每月更新城市声望
    updateReputation();

    // v19.0: 人生反思系统 - 在里程碑年龄触发回顾事件
    if (G.month === 1 && [30,35,40,45,50].includes(G.age) && !G.flags['reflection_'+G.age]) {
        G.flags['reflection_'+G.age] = true;
        const milestones = [];
        if (G.flags.hasHouse) milestones.push('在大城市买了房');
        if (G.flags.married) milestones.push('组建了家庭');
        if (G.flags.hasChild) milestones.push('有了孩子');
        if (G.flags.entrepreneur) milestones.push('创过业');
        if (G.flags.civilServant) milestones.push('考了公务员');
        if (G.money > 200000) milestones.push('攒下了积蓄');
        if (G.achievements.length > 20) milestones.push('收获了很多人生体验');
        const summary = milestones.length > 0
            ? '你回顾了自己的人生：' + milestones.join('、') + '。\n\n也许不是完美的，但这是你的人生。'
            : '你回顾了过去的人生，似乎没有做出什么特别的选择。但你还在路上。';
        G.eventLog.push({ age: G.age, text: `${G.age}岁生日：${summary}` });
        G.mood = clamp(G.mood + (milestones.length >= 3 ? 10 : 5), 0, 100);
    }

    // v22.0: 人生转折系统 - 在关键年龄触发重大抉择
    if (G.month === 1 && [25,28,30,35,40,50].includes(G.age) && !G.flags['turning_point_'+G.age]) {
        G.flags['turning_point_'+G.age] = true;
        const turningPoints = {
            25: { title:'四分之一危机', body:'你25岁了。毕业三年，你开始问自己：这条路对吗？\n\n你的同学有的已经买房，有的已经结婚，有的已经升职。而你——\n\n你站在人生的十字路口。你知道：接下来的选择，会决定你30岁的样子。',
              choices:[
                { label:'决定拼一把——用3年时间全力冲刺事业', fn: g => { g.flags.careerSprint=true; g.intel = clamp(g.intel+10,0,100); g.mood = clamp(g.mood-5,0,100); }},
                { label:'决定换个活法——工作不是全部，要有生活', fn: g => { g.flags.lifeBalance=true; g.mood = clamp(g.mood+10,0,100); g.health = clamp(g.health+5,0,100); }},
                { label:'决定继续探索——还年轻，不急着定型', fn: g => { g.flags.keepExploring=true; g.charm = clamp(g.charm+5,0,100); g.social = clamp(g.social+5,0,100); }},
              ]},
            28: { title:'三十而立倒计时', body:'你28岁了。距离「三十而立」还有两年。\n\n你妈打电话来：「隔壁小王都生二胎了。」\n你爸叹气：「我们单位老李的儿子，去年在深圳买了房。」\n\n你挂了电话，看着窗外。你问自己：我到底想要什么？\n\n是世俗意义上的「成功」——还是自己定义的「幸福」？',
              choices:[
                { label:'选择了自己的定义——不被别人的标准绑架', fn: g => { g.flags.ownDefinition=true; g.mood = clamp(g.mood+15,0,100); g.intel = clamp(g.intel+5,0,100); }},
                { label:'开始认真规划——买房、存钱、升职', fn: g => { g.flags.seriousPlanning=true; g.money += 10000; g.intel = clamp(g.intel+5,0,100); }},
                { label:'焦虑了——但焦虑过后还是老样子', fn: g => { g.mood = clamp(g.mood-10,0,100); }},
              ]},
            30: { title:'三十而已', body:'你30岁了。\n\n朋友圈里，有人发了生日感言：「30岁，人生下半场开始。」\n\n你想了想自己这30年：\n- 来了大城市\n- 换了几份工作\n- 认识了一些人，也失去了一些人\n- 哭过、笑过、迷茫过\n\n你没有成为小时候想成为的人——但你成为了一个真实的自己。\n\n30岁不是终点——是另一个起点。',
              choices:[
                { label:'做了一个大胆的决定——创业/转行/离开', fn: g => { g.flags.boldThirty=true; g.flags.careerTransition=true; g.charm = clamp(g.charm+10,0,100); g.money -= 20000; }},
                { label:'接受了现在的生活——平凡也有力量', fn: g => { g.flags.acceptOrdinary=true; g.mood = clamp(g.mood+15,0,100); g.health = clamp(g.health+5,0,100); }},
                { label:'给自己一个承诺——30岁后不再将就', fn: g => { g.flags.noCompromise=true; g.intel = clamp(g.intel+8,0,100); g.charm = clamp(g.charm+5,0,100); }},
              ]},
            35: { title:'三十五岁现象', body:'你35岁了。\n\n你听说了太多关于「35岁危机」的故事：被裁、被嫌弃、被认为「太老了」。\n\n你打开招聘网站——很多岗位要求「35岁以下」。\n\n你照了照镜子。你并不老。但社会告诉你：你已经「不年轻」了。\n\n这是你的35岁——不是危机的年龄，是觉醒的年龄。\n\n你开始思考：什么才是真正属于你的东西？不是工作给你的，不是社会给你的——是你自己的。',
              choices:[
                { label:'开始打造自己的「不可替代性」', fn: g => { g.flags.irreplaceable=true; g.intel = clamp(g.intel+12,0,100); g.charm = clamp(g.charm+5,0,100); }},
                { label:'开始做减法——不再追求所有东西', fn: g => { g.flags.doLess=true; g.mood = clamp(g.mood+12,0,100); g.health = clamp(g.health+8,0,100); }},
                { label:'焦虑了一段时间，然后想通了', fn: g => { g.mood = clamp(g.mood-5,0,100); g.intel = clamp(g.intel+8,0,100); }},
              ]},
            40: { title:'不惑之年', body:'你40岁了。\n\n孔子说：「四十而不惑。」\n\n你不惑了吗？也许吧。你不再为别人的评价失眠，不再为得不到的东西焦虑。\n\n你开始理解一些以前觉得「鸡汤」的话：\n- 健康是最大的财富\n- 时间是最稀缺的资源\n- 家人是最重要的\n\n你的身体开始给你发信号：腰酸了、头发白了、爬楼喘了。\n\n你知道：人生下半场，拼的不是谁跑得快——是谁活得久。',
              choices:[
                { label:'开始认真对待健康——运动、饮食、作息', fn: g => { g.flags.healthFirst=true; g.health = clamp(g.health+15,0,100); g.mood = clamp(g.mood+5,0,100); }},
                { label:'开始重新审视人生——写下想做的事', fn: g => { g.flags.lifeReview=true; g.intel = clamp(g.intel+10,0,100); g.mood = clamp(g.mood+8,0,100); }},
                { label:'感慨了很多，然后继续原来的生活', fn: g => { g.mood = clamp(g.mood+3,0,100); }},
              ]},
            50: { title:'知天命', body:'你50岁了。\n\n孔子说：「五十而知天命。」\n\n你知道自己能做什么、不能做什么了。你不再和命运较劲——而是和命运和解。\n\n你开始回忆过去：\n- 22岁来到这座城市\n- 经历了那么多风风雨雨\n- 有遗憾，但没有后悔\n\n你的父母老了。你的孩子长大了（如果有的话）。你——也开始变老了。\n\n但变老不是变弱。是你终于有了足够的经验，去理解生活到底是什么。',
              choices:[
                { label:'开始写回忆录——留下你的人生故事', fn: g => { g.flags.memoir=true; g.intel = clamp(g.intel+10,0,100); g.mood = clamp(g.mood+10,0,100); }},
                { label:'开始享受当下——做以前一直想做但没做的事', fn: g => { g.flags.enjoyNow=true; g.mood = clamp(g.mood+15,0,100); g.charm = clamp(g.charm+5,0,100); }},
                { label:'把经验传给年轻人——做导师和志愿者', fn: g => { g.flags.mentor=true; g.social = clamp(g.social+10,0,100); g.mood = clamp(g.mood+8,0,100); }},
              ]},
        };
        const tp = turningPoints[G.age];
        if (tp) {
            G.eventLog.push({ age: G.age, text: `【人生转折】${tp.title}` });
            const choiceIdx = Math.floor(Math.random() * tp.choices.length);
            const choice = tp.choices[choiceIdx];
            choice.fn(G);
            G.eventLog.push({ age: G.age, text: `你做出了选择：${choice.label}` });
        }
    }

    // v23.0: 性格特质系统 - 根据玩家行为累积特质，影响后续事件
    if (!G.traits) G.traits = {};
    if (G.month === 1 && !G.flags['trait_check_'+G.age]) {
        G.flags['trait_check_'+G.age] = true;
        // 冒险者特质：频繁换工作/创业/旅居
        if (!G.traits.adventurer && (G.flags.entrepreneur || G.flags.nomadLife || G.flags.boldThirty || G.flags.careerTransition)) {
            G.traits.adventurer = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你发现自己是一个天生的冒险者——你不害怕未知，你害怕的是一成不变。' });
            G.charm = clamp(G.charm + 5, 0, 100);
        }
        // 理性派特质：高智力/投资理财/规划
        if (!G.traits.rational && G.intel >= 60 && (G.flags.emotionalConsumption || G.flags.creatorEconomy || G.flags.seriousPlanning)) {
            G.traits.rational = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你成为了一个理性派——你习惯用数据和逻辑来做决定。' });
            G.intel = clamp(G.intel + 5, 0, 100);
        }
        // 感性派特质：高心情/艺术爱好/情感丰富
        if (!G.traits.emotional && (G.flags.catCafe || G.flags.collectionDisplay || G.flags.guziFan || G.flags.animeFan)) {
            G.traits.emotional = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你是一个感性的人——你用心感受世界，而不是用脑分析它。' });
            G.mood = clamp(G.mood + 8, 0, 100);
        }
        // 社交达人特质：高社交/搭子/社区
        if (!G.traits.socialite && G.social >= 55 && (G.flags.mealBuddyWang || G.flags.toyCommunity || G.flags.coWorkNetwork)) {
            G.traits.socialite = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你是一个社交达人——你在人群中如鱼得水，独处时反而不自在。' });
            G.social = clamp(G.social + 5, 0, 100);
        }
        // 独行侠特质：低社交/独处/自由职业
        if (!G.traits.loner && G.social < 40 && (G.flags.soloLifeJoy || G.flags.freelancer || G.flags.digitalDetoxV3)) {
            G.traits.loner = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你是一个独行侠——你不需要别人的认可来证明自己的价值。' });
            G.health = clamp(G.health + 5, 0, 100);
        }
        // 务实主义特质：买房/存钱/考公
        if (!G.traits.pragmatist && (G.flags.hasHouse || G.flags.civilServant || (G.money > 100000 && G.flags.seriousPlanning))) {
            G.traits.pragmatist = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你是一个务实主义者——你相信脚踏实地比空想更靠谱。' });
            G.money += 2000;
        }
        // 理想主义特质：创作者/自媒体/追梦
        if (!G.traits.idealist && (G.flags.createdShortVideo || G.flags.indieGameDev || G.flags.doujinCreate || G.flags.memoir)) {
            G.traits.idealist = true;
            G.eventLog.push({ age: G.age, text: '【特质觉醒】你是一个理想主义者——你相信生活不止眼前的苟且，还有诗和远方。' });
            G.mood = clamp(G.mood + 5, 0, 100);
            G.charm = clamp(G.charm + 5, 0, 100);
        }
    }

    // v25.0: 人生阶段系统 - 根据年龄阶段应用属性修正
    if (G.month === 1) {
        applyLifeStageModifiers();
    }

    // v20.0: 时代浪潮系统 - 根据年龄/年份激活时代背景效果
    if (!G.flags._eraSystemInit) {
        G.flags._eraSystemInit = true;
        G.eraWaves = [];
    }
    // 每个时代浪潮有：id, label, cond(激活条件), effect(月度效果), eventChance(触发专属事件概率)
    const ERA_WAVES = [
        { id:'ai_era', label:'AI浪潮', cond: g => g.age >= 18 && !g.flags['era_ai_era'],
          onActivate: g => { g.flags['era_ai_era']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】AI浪潮席卷而来——ChatGPT、DeepSeek、大模型……每个人都在谈论AI。'}); },
          monthlyEffect: g => { if(g.job==='待业中' && Math.random()<0.03) g.flags.aiJobOpportunity=true; } },
        { id:'economic_slowdown', label:'经济寒冬', cond: g => g.age >= 20 && g.months >= 24 && !g.flags['era_economic_slowdown'],
          onActivate: g => { g.flags['era_economic_slowdown']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】经济寒冬——裁员、降薪、倒闭……你感受到了大环境的寒意。'}); },
          monthlyEffect: g => { if(Math.random()<0.02 && g.job!=='待业中') { g.mood = clamp(g.mood-2,0,100); } } },
        { id:'silver_tsunami', label:'银发浪潮', cond: g => g.age >= 40 && !g.flags['era_silver_tsunami'],
          onActivate: g => { g.flags['era_silver_tsunami']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】银发浪潮——中国进入深度老龄化，养老、医疗、延迟退休成为社会焦点。'}); },
          monthlyEffect: g => { if(g.age>=50) g.health = clamp(g.health+0.5,0,100); } },
        { id:'birth_decline', label:'少子化时代', cond: g => g.age >= 22 && g.age <= 45 && !g.flags['era_birth_decline'],
          onActivate: g => { g.flags['era_birth_decline']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】少子化时代——幼儿园关停、学区房降温、「生不起养不起」成为年轻人的共识。'}); },
          monthlyEffect: g => { if(g.flags.hasChild && Math.random()<0.02) g.mood = clamp(g.mood+2,0,100); } },
        { id:'digital_rmb_era', label:'数字人民币', cond: g => g.age >= 18 && g.months >= 36 && !g.flags['era_digital_rmb'],
          onActivate: g => { g.flags['era_digital_rmb']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】数字人民币时代——现金越来越少见，连路边摊都用数字人民币。'}); },
          monthlyEffect: g => { } },
        { id:'going_global', label:'出海热潮', cond: g => g.age >= 22 && g.intel >= 50 && !g.flags['era_going_global'],
          onActivate: g => { g.flags['era_going_global']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】出海热潮——TikTok、SHEIN、Temu……中国企业正在征服世界。身边越来越多人在讨论「出海」。'}); },
          monthlyEffect: g => { if(g.flags.entrepreneur && Math.random()<0.03) g.money += 3000; } },
        { id:'domestic_tech', label:'国产替代', cond: g => g.age >= 20 && !g.flags['era_domestic_tech'],
          onActivate: g => { g.flags['era_domestic_tech']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】国产替代——华为、鸿蒙、国产芯片……「自主可控」成了科技圈的关键词。'}); },
          monthlyEffect: g => { } },
        { id:'micro_drama_boom', label:'微短剧爆发', cond: g => g.age >= 18 && g.age <= 50 && !g.flags['era_micro_drama'],
          onActivate: g => { g.flags['era_micro_drama']=true; g.eventLog.push({age:g.age, text:'【时代浪潮】微短剧爆发——3分钟一集、爽点密集、充值上头。你发现身边所有人都在刷短剧。'}); },
          monthlyEffect: g => { if(Math.random()<0.02) g.mood = clamp(g.mood-1,0,100); } },
    ];
    // 检查并激活时代浪潮
    for (const wave of ERA_WAVES) {
        if (wave.cond(G)) {
            wave.onActivate(G);
            G.eraWaves.push(wave.id);
        }
    }
    // 应用已激活浪潮的月度效果
    for (const wave of ERA_WAVES) {
        if (G.eraWaves && G.eraWaves.includes(wave.id)) {
            wave.monthlyEffect(G);
        }
    }

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
    // v25.0: 季节事件系统 - 有概率触发季节专属事件
    const seasonEvent = getSeasonEvent();
    if (seasonEvent) return seasonEvent;

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
// v21.0: 人生评分系统
function calculateLifeScore() {
    const details = [];
    // 财富分 (0-20)
    const wealthScore = G.money >= 500000 ? 20 : G.money >= 200000 ? 16 : G.money >= 100000 ? 12 : G.money >= 50000 ? 8 : G.money >= 0 ? 4 : 0;
    details.push({label:'财富', score:wealthScore});
    // 健康分 (0-20)
    const healthScore = Math.floor(G.health / 5);
    details.push({label:'健康', score:healthScore});
    // 幸福分 (0-20)
    const moodScore = Math.floor(G.mood / 5);
    details.push({label:'幸福', score:moodScore});
    // 成长分 (0-20)
    const growthScore = Math.min(20, Math.floor(G.intel/5) + Math.floor(G.achievements.length/20) + (G.flags.careerTransition?3:0) + (G.flags.personalGrowth?3:0));
    details.push({label:'成长', score:growthScore});
    // 关系分 (0-20)
    const relScore = Math.min(20, Math.floor(G.social/5) + (G.flags.married?3:0) + (G.flags.hasChild?2:0) + (G.flags.healedFamily?3:0) + (G.flags.closeToParents?2:0) + (G.flags.bestRoommate?2:0));
    details.push({label:'关系', score:relScore});
    const totalScore = wealthScore + healthScore + moodScore + growthScore + relScore;
    return { score: totalScore, details };
}

// v24.0: 人生关键词系统 - 根据玩家行为生成人生关键词
function generateLifeKeywords() {
    const keywords = [];
    // 基于性格特质
    if (G.traits) {
        if (G.traits.adventurer) keywords.push('冒险者');
        if (G.traits.rational) keywords.push('理性派');
        if (G.traits.emotional) keywords.push('感性灵魂');
        if (G.traits.socialite) keywords.push('社交蝴蝶');
        if (G.traits.loner) keywords.push('独行侠');
        if (G.traits.pragmatist) keywords.push('务实主义');
        if (G.traits.idealist) keywords.push('理想主义');
    }
    // 基于人生经历
    if (G.flags.entrepreneur) keywords.push('创业者');
    if (G.flags.civilServant) keywords.push('体制内');
    if (G.flags.freelanceStable) keywords.push('自由人');
    if (G.flags.married) keywords.push('已婚');
    if (G.flags.hasChild) keywords.push('父母');
    if (G.flags.leftBigCity) keywords.push('逃离者');
    if (G.flags.culturalConfidence) keywords.push('文化自觉');
    if (G.flags.ecoInfluencer) keywords.push('环保先锋');
    if (G.flags.midlifeStartup) keywords.push('中年创业');
    if (G.flags.reinventionStory) keywords.push('涅槃重生');
    if (G.flags.personalBrand) keywords.push('个人品牌');
    if (G.flags.innerPeace) keywords.push('内心安定');
    if (G.flags.agingGrace) keywords.push('优雅老去');
    // 基于属性
    if (G.money >= 200000) keywords.push('财务自由');
    if (G.health >= 70) keywords.push('健康达人');
    if (G.intel >= 70) keywords.push('终身学习');
    if (G.social >= 70) keywords.push('人脉广泛');
    if (G.charm >= 70) keywords.push('魅力四射');
    // 基于结局倾向
    if (G.mood >= 60) keywords.push('幸福');
    else if (G.mood < 30) keywords.push('挣扎');
    // 限制在7个关键词以内，优先选择更有意义的
    const priority = ['冒险者','创业者','涅槃重生','内心安定','文化自觉','自由人','逃离者','环保先锋','优雅老去','财务自由','终身学习','个人品牌','中年创业','务实主义','理想主义','社交蝴蝶','独行侠','理性派','感性灵魂','冒险者','已婚','父母','健康达人','魅力四射','人脉广泛','幸福','挣扎','体制内'];
    const sorted = priority.filter(k => keywords.includes(k)).slice(0, 7);
    // 如果不够7个，补充通用词
    if (sorted.length < 3) {
        if (G.achievements.length > 30) sorted.push('人生赢家');
        if (G.city) sorted.push(G.city + '人');
        if (G.age >= 50) sorted.push('岁月如歌');
        if (G.flags.memoir) sorted.push('记录者');
    }
    return sorted.slice(0, 7);
}

// v24.0: 人生时间线 - 获取关键人生事件的时间线
function getLifeTimeline() {
    const timeline = [];
    // 从事件日志中提取关键事件
    if (G.eventLog) {
        G.eventLog.forEach(e => {
            if (e.text && (e.text.includes('【') || e.text.includes('转折') || e.text.includes('特质'))) {
                timeline.push({ age: e.age, text: e.text });
            }
        });
    }
    // 添加关键里程碑
    if (G.flags.married) timeline.push({ age: G.flags._marriageAge || 30, text: '💒 结婚了' });
    if (G.flags.hasChild) timeline.push({ age: G.flags._childAge || 32, text: '👶 有了孩子' });
    if (G.flags.hasHouse) timeline.push({ age: G.flags._houseAge || 28, text: '🏡 买了房' });
    if (G.flags.entrepreneur) timeline.push({ age: 30, text: '🚀 开始创业' });
    // 按年龄排序
    timeline.sort((a, b) => a.age - b.age);
    return timeline.slice(0, 15); // 最多显示15个关键事件
}

// v26.0: 人生一句话总结
function generateLifeSummary() {
    const g = G;
    const parts = [];

    // 判断主人生主题
    const themes = [];
    if (g.money >= 500000) themes.push('wealth');
    else if (g.money >= 100000) themes.push('stable');
    else if (g.money <= -50000) themes.push('debt');

    if (g.mood >= 70) themes.push('happy');
    else if (g.mood <= 30) themes.push('sad');

    if (g.health >= 70) themes.push('healthy');
    else if (g.health <= 30) themes.push('sick');

    if (g.intel >= 60) themes.push('wise');
    if (g.social >= 60) themes.push('social');
    if (g.charm >= 60) themes.push('charming');

    if (g.flags.married) themes.push('married');
    if (g.flags.hasChild) themes.push('parent');
    if (g.flags.entrepreneur) themes.push('entrepreneur');
    if (g.flags.hasHouse) themes.push('homeowner');
    if (g.achievements && g.achievements.length >= 20) themes.push('achiever');

    // 开头：人生定义
    let opening = '';
    if (themes.includes('wealth') && themes.includes('happy')) opening = '你活成了人生赢家';
    else if (themes.includes('wealth') && themes.includes('sad')) opening = '你拥有了财富，却失去了快乐';
    else if (themes.includes('debt') && themes.includes('sad')) opening = '你的人生是一场漫长的下坠';
    else if (themes.includes('debt') && themes.includes('happy')) opening = '你一无所有，却活得很快乐';
    else if (themes.includes('happy') && themes.includes('stable')) opening = '你过了平凡但幸福的一生';
    else if (themes.includes('wise')) opening = '你成了一个通透的人';
    else if (themes.includes('entrepreneur')) opening = '你选择了冒险的人生';
    else if (themes.includes('social')) opening = '你活在人群里';
    else if (themes.includes('charming')) opening = '你活成了别人眼中的光';
    else if (themes.includes('healthy') && themes.includes('happy')) opening = '你活出了健康与快乐';
    else if (themes.includes('sick')) opening = '你的身体早早发出了警报';
    else if (themes.includes('achiever')) opening = '你的人生收获满满';
    else opening = '你过了平凡的一生';

    // 中段：关键转折
    let middle = '';
    const keyMoments = [];
    if (g.flags.married) keyMoments.push('找到了相伴一生的人');
    if (g.flags.hasChild) keyMoments.push('成为了父母');
    if (g.flags.entrepreneur) keyMoments.push('赌上了一切去创业');
    if (g.flags.hasHouse) keyMoments.push('在大城市安了家');
    if (g.flags.retired) keyMoments.push('终于退出了职场');
    if (g.flags.movedCities) keyMoments.push('换过城市重新开始');

    if (keyMoments.length > 0) {
        middle = '——' + keyMoments.slice(0, 3).join('，') + '。';
    } else {
        middle = '。';
    }

    // 结尾：座右铭呼应或反思
    let ending = '';
    const mottoData = g.motto ? LIFE_MOTTOS.find(m => m.id === g.motto) : null;
    if (mottoData) {
        // 根据实际人生和座右铭的契合度生成
        const mottoText = mottoData.text;
        if (mottoText === '我要出人头地' && themes.includes('wealth')) ending = `你兑现了当初的座右铭：「${mottoText}」。`;
        else if (mottoText === '我要出人头地' && !themes.includes('wealth')) ending = `你没能兑现座右铭：「${mottoText}」——但你学到了更多。`;
        else if (mottoText === '知足常乐' && themes.includes('happy')) ending = `你活成了座右铭：「${mottoText}」。`;
        else if (mottoText === '搞钱要紧' && themes.includes('wealth')) ending = `座右铭「${mottoText}」——你真的做到了。`;
        else if (mottoText === '自由最重要' && themes.includes('happy')) ending = `你用一生践行了：「${mottoText}」。`;
        else if (mottoText === '及时行乐' && themes.includes('sad')) ending = `你奉行「${mottoText}」——但快乐没有持续到最后。`;
        else if (mottoText === '知识改变命运' && themes.includes('wise')) ending = `「${mottoText}」——你真的被知识改变了。`;
        else if (mottoText === '健康第一' && themes.includes('healthy')) ending = `「${mottoText}」——你守护住了最重要的东西。`;
        else if (mottoText === '不走寻常路' && themes.includes('entrepreneur')) ending = `「${mottoText}」——你真的走了一条没人走过的路。`;
        else ending = `你的座右铭是：「${mottoText}」——你努力活出了它的样子。`;
    } else {
        const reflections = [
            '回头看——每一步都算数。',
            '你不确定这是不是最好的人生——但它是你的。',
            '有些遗憾，但也有些骄傲。',
            '你终于明白了：人生没有标准答案。',
            '大城市没有给你答案——但给了你寻找的机会。',
            '你带着故事离开——这就够了。',
        ];
        ending = reflections[Math.floor(Math.random() * reflections.length)];
    }

    return opening + middle + ending;
}

// v27.0: 城市声望系统 - 根据玩家行为计算城市中的声望
function updateReputation() {
    const g = G;
    const rep = g.reputation;
    // 职业声望：基于工资、工作年限、职位
    rep.career = Math.min(100, Math.max(0,
        Math.floor(g.jobSalary / 500) +
        (g.flags.civilServant ? 20 : 0) +
        (g.flags.entrepreneur ? 15 : 0) +
        (g.flags.promoted ? 10 : 0) +
        (g.months >= 60 ? 10 : g.months >= 24 ? 5 : 0)
    ));
    // 社会声望：基于社交属性、志愿活动、社区参与
    rep.social = Math.min(100, Math.max(0,
        Math.floor(g.social / 2) +
        (g.flags.longTermVolunteer ? 15 : 0) +
        (g.flags.animalVolunteer ? 10 : 0) +
        (g.flags.neighborOrganizer ? 10 : 0) +
        (g.flags.patientAdvocate ? 8 : 0)
    ));
    // 文化声望：基于智力属性、文化活动、教育背景
    rep.culture = Math.min(100, Math.max(0,
        Math.floor(g.intel / 2) +
        (g.flags.heritageLover ? 10 : 0) +
        (g.flags.photoArtist ? 8 : 0) +
        (g.flags.bookstoreRegular ? 8 : 0) +
        (g.flags.gradSchool ? 10 : 0) +
        (g.flags.culturalHeritage ? 5 : 0)
    ));
    // 经济声望：基于财富积累
    rep.economy = Math.min(100, Math.max(0,
        g.money >= 1000000 ? 80 :
        g.money >= 500000 ? 60 :
        g.money >= 200000 ? 45 :
        g.money >= 100000 ? 30 :
        g.money >= 50000 ? 20 :
        g.money >= 0 ? 10 : 0
    ));
    // 运气值：基于随机事件和选择（保持50为基准，波动）
    // luck值主要由事件修改，这里只做自然衰减回均值
    if (rep.luck > 55) rep.luck -= 1;
    else if (rep.luck < 45) rep.luck += 1;
}

// v27.0: 获取声望等级描述
function getReputationLevel(score) {
    if (score >= 80) return { level: '传奇', icon: '👑', color: '#ffd700' };
    if (score >= 60) return { level: '知名', icon: '⭐', color: '#a78bfa' };
    if (score >= 40) return { level: '普通', icon: '📍', color: '#60a5fa' };
    if (score >= 20) return { level: '无名', icon: '👤', color: '#94a3b8' };
    return { level: '隐形', icon: '👻', color: '#64748b' };
}

// v27.0: 获取综合声望
function getTotalReputation() {
    const rep = G.reputation;
    return Math.floor((rep.career + rep.social + rep.culture + rep.economy) / 4);
}

// v25.0: 人生阶段系统 - 根据年龄定义不同人生阶段
const LIFE_STAGES = [
    { id:'youth', name:'青年期', ageMin:18, ageMax:24, desc:'探索与迷茫', modifiers:{mood:-2,social:3,charm:2}, color:'#4ade80' },
    { id:'early_career', name:'立业期', ageMin:25, ageMax:30, desc:'拼搏与选择', modifiers:{intel:2,money_bonus:0.05}, color:'#60a5fa' },
    { id:'mid_career', name:'发展期', ageMin:31, ageMax:40, desc:'稳定与焦虑', modifiers:{intel:1,mood:-1,social:1}, color:'#f59e0b' },
    { id:'midlife', name:'中年期', ageMin:41, ageMax:50, desc:'反思与转型', modifiers:{intel:2,mood:-2,charm:-1}, color:'#f97316' },
    { id:'late_career', name:'成熟期', ageMin:51, ageMax:60, desc:'沉淀与传承', modifiers:{intel:3,social:2,mood:1}, color:'#a78bfa' },
    { id:'retirement', name:'退休期', ageMin:61, ageMax:100, desc:'自由与回忆', modifiers:{mood:2,health:-1,social:-1}, color:'#f472b6' },
];

function getCurrentLifeStage() {
    if (!G.age) return LIFE_STAGES[0];
    return LIFE_STAGES.find(s => G.age >= s.ageMin && G.age <= s.ageMax) || LIFE_STAGES[LIFE_STAGES.length-1];
}

function applyLifeStageModifiers() {
    const stage = getCurrentLifeStage();
    const prevStage = G.flags._lastLifeStage;
    // 进入新阶段时通知玩家
    if (prevStage !== stage.id) {
        if (prevStage) {
            G.eventLog.push({ age: G.age, text: `【人生阶段】进入${stage.name}：${stage.desc}` });
        }
        G.flags._lastLifeStage = stage.id;
    }
    // 应用阶段修正值
    if (stage.modifiers.mood) G.mood = clamp(G.mood + stage.modifiers.mood, 0, 100);
    if (stage.modifiers.social) G.social = clamp(G.social + stage.modifiers.social, 0, 100);
    if (stage.modifiers.charm) G.charm = clamp(G.charm + stage.modifiers.charm, 0, 100);
    if (stage.modifiers.intel) G.intel = clamp(G.intel + stage.modifiers.intel, 0, 100);
    if (stage.modifiers.health) G.health = clamp(G.health + stage.modifiers.health, 0, 100);
    if (stage.modifiers.money_bonus && G.salary) G.money += Math.floor(G.salary * stage.modifiers.money_bonus);
}

// v25.0: 季节事件系统 - 不同季节触发特定事件
const SEASON_EVENTS = {
    spring: [
        { id:'spring_bloom', icon:'🌸', title:'春暖花开', body:'春天来了，城市里的樱花开了。\n\n你在上班路上停下脚步，拍了一张照片。\n\n突然觉得：活着——真好。', choices:[
            { label:'发了条朋友圈：春天真好', hint:'+😊', fn: g => ({mood:5,social:2}) },
            { label:'决定周末去郊外踏青', hint:'+😊 +❤️', fn: g => ({mood:8,health:3}) },
        ]},
    ],
    summer: [
        { id:'summer_heat_v25', icon:'🔥', title:'酷暑难耐', body:'40度高温，整个城市像个大蒸笼。\n\n空调外机在滴水，路上的柏油在融化。\n\n你挤在地铁里，闻着各种味道混合在一起的「人间烟火」。\n\n你想：在这种天气上班的人——都是英雄。', choices:[
            { label:'买了一堆冷饮犒劳自己', hint:'-💰 +😊', fn: g => { g.money -= 200; return{mood:5}; }},
            { label:'默默忍受，打工人的命', hint:'-😊', fn: g => ({mood:-3}) },
        ]},
    ],
    autumn: [
        { id:'autumn_melancholy_v25', icon:'🍂', title:'秋天感伤', body:'秋风起了，落叶铺满了人行道。\n\n你走在下班的路上，突然有些感伤。\n\n又一年过去了——你做了什么？你得到了什么？你失去了什么？\n\n你想：也许人生就是——在每个秋天，问自己同样的问题。', choices:[
            { label:'给自己买了一杯热奶茶，温暖一下', hint:'-💰 +😊', fn: g => { g.money -= 30; return{mood:5}; }},
            { label:'写了一篇年度反思日记', hint:'+🧠 +😊', fn: g => ({intel:5,mood:3}) },
        ]},
    ],
    winter: [
        { id:'winter_warmth', icon:'❄️', title:'冬日温暖', body:'下班的路上，飘起了小雪。\n\n你缩着脖子走在冷风中，手机响了。\n\n是妈妈发来的消息：「冷了吧？多穿点。想吃什么，妈给你寄。」\n\n你回了一个「好」字，眼眶突然红了。\n\n在这个冰冷的城市里——总有人在远方温暖地惦记着你。', choices:[
            { label:'给妈妈回了一条长消息', hint:'+🤝 +😊', fn: g => ({social:5,mood:8}) },
            { label:'打了电话回家，聊了半小时', hint:'+🤝 +😊', fn: g => ({social:8,mood:10}) },
        ]},
    ],
};

function getSeasonEvent() {
    // 根据当前月份确定季节
    const month = G.month || 1;
    let season;
    if (month >= 3 && month <= 5) season = 'spring';
    else if (month >= 6 && month <= 8) season = 'summer';
    else if (month >= 9 && month <= 11) season = 'autumn';
    else season = 'winter';

    const events = SEASON_EVENTS[season];
    if (!events || events.length === 0) return null;
    // 每个季节事件有30%概率触发，且每年只触发一次
    const yearKey = `season_${G.age}_${season}`;
    if (G.flags[yearKey]) return null;
    if (Math.random() > 0.3) return null;
    G.flags[yearKey] = true;
    return events[Math.floor(Math.random() * events.length)];
}

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

    // v21.0: 人生评分系统 - 综合计算人生得分
    const lifeScore = calculateLifeScore();
    const scoreEl = document.getElementById('attribute-viz');
    if (scoreEl) {
        const existingHTML = scoreEl.innerHTML;
        const gradeLabel = lifeScore.score >= 90 ? 'S·传奇人生' : lifeScore.score >= 75 ? 'A·精彩人生' : lifeScore.score >= 60 ? 'B·充实人生' : lifeScore.score >= 40 ? 'C·平凡人生' : 'D·坎坷人生';
        const gradeColor = lifeScore.score >= 90 ? '#f59e0b' : lifeScore.score >= 75 ? '#60a5fa' : lifeScore.score >= 60 ? '#4ade80' : lifeScore.score >= 40 ? '#fbbf24' : '#f87171';
        scoreEl.innerHTML = existingHTML + `<h3>🎯 人生评分</h3><div class="life-score-display" style="text-align:center;margin:10px 0;"><div style="font-size:3em;font-weight:bold;color:${gradeColor}">${lifeScore.score}</div><div style="font-size:1.2em;color:${gradeColor};margin-top:5px">${gradeLabel}</div><div style="font-size:0.85em;color:#888;margin-top:8px">${lifeScore.details.map(d => d.label + ': ' + d.score).join(' · ')}</div></div>`;
    }

    // v24.0: 人生关键词展示
    const keywords = generateLifeKeywords();
    if (keywords.length > 0 && scoreEl) {
        scoreEl.innerHTML += `<h3>🏷️ 人生关键词</h3><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0">${keywords.map(k => `<span style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:4px 12px;border-radius:20px;font-size:0.9em">${k}</span>`).join('')}</div>`;
    }

    // v24.0: 人生时间线展示
    const timeline = getLifeTimeline();
    if (timeline.length > 0) {
        const timelineEl = document.getElementById('life-timeline-v24');
        if (timelineEl) {
            timelineEl.innerHTML = `<h3>📅 人生大事记</h3><div class="timeline-v24" style="max-height:300px;overflow-y:auto;padding:10px">${timeline.map(t => `<div style="display:flex;gap:10px;margin-bottom:8px;border-left:3px solid #764ba2;padding-left:12px"><span style="color:#764ba2;font-weight:bold;min-width:40px">${t.age}岁</span><span style="color:#ccc">${t.text}</span></div>`).join('')}</div>`;
        }
    }

    // v26.0: 人生一句话总结
    const lifeSummary = generateLifeSummary();
    if (lifeSummary) {
        const summaryEl = document.getElementById('life-summary-v26');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div style="margin:20px 0;padding:20px;border-radius:16px;background:linear-gradient(135deg,rgba(167,139,250,0.2),rgba(118,75,162,0.15));border:1px solid rgba(167,139,250,0.4);text-align:center">
                    <h3 style="margin:0 0 12px 0;color:#a78bfa">💭 人生一句话</h3>
                    <p style="margin:0;font-size:1.1em;line-height:1.6;font-style:italic;color:#eee">${lifeSummary}</p>
                </div>`;
        }
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
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const gameScreen = document.getElementById('screen-game');
    if (!gameScreen) return;

    gameScreen.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    gameScreen.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 60;
        const verticalThreshold = 40;
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);

        // Ignore if vertical movement is dominant (scrolling)
        if (diffY > verticalThreshold && diffY > Math.abs(diffX)) return;
        if (Math.abs(diffX) < swipeThreshold) return;

        if (diffX > 0) {
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
