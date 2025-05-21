export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-12 tracking-tighter">
          PRIVACY POLICY
        </h1>

        <div className="space-y-8 text-white/80 font-mono">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              1. DATA COLLECTION
            </h2>
            <p>
              MonkLog operates with military-grade precision in data collection.
              We collect:
            </p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Account information (email, username)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Usage data and interaction patterns
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Chat history and habit tracking data
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Performance metrics and progress data
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">2. DATA USAGE</h2>
            <p>Your data fuels your transformation. We use it to:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Personalize your training experience
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Optimize mentor responses and challenges
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Track your progress and achievements
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Improve our battle-tested systems
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              3. DATA PROTECTION
            </h2>
            <p>We protect your data like a fortress:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                End-to-end encryption for sensitive data
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Regular security audits and updates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Strict access controls and monitoring
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">4. YOUR RIGHTS</h2>
            <p>You maintain control of your data arsenal:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Access your stored information
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Request data deletion
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Export your data
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Update your preferences
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">5. CONTACT</h2>
            <p>
              For privacy-related matters, contact our Data Protection Officer
              at:
            </p>
            <p className="text-red-500">federico.monklog@gmail.com</p>
          </section>

          <div className="text-sm text-white/40 pt-8">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
