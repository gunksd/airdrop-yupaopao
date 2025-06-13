import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "服务条款",
  description: "鱼泡泡空投聚合器的服务条款",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">服务条款</h1>
          <p className="text-muted-foreground">最后更新: 2025年3月1日</p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. 接受条款</h2>
            <p>
              通过访问或使用我们的网站，您同意受这些条款的约束。如果您不同意这些条款的任何部分，请不要使用我们的服务。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. 服务描述</h2>
            <p>
              我们提供一个空投项目聚合平台，帮助用户发现和了解加密货币空投项目。我们不保证任何项目的可靠性、安全性或盈利能力。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. 用户责任</h2>
            <p>您同意：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>提供准确的个人信息</li>
              <li>保护您的账户安全</li>
              <li>不从事任何非法或滥用行为</li>
              <li>自行承担使用我们服务的风险</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. 内容政策</h2>
            <p>用户生成的内容必须遵守我们的社区准则。我们保留删除任何违反这些准则的内容的权利。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. 免责声明</h2>
            <p>
              我们的服务按"原样"提供，不提供任何明示或暗示的保证。我们不对任何损失或损害负责，包括但不限于因使用我们的服务而导致的直接、间接、附带、特殊或后果性损害。
            </p>
            <p>
              加密货币投资具有高风险性，您应该只投资您能够承受损失的资金。我们不提供投资建议，所有决策都应该基于您自己的研究。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. 知识产权</h2>
            <p>网站上的所有内容，包括但不限于文本、图像、代码和设计，均为我们或我们的内容提供者所有，受版权法保护。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. 条款修改</h2>
            <p>我们保留随时修改这些条款的权利。修改后的条款将在网站上发布，继续使用我们的服务即表示您接受这些更改。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. 联系我们</h2>
            <p>如果您对我们的服务条款有任何疑问，请通过Twitter或GitHub与我们联系。</p>
          </section>
        </div>
      </div>
    </div>
  )
}
