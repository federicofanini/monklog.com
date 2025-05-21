export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-12 tracking-tighter">
          TERMS OF SERVICE
        </h1>

        <div className="space-y-8 text-white/80 font-mono">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              1. MISSION PARAMETERS
            </h2>
            <p>
              By accessing MonkLog, you agree to engage in a rigorous program of
              self-improvement. This is not a casual commitment. You are
              entering a digital dojo of discipline.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              2. CODE OF CONDUCT
            </h2>
            <p>Warriors in our ranks must:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Maintain absolute integrity in tracking and reporting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Respect the battle space of fellow warriors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Accept full responsibility for their actions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Engage with mentors and challenges with maximum effort
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              3. OPERATIONAL GUIDELINES
            </h2>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Account credentials must be protected at all times
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Sharing accounts is strictly prohibited
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Content must align with our mission of improvement
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Automated access is forbidden without authorization
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              4. SERVICE MODIFICATIONS
            </h2>
            <p>MonkLog reserves the right to:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Modify or terminate services without notice
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Update terms and conditions as needed
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Restrict access for violations
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              5. PAYMENT PROTOCOLS
            </h2>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                All payments are non-refundable
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Subscription terms are strictly enforced
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Payment failures may result in service restriction
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              6. LIMITATION OF LIABILITY
            </h2>
            <p>
              MonkLog provides tools for transformation but assumes no liability
              for:
            </p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Personal injury during challenges
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Mental or emotional stress from intense training
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Results or lack thereof from program participation
              </li>
            </ul>
          </section>

          <div className="text-sm text-white/40 pt-8">
            Last updated: {new Date().toLocaleDateString()}
            <p className="mt-2">
              By using MonkLog, you acknowledge and accept these terms in their
              entirety. No exceptions. No excuses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
