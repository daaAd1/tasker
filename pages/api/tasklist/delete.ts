import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { hashPassword } from "@lib/auth/passwords";
import prisma from "@db";

const deleteTask = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const task = await prisma.taskList.delete({
      where: {
        id: req.body.id,
      },
    });

    return res.status(200).json({
      message: "Tasklist deleted.",
      data: task,
    });
  } catch (error) {
    console.error("[api] tasklist/delete", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().delete(deleteTask);
