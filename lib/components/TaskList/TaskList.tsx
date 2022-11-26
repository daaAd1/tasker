import classNames from "classnames";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Reorder } from "framer-motion";
import NewTask from "../NewTask/NewTask";
import Task from "../Task/Task";
import { useEffect, useRef, useState } from "react";

type TaskProps = {
  className?: string;
  defaultValue: string;
  handleChange: (e) => void;
  handleDelete: () => void;
  list: any;
  createTaskHandler: (e, id) => void;
  updateIsFinishedHandler: (e, id) => void;
  updateHandler: (e, id) => void;
  deleteHandler: (id) => void;
  updateTaskListHandler: (taskId, listId) => void;
  otherTaskLists: any[];
  updateTasksOrder: (listid, tasksArray) => void;
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
}: TaskProps) => {
  const [showingType, setShowingType] = useState("all");
  const [tasks, setTasks] = useState([...list.tasks]);

  useEffect(() => {
    setTasks(list.tasks);
  }, [list.tasks]);

  const totalTasks = tasks.length;
  const finishedTasks = tasks.filter((t) => t.isFinished).length;

  let updateOrderTimeout = useRef(null);

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

  return (
    <>
      <div
        className={classNames(
          `flex flex-row items-center mx-auto justify-between
         w-full max-w-xs`,
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
        <button className="p-4" onClick={handleDelete}>
          <TrashIcon className="h-6 w-6 text-error" />
        </button>
      </div>
      <div
        className="text-center mx-auto mb-8
    text-secondary text-opacity-60 text-sm font-semibold"
      >
        {finishedTasks} of {totalTasks} tasks completed
      </div>
      <div className="flex flex-col gap-4">
        <NewTask handleAdd={(e) => createTaskHandler(e, list.id)} />
        <Reorder.Group axis="y" values={tasks} onReorder={handleReorder}>
          {shownTasks.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
              className="cursor-grabbing"
            >
              <Task
                handleFinishedCheck={(e) => updateIsFinishedHandler(e, task.id)}
                handleChange={(e) => updateHandler(e, task.id)}
                handleDelete={() => deleteHandler(task.id)}
                handleListChange={(listId) =>
                  updateTaskListHandler(task.id, listId)
                }
                defaultChecked={task.isFinished}
                defaultValue={task.body}
                otherTaskLists={otherTaskLists}
              />
            </Reorder.Item>
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
