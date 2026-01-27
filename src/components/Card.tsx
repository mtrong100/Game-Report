import type { GameRecord } from '../types';
import { Calendar, Clock, Gamepad2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface GameCardProps {
  data: GameRecord;
}

export function GameCard({ data }: GameCardProps) {
  const winRate = data.total > 0 ? Math.round((data.win / data.total) * 100) : 0;
  
  // Determine color based on win rate
  const getWinRateColor = (rate: number) => {
    if (rate >= 60) return "bg-green-500";
    if (rate >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const progressColor = getWinRateColor(winRate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card text-card-foreground rounded-2xl border shadow-sm overflow-hidden flex flex-col"
    >
      {/* Top decoration line */}
      <div className={cn("h-1.5 w-full", progressColor)} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Gamepad2 size={20} />
            </div>
            <h3 className="font-bold text-lg truncate leading-tight" title={data.game}>
              {data.game}
            </h3>
          </div>
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border",
            winRate >= 50 
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900" 
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          )}>
            {winRate}% WR
          </div>
        </div>

        {/* Win Rate Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>Hiệu suất</span>
            <span>{data.win}W - {data.loss}L</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${winRate}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={cn("h-full rounded-full", progressColor)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-secondary/30 p-2.5 rounded-xl text-center border border-transparent hover:border-border transition-colors">
            <span className="text-xs text-muted-foreground block mb-1">Thắng</span>
            <span className="font-bold text-lg text-green-600 dark:text-green-400">{data.win}</span>
          </div>
          <div className="bg-secondary/30 p-2.5 rounded-xl text-center border border-transparent hover:border-border transition-colors">
            <span className="text-xs text-muted-foreground block mb-1">Thua</span>
            <span className="font-bold text-lg text-red-600 dark:text-red-400">{data.loss}</span>
          </div>
          <div className="bg-secondary/30 p-2.5 rounded-xl text-center border border-transparent hover:border-border transition-colors">
            <span className="text-xs text-muted-foreground block mb-1">Tổng</span>
            <span className="font-bold text-lg text-primary">{data.total}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-secondary/20 border-t flex items-center justify-between text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          {data.date}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          {data.time}
        </div>
      </div>
    </motion.div>
  );
}
