import { NextResponse } from "next/server"

export async function GET(request: Request): Promise<NextResponse> {
  return NextResponse.json({
    time: Date.now(),
  })
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const keyRestrictions = {
      keyName: "Signed Upload JWT",
      maxUses: 1,
      permissions: {
        endpoints: {
          data: {
            pinList: false,
            userPinnedDataTotal: false,
          },
          pinning: {
            pinFileToIPFS: true,
            pinJSONToIPFS: false,
            pinJobs: false,
            unpin: false,
            userPinPolicy: false,
          },
        },
      },
    }

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(keyRestrictions),
    }

    const jwtRepsonse = await fetch("https://api.pinata.cloud/users/generateApiKey", options)
    const json = await jwtRepsonse.json()
    const { JWT } = json

    return NextResponse.json({
      jwt: JWT,
    })
  } catch (e) {
    console.log(e)

    return NextResponse.json({
      message: "failed to obtain jwt",
    }, {
      status: 500,
    })
  }
}
