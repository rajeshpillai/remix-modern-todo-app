import React, { useState } from "react";

export default function SubTask({data}) {
  return (
    <ul>
      {data.map(st => {
        return (
          <li key={st.id}>
            <div className="flex justify-between">
              {st.title}
              <button type="button" className="btn bg-red-600 btn-xs self-end">X</button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}