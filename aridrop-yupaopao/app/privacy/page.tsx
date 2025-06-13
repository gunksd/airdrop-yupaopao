import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "隐私政策",
  description: "鱼泡泡空投聚合器的隐私政策",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">隐私政策</h1>
          <p className="text-muted-foreground">最后更新: 2025年3月1日</p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. 信息收集</h2>
            <p>
              我们可能收集您在使用我们的服务时提供的信息，包括但不限于：您的姓名、电子邮件地址、社交媒体账号信息以及您与我们网站的互动数据。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. 信息使用</h2>
            <p>我们使用收集的信息来：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的请求和交易</li>
              <li>发送与服务相关的通知</li>
              <li>防止欺诈和滥用</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. 信息共享</h2>
            <p>我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>经您同意</li>
              <li>遵守法律要求</li>
              <li>保护我们的权利和财产</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. 数据安全</h2>
            <p>我们采取合理的措施保护您的个人信息，但请注意，互联网传输方式无法保证100%的安全性。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Cookie使用</h2>
            <p>我们使用Cookie和类似技术来收集和存储信息，以提供更好的用户体验。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. 隐私政策更新</h2>
            <p>我们可能会不时更新本隐私政策。更新后的政策将在网站上发布，继续使用我们的服务即表示您接受这些更改。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. 联系我们</h2>
            <p>如果您对我们的隐私政策有任何疑问，请通过Twitter或GitHub与我们联系。</p>
          </section>
        </div>
      </div>
    </div>
  )
}

