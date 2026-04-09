import type { AssessmentReport } from './openai';
import type { UserProfile, FocusArea, AssessmentRecord } from './profileStore';

// 14 days ago as the anchor for Margaret's account creation
const FOURTEEN_DAYS_AGO = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

export const DEMO_PROFILES: Record<string, UserProfile> = {
  en: {
    name: 'Margaret Chen',
    email: 'margaret@example.com',
    birthYear: 1958,
    focusAreas: ['memory', 'language'] as FocusArea[],
    createdAt: FOURTEEN_DAYS_AGO.toISOString(),
  },
  zh: {
    name: '陈美华',
    email: 'margaret@example.com',
    birthYear: 1958,
    focusAreas: ['memory', 'language'] as FocusArea[],
    createdAt: FOURTEEN_DAYS_AGO.toISOString(),
  },
};

// Keep the old export for backwards compatibility
export const DEMO_PROFILE = DEMO_PROFILES.en;

type DemoEntry = {
  daysAgo: number;
  hour: number;
  transcript: string;
  report: AssessmentReport;
};

const entriesEn: DemoEntry[] = [
  {
    daysAgo: 13,
    hour: 9,
    transcript:
      "I had toast this morning, with some jam I think. My neighbor came by… we talked about something, maybe the weather. Then I sat in the living room for a while. I can't quite remember what I watched on television.",
    report: {
      score: 72,
      riskLevel: 'moderate',
      headline: 'You recalled your morning routine and a social visit — a solid start.',
      dimensions: { memory: 65, language: 74, attention: 70, executive: 68 },
      keywords: ['toast', 'jam', 'neighbor', 'weather', 'television', 'living room'],
      analysis:
        'Your speech captures the outline of your morning well — breakfast, a social interaction, and leisure time. There are a few moments of vagueness ("something," "I think") that suggest mild retrieval difficulty, but the overall narrative flow is intact and you self-corrected naturally.',
      recommendations: [
        'Try naming specific details aloud after meals — what exactly was on your plate, what flavor the jam was.',
        'Keeping a brief daily journal can strengthen the connection between experience and recall.',
        'Your social interactions are wonderful for cognitive health — keep inviting neighbors over.',
      ],
    },
  },
  {
    daysAgo: 12,
    hour: 10,
    transcript:
      "This morning I made scrambled eggs and had half a grapefruit. I called my son David in Portland — he's planning to visit next month with the grandchildren. After that I did the crossword puzzle, got about halfway through before my eyes got tired.",
    report: {
      score: 74,
      riskLevel: 'low',
      headline: 'Your conversation moved fluidly between food, family, and puzzles — lovely detail.',
      dimensions: { memory: 70, language: 78, attention: 72, executive: 71 },
      keywords: ['scrambled eggs', 'grapefruit', 'David', 'Portland', 'grandchildren', 'crossword', 'visit'],
      analysis:
        'You named specific foods, a family member by name, his city, and an upcoming plan — all signs of strong semantic and episodic recall. The crossword habit is excellent for language networks. Mentioning your eyes getting tired shows good self-awareness.',
      recommendations: [
        'Crossword puzzles are fantastic — even partial completion exercises word retrieval.',
        'When talking to David, try recounting a specific memory from his childhood to exercise long-term recall.',
        'Consider large-print puzzle books if eye fatigue is an issue.',
      ],
    },
  },
  {
    daysAgo: 11,
    hour: 8,
    transcript:
      "I woke up early today, around six-thirty. Made oatmeal with cinnamon and a sliced banana. I watered all the plants on the windowsill — the orchid is finally blooming again, it has three purple flowers. Then I read the newspaper, mostly the local section.",
    report: {
      score: 76,
      riskLevel: 'low',
      headline: 'Three purple orchid flowers — your eye for detail is genuinely impressive.',
      dimensions: { memory: 74, language: 80, attention: 75, executive: 73 },
      keywords: ['six-thirty', 'oatmeal', 'cinnamon', 'banana', 'orchid', 'purple flowers', 'windowsill', 'newspaper'],
      analysis:
        'This is a richly detailed account. You anchored your morning with a precise time, described your breakfast with two specific toppings, and noticed a beautiful detail about your orchid — counting the flowers. The narrative moves logically through your routine without backtracking.',
      recommendations: [
        'Describing plants and nature engages visual memory beautifully — keep noticing those details.',
        'Try reading one newspaper article aloud and summarizing it afterward.',
        'Your consistent morning routine provides excellent structure for cognitive health.',
      ],
    },
  },
  {
    daysAgo: 9,
    hour: 9,
    transcript:
      "I went to the farmer's market this morning with my friend Linda. We bought some strawberries and a loaf of sourdough bread. There was a man playing guitar near the entrance, he was playing something by Simon and Garfunkel. We had coffee at the little café afterward.",
    report: {
      score: 78,
      riskLevel: 'low',
      headline: "Simon and Garfunkel at the farmer's market — what a morning to remember.",
      dimensions: { memory: 76, language: 82, attention: 77, executive: 75 },
      keywords: ["farmer's market", 'Linda', 'strawberries', 'sourdough', 'guitar', 'Simon and Garfunkel', 'café'],
      analysis:
        "Excellent spatial and social recall here. You named your companion, specific purchases, a cultural reference (Simon and Garfunkel), and the sequence of activities. Moving from shopping to music to coffee shows strong narrative organization and attention to your environment.",
      recommendations: [
        'Social outings like this are among the best things you can do for brain health.',
        'Try to recall the specific song the guitarist was playing — music memory is deeply resilient.',
        'Describing sensory experiences (the smell of bread, the taste of strawberries) can further sharpen recall.',
      ],
    },
  },
  {
    daysAgo: 8,
    hour: 11,
    transcript:
      "Today I reorganized the hall closet — it was getting cluttered. I found an old photo album from when the children were small. David must have been about five, and Susan was just a toddler. We were at the beach, I think it was Cape May. I spent a good hour looking through the pictures.",
    report: {
      score: 79,
      riskLevel: 'low',
      headline: 'Finding that photo album unlocked beautifully vivid long-term memories.',
      dimensions: { memory: 80, language: 79, attention: 78, executive: 76 },
      keywords: ['hall closet', 'photo album', 'David', 'Susan', 'toddler', 'beach', 'Cape May', 'pictures'],
      analysis:
        "You demonstrated strong executive function by tackling an organizational task, and your long-term memory shone through when you recalled specific ages, a location, and the context of old photographs. Estimating David's age shows good temporal reasoning. The emotional engagement with the photos is a sign of healthy memory integration.",
      recommendations: [
        'Looking through old photos is a powerful memory exercise — try narrating the stories behind them.',
        'Consider sharing those beach memories with David and Susan; retelling strengthens recall.',
        'Organizational tasks like closet sorting exercise planning and sequencing skills.',
      ],
    },
  },
  {
    daysAgo: 6,
    hour: 10,
    transcript:
      "I tried a new recipe today — lemon chicken with roasted potatoes and green beans. I followed the recipe from that cookbook Susan gave me for Christmas. It turned out quite well, though I think I left the chicken in a few minutes too long. I saved some for Linda to try tomorrow.",
    report: {
      score: 81,
      riskLevel: 'low',
      headline: 'Following a new recipe from start to finish shows strong planning and sequencing.',
      dimensions: { memory: 79, language: 83, attention: 80, executive: 82 },
      keywords: ['lemon chicken', 'roasted potatoes', 'green beans', 'cookbook', 'Susan', 'Christmas', 'Linda'],
      analysis:
        'Cooking a new recipe requires reading comprehension, sequencing, timing, and multitasking — all executive function skills. You remembered who gave you the cookbook and when, evaluated the result critically (slightly overcooked), and planned ahead by saving a portion. This is a wonderfully complex cognitive task.',
      recommendations: [
        'Trying new recipes is one of the best everyday cognitive exercises — keep experimenting.',
        'Next time, try making the recipe from memory after the first attempt.',
        'Sharing food with friends combines social engagement with the satisfaction of accomplishment.',
      ],
    },
  },
  {
    daysAgo: 5,
    hour: 9,
    transcript:
      "This morning I walked to the library and returned two books. I picked up a new mystery novel by Louise Penny — I've read several of her books and I love the village setting. On the way back I noticed the dogwood trees on Maple Street are starting to bloom, beautiful pink and white blossoms.",
    report: {
      score: 83,
      riskLevel: 'low',
      headline: 'From Louise Penny to dogwood blossoms — your world is rich with observation.',
      dimensions: { memory: 82, language: 86, attention: 81, executive: 80 },
      keywords: ['library', 'mystery novel', 'Louise Penny', 'village', 'dogwood trees', 'Maple Street', 'blossoms', 'pink and white'],
      analysis:
        'You named a specific author, expressed a preference with reasoning (the village setting), noticed seasonal changes on a particular street, and described colors. This shows excellent semantic memory, environmental awareness, and aesthetic appreciation. Your reading habit continues to serve you very well.',
      recommendations: [
        'After finishing the Louise Penny book, try summarizing the plot to a friend — it strengthens narrative recall.',
        'Your walks are wonderful — try occasionally taking a different route to stimulate spatial memory.',
        'Noticing seasonal changes shows strong environmental awareness; consider keeping a nature journal.',
      ],
    },
  },
  {
    daysAgo: 3,
    hour: 10,
    transcript:
      "I had a lovely morning. I made French toast with maple syrup and shared breakfast with Susan — she drove up from Philadelphia. We talked about her garden, she's growing tomatoes and basil this year. Then we looked at old family recipes together and she helped me figure out my new tablet.",
    report: {
      score: 85,
      riskLevel: 'low',
      headline: 'Breakfast with Susan wove together food, family, and the joy of learning something new.',
      dimensions: { memory: 84, language: 87, attention: 83, executive: 83 },
      keywords: ['French toast', 'maple syrup', 'Susan', 'Philadelphia', 'garden', 'tomatoes', 'basil', 'family recipes', 'tablet'],
      analysis:
        'This narrative is warm and well-structured. You recalled your daughter visiting, where she came from, what you ate together, her gardening plans with specific plants, and a shared activity. Learning to use a new tablet shows willingness to engage with novel challenges — a very positive cognitive sign.',
      recommendations: [
        'Learning new technology is excellent for cognitive flexibility — keep exploring the tablet.',
        'Cooking from family recipes with loved ones combines memory, emotion, and social connection beautifully.',
        'Try using the tablet to video call David in Portland — it combines tech skills with social engagement.',
      ],
    },
  },
  {
    daysAgo: 2,
    hour: 8,
    transcript:
      "I woke up feeling rested. Had yogurt with granola and some fresh strawberries from the farmer's market — still so sweet. I did my crossword in pen today, finished the whole thing. Then I spent the afternoon at the community center, we played bridge and I won two hands.",
    report: {
      score: 86,
      riskLevel: 'low',
      headline: 'Finishing the crossword in pen and winning at bridge — your mind is sharp and confident.',
      dimensions: { memory: 85, language: 88, attention: 84, executive: 85 },
      keywords: ['yogurt', 'granola', 'strawberries', "farmer's market", 'crossword', 'pen', 'community center', 'bridge'],
      analysis:
        'Doing the crossword in pen signals confidence in your word retrieval. Completing the whole puzzle shows sustained attention. Bridge is one of the most cognitively demanding card games, requiring memory, strategy, and social reading. Winning two hands speaks to strong executive function and working memory.',
      recommendations: [
        'Bridge is phenomenal for cognitive health — the combination of memory, strategy, and social interaction is ideal.',
        'Keep doing crosswords in pen — the confidence it builds is as valuable as the practice itself.',
        'Try teaching a new player at the community center; explaining rules exercises communication skills.',
      ],
    },
  },
  {
    daysAgo: 0,
    hour: 9,
    transcript:
      "What a nice morning. I made a pot of Earl Grey and sat on the porch watching the birds — there were two cardinals and a little wren at the feeder. Then I called David to confirm plans for his visit. He's arriving on the fourteenth with Emma and little James. I'm planning to make my mother's pot roast, the one with the carrots and pearl onions.",
    report: {
      score: 87,
      riskLevel: 'low',
      headline: "From cardinals at the feeder to your mother's pot roast — every detail sings with clarity.",
      dimensions: { memory: 88, language: 90, attention: 85, executive: 84 },
      keywords: ['Earl Grey', 'porch', 'cardinals', 'wren', 'feeder', 'David', 'fourteenth', 'Emma', 'James', 'pot roast', 'pearl onions'],
      analysis:
        "This is a beautifully detailed narrative. You identified three bird species, named a specific tea, recalled a precise date for David's visit, named both grandchildren, and described a recipe by its origin and specific ingredients. The emotional warmth and forward planning are both excellent signs of cognitive vitality.",
      recommendations: [
        'Bird watching exercises visual attention and identification skills — consider a field guide to expand your repertoire.',
        'Planning a family meal days in advance shows strong prospective memory — keep it up.',
        "Try writing down your mother's pot roast recipe from memory to preserve it for Emma and James.",
      ],
    },
  },
];

