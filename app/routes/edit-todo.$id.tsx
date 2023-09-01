import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useParams, useLoaderData, useNavigation } from "@remix-run/react";
import { db } from "~/utils/db.server";



const todo_status = ["inprogress", "onhold", "completed"];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Todo App" },
    { name: "description", content: "Welcome to The Todo App!" },
  ];
};

export async function loader({ params }) {
  const todo_id = params?.id;
  console.log("Editing todo  with id = " + todo_id, new Date());
  
  // find todo based on params?.id 
  const todo = await db.todo.findUnique({
    where: {
      id: Number(todo_id),
    },
  });
  
  return {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    todo
  }
}

export async function action({ request }) {
  // Get the todo title from the request (form submission)
  // const body = new URLSearchParams(await request.text());
  // const title = body.get("title");
  // const status = body.get("status");
  // const todo_id = body.get("todo_id");

  const form = await request.formData();
  const title = form.get("title");
  const status = form.get("status");
  const todo_id = form.get("todo_id");
  
  // Update the todo using prisma db object 
  const updatedTodo = await db.todo.update({
    where: {
      id: Number(todo_id),
    },
    data: {
      title: title,
      status: status,
    },
  });

  return null;
}  

export default function EditTodo() {
  const {todo} = useLoaderData();
  console.log(todo);

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
      <h2>Edit App</h2>
      <h4>The best remix demo app in the world!</h4>
      <Form method="post">
        <div>
          <input name="title" placeholder="Todo title" size={30} defaultValue={todo.title}/>
          <input type="hidden" name="todo_id" value={todo.id}/>
        </div>
        <div>
          <select name="status" defaultValue={todo.status}>
            {todo_status.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={busy}>
          {busy ? "Editing..." : "Submit"}
        </button>
      </Form>
    </div>
  );
}