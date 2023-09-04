// routes/TodosList.tsx
import React, { useState } from "react";

import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData,useSearchParams, isRouteErrorResponse, useRouteError} from "@remix-run/react";
import { useRef } from "react";

import { db } from "~/utils/db.server";
import SubTask from "~/components/features/subtask";
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



export default function TodosList() {
  const todos = useLoaderData();
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
          {todos.map((todo: any) => {
            const [isOpen, setIsOpen] = useState(false);
            const toggleOpen = () => {
              setIsOpen(!isOpen);
            };

            return (
              <React.Fragment key={todo.id}>
                <tr className="text-center" key={todo.id}>
                  <td className="py-2">
                    <button className="bg-red-500 text-white w-6 h-6 rounded-full" onClick={toggleOpen}>
                      {isOpen ? "-" : "+"}
                    </button>
                  </td>
                  <td className="py-2">{todo.title}</td>
                  <td className="py-2">{todo.status}</td>
                  <td className="py-2">{todo.category ? todo.category.title : "N/A"}</td>
                </tr>

                {isOpen && (
                  <tr>
                    <td></td>
                    <td colSpan={4}>
                      <Link to={`/todo/${todo.id}/add?title=${todo.title}&redirect_to=${encodedRedirectTo}`} className="flex">+ subtask</Link>
                      {todo.subtasks.length > 0 ? (
                        <table className="min-w-full  divide-y divide-gray-200 bg-gray-100">
                          <thead className="bg-blue-100 text-gray-700">
                            <tr>
                              <th className="w-6/12 py-2 text-center text-gray-500">Subtask Title</th>
                              <th className="w-6/12 py-2 text-center text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-red-100 divide-y divide-gray-200">
                            {todo.subtasks.map((subtask: any) => (
                              <tr key={subtask.id}>
                                <td className="py-2 px-2">{subtask.title}</td>
                                <td className="py-2 px-2">{subtask.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No subtasks available.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
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