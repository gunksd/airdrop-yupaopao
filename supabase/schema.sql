-- 创建讨论表（如果你已经有这个表，可以跳过这一步）
CREATE TABLE IF NOT EXISTS discussions (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_image TEXT,
  author_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()),
  likes INTEGER DEFAULT 0
);

-- 启用行级安全
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

-- 创建策略：任何人都可以读取
CREATE POLICY "任何人都可以读取讨论" ON discussions
FOR SELECT USING (true);

-- 创建策略：任何人都可以插入（因为我们使用 NextAuth 进行认证）
CREATE POLICY "任何人都可以创建讨论" ON discussions
FOR INSERT WITH CHECK (true);

-- 创建策略：任何人都可以更新（因为我们使用 NextAuth 进行认证）
CREATE POLICY "任何人都可以更新点赞" ON discussions
FOR UPDATE USING (true);

-- 创建策略：作者和管理员可以删除讨论
CREATE POLICY "作者和管理员可以删除讨论" ON discussions
FOR DELETE USING (true);
