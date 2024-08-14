import { useFormContext } from "react-hook-form";
import { LogFormData } from "./ManageLogForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<LogFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Log</h1>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Weight:
        <input
          type="text"
          className="flex justify-between border rounded py-1 px-2 font-normal"
          {...register("weight")}
        ></input>
        {errors.goalCal && (
          <span className="text-red-500">{errors.goalCal.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Journal Entry:
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("journalEntry")}
        ></textarea>
        {errors.journalEntry && (
          <span className="text-red-500">{errors.journalEntry.message}</span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;