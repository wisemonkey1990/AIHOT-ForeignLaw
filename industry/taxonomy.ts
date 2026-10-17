// 涉外法治信息港的分类体系：类别、标签词表、机构（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（实务指南、学术与智库）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "industry", label: "涉外法治工作", feedLabel: "涉外法治工作动态", section: "涉外法治工作动态", guide: "从中央到地方推进涉外法治工作的动态：中央部署与规划，部委的机制建设、平台上线、专项行动和人才培养，地方（省市司法厅局、自贸区、涉外法律服务集聚区、地方法院、仲裁机构、贸促会）的涉外制度创新与实践。重点是治理与工作机制，而不是规则文本本身或某个具体案件。不含涉外要素的纯内政法务、普通普法、常规会议不属于这一类。" },
  { key: "intl-public-law", label: "国际公法", section: "国际规则与条约", guide: "条约及其签署、批准、生效、保留，联合国及其他多边机构的规则与决议，海洋法、国家豁免、国际刑事司法、国际法委员会的工作成果。规则的制定、修订和重要缔约方动作归这一类；某国为落实条约而出台的国内立法，看重点是条约本身还是国内的工作部署。" },
  { key: "trade-investment", label: "国际贸易与投资", section: "贸易与投资规则", guide: "WTO 与贸易协定、对外投资与外资规则、出口管制、制裁与反制裁、反倾销等贸易救济、域外适用的法律。重点是规则、措施及其法律后果；仅涉及经贸数据或企业经营而无法律规则变化的，不属于这一类。" },
  { key: "dispute-resolution", label: "国际商事争议解决", section: "争议解决", guide: "涉外商事和海事的诉讼、国际仲裁与调解：规则修订、典型案例、跨境判决与仲裁裁决的承认和执行、涉外送达与取证、仲裁机构和国际商事法庭的机制变化。具体判决和裁决归这一类；地方为建设争议解决机制而做的部署归涉外法治工作。" },
  { key: "cross-border-compliance", label: "跨境合规", section: "跨境合规", guide: "企业跨境经营的合规要求与监管动态：数据出境、反腐败与反贿赂、供应链尽职调查、外国法域的监管执法、反垄断申报等。重点是合规义务和执法实践；出口管制、制裁的规则本身归国际贸易与投资。" },
  { key: "foreign-legal-services", label: "涉外法律服务", section: "涉外法律服务", guide: "涉外法律服务的供给与能力建设：法律查明平台（如法通网）、涉外律师和仲裁人才库与培养、律所的境外布局、法律服务集聚区、公共法律服务。平台建设和人才培养如果是部委或地方的整体工作部署，归涉外法治工作。" },
  { key: "tip", label: "实务指南", section: "实务与观点", guide: "读者可以照着做的合规指引、操作流程、条款与程序要点、国别法务指南、案例办案经验。重点是可复用的做法；单纯发布规则归对应领域类别，只有态度和预测而无做法归学术与智库。", commentary: true },
  { key: "opinion", label: "学术与智库", feedLabel: "学术与智库", section: "实务与观点", guide: "重点是作者的解读、判断、主张、研究结论或访谈观点：论文、研究报告、智库文章、学者与实务人士的评论。讨论一项规则不自动算成规则类，作者是官员或名人不自动算成工作动态。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * 涉外法治没有这样一类，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["涉外法治", "涉外", "法治", "国际法", "条约", "仲裁", "司法", "立法"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["policy_release", "platform_or_mechanism", "practice_guide", "research_report", "case_or_event", "opinion_analysis", "explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一（表达内容的性质）。最后一个是兜底。 */
export const CATEGORY_TAGS = [
  "立法与政策", "工作部署", "司法与案例", "条约与国际规则", "仲裁与争议解决", "实务指南", "学术与智库", "平台与人才", "其他",
] as const;

/** 可选的主题标签：工作层级和议题。 */
export const TOPIC_TAGS = [
  "中央", "部委", "地方", "自贸区", "涉外律师", "涉外仲裁", "法律查明", "域外适用", "出口管制与制裁", "反外国制裁", "数据出境",
  "海事海商", "知识产权", "对外投资", "国家豁免", "跨境执行", "一带一路", "国际组织",
] as const;

/** 可选的实体标签（机构、平台、国际组织）。 */
export const ENTITY_TAGS = [
  "司法部", "最高人民法院", "最高人民检察院", "商务部", "外交部", "法通网", "国际商事法庭", "贸仲", "贸促会", "联合国", "WTO", "国际法委员会", "国际刑事法院",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  立法: "立法与政策", 政策: "立法与政策", 法规: "立法与政策", 规章: "立法与政策", 司法解释: "立法与政策", 规划: "立法与政策",
  部署: "工作部署", 工作动态: "工作部署", 机制建设: "工作部署", 专项行动: "工作部署", 试点: "工作部署",
  案例: "司法与案例", 判决: "司法与案例", 裁判: "司法与案例", 审判: "司法与案例", 典型案例: "司法与案例", 司法: "司法与案例",
  条约: "条约与国际规则", 国际规则: "条约与国际规则", 国际公约: "条约与国际规则", 公约: "条约与国际规则", 多边规则: "条约与国际规则",
  仲裁: "仲裁与争议解决", 争议解决: "仲裁与争议解决", 调解: "仲裁与争议解决", 国际仲裁: "仲裁与争议解决",
  指南: "实务指南", 实务: "实务指南", 合规指引: "实务指南", 操作指引: "实务指南", 教程: "实务指南",
  学术: "学术与智库", 智库: "学术与智库", 研究: "学术与智库", 论文: "学术与智库", 观点: "学术与智库", 评论: "学术与智库",
  平台: "平台与人才", 人才: "平台与人才", 人才培养: "平台与人才", 平台建设: "平台与人才",
  国家层面: "中央", 中央部署: "中央", 部门: "部委", 部委推进: "部委", 地方实践: "地方", 省市: "地方", 自由贸易区: "自贸区", 自贸港: "自贸区",
  律师: "涉外律师", 域外法查明: "法律查明", 外国法查明: "法律查明", 制裁: "出口管制与制裁", 出口管制: "出口管制与制裁", 反制裁: "反外国制裁",
  数据跨境: "数据出境", 海商法: "海事海商", 海事: "海事海商", 知产: "知识产权", 对外投资: "对外投资", 豁免: "国家豁免", 承认与执行: "跨境执行",
  CIETAC: "贸仲", cietac: "贸仲", 中国贸仲: "贸仲", CCPIT: "贸促会", ccpit: "贸促会", 联合国大会: "联合国", ILC: "国际法委员会", ilc: "国际法委员会",
  ICC: "国际刑事法院", icc: "国际刑事法院", CICC: "国际商事法庭", cicc: "国际商事法庭", wto: "WTO", 世贸组织: "WTO", 世界贸易组织: "WTO", 贸促会: "贸促会",
};

// ── 机构与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 机构主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是机构自己的其他称呼（下属机构、官方账号名），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  moj: { name: "司法部", displayTag: "司法部", aliases: ["司法部", "Ministry of Justice"], otherNames: ["司法部涉外法治局", "中国法律服务网", "中央依法治国办"] },
  spc: { name: "最高人民法院", displayTag: "最高人民法院", aliases: ["最高人民法院", "最高法", "Supreme People's Court"] },
  spp: { name: "最高人民检察院", displayTag: "最高人民检察院", aliases: ["最高人民检察院", "最高检"], otherNames: ["最高检察院"] },
  mofcom: { name: "商务部", displayTag: "商务部", aliases: ["商务部", "Ministry of Commerce", "MOFCOM"] },
  mfa: { name: "外交部", displayTag: "外交部", aliases: ["外交部", "Ministry of Foreign Affairs"], otherNames: ["外交部条约法律司", "条法司"] },
  falitong: { name: "法通网", displayTag: "法通网", aliases: ["法通网", "法通"], otherNames: ["法小通"] },
  cicc: { name: "最高人民法院国际商事法庭", displayTag: "国际商事法庭", aliases: ["国际商事法庭", "CICC"], otherNames: ["中国国际商事法庭", "国际商事专家委员会"] },
  cietac: { name: "中国国际经济贸易仲裁委员会", displayTag: "贸仲", aliases: ["贸仲", "中国国际经济贸易仲裁委员会", "CIETAC"], otherNames: ["中国贸仲", "贸仲委"] },
  ccpit: { name: "中国国际贸易促进委员会", displayTag: "贸促会", aliases: ["贸促会", "中国国际贸易促进委员会", "CCPIT"], otherNames: ["中国贸促会", "贸法通"] },
  un: { name: "联合国", displayTag: "联合国", aliases: ["联合国", "United Nations"], otherNames: ["联合国大会", "联合国安理会"] },
  wto: { name: "世界贸易组织", displayTag: "WTO", aliases: ["世界贸易组织", "WTO", "World Trade Organization"], otherNames: ["世贸组织"] },
  ilc: { name: "联合国国际法委员会", displayTag: "国际法委员会", aliases: ["国际法委员会", "International Law Commission"], otherNames: ["ILC"] },
  icc: { name: "国际刑事法院", displayTag: "国际刑事法院", aliases: ["国际刑事法院", "International Criminal Court"], otherNames: ["ICC"] },
  uncitral: { name: "联合国国际贸易法委员会", displayTag: null, aliases: ["联合国国际贸易法委员会", "UNCITRAL", "贸易法委员会"] },
  hcch: { name: "海牙国际私法会议", displayTag: null, aliases: ["海牙国际私法会议", "HCCH", "Hague Conference on Private International Law"] },
};

