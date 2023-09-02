// routes/TodosList.tsx
import { useState } from "react";

import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, useFetcher, useSubmit } from "@remix-run/react";
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

  return (
    <div className="container mx-auto py-4 text-blue-900">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/12 py-2 px-4 text-center text-gray-500">Toggle</th>
            <th className="w-3/12 py-2 px-4 text-center text-gray-500">Title</th>
            <th className="w-3/12 py-2 px-4 text-center text-gray-500">Status</th>
            <th className="w-3/12 py-2 px-4 text-center text-gray-500">Created At</th>
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
              <>
                <tr className="text-center">
                  <td className="py-2">
                    <button onClick={toggleOpen}>
                      {isOpen ? "-" : "+"}
                    </button>
                  </td>
                  <td className="py-2">{todo.title}</td>
                  <td className="py-2">{todo.status}</td>
                  <td className="py-2">{new Date(todo.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{todo.category ? todo.category.title : "N/A"}</td>
                </tr>

                {isOpen && (
                  <tr>
                    <td></td>
                    <td colSpan={4}>
                      {todo.subtasks.length > 0 ? (
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="w-6/12 py-2 text-center text-gray-500">Subtask Title</th>
                              <th className="w-6/12 py-2 text-center text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {todo.subtasks.map((subtask: any) => (
                              <tr key={subtask.id}>
                                <td className="py-2">{subtask.title}</td>
                                <td className="py-2">{subtask.status}</td>
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
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}