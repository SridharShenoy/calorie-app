import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { logType } from "../../../../backend/src/shared/types";

export type LogFormData = {
    journalEntry: string;
    weight: number;
    logItems: { name: string; calories: number }[];
    totalCalories: number;
};

type Props = {
    log?: logType;
    onSave: (data: FormData) => void;
    date: string;
};

const ManageLogForm = ({ log, onSave, date }: Props) => {
    const formMethods = useForm<LogFormData>({
        defaultValues: {
            logItems: log?.logItems || [{ name: "", calories: 0 }],
        },
    });

    const { handleSubmit, reset, control } = formMethods;
    const [totalCalories, setTotalCalories] = useState<number>(0);
    useEffect(() => {
        const total = log?.logItems.reduce((sum: number, item: { calories: number }) => sum + Number(item.calories), 0) || 0;
        setTotalCalories(total);
      }, [log?.logItems]);
    const originalValueRef = useRef<number>(0);
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        originalValueRef.current = Number(e.target.value) || 0;
    };
    
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value) || 0;
        const difference = newValue - originalValueRef.current;
        setTotalCalories(totalCalories + difference);
    };
    const { fields, append, remove } = useFieldArray({
        control,
        name: "logItems",
    });

    useEffect(() => {
        if (log) {
            reset({
                journalEntry: log.journalEntry || '',
                weight: log.weight || 0,
                logItems: log.logItems || [{ name: "", calories: 0 }],
            });
        }
    }, [log, reset]);

    const onSubmit = handleSubmit((formDataJson: LogFormData) => {
        const formData = new FormData();

        formData.append("weight", formDataJson.weight.toString());
        formData.append("journalEntry", formDataJson.journalEntry);
        formData.append("logItems", JSON.stringify(formDataJson.logItems));
        onSave(formData);
    });
    const handleRemove = (index: number) => {
        const caloriesToRemove = fields[index].calories || 0;
        setTotalCalories((prevTotal) => prevTotal - caloriesToRemove);
        remove(index);
      };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={onSubmit} className="flex flex-col space-y-4">
                <h1 className="text-black">Log for {date}</h1>
                <label className="text-gray-700 text-sm font-bold">
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
                <label className="text-gray-700 text-sm font-bold">
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
                <label className="text-gray-700 text-sm font-bold">
                    Total Calories: {totalCalories}
                </label>
                <label className="text-gray-700 text-sm font-bold">
                    Goal Calories: {log?.goalCal}
                </label>

                {fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Item name"
                            {...formMethods.register(`logItems.${index}.name`)}
                            className="border rounded w-full py-1 px-2 font-normal"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Calories"
                            {...formMethods.register(`logItems.${index}.calories`)}
                            className="border rounded w-full py-1 px-2 font-normal"
                            required
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        <button type="button" onClick={() => handleRemove(index)} className="bg-red-500 text-white p-2 rounded">
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" onClick={() => append({ name: "", calories: 0 })} className="bg-blue-500 text-white p-2 rounded">
                    Add Item
                </button>

                <button type="submit" className="bg-green-500 text-white p-2 rounded mt-4">
                    Save Log
                </button>
            </form>
        </FormProvider>
    );
};

export default ManageLogForm;

