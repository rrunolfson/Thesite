import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { getPressReleaseBySlug } from "@/app/content/newsroom";
import { NotFound } from "./NotFound";

export function PressReleaseDetailPage() {
  const { slug } = useParams();
  const release = slug ? getPressReleaseBySlug(slug) : undefined;

  if (!release) {
    return <NotFound />;
  }

  return (
    <>
      <SEO
        title={release.title}
        description={release.seoDescription}
        keywords="Last Mile press release, Last Mile newsroom, company news, product announcement"
        canonicalPath={`/company/newsroom/${release.slug}`}
      />
      <div className="pt-20 relative min-h-screen">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <section className="border-b border-slate-800/80 py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Breadcrumb className="mb-8">
                  <BreadcrumbList className="text-slate-400">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/company">Company</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/company/newsroom">Newsroom</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white">Press Release</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <Link
                  to="/company/newsroom"
                  className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#75ADE6] transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to newsroom
                </Link>

                <div className="mx-auto max-w-4xl text-center">
                  <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                    {release.title}
                  </h1>
                  <div className="mx-auto mt-8 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                </div>
              </motion.div>
            </div>
          </section>

          <section className="pt-6 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                className="px-2 py-0 sm:px-4 sm:py-0"
              >
                <style>{`
                  .job-content p {
                    margin-bottom: 1.5rem;
                    text-align: justify;
                    text-justify: inter-word;
                  }

                  .job-content p:last-child {
                    margin-bottom: 0;
                  }

                  .job-content ul,
                  .job-content ol {
                    margin: 1.5rem 0;
                    padding-left: 1.75rem;
                  }

                  .job-content ul {
                    list-style: disc;
                  }

                  .job-content ol {
                    list-style: decimal;
                  }

                  .job-content li {
                    margin-bottom: 0.85rem;
                    padding-left: 0.25rem;
                    text-align: justify;
                    text-justify: inter-word;
                  }

                  .job-content li::marker {
                    color: white;
                  }

                  .job-content strong,
                  .job-content b {
                    color: white;
                  }
                `}</style>
                <div
                  className="job-content prose prose-invert max-w-none text-slate-300 prose-headings:text-white prose-p:text-slate-300 prose-p:leading-8 prose-li:text-slate-300 prose-strong:text-white prose-a:text-[#8bc2f7] prose-a:no-underline hover:prose-a:text-white prose-img:mx-auto prose-img:my-8 prose-img:max-w-full prose-img:rounded-2xl prose-img:border prose-img:border-slate-700 prose-img:bg-slate-950/60 prose-img:p-3 [&_strong]:text-white [&_b]:text-white"
                  dangerouslySetInnerHTML={{ __html: release.content }}
                />
              </motion.article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}