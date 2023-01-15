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

type Props = {
  className?: string;
  task: any;
};

const CardTask = ({ className, task }: Props) => {
  console.log({ task });
  return (
    <div className={classNames(`w-full flex flex-row `, className)}>
      <input
        name="is_finished"
        type="checkbox"
        className="peer checkbox checkbox-success rounded-md peer checked:opacity-40 mr-2 h-5 w-5"
        defaultChecked={task.isFinished}
        readOnly={true}
      />
      <span
        className={`overflow-hidden whitespace-nowrap text-sm
         overflow-ellipsis peer-checked:opacity-40 w-44`}
      >
        {task.body}
      </span>
    </div>
  );
};

export default CardTask;
