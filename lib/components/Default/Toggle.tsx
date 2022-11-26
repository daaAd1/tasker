import classNames from "classnames";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

type ToggleProps = {
  className?: string;
};

const Toggle = ({ className }: ToggleProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">Theme</span>
        <input type="checkbox" className="toggle" checked />
      </label>
    </div>
  );
};

export default Toggle;
