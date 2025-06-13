import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import GithubProvider from "next-auth/providers/github"

// 简化配置，移除可能导致问题的高级选项
export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // 移除可能导致问题的回调函数
  callbacks: {
    async session({ session }) {
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
