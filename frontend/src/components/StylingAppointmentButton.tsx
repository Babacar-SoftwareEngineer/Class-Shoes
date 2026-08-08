'use client';

import { useState } from 'react';

export default function StylingAppointmentButton() {
  const [requested, setRequested] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setRequested(true)}
      className="mt-8 bg-(--ink) px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-(--muted)"
    >
      {requested ? 'Demande enregistrée' : 'Réserver un rendez-vous'}
    </button>
  );
}
