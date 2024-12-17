import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"

const allowedUser = process.env.ALLOWED_USERS?.split(",") ?? [""]

type UserManagerType = {
  params: {
    userId: string
  }
}

export async function GET(request: Request, props: UserManagerType) {
  const { userId } = await props.params
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const token = request.headers.get("authorization")?.split(" ")[1] as string

  if (!userId || !allowedUser.includes(userId)) {
    return new NextResponse(
      "Not include in Allowed Users, contact the site manager to add you into the 'ALLOWED_USERS'.",
      { status: 401 }
    )
  }

  const userInfo = await db.userInfo.findUnique({ where: { user: userId } })

  if (!userInfo) {
    const newUser = await db.userInfo.create({
      data: { user: userId, token: uuidv4() },
    })
    return NextResponse.json(newUser)
  }

  if (!token) {
    return new NextResponse("No token provided", {
      status: 401,
    })
  }

  const user = await db.userInfo.findUnique({
    where: {
      token,
    },
  })

  if (!user || user.user !== userId) {
    return new NextResponse("Miss Auth", {
      status: 401,
    })
  }

  if (action === "changeToken") {
    const newToken = await db.userInfo.update({
      where: {
        user: userId,
      },
      data: {
        token: uuidv4(),
      },
    })
    return NextResponse.json(newToken)
  }

  userInfo.token = "[hidden...]"

  return NextResponse.json(userInfo)
}
