import React, { useState } from "react";
import ManageImageForm from "../forms/progpicform/ManageProgPicForms";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-clients";
import ProgressPictures from "../components/ImageDisplay";

const ProgPics = () => {
  const { showToast } = useAppContext();
  const [refreshKey, setRefreshKey] = useState(0);

  const { mutate } = useMutation(apiClient.addMyImage, {
    onSuccess: () => {
      showToast({ message: "Image Saved!", type: "SUCCESS" });
      setRefreshKey(prevKey => prevKey + 1);
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
      <ProgressPictures refreshKey={refreshKey} />
      <ManageImageForm onSave={handleSave} />
    </div>
  );
};

export default ProgPics;
