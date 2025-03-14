import Link from "next/link"

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      {/* 使用简单的文字作为Logo，避免图片问题 */}
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <span className="font-bold">P</span>
      </div>
      <span className="hidden font-bold sm:inline-block">个人网站</span>
    </Link>
  )
}

