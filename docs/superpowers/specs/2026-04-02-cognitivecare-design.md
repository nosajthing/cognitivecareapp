# CognitiveCare — 认知健康早筛与长期管理平台

## Overview

Hackathon MVP：一个 React Native (Expo) APP，用 AI 语音识别和分析实现认知健康筛查，生成个性化报告，并提供长期趋势跟踪。面向个人用户和家庭。

**约束**：1-2人，3-4小时，hackathon demo 级别。

---

## Design Direction: Soft Organic

**Tone**：温柔、耐心、可靠 — 像一位家庭医生。

**Typography**：
- Display/Heading: Newsreader (serif, weight 300-600)
- Body/UI: DM Sans 或 system font (weight 400-600)

**Color Palette**：
| Token | Value | Usage |
|-------|-------|-------|
| `ink` | #3d2b1f | 主要文字 |
| `ink-soft` | #6b5c4f | 次要文字 |
| `ink-muted` | #a08060 | 辅助文字 |
| `cream` | #fdf6ee | 主背景 |
| `cream-warm` | #f5e6d3 | 渐变/强调背景 |
| `terracotta` | #8b5e3c | 主色/CTA |
| `sand` | #d4b896 | 边框/分割线 |
| `olive` | #6b8e5a | 成功/低风险 |
| `rose` | #c45a5a | 警告/高风险 |

**Visual Traits**：
- 圆形元素（评分环、头像、图标底）
- 虚线分割（不是实线），轻盈感
- 渐变背景（warm cream → cream）
- 大字号、大间距，老年友好
- 意大利斜体用于标签和引导文字

---

## App Architecture

### Navigation (Bottom Tabs)
1. **首页** — 问候 + 评分概览 + 快速操作
2. **报告** — 历史报告列表
3. **趋势** — 认知评分变化趋势图
4. **我的** — 个人信息 + 设置

### Core Screens (MVP 必做)
1. **Onboarding/Login** — Firebase Auth (手机号 or 微信, hackathon 用邮箱即可)
2. **首页** — 上次评分 + 快速开始评估
3. **测试引导** — 说明当前测试的规则和方法
4. **语义流畅性测试** — 倒计时 + 实时语音识别 + 词汇展示
5. **词汇回忆测试** — AI 播报词汇列表 → 用户口述回忆
6. **注意力测试** — 连续减7，语音作答
7. **测试完成** — 过渡页
8. **AI 报告** — 综合评分 + 各维度进度条 + AI 分析建议
9. **历史报告列表** — 按时间排列的报告
10. **趋势图** — 折线图展示评分变化

### 尽量做
- 画钟测试（拍照 + GPT-4 Vision）
- 家属分享功能
- 推送提醒复测

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Expo SDK 52+ (Expo Router) | 最快的 RN 开发体验 |
| Auth | Firebase Auth | 零配置，支持多种登录方式 |
| Database | Cloud Firestore | 实时同步，Schema-free |
| Storage | Firebase Storage | 存储音频/图片 |
| AI - Speech | OpenAI Whisper API | 中文语音识别精度高 |
| AI - Analysis | OpenAI GPT-4o | 认知分析 + 报告生成 |
| AI - Vision | GPT-4o Vision (stretch) | 画钟测试分析 |
| Charts | react-native-chart-kit 或 victory-native | 趋势图表 |
| Audio | expo-av | 录音功能 |

### Backend Architecture (Minimal)

不需要自建后端。Firebase Cloud Functions 处理 AI API 调用，避免在客户端暴露 API key。

```
User App (Expo)
  ↕ Firebase Auth
  ↕ Firestore (用户数据 + 测试结果 + 报告)
  → Cloud Function → OpenAI Whisper (语音转文字)
  → Cloud Function → OpenAI GPT-4o (认知分析 + 报告)
```

### Data Model (Firestore)

```
users/{userId}
  - name, age, gender, createdAt

users/{userId}/assessments/{assessmentId}
  - createdAt
  - status: 'in_progress' | 'completed'
  - tests: {
      semanticFluency: { words: [], duration, audioUrl },
      wordRecall: { presented: [], recalled: [], audioUrl },
      attention: { answers: [], correctCount, audioUrl },
      clockDrawing?: { imageUrl, analysis }
    }
  - report: {
      overallScore: number,
      dimensions: { memory, language, attention, executive },
      riskLevel: 'low' | 'medium' | 'high',
      aiAnalysis: string,
      recommendations: string[]
    }
```

---

## Cognitive Tests Design

### Test 1: 语义流畅性 (Semantic Fluency)
- 提示用户：60秒内说出尽可能多的某类词汇（如"动物"）
- 实时录音 → 每5-10秒发送音频片段 → Whisper 转文字
- 前端实时展示已识别词汇
- AI 分析：词汇总量、重复率、类别切换频率、停顿模式

### Test 2: 词汇延迟回忆 (Delayed Word Recall)
- AI 朗读10个常见词汇（TTS or 预录音频）
- 等待1-2分钟后，用户口述回忆
- Whisper 识别 → 比对原始列表
- AI 分析：回忆准确率、顺序效应、干扰项

### Test 3: 注意力与计算 (Serial 7s)
- 提示：从100开始，每次减7
- 用户语音作答：93, 86, 79, 72, 65
- Whisper 识别 → 验证每步答案
- AI 分析：准确率、反应时间、错误模式

### Test 4 (Stretch): 画钟测试
- 用户在纸上画钟 → 拍照上传
- GPT-4o Vision 分析：数字排列、指针位置、整体对称性

---

## AI Prompt Design

### 认知分析 Prompt (GPT-4o)
```
你是一个认知健康评估 AI 助手。根据以下测试数据，生成认知健康评估报告。

测试结果：
- 语义流畅性：60秒内说出 {count} 个{category}名称，重复 {duplicates} 次
- 词汇回忆：10个词中回忆出 {recalled} 个
- 注意力计算：5步中正确 {correct} 步

请输出 JSON 格式：
{
  "overallScore": 0-100,
  "dimensions": {
    "memory": { "score": 0-100, "label": "..." },
    "language": { "score": 0-100, "label": "..." },
    "attention": { "score": 0-100, "label": "..." },
    "executive": { "score": 0-100, "label": "..." }
  },
  "riskLevel": "low|medium|high",
  "analysis": "2-3句总结性分析...",
  "recommendations": ["建议1", "建议2", "建议3"]
}

评分标准参考 MoCA (Montreal Cognitive Assessment) 的维度划分。
注意：这是辅助筛查工具，不是诊断工具，报告中请注明。
```

---

## Verification

1. **Expo 启动**：`npx expo start`，在 Expo Go 中运行
2. **登录流程**：邮箱注册 → 进入首页
3. **筛查流程**：开始评估 → 语义流畅性（对着手机说动物名） → 词汇回忆 → 注意力测试 → 查看 AI 报告
4. **报告准确性**：验证 AI 返回的 JSON 结构正确，评分合理
5. **历史记录**：完成两次评估后，查看趋势图表变化
6. **边界测试**：无语音输入时的兜底处理、网络断开提示
