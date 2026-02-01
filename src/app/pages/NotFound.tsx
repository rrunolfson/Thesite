import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="text-center reveal">
        <h1 className="text-9xl font-bold text-[#217ED9] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-slate-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-transparent border border-slate-600 hover:border-slate-400 text-slate-200 font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
