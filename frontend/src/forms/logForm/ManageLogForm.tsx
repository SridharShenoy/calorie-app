import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { logType } from "../../../../backend/src/models/log.ts";

export type LogFormData = {
    journalEntry: string;
    weight: number;
};

type Props = {
    log?: logType;
    onSave: (data: LogFormData) => void;
    date: string;
};

const ManageLogForm = ({ log, onSave, date }: Props) => {
    const formMethods = useForm<LogFormData>();
    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        if (log) {
            reset({
                journalEntry: log.journalEntry || '',
                weight: log.weight || 0,
            });
        }
    }, [log, reset]);

    const onSubmit = handleSubmit((formDataJson: LogFormData) => {
        console.log('Submitting data:', formDataJson);
        const formData = new FormData();
        formData.append("weight", formDataJson.weight.toString()); // Convert to string
        formData.append("journalEntry", formDataJson.journalEntry);
        onSave(formData);
    });

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={onSubmit} className="flex">
                <div className="space-y-3">
                    <h1 className="text-black">Log for {date}</h1>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Weight:
                        <input
                            type="number"
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...formMethods.register("weight")}
                        />
                        {formMethods.formState.errors.weight && (
                            <span className="text-red-500">
                                {formMethods.formState.errors.weight.message}
                            </span>
                        )}
                    </label>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Journal Entry:
                        <input
                            type="text"
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...formMethods.register("journalEntry")}
                        />
                        {formMethods.formState.errors.journalEntry && (
                            <span className="text-red-500">
                                {formMethods.formState.errors.journalEntry.message}
                            </span>
                        )}
                    </label>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
                        Save Log
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default ManageLogForm;
