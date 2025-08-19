import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

const FieldWithWatch = ({ type, form, effect, options, ...field }) => {
  const onChange = (e) => {
    field.onChange(e);

    if (effect) {
      const values = effect(form.getValues());

      Object.keys(values).forEach((key) => {
        form.setValue(key, values[key], {
          shouldValidate: true,
        });
      });
    }
  };

  // React.useEffect(() => {
  //   if (effect) {
  //     const values = effect(form.getValues());

  //     Object.keys(values).forEach((key) => {
  //       form.setValue(key, values[key], {
  //         shouldValidate: true,
  //       });
  //     });
  //   }
  // }, [effect, form.watch(field.name)]);

  const renderedField = React.useMemo(() => {
    switch (type) {
      case "select":
        return (
          <Select onValueChange={onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <FormControl>
            <Input type={type} {...field} onChange={onChange} />
          </FormControl>
        );
    }
  }, [type, field, onChange, options]);

  return renderedField;
};
export default FieldWithWatch;
