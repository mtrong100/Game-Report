import { useEffect, useState, useMemo } from "react";
import type { GameRecord, SortOption, SortDirection } from "../types";
import { fetchGameData } from "../services/api";
import { GameCard } from "../components/Card";
import { Search, ArrowUpDown, LayoutGrid, Grid3X3, Filter } from "lucide-react";
import { Skeleton } from "../components/Skeleton";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export function Home() {
  const [data, setData] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  useEffect(() => {
    fetchGameData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const uniqueGames = useMemo(() => {
    const games = new Set(data.map((item) => item.game));
    return Array.from(games).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.game.toLowerCase().includes(lowerQuery) ||
          item.date.includes(lowerQuery),
      );
    }

    // Filter by Game
    if (selectedGame !== "all") {
      result = result.filter((item) => item.game === selectedGame);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case "date":
          comparison = a.timestamp - b.timestamp;
          break;
        case "win":
          comparison = a.win - b.win;
          break;
        case "loss":
          comparison = a.loss - b.loss;
          break;
        case "total":
          comparison = a.total - b.total;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [data, searchQuery, selectedGame, sortOption, sortDirection]);

  const toggleSort = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortOption(option);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-card p-4 rounded-xl border shadow-sm  top-20 z-40 backdrop-blur-sm bg-card/90 supports-[backdrop-filter]:bg-card/75 transition-all">
        {/* Search & Filter Group */}
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto flex-1">
          <div className="relative w-full md:w-80 lg:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm game, ngày..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative w-full md:w-64">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm appearance-none cursor-pointer truncate"
            >
              <option value="all">Tất cả Game</option>
              {uniqueGames.map((game) => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
            {/* Custom arrow for select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort & View Options */}
        <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg overflow-x-auto">
            <button
              onClick={() => toggleSort("date")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap",
                sortOption === "date"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              )}
            >
              Ngày {sortOption === "date" && <ArrowUpDown size={12} />}
            </button>
            <button
              onClick={() => toggleSort("total")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap",
                sortOption === "total"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              )}
            >
              Tổng {sortOption === "total" && <ArrowUpDown size={12} />}
            </button>
            <button
              onClick={() => toggleSort("win")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap",
                sortOption === "win"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              )}
            >
              Thắng {sortOption === "win" && <ArrowUpDown size={12} />}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
            <button
              onClick={() => setGridCols(3)}
              className={cn(
                "p-1.5 rounded-md transition-all",
                gridCols === 3
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              )}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={cn(
                "p-1.5 rounded-md transition-all",
                gridCols === 4
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className={cn(
            "grid gap-4",
            gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
            "md:grid-cols-2 grid-cols-1",
          )}
        >
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-4",
            gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
            "md:grid-cols-2 grid-cols-1",
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <GameCard key={item.id} data={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/50 rounded-2xl border border-dashed">
          <div className="p-4 bg-secondary rounded-full mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-1">Không tìm thấy kết quả</h3>
          <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
