import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, useFetcher, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { Todo } from "@prisma/client";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { getUserId, requireUserId,} from "~/utils/session.server";

const todo_status = ["inprogress", "onhold", "completed"];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Todo App" },
    { name: "description", content: "Welcome to The Todo App!" },
  ];
};


export async function loader({request}) {
  const userId = await getUserId(request);
  console.log("userId(loader): ", userId);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const todos = await db.todo.findMany();
  console.log("todos(loader): ", todos);
  await db.$disconnect();
  return todos;
}


export async function action({ request }) {
  const form = await request.formData();

  console.log("POST DATA: ",request.method,  form.get("title"));
  
  switch(request.method) {
    case "DELETE":
      await handleDelete(form.get("id"));
      break;
    case "POST":
      const newTodo = {
        title: form.get("title"),
        status: form.get("status"),
      };
    
      // Fetch the first user from DB
      const user = await db.user.findFirst();

      // Add todo to db
      await db.todo.create({
        data: {
          title: newTodo.title,
          status: newTodo.status,
          userId: user?.id || 1
        },
      });
      
      break;
  }

  return true;
}

const handleDelete = async (id) => {
  // Delete todo from db 
  await db.todo.delete({
    where: {
      id: Number(id),
    },
  });

}

export default function Index() {
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
          <fetcher.Form method="delete">
            <input type="hidden" name="id" value={todo.id} />
            <button type="submit">
              Delete
            </button> | 
            <Link prefetch="intent" to={`/edit-todo/${todo.id}`}>Edit</Link>
          </fetcher.Form>
          
        </div>
      ))}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Route Error: ", error);

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a Todo List.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}