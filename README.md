# 4PL 控制塔原型整合

统一入口为 `index.html`。左侧菜单采用 OMS 物流控制塔的导航样式，三个业务原型常驻加载，切换后各自的筛选、抽屉和详情状态会保留。

## 页面映射

| 菜单 | 文件 |
| --- | --- |
| 客户订单跟踪 | `pages/customer-order-tracking.html` |
| 物流需求工作台 / 物流需求列表 | `pages/logistics-demand.html` |
| 贸易合同待办 | `pages/trade-contract-todo.html` |

## 部署

项目是纯静态站点，不需要构建。

- Git 仓库根目录直接上传本目录内容即可。
- GitHub Pages / GitLab Pages / Nginx 的站点根目录指向本目录。
- 所有页面跳转均使用相对路径，不包含本机绝对路径。
- 三个业务页面支持通过 `?embed=1` 进入集成模式；直接打开文件则保留原页面布局。

## 本地预览

建议通过 HTTP 服务访问，避免浏览器对 `file://` iframe 的限制：

```powershell
npx serve .
```

然后打开命令输出的本地地址。也可以直接双击 `index.html` 查看，大部分交互可用。

## 交互说明

- 左侧“物流需求工作台”可展开，显示“物流需求列表”。
- 物流需求列表包含“创建”和“执行中”等状态，双击数据行进入对应状态的详情页。
- 查询条件支持点击标题展开和收起；列表顶部不显示刷新、新建需求模块。
- 三个页面共用 `assets/query-conditions.css`，保持查询条件标题、字段、按钮和间距一致。
- 三个页面共用 `assets/component-system.css`，统一主色、字体层级、按钮、状态页签、表格、状态标签、行内操作、分页和图标尺寸。
- 再次点击左侧“物流需求列表”可从详情返回列表。
- 顶栏刷新按钮：重新加载当前页面。
- 外链按钮：在新窗口打开当前原型。
- URL 哈希支持直达，例如 `index.html#logistics-demand`、`index.html#trade-contract`。