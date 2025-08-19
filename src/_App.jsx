import React from "react";

import { z } from "zod";

import FormBody from "@/components/form/form-body";
import Builder from "./components/builder/builder";

const FormFields = {
  name: { name: "name", label: "Name", type: "text" },
  email: { name: "email", label: "Email", type: "email" },
  gender: {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },

  password: {
    name: "password",
    label: "Password",
    type: "password",
  },
};

const FormSections = [
  {
    title: "Personal Information",
    rows: [{ columns: ["name", "email"] }],
  },
  { title: "Password", rows: [{ columns: ["gender", "password"] }] },
];

const MapFieldsToOnChange = (onChange) => ({
  email: (value) => {
    onChange("email", value.email);

    return {
      name: value.email?.split("@")[0],
    };
  },
  name: (value) => {
    onChange("name", value.name);

    return {
      password: value.name,
    };
  },
});

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  gender: z.string().min(1, "Gender is required"),
  password: z.string().min(1, "Password is required"),
});

const App = () => {
  const onSubmit = (data) => {
    console.log(data);
  };

  const [sections, setSections] = React.useState(FormSections);

  const getSections = React.useCallback((fieldName, value) => {
    if (fieldName === "email" && value === "sad") {
      setSections(
        FormSections.map((section) => ({
          ...section,
          rows: section.rows.map((row) => ({
            ...row,
            columns: row.columns.filter((column) => column !== "gender"),
          })),
        }))
      );
    } else {
      setSections(FormSections);
    }
  }, []);

  const mapFieldToOnChange = React.useMemo(
    () => ({
      ...MapFieldsToOnChange(getSections),
    }),
    [getSections]
  );

  return (
    <div className="p-4 flex">
      <div className="flex-1">{/* <Builder /> */}</div>
      <div className="flex-1">
        <FormBody
          onSubmit={onSubmit}
          fields={FormFields}
          sections={sections}
          formSchema={FormSchema}
          mapFieldsToOnChange={mapFieldToOnChange}
        />
      </div>
    </div>
  );
};

export default App;
