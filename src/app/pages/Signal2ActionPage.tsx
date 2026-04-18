import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Headphones, Rss, Apple, Music2, Play, Pause } from "lucide-react";
import { SEO } from "@/app/components/SEO";

const episodes = [
  {
    episode: "001",
    title: "Why ServiceNow Wins In Operations (And What It Means for OT Data)",
    guest: "Our S-2-A Host Team",
    description:
      "How does the addition of operational data maximize the value of enterprise platforms like ServiceNow. We explore the implications and opportunities.",
    duration: "19:34 mins",
    date: "March 15, 2026",
    audioUrl: "https://lastmileinc.ai/audio/why_sn_wins_in_ops.m4a",
  },
  {
    episode: "002",
    title: "ServiceNow Beyond IT: The Art of the Possible.",
    guest: "Our S-2-A Host Team",
    description:
      "Take a tour of the broad application of an enterprise platform like ServiceNow, by listening to some amazing use cases across three very different industries.",
    duration: "11:26 mins",
    date: "March 23, 2026",
    audioUrl: "https://lastmileinc.ai/audio/AI_the_art_of_the_possible.m4a",
  },
  {
    episode: "003",
    title: "The Partner Opportunity in Operational Intelligence",
    guest: "Coming Soon",
    description:
      "SI and delivery partners are sitting on a wave of new NNACV potential. We break down the go-to-market opportunity and how to capture it.",
    duration: "— mins",
    date: "Coming Soon",
  },
];

const platforms = [
  { label: "Apple Podcasts", icon: Apple, href: "#" },
  { label: "Spotify", icon: Music2, href: "https://open.spotify.com/show/5yKr82EXxQrpDlr5DcRxfG" },
  { label: "RSS Feed", icon: Rss, href: "/podcast-feed.xml" },
];

