import { z } from "zod";

import FormBody from "./form-body";

const FormSchema = z.object({});

const MapFieldsToOnChange = () => ({});

const PreviewForm = ({ fields, sections }) => {
  return (
    <FormBody
      fields={fields}
      sections={sections}
      formSchema={FormSchema}
      onSubmit={(data) => console.log(data)}
      mapFieldsToOnChange={MapFieldsToOnChange()}
    />
  );
};

export default PreviewForm;
