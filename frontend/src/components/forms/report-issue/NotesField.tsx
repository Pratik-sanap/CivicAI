import type { TextareaHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface NotesFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref'> {
  label: string;
  helperText: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

function NotesField({ label, helperText, error, registration, ...rest }: NotesFieldProps) {
  return (
    <label className="block rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">{label}</span>
        <span className="text-xs text-slate-400">Optional</span>
      </div>
      <textarea
        {...registration}
        {...rest}
        className="mt-4 min-h-40 w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:bg-white/8"
      />
      <div className="mt-3 flex items-start justify-between gap-4 text-xs text-slate-400">
        <p>{helperText}</p>
        {error ? <p className="text-rose-200">{error}</p> : null}
      </div>
    </label>
  );
}

export default NotesField;
