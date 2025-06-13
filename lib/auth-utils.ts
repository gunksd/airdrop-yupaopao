// 管理员 Twitter 用户名列表
export const ADMIN_TWITTER_USERNAMES = ["wnyn12075574", "yupaopao0"]

// 检查用户是否是管理员
export function isAdmin(username?: string): boolean {
  if (!username) return false
  return ADMIN_TWITTER_USERNAMES.includes(username.toLowerCase())
}
