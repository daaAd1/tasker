import AppLayout from "@lib/components/Layouts/AppLayout";
import Image from "next/image";
import prisma from "../db";
import { getSession } from "../lib/auth/session";
import superagent from "superagent";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import Task from "../lib/components/Task/Task";
import TaskList from "../lib/components/TaskList/TaskList";
import NewTask from "../lib/components/NewTask/NewTask";
import NewTaskList from "../lib/components/NewTaskList/NewTaskList";
import Loader from "../lib/components/Loader";
import { useState } from "react";

const Page = ({ todoLists }) => {
  const { data: session } = useSession({
    required: true,
  });
  console.log({ session });

  const [isLoading, setIsLoading] = useState(false);
  const { data, refetch } = useQuery(["taskLists"], async () => {
    const data = await superagent.get("/api/tasklist/load");
    return data.body;
  });

  console.log({ data });

  const createTaskHandler = async (e, listId) => {
    e.preventDefault();
    const inputValue = e.target.elements["new-task"].value;

    await superagent.post("/api/task/create").send({
      body: inputValue,
      taskListId: listId,
    });

    refetch();
  };

  const createTaskListHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const inputValue = e.target.elements["new-tasklist"].value;

    await superagent.post("/api/tasklist/create").send({
      name: inputValue,
    });

    refetch();
    setIsLoading(false);
  };

  const deleteHandler = async (id) => {
    await superagent.delete("/api/task/delete").send({
      id,
    });

    refetch();
  };

  const deleteListHandler = async (id) => {
    await superagent.delete("/api/tasklist/delete").send({
      id,
    });

    refetch();
  };

  const updateListHandler = async (id, e) => {
    const newVal = e.target.value;
    await superagent.put("/api/tasklist/update").send({
      name: newVal,
      id,
    });
  };

  const updateHandler = async (e, id) => {
    const newVal = e.target.value;
    await superagent.put("/api/task/update").send({
      body: newVal,
      id,
    });
  };

  const updateIsFinishedHandler = async (e, id) => {
    const newVal = e.target.checked;
    await superagent.put("/api/task/update").send({
      isFinished: newVal,
      id,
    });

    // refetch();
  };

  const updateTaskListHandler = async (taskId, listId) => {
    await superagent.put("/api/task/update").send({
      id: taskId,
      taskListId: listId,
    });

    refetch();
  };

  const updateTasksOrder = async (listId, tasks) => {
    // aaa;
    console.log("updating order");
  };

  return (
    <>
      <AppLayout>
        <h1 className="text-4xl mb-10 mx-auto max-w-xs text-center">Tasker</h1>
        {data &&
          data.map((list) => {
            return (
              <div className="mb-6" key={list.id}>
                <TaskList
                  defaultValue={list.name}
                  handleChange={(e) => updateListHandler(list.id, e)}
                  handleDelete={() => deleteListHandler(list.id)}
                  list={list}
                  createTaskHandler={createTaskHandler}
                  updateIsFinishedHandler={updateIsFinishedHandler}
                  updateHandler={updateHandler}
                  deleteHandler={deleteHandler}
                  updateTaskListHandler={updateTaskListHandler}
                  otherTaskLists={data.filter((d) => d.id !== list.id)}
                  updateTasksOrder={updateTasksOrder}
                />
              </div>
            );
          })}
        {isLoading && <Loader />}

        <NewTaskList handleAdd={createTaskListHandler} />
      </AppLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log({ session });
  const todoLists = session
    ? await prisma.taskList.findMany({
        include: {
          tasks: true,
        },
        where: {
          users: { some: { id: session.user.id } },
        },
      })
    : [];
  console.log({ todoLists });

  return {
    props: {
      session,
      todoLists: JSON.parse(JSON.stringify(todoLists)),
    },
  };
}

export default Page;
