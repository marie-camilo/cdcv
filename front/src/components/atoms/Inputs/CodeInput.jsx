export default function CodeInput({ value, onChange, placeholder }) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder={placeholder}
            className="w-full bg-transparent border-b-2 border-[var(--color-light-green)] text-[var(--color-light-green)]
                       font-[family-name:var(--font-source)] text-2xl p-2 outline-none
                       placeholder:text-[var(--color-light-green)]/30 tracking-widest uppercase"
        />
    );
}