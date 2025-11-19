# AI Calendar

这是一个基于 React 和 FullCalendar 的智能日历应用，集成了 Google Gemini AI，能够为您的日程安排提供智能建议。

## ✨ 功能特性

- **日历视图**：支持月、周、日视图切换。
- **日程管理**：
  - 点击日期添加新日程。
  - 点击日程进行编辑或删除。
- **AI 智能建议**：
  - 集成 Google Gemini AI。
  - 根据日程标题（如“面试”、“旅行”、“会议”等）自动生成准备建议、注意事项等。
- **导出功能**：支持将日程导出为 iCalendar (.ics) 文件，方便导入到其他日历应用。

## 🛠 技术栈

- **前端框架**：React + TypeScript + Vite
- **日历组件**：FullCalendar
- **AI 服务**：Google Gemini API
- **包管理**：pnpm

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-calendar
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

在项目根目录下创建 `.env` 文件，并添加您的 Google Gemini API Key：

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

> 您可以在 [Google AI Studio](https://aistudio.google.com/) 申请 API Key。

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173` 即可预览。

### 5. 构建生产版本

```bash
pnpm build
```

构建产物将生成在 `dist` 目录下。

## 📂 项目结构

```text
src/
├── components/
│   ├── calendar/
│   │   ├── CustomCalendar.tsx  # 主日历组件
│   │   ├── EventModal.tsx      # 日程编辑/添加弹窗
│   │   ├── CalendarConfig.ts   # 日历配置
│   │   └── CalendarExport.ts   # 导出功能逻辑
│   └── utils/
│       └── EventUtils.tsx      # 事件工具函数
├── services/
│   └── AIService.ts            # AI 服务接口
├── App.tsx
└── main.tsx
```
