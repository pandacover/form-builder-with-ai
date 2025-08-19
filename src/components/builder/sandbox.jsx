import React from "react";

import { produce } from "immer";

import { LucideX, LucidePlus, LucideSparkles } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import PreviewForm from "../form/preview-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const FIELDS = ["text", "email", "password", "select"];

const FieldsBar = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Fields</h3>
      <div className="space-y-3">
        {FIELDS.map((field) => (
          <div
            key={field}
            className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move capitalize text-sm font-medium text-gray-700 text-center"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("field", field)}
          >
            {field}
          </div>
        ))}
      </div>
    </aside>
  );
};

const FieldConfigContent = ({ onUpdate, field }) => {
  const [config, setConfig] = React.useState(field);

  return (
    <PopoverContent className="w-80">
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Field Configuration</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="label" className="text-sm font-medium">
              Label
            </Label>
            <Input
              id="label"
              className="h-9"
              value={config.label || ""}
              onChange={(e) => setConfig({ ...config, label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              className="h-9"
              value={config.name || ""}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Enter field name"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="type" className="text-sm font-medium">
              Type
            </Label>
            <Input
              id="type"
              className="h-9"
              value={config.type || ""}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
              placeholder="Field type"
              disabled
            />
          </div>
        </div>
        <Button onClick={() => onUpdate(config)} className="w-full">
          Save Configuration
        </Button>
      </div>
    </PopoverContent>
  );
};

const FieldConfig = ({ onUpdate, field }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </PopoverTrigger>
      {field.type && <FieldConfigContent onUpdate={onUpdate} field={field} />}
    </Popover>
  );
};

const Col = ({
  field,
  setFields,
  sectionId,
  rowId,
  colId,
  setGrid,
  deleteCol,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const fieldType = e.dataTransfer.getData("field");

    setGrid((grid) =>
      produce(grid, (draft) => {
        draft[sectionId].rows[rowId].columns[
          colId
        ] = `${sectionId}.${rowId}.${colId}`;
      })
    );

    setFields((draft) => ({
      ...draft,
      [`${sectionId}.${rowId}.${colId}`]: {
        type: fieldType,
        label: fieldType.charAt(0).toUpperCase() + fieldType.slice(1),
        name: fieldType.toLowerCase(),
      },
    }));
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`h-[60px] space-x-2 relative p-3 border-2 border-dashed rounded-lg flex-1 flex justify-between items-center transition-colors ${
        isDragOver
          ? "border-blue-400 bg-blue-50"
          : field.type
          ? "border-gray-300 bg-white"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {field.type ? (
        <>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {field.label || field.type}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {field.type} field
            </div>
          </div>
          <FieldConfig
            field={field}
            onUpdate={(field) => {
              setFields((draft) => ({
                ...draft,
                [`${sectionId}.${rowId}.${colId}`]: field,
              }));
            }}
          />
        </>
      ) : (
        <div className="text-center text-gray-400 text-sm w-full">
          Drop a field here
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteCol(sectionId, rowId, colId)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LucideX className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Sandbox = () => {
  const [grid, setGrid] = React.useState([]);
  const [preview, setPreview] = React.useState(false);
  const [fields, setFields] = React.useState({});
  const [previewFields, setPreviewFields] = React.useState({});
  const [previewSections, setPreviewSections] = React.useState([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");

  const addCol = (sectionId, rowId) => {
    setGrid((grid) =>
      produce(grid, (draft) => {
        draft[sectionId].rows[rowId].columns.push("");
      })
    );
  };

  const deleteCol = (sectionId, rowId, colId) => {
    setGrid((grid) =>
      produce(grid, (draft) => {
        draft[sectionId].rows[rowId].columns.splice(colId, 1);
      })
    );
  };

  const addRow = (sectionId) => {
    setGrid((grid) =>
      produce(grid, (draft) => {
        draft[sectionId].rows.push({ columns: [] });
      })
    );
  };

  const deleteRow = (sectionId, rowId) => {
    setGrid((grid) =>
      produce(grid, (draft) => {
        draft[sectionId].rows.splice(rowId, 1);
      })
    );
  };

  const addSection = () => {
    setGrid((grid) => [...grid, { title: "", rows: [] }]);
  };

  const deleteSection = (sectionId) => {
    setGrid((grid) => grid.filter((_, i) => i !== sectionId));
  };

  const generateForm = () => {
    setPreview(true);
  };

  const generateFormWithAI = React.useMemo(
    () => async () => {
      setIsGenerating(true);
      try {
        const res = await fetch("http://localhost:5000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        const data = await res.json();

        const config = JSON.parse(data.response ?? "{}");
        const { fields, sections } = config;
        console.log(config);

        setFields(fields);
        setGrid(sections);
      } catch (error) {
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    },
    [prompt]
  );

  React.useEffect(() => {
    setPreviewFields(
      Object.keys(fields).reduce(
        (acc, field) => ({ ...acc, [fields[field].name]: fields[field] }),
        {}
      )
    );
    setPreviewSections(
      grid.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          columns: row.columns.map((col) => fields[col].name),
        })),
      }))
    );
  }, [preview, fields]);

  return (
    <div className="h-screen bg-gray-50 flex">
      <FieldsBar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Form Builder
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Drag fields from the sidebar to build your form
            </p>
          </div>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isGenerating}>
                  <LucideSparkles />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="text-lg font-medium">
                  Generate Form
                </DialogTitle>
                <DialogDescription className="space-y-4">
                  <span className="text-sm text-gray-600">
                    Describe the form you want to build
                  </span>
                  <textarea
                    placeholder="e.g. a form with a name and email field"
                    className="w-full border rounded-md p-2 resize-none"
                    rows={5}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    onClick={generateFormWithAI}
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setPreview((p) => !p)}>
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>
        </header>
        {preview ? (
          <div className="h-full w-full overflow-y-auto p-4">
            <PreviewForm fields={previewFields} sections={previewSections} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {grid.map((section, sectionId) => (
                  <div
                    key={sectionId}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Input
                        placeholder="Section Title"
                        value={section.title}
                        onChange={(e) =>
                          setGrid((grid) =>
                            produce(grid, (draft) => {
                              draft[sectionId].title = e.target.value;
                            })
                          )
                        }
                        className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0 placeholder:text-gray-400"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSection(sectionId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LucideX className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {section.rows.map((row, rowId) => (
                        <div
                          key={rowId}
                          className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              Row {rowId + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRow(sectionId, rowId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <LucideX className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex gap-3">
                            {row.columns?.map((col, colId) => (
                              <Col
                                key={`${sectionId}.${rowId}.${colId}`}
                                sectionId={sectionId}
                                rowId={rowId}
                                colId={colId}
                                setGrid={setGrid}
                                deleteCol={deleteCol}
                                setFields={setFields}
                                field={fields[col] ?? {}}
                              />
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => addCol(sectionId, rowId)}
                              className="min-h-[60px] border-dashed hover:bg-blue-50 hover:border-blue-300"
                            >
                              <LucidePlus className="h-4 w-4 mr-2" />
                              Add Column
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={() => addRow(sectionId)}
                        className="w-full border-dashed hover:bg-blue-50 hover:border-blue-300"
                      >
                        <LucidePlus className="h-4 w-4 mr-2" />
                        Add Row
                      </Button>
                    </div>
                  </div>
                ))}

                {grid.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <LucidePlus className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">No sections yet</p>
                      <p className="text-sm">
                        Start by adding your first section
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={addSection}
                  className="w-full"
                  variant="outline"
                >
                  <LucidePlus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>

            <footer className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-fit mx-auto -translate-x-0.5">
                <Button variant="ghost" onClick={generateForm}>
                  Generate Form
                </Button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default Sandbox;
