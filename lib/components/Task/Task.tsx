import classNames from "classnames";
import { XCircleIcon } from "@heroicons/react/24/outline";
import MoreOptionsDropdown from "../Default/MoreOptionsDropdown";
import { Reorder, useDragControls } from "framer-motion";
import { ReorderIcon } from "../Default/ReorderIcon";
import { useEffect, useRef, useState } from "react";
import { useAutosizeTextArea } from "../../../utils/hooks";

type TaskProps = {
  className?: string;
  handleFinishedCheck: (e) => void;
  handleChange: (e) => void;
  handleDelete: () => void;
  defaultChecked: boolean;
  defaultValue: string;
  otherTaskLists: any[];
  handleListChange: (listId) => void;
  task: any;
  noReorder?: boolean;
  isPreview;
  isPreview?: boolean;
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
  task,
  noReorder,
  isPreview,
}: TaskProps) => {
  const dragControls = useDragControls();
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

  const handleTaskChange = (e) => {
    handleChange(e);
    setValue(e.target.value);
  };

  const renderTaskContent = () => {
    return (
      <div
        className={`flex flex-row items-center justify-center w-full
      ${isPreview ? "h-10" : ""}`}
      >
        <div
          className={classNames(
            `w-full relative border border-gray-200 rounded-sm
   flex flex-row justify-between items-center px-4 shadow-sm`,
            className
          )}
        >
          {!isPreview && (
            <input
              name="is_finished"
              type="checkbox"
              className="peer absolute checkbox checkbox-success rounded-sm peer checked:opacity-40"
              onChange={handleFinishedCheck}
              defaultChecked={defaultChecked}
            />
          )}
          <textarea
            name="task_text"
            className={`overflow-hidden peer-checked:opacity-40 peer-checked:line-through
     w-full ${noReorder ? (isPreview ? "mr-0" : "mr-9") : "mr-18"}
     ${isPreview ? "ml-0" : "ml-10"} ${isPreview ? "line-clamp-1" : "py-4"}
        outline-none focus-within:outline-none bg-transparent resize-none`}
            onChange={handleTaskChange}
            value={value}
            rows={1}
            ref={isPreview ? null : textAreaRef}
            readOnly={isPreview}
          />
          {!noReorder && <ReorderIcon dragControls={dragControls} />}
          {!isPreview && (
            <button className="absolute p-3 right-0" onClick={handleDelete}>
              <XCircleIcon className="h-6 w-6 text-error" />
            </button>
          )}
        </div>
        {/* <MoreOptionsDropdown
taskLists={otherTaskLists}
handleListChange={handleListChange}
/> */}
      </div>
    );
  };

  return (
    <>
      {noReorder ? (
        renderTaskContent()
      ) : (
        <Reorder.Item
          value={task}
          id={task.id}
          dragListener={false}
          dragControls={dragControls}
        >
          {renderTaskContent()}
        </Reorder.Item>
      )}
    </>
  );
};

export default Task;
