import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
  title: 'AAKAR - AI-powered Advisory & Knowledge for Aspirational Rural-enterprises | SIH 2026',
  description: 'Smart India Hackathon 2026 (PS SIH26091) - AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs in Jharkhand.',
  keywords: [
    'AAKAR',
    'Smart India Hackathon 2026',
    'SIH26091',
    'Rural Micro-Enterprises',
    'Jharkhand Business Advisory',
    'Micro Finance Scheme',
    'Term Loan Scheme',
    'Team CryptuS'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
