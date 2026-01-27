# Game Report Analytics

Một ứng dụng web hiện đại để theo dõi và phân tích kết quả game cá nhân từ Google Sheets.

## 🌟 Tính năng

- **Dashboard trực quan**: Hiển thị danh sách các trận đấu dưới dạng thẻ (card) đẹp mắt.
- **Tìm kiếm & Lọc**: Tìm kiếm theo tên game, ngày tháng. Sắp xếp theo ngày, số trận, tỉ lệ thắng.
- **Thống kê chi tiết**: Biểu đồ tròn tỉ lệ thắng/thua, biểu đồ đường xu hướng theo thời gian, biểu đồ cột top game.
- **Responsive**: Giao diện tối ưu cho Mobile, Tablet và Desktop.
- **Dark Mode**: Hỗ trợ giao diện sáng/tối và tự động theo hệ thống.
- **PWA**: Có thể cài đặt như ứng dụng native, hoạt động offline.

## 🛠 Tech Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Fetching**: Papaparse (CSV from Google Sheets)
- **Animation**: Framer Motion
- **PWA**: Vite Plugin PWA

## 🚀 Cài đặt và Chạy dự án

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   *Lưu ý: Cần dùng `--legacy-peer-deps` do một số thư viện chưa tương thích hoàn toàn với React 19.*

3. **Chạy server development**
   ```bash
   npm run dev
   ```
   Truy cập `http://localhost:5173`

4. **Build cho production**
   ```bash
   npm run build
   ```

5. **Preview bản build**
   ```bash
   npm run preview
   ```

## 📱 PWA

Ứng dụng hỗ trợ Progressive Web App (PWA). Khi build production, service worker sẽ được tạo tự động để cache assets và hỗ trợ offline mode.

## 📄 Cấu trúc dữ liệu

Dữ liệu được lấy trực tiếp từ Google Sheet công khai:
Link: `https://docs.google.com/spreadsheets/d/1sTG3J0Vaki70AqZlFwh-cAdVzeKkTgRkXszkSI7sUrc/edit?usp=sharing`

Định dạng cột:
- `game`: Tên game
- `win`: Số trận thắng
- `loss`: Số trận thua
- `total`: Tổng số trận
- `date`: Ngày chơi (DD/MM/YYYY)
- `time`: Thời gian chơi (HH:mm:ss)

## 🎨 Tùy chỉnh Theme

Theme được cấu hình trong `src/index.css` và `tailwind.config.js`. Sử dụng CSS variables để dễ dàng thay đổi màu sắc.

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng tạo Pull Request hoặc Issue nếu bạn tìm thấy lỗi.
