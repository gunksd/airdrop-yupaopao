import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <p className="text-center text-sm leading-loose text-foreground md:text-left">
              © {new Date().getFullYear()} 个人网站. 保留所有权利.
            </p>
            <p className="text-center text-sm font-bold text-foreground md:text-left">Created by yupaopao&awan @2025</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/donate" className="text-sm font-medium underline underline-offset-4">
              Sponsor
            </Link>
            <Link href="/privacy" className="text-sm font-medium underline underline-offset-4">
              隐私政策
            </Link>
            <Link href="/terms" className="text-sm font-medium underline underline-offset-4">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

