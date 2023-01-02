import classNames from "classnames";
import { XCircleIcon } from "@heroicons/react/24/outline";
import MoreOptionsDropdown from "../Default/MoreOptionsDropdown";

type TaskProps = {
  className?: string;
  handleFinishedCheck: (e) => void;
  handleChange: (e) => void;
  handleDelete: () => void;
  defaultChecked: boolean;
  defaultValue: string;
  otherTaskLists: any[];
  handleListChange: (listId) => void;
};

const Task = ({
  className,
  handleFinishedCheck,
  handleChange,
  handleDelete,
  defaultChecked,
  defaultValue,
  otherTaskLists,
  handleListChange,
}: TaskProps) => {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <div
        className={classNames(
          `w-full relative border border-gray-200 rounded-sm
           flex flex-row justify-between items-center px-4 shadow-sm`,
          className
        )}
      >
        <input
          name="is_finished"
          type="checkbox"
          className="absolute checkbox checkbox-success peer checked:opacity-40"
          onChange={handleFinishedCheck}
          defaultChecked={defaultChecked}
        />
        <input
          type="text"
          name="task_text"
          className="py-4 mx-10 w-full outline-none focus-within:outline-none bg-transparent"
          onChange={handleChange}
          defaultValue={defaultValue}
        />
        <button className="absolute p-4 right-0" onClick={handleDelete}>
          <XCircleIcon className="h-6 w-6 text-error" />
        </button>
      </div>
      <MoreOptionsDropdown
        taskLists={otherTaskLists}
        handleListChange={handleListChange}
      />
    </div>
  );
};

export default Task;
