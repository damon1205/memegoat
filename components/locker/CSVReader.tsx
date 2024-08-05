import dynamic from 'next/dynamic';
import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { DatePicker, Input } from 'antd';
import { BiExport, BiImport, BiPlus } from 'react-icons/bi';
import { IoCloseCircle } from 'react-icons/io5';

// Dynamically import CSVLink to prevent SSR issues
const CSVLink = dynamic(() => import('react-csv').then(mod => mod.CSVLink), {
  ssr: false,
});

export type CsvObject = { [key: string]: string };

function CSVReader({
  type,
  updateState,
  updateAmount,
}: {
  type: string;
  updateState: React.Dispatch<React.SetStateAction<CsvObject[] | null>>;
  updateAmount?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [array, setArray] = useState<CsvObject[] | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    key: string,
  ) => {
    if (!array) return;
    const updatedArray = [...array];
    const updatedObject = { ...updatedArray[index], [key]: e.target.value };
    updatedArray[index] = updatedObject;
    setArray(updatedArray);
    updateState(updatedArray);
  };

  const handleDateChange = (
    dateStr: string,
    index: number,
    key: string,
  ) => {
    if (!array) return;
    const updatedArray = [...array];
    const updatedObject = { ...updatedArray[index], [key]: dateStr };
    updatedArray[index] = updatedObject;
    setArray(updatedArray);
    updateState(updatedArray);
  };

  const csvFileToArray = (string: string): CsvObject[] => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string
      .slice(string.indexOf("\n") + 1)
      .split("\n")
      .filter((row) => row.trim() !== ""); // Filter out empty lines

    const array = csvRows.map((row) => {
      const values = row.split(",");
      const obj: CsvObject = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {} as CsvObject);
      return obj;
    });

    return array;
  };

  function sumAmounts(array: CsvObject[]): number {
    return array.reduce((sum, item) => {
      const amount = parseFloat(item.amount); // Parse the amount as a number
      return sum + (isNaN(amount) ? 0 : amount); // Add to sum if valid, else add 0
    }, 0);
  }

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        const text = event.target?.result as string;
        const parsedArray = csvFileToArray(text);
        const updatedArray = array ? [...array, ...parsedArray] : parsedArray;
        setArray(updatedArray);
        updateState(updatedArray);
        setFile(null);

        if (updateAmount) {
          // Calculate the sum
          const totalValue = sumAmounts(updatedArray);
          updateAmount(totalValue);
        }

        if (inputFileRef.current) {
          inputFileRef.current.value = "";
        }
      };
      fileReader.readAsText(file);
    }
  };

  const headerKeys =
    type === "time" ? ["height", "percentage"] : ["address", "amount"];

  const csvData = array
    ? [
      headerKeys,
      ...array.map((item) => headerKeys.map((key) => item[key] || "")),
    ]
    : [headerKeys];

  const addItem = (values: string[]) => {
    const newItem: CsvObject = headerKeys.reduce((obj, key, index) => {
      obj[key] = values[index] || "";
      return obj;
    }, {} as CsvObject);
    const updatedArray = array ? [...array] : [];
    updatedArray.push(newItem);
    setArray(updatedArray);
    updateState(updatedArray);
  };

  const handleAddItem = () => {
    addItem([]);
  };

  const deleteItem = (index: number) => {
    if (array) {
      const updatedArray = [...array];
      updatedArray.splice(index, 1);
      setArray(updatedArray);
      updateState(updatedArray);
    }
  };

  return (
    <div style={{ textAlign: "center" }} className="my-4">
      <form
        onSubmit={handleOnSubmit}
        className="flex flex-col gap-3 md:items-center"
      >
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
          ref={inputFileRef}
          placeholder="Pick file"
          className="border-zinc-700 rounded-md border-[1px] px-2 py-2 mr-4 text-sm"
        />
        <div className="flex gap-3 w">
          <button
            type="submit"
            className="bg-accent p-3 py-2 text-sm rounded-sm flex gap-1 items-center w-20"
          >
            <BiImport className="inline" />
            <span>Import</span>
          </button>

          <CSVLink
            className="bg-accent p-3 py-2 text-sm rounded-sm flex gap-1 items-center w-20"
            filename="my-file.csv"
            data={csvData}
          >
            <BiExport />
            <span>Export</span>
          </CSVLink>
          <button
            className="bg-accent p-3 py-2 text-sm rounded-sm flex gap-1 items-center w-20"
            onClick={handleAddItem}
            type="button" // Add type button to prevent form submission
          >
            <BiPlus /> Add
          </button>
        </div>
      </form>

      <br />

      <table>
        <thead>
          <tr key={"header"} className="flex gap-8 ml-11 justify-between">
            {array &&
              array.length > 0 &&
              headerKeys.map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {array &&
            array.map((item, index) => (
              <tr key={index} className="flex w-full gap-3 my-2 items-center">
                <td className="flex justify-between items-center gap-3">
                  <IoCloseCircle
                    onClick={() => deleteItem(index)}
                    className="text-accent text-2xl"
                  />
                </td>
                {Object.keys(item).map((key) => (
                  <td key={key}>
                    {key === "height" ? (
                      <DatePicker
                        use12Hours={true}
                        showTime
                        onChange={(_value, dateString) => {
                          handleDateChange(dateString as string, index, key);
                        }}
                        required={true}
                      />
                    ) : (
                      <Input
                        value={item[key]}
                        type={key === "height" ? "date" : "text"}
                        onChange={(e) => handleChange(e, index, key)}
                        className="w-54"
                        required={true}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default CSVReader;
