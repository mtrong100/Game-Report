import { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchGameData } from '../services/api';
import type { GameRecord } from '../types';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { motion } from 'framer-motion';

export function Export() {
  const [data, setData] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<'csv' | 'excel' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchGameData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    setExporting('csv');
    setSuccessMessage(null);
    try {
      // Exclude internal fields like 'id' if needed, but let's keep all relevant data
      const csvData = data.map(({ id, ...rest }) => rest);
      const csv = Papa.unparse(csvData);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `game_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMessage('Xuất file CSV thành công!');
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi xuất file CSV');
    } finally {
      setExporting(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleExportExcel = () => {
    setExporting('excel');
    setSuccessMessage(null);
    try {
      const ws = XLSX.utils.json_to_sheet(data.map(({ id, ...rest }) => rest));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Game Report");
      XLSX.writeFile(wb, `game_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setSuccessMessage('Xuất file Excel thành công!');
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi xuất file Excel');
    } finally {
      setExporting(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Xuất Dữ Liệu
        </h1>
        <p className="text-muted-foreground">
          Tải xuống dữ liệu game của bạn dưới dạng file CSV hoặc Excel để lưu trữ hoặc phân tích thêm.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                <Download size={48} />
            </div>
            <h2 className="text-xl font-semibold">Sẵn sàng để tải xuống</h2>
            <p className="text-sm text-muted-foreground">
                Tổng số bản ghi: <span className="font-bold text-foreground">{data.length}</span>
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
                onClick={handleExportCSV}
                disabled={exporting !== null}
                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-all hover:border-primary/50 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition-transform dark:bg-green-900/30 dark:text-green-400">
                    <FileText size={24} />
                </div>
                <div className="text-left">
                    <div className="font-semibold">CSV Format</div>
                    <div className="text-xs text-muted-foreground">Tương thích rộng rãi</div>
                </div>
            </button>

            <button
                onClick={handleExportExcel}
                disabled={exporting !== null}
                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary/50 transition-all hover:border-primary/50 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform dark:bg-blue-900/30 dark:text-blue-400">
                    <FileSpreadsheet size={24} />
                </div>
                <div className="text-left">
                    <div className="font-semibold">Excel Format</div>
                    <div className="text-xs text-muted-foreground">Dành cho Microsoft Excel</div>
                </div>
            </button>
        </div>

        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: successMessage || error ? 1 : 0, height: 'auto' }}
            className="mt-6"
        >
            {successMessage && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm justify-center">
                    <CheckCircle size={16} />
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm justify-center">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
        </motion.div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>Dữ liệu được cập nhật lần cuối từ Google Sheets.</p>
      </div>
    </div>
  );
}
