import { Form, Link, useLoaderData, useParams, useFetcher } from "@remix-run/react";
import { db } from "~/utils/db.server";

// export async function action({ request }) {
//   const form = await request.formData();
    
//   switch(request.method) {
//     case "DELETE":
//       await handleDelete(form.get("subtaskId"));
//       break;
//   }
//   return true;
// }



export default function SubTask({data}) {
  const fetcher = useFetcher();
  return (
    <ul>
      {data.map(st => {
        return (
          <li key={st.id}>
            <div className="flex justify-between">
              {st.title}
              <fetcher.Form method="delete" onSubmit={e => !confirm(`Are you sure you want to delete subtask "${st.title}"?`) ? e.preventDefault(): true}>
                <input type="hidden" name="subtaskId" value={st.id} />
                <button name="delete" value="subtask"  type="submit" className="btn bg-red-600 btn-xs self-end">X</button>
              </fetcher.Form>
            </div>
          </li>
        )
      })}
    </ul>
  )
}