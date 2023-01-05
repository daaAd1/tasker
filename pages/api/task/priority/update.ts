import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { hashPassword } from "@lib/auth/passwords";
import prisma from "@db";

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tasks = req.body.tasks;

    await prisma.$transaction(
      tasks.map((t, i) => {
        return prisma.$executeRaw`UPDATE Task SET priority = ${
          i + 1
        } WHERE id = ${t.id};`;
      })
    );

    return res.status(200).json({
      message: "Tasks' priority updated.",
    });
  } catch (error) {
    console.error("[api] task/priority/update", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default nc().put(put);
