CREATE DATABASE IF NOT EXISTS daily_task DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE daily_task;

CREATE TABLE IF NOT EXISTS task_template (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(200) NOT NULL COMMENT '模板名称',
    description VARCHAR(500) COMMENT '模板描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务模板表';

CREATE TABLE IF NOT EXISTS template_field (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    template_id BIGINT NOT NULL COMMENT '模板ID',
    field_name VARCHAR(100) NOT NULL COMMENT '字段名',
    field_label VARCHAR(100) NOT NULL COMMENT '字段标签',
    field_type VARCHAR(50) NOT NULL COMMENT '字段类型',
    max_length INT COMMENT '最大长度',
    required TINYINT(1) DEFAULT 0 COMMENT '是否必填',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    default_value VARCHAR(500) COMMENT '默认值',
    options TEXT COMMENT '选项列表(JSON格式)',
    INDEX idx_template_id (template_id),
    FOREIGN KEY (template_id) REFERENCES task_template(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模板字段表';

CREATE TABLE IF NOT EXISTS task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    template_id BIGINT NOT NULL COMMENT '模板ID',
    title VARCHAR(500) NOT NULL COMMENT '任务标题',
    status VARCHAR(50) DEFAULT '待开始' COMMENT '任务状态',
    progress INT DEFAULT 0 COMMENT '进度(0-100)',
    due_date DATE COMMENT '截止日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_template_id (template_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    FOREIGN KEY (template_id) REFERENCES task_template(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

CREATE TABLE IF NOT EXISTS task_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    task_id BIGINT NOT NULL COMMENT '任务ID',
    field_id BIGINT NOT NULL COMMENT '字段ID',
    field_value TEXT COMMENT '字段值',
    INDEX idx_task_id (task_id),
    INDEX idx_field_id (field_id),
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES template_field(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务数据存储表';

INSERT INTO task_template (name, description) VALUES
('通用任务', '适用于各种日常任务的通用模板'),
('工作任务', '用于管理工作相关的任务');

INSERT INTO template_field (template_id, field_name, field_label, field_type, max_length, required, sort_order, default_value, options) VALUES
(1, 'priority', '优先级', 'select', NULL, 1, 1, '中', '["高", "中", "低"]'),
(1, 'description', '详细描述', 'textarea', 2000, 0, 2, NULL, NULL);

INSERT INTO template_field (template_id, field_name, field_label, field_type, max_length, required, sort_order, default_value, options) VALUES
(2, 'project', '所属项目', 'text', 200, 1, 1, NULL, NULL),
(2, 'priority', '优先级', 'select', NULL, 1, 2, '中', '["紧急", "高", "中", "低"]'),
(2, 'assignee', '负责人', 'text', 100, 0, 3, NULL, NULL),
(2, 'description', '任务描述', 'textarea', 2000, 0, 4, NULL, NULL);
