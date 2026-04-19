# DailyTask - 任务管理系统

一个简洁实用的任务管理系统，支持自定义任务模板，根据模板动态生成表单，并进行任务跟踪和状态管理。

## 技术栈

- **前端**: Angular 15 + Angular Material
- **后端**: Spring Boot 2.7 + MyBatis
- **数据库**: MySQL 8.0+

## 项目结构

```
DailyTask/
├── backend/                    # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dailytask/
│   │   │   │   ├── config/          # 配置类
│   │   │   │   ├── controller/      # 控制器
│   │   │   │   ├── dto/             # 数据传输对象
│   │   │   │   ├── entity/          # 实体类
│   │   │   │   ├── mapper/          # MyBatis Mapper 接口
│   │   │   │   ├── service/         # 服务层
│   │   │   │   │   └── impl/        # 服务实现
│   │   │   │   └── DailyTaskApplication.java  # 启动类
│   │   │   └── resources/
│   │   │       ├── application.yml   # 配置文件
│   │   │       ├── db/init.sql       # 数据库初始化脚本
│   │   │       └── mapper/           # MyBatis XML 映射文件
│   │   └── test/
│   ├── pom.xml
│   └── target/                       # 编译输出
│
└── frontend/                   # 前端项目
    ├── src/
    │   ├── app/
    │   │   ├── components/           # 组件
    │   │   │   ├── template-list/    # 模板列表
    │   │   │   ├── template-edit/    # 模板编辑
    │   │   │   ├── task-list/        # 任务列表
    │   │   │   ├── task-edit/        # 任务编辑
    │   │   │   └── dynamic-form/     # 动态表单
    │   │   ├── models/               # 数据模型
    │   │   ├── services/             # 服务
    │   │   ├── app.component.*
    │   │   └── app.module.ts
    │   ├── environments/              # 环境配置
    │   └── styles.scss                # 全局样式
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## 功能特性

### 模板管理
- 创建、编辑、删除任务模板
- 自定义模板字段，支持多种字段类型：
  - **单行文本 (text)**
  - **多行文本 (textarea)**
  - **数字 (number)**
  - **日期 (date)**
  - **下拉选择 (select)**
  - **复选框 (checkbox)**
- 配置字段属性：字段名、显示标签、最大长度、是否必填、默认值、选项列表
- 字段排序功能

### 任务管理
- 根据模板新建任务
- 动态生成表单（根据模板字段）
- 任务列表、筛选、搜索
- 任务状态管理（待开始/进行中/已完成/已取消）
- 任务进度跟踪（0-100%）
- 任务编辑、删除

## 安装与启动

### 前置要求

确保你的环境已安装：
- JDK 8+
- Maven 3.6+
- Node.js 16+
- npm 8+
- MySQL 8.0+

### 步骤一：数据库初始化

1. 连接 MySQL 数据库，执行以下脚本创建数据库和表：

```sql
-- 使用 backend/src/main/resources/db/init.sql 文件
-- 或者直接在 MySQL 客户端执行以下命令

CREATE DATABASE IF NOT EXISTS daily_task DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改后端配置文件 `backend/src/main/resources/application.yml` 中的数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/daily_task?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

3. 首次启动时，需要手动执行 `init.sql` 中的建表语句（或者在 MySQL 客户端执行）。

### 步骤二：启动后端服务

1. 进入后端目录：
```bash
cd backend
```

2. 编译并启动：
```bash
# 方式一：使用 Maven 直接运行
mvn spring-boot:run

# 方式二：先打包，再运行
mvn clean package
java -jar target/daily-task-1.0.0.jar
```

后端服务将在 `http://localhost:8080` 启动。

### 步骤三：启动前端服务

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

前端应用将在 `http://localhost:4200` 启动。

### 步骤四：访问应用

打开浏览器访问：
- 前端应用: http://localhost:4200
- 后端 API: http://localhost:8080

## API 接口

### 模板管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/templates | 获取所有模板 |
| GET | /api/templates/{id} | 根据 ID 获取模板详情（含字段） |
| GET | /api/templates/{id}/fields | 获取模板的所有字段 |
| POST | /api/templates | 创建新模板 |
| PUT | /api/templates/{id} | 更新模板 |
| DELETE | /api/templates/{id} | 删除模板 |

