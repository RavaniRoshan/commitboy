export default function DocsPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="surface px-8 py-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Commitboy Docs
            </p>
            <h1 className="text-3xl md:text-4xl mt-4">Setup in 2 minutes</h1>
            <p className="text-slate-300 mt-4">
              Commitboy is a GitHub App that auto-generates and updates your changelog on
              every push to main.
            </p>
            <div className="mt-8 space-y-6">
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">1. Install the GitHub App</h2>
                <p className="text-slate-300 mt-2">
                  Add Commitboy to the repos you want automated.
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  You can pick a single repo or your whole org.
                </p>
              </div>
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">2. Push to main</h2>
                <p className="text-slate-300 mt-2">
                  Commitboy listens for the webhook and turns commits into a clean
                  changelog.
                </p>
              </div>
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">3. Review the output</h2>
                <p className="text-slate-300 mt-2">
                  Your `CHANGELOG.md` updates automatically with a structured release.
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Free tier includes watermark. Pro removes it.
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/" className="ghost-button">
                Back to landing
              </a>
              <a
                href="https://github.com/RavaniRoshan/commitboy"
                className="cta-button"
              >
                View repo
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
