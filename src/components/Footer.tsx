export default function Footer() {
  return (
    <footer
      className="py-8 px-4 text-center space-y-2"
      style={{ borderTop: "1px solid var(--divider)" }}
    >
      <p
        className="text-xs leading-relaxed max-w-lg mx-auto"
        style={{ color: "var(--text-tertiary)" }}
      >
        FoodCheck adalah alat bantu informatif dan{" "}
        <strong style={{ color: "var(--text-secondary)" }}>
          bukan pengganti saran medis profesional
        </strong>
        . Selalu konsultasikan dengan dokter atau ahli gizi untuk keputusan
        kesehatan.
      </p>
      <p
        className="text-[11px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        Sumber: BPOM RI, EFSA, WHO, Codex Alimentarius
      </p>
      <p
        className="text-[11px] pt-4 font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        Developed by Kateam (aka Radja)
      </p>
    </footer>
  );
}
