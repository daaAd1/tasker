import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { hashPassword } from "@lib/auth/passwords";
import prisma from "@db";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const task = await prisma.task.create({
      data: {
        body: req.body.body,
        taskListId: req.body.taskListId,
      },
      select: {
        id: true,
        body: true,
        taskListId: true,
      },
    });

    return res.status(200).json({
      message: "Task created.",
      data: task,
    });
  } catch (error) {
    console.error("[api] task/create", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().post(post);
