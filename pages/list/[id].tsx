import AppLayout from "@lib/components/Layouts/AppLayout";
import Image from "next/image";
import superagent from "superagent";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { themeChange } from "theme-change";
import TaskList from "../../lib/components/TaskList/TaskList";
import { useRouter } from "next/router";

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
                  handleDelete={() => undefined}
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
      </AppLayout>
    </>
  );
};

export default ListPage;
