import "./globals.css"

import type { Metadata } from "next";
import { Mali } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, ThemeConfig } from 'antd';

const mali = Mali({
  weight: "400",
  subsets: ["latin"]
});

const antThemeConfig: ThemeConfig = {
  token: {
    fontFamily: "mali",
  },
}

export const metadata: Metadata = {
  title: "family tree",
  description: "family tree - genealogy tree dapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mali.className}>
        <ConfigProvider theme={antThemeConfig}>
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
