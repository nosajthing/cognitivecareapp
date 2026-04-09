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
  badge?: { en: string; zh: string };
  doctorEmoji?: string;
  availability?: { en: string; zh: string };
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
    title: { en: 'Comprehensive Brain Health Screening', zh: '脑健康综合筛查' },
    subtitle: { en: 'United Family Healthcare × Prof. Guo Yi · EEG + rTMS', zh: '和睦家医疗 × 郭毅教授团队 · EEG + rTMS 技术' },
    description: {
      en: 'Our most thorough assessment combining blood biomarkers, brain MRI imaging, and full metabolic panels with all Standard screening items. Recommended for comprehensive cognitive health evaluation.',
      zh: '最全面的评估方案，结合血液生物标志物、颅脑MRI影像学和完整代谢指标检测，包含标准版全部项目。推荐用于全面认知健康评估。',
    },
    price: 7800,
    originalPrice: 11000,
    priceLabel: { en: '/package', zh: '/套餐' },
    badge: { en: 'Recommended', zh: '推荐' },
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
        author: { en: 'Li J.', zh: '李先生' },
        rating: 5,
        text: {
          en: 'Worth every penny. The MRI and biomarker results gave us real peace of mind about my father\'s health.',
          zh: '物有所值。MRI和生物标志物检查结果让我们对父亲的健康状况安心了不少。',
        },
      },
      {
        author: { en: 'Chen Y.', zh: '陈女士' },
        rating: 5,
        text: {
          en: 'Extremely comprehensive. Found an issue early that we were able to address right away.',
          zh: '非常全面。早期发现了一个问题，我们及时进行了干预。',
        },
      },
      {
        author: { en: 'Huang R.', zh: '黄先生' },
        rating: 4,
        text: {
          en: 'Professional service from start to finish. The follow-up consultation was very helpful.',
          zh: '从始至终服务专业，复诊咨询帮助很大。',
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
    title: { en: 'Prime Health Protection', zh: '和睦致逸 高端医疗保险' },
    subtitle: { en: 'Prosper Health × Allianz', zh: '万欣和 Prosper Health × 京东安联 Allianz' },
    description: {
      en: 'Comprehensive health insurance with global coverage, VIP ward access, and pre-existing condition acceptance. Includes personal health concierge service and fast-track access to top hospitals.',
      zh: '全球覆盖的高端医疗保险，含特需/VIP部就诊、既往症可投保。包含私人健康管家服务和权威医疗机构绿色通道。',
    },
    price: 2999,
    priceLabel: { en: '/year', zh: '/年 起' },
    features: {
      en: [
        'Global coverage — hospitalization, specialist outpatient, VIP wards',
        'Overseas cancer treatment direct billing (up to ¥6M)',
        'Pre-existing conditions accepted (6-month stable period)',
        'Adult deductible from ¥2,000 only',
        'Personal health concierge — 1-on-1 service',
        'Fast-track access to top hospitals',
        'Coverage up to ¥8,000,000',
      ],
      zh: [
        '保障覆盖全球 — 住院医疗、特定门诊、特需部/国际部/VIP部就诊',
        '恶性肿瘤海外就医直付（最高600万）',
        '既往症6个月稳定期可投保',
        '成人免赔额仅¥2,000',
        '私人健康管家一对一服务',
        '权威医疗机构绿色通道',
        '保障额度高达800万',
      ],
    },
    reviews: [
      {
        author: { en: 'Xu H.', zh: '徐先生' },
        rating: 5,
        text: {
          en: 'The health concierge service is exceptional. They helped arrange everything when my mother needed hospitalization.',
          zh: '健康管家服务非常出色，母亲住院时帮忙安排了一切。',
        },
      },
      {
        author: { en: 'Zhao M.', zh: '赵女士' },
        rating: 5,
        text: {
          en: 'Great value for the coverage. The VIP ward access made a real difference during recovery.',
          zh: '保障性价比很高，VIP病房体验让康复过程舒适很多。',
        },
      },
    ],
    heroColor: '#6d3800',
    heroColorEnd: '#8f4c00',
    badge: { en: 'Prime', zh: 'Prime' },
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
