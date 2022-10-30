import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { hashPassword } from "@lib/auth/passwords";
import prisma from "@db";

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const task = await prisma.taskList.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
      },
    });

    return res.status(200).json({
      message: "Tasklist updated.",
      data: task,
    });
  } catch (error) {
    console.error("[api] tasklist/update", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().put(put);
