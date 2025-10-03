module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Pretendard',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Montserrat',
          'Inter',
          'Pretendard',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#60a5fa', // blue-400
          dark: '#1e40af', // blue-800
        },
        accent: {
          DEFAULT: '#06b6d4', // cyan-500
          light: '#67e8f9', // cyan-300
          dark: '#0e7490', // cyan-700
        },
        headline: '#0f172a', // slate-900
        sub: '#334155', // slate-700
        contrast: '#fff',
        muted: '#64748b', // slate-500
        warning: '#f59e42',
        error: '#ef4444',
        success: '#22c55e',
        navy: '#1a237e', // 네이비
        gradientFrom: '#2563eb', // 그라데이션 시작
        gradientVia: '#06b6d4', // 그라데이션 중간
        gradientTo: '#1e3a8a', // 그라데이션 끝
        point: '#ff6f61', // 포인트 컬러(레드/오렌지)
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Montserrat', 'Pretendard', 'Inter', 'ui-sans-serif'],
      },
      fontWeight: {
        extrabold: 900,
        black: 950,
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'subtitle': ['1.5rem', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [],
}
