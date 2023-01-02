import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  EllipsisVerticalIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

type MoreOptionsDropdownProps = {
  taskLists: any[];
  handleListChange: (listId) => void;
};

const MoreOptionsDropdown = ({
  taskLists,
  handleListChange,
}: MoreOptionsDropdownProps) => {
  console.log({ taskLists });
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="px-2 py-4">
        <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="px-4 py-3 shadow-xl min-w-[200px]
           rounded-md bg-white"
        >
          <DropdownMenu.Separator />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="bg-white flex flex-row items-center">
              <span className="mr-4">Move to other list</span>
              <div className="ml-auto">
                <ChevronRightIcon className="h-4 w-4 text-secondary-content" />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="px-4 py-2 shadow-lg rounded-md bg-white"
                sideOffset={8}
                alignOffset={-4}
              >
                {taskLists &&
                  taskLists.map((taskList) => {
                    return (
                      <DropdownMenu.Item key={taskList.id}>
                        <button onClick={() => handleListChange(taskList.id)}>
                          {taskList.name}
                        </button>
                      </DropdownMenu.Item>
                    );
                  })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
          {/* <DropdownMenu.Item>…</DropdownMenu.Item> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MoreOptionsDropdown;
