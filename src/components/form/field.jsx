import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import FieldWithWatch from "./field-with-watch";

const Field = ({ field, form, label, type, placeholder, options, effect }) => {
  return (
    <FormItem className="flex-1">
      <FormLabel required={field.required}>{label}</FormLabel>
      <FieldWithWatch
        form={form}
        type={type}
        placeholder={placeholder}
        options={options}
        effect={effect}
        {...field}
      />
      <FormMessage />
    </FormItem>
  );
};

export default Field;
