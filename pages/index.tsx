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
import { useState, useEffect } from "react";
import { themeChange } from "theme-change";
import Toggle from "../lib/components/Default/Toggle";

const Page = ({ todoLists }) => {
  const { data: session } = useSession({
    required: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { data, refetch } = useQuery(["taskLists"], async () => {
    const data = await superagent.get("/api/tasklist/load");
    return data.body;
  });

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

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    const data = await superagent
      .get("/api/task/load")
      .query({ q: searchValue });

    console.log({ data: data.body });
  };

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <AppLayout>
        <button
          data-toggle-theme="dark,corporate"
          data-act-class="shadow-outline"
        >
          switch theme
        </button>
        <h1 className="text-4xl mb-4 mx-auto max-w-xs text-center">Tasker</h1>
        <input
          type="text"
          name="search_tasks"
          className="mx-auto input input-bordered input-primary block
        w-full max-w-xs border-base-200 rounded-md mb-6
        focus:outline-info focus:outline-offset-0 focus:outline-1"
          onChange={handleSearch}
          placeholder="search in tasks"
        />
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

  return {
    props: {
      session,
      todoLists: JSON.parse(JSON.stringify(todoLists)),
    },
  };
}

export default Page;
