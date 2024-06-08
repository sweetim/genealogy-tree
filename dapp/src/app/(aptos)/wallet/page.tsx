"use client"

import {
  formatCoin,
  getAPTCoinWithDecimal,
  getAptosClient,
} from "@/common/aptosClient"
import {
  CoinsData,
  useAllWalletInfo,
} from "@/hooks/useAllWalletInfo"
import { UserOutlined } from "@ant-design/icons"
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Image,
  List,
  Row,
  Space,
  Typography,
} from "antd"
import classnames from "classnames"
import {
  FC,
  useMemo,
  useState,
} from "react"

const aptosClient = getAptosClient()

const { Meta } = Card
const { Paragraph, Title } = Typography

const WalletPage: FC = () => {
  const [ selectedIndex, setSelectedIndex ] = useState(0)

  const {
    accountAddress,
    coinsData,
    digitalAssetsData,
  } = useAllWalletInfo()

  async function faucetClickHandler() {
    if (!accountAddress) return

    const tx = await aptosClient.fundAccount({
      accountAddress: accountAddress,
      amount: getAPTCoinWithDecimal(10),
    })

    await aptosClient.waitForTransaction({
      transactionHash: tx.hash,
    })
  }

  function walletTabClickHandler(index: number) {
    setSelectedIndex(index)
  }

  const renderCoins = useMemo(() => (
    <List<CoinsData>
      itemLayout="horizontal"
      dataSource={coinsData}
      renderItem={(item, index) => (
        <List.Item key={item.name} className="!px-5">
          <List.Item.Meta
            avatar={<Avatar src={item.iconUri} />}
            title={item.symbol}
            description={item.name}
          />
          <h2 className="font-bold mr-2 text-base">{formatCoin(item.amount, item.decimals)}</h2>
        </List.Item>
      )}
    />
  ), [ coinsData ])

  const renderDigitalAssets = useMemo(() => (
    <Space className="p-2" direction="horizontal" wrap>
      {digitalAssetsData.map((asset, index) => (
        <Card
          key={index}
          style={{ width: 200 }}
          cover={
            <Image
              width={200}
              height={192}
              src={asset.imageUri}
              fallback="data:image/png;base64,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"
            />
          }
        >
          <Meta title={asset.name} />
        </Card>
      ))}
    </Space>
  ), [ digitalAssetsData ])

  const tabItems = [
    {
      title: "Coins",
      render: renderCoins,
    },
    {
      title: "Collectibles",
      render: renderDigitalAssets,
    },
  ] as const

  return (
    <Row className="h-full max-h-full">
      <Col className="h-full bg-zinc-100 py-5" span={6}>
        <Flex className="h-full" vertical align="center">
          <Space direction="vertical" size="middle" align="center">
            <Title>Wallet</Title>
            <Avatar size={64} icon={<UserOutlined />} />
            <Paragraph ellipsis copyable className="w-48 font-extrabold">
              {accountAddress?.toString()}
            </Paragraph>
          </Space>
          <Flex
            justify="center"
            align="center"
            gap="small"
            className="w-full p-3 bg-white"
          >
            <Button type="primary" className="w-1/3" onClick={faucetClickHandler}>Faucet</Button>
            <Button type="primary" className="w-1/3">Send</Button>
          </Flex>
          <ul className="text-start w-full">
            {tabItems.map((item, index) => {
              const className = classnames(
                "border-b hover:font-bold hover:bg-zinc-200 cursor-pointer p-5",
                {
                  "font-bold bg-zinc-200": selectedIndex === index,
                },
              )

              return (
                <li
                  key={item.title}
                  onClick={() => walletTabClickHandler(index)}
                  className={className}
                >
                  {item.title}
                </li>
              )
            })}
          </ul>
        </Flex>
      </Col>
      <Col span="18" className="bg-zinc-200">
        {tabItems[selectedIndex].render}
      </Col>
    </Row>
  )
}

export default WalletPage
