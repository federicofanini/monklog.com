export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-12 tracking-tighter">
          COOKIE DEPLOYMENT PROTOCOL
        </h1>

        <div className="space-y-8 text-white/80 font-mono">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              1. OPERATIONAL OVERVIEW
            </h2>
            <p>
              MonkLog deploys cookies with tactical precision to enhance your
              training experience. These digital markers are essential for
              maintaining peak operational efficiency.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              2. COOKIE CLASSIFICATIONS
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-white font-bold mb-2">
                  Essential Cookies
                </h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Authentication and security protocols
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Session management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Basic platform functionality
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-white font-bold mb-2">
                  Performance Cookies
                </h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Training performance metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    System optimization data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Response time monitoring
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-white font-bold mb-2">
                  Functionality Cookies
                </h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Personalization settings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Progress tracking preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    Interface customization
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              3. COOKIE CONTROL
            </h2>
            <p>You maintain tactical control over cookie deployment:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Browser settings can be configured to reject non-essential
                cookies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Cookie preferences can be modified in your account settings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Note: Rejecting essential cookies may limit operational
                capabilities
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              4. THIRD-PARTY OPERATIONS
            </h2>
            <p>External services may deploy additional cookies:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Analytics and performance monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Payment processing systems
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">→</span>
                Authentication services
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              5. UPDATES AND MODIFICATIONS
            </h2>
            <p>
              Cookie deployment strategies may be updated to maintain optimal
              performance. Changes will be reflected in this document.
            </p>
          </section>

          <div className="text-sm text-white/40 pt-8">
            Last updated: {new Date().toLocaleDateString()}
            <p className="mt-2">
              By continuing to use MonkLog, you acknowledge and accept our
              cookie deployment protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
