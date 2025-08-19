import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import Field from "@/components/form/field";

const FormBody = ({
  onSubmit,
  onCancel,
  fields,
  sections,
  initialValues = {},
  mapFieldsToOnChange = {},
  formSchema,
}) => {
  const fieldKeys = React.useMemo(() => Object.keys(fields), [fields]);

  const sanitisedInitialValues = React.useMemo(
    () => ({
      ...fieldKeys.reduce((acc, name) => ({ ...acc, [name]: "" }), {}),
      ...initialValues,
    }),
    [initialValues, fieldKeys]
  );

  const form = useForm({
    defaultValues: sanitisedInitialValues,
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const handleCancel = () => {
    form.reset(sanitisedInitialValues);
    onCancel?.();
  };

  const renderField = React.useCallback(
    (field, effect) => {
      const { name, label, type, placeholder, options } = field;

      return (
        <FormField
          key={name}
          name={name}
          render={({ field }) => (
            <Field
              form={form}
              field={field}
              label={label}
              type={type}
              placeholder={placeholder}
              options={options}
              effect={effect}
            />
          )}
        />
      );
    },
    [form]
  );

  const renderRow = React.useCallback(
    ({ columns }) => (
      <div key={columns.join("-")} className="flex gap-2">
        {columns.map((fieldName) =>
          renderField(fields[fieldName], mapFieldsToOnChange[fieldName])
        )}
      </div>
    ),
    [renderField, fields, mapFieldsToOnChange]
  );

  const renderRows = React.useCallback(
    (rows) => rows.map(renderRow),
    [renderRow]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {sections.map(({ title, rows }) => (
          <div key={title}>
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            {renderRows(rows)}
          </div>
        ))}
        <div className="space-x-4">
          <Button
            type="reset"
            onClick={handleCancel}
            variant="secondary"
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button className="cursor-pointer" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormBody;
