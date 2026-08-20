export default function CatalogUnavailable() {
  return (
    <section className="bg-(--page-bg) px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border-y border-(--line) py-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">Catalogue</p>
        <h2 className="mt-4 font-serif text-3xl text-(--ink)">Le catalogue est temporairement indisponible.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--muted)">
          Nous ne pouvons pas charger les produits pour le moment. Revenez un peu plus tard.
        </p>
      </div>
    </section>
  );
}