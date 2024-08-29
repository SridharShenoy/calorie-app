import { FormProvider, useForm } from "react-hook-form";
import ImagesSection from "./ImagesSection";
import { useEffect } from "react";

export type ImageFormData = {
  imageFiles: FileList;
  imageUrls: string[];
};

type Props = {
  onSave: (imageFormData: FormData) => void;
};

const ManageImageForm = ({ onSave }: Props) => {
  const formMethods = useForm<ImageFormData>();
  const { handleSubmit, reset } = formMethods;

  const onSubmit = handleSubmit((formDataJson: ImageFormData) => {
    const formData = new FormData();

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <ImagesSection />
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
  );
};

export default ManageImageForm;