import classNames from "classnames";
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

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useQuery(["taskLists"], async () => {
    const data = await superagent.get("/api/tasklist/load");
    return data.body;
  });

  return (
    <div className="h-full w-52 mr-16">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1
          className="text-2xl text-amber-800 hover:opacity-70
        transition-opacity duration-300"
        >
          <Link href={"/"}>Tasker</Link>
        </h1>
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
      </div>
      <aside
        className="flex flex-col gap-4 border border-gray-100 shrink-0
    hover:shadow-md p-6 rounded-xl h-full w-full transition-shadow duration-300"
      >
        <div className="flex flex-row items-center mb-6 justify-between">
          <a onClick={() => signOut()}>
            <ArrowLeftOnRectangleIcon
              className="cursor-pointer h-6 w-6 text-gray-400 hover:text-gray-800 
          transition-colors duration-300 mr-6 hover:scale-105"
            />
          </a>
          <Link href={"/settings"}>
            <AdjustmentsHorizontalIcon
              className="h-6 w-6 text-gray-400 hover:text-gray-800 
        transition-colors duration-300 hover:scale-105"
            />
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-row md:flex-col justify-start items-start overflow-x-auto md:overflow-hidden">
            {data &&
              data.map((list) => {
                return (
                  <div key={list.id} className="group w-full shrink-0 md:w-fit">
                    <Link
                      className="rounded-xl text-left text-gray-400 group-hover:text-gray-800 
                  transition-all duration-300 pb-2 break-all"
                      href={buildListLink(list.identifier)}
                    >
                      {list.name}
                    </Link>
                    <div
                      className="w-4 bg-gray-200 h-px  group-hover:w-full transition-all duration-300
                  group-hover:bg-gray-800"
                    />
                  </div>
                );
              })}
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
