import classNames from "classnames";
import { TrashIcon } from "@heroicons/react/24/solid";

type TaskProps = {
  className?: string;
  defaultValue: string;
  handleChange: (e) => void;
  handleDelete: () => void;
};

const TaskList = ({
  className,
  handleChange,
  defaultValue,
  handleDelete,
}: TaskProps) => {
  return (
    <div
      className={classNames(
        `flex flex-row items-center mb-4 mx-auto justify-between
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
  );
};

export default TaskList;
