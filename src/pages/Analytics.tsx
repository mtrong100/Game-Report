import { useEffect, useState, useMemo } from 'react';
import type { GameRecord } from '../types';
import { fetchGameData } from '../services/api';
import { Skeleton } from '../components/Skeleton';
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
  ReferenceLine,
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

  const overallStats = useMemo(() => {
    const totalWins = data.reduce((sum, item) => sum + item.win, 0);
    const totalLosses = data.reduce((sum, item) => sum + item.loss, 0);
    const totalGames = data.reduce((sum, item) => sum + item.total, 0);
    
    return {
        wins: totalWins,
        losses: totalLosses,
        total: totalGames,
        winRate: totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0
    };
  }, [data]);

  const pieData = [
    { name: 'Thắng', value: overallStats.wins },
    { name: 'Thua', value: overallStats.losses },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  const trendData = useMemo(() => {
      // Group by date, sum wins/losses
      const grouped: Record<string, {date: string, win: number, loss: number}> = {};
      
      // Sort data by timestamp ascending first
      const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);

      sorted.forEach(item => {
          if (!grouped[item.date]) {
              grouped[item.date] = { date: item.date, win: 0, loss: 0 };
          }
          grouped[item.date].win += item.win;
          grouped[item.date].loss += item.loss;
      });

      return Object.values(grouped);
  }, [data]);

  const topGames = useMemo(() => {
      // Group by game name
      const grouped: Record<string, {game: string, total: number}> = {};
      data.forEach(item => {
          if (!grouped[item.game]) {
              grouped[item.game] = { game: item.game, total: 0 };
          }
          grouped[item.game].total += item.total;
      });
      
      return Object.values(grouped).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [data]);

  const winRateByGame = useMemo(() => {
      const grouped: Record<string, {game: string, wins: number, total: number}> = {};
      data.forEach(item => {
          if (!grouped[item.game]) {
              grouped[item.game] = { game: item.game, wins: 0, total: 0 };
          }
          grouped[item.game].wins += item.win;
          grouped[item.game].total += item.total;
      });

      return Object.values(grouped)
        .map(g => ({
            game: g.game,
            winRate: Math.round((g.wins / g.total) * 100),
            total: g.total
        }))
        .filter(g => g.total > 1) // Only show games with more than 1 match
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 10);
  }, [data]);

  const activityByHour = useMemo(() => {
    const hours = Array(24).fill(0).map((_, i) => ({ hour: `${i}h`, count: 0 }));
    data.forEach(item => {
        // Assume format HH:mm:ss
        const hour = parseInt(item.time.split(':')[0], 10);
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
            hours[hour].count += item.total;
        }
    });
    return hours;
  }, [data]);

  if (loading) {
    return <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider z-10">Tổng số trận</span>
             <span className="text-5xl font-black mt-2 tracking-tight z-10">{overallStats.total}</span>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider z-10">Tỉ lệ thắng</span>
             <span className="text-5xl font-black mt-2 text-green-500 z-10">{overallStats.winRate}%</span>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider z-10">Thắng / Thua</span>
             <div className="flex gap-6 mt-2 z-10">
                 <div className="text-center">
                    <span className="text-3xl font-bold text-green-500 block">{overallStats.wins}</span>
                    <span className="text-xs font-bold text-muted-foreground">W</span>
                 </div>
                 <div className="w-px bg-border h-full" />
                 <div className="text-center">
                    <span className="text-3xl font-bold text-red-500 block">{overallStats.losses}</span>
                    <span className="text-xs font-bold text-muted-foreground">L</span>
                 </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win Rate Pie Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Tỉ lệ Thắng / Thua
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
                {/* Center Text */}
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-0.5em" fontSize="24" fontWeight="bold" fill="hsl(var(--foreground))">{overallStats.winRate}%</tspan>
                    <tspan x="50%" dy="1.5em" fontSize="12" fill="hsl(var(--muted-foreground))">Win Rate</tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Line Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
             <span className="w-1 h-6 bg-blue-500 rounded-full" />
             Xu hướng theo ngày
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickMargin={10} 
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                    type="monotone" 
                    dataKey="win" 
                    stroke="#22c55e" 
                    strokeWidth={3} 
                    name="Thắng" 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                <Line 
                    type="monotone" 
                    dataKey="loss" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    name="Thua" 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Games Bar Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full" />
                Top 5 Game Chơi Nhiều Nhất
            </h3>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={topGames}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="game" 
                            type="category" 
                            stroke="hsl(var(--foreground))" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip 
                            cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Tổng số trận" barSize={32}>
                            {topGames.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.8)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Win Rate By Game Bar Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full" />
                Top Tỉ Lệ Thắng (Min 2 games)
            </h3>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={winRateByGame}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis 
                            dataKey="game" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={10} 
                            tickMargin={10} 
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                            unit="%"
                        />
                        <Tooltip 
                            cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                        <Bar dataKey="winRate" name="Tỉ lệ thắng" radius={[4, 4, 0, 0]}>
                            {winRateByGame.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.winRate >= 50 ? '#22c55e' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Activity by Hour Bar Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                Hoạt động theo khung giờ
            </h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={activityByHour}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis 
                            dataKey="hour" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip 
                            cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Số trận" />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

      </div>
    </div>
  );
}
