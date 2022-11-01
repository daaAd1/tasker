import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/solid";

type NewTaskListProps = {
  className?: string;
  handleAdd: (e) => void;
};

const NewTaskList = ({ className, handleAdd }: NewTaskListProps) => {
  return (
    <form
      onSubmit={handleAdd}
      className={classNames(
        `flex flex-col w-full h-full justify-center content-center items-center
         max-w-xs mx-auto mt-8`,
        className
      )}
    >
      <input
        name="is_finished"
        type="checkbox"
        className="checkbox checkbox-success invisible"
      />
      <input
        type="text"
        name="new-tasklist"
        className="input input-bordered w-full max-w-xs 
        border-base-200 rounded-t-md
        focus:outline-info focus:outline-offset-0 focus:outline-1"
        placeholder="Type your tasklist name here"
      />
      <button
        className="w-full btn btn-primary flex flex-row items-center justify-center"
        type="submit"
      >
        <PlusIcon className="h-6 w-6 text-white mr-4" />
        Create new task list
      </button>
    </form>
  );
};

export default NewTaskList;
