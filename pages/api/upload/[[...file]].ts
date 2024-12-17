import type { NextApiRequest, NextApiResponse } from "next"
import { Server, Upload, EVENTS } from "@tus/server"
import { FileStore } from "@tus/file-store"
import { db } from "@/lib/db"
import { getRandomString } from "@/lib/utils"
import { NextResponse } from "next/server"
import { json } from "stream/consumers"

/**
 * !Important. This will tell Next.js NOT Parse the body as tus requires
 * @see https://nextjs.org/docs/api-routes/request-helpers
 */
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await db.userInfo.findUnique({
    where: {
      token: req.headers.authorization?.split(" ")[1] ?? "",
    },
  })

  if (!user) {
    return new NextResponse("Not Authorized.", { status: 401 })
  }

  const tusServer = new Server({
    // `path` needs to match the route declared by the next file router
    path: "/api/upload",
    datastore: new FileStore({ directory: "./data" }),
    namingFunction() {
      const id = getRandomString()
      const folder = user?.user // your custom logic
      return `${folder}/${id}`
    },
    generateUrl(req, { proto, host, path, id }) {
      id = Buffer.from(id, "utf-8").toString("base64url")
      return `${proto}://${host}${path}/${id}`
    },
    getFileIdFromRequest(req, lastPath) {
      // lastPath is everything after the last `/`
      // If your custom URL is different, this might be undefined
      // and you need to extract the ID yourself
      return Buffer.from(lastPath as Base64URLString, "base64url").toString(
        "utf-8"
      )
    },
    respectForwardedHeaders: true,
  })
  let uploadInfo = {}
  tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    console.log(upload)
    uploadInfo = upload
  })

  tusServer.handle(req, res)
  return NextResponse.json(uploadInfo)
}
