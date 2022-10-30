import AppLayout from "@lib/components/Layouts/AppLayout";
import Image from "next/image";
import prisma from "../db";
import { getSession } from "../lib/auth/session";
import superagent from "superagent";
import { styled } from "@stitches/react";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

const Button = styled("button", {
  backgroundColor: "gainsboro",
  borderRadius: "9999px",
  fontSize: "13px",
  padding: "10px 15px",
  "&:hover": {
    backgroundColor: "lightgray",
  },
});

const Input = styled("input", {
  borderRadius: "12px",
  border: "1px solid gainsboro",
  padding: "16px",
  marginRight: "16px",
});

const Form = styled("form", {
  marginTop: "16px",
});

const TaskRow = styled("div", {
  display: "flex",
  flexFlow: "row",
  alignItems: "center",
});

const Page = ({ todoLists }) => {
  const { data: session } = useSession({
    required: true,
  });
  console.log({ session });

  const { data, refetch } = useQuery(["taskLists"], async () => {
    const data = await superagent.get("/api/tasklist/load");
    return data.body;
  });

  console.log({ data });

  const createTaskHandler = async (e, listId) => {
    e.preventDefault();
    const inputValue = e.target.elements["new-todo"].value;

    await superagent.post("/api/task/create").send({
      body: inputValue,
      taskListId: listId,
    });

    refetch();
  };

  const createTaskListHandler = async (e) => {
    e.preventDefault();
    const inputValue = e.target.elements["new-tasklist"].value;

    await superagent.post("/api/tasklist/create").send({
      name: inputValue,
    });

    refetch();
  };

  const deleteHandler = async (id) => {
    await superagent.delete("/api/task/delete").send({
      id,
    });

    refetch();
  };

  const deleteListHandler = async (id) => {
    await superagent.delete("/api/tasklist/delete").send({
      id,
    });

    refetch();
  };

  const updateListHandler = async (e, id) => {
    const newVal = e.target.value;
    await superagent.put("/api/tasklist/update").send({
      name: newVal,
      id,
    });
  };

  const updateHandler = async (e, id) => {
    const newVal = e.target.value;
    await superagent.put("/api/task/update").send({
      body: newVal,
      id,
    });
  };

  const updateIsFinishedHandler = async (e, id) => {
    const newVal = e.target.checked;
    await superagent.put("/api/task/update").send({
      isFinished: newVal,
      id,
    });

    refetch();
  };

  const updateTaskListHandler = async (id) => {
    await superagent.put("/api/task/update").send({
      id,
      taskListId: "cl9txa8mk000oa718ks3qp294",
    });

    refetch();
  };

  return (
    <>
      <AppLayout>
        {/* <blockquote> */}
        <h1>Tasker</h1>

        {data &&
          data.map((list) => (
            <div key={list.id}>
              <TaskRow>
                <Input
                  onChange={(e) => updateListHandler(e, list.id)}
                  type="text"
                  defaultValue={list.name}
                />
                <button onClick={() => deleteListHandler(list.id)}>
                  [DELETE]
                </button>
              </TaskRow>
              <div>
                {list.tasks &&
                  list.tasks.map((task) => (
                    <TaskRow key={task.id}>
                      <input
                        onChange={(e) => updateIsFinishedHandler(e, task.id)}
                        type="checkbox"
                        checked={task.isFinished}
                      />
                      <Input
                        onChange={(e) => updateHandler(e, task.id)}
                        type="text"
                        defaultValue={task.body}
                      />
                      <Button onClick={() => updateTaskListHandler(task.id)}>
                        Change list
                      </Button>
                      <Button onClick={() => deleteHandler(task.id)}>
                        Delete
                      </Button>
                    </TaskRow>
                  ))}
              </div>
              <Form onSubmit={(e) => createTaskHandler(e, list.id)}>
                <Input name="new-todo" />
                <Button type="submit">Add task</Button>
              </Form>
            </div>
          ))}

        <Form onSubmit={createTaskListHandler}>
          <Input name="new-tasklist" />
          <Button type="submit">Add tasklist</Button>
        </Form>
      </AppLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log({ session });
  const todoLists = session
    ? await prisma.taskList.findMany({
        include: {
          tasks: true,
        },
        where: {
          users: { some: { id: session.user.id } },
        },
      })
    : [];
  console.log({ todoLists });

  return {
    props: {
      session,
      todoLists: JSON.parse(JSON.stringify(todoLists)),
    },
  };
}

export default Page;
