# 🎮 NES Game Library

Thư viện game NES kinh điển với giao diện hiện đại, hỗ trợ đa ngôn ngữ. Chơi trực tiếp trên trình duyệt!

![NES Game Library](https://img.shields.io/badge/Games-1700+-purple)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![i18n](https://img.shields.io/badge/Languages-VI%20%7C%20EN-orange)

## 🚀 Quick Start

### Step 1: Clone Repository
```bash
git clone https://github.com/daiphu1801/NestGameLibrary.git
cd NestGameLibrary
```

### Step 2: Configure Environment (REQUIRED)
```bash
# Copy environment template
copy env.example.js env.js
```

Edit `env.js` and add your R2 URL:
```javascript
window.ENV = {
  R2_PUBLIC_URL: 'https://your-r2-url.r2.dev'
};
```

### Step 3: Add env.js to HTML
Add this line to `index.html` before other scripts:
```html
<script src="env.js"></script>
```

### Step 4: Start Server
```bash
# Using npx serve
npx serve .

# Or using Python
python -m http.server 3000
```

### Step 5: Open Browser
Navigate to http://localhost:3000

## ✨ Tính năng

- 🎯 **1700+ Games NES** - Bộ sưu tập đầy đủ các game NES kinh điển
- 🎨 **Giao diện hiện đại** - Dark theme, responsive design với TailwindCSS
- 🌐 **Đa ngôn ngữ** - Hỗ trợ Tiếng Việt và English
- 🔍 **Tìm kiếm & Lọc** - Tìm game theo tên hoặc lọc theo thể loại
- 🏷️ **Phân loại thông minh** - Tự động phân loại 10 thể loại game
- ▶️ **Chơi trực tiếp** - Không cần cài đặt, chơi ngay trên trình duyệt
- 📱 **Responsive** - Hoạt động tốt trên mọi thiết bị

## � Cấu trúc dự án

```
NestGameLibrary/
├── assets/
│   ├── js/
│   │   ├── app.js          # Logic chính
│   │   └── i18n.js         # Hệ thống đa ngôn ngữ
│   ├── css/
│   │   └── custom.css      # CSS tùy chỉnh (nếu cần)
│   └── data/
│       ├── games.js        # Dữ liệu 1700+ games
│       └── lang/
│           ├── vi.json     # Tiếng Việt
│           └── en.json     # English
├── scripts/
│   └── generate-games.js   # Script tạo danh sách games
├── Nes ROMs Complete X Of 4/  # Thư mục chứa ROMs
├── index.html
├── package.json
├── README.md
└── .gitignore
```

## 🚀 Cài đặt & Chạy

### Cách 1: NPM Scripts

```bash
# Chạy server
npm start

# Hoặc với port cụ thể
npm run dev
```

### Cách 2: NPX

```bash
npx serve .
```

Sau đó mở trình duyệt: **http://localhost:3000**

## 🌐 Đổi ngôn ngữ

Click vào nút 🇻🇳/🇺🇸 ở góc phải header để chuyển đổi giữa Tiếng Việt và English.

Ngôn ngữ được lưu vào localStorage và sẽ được nhớ cho lần truy cập tiếp theo.

## 🎮 Điều khiển

| Phím | Chức năng |
|------|-----------|
| ↑ ↓ ← → | Di chuyển |
| Z | Button A |
| X | Button B |
| Enter | Start |
| Shift | Select |
| ESC | Quay lại |

## �️ Thêm ngôn ngữ mới

1. Tạo file mới trong `assets/data/lang/` (ví dụ: `jp.json`)
2. Copy nội dung từ `en.json` và dịch sang ngôn ngữ mới
3. Thêm language code vào `supportedLangs` trong `assets/js/i18n.js`

## 🔧 Generate danh sách games

Nếu bạn thêm ROMs mới:

```bash
npm run generate
# hoặc
node scripts/generate-games.js
```

## � Công nghệ sử dụng

- **[TailwindCSS](https://tailwindcss.com/)** - CSS framework
- **[Nostalgist.js](https://github.com/nicklockwood/Nostalgist)** - NES emulator
- **[Serve](https://www.npmjs.com/package/serve)** - Static file server

## 📝 Lưu ý

- ROMs không được bao gồm trong repository. Bạn cần tự cung cấp ROMs của riêng mình.
- Chỉ sử dụng ROMs mà bạn sở hữu hợp pháp.

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo Pull Request hoặc Issue.

## 📄 License

MIT License

---

Made with ❤️ by daiphu1801
