import app from "./app";

const port = process.env.PORT as string | 5005;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
