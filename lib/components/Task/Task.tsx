import classNames from "classnames";
import { XCircleIcon } from "@heroicons/react/24/outline";

type TaskProps = {
  className?: string;
  handleFinishedCheck: (e) => void;
  handleChange: (e) => void;
  handleDelete: () => void;
  defaultChecked: boolean;
  defaultValue: string;
};

const Task = ({
  className,
  handleFinishedCheck,
  handleChange,
  handleDelete,
  defaultChecked,
  defaultValue,
}: TaskProps) => {
  return (
    <div
      className={classNames(
        "flex flex-row w-full h-full justify-center content-center items-center",
        className
      )}
    >
      <input
        name="is_finished"
        type="checkbox"
        className="checkbox checkbox-success"
        onChange={handleFinishedCheck}
        defaultChecked={defaultChecked}
      />
      <input
        type="text"
        name="task_text"
        className="input input-bordered input-primary 
        w-full max-w-xs border-base-200 rounded-md ml-4
        focus:outline-info focus:outline-offset-0 focus:outline-1"
        onChange={handleChange}
        defaultValue={defaultValue}
      />
      <button className="p-4" onClick={handleDelete}>
        {" "}
        <XCircleIcon className="h-6 w-6 text-error" />
      </button>
    </div>
  );
};

export default Task;
