import classNames from "classnames";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type NewTaskProps = {
  className?: string;
  handleAdd: (e) => void;
};

const NewTask = ({ className, handleAdd }: NewTaskProps) => {
  const [newTask, setNewTask] = useState("");

  const handleNewTask = (e) => {
    setNewTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(e);
    setNewTask("");
  };

  return (
    <div className="h-14 mb-6 w-full">
      <form
        onSubmit={handleSubmit}
        className={classNames(
          `border border-gray-200 rounded-sm shadow-sm mb-6
        flex flex-row w-full h-full justify-center content-center items-center`,
          className
        )}
      >
        <input
          type="text"
          name="new-task"
          className="py-4 ml-4 mr-4 w-full outline-none focus-within:outline-none bg-transparent"
          placeholder="Type your new task here"
          onChange={handleNewTask}
          value={newTask}
        />
        <button
          className="px-4 py-2 text-4xl font-semibold bg-success text-white"
          type="submit"
        >
          {"+"}
        </button>
      </form>
    </div>
  );
};

export default NewTask;
