import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
// import { PrismaClient, User } from "@prisma/client";
import { db } from "~/utils/db.server";


const todos = [
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


export async function loader() {
  return todos;
}

export async function action({ request }) {
  const form = await request.formData();

  console.log("POST DATA: ", form.get("title"));
  
  const newTodo = {
    id: todos.length + 1,
    title: form.get("title"),
    status: form.get("status"),
  };

  todos.push(newTodo);

  console.log("users(action): ", newTodo);
  return true;
}

export default function Index() {
  const todos = useLoaderData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        width: 600,
        margin: "auto",
      }}
    >
      <h2>Todo App</h2>
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
          {busy ? "Creating..." : "Create New Todo"}
        </button>
      </Form>

      {todos.map((todo) => (
        <div key={todo.id} style={{ border: "1px solid grey", padding: 6, margin: 8 }}>
          <div>{todo.title}</div>
          <div>{todo.status}</div>
        </div>
      ))}
    </div>
  );
}