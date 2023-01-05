import classNames from "classnames";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ShareIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Reorder, useDragControls } from "framer-motion";
import NewTask from "../NewTask/NewTask";
import Task from "../Task/Task";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { buildListLink } from "../../../utils";
import prisma from "../../../db";
import cuid from "cuid";
import toast from "react-hot-toast";
import superagent from "superagent";
import { useAutosizeTextArea } from "../../../utils/hooks";
import { confirmAlert } from "react-confirm-alert";
import ConfirmModal from "../Default/ConfirmModal";

type TaskProps = {
  className?: string;
  defaultValue: string;
  handleChange: (e) => void;
  handleDelete: (listId: string) => void;
  list: any;
  createTaskHandler: (e, id, createTaskHandler: string) => void;
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
  const [searchData, setSearchData] = useState(null);

  const [value, setValue] = useState(defaultValue);
  const [isInitialHeightSet, setIsInitialHeightSet] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  if (!isInitialHeightSet) {
    setTimeout(() => {
      if (textAreaRef && textAreaRef.current) {
        textAreaRef.current.style.height = "0px";
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = scrollHeight + "px";
        setIsInitialHeightSet(true);
      }
    }, 50);
  }

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

  const handleTaskListDelete = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmModal
            handleConfirm={() => {
              handleDelete(list.id);
              onClose();
            }}
            handleClose={onClose}
          />
        );
      },
    });
  };

  const handleCopyLink = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(buildListLink(list.identifier));
      toast.success("Link to list successfully copied!", { duration: 2000 });
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

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    if (searchValue && searchValue.length > 2) {
      const data = await superagent
        .get("/api/task/load")
        .query({ q: searchValue });
      const body = data.body;

      setSearchData(body);
    } else {
      setSearchData(null);
    }
  };

  const handleTaskListNameChange = (e) => {
    handleChange(e);
    setValue(e.target.value);
  };
  return (
    <>
      <div
        className={classNames(
          `flex flex-row items-center mx-auto justify-between
         w-full max-w-md mb-4`,
          className
        )}
      >
        <textarea
          rows={1}
          name="tasklist_name"
          onChange={handleTaskListNameChange}
          value={value}
          className="border-0 border-b-2 border-b-transparent text-2xl w-full outline-none
         focus-visible:border-b-primary-content transition-colors 
         focus-within:border-b-primary-content active:border-b-primary-content
          focus-within:border-b-2 pr-4 overflow-hidden bg-transparent
          resize-none"
          title="Edit tasklist name"
          ref={textAreaRef}
        />
        <button>
          <ShareIcon
            className="h-6 w-6 text-gray-600 cursor-copy"
            onClick={handleCopyLink}
          />
        </button>
        <button className="p-4" onClick={handleTaskListDelete}>
          <TrashIcon className="h-6 w-6 text-error" />
        </button>
      </div>
      <div
        className=" mx-auto mb-2 text-gray-600
    text-opacity-60 text-xs font-semibold"
      >
        {finishedTasks} of {totalTasks} tasks completed
      </div>
      <div className="relative">
        <input
          type="text"
          name="search_tasks"
          className="peer mx-auto input input-bordered input-primary block pl-12
        w-full rounded-2xl mb-6 h-12 border-gray-200 shadow-sm text-gray-600
        focus:outline-info focus:outline-offset-0 focus:outline-1 placeholder:text-gray-400"
          onChange={handleSearch}
          placeholder="search in tasks"
        />
        <MagnifyingGlassIcon
          className="h-6 w-6 text-gray-400 transition-colors duration-300
        peer-focus-within:text-gray-600 absolute top-3 left-4"
        />
      </div>

      <div className="mt-12">
        <NewTask handleAdd={createNewTask} />

        {searchData && (
          <div className="flex flex-col gap-2">
            {searchData.map((task) => (
              <Task
                noReorder={true}
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
          </div>
        )}
        {!searchData && (
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
        )}
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
