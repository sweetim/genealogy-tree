"use client"

import {
  FC,
  useEffect,
  useState,
} from "react"
import {
  formatCoin,
  getAptosClient,
} from "@/common/aptosClient"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"
import CenterDiv from "@/modules/common/CenterDiv"
import {
  Avatar,
  Card,
  Flex,
  List,
  Tabs,
  Typography,
} from "antd"
import { UserOutlined } from "@ant-design/icons"
import type { TabsProps } from "antd"

const aptosClient = getAptosClient()

const { Meta } = Card
const { Paragraph, Title } = Typography

type CoinsData = {
  name: string
  symbol: string
  iconUri: string
  amount: number
  decimals: number
}

type TokenData = {
  name: string
  description: string
  imageUri: string
}

const WalletPage: FC = () => {
  const [ coinsData, setCoinsData ] = useState<CoinsData[]>([])
  const [ tokensData, setTokensData ] = useState<TokenData[]>([])

  const keylessAccount = useEphemeralKeyPairStore(state => state.keylessAccount)

  useEffect(() => {
    async function getCoinsData() {
      if (!keylessAccount) return

      const coinsData = await aptosClient.account.getAccountCoinsData({
        accountAddress: keylessAccount.accountAddress,
      })
      setCoinsData(coinsData.map(data => ({
        name: data.metadata?.name || "",
        symbol: data.metadata?.symbol || "",
        iconUri: data.metadata?.icon_uri || "/aptos.svg",
        amount: data.amount,
        decimals: data.metadata?.decimals || 0,
      })))
    }

    getCoinsData()
  }, [ keylessAccount ])

  useEffect(() => {
    async function getDigitalAssets() {
      if (!keylessAccount) return

      const tokens = await aptosClient.account.getAccountOwnedTokens({
        accountAddress: keylessAccount.accountAddress,
      })

      setTokensData(tokens.map(token => ({
        name: token.current_token_data?.token_name || "",
        description: token.current_token_data?.description || "",
        imageUri: token.current_token_data?.token_uri || "",
      })))
    }

    getDigitalAssets()
  }, [ keylessAccount ])

  const tabItems: TabsProps["items"] = [
    {
      key: "coins",
      label: "Coins",
      children: (
        <List<CoinsData>
          className="w-full"
          itemLayout="horizontal"
          dataSource={coinsData}
          renderItem={(item, index) => (
            <List.Item key={item.name}>
              <List.Item.Meta
                avatar={<Avatar src={item.iconUri} />}
                title={item.symbol}
                description={item.name}
              />
              <h2 className="font-bold">{formatCoin(item.amount, item.decimals)}</h2>
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "collectibles",
      label: "Collectibles",
      children: (
        <Flex wrap gap="small">
          {tokensData.map(token => (
            <Card
              key={token.name}
              style={{ width: 160 }}
              cover={<img alt={token.name} src={token.imageUri} />}
            >
              <Meta title={token.name} description={token.description} />
            </Card>
          ))}
        </Flex>
      ),
    },
  ]

  return (
    <CenterDiv>
      <Flex
        justify="center"
        align="center"
        gap="small"
        vertical
        className="w-96 p-3 bg-slate-300"
      >
        <Title>Wallet</Title>
        <Avatar size={64} icon={<UserOutlined />} />
        <Paragraph ellipsis copyable className="w-48 font-extrabold">
          {keylessAccount?.accountAddress.toString()}
        </Paragraph>
        <Tabs className="w-full px-1" defaultActiveKey="1" items={tabItems} />
      </Flex>
    </CenterDiv>
  )
}

export default WalletPage
