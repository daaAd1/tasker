import classNames from "classnames";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

type NewTaskProps = {
  className?: string;
  handleAdd: (e) => void;
};

const NewTask = ({ className, handleAdd }: NewTaskProps) => {
  return (
    <form
      onSubmit={handleAdd}
      className={classNames(
        "flex flex-row w-full h-full justify-center content-center items-center",
        className
      )}
    >
      <input
        name="is_finished"
        type="checkbox"
        className="checkbox checkbox-success  invisible"
      />
      <input
        type="text"
        name="new-task"
        className="input input-bordered w-full max-w-xs 
        border-base-200 rounded-md ml-4
        focus:outline-info focus:outline-offset-0 focus:outline-1"
        placeholder="Type your new task here"
      />
      <button className="p-4" type="submit">
        {" "}
        <PlusCircleIcon className="h-6 w-6 text-accent" />
      </button>
    </form>
  );
};

export default NewTask;
