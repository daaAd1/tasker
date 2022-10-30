import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { hashPassword } from "@lib/auth/passwords";
import prisma from "@db";
import { getSession } from "../../../lib/auth/session";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  try {
    const taskList = await prisma.taskList.create({
      data: {
        name: req.body.name,
        identifier: "",
        users: {
          connect: [
            {
              id: session.user.id,
            },
          ],
        },
      },
    });

    return res.status(200).json({
      message: "Tasklist created.",
      data: taskList,
    });
  } catch (error) {
    console.error("[api] tasklist/create", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().post(post);
