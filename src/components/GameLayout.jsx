export default function GameLayout({ title, description, children }) {
  return (
    <section className="card">
      <h1>{title}</h1>

      <p>{description}</p>

      {children}
    </section>
  );
}