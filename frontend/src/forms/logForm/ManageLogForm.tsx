import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import DetailsSection from "./DetailsSection";

export type LogFormData = {
    goalCal: number;
    currCal: number;
    logDate: Date;
    lastUpdated: Date;
    journalEntry: string;
    weight: number;
    userId: string;
  };

const ManageLogForm = () => {
    const formMethods = useForm<LogFormData>();
    return (
        <div className="flex">
            <div>
                <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10">
                <DetailsSection />
                <span className="flex justify-end">
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                >
                    Save
                </button>
                </span>
            </form>
            </FormProvider>
            </div>
            <div className="rounded-md border m-auto p-10">
                <h1>hi</h1>
            </div>
        </div>
        
      );
}

export default ManageLogForm;