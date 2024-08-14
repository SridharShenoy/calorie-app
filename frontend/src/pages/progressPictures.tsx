import ManageImageForm from "../forms/progpicform/ManageProgPicForms";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-clients";
import ProgressPictures from "../components/ImageDisplay";

const ProgPics = () => {

  const { showToast } = useAppContext();
    const { mutate } = useMutation(apiClient.addMyImage, {
        onSuccess: () => {
          showToast({ message: "Image Saved!", type: "SUCCESS" });
        },
        onError: () => {
          showToast({ message: "Error Saving Image", type: "ERROR" });
        },
      });
    
      const handleSave = (imageFormData: FormData) => {
        mutate(imageFormData);
      };
    return (
    <div className="flex">
        <ProgressPictures />
        <ManageImageForm onSave={handleSave}/>
    </div>
)
}

export default ProgPics;