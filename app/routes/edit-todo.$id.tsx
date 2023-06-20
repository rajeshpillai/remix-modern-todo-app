import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useParams, useLoaderData, useNavigation, useFetcher } from "@remix-run/react";
// import { PrismaClient, User } from "@prisma/client";
import { db } from "~/utils/db.server";


let todos = [
  {id: 1, title: "Todo 1", status: "completed"},
  {id: 2, title: "Todo 2", status: "onhold"},
  {id: 3, title: "Todo 3", status: "onhold"},
  {id: 4, title: "Todo 4", status: "inprogress"},
];

const todo_status = ["inprogress", "onhold", "completed"];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Todo App" },
    { name: "description", content: "Welcome to The Todo App!" },
  ];
};

export async function loader({ params }) {
  const todo_id = params?.id;
  console.log("Editing todo  with id = " + todo_id);

  return todo_id;
}



export default function EditTodo() {
  const todos = useLoaderData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  const fetcher = useFetcher();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        width: 600,
        margin: "auto",
      }}
    >
      <h2>Edit App</h2>
      <h4>The best remix demo app in the world!</h4>
      <Form method="post">
        <div>
          <input name="title" placeholder="Todo title" size={30} />
        </div>
        <div>
          <select name="status">
            {todo_status.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={busy}>
          {busy ? "Editing..." : "Edit Todo"}
        </button>
      </Form>
    </div>
  );
}