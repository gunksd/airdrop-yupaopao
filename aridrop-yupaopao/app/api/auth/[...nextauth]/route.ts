import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import GithubProvider from "next-auth/providers/github"

// 指定运行时为 Node.js 而非 Edge
export const runtime = "nodejs" // 默认值

// 配置 NextAuth
export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.username, // 确保我们获取 Twitter 用户名
          email: profile.data.email,
          image: profile.data.profile_image_url,
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  // 添加会话策略
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  // 配置cookie
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30天
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      // 将 Twitter 用户名添加到会话中
      if (token.name) {
        session.user.name = token.name
      }
      // 添加用户ID到会话中
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      // 首次登录时，将用户信息添加到token
      if (user) {
        token.id = user.id
        // 确保Twitter用户名被保存到token中
        if (user.name) {
          token.name = user.name
        }
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

