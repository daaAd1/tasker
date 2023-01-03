import classNames from "classnames";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ShareIcon } from "@heroicons/react/24/outline";
import { Reorder, useDragControls } from "framer-motion";
import NewTask from "../NewTask/NewTask";
import Task from "../Task/Task";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { buildListLink } from "../../../utils";
import prisma from "../../../db";
import cuid from "cuid";

type TaskProps = {
  className?: string;
  defaultValue: string;
  handleChange: (e) => void;
  handleDelete: () => void;
  list: any;
  createTaskHandler: (e, id, createTaskHandler: string) => void;
  updateIsFinishedHandler: (e, id) => void;
  updateHandler: (e, id) => void;
  deleteHandler: (id) => void;
  updateTaskListHandler: (taskId, listId) => void;
  otherTaskLists: any[];
  updateTasksOrder: (listid, tasksArray) => void;
  handleSearch: (e) => void;
};

const TaskList = ({
  className,
  handleChange,
  defaultValue,
  handleDelete,
  list,
  createTaskHandler,
  updateIsFinishedHandler,
  updateHandler,
  deleteHandler,
  updateTaskListHandler,
  otherTaskLists,
  updateTasksOrder,
  handleSearch,
}: TaskProps) => {
  const [showingType, setShowingType] = useState("all");
  const [tasks, setTasks] = useState([...list.tasks]);
  const router = useRouter();

  // useEffect(() => {
  //   setTasks(list.tasks);
  // }, [list.tasks]);

  const totalTasks = tasks.length;
  const finishedTasks = tasks.filter((t) => t.isFinished).length;

  let updateOrderTimeout = useRef(null);
  let updateTaskTimeout = useRef(null);

  const handleReorder = (newArray): void => {
    setTasks(newArray);

    if (updateOrderTimeout && updateOrderTimeout.current) {
      clearTimeout(updateOrderTimeout.current);
    }
    updateOrderTimeout.current = setTimeout(() => {
      updateTasksOrder(list.id, newArray);
    }, 200);
  };

  const showingTypeOptions = [
    {
      value: "all",
      name: "All",
    },
    {
      value: "active",
      name: "Active",
    },
    {
      value: "completed",
      name: "Completed",
    },
  ];
  const shownTasks =
    showingType === "completed"
      ? tasks.filter((t) => t.isFinished)
      : showingType === "active"
      ? tasks.filter((t) => !t.isFinished)
      : tasks;

  const handleCopyLink = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(buildListLink(list.identifier));
    }
  };
  const createNewTask = (e): void => {
    e.preventDefault();
    const inputValue = e.target.elements["new-task"].value;
    const newArray = [...tasks];
    const generatedId = cuid();
    newArray.unshift({
      body: inputValue,
      isFinished: false,
      priority: null,
      id: generatedId,
    });
    setTasks(newArray);
    createTaskHandler(e, list.id, generatedId);
  };

  const handleTaskChange = (e, taskId): void => {
    if (updateTaskTimeout && updateTaskTimeout.current) {
      clearTimeout(updateTaskTimeout.current);
    }
    updateTaskTimeout.current = setTimeout(() => {
      updateHandler(e, taskId);
    }, 400);
  };

  const handleTaskDelete = (taskId): void => {
    const newArray = [...tasks];
    newArray.splice(
      newArray.findIndex((t) => t.id === taskId),
      1
    );
    setTasks(newArray);
    deleteHandler(taskId);
  };

  return (
    <>
      <div
        className={classNames(
          `flex flex-row items-center mx-auto justify-between
         w-full max-w-md`,
          className
        )}
      >
        <input
          onChange={handleChange}
          type="text"
          name="tasklist_name"
          defaultValue={defaultValue}
          className="border-0 border-b-2 border-b-transparent text-2xl w-full outline-none
         focus-visible:border-b-primary-content transition-colors"
          title="Edit tasklist name"
        />
        <button>
          <ShareIcon
            className="h-6 w-6 text-primary"
            onClick={handleCopyLink}
          />
        </button>
        <button className="p-4" onClick={handleDelete}>
          <TrashIcon className="h-6 w-6 text-error" />
        </button>
      </div>
      <div
        className="text-center mx-auto mb-2
    text-secondary text-opacity-60 text-sm font-semibold"
      >
        {finishedTasks} of {totalTasks} tasks completed
      </div>
      <input
        type="text"
        name="search_tasks"
        className="mx-auto input input-bordered input-primary block
        w-full max-w-xs border-base-200 rounded-md mb-6
        focus:outline-info focus:outline-offset-0 focus:outline-1"
        onChange={handleSearch}
        placeholder="search in tasks"
      />

      <div className="">
        <NewTask handleAdd={createNewTask} />
        <Reorder.Group
          className="flex flex-col gap-2"
          axis="y"
          values={tasks}
          onReorder={handleReorder}
        >
          {shownTasks.map((task) => (
            <Task
              task={task}
              key={task.id}
              handleFinishedCheck={(e) => updateIsFinishedHandler(e, task.id)}
              handleChange={(e) => handleTaskChange(e, task.id)}
              handleDelete={() => handleTaskDelete(task.id)}
              handleListChange={(listId) =>
                updateTaskListHandler(task.id, listId)
              }
              defaultChecked={task.isFinished}
              defaultValue={task.body}
              otherTaskLists={otherTaskLists}
            />
          ))}
        </Reorder.Group>
      </div>
      <div className="flex flex-row items-center mx-auto justify-center mt-6">
        {showingTypeOptions.map((opt, i) => {
          return (
            <button
              key={opt.value}
              className={`px-4 py-2 mx-1 font-semibold text-xs rounded-md bg-secondary h-8 ${
                opt.value === showingType ? "opacity-100" : "opacity-60"
              }`}
              onClick={() => setShowingType(opt.value)}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default TaskList;
