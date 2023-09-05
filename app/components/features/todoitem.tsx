import React, { useState } from "react";
import { Link } from "@remix-run/react";

function TodoItem({ todo }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const encodedRedirectTo = encodeURIComponent("todo/view");

  return (
    <React.Fragment key={todo.id}>
      <tr className="text-center">
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
              <table className="min-w-full divide-y divide-gray-200 bg-gray-100">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="w-6/12 py-2 text-center text-gray-500">Subtask Title</th>
                    <th className="w-6/12 py-2 text-center text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-red-100 divide-y divide-gray-200">
                  {todo.subtasks.map((subtask) => (
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
}

export default TodoItem;
