import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  pressReleasesByNewest,
  pressReleaseYears,
} from "@/app/content/newsroom";

const ALL_YEARS = "all";

function formatReleaseDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function NewsroomPage() {
  const [selectedYear, setSelectedYear] = useState<string>(pressReleaseYears[0] ?? ALL_YEARS);

  const visibleReleases = useMemo(() => {
    if (selectedYear === ALL_YEARS) {
      return pressReleasesByNewest;
    }

    return pressReleasesByNewest.filter((release) => release.date.startsWith(selectedYear));
  }, [selectedYear]);

  return (
    <>
      <SEO
        title="Newsroom"
        description="Read the latest Last Mile press releases, company announcements, partnership news, and product updates."
        keywords="Last Mile newsroom, press releases, company announcements, product updates, partnership news"
        canonicalPath="/company/newsroom"
      />
      <div className="pt-20 relative min-h-screen">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <section className="relative overflow-hidden border-b border-slate-800/80 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-white via-[#217ED9]/60 to-[#217ED9] text-transparent bg-clip-text">
                      Newsroom
                    </span>
                  </h1>
                  <p className="max-w-3xl text-xl leading-relaxed text-slate-300">
                    Follow the latest Last Mile announcements, product milestones, partnership updates,
                    and customer momentum from across our operational workflow platform.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
                  className="relative"
                >
                  <div className="glass-panel overflow-hidden border border-slate-700/70">
                    <img
                      src="/newsroom_image.jpg"
                      alt="Last Mile newsroom"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Press Releases
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Latest announcements</h2>
                </div>

                <div className="w-full max-w-xs">
                  <label className="mb-2 block text-sm font-medium text-slate-300">Select Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-11 border-slate-700 bg-slate-900/70 text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-950 text-white">
                      <SelectItem value={ALL_YEARS}>All Years</SelectItem>
                      {pressReleaseYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                {visibleReleases.map((release, index) => (
                  <motion.article
                    key={release.slug}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
                    className="border-b border-slate-800 py-8"
                  >
                    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                      <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-400">
                        {formatReleaseDate(release.date)}
                      </p>

                      <div>
                        <Link
                          to={`/company/newsroom/${release.slug}`}
                          className="group inline-flex items-start gap-3 text-left"
                        >
                          <span className="text-2xl font-semibold leading-tight text-white transition-colors group-hover:text-[#75ADE6]">
                            {release.title}
                          </span>
                          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#75ADE6] transition-transform group-hover:translate-x-1" />
                        </Link>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
                          {release.summary}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}

                {visibleReleases.length === 0 ? (
                  <div className="glass-panel rounded-sm px-8 py-12 text-center text-slate-300">
                    No press releases are currently published for {selectedYear}.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}