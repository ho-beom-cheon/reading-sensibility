import { ErrorCode } from "@/contracts";

export type ValidationIssue = {
  field: string;
  code: ErrorCode;
  message: string;
};

export type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      issues: ValidationIssue[];
    };

export function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

export function invalid<T = never>(
  issues: ValidationIssue | ValidationIssue[]
): ValidationResult<T> {
  return {
    ok: false,
    issues: Array.isArray(issues) ? issues : [issues]
  };
}

export function requireText(
  field: string,
  value: string,
  code: ErrorCode,
  message: string
): ValidationIssue | null {
  return value.trim().length === 0 ? { field, code, message } : null;
}

export function enforceMaxLength(
  field: string,
  value: string,
  maxLength: number,
  code: ErrorCode,
  message: string
): ValidationIssue | null {
  return value.length > maxLength ? { field, code, message } : null;
}
