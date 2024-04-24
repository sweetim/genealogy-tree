import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { ConfigProvider, ThemeConfig } from 'antd';

const wallets = [
  new PetraWallet()
]

const antThemeConfig: ThemeConfig = {
  token: {
    fontFamily: "mali",
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <ConfigProvider theme={antThemeConfig}>
        <App />
      </ConfigProvider>
    </AptosWalletAdapterProvider>
  </React.StrictMode>,
)
