-- 创建空投项目表
CREATE TABLE IF NOT EXISTS airdrops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('进行中', '结束')),
  release_date TEXT,
  airdrop_date TEXT,
  profit TEXT,
  twitter_link TEXT,
  funding TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()),
  created_by TEXT,
  updated_by TEXT
);

-- 启用行级安全
ALTER TABLE airdrops ENABLE ROW LEVEL SECURITY;

-- 创建策略：任何人都可以读取
CREATE POLICY "任何人都可以读取空投项目" ON airdrops
FOR SELECT USING (true);

-- 创建策略：只有管理员可以插入、更新和删除（基于Twitter用户名）
CREATE POLICY "只有管理员可以创建空投项目" ON airdrops
FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'name')::text IN (SELECT twitter_username FROM user_roles WHERE role = 'admin')
);

CREATE POLICY "只有管理员可以更新空投项目" ON airdrops
FOR UPDATE USING (
  (auth.jwt() ->> 'name')::text IN (SELECT twitter_username FROM user_roles WHERE role = 'admin')
);

CREATE POLICY "只有管理员可以删除空投项目" ON airdrops
FOR DELETE USING (
  (auth.jwt() ->> 'name')::text IN (SELECT twitter_username FROM user_roles WHERE role = 'admin')
);

