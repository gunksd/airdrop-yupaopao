import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">页面未找到。您访问的页面可能已被移除或不存在。</p>
        <Link
          href="/"
          className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}

