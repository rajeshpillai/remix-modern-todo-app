import { Form, Link, useParams, useLoaderData, useNavigation } from "@remix-run/react";
import { db } from "~/utils/db.server";

/**
 *
 * @param param0
 * @returns
 */
export async function loader({ params }) {
  // get the user
  const user = await db.user.findUnique({
    where: {
      id: parseInt(params?.id),
    },
  });
  console.log("user with id = " + params?.id + " ", user);

  // get the bookmarks
  const usersBookmarks = await db.bookMark.findMany({
    where: {
      userId: parseInt(params?.id),
    },
    // include : {
    //     user : true
    // }
  });
  console.log("usersBookmarks with id = " + params?.id + " ", usersBookmarks);
  await db.$disconnect();
  return { bookmarks: usersBookmarks, user };
}

/**
 *
 * @param param0
 * @returns
 */
export async function action({ request }) {
  const form = await request.formData();

  // HANDLE CREATION
  if (request.method === "POST") {
    const bookmark = await db.bookMark.create({
      data: {
        text: form.get("text"),
        url: form.get("url"),
        user: {
          connect: {
            id: parseInt(form.get("id")),
          },
        },
      },
    });
    console.log("created bookmark ", bookmark);
  }

  // HANDLE DELETE
  if (request.method === "DELETE") {
    const delResponse = await db.bookMark.delete({
      where: {
        id: parseInt(form.get("id")),
      },
    });
    console.log(delResponse);
  }
  await db.$disconnect();
  return true;
}

/**
 *
 * @returns
 */
export default function BookMarksById() {
  const { bookmarks, user } = useLoaderData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";

  const { id } = useParams();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        width: 600,
        margin: "auto",
      }}
    >
      <div>
        <Link to={`/`}>
          <button>HOME</button>
        </Link>
      </div>
      <h2>Manage Book Marks for {user?.username}</h2>
      <Form method="post">
        <div>
          <input name="text" placeholder="description" size={30} />
          <input name="url" placeholder="url" size={30} />
          <input type={"hidden"} value={id} name="id" />
        </div>
        <button type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create New Bookmark"}
        </button>
      </Form>

      {bookmarks?.map((bookmark) => (
        <div
          style={{ border: "1px solid grey", padding: 6, margin: 8 }}
          key={bookmark.id}
        >
          <div>{bookmark.createdAt}</div>
          <div>{bookmark.text}</div>
          <div>{bookmark.url}</div>

          <Form method="delete" >
            <input type={"hidden"} value={bookmark.id} name="id" />
            <button type="submit">DELETE</button>
          </Form>
        </div>
      ))}
    </div>
  );
}