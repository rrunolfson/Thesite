import { Maximize2, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export function DashboardDemo() {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-[#217ED9]/20 blur-2xl rounded-lg"></div>

      <div className="relative bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#217ED9]">LIVE_TELEMETRY_STREAM</span>
            <span className="bg-[#217ED9]/20 text-[#75ADE6] text-[10px] px-1.5 py-0.5 rounded uppercase">
              Connected
            </span>
          </div>
          <Maximize2 className="w-4 h-4 text-slate-500" />
        </div>

        {/* Content */}
        <div className="flex-1 flex bg-[#0b1120] relative overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-slate-800 flex flex-col text-xs font-mono">
            <div className="p-3 border-b border-slate-800 bg-slate-800/50 text-slate-400 uppercase">
              Asset Hierarchy
            </div>

            <div className="telemetry-row p-3 border-b border-slate-800 cursor-pointer border-l-2 border-[#217ED9] bg-slate-800/30">
              <div className="flex justify-between mb-1">
                <span className="text-white font-semibold">CNC_UNIT_04</span>
                <span className="text-[#10b981]">NORMAL</span>
              </div>
              <div className="text-slate-500">Floor 2, Sector B</div>
            </div>

            <div className="telemetry-row p-3 border-b border-slate-800 cursor-pointer border-l-2 border-transparent hover:border-slate-600">
              <div className="flex justify-between mb-1">
                <span className="text-white font-semibold">HVAC_MAIN_01</span>
                <span className="text-[#f59e0b]">WARNING</span>
              </div>
              <div className="text-slate-500">Roof Level, A</div>
            </div>

            <div className="telemetry-row p-3 border-b border-slate-800 cursor-pointer border-l-2 border-transparent hover:border-slate-600">
              <div className="flex justify-between mb-1">
                <span className="text-white font-semibold">INFUSION_PUMP_X</span>
                <span className="text-[#10b981]">ACTIVE</span>
              </div>
              <div className="text-slate-500">ICU, Room 304</div>
            </div>

            <div className="telemetry-row p-3 border-b border-slate-800 cursor-pointer border-l-2 border-transparent hover:border-slate-600">
              <div className="flex justify-between mb-1">
                <span className="text-white font-semibold">CONVEYOR_BELT_2</span>
                <span className="text-[#ef4444]">OFFLINE</span>
              </div>
              <div className="text-slate-500">Assembly Line 4</div>
            </div>
          </div>

          {/* Main Data View */}
          <div className="w-2/3 p-6 flex flex-col gap-6 relative">
            {/* Chart */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Vibration Analysis
                </h3>
                <span className="text-xs text-[#217ED9] font-mono">120Hz / 45ms</span>
              </div>
              <div className="h-24 bg-slate-800/50 rounded border border-slate-700 relative overflow-hidden flex items-end px-1 gap-0.5">
                {[40, 60, 30, 80, 50, 70, 45, 65, 30, 85, 40, 60, 50, 75].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-[#217ED9]"
                    style={{ height: `${height}%` }}
                    animate={{ height: [`${height}%`, `${height + 10}%`, `${height}%`] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/30 border border-slate-700 rounded">
                <div className="text-xs text-slate-500 uppercase mb-1">Temperature</div>
                <div className="text-2xl font-mono text-white">184.5°F</div>
                <div className="text-xs text-[#10b981] mt-1">Within limits</div>
              </div>
              <div className="p-4 bg-slate-800/30 border border-slate-700 rounded">
                <div className="text-xs text-slate-500 uppercase mb-1">Op Time</div>
                <div className="text-2xl font-mono text-white">48h 12m</div>
                <div className="text-xs text-[#217ED9] mt-1">Continuous</div>
              </div>
            </div>

            {/* Alert */}
            <div className="mt-auto p-3 bg-red-900/20 border border-red-900/50 rounded flex gap-3 items-center">
              <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <div className="text-xs">
                <span className="text-red-400 font-bold block">PREDICTIVE ALERT</span>
                <span className="text-red-200/70">
                  Bearing fatigue detected. Maintenance recommended in &lt; 48 hours.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
