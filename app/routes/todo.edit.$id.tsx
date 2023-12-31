import { V2_MetaFunction, redirect } from "@remix-run/node";
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
  const categories = await db.category.findMany();
  const todo_id = params?.id;
  console.log("Editing todo  with id = " + todo_id, new Date());
  
  // find todo based on params?.id 
  const todo = await db.todo.findUnique({
    include: {
      category: true
    },
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
    todo,
    categories
  }
}

export async function action({ request }) {
  const form = await request.formData();
  const title = form.get("title");
  const status = form.get("status");
  const todo_id = form.get("todo_id");
  const categoryId = form.get("categoryId");
  
  // Update the todo using prisma db object 
  const updatedTodo = await db.todo.update({
    where: {
      id: Number(todo_id),
    },
    data: {
      title: title,
      status: status,
      category: { 
        connect: {id: Number(categoryId)}
      }
    },
  });

  return redirect("/");
}  

export default function EditTodo() {
  const {todo, categories} = useLoaderData();
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
      <div className="prose">
        <h2>Edit Todo</h2>
        <h4>The best remix demo app in the world!</h4>
        <Form method="post">
          <div className="py-2 form-control w-full">
            <input className="input input-primary input-bordered w-full" name="title" placeholder="Todo title" size={30} defaultValue={todo.title}/>
            <input className="input input-primary input-bordered w-full" type="hidden" name="todo_id" value={todo.id}/>
          </div>
          <div className="py-2 form-control w-full">
            <select className="input input-primary input-bordered w-full" name="status" defaultValue={todo.status}>
              {todo_status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control w-full">
            <select className="input input-primary input-bordered w-full" name="categoryId" defaultValue={todo.categoryId}>
            {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="py-4 flex justify-end">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Editing..." : "Submit"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}