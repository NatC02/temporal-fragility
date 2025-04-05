import localFont from 'next/font/local';
import './globals.css';

const orbitronSans = localFont({
  src: './fonts/Orbitron-Regular.woff',
  variable: '--font-orbitron-regular',
  weight: '100 900',
});

export const metadata = {
  title: 'Temporal Fragility',
  description: 'Temporal Fragility',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${orbitronSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
