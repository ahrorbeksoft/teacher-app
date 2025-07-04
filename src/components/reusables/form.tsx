"use client";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { cn } from "@/lib/utils";
import { SelectHelperText } from "../extendui/select";
import { Label } from "../ui/label";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

import Button from "./fields/button";
import CheckboxField from "./fields/checkbox";
import DatePickerField from "./fields/date-picker";
import SearchableSelectField from "./fields/searchable-select";
import SelectField from "./fields/select";
import SubmitButton from "./fields/submit";
import TextField from "./fields/text";
import NumberInput from "./fields/number-input";
import TextareaField from "./fields/textarea";
import TimePickerField from "./fields/time-picker";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    SearchableSelectField,
    TimePickerField,
    DatePickerField,
    TextareaField,
    CheckboxField,
    NumberInput,
  },
  formComponents: {
    SubmitButton,
    Button,
  },
  fieldContext,
  formContext,
});

export const FormFieldContainer = ({
  children,
  className,
  errors,
  label,
}: {
  label?: string;
  children: React.ReactNode;
  errors: any[];
  className?: string;
}) => {
  const error = errors.length > 0;
  const errorText = error ? errors[0].message : "";

  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {label && <Label className={cn(error && "text-red-500")}>{label}</Label>}
      {children}
      {error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
    </div>
  );
};

export const AppForm = ({
  children,
  onSubmit,
  ...props
}: React.ComponentProps<"form">) => {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
};
