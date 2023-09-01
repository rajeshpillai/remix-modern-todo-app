import React, { useState } from "react";

export default function SubTask({data}) {
  return (
    <ul>
      {data.map(st => {
        return (
          <li key={st.id}>
            <div>{st.title}</div>
          </li>
        )
      })}
    </ul>
  )
}