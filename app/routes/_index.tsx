import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, useFetcher } from "@remix-run/react";
import { db } from "~/utils/db.server";
import SubTask from "~/components/features/subtask";
import StarRating from "~/components/ui/star-rating";

const todo_status = ["inprogress", "onhold", "completed"];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Todo App" },
    { name: "description", content: "Welcome to The Todo App!" },
  ];
};


export async function loader() {
  const categories = await db.category.findMany();
  const todos = await db.todo.findMany({
    include: {
      category: true,
      subtasks: true,
    }
  });

  await db.$disconnect();
  
  return {todos, categories};
}


export async function action({ request }) {
  const form = await request.formData();
  const action = form.get("delete");

  console.log("POST DATA: ",request.method,  action);
  
  switch(request.method) {
    case "DELETE":
      if (action == "subtask")  {
        await handleDeleteSubTask(form.get("subtaskId"));
      } else if (action == "task") {
        await handleDelete(form.get("id"));
      }
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
          userId: user?.id || 1,
          categoryId: Number(form.get("categoryId")),
          
        },
      });
      
      break;
  }

  return true;
}

const handleDeleteSubTask = async (id) => {
  // Delete todo from db 
  await db.subtask.delete({
    where: {
      id: id,
    },
  });

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
  const {todos, categories} = useLoaderData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  const fetcher = useFetcher();

  const handleChange = (value) => {
    alert(value);
  }
  

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        width: 800,
        margin: "auto",
      }}
    >
      <div className="prose">
        
        <Form method="post">
          <div className="form-control w-full">
            <input name="title" placeholder="Todo title" size={30} className="input input-primary input-bordered w-full" />
          </div>

          <div className="form-control w-full">  
            <select name = "categoryId" className="select select-bordered">
            {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control w-full">  
            <select name="status" className="select select-bordered">
              {todo_status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="py-4 flex justify-end">
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? "Creating..." : "Create New Todo"}
            </button>
          </div>
        </Form>

        {todos.map((todo) => (
          <div className="card" key={todo.id} style={{ border: "1px solid grey", padding: 6, margin: 8 }}>
            <div className="card-body">
              <h2>{todo.title}</h2>
              <StarRating 
                count={5}
                size={40}
                value={4}
                activeColor ={'red'}
                inactiveColor={'#ddd'}
                onChange={handleChange}
              />
              <div>{todo.status}</div>
              <div>{todo.category.title}</div>
              
            </div>
            <div className="px-8 card-actions">
              <fetcher.Form method="delete" onSubmit={e => !confirm("Are you sure?") ? e.preventDefault(): true}>
                <input type="hidden" name="id" value={todo.id} />
                <button name="delete" value="task" type="submit" className="btn btn-sm bg-red-600">
                  Delete
                </button> | 
                <Link className="btn btn-sm" prefetch="intent" to={`/todo/edit/${todo.id}`}>Edit</Link>
              </fetcher.Form>
            </div>
            <div className="prose px-8">
              <div className="divider"/>
              <h3>Sub tasks:</h3> <Link to={`/todo/${todo.id}/add?title=${todo.title}`} className="flex">Add subtask</Link>
              { todo.subtasks.length > 0 ? <SubTask data ={todo.subtasks} /> : "No subtasks added!"}
            </div>
          </div>
        ))}
        </div>
      </div>
    );
}