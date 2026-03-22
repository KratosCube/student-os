export type FormState = {
  success: boolean;
  message: string | null;
  errors: Record<string, string>;
};

export const INITIAL_FORM_STATE: FormState = {
  success: false,
  message: null,
  errors: {},
};