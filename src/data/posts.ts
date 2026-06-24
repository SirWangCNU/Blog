export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "storyboard-prompt-v5",
    title: "漫剧工厂 — 故事版提示词 5.0",
    excerpt:
      "漫剧工厂 Storyboard 全链路提示词体系：从剧本到视频生成的三阶段导演系统（Prompt A/B/C）。",
    date: "2026-06-22",
    readTime: "20 分钟",
    tags: ["漫剧工厂", "提示词", "AIGC", "视频生成", "Storyboard"],
    category: "漫剧工厂",
    content: `
## 系统架构

漫剧工厂故事版提示词体系采用三阶段流水线架构，将剧本逐步转化为可执行的视频生成提示词。

\`\`\`
剧本输入
   │
   ▼
┌─────────────────────────────────────┐
│  Prompt A — 导演级 Storyboard Text  │  剧本 → 镜头蓝图
│  （影视预演导演）                    │  输出：10~14镜的分镜脚本
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Prompt B — SMART SHOT SHEET V2     │  镜头蓝图 → 导演板
│  （分镜主管 / 布局师）              │  输出：可视化分镜面板
│  ┌───────────┐ ┌─────────────────┐  │
│  │ 标准版    │ │ 资产驱动版      │  │
│  │ 通用场景  │ │ 匹配资产库      │  │
│  └───────────┘ └─────────────────┘  │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Prompt C — 视频执行导演            │  导演板 → 视频提示词
│  （AI视频生成）                     │  输出：Seedance 可执行 Prompt
└─────────────────────────────────────┘
\`\`\`

---

## Prompt A — 导演级 Storyboard Text

### 角色定义

**身份：** 资深影视 / 动画 / 预演导演
**唯一任务：** 将输入剧本转换为驱动后续故事板、导演板、视频提示词的**镜头蓝图**。

### 输出要求

必须包含：镜头顺序、机位、Blocking、站位、动作因果、空间连续性、转场、声音节拍、情绪曲线。

### 核心原则（优先级递减）

| 优先级 | 原则 | 说明 |
|:---:|------|------|
| 1 | **剧情因果** | 镜头间必须动作连贯，不可跳帧 |
| 2 | **空间连续性** | 固定划分 Zone A/B/C/D，禁止无故跳区 |
| 3 | **人物调度** | 身份、年龄、服装、受伤状态、道具持有前后一致 |
| 4 | **镜头语言** | 每镜必须指定转场类型 |
| 5 | **画面美感** | 禁止因炫技破坏剧情 |

### 每镜六要素（缺一不可）

- **Who** → 谁在画面中
- **Where** → 在什么位置
- **What** → 做什么动作
- **Why** → 为什么做（因果）
- **Camera** → 什么镜头
- **Transition** → 什么转场

### 硬性规则

- **单镜单一信息点：** 禁止同一镜混合人物登场、情绪变化、道具出现、世界观、战斗爆发——必须拆分
- **因果链：** 镜头间必须动作连贯（例：逼近→抵挡→接触→反震→松脱，不可跳帧）
- **空间统一：** 固定划分 Zone A/B/C/D，所有人物归属明确，禁止无故跳区
- **角色连续：** 身份、年龄、服装、受伤状态、道具持有必须前后一致（如右手受伤后不得恢复）
- **道具状态链：** 必须记录关键道具的完整状态序列（如佩戴→松脱→坠落→碎裂→碎片停留），禁止跳跃
- **对白：** 不可改写，仅标记 \`dialogue_start\` / \`continue\` / \`end\` 并注明对应镜头
- **声音：** 每镜标注 \`sound:\`，内容不可为空（如：风声、脚步、尖啸等）
- **转场：** 每镜必须指定（允许：\`cut\`, \`match cut\`, \`whip pan\`, \`push in\`, \`pull out\`, \`hold\`, \`rack focus\`, \`POV shift\`）
- **时长：** 总片段约 10 秒，拆分为 10~14 镜，单镜 0.5~1.2 秒

### 输出格式

\`\`\`
SCENE TITLE: [场景标题]
GENRE: [类型]
MOOD: [情绪基调]
LOCATION: [地点]
SCENE GOAL: [场景目标]
SPACE MAP:
  Zone A: [区域描述]
  Zone B: [区域描述]
  Zone C: [区域描述]
  Zone D: [区域描述]
START FRAME: （桥接帧，宽横构图，电影感）

S01
time: 0.0-0.8
camera: low angle OTS
zone: Zone B
subject: [角色名]
action: [动作]
emotion: [情绪]
dialogue: [对白或 none]
sound: [声音]
transition: [转场类型]

S02
...

STATE CHAIN（人物状态链 + 道具状态链，逐镜记录变化）
END BEAT（下一镜开始前必须保留的状态，不可复制 SXX）
DIRECTOR NOTES（核心冲突、因果锚点、连续性要点、下段承接、不可丢失信息）
\`\`\`

### 硬性禁止

❌ 小说化叙述、心理描写
❌ 增删剧情 / 角色 / 道具
❌ 改写对白
❌ 省略因果镜头
❌ 破坏空间
❌ 输出表格 / YAML / 代码块

---

## Prompt B — SMART SHOT SHEET V2（标准版）

### 角色定义

**身份：** 电影预演导演 / 分镜主管 / 电影级布局师
**任务：** 将 Storyboard Text 转化为**导演板**（Director Board），供 AI 视频生成使用。

### 固定输出布局（按顺序）

1. **HEADER** — PART / SCENE TITLE / GENRE / MOOD / LOCATION / DURATION / SHOT COUNT
2. **START FRAME** — 桥接前一镜的情绪，宽横构图，电影感，禁止复制 S01
3. **SHOT GRID** — 展示 S01~SXX（推荐 10~14 镜），每格含 KEYFRAME / CAMERA / ACTION / SOUND / TRANSITION
4. **BLOCKING FLOW** — 人物运动路线、站位变化，用箭头标注"谁→向哪里→原因"
5. **CAMERA RHYTHM** — 镜头序列，体现呼吸、加速、爆发
6. **SOUND BEAT** — 声音时间线，禁止缺失
7. **END BEAT** — 下一镜开始前必须保留的状态
8. **DIRECTOR NOTES** — CORE CONFLICT / CAMERA LANGUAGE / SOUND DESIGN / COLOR SCRIPT / CONTINUITY WARNING

### 视觉风格

> 专业导演板，电影预演级，AAA 游戏过场，3D 动漫电影质感，干净布局，高可读性，信息密集。

### 核心目标

> 让另一模型仅凭此板推导：镜头顺序、空间关系、动作逻辑、声音节拍、转场逻辑、下一镜承接。

### 硬性禁止

❌ 海报 / 插画 / 漫画阅读顺序 / 概念设计 / 拼贴 / 社交媒体封面
❌ 人物漂移、镜头顺序错乱、空间跳跃、动作缺帧
❌ 缺失 SOUND BEAT、BLOCKING FLOW、CAMERA RHYTHM、END BEAT
❌ 水印、Logo、随机文字

---

## Prompt B — SMART SHOT SHEET V2（资产驱动版）

### 角色定义

**身份：** Film Previs Director / Storyboard Supervisor / Cinematic Layout Artist / Director Board Composer
**任务：** 将 Storyboard Text + Asset Library 转换为 AI 视频生成用导演板，**所有视觉元素 100% 匹配资产库**。

### 资产库内部约束（隐形记录，不显示）

| 类型 | 锁定字段 |
|------|----------|
| **角色** | 年龄 / 身高 / 体型 / 面部 / 发型 / 发色 / 服装 / 配饰 / 特征 / 基础姿态 / 表情范围 → 全镜锁定 |
| **道具** | 名称 / 用途 / 材质 / 颜色 / 纹理 / 大小 / 状态 / 互动逻辑 → 全镜锁定 |
| **场景** | 地形 / 结构 / 植被 / 光源方向 / 色温 / 色调 / 时间 / 天气 / 大气 → 全镜锁定 |

### 固定输出布局（10 模块）

1. **HEADER** — PART / SCENE TITLE / GENRE / MOOD / LOCATION / DURATION / SHOT COUNT
2. **START FRAME** — 桥接前一镜，宽横构图，电影感，不复制 S01，元素必须匹配资产库
3. **SHOT GRID** — S01~SXX（推荐 10~14 镜），每格含 KEYFRAME / CAMERA / ACTION / SOUND / TRANSITION
4. **BLOCKING FLOW** — Zone A/B/C/D 位置，角色运动路线及动作说明
5. **CAMERA RHYTHM** — 镜头序列，体现呼吸/加速/爆发，呈现资产库关键特征
6. **SOUND BEAT** — 时间线格式：0.0s 环境声 / 2.0s 角色声 / 3.5s 动作声 …
7. **CAUSAL CHAIN** — 事件触发 → 反应 → 结果 → 转折
8. **STATE CHAIN** — 角色状态链 + 道具状态链，变化在资产库定义范围内
9. **END BEAT** — 下一镜开始前必须保留的状态，不复制 SXX，匹配资产库
10. **DIRECTOR NOTES** — CORE CONFLICT / CAMERA LANGUAGE / SOUND DESIGN / COLOR SCRIPT / CONTINUITY WARNING / VISUAL STYLE

### 版本选择指南

| 场景 | 推荐版本 |
|------|----------|
| 快速原型 / 概念验证 | 标准版 |
| 正式生产 / 角色一致性要求高 | 资产驱动版 |
| 简单场景 / 无资产库 | 标准版 |
| 多角色连续剧 / IP 系列 | 资产驱动版 |

---

## Prompt C — 视频执行导演

### 角色定义

**身份：** Previs / Action / Cinematic / AI 视频执行导演
**唯一任务：** 读取 SMART SHOT SHEET V2 与资产库，生成严格符合的连续视频提示词

> **禁止编剧、重设计或创造新镜头**

### 输入

1. 导演板（SMART SHOT SHEET V2）
2. 角色资产
3. 场景资产
4. 道具资产

### 优先级（降序）

\`\`\`
角色一致 > 场景一致 > 道具一致 > 因果链连续 > 状态链连续 > 空间连续 > 镜头连续 > 美观
\`\`\`

### 资产锁定

| 类型 | 锁定内容 |
|------|----------|
| 角色 | 身份 / 年龄 / 发型 / 面部 / 体型 / 服装 / 配饰 |
| 场景 | 建筑 / 布局 / 天气 / 时间 / 环境 |
| 道具 | 尺寸 / 材质 / 状态 / 磨损 / 细节 |

**禁止换脸、变装、换发型、场景/道具漂移。**

### 执行流程

1. **导演板解码** — 读取 START FRAME, SHOT GRID, BLOCKING FLOW, CAMERA RHYTHM, CAUSAL CHAIN, STATE CHAIN, END BEAT；优先信任 CAUSAL/STATE CHAIN 高于单镜描述
2. **开始状态重建** — 根据 START FRAME、BLOCKING FLOW 和资产，明确初始位置/姿态/道具/环境/情绪
3. **镜头执行** — 严格按 S01→SXX 顺序执行，禁止删/跳/并/换序
4. **Blocking 执行** — 严格遵照 BLOCKING FLOW，每次移动需有起点→过程→终点，禁止瞬移
5. **因果链执行** — 所有动作必须呈现原因→行为→结果，重点展示接触、受力、冲击、状态变化过程
6. **状态链执行** — 严格保持角色、道具状态连续，禁止跳过中间状态或状态回退
7. **节奏执行** — 读取 CAMERA RHYTHM 和 SOUND BEAT，建立呼吸、变化、高潮、收束
8. **结束状态重建** — 根据 END BEAT 保证最后一帧与导演板完全一致

### 视觉风格

> Anime Cinematic，高保真 CG，电影级，一致角色/光照，自然物理，可读动作，强视觉叙事，专业镜头语言。

### 输出

> 直接输出一个适用于 \`doubao-seedance-1-5-pro\` 的最终视频提示词。不解释、不分析、不输出列表 / JSON / Markdown。

### 硬性禁止

❌ 新增角色 / 道具 / 剧情 / 镜头
❌ 改变顺序 / 换脸 / 变装 / 换发型
❌ 空间跳跃 / 瞬移 / 时间线错乱
❌ 因果 / 状态断裂 / 动作缺失
❌ 随机特效 / 镜头
❌ 脱离导演板或资产库

---

## 三阶段协作关系

\`\`\`
                    ┌──────────────┐
                    │   剧本输入   │
                    └──────┬───────┘
                           │
                    Prompt A 解读
                    导演级 Storyboard Text
                           │
                    ┌──────┴───────┐
                    │              │
              标准版 Prompt B    资产驱动版 Prompt B
              SMART SHOT SHEET   SMART SHOT SHEET
              （通用场景）        （匹配资产库）
                    │              │
                    └──────┬───────┘
                           │
                    Prompt C 执行
                    视频执行导演
                           │
                    ┌──────┴───────┐
                    │   视频输出   │
                    │  Seedance    │
                    └──────────────┘
\`\`\`

---

## 使用示例

### 输入剧本片段

> 陆沉在废墟中听到呼喊，转身发现敌人逼近，拔剑抵挡，剑被震飞，后退三步。

### Prompt A 输出示例

\`\`\`
SCENE TITLE: 废墟遭遇
GENRE: 动作 / 战斗
MOOD: 紧张 → 危机
LOCATION: 城市废墟
SCENE GOAL: 展示陆沉遭遇突袭，武器被震飞，陷入劣势

SPACE MAP:
  Zone A: 废墟入口（陆沉初始位置）
  Zone B: 碎石平台（战斗核心区）
  Zone C: 倒塌建筑（敌人出现方向）
  Zone D: 断墙后方（退路）

START FRAME: 宽横构图，废墟全景，烟尘弥漫，远处有模糊人影

S01
time: 0.0-0.8
camera: wide establishing
zone: Zone A
subject: 陆沉
action: 背对镜头站立，听到声音转头
emotion: 警觉
dialogue: none
sound: 风声 + 远处脚步
transition: cut

S02
time: 0.8-1.5
camera: close-up
zone: Zone A
subject: 陆沉面部
action: 眼神聚焦，瞳孔收缩
emotion: 察觉危险
dialogue: none
sound: 心跳声渐强
transition: rack focus

S03
time: 1.5-2.3
camera: OTS
zone: Zone C
subject: 敌人
action: 从废墟后冲出，持刀逼近
emotion: 杀意
dialogue: none
sound: 金属摩擦 + 脚步加速
transition: whip pan

S04
time: 2.3-3.0
camera: medium
zone: Zone A
subject: 陆沉
action: 右手拔剑出鞘
emotion: 冷静
dialogue: none
sound: 剑出鞘声
transition: cut

S05
time: 3.0-3.8
camera: low angle
zone: Zone B
subject: 陆沉 + 敌人
action: 双方武器碰撞
emotion: 对抗
dialogue: none
sound: 金属撞击
transition: cut

S06
time: 3.8-4.5
camera: close-up
zone: Zone B
subject: 剑刃
action: 剑身出现裂纹
emotion: 危机
dialogue: none
sound: 碎裂声
transition: hold

S07
time: 4.5-5.2
camera: medium
zone: Zone B
subject: 陆沉
action: 剑被震飞，右手虎口流血
emotion: 震惊
dialogue: none
sound: 剑飞出 + 虎口撕裂
transition: match cut

S08
time: 5.2-6.0
camera: tracking
zone: Zone B→D
subject: 陆沉
action: 后退三步，撞到断墙
emotion: 劣势
dialogue: none
sound: 脚步后退 + 碰撞
transition: push in

S09
time: 6.0-7.0
camera: insert
zone: Zone D
subject: 陆沉右手
action: 颤抖的手，血滴落
emotion: 疼痛
dialogue: none
sound: 血滴落地
transition: cut

S10
time: 7.0-8.0
camera: wide
zone: Zone B
subject: 敌人
action: 缓缓逼近，举刀
emotion: 优势
dialogue: none
sound: 沉重脚步
transition: pull out

S11
time: 8.0-9.0
camera: close-up
zone: Zone D
subject: 陆沉面部
action: 眼神从震惊转为坚定
emotion: 觉醒
dialogue: none
sound: 心跳声稳定
transition: hold

S12
time: 9.0-10.0
camera: wide cinematic
zone: Zone B
subject: 全景
action: 陆沉握拳站起，敌人举刀
emotion: 对峙
dialogue: none
sound: 风声骤停
transition: cut

STATE CHAIN:
人物：陆沉 — 平静→警觉→对抗→震惊→疼痛→觉醒→坚定
      敌人 — 隐藏→冲出→逼近→优势→举刀
道具：剑 — 持有→碰撞→裂纹→震飞→坠地（地面停留）
      右手 — 正常→虎口流血→颤抖→血滴落

END BEAT:
陆沉右手带伤握拳站起，剑在远处地面，敌人举刀逼近。
下一镜必须从「陆沉无武器、右手受伤、面对持刀敌人」的状态开始。

DIRECTOR NOTES:
核心冲突：武器被毁 vs 赤手空拳面对持刀敌人
因果锚点：碰撞→裂纹→震飞→虎口伤→后退→觉醒
连续性要点：右手伤必须持续，剑的位置固定在 Zone B 地面
下段承接：陆沉需要找到反击方式（捡拾其他武器 / 空手格斗 / 第三者介入）
不可丢失信息：剑的位置、右手伤、敌人优势、陆沉觉醒情绪
\`\`\`

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 5.0 | 2026-06-22 | 三阶段体系定稿，新增资产驱动版 Prompt B |
| 4.0 | — | 优化因果链与状态链规范 |
| 3.0 | — | 新增 SMART SHOT SHEET V2 结构 |
| 2.0 | — | 增加声音节拍与转场规范 |
| 1.0 | — | 初始版本 |
`,
  },
  {
    slug: "rabbitmq-complete-guide",
    title: "RabbitMQ 完全指南：核心概念、高级特性与生产实践",
    excerpt:
      "从 AMQP 协议原理到交换机路由、消息确认、死信队列、延迟队列，构建高可用异步消息系统的完整指南。",
    date: "2026-06-24",
    readTime: "18 分钟",
    tags: ["RabbitMQ", "消息队列", "分布式系统", "微服务", "后端"],
    category: "后端",
    content: `
## 什么是 RabbitMQ

RabbitMQ 是一个开源的**消息代理（Message Broker）**，实现了高级消息队列协议（AMQP）。它在分布式系统中承担异步通信枢纽的角色，核心价值在于**解耦、异步、削峰、可靠**。

- **解耦**：生产者和消费者互不依赖，独立部署
- **异步**：主流程不阻塞，耗时操作丢给消费者
- **削峰**：突发流量由队列缓冲，保护下游服务
- **可靠**：消息持久化 + 确认机制，防丢失

---

## 核心组件

### Producer（生产者）

发送消息到交换机的应用。生产者不直接操作队列，而是将消息交给 Exchange，由 Exchange 决定路由规则。

\`\`\`python
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='order_queue')

channel.basic_publish(
    exchange='',
    routing_key='order_queue',
    body='{"order_id": 12345, "status": "created"}'
)
connection.close()
\`\`\`

### Consumer（消费者）

从队列取消息并处理。推荐**手动确认**，确保消息处理完成后才从队列移除。

\`\`\`python
def callback(ch, method, properties, body):
    print(f" [x] Received {body.decode()}")
    process_order(body.decode())
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='order_queue', on_message_callback=callback)
channel.start_consuming()
\`\`\`

### Queue（队列）

消息的存储缓冲区，FIFO 顺序。关键属性：

- **durable**：持久化，RabbitMQ 重启后保留
- **exclusive**：仅限当前连接
- **auto_delete**：所有消费者断开后自动删除

\`\`\`python
channel.queue_declare(
    queue='important_tasks',
    durable=True,
    arguments={
        'x-message-ttl': 60000,      # 消息过期时间 60s
        'x-max-length': 10000,        # 队列最大长度
        'x-overflow': 'reject-publish' # 溢出策略
    }
)
\`\`\`

---

## Exchange 四种类型

交换机是 RabbitMQ 的路由核心，生产者发消息到 Exchange，Exchange 根据类型和路由键分发到队列。

### Direct Exchange — 精确匹配

路由键完全一致才投递。适合点对点精确路由。

\`\`\`python
channel.exchange_declare(exchange='direct_logs', exchange_type='direct')
channel.queue_bind(exchange='direct_logs', queue='error_queue', routing_key='error')
channel.basic_publish(exchange='direct_logs', routing_key='error', body='DB connection failed')
\`\`\`

### Fanout Exchange — 广播

忽略路由键，消息广播到所有绑定队列。适合日志广播、事件通知。

\`\`\`python
channel.exchange_declare(exchange='logs', exchange_type='fanout')
channel.basic_publish(exchange='logs', routing_key='', body='Log for all systems')
\`\`\`

### Topic Exchange — 通配符匹配

路由键用 \`.\` 分隔，支持 \`*\`（匹配一个词）和 \`#\`（匹配零或多个词）。

\`\`\`python
channel.exchange_declare(exchange='topic_logs', exchange_type='topic')
channel.queue_bind(exchange='topic_logs', queue='critical_queue', routing_key='*.critical')
channel.queue_bind(exchange='topic_logs', queue='order_queue', routing_key='order.#')
channel.basic_publish(exchange='topic_logs', routing_key='payment.critical', body='Payment timeout')
\`\`\`

### Headers Exchange — 头部属性匹配

根据消息头部键值对匹配，不依赖路由键。支持 \`x-match=all\`（全匹配）和 \`x-match=any\`（任一匹配）。

---

## 消息确认机制

消息确认（ACK）是防丢消息的核心手段。

| 模式 | 行为 | 风险 |
|------|------|------|
| auto_ack=True | 收到即确认 | 消费者崩溃 → 消息丢失 |
| auto_ack=False | 处理完手动 ack | 安全，推荐 |

\`\`\`python
def callback(ch, method, properties, body):
    try:
        process_message(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
\`\`\`

**预取数量**控制消费者并行度：

\`\`\`python
channel.basic_qos(prefetch_count=1)  # 一次只拿一条，处理完再拿下一条
\`\`\`

---

## 消息持久化

防丢消息的第二道防线——队列和消息都标记持久化：

\`\`\`python
# 队列持久化
channel.queue_declare(queue='durable_queue', durable=True)

# 消息持久化
channel.basic_publish(
    exchange='',
    routing_key='durable_queue',
    body='Important message',
    properties=pika.BasicProperties(delivery_mode=2)  # 2 = persistent
)
\`\`\`

---

## 死信队列（DLX）

消息被拒绝、过期或队列满时，可路由到死信交换机，避免消息直接丢弃。

\`\`\`python
# 声明死信交换机和队列
channel.exchange_declare(exchange='dlx', exchange_type='direct')
channel.queue_declare(queue='dead_letter_queue')
channel.queue_bind(exchange='dlx', queue='dead_letter_queue', routing_key='dead')

# 主队列绑定死信交换机
channel.queue_declare(
    queue='main_queue',
    arguments={
        'x-dead-letter-exchange': 'dlx',
        'x-dead-letter-routing-key': 'dead'
    }
)
\`\`\`

典型用途：
- 消费者多次拒绝 → 进入死信队列人工处理
- 消息 TTL 过期 → 延迟任务的实现基础

---

## 延迟队列

两种实现方式：

### 1. TTL + DLX 组合

消息设置 TTL，过期后进入死信队列，实现延迟效果。

### 2. 延迟插件

安装 \`rabbitmq_delayed_message_exchange\` 插件：

\`\`\`python
channel.exchange_declare(
    exchange='delayed_exchange',
    exchange_type='x-delayed-message',
    arguments={'x-delayed-type': 'direct'}
)

channel.basic_publish(
    exchange='delayed_exchange',
    routing_key='delayed_queue',
    body='Delayed message',
    properties=pika.BasicProperties(headers={'x-delay': 5000})  # 延迟 5 秒
)
\`\`\`

---

## 生产环境实践

### 订单处理系统

\`\`\`
用户下单 → [order_queue] → 库存服务扣减库存
                          → 通知服务发确认邮件
                          → 积分服务增加积分
\`\`\`

### 日志收集

\`\`\`
各服务 → [logs exchange (fanout)] → ES 索引队列 → Elasticsearch
                                    → 告警队列 → 告警服务
                                    → 归档队列 → S3 存储
\`\`\`

---

## 最佳实践清单

- ✅ **手动确认**，不用 auto_ack
- ✅ **队列 + 消息双持久化**
- ✅ **prefetch_count 按消费者能力设置**
- ✅ **死信队列兜底**，避免消息黑洞
- ✅ **监控队列深度**，用 RabbitMQ Management UI 或 Prometheus
- ✅ **连接池复用**，避免频繁建连
- ✅ **幂等消费**，同一消息处理多次结果一致

---

## 常见问题

**Q: 消息丢失怎么办？**
A: 队列 durable + 消息 delivery_mode=2 + 手动 ack + 镜像队列。

**Q: 消费者处理太慢？**
A: 增加消费者实例，调整 prefetch_count，优化消费逻辑。

**Q: 消息顺序性？**
A: 单队列单消费者保证顺序；多消费者需要业务层排序。

---

## 总结

RabbitMQ 是成熟的消息队列方案，适用于异步处理、系统解耦、流量削峰等场景。掌握 Exchange 路由、消息确认、持久化、死信队列四个核心点，就能构建可靠的异步消息系统。
  `,
  },
  {
    slug: "multimodal-rag-architecture",
    title: "多模态 RAG 系统架构设计：从文本检索到图文联合理解",
    excerpt:
      "解析多模态 RAG 的向量索引策略、跨模态检索机制与上下文融合方案，构建生产级知识问答系统。",
    date: "2026-06-11",
    readTime: "14 分钟",
    tags: ["RAG", "AIGC", "向量数据库", "多模态", "架构设计"],
    category: "AIGC",
    content: `
## 多模态 RAG 的核心挑战

传统 RAG 只处理纯文本，但企业知识库大量包含图表、流程图、截图等视觉信息。多模态 RAG 需要统一处理文本、图像、表格等多种数据形态。

## 架构分层设计

### 1. 数据摄入层（Ingestion）

文档解析采用分层策略：PDF 用 PyMuPDF 提取文本层，OCR 回退处理扫描件。图片通过 CLIP 编码为 512 维向量，表格转为 Markdown 保留结构信息。每种模态维护独立的 embedding 模型，避免语义空间污染。

### 2. 索引存储层（Index）

使用 Milvus 或 Qdrant 作为向量数据库，支持混合索引：HNSW 用于高召回向量检索，倒排索引用于关键词过滤。关键设计是建立跨模态映射表，将图片 chunk 关联到其所在文档的文本上下文，保证检索时能返回完整的图文组合。

### 3. 检索融合层（Retrieval Fusion）

采用 Reciprocal Rank Fusion（RRF）合并多路召回结果。对用户 query 做意图分类：纯文本查询走文本检索通道，包含"如图所示"等视觉指示词的查询走多模态通道。融合后的 top-k 结果经过 Cross-Encoder 重排序，显著提升相关性。

### 4. 生成层（Generation）

将检索到的文本 chunk 和图片 URL 一起注入 LLM prompt。对 GPT-4o 等原生多模态模型直接传图；对纯文本模型则用 BLIP-2 生成图片描述后拼接。流式输出时采用 SSE 推送，前端渐进渲染。

## 生产环境踩坑

- 向量维度不统一：统一用 CLIP ViT-L/14 的 768 维
- 检索延迟过高：引入缓存层，对高频 query 缓存检索结果
- 图文关联丢失：chunk 切分时保留 20% 重叠区间
    `,
  },
  {
    slug: "python-pydantic-v2-deep-dive",
    title:
      "Python 类型系统与 Pydantic V2 深度实践：从验证到序列化的全链路优化",
    excerpt:
      "掌握 Pydantic V2 的 Rust 内核、自定义校验器、递归模型与高性能序列化技巧，构建类型安全的后端服务。",
    date: "2026-06-11",
    readTime: "11 分钟",
    tags: ["Python", "Pydantic", "类型系统", "FastAPI", "后端"],
    category: "后端",
    content: `
## 为什么 Pydantic V2 是质的飞跃

Pydantic V2 用 Rust 重写了核心验证引擎，性能提升 5-50 倍。但更重要的是它的类型系统更完备，能表达更复杂的约束。

## 核心改进

### 1. 自定义校验器

\`\`\`python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    email: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()
\`\`\`

### 2. 模型继承与组合

支持通过 \`\`BaseModel\`\` 的继承实现字段复用，配合 \`\`model_config\`\` 控制行为。

### 3. 高性能序列化

V2 的 \`\`model_dump()\`\` 比 V1 的 \`\`.dict()\`\` 快 10 倍以上，支持 exclude_none、by_alias 等参数。

## 实战建议

- 优先使用 \`\`field_validator\`\` 而非 \`\`@validator\`\`
- 复杂场景用 \`\`Annotated\`\` 类型组合约束
- API 响应用 \`\`model_dump(mode='json')\`\` 确保类型安全
    `,
  },
  {
    slug: "nextjs-15-server-components-streaming",
    title:
      "Next.js 15 Server Components 与流式渲染实战：首屏性能优化全攻略",
    excerpt:
      "深入理解 RSC 运行时机制、Suspense 边界编排、流式 SSR 原理及与客户端组件的协作模式。",
    date: "2026-06-11",
    readTime: "13 分钟",
    tags: ["Next.js", "React", "Server Components", "前端", "性能优化"],
    category: "前端",
    content: `
## Server Components 运行时机制

Next.js 15 的 Server Components 在服务端执行，不发送 JavaScript 到客户端。这意味着你可以直接在组件中访问数据库、文件系统等服务端资源。

## 流式 SSR 原理

### Suspense 边界编排

\`\`\`tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
\`\`\`

Suspense 允许你将页面拆分为独立的流式块，先发送 shell，再逐步填充内容。

### 流式 SSR vs 传统 SSR

- 传统 SSR：等所有数据加载完 → 生成 HTML → 一次性发送
- 流式 SSR：先发送 shell → 数据就绪后逐块发送 → 客户端渐进渲染

## 首屏优化策略

1. 关键路径组件用 Server Component
2. 非关键内容用 Suspense 包裹
3. 数据预取用 \`fetch\` 的 \`cache: 'force-cache'\`
4. 避免在 Server Component 中使用 useState/useEffect
    `,
  },
];

export const categories = ["全部", "漫剧工厂", "前端", "后端", "AIGC", "消息队列", "工具"];
