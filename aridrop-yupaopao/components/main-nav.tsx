"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V5mxq70ZjiiRLppAyW22t00G5DEtG5.png"
            alt="鱼泡泡"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <span className="hidden font-bold sm:inline-block">鱼泡泡空投</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          首页
        </Link>
        <Link
          href="/airdrops"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/airdrops") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          空投项目
        </Link>
        <Link
          href="/discussions"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/discussions") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          讨论区
        </Link>
      </nav>
    </div>
  )
}

