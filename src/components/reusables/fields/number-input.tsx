"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/extendui/button";
import { Input } from "@/components/extendui/input";
import { useFieldContext } from "../form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SelectHelperText } from "@/components/extendui/select";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  required?: boolean;
  label?: string;
};

export default function NumberInput({
  min = 0,
  max = 100,
  step = 1,
  className,
  label,
  required = false,
}: Props) {
  const field = useFieldContext<number>();
  const error = field.state.meta.errors.length > 0;
  const errorText = error ? field.state.meta.errors[0].message : "";

  const decrease = () => {
    field.setValue((prevValue) => Math.max(min, prevValue - step));
  };

  const increase = () => {
    field.setValue((prevValue) => Math.min(max, prevValue + step));
  };

  return (
    <div className="flex flex-col space-y-2 w-full px-0.5">
      {label && (
        <Label
          className={cn(
            error && "text-red-500",
            required && "after:content-['*'] after:text-red-500 after:-ml-2",
          )}
        >
          {label}
        </Label>
      )}

      <div className={cn("flex items-center", className)}>
        <Button
          type="button"
          onClick={decrease}
          size="icon"
          variant="outline"
          className="w-10 rounded-r-none border-r-0 shadow-none"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          className="h-9 w-12 rounded-none border-x-0 p-0 text-center focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-none
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
          value={field.state.value}
          readOnly
          min={min}
          max={max}
          step={step}
        />
        <Button
          type="button"
          onClick={increase}
          size="icon"
          variant="outline"
          className="w-10 rounded-l-none border-l-0 shadow-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
    </div>
  );
}
