import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { hashPassword } from "@lib/auth/passwords";
import prisma from "@db";

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body.body;
    const isFinished = req.body.isFinished;
    const taskListId = req.body.taskListId;

    const updatedData: {
      body?: string;
      isFinished?: boolean;
      taskListId?: string;
    } = {};
    if (body) {
      updatedData.body = body;
    }
    if (isFinished !== undefined) {
      updatedData.isFinished = isFinished;
    }
    if (taskListId) {
      updatedData.taskListId = taskListId;
    }

    const task = await prisma.task.update({
      where: {
        id: req.body.id,
      },
      data: updatedData,
    });

    return res.status(200).json({
      message: "Task updated.",
      data: task,
    });
  } catch (error) {
    console.error("[api] task/update", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().put(put);
