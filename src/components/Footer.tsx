import { Github, Heart, Database, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Game Tracker
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hệ thống theo dõi và phân tích dữ liệu game cá nhân.
              Giúp bạn tối ưu hóa hiệu suất và theo dõi tiến độ mỗi ngày.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-2">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-primary transition-colors flex items-center gap-2">
                  Thống kê & Biểu đồ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Tài nguyên</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://youtu.be/dQw4w9WgXcQ?si=7vh7LQeushpVOoC-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Database size={16} />
                  <span>Dữ liệu gốc (Google Sheets)</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://youtu.be/dQw4w9WgXcQ?si=Ld05eUC_CcKEr-96"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  <span>Source Code</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Game Tracker. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart size={14} className="fill-red-500 text-red-500 animate-pulse" />
            <span>by TrongSigmaPro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
