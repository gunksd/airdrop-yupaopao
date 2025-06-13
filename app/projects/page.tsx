import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

export const metadata: Metadata = {
  title: "项目",
  description: "查看我的项目和作品",
}

const projects = [
  {
    title: "个人网站",
    description: "使用 Next.js 和 Tailwind CSS 构建的个人网站",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&h=675&auto=format&fit=crop",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/username/personal-website",
    demo: "https://personal-website.com",
  },
  {
    title: "电子商务平台",
    description: "全栈电子商务平台，支持支付和订单管理",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&h=675&auto=format&fit=crop",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    github: "https://github.com/username/ecommerce",
    demo: "https://ecommerce-demo.com",
  },
  {
    title: "任务管理应用",
    description: "简单的任务管理应用，支持拖放功能",
    image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=1200&h=675&auto=format&fit=crop",
    tags: ["React", "TypeScript", "Tailwind CSS", "DnD"],
    github: "https://github.com/username/task-manager",
    demo: "https://task-manager-demo.com",
  },
  {
    title: "博客平台",
    description: "支持 Markdown 的博客平台",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&h=675&auto=format&fit=crop",
    tags: ["Next.js", "MDX", "Tailwind CSS"],
    github: "https://github.com/username/blog-platform",
    demo: "https://blog-platform-demo.com",
  },
]

export default function ProjectsPage() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">项目</h1>
        <p className="text-muted-foreground">查看我的项目和作品</p>
      </div>
      <div className="grid gap-6 pt-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <div key={tag} className="rounded-md bg-muted px-2 py-1 text-xs">
                    {tag}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </Link>
              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                <Button size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  演示
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
