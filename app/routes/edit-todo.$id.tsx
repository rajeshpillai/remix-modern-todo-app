import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useParams, useLoaderData, useNavigation } from "@remix-run/react";


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
  console.log("Editing todo  with id = " + todo_id, new Date());
  // Get todo from todos array
  const todo = todos.find((todo) => todo.id == todo_id);
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
  const body = new URLSearchParams(await request.text());
  const title = body.get("title");
  const status = body.get("status");
  const todo_id = body.get("todo_id");
  // Update the todos array 
  todos = todos.map((todo) => {
    if (todo.id == todo_id) {
      return { ...todo, title, status };
    }
    return todo;
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