import React from "react";

import { z } from "zod";

import { ErrorBoundary } from "react-error-boundary";

import FormBody from "@/components/form/form-body";
import Builder from "./components/builder/builder";

const getSchema = (formSchema) => {
  if (formSchema?.length === 0) {
    return z.object({});
  }

  return z.object(
    formSchema?.reduce((acc, field) => {
      acc[field.name] = z.string().min(1, "Required");

      return acc;
    }, {})
  );
};

const App = () => {
  const [resetId, setResetId] = React.useState(0);
  const [builder, setBuilder] = React.useState({
    fields: {},
    sections: [],
    formSchema: [],
  });

  const { fields, sections, formSchema } = builder;

  const onErrorFixed = () => setResetId((id) => id + 1);

  const onSubmit = (data) => {
    console.log(data);
  };

  const zodFormSchema = React.useMemo(
    () => getSchema(formSchema),
    [formSchema]
  );

  return (
    <div className="p-4 flex">
      <div className="flex-1">
        <Builder builder={builder} setBuilder={setBuilder} />
      </div>
      <div className="flex-1">
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <p>{error.message}</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <FormBody
            key={resetId}
            onSubmit={onSubmit}
            fields={fields}
            sections={sections}
            formSchema={zodFormSchema}
            mapFieldsToOnChange={{}}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