### 任务管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/tasks | 获取任务列表（支持筛选） |
| GET | /api/tasks/{id} | 根据 ID 获取任务详情 |
| POST | /api/tasks | 创建新任务 |
| PUT | /api/tasks/{id} | 更新任务 |
| PUT | /api/tasks/{id}/status | 更新任务状态 |
| PUT | /api/tasks/{id}/progress | 更新任务进度 |
| DELETE | /api/tasks/{id} | 删除任务 |

### 筛选参数（GET /api/tasks）

- `templateId`: 按模板 ID 筛选
- `status`: 按状态筛选
- `keyword`: 按标题关键词搜索

## 验证方法

### 后端验证

1. 启动后端服务后，访问健康检查（如果有）：
```bash
curl http://localhost:8080/api/templates
```

2. 或使用 Postman/浏览器访问：
- http://localhost:8080/api/templates
- http://localhost:8080/api/tasks

### 前端验证

1. 访问 http://localhost:4200

2. 功能测试流程：

#### 测试模板管理
1. 点击顶部导航"模板管理"
2. 点击"新建模板"按钮
3. 填写模板名称和描述
4. 点击"添加字段"按钮，添加几个字段：
   - 字段类型选择"下拉选择"，选项填写"高,中,低"
   - 字段类型选择"多行文本"
5. 点击"保存"
6. 返回模板列表，验证新模板已创建
7. 点击编辑，修改模板信息后保存
8. 尝试删除模板（先删除基于该模板的任务）

#### 测试任务管理
1. 点击顶部导航"任务管理"
2. 点击"新建任务"
3. 选择一个模板，填写任务标题
4. 填写动态表单中的字段（根据模板字段）
5. 选择截止日期，设置状态和进度
6. 点击"保存"
7. 返回任务列表，验证新任务已创建
8. 在任务列表中：
   - 直接修改任务状态（下拉选择）
   - 拖动进度条修改进度
   - 使用筛选功能（按模板、状态、搜索）
   - 点击编辑，修改任务信息
   - 点击删除，删除任务

### 数据验证

可以连接 MySQL 数据库，查看数据是否正确保存：

```sql
USE daily_task;

-- 查看所有模板
SELECT * FROM task_template;

-- 查看所有字段定义
SELECT * FROM template_field ORDER BY template_id, sort_order;

-- 查看所有任务
SELECT * FROM task ORDER BY created_at DESC;

-- 查看任务数据
SELECT * FROM task_data;
```

## 常见问题

### 1. 数据库连接失败
- 检查 MySQL 服务是否启动
- 检查用户名密码是否正确
- 检查数据库是否已创建

### 2. 前端跨域问题
- 后端已配置 CORS，允许所有来源（`@CrossOrigin` 或 `CorsConfig`）
- 确保后端服务运行在 8080 端口，前端在 4200 端口

### 3. Maven 依赖下载失败
- 检查网络连接
- 配置阿里云 Maven 镜像：
  ```xml
  <mirrors>
    <mirror>
      <id>aliyun</id>
      <mirrorOf>central</mirrorOf>
      <name>Aliyun Maven Mirror</name>
      <url>https://maven.aliyun.com/repository/central</url>
    </mirror>
  </mirrors>
  ```

### 4. npm 安装失败
- 检查 Node.js 版本（要求 16+）
- 使用国内镜像：
  ```bash
  npm config set registry https://registry.npmmirror.com
  ```

## 开发说明

### 添加新的字段类型

1. 后端：在 `FieldTypes` 枚举（前端）或直接使用字符串
2. 前端：在 `src/app/components/dynamic-form/dynamic-form.component.html` 中添加新类型的渲染逻辑
3. 数据库：`template_field.field_type` 字段存储类型名称

### 扩展功能建议

- 用户认证和授权
- 任务评论和附件
- 任务提醒和通知
- 数据导出
- 任务统计图表
- 任务分配和协作

## License

MIT
