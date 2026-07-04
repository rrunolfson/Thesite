import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, Rss } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { TrackedAnchor, TrackedLink } from "@/app/components/TrackedLink";
import { durationToIso, fetchPodcastFeed, formatPodcastDate, type PodcastEpisode } from "@/app/lib/podcast";
import { createBreadcrumbSchema, createPodcastSeriesSchema } from "@/app/lib/structuredData";

const platforms = [
  { label: "Spotify", href: "https://open.spotify.com/show/5yKr82EXxQrpDlr5DcRxfG" },
  { label: "RSS Feed", href: "/podcast-feed.xml" },
];

export function Signal2ActionPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [feedAvailable, setFeedAvailable] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFeed = async () => {
      try {
        const feed = await fetchPodcastFeed();

        if (isMounted) {
          setEpisodes(feed.episodes);
          setFeedAvailable(feed.episodes.length > 0);
        }
      } catch {
        if (isMounted) {
          setEpisodes([]);
          setFeedAvailable(false);
        }
      }
    };

    void loadFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  const jsonLd = [
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Signal 2 Action", path: "/signal-to-action" },
    ]),
    ...(episodes.length > 0 ? [createPodcastSeriesSchema(episodes)] : []),
  ];
  const currentEpisodes = episodes.filter((episode) => !isArchiveEpisode(episode));
  const archiveEpisodes = episodes.filter(isArchiveEpisode);

  return (
    <>
      <SEO
        title="Signal 2 Action | The Last Mile Operational Intelligence Podcast"
        description="Signal 2 Action is the Last Mile podcast about operational intelligence, semantic context, trustworthy automation, and the path from signal to accountable action."
        canonicalPath="/signal-to-action"
        markdownPath="/signal-to-action.md"
        jsonLd={jsonLd}
      />
      <div className="pt-20 relative min-h-screen">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <section className="relative overflow-hidden pt-16 pb-10 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#75ADE6]">Signal 2 Action</p>
                <h1 className="hero-title-gradient mt-6 text-4xl font-bold tracking-tight leading-tight mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
                  Conversations about the work between detection and resolution.
                </h1>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Signal 2 Action is the Last Mile podcast about operational intelligence, workflow, automation, real operators, and accountable action.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <TrackedLink to="/signal-to-action#latest-episode" eventName="cta_podcast_click" className="inline-flex items-center justify-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 font-semibold text-white hover:bg-[#0a1929]">
                    Listen to the latest episode <ArrowRight className="h-5 w-5" />
                  </TrackedLink>
                  <TrackedAnchor href="/podcast-feed.xml" eventName="podcast_subscribe_click" className="inline-flex items-center justify-center rounded-sm border border-slate-600 bg-slate-900/60 px-7 py-3 font-semibold text-white hover:border-[#217ED9]">
                    Subscribe to Signal 2 Action
                  </TrackedAnchor>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-800 pt-8 pb-20 md:pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">What Signal 2 Action explores</h2>
                  <ul className="space-y-4 text-lg leading-8 text-slate-300">
                    {[
                      "The operational action gap",
                      "Industrial and enterprise operational intelligence",
                      "OT, IT, and workflow convergence",
                      "Semantic models, source authority, quality, and trust",
                      "What AI can and cannot safely do in operations",
                      "The practical path from signal to accountable action",
                      "The operating realities of facilities, manufacturing, infrastructure, fleets, and distributed operations",
                    ].map((topic) => (
                      <li key={topic} className="flex gap-3"><span className="mt-3 h-2 w-2 rounded-full bg-[#75ADE6]"></span><span>{topic}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="glass-panel overflow-hidden p-3">
                  <img
                    src="/signal-2-action-cover.svg"
                    alt="Signal 2 Action podcast artwork featuring the Last Mile podcast brand"
                    className="h-full w-full rounded object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <h2 className="text-4xl font-bold text-white">Operational data does not create operational action on its own.</h2>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                  Signal 2 Action brings together operators, engineers, platform builders, systems integrators, and enterprise leaders to discuss the hard practical questions behind modern operations: What makes a signal trustworthy? How do teams avoid drowning in alerts? When should automation act, and when should a human decide? How can organizations coordinate work across systems without losing context or accountability?
                </p>
                <p className="mt-4 text-lg leading-8 text-slate-300">Each episode looks for useful answers rather than generic technology enthusiasm.</p>
              </div>
            </div>
          </section>

          <section id="latest-episode" className="py-20 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-white">Current Series: Operational Intelligence in Action</h2>
              </div>
              {feedAvailable && currentEpisodes.length > 0 ? (
                <div className="space-y-4">
                  {currentEpisodes.map((episode) => (
                    <EpisodeRow key={episode.guid} episode={episode} />
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 text-slate-300">
                  New conversations on operational intelligence are being prepared. Subscribe to be notified when the next episode is released.
                </div>
              )}
              {archiveEpisodes.length > 0 ? (
                <div className="mt-14">
                  <h2 className="text-3xl font-bold text-white">From the Archive</h2>
                  <div className="mt-8 space-y-4">
                    {archiveEpisodes.map((episode) => (
                      <EpisodeRow key={episode.guid} episode={episode} />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <TrackedAnchor
                    key={platform.label}
                    href={platform.href}
                    eventName="podcast_subscribe_click"
                    target={platform.href.startsWith("http") ? "_blank" : undefined}
                    rel={platform.href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#217ED9] hover:text-white"
                  >
                    <Rss className="h-4 w-4 text-[#217ED9]" />
                    {platform.label}
                  </TrackedAnchor>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-white">Want to join the conversation?</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Signal 2 Action is interested in operators, system builders, researchers, and practitioners with a grounded point of view on how operational signals become real work.
              </p>
              <TrackedLink to="/contact" eventName="cta_design_partner_click" eventData={{ conversation_type: "podcast" }} className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-8 py-3 font-semibold text-white hover:bg-[#0a1929]">
                Propose a conversation <ArrowRight className="h-5 w-5" />
              </TrackedLink>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function EpisodeRow({ episode }: { episode: PodcastEpisode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const available = !!episode.audioUrl;

  const handlePlayClick = () => {
    if (!available || audioError) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (!open) {
      setOpen(true);
      audio.play().then(() => setPlaying(true)).catch((error) => {
        console.error("Audio play failed:", error);
        setAudioError(true);
        setOpen(false);
      });
    } else if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch((error) => {
        console.error("Audio play failed:", error);
        setAudioError(true);
      });
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => setPlaying(false);
  const onError = () => {
    setAudioError(true);
    setPlaying(false);
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    audio.currentTime = ((event.clientX - rect.left) / rect.width) * duration;
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="glass-panel border border-slate-700/40 hover:border-[#217ED9]/50 transition-colors rounded-lg">
      <div className="p-6">
        {available ? (
          <audio
            ref={audioRef}
            src={episode.audioUrl ?? undefined}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            onError={onError}
            preload="metadata"
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_120px] md:gap-6 md:items-center">
          <div className="flex items-center gap-3 md:flex-col md:items-start">
            <button
              type="button"
              onClick={handlePlayClick}
              disabled={!available || audioError}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#217ED9]/50 bg-[#0a1929]/80 text-white disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              {episode.episodeNumber ? `EP ${episode.episodeNumber}` : "Episode"}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">{episode.title}</h3>
            <p className="mt-3 text-base leading-7 text-slate-300">{episode.description}</p>
            {open && available && !audioError ? (
              <div className="mt-4">
                <div onClick={seek} className="h-2 cursor-pointer rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-[#217ED9]" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="text-sm text-slate-400 md:text-left">
            {formatPodcastDate(episode.date)}
            {episode.duration ? <div className="mt-1">{episode.duration}</div> : null}
          </div>
        </div>

        {episode.audioUrl ? (
          <TrackedAnchor
            href={episode.audioUrl}
            eventName="podcast_episode_play"
            eventData={{ episode_title: episode.title, duration: durationToIso(episode.duration) }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#75ADE6] hover:text-white"
          >
            Open audio source <ArrowRight className="h-4 w-4" />
          </TrackedAnchor>
        ) : null}
      </div>
    </div>
  );
}

function isArchiveEpisode(episode: PodcastEpisode) {
  const text = `${episode.title} ${episode.description}`.toLowerCase();
  return text.includes("servicenow") || text.includes("service now") || text.includes("now platform");
}
