# 🎮 Game Tracker Analytics

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

Một giải pháp hiện đại, trực quan để theo dõi, quản lý và phân tích hiệu suất chơi game cá nhân. Dữ liệu được đồng bộ hóa trực tiếp từ Google Sheets, giúp bạn có cái nhìn tổng quan nhất về hành trình game của mình.

## ✨ Tính năng nổi bật

- **⚡ Dashboard Hiệu Năng**: Hiển thị danh sách các trận đấu dưới dạng thẻ (Card) với thiết kế hiện đại, đầy đủ thông tin.
- **🔍 Bộ lọc & Tìm kiếm Thông minh**: Tìm kiếm theo tên game hoặc ngày tháng. Sắp xếp linh hoạt theo tỉ lệ thắng, tổng số trận hoặc thời gian.
- **📊 Phân tích Chuyên sâu**: Biểu đồ trực quan (Pie, Line, Bar) giúp theo dõi tỷ lệ thắng/thua, xu hướng hoạt động và top game yêu thích.
- **📱 Trải nghiệm Đa nền tảng**: Responsive hoàn hảo cho Mobile, Tablet và Desktop.
- **🌓 Chế độ Sáng/Tối**: Giao diện linh hoạt, bảo vệ mắt người dùng với khả năng tự động đồng bộ theo hệ thống.
- **📦 Progressive Web App (PWA)**: Cài đặt trực tiếp lên thiết bị như ứng dụng bản địa, hỗ trợ hoạt động offline mượt mà.
- **📥 Xuất Dữ liệu**: Hỗ trợ xuất báo cáo định dạng CSV và Excel để lưu trữ lâu dài.

## 🛠 Công nghệ sử dụng

- **Lõi**: React 19, TypeScript, Vite
- **Giao diện**: Tailwind CSS v4, Framer Motion (Animation)
- **Biểu đồ**: Recharts
- **Icon**: Lucide React
- **Xử lý dữ liệu**: Papaparse (CSV), XLSX (Excel Export)
- **PWA**: Vite Plugin PWA

## 🚀 Khởi chạy dự án

1. **Clone mã nguồn**
   ```bash
   git clone <repository-url>
   cd game-tracker
   ```

2. **Cài đặt thư viện**
   ```bash
   npm install --legacy-peer-deps
   ```
   *Lưu ý: Sử dụng `--legacy-peer-deps` để đảm bảo độ tương thích tốt nhất với React 19.*

3. **Phát triển tại máy local**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại: `http://localhost:5173`

4. **Đóng gói Production**
   ```bash
   npm run build
   ```

## 📊 Nguồn dữ liệu

Hệ thống sử dụng dữ liệu từ Google Sheets công khai để đảm bảo tính minh bạch và dễ dàng cập nhật:
[Xem Google Sheets tại đây](https://docs.google.com/spreadsheets/d/1sTG3J0Vaki70AqZlFwh-cAdVzeKkTgRkXszkSI7sUrc/edit?usp=sharing)

**Cấu trúc bảng dữ liệu:**
- `game`: Tên trò chơi
- `win`: Số trận thắng
- `loss`: Số trận thua
- `total`: Tổng số trận (Win + Loss)
- `date`: Ngày ghi nhận (DD/MM/YYYY)
- `time`: Thời gian ghi nhận (HH:mm:ss)

## 🎨 Giao diện & Design

Dự án được thiết kế theo phong cách hiện đại (Modern minimal) với hệ thống màu sắc hài hòa, tập trung vào trải nghiệm người dùng và tính thẩm mỹ của dữ liệu.

---
Designed with ❤️ by **TrongSigmaPro**
