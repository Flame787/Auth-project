import { Link, useSubmit, useRouteLoaderData } from "react-router-dom";

import classes from "./EventItem.module.css";

function EventItem({ event }) {

  const token = useRouteLoaderData("root");
  // getting loader data from the root route

  const submit = useSubmit();

  function startDeleteHandler() {
    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      submit(null, { method: "delete" });
    }
  }

  // const API_BASE = process.env.REACT_APP_API_URL || "";   // for production - in .env: insert real domain url as REACT_APP_API_URL

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      {/* <img src={`${API_BASE}${event.image}`} alt={event.title} />     // for production   */}
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      {/* only showing the Edit-option for events if the user is registered (has token): */}
      {token && (
        <menu className={classes.actions}>
          <Link to="edit">Edit</Link>
          <button onClick={startDeleteHandler}>Delete</button>
        </menu>
      )}
    </article>
  );
}

export default EventItem;