/**
 * 身份词典：摘要和标题里出现的机构，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 只列名称不易和别的机构混淆的写法。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "moj", name: "司法部", patterns: [/司法部|Ministry of Justice/i] },
  { id: "spc", name: "最高人民法院", patterns: [/最高人民法院|最高法(?!院)|Supreme People['’]s Court/i] },
  { id: "spp", name: "最高人民检察院", patterns: [/最高人民检察院|最高检/] },
  { id: "mofcom", name: "商务部", patterns: [/商务部|\bMOFCOM\b|Ministry of Commerce/i] },
  { id: "mfa", name: "外交部", patterns: [/外交部|Ministry of Foreign Affairs/i] },
  { id: "falitong", name: "法通网", patterns: [/法通网|法小通/] },
  { id: "cicc", name: "国际商事法庭", patterns: [/国际商事法庭|\bCICC\b/] },
  { id: "cietac", name: "贸仲", patterns: [/贸仲|中国国际经济贸易仲裁委员会|\bCIETAC\b/i] },
  { id: "ccpit", name: "贸促会", patterns: [/贸促会|中国国际贸易促进委员会|\bCCPIT\b/i] },
  { id: "un", name: "联合国", patterns: [/联合国|United Nations/i] },
  { id: "wto", name: "WTO", patterns: [/世贸组织|世界贸易组织|\bWTO\b/i] },
  { id: "ilc", name: "国际法委员会", patterns: [/国际法委员会|International Law Commission/i] },
  { id: "icc", name: "国际刑事法院", patterns: [/国际刑事法院|International Criminal Court/i] },
];

/** 这些域名上的文章，发布方就是对应的机构（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "moj", domains: ["moj.gov.cn"] },
  { entityId: "cicc", domains: ["cicc.court.gov.cn"] },
  { entityId: "spc", domains: ["court.gov.cn"] },
  { entityId: "spp", domains: ["spp.gov.cn"] },
  { entityId: "mofcom", domains: ["mofcom.gov.cn"] },
  { entityId: "mfa", domains: ["mfa.gov.cn", "fmprc.gov.cn"] },
  { entityId: "cietac", domains: ["cietac.org"] },
  { entityId: "ccpit", domains: ["ccpit.org"] },
  { entityId: "un", domains: ["un.org"] },
  { entityId: "wto", domains: ["wto.org"] },
  { entityId: "icc", domains: ["icc-cpi.int"] },
  { entityId: "uncitral", domains: ["uncitral.un.org"] },
  { entityId: "hcch", domains: ["hcch.net"] },
];

/** 原文里的这些写法也算提到了对应机构。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
