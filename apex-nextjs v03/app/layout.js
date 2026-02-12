import './globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata = {
  title: 'APEX Trading Protocol — AI Prediction Market Trading',
  description: 'Deploy autonomous AI agents to trade prediction markets on Polymarket and Kalshi. Zero fees. Managed wallets. Open skills marketplace.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="apex">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
