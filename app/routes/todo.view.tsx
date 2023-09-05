// routes/TodosList.tsx
import React, { useState } from "react";

import type { V2_MetaFunction } from "@remix-run/node";
import { useRef } from "react";
import { Link, useLoaderData,useFetcher, isRouteErrorResponse, useRouteError} from "@remix-run/react";
import { redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";
import SubTask from "~/components/features/subtask";
import TodoItem from "~/components/features/todoitem";
import StarRating from "~/components/ui/star-rating";

const todo_status = ["inprogress", "onhold", "completed"];


export let loader = async () => {
  const todos = await db.todo.findMany({
    include: {
      category: true,
      subtasks: true,
      userrating: true,
    }
  });

  //return json({ todos });
  return todos;
};

export async function action({ request }) {

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
  return redirect(".");
}  

export default function TodosList() {
  const todos = useLoaderData();
  const fetcher = useFetcher();
  const encodedRedirectTo = encodeURIComponent("todo/view");
  return (
    <div className="container mx-auto py-4 text-blue-900 prose">
      <h2>ALL TODOS</h2>
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-blue-100 text-gray-700">
          <tr>
            <th className="w-1/12 py-2 px-4 text-center text-gray-500">Toggle</th>
            <th className="w-3/12 py-2 px-4 text-center text-gray-500">Title</th>
            <th className="w-3/12 py-2 px-4 text-center text-gray-500">Status</th>
            <th className="w-2/12 py-2 px-4 text-center text-gray-500">Category</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
           {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
            ))}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}