const entriesZh: DemoEntry[] = [
  {
    daysAgo: 13,
    hour: 9,
    transcript:
      '今天早上吃了吐司，好像抹了点果酱。邻居过来坐了一会儿……我们聊了点什么，大概是天气吧。然后我在客厅坐了一阵子，电视上放了什么我记不太清了。',
    report: {
      score: 72,
      riskLevel: 'moderate',
      headline: '您回忆起了早晨的日常和一次社交来访——这是个不错的开始。',
      dimensions: { memory: 65, language: 74, attention: 70, executive: 68 },
      keywords: ['吐司', '果酱', '邻居', '天气', '电视', '客厅'],
      analysis:
        '您的表达很好地勾勒出了早晨的轮廓——早餐、社交互动和休闲时光。有几处比较模糊的地方（"什么""大概"）暗示可能存在轻微的记忆提取困难，但整体叙事流畅，您能自然地进行自我修正。',
      recommendations: [
        '试着在饭后大声说出具体细节——盘子里有什么、果酱是什么味道的。',
        '坚持写简短的日记可以增强体验与回忆之间的联系。',
        '您的社交互动对认知健康非常有益——继续邀请邻居来坐坐。',
      ],
    },
  },
  {
    daysAgo: 12,
    hour: 10,
    transcript:
      '今天早上我做了炒蛋，还吃了半个柚子。我给在杭州的儿子大卫打了电话——他计划下个月带孙子们来看我。之后我做了一会儿填字游戏，做到一半眼睛就累了。',
    report: {
      score: 74,
      riskLevel: 'low',
      headline: '您的对话在食物、家人和益智游戏之间流畅切换——细节很丰富。',
      dimensions: { memory: 70, language: 78, attention: 72, executive: 71 },
      keywords: ['炒蛋', '柚子', '大卫', '杭州', '孙子', '填字游戏', '来看我'],
      analysis:
        '您说出了具体的食物、家人的名字、他所在的城市以及即将到来的计划——这些都是语义记忆和情景记忆良好的表现。填字游戏的习惯对语言网络非常有益。提到眼睛疲劳说明您有良好的自我觉察能力。',
      recommendations: [
        '填字游戏非常棒——即使只完成一部分也能锻炼词汇提取能力。',
        '和大卫通话时，试着回忆他小时候的一件具体事情来锻炼长期记忆。',
        '如果眼睛容易疲劳，可以考虑大字版的益智书籍。',
      ],
    },
  },
  {
    daysAgo: 11,
    hour: 8,
    transcript:
      '今天起得早，大概六点半。煮了燕麦粥，加了肉桂和切片的香蕉。我给窗台上所有的花都浇了水——那盆兰花终于又开了，开了三朵紫色的花。然后看了会儿报纸，主要看的本地新闻。',
    report: {
      score: 76,
      riskLevel: 'low',
      headline: '三朵紫色的兰花——您对细节的观察力真的很出色。',
      dimensions: { memory: 74, language: 80, attention: 75, executive: 73 },
      keywords: ['六点半', '燕麦粥', '肉桂', '香蕉', '兰花', '紫色的花', '窗台', '报纸'],
      analysis:
        '这是一段非常丰富的叙述。您用精确的时间定位了早晨，描述了早餐的两种配料，还注意到了兰花的美丽细节——数了花朵的数量。叙事逻辑清晰，没有回头重述。',
      recommendations: [
        '观察和描述植物能很好地激活视觉记忆——继续留意这些细节。',
        '试着大声朗读一篇报纸文章，然后总结内容。',
        '规律的晨间作息为认知健康提供了很好的结构。',
      ],
    },
  },
  {
    daysAgo: 9,
    hour: 9,
    transcript:
      '今天早上我和朋友丽华一起去了菜市场。我们买了些草莓和一条全麦面包。门口有个人在弹吉他，弹的好像是邓丽君的歌。之后我们在旁边的小咖啡店喝了杯咖啡。',
    report: {
      score: 78,
      riskLevel: 'low',
      headline: '菜市场里的邓丽君旋律——多么值得回忆的一个早晨。',
      dimensions: { memory: 76, language: 82, attention: 77, executive: 75 },
      keywords: ['菜市场', '丽华', '草莓', '全麦面包', '吉他', '邓丽君', '咖啡店'],
      analysis:
        '出色的空间和社交回忆。您说出了同伴的名字、具体买的东西、一个文化符号（邓丽君），以及活动的先后顺序。从购物到音乐再到咖啡，展现了良好的叙事组织能力和对环境的关注。',
      recommendations: [
        '这样的社交外出是对大脑健康最有益的活动之一。',
        '试着回忆那位吉他手弹的具体是哪首歌——音乐记忆是非常持久的。',
        '描述感官体验（面包的香味、草莓的滋味）能进一步增强记忆力。',
      ],
    },
  },
  {
    daysAgo: 8,
    hour: 11,
    transcript:
      '今天我整理了门厅的柜子——东西堆得太乱了。我发现了一本旧相册，是孩子们小时候的。大卫那时候大概五岁，小苏还是个小不点。我们好像是在海边，应该是在青岛。我看了差不多一个小时的照片。',
    report: {
      score: 79,
      riskLevel: 'low',
      headline: '找到那本相册唤起了美好而生动的长期记忆。',
      dimensions: { memory: 80, language: 79, attention: 78, executive: 76 },
      keywords: ['门厅柜子', '旧相册', '大卫', '小苏', '小不点', '海边', '青岛', '照片'],
      analysis:
        '您展示了很强的执行功能——主动整理收纳，而长期记忆在回忆具体年龄、地点和老照片背景时表现突出。估算大卫的年龄说明您有良好的时间推理能力。与照片的情感互动是健康记忆整合的标志。',
      recommendations: [
        '翻看老照片是很好的记忆练习——试着讲述照片背后的故事。',
        '考虑和大卫、小苏分享这些海边回忆，复述能增强记忆力。',
        '整理收纳这样的任务能锻炼计划和排序能力。',
      ],
    },
  },
  {
    daysAgo: 6,
    hour: 10,
    transcript:
      '今天试了个新菜谱——柠檬鸡配烤土豆和四季豆。我照着小苏过年送我的那本菜谱书做的。做出来挺好的，就是鸡肉可能多烤了几分钟。我留了一份给丽华明天尝尝。',
    report: {
      score: 81,
      riskLevel: 'low',
      headline: '从头到尾完成一道新菜谱，展现了出色的计划和执行能力。',
      dimensions: { memory: 79, language: 83, attention: 80, executive: 82 },
      keywords: ['柠檬鸡', '烤土豆', '四季豆', '菜谱书', '小苏', '过年', '丽华'],
      analysis:
        '做新菜需要阅读理解、步骤排序、时间掌控和多任务处理——这些都是执行功能的体现。您记住了谁送的菜谱书以及什么时候送的，对结果有批判性评估（稍微烤久了），还提前计划了留一份给朋友。这是一项非常丰富的认知任务。',
      recommendations: [
        '尝试新菜谱是最好的日常认知锻炼之一——继续尝试新菜。',
        '下次试试凭记忆复做这道菜。',
        '与朋友分享美食将社交互动与成就感完美结合。',
      ],
    },
  },
  {
    daysAgo: 5,
    hour: 9,
    transcript:
      '今天早上我走路去了图书馆，还了两本书。借了一本余华的新小说——我读过他好几本书了，特别喜欢他写的那种有年代感的故事。回来的路上注意到银杏街上的玉兰花开始开了，粉白色的花瓣很漂亮。',
    report: {
      score: 83,
      riskLevel: 'low',
      headline: '从余华的小说到玉兰花——您的世界充满了细腻的观察。',
      dimensions: { memory: 82, language: 86, attention: 81, executive: 80 },
      keywords: ['图书馆', '小说', '余华', '年代感', '玉兰花', '银杏街', '花瓣', '粉白色'],
      analysis:
        '您说出了具体的作者名字，表达了有理由的偏好（年代感的故事），注意到了特定街道上的季节变化，还描述了颜色。这展现了出色的语义记忆、环境觉察力和审美欣赏能力。您的阅读习惯对您非常有益。',
      recommendations: [
        '读完余华的书后，试着向朋友概述剧情——这能增强叙事记忆。',
        '您的散步习惯很棒——偶尔换条路线可以刺激空间记忆。',
        '关注季节变化说明您有很强的环境觉察力，可以考虑写一本自然日记。',
      ],
    },
  },
  {
    daysAgo: 3,
    hour: 10,
    transcript:
      '今天早上过得很开心。我做了法式吐司配枫糖浆，和小苏一起吃的早餐——她从上海开车过来的。我们聊了她的菜园，今年她种了西红柿和罗勒。然后我们一起翻了老家的食谱，她还帮我弄明白了新买的平板电脑。',
    report: {
      score: 85,
      riskLevel: 'low',
      headline: '和小苏的早餐将美食、家人和学习新事物的快乐编织在一起。',
      dimensions: { memory: 84, language: 87, attention: 83, executive: 83 },
      keywords: ['法式吐司', '枫糖浆', '小苏', '上海', '菜园', '西红柿', '罗勒', '老家食谱', '平板电脑'],
      analysis:
        '这段叙述温馨而有条理。您记住了女儿来访、她从哪里来、一起吃了什么、她的种菜计划（具体的植物），以及一起做的事情。愿意学习使用新的平板电脑说明您勇于接受新挑战——这是非常积极的认知信号。',
      recommendations: [
        '学习新科技是锻炼认知灵活性的好方法——继续探索平板电脑。',
        '和家人一起用老家食谱做菜，完美结合了记忆、情感和社交联系。',
        '试着用平板电脑和在杭州的大卫视频通话——既练了技术又增进了感情。',
      ],
    },
  },
  {
    daysAgo: 2,
    hour: 8,
    transcript:
      '今天起来精神很好。吃了酸奶拌麦片，还有菜市场买的新鲜草莓——还是那么甜。今天用钢笔做了填字游戏，全部做完了。下午在社区活动中心打了桥牌，赢了两局。',
    report: {
      score: 86,
      riskLevel: 'low',
      headline: '用钢笔完成填字游戏还赢了桥牌——您的思维敏捷而自信。',
      dimensions: { memory: 85, language: 88, attention: 84, executive: 85 },
      keywords: ['酸奶', '麦片', '草莓', '菜市场', '填字游戏', '钢笔', '社区活动中心', '桥牌'],
      analysis:
        '用钢笔做填字游戏说明您对自己的词汇提取能力充满信心。全部完成展示了持续的注意力。桥牌是最考验认知能力的纸牌游戏之一，需要记忆、策略和社交判断。赢了两局体现了出色的执行功能和工作记忆。',
      recommendations: [
        '桥牌对认知健康非常有益——记忆、策略和社交互动的完美结合。',
        '继续用钢笔做填字游戏——它带来的信心和练习本身一样珍贵。',
        '试着在活动中心教新手打桥牌，讲解规则能锻炼表达能力。',
      ],
    },
  },
  {
    daysAgo: 0,
    hour: 9,
    transcript:
      '今天早上真不错。我泡了一壶龙井茶，坐在阳台上看鸟——有两只喜鹊和一只小麻雀在喂食器那儿。然后给大卫打了电话确认他来的安排。他十四号带小梅和小杰一起来。我打算做妈妈的红烧排骨，就是那个加了胡萝卜和香菇的。',
    report: {
      score: 87,
      riskLevel: 'low',
      headline: '从阳台上的喜鹊到妈妈的红烧排骨——每一个细节都清晰而生动。',
      dimensions: { memory: 88, language: 90, attention: 85, executive: 84 },
      keywords: ['龙井茶', '阳台', '喜鹊', '麻雀', '喂食器', '大卫', '十四号', '小梅', '小杰', '红烧排骨', '香菇'],
      analysis:
        '这是一段叙述精美的故事。您辨认了鸟的种类、说出了具体的茶名、记住了大卫来访的精确日期、说出了两个孙辈的名字，还用食材和来源描述了一道菜谱。情感的温暖和对未来的规划都是认知活力的优秀体现。',
      recommendations: [
        '观鸟能锻炼视觉注意力和辨识能力——可以考虑买一本观鸟指南来拓展认识。',
        '提前几天计划家庭聚餐展现了很强的前瞻记忆——继续保持。',
        '试着凭记忆写下妈妈的红烧排骨食谱，为小梅和小杰留存下来。',
      ],
    },
  },
];

function makeId(index: number): string {
  // Deterministic but unique-looking IDs
  const base = 'demo';
  const suffix = (index + 1).toString().padStart(3, '0');
  return `${base}_${suffix}_${FOURTEEN_DAYS_AGO.getTime().toString(36)}`;
}

function makeDate(daysAgo: number, hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(Math.random() * 30) + 10, 0, 0);
  // Use a fixed minute offset to keep it deterministic
  d.setMinutes(15 + (daysAgo * 7) % 45);
  return d.toISOString();
}

export function getDemoAssessments(locale: 'en' | 'zh' = 'en'): AssessmentRecord[] {
  const entries = locale === 'zh' ? entriesZh : entriesEn;
  return entries
    .map((entry, i) => ({
      id: makeId(i),
      date: makeDate(entry.daysAgo, entry.hour),
      report: entry.report,
      transcript: entry.transcript,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
