import classNames from "classnames";
import Image from "next/image";
import {
  ArrowLeftOnRectangleIcon,
  AdjustmentsHorizontalIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { MoonIcon as MoonIconSolid } from "@heroicons/react/24/solid";
import { useQuery } from "react-query";
import superagent from "superagent";
import Loader from "../Loader";
import Link from "next/link";
import { buildListLink } from "../../../utils";
import React from "react";
import { signOut } from "next-auth/react";
import { useDarkMode } from "usehooks-ts";
import { useTheme } from "next-themes";

type Props = {
  className?: string;
};

const HeaderTitle = ({ className }: Props) => {
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useQuery(["taskLists"], async () => {
    const data = await superagent.get("/api/tasklist/load");
    return data.body;
  });

  return (
    <header
      className="flex flex-row items-center justify-between mb-4 h-full w-full mr-16 
      bg-white shadow-md px-6 py-4 rounded-b-2xl"
    >
      <h1
        className="text-2xl text-amber-800 hover:opacity-70
        transition-opacity duration-300"
      >
        <Link href={"/"}>
          <Image
            src={"/assets/logo.png"}
            width="100"
            height="80"
            alt="Tasker Logo"
          />
        </Link>
      </h1>
      <div className="flex flex-row w-full items-center justify-end">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <MoonIconSolid
              className={`cursor-pointer h-6 w-6 text-gray-600 
            transition-colors duration-300`}
            />
          ) : (
            <MoonIcon
              className={`cursor-pointer h-6 w-6 text-gray-400 
              hover:text-gray-600 transition-colors duration-300`}
            />
          )}
        </button>
        <a className="ml-6" onClick={() => signOut()}>
          <ArrowLeftOnRectangleIcon
            className="cursor-pointer h-6 w-6 text-gray-400 hover:text-gray-800 
          transition-colors duration-300 hover:scale-105"
          />
        </a>
      </div>
    </header>
  );
};

export default HeaderTitle;
