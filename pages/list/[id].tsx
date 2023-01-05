import AppLayout from "@lib/components/Layouts/AppLayout";
import Image from "next/image";
import superagent from "superagent";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import TaskList from "../../lib/components/TaskList/TaskList";
import { useRouter } from "next/router";
import classNames from "classnames";
import { ShareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import prisma from "../../db";
import toast from "react-hot-toast";
import { toastWrapper } from "../../utils";

const ListPage = ({}) => {
  const { data: session } = useSession({
    required: false,
  });

  const router = useRouter();
  const listId = router.query.id as string;

  const { data, refetch } = useQuery([`taskListDetail-${listId}`], async () => {
    const data = await superagent.get(`/api/tasklist/load`).query({ listId });
    return data.body;
  });
  const { data: allListsData } = useQuery(["taskLists"], async () => {
    const data = await superagent.get("/api/tasklist/load");
    return data.body;
  });

  const createTaskHandler = async (e, listId, generatedId: string) => {
    e.preventDefault();
    const inputValue = e.target.elements["new-task"].value;

    await superagent.post("/api/task/create").send({
      body: inputValue,
      taskListId: listId,
      id: generatedId,
    });

    refetch();
  };

  const deleteHandler = async (id) => {
    await superagent.delete("/api/task/delete").send({
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
    await toastWrapper(async () => {
      await superagent.put("/api/task/update").send({
        body: newVal,
        id,
      });
    });
  };

  const updateIsFinishedHandler = async (e, id) => {
    const newVal = e.target.checked;
    await superagent.put("/api/task/update").send({
      isFinished: newVal,
      id,
    });
  };

  const updateTaskListHandler = async (taskId, listId): Promise<void> => {
    await superagent.put("/api/task/update").send({
      id: taskId,
      taskListId: listId,
    });

    refetch();
  };

  const updateTasksOrder = async (listId, tasks): Promise<void> => {
    await toastWrapper(async () => {
      await superagent.put("/api/task/priority/update").send({
        tasks,
      });
    });
  };

  const handleListDelete = async (id: string): Promise<void> => {
    await superagent.delete("/api/tasklist/delete").send({
      id,
    });

    router.push("/");
  };

  return (
    <>
      <AppLayout>
        <div>
          {data &&
            data.map((list) => {
              return (
                <div className="mb-6" key={list.id}>
                  <TaskList
                    defaultValue={list.name}
                    handleChange={(e) => updateListHandler(list.id, e)}
                    handleDelete={handleListDelete}
                    list={list}
                    createTaskHandler={createTaskHandler}
                    updateIsFinishedHandler={updateIsFinishedHandler}
                    updateHandler={updateHandler}
                    deleteHandler={deleteHandler}
                    updateTaskListHandler={updateTaskListHandler}
                    otherTaskLists={
                      allListsData &&
                      allListsData.filter((d) => d.id !== list.id)
                    }
                    updateTasksOrder={updateTasksOrder}
                  />
                </div>
              );
            })}
        </div>
      </AppLayout>
    </>
  );
};

export default ListPage;
