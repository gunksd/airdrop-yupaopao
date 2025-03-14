import type { Metadata } from "next"
import { SignInForm } from "@/components/sign-in-form"

export const metadata: Metadata = {
  title: "登录",
  description: "登录您的账户",
}

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">登录账户</h1>
          <p className="text-sm text-muted-foreground">使用您的社交账户登录</p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}

