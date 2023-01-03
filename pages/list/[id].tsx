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

const ListPage = ({}) => {
  const { data: session } = useSession({
    required: false,
  });
  const router = useRouter();
  const listId = router.query.id as string;

  const [isLoading, setIsLoading] = useState(false);
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
                    handleDelete={() => undefined}
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
                    handleSearch={handleSearch}
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
