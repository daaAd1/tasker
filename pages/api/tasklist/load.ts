import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "lodash/isEmpty";
import nc from "next-connect";
import prisma, { Prisma } from "@db";
import { getSession } from "@lib/auth/session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { query } = req;
  const { listId }: { listId?: string } = query || {};

  let whereObject: any = { users: { some: { id: session.user.id } } };
  if (listId) {
    whereObject = { identifier: listId };
  }
  try {
    const tasks = await prisma.taskList.findMany({
      include: {
        tasks: {
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
        },
      },
      where: whereObject,
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("[api] tasklist/load", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().get(handler);
