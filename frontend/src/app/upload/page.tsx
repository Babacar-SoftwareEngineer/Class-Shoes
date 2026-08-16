import ImageUpload from '../../components/ImageUpload';

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <div className="border border-(--line) bg-(--page-bg) p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">Administration</p>
        <h1 className="mt-3 font-serif text-4xl text-(--ink)">Héberger une image</h1>
        <p className="mt-3 text-sm leading-6 text-(--muted)">
          Envoyez une image vers Cloudinary et récupérez son URL sécurisée.
        </p>
        <div className="mt-8">
          <ImageUpload />
        </div>
      </div>
    </section>
  );
}
