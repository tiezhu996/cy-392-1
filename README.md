# 手工作品瀑布流展示墙

面向手工爱好者的作品上传、浏览、收藏和作者主页管理工具，以瀑布流方式展示编织、木工、陶艺等作品。

## 项目主要功能

- 多图作品上传，记录材料、制作时长、难度和教程链接
- Pinterest 风格瀑布流与图片懒加载
- 作品详情、图片轮播、材料清单和制作步骤
- 分类、难度、最新和最热排序筛选
- 点赞、收藏、收藏夹集中管理
- 作者主页与关注/取关
- 关键词搜索作品名称和描述
- 亮色/暗色主题切换

## 本地开发方式

```bash
cd frontend
npm install
npm run dev
```

访问地址：http://localhost:18412

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端框架 | Vue 3 + TypeScript |
| UI | Naive UI + 自定义 Masonry |
| 图片懒加载 | Intersection Observer API |
| 状态管理 | Pinia |
| 构建工具 | Vite |
| 持久化 | IndexedDB |

## 项目目录结构

```text
frontend/
├── src/
│   ├── views/
│   ├── components/
│   ├── composables/
│   ├── stores/
│   ├── storage/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   ├── mock/
│   ├── styles/
│   └── App.vue
├── public/
└── package.json
```

## License

MIT
