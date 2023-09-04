import React, {useRef} from "react";
import { useParams, Form, useSearchParams  } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

const todo_status = ["inprogress", "onhold", "completed"];



export async function action({ request }) {

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirect_to')

  const form = await request.formData();
  const title = form.get("title");
  const status = form.get("status");
  const todoId = form.get("todoId");
  
  // Update the todo using prisma db object 
  await db.subtask.create({
    data: {
      title: title,
      status: status,
      todoId: Number(todoId)
    },
  });

  console.log("REDIRECT TO: ", redirectTo);
  if (redirectTo) {
    return redirect("/" + redirectTo);
  }
  return redirect("/");
}  

export default function SubTaskForm() {
  const [searchParams, _] = useSearchParams();
  let {todoId} = useParams();

  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.4",
      width: 800,
      margin: "auto",
    }}>
      <h2>Add Subtask for: {searchParams.get("title")}</h2>
      
      <Form method="post">
        <input type="hidden" value={todoId} name = "todoId"></input>
        <div className="py-2 form-control w-full">
          <input className="input input-primary input-bordered w-full" type="text" name = "title"></input>
        </div>
        <div className="py-2 form-control w-full">
            <select className="input input-primary input-bordered w-full" name="status" >
              {todo_status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="py-4 flex justify-end">
            <button type="submit" className="btn btn-primary">
               Save
            </button>
          </div>
      </Form>
    </div>
  )
}