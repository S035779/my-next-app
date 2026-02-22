import React, {
  ReactElement,
  cloneElement,
  isValidElement,
  InputHTMLAttributes,
} from 'react';

type InputChild = ReactElement<InputHTMLAttributes<HTMLInputElement>>;

type Props = {
  label: string;
  htmlFor: string;
  required?: boolean;
  description?: string;
  error?: string;
  errorTestId?: string;
  errorCode?: string;
  children: InputChild;
};

export default function AdminFormField({
  label,
  htmlFor,
  required,
  description,
  error,
  errorTestId,
  errorCode,
  children,
}: Props) {
  const describedByIds: string[] = [];
  if (description) describedByIds.push(`${htmlFor}-desc`);
  if (error) describedByIds.push(`${htmlFor}-error`);

  const describedBy =
    describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  if (!isValidElement(children)) {
    return null;
  }

  const child = cloneElement(children, {
    id: children.props.id ?? htmlFor,
    'aria-describedby': describedBy,
    'aria-invalid':
      children.props['aria-invalid'] ?? (error ? true : undefined),
  });

  const tid = errorTestId ?? `error-${htmlFor}`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </label>

      {description && (
        <p id={`${htmlFor}-desc`} className="text-xs text-gray-500">
          {description}
        </p>
      )}

      {child}

      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="text-sm text-red-600"
          data-testid={tid}
          data-error-code={errorCode}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
