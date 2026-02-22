import * as React from 'react';

type Props = {
  label: string;
  htmlFor?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
};

export default function FormField({
  label,
  htmlFor,
  description,
  error,
  children,
}: Props) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      {description ? (
        <div className="text-sm text-gray-600">{description}</div>
      ) : null}

      <div>{children}</div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
