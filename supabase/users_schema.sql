-- 创建用户角色表，使用Twitter用户名作为主键
CREATE TABLE IF NOT EXISTS user_roles (
  twitter_username TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' -- 'user', 'admin', 'moderator' 等
);

-- 插入管理员用户（使用您提供的Twitter用户名）
INSERT INTO user_roles (twitter_username, role)
VALUES ('wnyn12075574', 'admin')
ON CONFLICT (twitter_username) DO UPDATE SET role = 'admin';

INSERT INTO user_roles (twitter_username, role)
VALUES ('yupaopao0', 'admin')
ON CONFLICT (twitter_username) DO UPDATE SET role = 'admin';
