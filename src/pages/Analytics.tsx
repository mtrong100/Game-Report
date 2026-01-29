import { useEffect, useState } from 'react';
import type { GameRecord } from '../types';
import { fetchGameData } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { cn } from '../utils/cn';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

export function Analytics() {
  const [data, setData] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const games = ["LMHT: Tốc Chiến", "Liên Quân Mobile"];

  const overallStats = (() => {
    const totalWins = data.reduce((sum, item) => sum + item.win, 0);
    const totalLosses = data.reduce((sum, item) => sum + item.loss, 0);
    const totalGames = data.reduce((sum, item) => sum + item.total, 0);
    const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : "0";

    const gameComparison = games.map(name => {
      const gameData = data.filter(item => item.game === name);
      const wins = gameData.reduce((sum, item) => sum + item.win, 0);
      const total = gameData.reduce((sum, item) => sum + item.total, 0);
      return {
        name: name === "LMHT: Tốc Chiến" ? "Tốc Chiến" : "Liên Quân",
        total,
        winRate: total > 0 ? Math.round((wins / total) * 100) : 0
      };
    });

    const totalTrend = (() => {
      const grouped: Record<string, { date: string, win: number, loss: number }> = {};
      const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
      sorted.forEach(item => {
        if (!grouped[item.date]) {
          grouped[item.date] = { date: item.date, win: 0, loss: 0 };
        }
        grouped[item.date].win += item.win;
        grouped[item.date].loss += item.loss;
      });
      return Object.values(grouped);
    })();

    return { totalWins, totalLosses, totalGames, winRate, gameComparison, totalTrend };
  })();

  const getStatsForGame = (gameName: string) => {
    const gameData = data.filter(item => item.game === gameName);
    const totalWins = gameData.reduce((sum, item) => sum + item.win, 0);
    const totalLosses = gameData.reduce((sum, item) => sum + item.loss, 0);
    const totalGames = gameData.reduce((sum, item) => sum + item.total, 0);
    const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : "0";

    const trendData = (() => {
      const grouped: Record<string, { date: string, win: number, loss: number, winRate: number }> = {};
      const sorted = [...gameData].sort((a, b) => a.timestamp - b.timestamp);
      sorted.forEach(item => {
        if (!grouped[item.date]) {
          grouped[item.date] = { date: item.date, win: 0, loss: 0, winRate: 0 };
        }
        grouped[item.date].win += item.win;
        grouped[item.date].loss += item.loss;
      });
      return Object.values(grouped).map(d => ({
        ...d,
        winRate: d.win + d.loss > 0 ? Math.round((d.win / (d.win + d.loss)) * 100) : 0
      }));
    })();

    return {
      total: totalGames,
      wins: totalWins,
      losses: totalLosses,
      winRate,
      trendData,
      pieData: [
        { name: 'Thắng', value: totalWins },
        { name: 'Thua', value: totalLosses },
      ]
    };
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-16 pb-12">
      {/* SECTION: OVERALL STATS */}
      <section className="space-y-8 bg-primary/5 -mx-4 p-5 rounded-3xl border border-primary/10 shadow-inner">
        <div className="flex flex-row md:items-center gap-4">
          <div className="w-3 h-12 bg-primary rounded-full" />
          <div>
            <h2 className="text-xl md:text-4xl font-black tracking-tight text-primary">TỔNG HỢP HỆ THỐNG</h2>
            <p className="text-muted-foreground font-medium">Dữ liệu tổng quát từ tất cả trò chơi</p>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Tổng số trận</span>
            <span className="text-4xl font-black mt-2">{overallStats.totalGames}</span>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Tỉ lệ thắng TB</span>
            <span className="text-4xl font-black mt-2 text-primary">{overallStats.winRate}%</span>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Tổng Thắng</span>
            <span className="text-4xl font-black mt-2 text-green-500">{overallStats.totalWins}</span>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Tổng Thua</span>
            <span className="text-4xl font-black mt-2 text-red-500">{overallStats.totalLosses}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-card p-6 rounded-2xl border shadow-sm lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Xu hướng hoạt động toàn hệ thống
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overallStats.totalTrend}>
                  <defs>
                    <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="win" name="Thắng" stroke="#22c55e" fillOpacity={1} fill="url(#colorWin)" strokeWidth={3} />
                  <Area type="monotone" dataKey="loss" name="Thua" stroke="#ef4444" fillOpacity={1} fill="url(#colorLoss)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              So sánh hiệu suất game
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overallStats.gameComparison} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="total" name="Số trận" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="winRate" name="Tỉ lệ thắng (%)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {games.map((gameName) => {
        const stats = getStatsForGame(gameName);
        const isWT = gameName.includes("Wild Rift") || gameName.includes("Tốc Chiến");
        const accentHex = isWT ? "#3b82f6" : "#f97316";

        return (
          <section key={gameName} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className={cn("w-2 h-10 rounded-full", isWT ? "bg-blue-500" : "bg-orange-500")} />
              <h2 className="text-3xl font-black tracking-tight">{gameName}</h2>
              <div className="h-px flex-1 bg-border/60 ml-4 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity", isWT ? "bg-blue-500/5" : "bg-orange-500/5")} />
                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider z-10">Tổng số trận</span>
                <span className="text-5xl font-black mt-2 tracking-tight z-10">{stats.total}</span>
              </div>
              <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider z-10">Tỉ lệ thắng</span>
                <span className="text-5xl font-black mt-2 text-green-500 z-10">{stats.winRate}%</span>
              </div>
              <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider z-10">Thắng / Thua</span>
                <div className="flex gap-6 mt-2 z-10">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-500 block">{stats.wins}</span>
                    <span className="text-xs font-bold text-muted-foreground">W</span>
                  </div>
                  <div className="w-px bg-border h-full" />
                  <div className="text-center">
                    <span className="text-3xl font-bold text-red-500 block">{stats.losses}</span>
                    <span className="text-xs font-bold text-muted-foreground">L</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className={cn("w-1.5 h-6 rounded-full", isWT ? "bg-blue-500" : "bg-orange-500")} />
                  Tỉ lệ Thắng / Thua
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" dy="-0.5em" fontSize="24" fontWeight="bold" fill="hsl(var(--foreground))">{stats.winRate}%</tspan>
                        <tspan x="50%" dy="1.5em" fontSize="12" fill="hsl(var(--muted-foreground))">Win Rate</tspan>
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className={cn("w-1.5 h-6 rounded-full", isWT ? "bg-blue-500" : "bg-orange-500")} />
                  Chi tiết Thắng/Thua theo ngày
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.trendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.1)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="win" name="Thắng" fill="#22c55e" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="loss" name="Thua" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-sm lg:col-span-2">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className={cn("w-1.5 h-6 rounded-full", isWT ? "bg-blue-500" : "bg-orange-500")} />
                  Biến động tỉ lệ thắng theo thời gian
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trendData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} unit="%" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }} />
                      <Line type="monotone" dataKey="winRate" name="Tỉ lệ thắng" stroke={accentHex} strokeWidth={4} dot={{ r: 4, fill: accentHex, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