export function Signal2ActionPage() {
  return (
    <>
      <SEO
        title="Signal 2 Action Podcast"
        description="Listen to Signal 2 Action, Last Mile's podcast on operational technology, ServiceNow workflows, partner growth, and industrial intelligence."
        keywords="Signal 2 Action, podcast, operational technology, ServiceNow, industrial intelligence, OT data"
        canonicalPath="/signal-2-action"
        markdownPath="/signal-2-action.md"
      />
      <div className="pt-20 relative min-h-screen">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-[#217ED9]/10 border border-[#217ED9]/30 rounded-full px-4 py-2 mb-6">
                  <Headphones className="w-4 h-4 text-[#217ED9]" />
                  <span className="text-sm text-[#217ED9] font-medium uppercase tracking-wider">Podcast</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
                  Signal 2 <span className="bg-gradient-to-r from-white via-[#75ADE6] to-[#217ED9] text-transparent bg-clip-text">Action</span>
                </h1>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
                  Conversations at the intersection of operational technology, enterprise workflows, and the future of industrial intelligence.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {platforms.map((p) => (
                    <a
                      key={p.label}
                      href={p.href}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-slate-700 text-slate-300 hover:border-[#217ED9] hover:text-white transition-colors text-sm font-medium"
                    >
                      <p.icon className="w-4 h-4 text-[#217ED9]" />
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* About the show */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">
                    About the <span className="text-[#217ED9]">Show</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    Signal 2 Action is the podcast for operations leaders, ServiceNow practitioners, and technology partners who are done waiting for their data to do something.
                  </p>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Each episode features candid conversations with industry experts, enterprise practitioners, and the people building the next generation of operational intelligence and exploring what it really takes to turn raw signals into business outcomes.
                  </p>
                </div>
                <div className="glass-panel overflow-hidden p-3">
                  <img
                    src="/signal_2_action.jpg"
                    alt="Signal 2 Action podcast artwork"
                    className="h-full w-full rounded object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Episodes */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <h2 className="text-4xl font-bold mb-4">
                  Available <span className="text-[#217ED9]">Episodes</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                  Get S-2-A on demand right here or from your favorite podcast platform.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {platforms.map((p) => (
                    <a
                      key={p.label}
                      href={p.href}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-slate-700 text-slate-300 hover:border-[#217ED9] hover:text-white transition-colors text-sm font-medium"
                    >
                      <p.icon className="w-4 h-4 text-[#217ED9]" />
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
            </FadeInOnScroll>

            {/* Table header */}
            <FadeInOnScroll>
              <div className="hidden md:grid grid-cols-[80px_1fr_160px_100px] gap-6 px-6 pb-3 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <span>Episode</span>
                <span>Title &amp; Description</span>
                <span>Guest</span>
                <span className="text-right">Date</span>
              </div>
            </FadeInOnScroll>

            <div className="space-y-2 mt-2">
              {episodes.map((ep, i) => (
                <SlideUpCard key={ep.episode} delay={i * 0.08}>
                  <EpisodeRow ep={ep} />
                </SlideUpCard>
              ))}
            </div>
          </div>
        </section>


      </div>
      </div>
    </>
  );
}

// Per-episode row — the top play button is the only control
function EpisodeRow({ ep }: { ep: typeof episodes[number] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const available = !!ep.audioUrl;

  const handlePlayClick = () => {
    if (!available || audioError) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (!open) {
      setOpen(true);
      audio.play().then(() => setPlaying(true)).catch((e) => {
        console.error("Audio play failed:", e);
        setAudioError(true);
        setOpen(false);
      });
    } else {
      if (playing) { audio.pause(); setPlaying(false); }
      else {
        audio.play().then(() => setPlaying(true)).catch((e) => {
          console.error("Audio play failed:", e);
          setAudioError(true);
        });
      }
    }
  };

  const onTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const onLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const onEnded = () => setPlaying(false);
  const onError = () => { setAudioError(true); setPlaying(false); };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const buttonAvailable = available && !audioError;

  return (
    <div className="glass-panel border border-slate-700/40 hover:border-[#217ED9]/50 transition-colors rounded-lg">
      <div className="p-6">
        {/* Always rendered so ref is available on first click */}
        {available && (
          <audio
            ref={audioRef}
            src={ep.audioUrl}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            onError={onError}
            preload="metadata"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_160px_100px] gap-4 md:gap-6 items-center">
          {/* Play/Pause button + EP# */}
          <div className="flex items-center gap-3 md:block">
            <button
              onClick={handlePlayClick}
              disabled={!buttonAvailable}
              title={audioError ? "Audio unavailable" : available ? (playing ? "Pause" : "Play episode") : "Coming soon"}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                buttonAvailable
                  ? "bg-[#217ED9] hover:bg-[#1a6ab8] cursor-pointer"
                  : "bg-slate-800 border border-slate-700 cursor-default"
              }`}
            >
              {playing
                ? <Pause className="w-4 h-4 text-white" />
                : <Play className={`w-3.5 h-3.5 ml-0.5 ${buttonAvailable ? "text-white" : "text-slate-600"}`} />}
            </button>
            <span className="text-[#217ED9] font-mono text-sm font-bold md:mt-2 md:block">EP {ep.episode}</span>
          </div>

          {/* Title + description */}
          <div>
            <h3 className="text-white font-semibold text-base mb-1 leading-snug">{ep.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{ep.description}</p>
          </div>

          {/* Guest */}
          <div className="text-slate-400 text-sm">{ep.guest}</div>

          {/* Date */}
          <div className="text-slate-500 text-sm md:text-right">{ep.date}</div>
        </div>

        {/* Scrubber — visible after first play click */}
        {available && open && !audioError && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4">
            <span className="text-slate-500 text-xs w-10 flex-shrink-0 tabular-nums">{fmt(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full cursor-pointer" onClick={seek}>
              <div className="h-full bg-[#217ED9] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-slate-500 text-xs w-10 flex-shrink-0 text-right tabular-nums">
              {duration ? fmt(duration) : "—:——"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Scroll animation helpers
function FadeInOnScroll({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SlideUpCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
