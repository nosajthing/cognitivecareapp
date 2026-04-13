export type ServiceCategory = 'screening' | 'insurance' | 'doctor';

export type ServiceReview = {
  author: { en: string; zh: string };
  rating: number;
  text: { en: string; zh: string };
};

export type ServiceItem = {
  id: string;
  category: ServiceCategory;
  title: { en: string; zh: string };
  subtitle: { en: string; zh: string };
  description: { en: string; zh: string };
  price: number;
  originalPrice?: number;
  priceLabel: { en: string; zh: string };
  features: { en: string[]; zh: string[] };
  reviews: ServiceReview[];
  heroColor: string;
  heroColorEnd?: string;
  heroImage?: any;
  badge?: { en: string; zh: string };
  doctorEmoji?: string;
  availability?: { en: string; zh: string };
  hidePrice?: boolean;
  techTag?: { en: string; zh: string };
  totalBookingsLabel?: { en: string; zh: string };
};

const services: ServiceItem[] = [
  // ── Screening Packages ──
  {
    id: 'screening-standard',
    category: 'screening',
    title: { en: 'Standard Brain Health Screening', zh: '脑健康标准筛查' },
    subtitle: { en: 'United Family Healthcare × Prof. Guo Yi', zh: '和睦家医疗 × 郭毅教授团队' },
    description: {
      en: 'A non-invasive EEG-based cognitive risk assessment combining clinical neurology consultations with validated cognitive scales. Ideal for early detection and baseline monitoring.',
      zh: '基于脑电图的无创认知风险评估，结合神经内科临床问诊与经过验证的认知评估量表。适合早期检测和基线监测。',
    },
    price: 1880,
    originalPrice: 2500,
    priceLabel: { en: '/package', zh: '/套餐' },
    features: {
      en: [
        'Neurology consult ×2 (initial + follow-up)',
        'EEG cognitive risk assessment',
        'MoCA cognitive assessment',
        'MMSE mental status exam',
        'PSQI sleep quality assessment',
        'Somatic screening (Neuro-11)',
      ],
      zh: [
        '神经内科问诊×2（首诊+复诊）',
        'EEG脑电图认知风险评估',
        'MoCA蒙特利尔认知评估量表',
        'MMSE简易精神状态检查量表',
        'PSQI睡眠质量评估',
        '躯体形式障碍筛查 (Neuro-11)',
      ],
    },
    reviews: [
      {
        author: { en: 'Wang L.', zh: '王女士' },
        rating: 5,
        text: {
          en: 'Very thorough screening. Prof. Guo explained everything clearly and patiently.',
          zh: '检查非常全面，郭教授讲解耐心细致，让人很放心。',
        },
      },
      {
        author: { en: 'Zhang M.', zh: '张先生' },
        rating: 4,
        text: {
          en: 'Good baseline assessment. The EEG results helped me understand my cognitive health.',
          zh: '很好的基线评估，脑电图结果帮助我了解了自己的认知状况。',
        },
      },
    ],
    heroColor: '#0f6a5f',
    heroColorEnd: '#1a8a7d',
  },
  {
    id: 'screening-comprehensive',
    category: 'screening',
    title: { en: 'EEG·rTMS Brain Health Screening', zh: 'EEG·rTMS 脑健康综合筛查' },
    subtitle: {
      en: 'Clinical-grade EEG + rTMS, led by Prof. Guo Yi.',
      zh: '临床级 EEG + rTMS 筛查，郭毅教授领衔。',
    },
    description: {
      en: 'Our flagship clinical screening protocol pairs a quantitative EEG and rTMS cortical excitability assessment with blood biomarkers, brain MRI imaging, and full metabolic panels. Designed with Prof. Guo Yi for early detection of Alzheimer\'s risk and cognitive decline.',
      zh: '旗舰临床筛查方案：定量脑电图（qEEG）与 rTMS 皮层兴奋性评估，结合血液生物标志物、颅脑 MRI 影像学和完整代谢指标。由郭毅教授团队设计，用于阿尔茨海默病风险与认知衰退的早期识别。',
    },
    price: 7800,
    originalPrice: 11000,
    priceLabel: { en: '/package', zh: '/套餐' },
    hidePrice: true,
    heroImage: require('../assets/services/eeg-rtms-hero.png'),
    badge: { en: 'Flagship', zh: '旗舰' },
    techTag: {
      en: 'EEG + rTMS Clinical Technology',
      zh: 'EEG + rTMS 临床技术',
    },
    totalBookingsLabel: { en: '1,240+ screened', zh: '1,240+ 人已筛查' },
    features: {
      en: [
        'All Standard screening items included',
        'Blood biomarker panel (P-Tau217, GFAP, NfL)',
        'Aβ amyloid protein (Aβ-42, Aβ-40)',
        'Brain MRI (SWI sequence, coronal hippocampal)',
        'Thyroid function',
        'Liver & kidney function',
        'CBC / glucose / lipids / ferritin / B12',
      ],
      zh: [
        '包含标准版全部项目',
        '血液标志物检测 (P-Tau217, GFAP, NfL)',
        'Aβ淀粉样蛋白 (Aβ-42, Aβ-40)',
        '颅脑MRI (SWI序列、冠状位海马相)',
        '甲状腺功能',
        '肝功能 / 肾功能',
        '血常规 / 血糖 / 血脂 / 铁蛋白 / 维生素B12',
      ],
    },
    reviews: [
      {
        author: { en: 'Chen Y.', zh: '陈女士' },
        rating: 5,
        text: {
          en: 'Extremely comprehensive. The EEG picked up early changes that we were able to address right away — worth every minute.',
          zh: '非常全面。脑电图早期发现了变化，我们及时进行了干预，真的物有所值。',
        },
      },
      {
        author: { en: 'Li J.', zh: '李先生' },
        rating: 5,
        text: {
          en: 'Worth every penny. The MRI and biomarker results gave us real peace of mind about my father\'s health.',
          zh: '物有所值。MRI和生物标志物检查结果让我们对父亲的健康状况安心了不少。',
        },
      },
      {
        author: { en: 'Huang R.', zh: '黄先生' },
        rating: 5,
        text: {
          en: 'Professional service from start to finish. Prof. Guo walked us through every result in plain language.',
          zh: '从始至终服务专业，郭教授用通俗易懂的方式讲解了每一项结果。',
        },
      },
      {
        author: { en: 'Wang M.', zh: '王女士' },
        rating: 5,
        text: {
          en: 'The rTMS portion was painless and the report was incredibly detailed. Much more thorough than my last hospital check-up.',
          zh: 'rTMS 检查完全无痛，报告非常详细，比我上次在医院做的体检全面太多了。',
        },
      },
      {
        author: { en: 'Zhou H.', zh: '周先生' },
        rating: 4,
        text: {
          en: 'Appointment took a couple of weeks to schedule, but the screening itself was excellent. Very organised.',
          zh: '约号等了两周左右，但筛查本身非常好，流程很规范。',
        },
      },
      {
        author: { en: 'Zhao Q.', zh: '赵女士' },
        rating: 5,
        text: {
          en: 'Brought my mother (72) — the team was patient and kind. The hippocampal MRI gave us a clear baseline.',
          zh: '带72岁的母亲来做的，医护团队非常耐心细致。海马相MRI给了我们一个很清晰的基线。',
        },
      },
      {
        author: { en: 'Lin D.', zh: '林先生' },
        rating: 5,
        text: {
          en: 'The P-Tau217 biomarker result was reassuring. Hard to get this panel anywhere else in the city.',
          zh: 'P-Tau217 结果让人放心，这套检查在其他地方很难约到。',
        },
      },
      {
        author: { en: 'Xu P.', zh: '徐女士' },
        rating: 4,
        text: {
          en: 'Facility is clean and modern. Pricing wasn\'t cheap but the depth of the analysis justified it.',
          zh: '环境干净整洁，价格不算便宜但分析的深度完全配得上。',
        },
      },
      {
        author: { en: 'Sun K.', zh: '孙先生' },
        rating: 5,
        text: {
          en: 'The follow-up consultation with Prof. Guo was the best part — actionable lifestyle recommendations, not just a PDF.',
          zh: '最棒的是和郭教授的复诊咨询，给了实际可执行的生活方式建议，不只是一份PDF报告。',
        },
      },
      {
        author: { en: 'Yang F.', zh: '杨女士' },
        rating: 5,
        text: {
          en: 'Booked for both parents. Staff coordinated everything smoothly and results came back within a week.',
          zh: '给父母两人都预约了，工作人员协调得井井有条，一周内就拿到了结果。',
        },
      },
    ],
    heroColor: '#004d5b',
    heroColorEnd: '#006778',
  },

  // ── Insurance ──
  {
    id: 'insurance-prime',
    category: 'insurance',
    title: {
      en: 'Basheng Premium Health Protection',
      zh: '柏盛健康 · 高端医疗保险',
    },
    subtitle: {
      en: 'Whole-family cognitive & inpatient protection.',
      zh: '全家认知健康与住院医疗保障。',
    },
    description: {
      en: 'Premium inpatient insurance underwritten by Basheng Health. Global VIP ward access, pre-existing conditions accepted after a 6-month stable period, dedicated health concierge, and fast-track appointments at top neurology and cognitive care centers.',
      zh: '由柏盛健康承保的高端住院医疗保险。全球特需/VIP病房、既往症6个月稳定期可投保、一对一健康管家以及神经内科与认知康复领域的权威医院绿色通道。',
    },
    price: 2999,
    priceLabel: { en: '/year', zh: '/年 起' },
    hidePrice: true,
    heroImage: require('../assets/services/insurance-basheng-hero.png'),
    badge: { en: 'Flagship', zh: '旗舰' },
    techTag: {
      en: 'Whole-Family Cognitive Coverage',
      zh: '全家认知健康保障',
    },
    totalBookingsLabel: {
      en: '3,200+ families insured',
      zh: '3,200+ 家庭已投保',
    },
    features: {
      en: [
        'Global coverage — hospitalization, specialist outpatient, VIP wards',
        'Dementia & cognitive decline treatment included',
        'Overseas specialist treatment direct billing (up to ¥6M)',
        'Pre-existing conditions accepted (6-month stable period)',
        'Adult deductible from ¥2,000 only',
        'Personal health concierge — 1-on-1 service',
        'Fast-track access to top neurology hospitals',
        'Coverage up to ¥8,000,000 per policy year',
      ],
      zh: [
        '全球保障 — 住院医疗、特定门诊、特需/国际/VIP部就诊',
        '涵盖阿尔茨海默症及认知障碍相关诊疗费用',
        '海外专家就医直付（最高600万）',
        '既往症6个月稳定期可投保',
        '成人免赔额仅¥2,000起',
        '私人健康管家一对一服务',
        '神经内科权威医院绿色通道',
        '年度保障额度高达800万',
      ],
    },
    reviews: [
      {
        author: { en: 'Xu H.', zh: '徐先生' },
        rating: 5,
        text: {
          en: 'When my father was diagnosed, the concierge had a Beijing specialist lined up within hours. Truly a lifeline.',
          zh: '父亲确诊后，管家第一时间协调北京专家，真正的雪中送炭。',
        },
      },
      {
        author: { en: 'Zhao M.', zh: '赵女士' },
        rating: 5,
        text: {
          en: 'The VIP ward made my mother\'s recovery so much more comfortable — it really is a different level of care.',
          zh: 'VIP病房的环境让母亲康复期舒适很多，完全是另一种照护体验。',
        },
      },
      {
        author: { en: 'Wang C.', zh: '王先生' },
        rating: 5,
        text: {
          en: 'Accepting pre-existing conditions was the dealbreaker. Every other insurer turned us down — Basheng said yes.',
          zh: '既往症能投保这点救了我们全家，其他保险都拒赔，柏盛是唯一愿意承保的。',
        },
      },
      {
        author: { en: 'Lin J.', zh: '林女士' },
        rating: 5,
        text: {
          en: 'Claims settled in under two weeks. Much smoother than I expected — no runaround.',
          zh: '索赔流程比想象中顺畅，两周内到账，完全没有被拖延。',
        },
      },
      {
        author: { en: 'Chen B.', zh: '陈先生' },
        rating: 5,
        text: {
          en: 'The concierge proactively reminds us about annual check-ups. It feels like having a family doctor on retainer.',
          zh: '健康管家主动提醒年度体检，服务很贴心，像有了一位家庭医生。',
        },
      },
      {
        author: { en: 'Huang Y.', zh: '黄女士' },
        rating: 4,
        text: {
          en: 'Cognitive screening costs are reimbursable — pairs really well with the brain health package. Great value together.',
          zh: '认知筛查费用也能报销，和脑健康筛查套餐搭配用特别划算。',
        },
      },
      {
        author: { en: 'Wu K.', zh: '吴先生' },
        rating: 5,
        text: {
          en: 'Overseas referral was handled end-to-end — saved us weeks of coordination during a stressful time.',
          zh: '海外就医对接很专业，节省了大量协调时间，整个过程省心很多。',
        },
      },
      {
        author: { en: 'Zheng L.', zh: '郑女士' },
        rating: 5,
        text: {
          en: '¥8M coverage is genuinely reassuring. I no longer worry about what happens if my parents need extended hospitalization.',
          zh: '保额800万让人安心，再也不担心老人住院的后续费用。',
        },
      },
      {
        author: { en: 'Sun R.', zh: '孙先生' },
        rating: 4,
        text: {
          en: 'The advisor walked us through every exclusion in plain language. No hidden surprises.',
          zh: '顾问解释条款非常透明，每一项除外责任都讲清楚，没有行业常见的绕弯子。',
        },
      },
      {
        author: { en: 'Zhou P.', zh: '周女士' },
        rating: 5,
        text: {
          en: 'Bought plans for both my parents last year. Renewal this year was painless — one click and done.',
          zh: '去年给父母各买了一份，今年续保流程也很顺畅，一键完成。',
        },
      },
    ],
    heroColor: '#4a2e6a',
    heroColorEnd: '#6b4590',
  },

  // ── Doctors ──
  {
    id: 'doctor-guo',
    category: 'doctor',
    title: { en: 'Prof. Guo Yi', zh: '郭毅 教授' },
    subtitle: { en: 'Chief Brain Health Expert', zh: '脑健康首席专家' },
    description: {
      en: 'Leading cognitive health specialist with 30+ years of clinical experience in neurology and cognitive rehabilitation. Expert in early detection of cognitive decline using EEG and advanced biomarker analysis.',
      zh: '认知健康领域领军专家，拥有30年以上神经内科及认知康复临床经验。擅长运用脑电图和先进的生物标志物分析进行认知衰退的早期检测。',
    },
    price: 800,
    priceLabel: { en: '/visit', zh: '/次' },
    features: {
      en: [
        '30+ years neurology experience',
        'EEG & rTMS specialist',
        'Published 100+ research papers',
        'United Family Healthcare affiliation',
        'Bilingual consultations (Chinese/English)',
        'Comprehensive cognitive assessment',
      ],
      zh: [
        '30年以上神经内科经验',
        'EEG与rTMS专家',
        '发表学术论文100余篇',
        '和睦家医疗特约专家',
        '双语问诊（中/英文）',
        '全面认知健康评估',
      ],
    },
    reviews: [
      {
        author: { en: 'Liu S.', zh: '刘先生' },
        rating: 5,
        text: {
          en: 'Prof. Guo is incredibly thorough and compassionate. He took the time to explain every result to our family.',
          zh: '郭教授非常细致且富有同理心，耐心地向我们全家解释每一项结果。',
        },
      },
      {
        author: { en: 'Yang W.', zh: '杨女士' },
        rating: 5,
        text: {
          en: 'Best neurologist we\'ve seen. His early detection approach gave us a clear action plan.',
          zh: '我们见过的最好的神经科医生，他的早期检测方法为我们制定了清晰的行动方案。',
        },
      },
    ],
    heroColor: '#004d5b',
    heroColorEnd: '#1a6a78',
    doctorEmoji: '👨‍⚕️',
    availability: { en: 'Available this week', zh: '本周可预约' },
  },
  {
    id: 'doctor-chen',
    category: 'doctor',
    title: { en: 'Dr. Chen', zh: '陈医生' },
    subtitle: { en: 'Neurology', zh: '神经内科' },
    description: {
      en: 'Experienced neurologist specializing in cognitive disorders, sleep-related cognitive issues, and neurodegenerative disease management. Known for her patient-centered approach and clear communication.',
      zh: '资深神经内科医师，专长认知障碍、睡眠相关认知问题及神经退行性疾病管理。以患者为中心的诊疗理念和清晰的沟通方式著称。',
    },
    price: 600,
    priceLabel: { en: '/visit', zh: '/次' },
    features: {
      en: [
        '15+ years clinical neurology',
        'Sleep & cognition specialist',
        'Medication management expert',
        'Follow-up care coordination',
        'Patient education focus',
        'Telehealth available',
      ],
      zh: [
        '15年以上临床神经内科经验',
        '睡眠与认知专家',
        '药物管理专家',
        '随访护理协调',
        '注重患者健康教育',
        '支持远程问诊',
      ],
    },
    reviews: [
      {
        author: { en: 'Sun Q.', zh: '孙先生' },
        rating: 5,
        text: {
          en: 'Dr. Chen is very approachable and explains complex medical terms in simple language.',
          zh: '陈医生非常亲切，能将复杂的医学术语用通俗的语言解释清楚。',
        },
      },
    ],
    heroColor: '#6d3800',
    heroColorEnd: '#8f5a1a',
    doctorEmoji: '👩‍⚕️',
    availability: { en: 'Available this week', zh: '本周可预约' },
  },
  {
    id: 'doctor-li',
    category: 'doctor',
    title: { en: 'Dr. Li', zh: '李医生' },
    subtitle: { en: 'Cognitive Rehabilitation', zh: '认知康复' },
    description: {
      en: 'Specialist in cognitive rehabilitation therapy, helping patients regain and maintain cognitive function through structured programs, lifestyle interventions, and personalized training plans.',
      zh: '认知康复治疗专家，通过结构化训练方案、生活方式干预和个性化训练计划，帮助患者恢复和维持认知功能。',
    },
    price: 500,
    priceLabel: { en: '/visit', zh: '/次' },
    features: {
      en: [
        '10+ years cognitive rehabilitation',
        'Personalized training programs',
        'Lifestyle intervention planning',
        'Caregiver guidance & support',
        'Progress tracking & reporting',
        'Group therapy sessions available',
      ],
      zh: [
        '10年以上认知康复经验',
        '个性化训练方案',
        '生活方式干预规划',
        '照护者指导与支持',
        '进展追踪与报告',
        '提供团体康复课程',
      ],
    },
    reviews: [
      {
        author: { en: 'Ma Y.', zh: '马女士' },
        rating: 5,
        text: {
          en: 'Dr. Li created a wonderful rehab plan for my mother. We saw real improvements within weeks.',
          zh: '李医生为我母亲制定了很好的康复计划，几周内就看到了明显改善。',
        },
      },
    ],
    heroColor: '#0f6a5f',
    heroColorEnd: '#1a8a7d',
    doctorEmoji: '👨‍⚕️',
    availability: { en: 'Next week', zh: '下周可预约' },
  },
];

export function getServiceById(id: string): ServiceItem | undefined {
  return services.find((s) => s.id === id);
}

export function getServicesByCategory(category: ServiceCategory): ServiceItem[] {
  return services.filter((s) => s.category === category);
}

export function getFeaturedServices(): ServiceItem[] {
  return [
    services.find((s) => s.id === 'screening-comprehensive')!,
    services.find((s) => s.id === 'insurance-prime')!,
    services.find((s) => s.id === 'doctor-guo')!,
  ];
}
