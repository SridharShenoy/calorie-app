import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-clients";
import { useAppContext } from "../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

export type ChangeFormData = {
  calories: number;
  password: string;
};

const CalorieChangeReq = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangeFormData>();

  const mutation = useMutation(apiClient.change, {
    onSuccess: async () => {
      showToast({ message: "Change Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        New calorie target
        <input
          type="number"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("calories", { required: "This field is required" })}
        ></input>
        {errors.calories && (
          <span className="text-red-500">{errors.calories.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Enter password to confirm change
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Submit
        </button>
      </span>
    </form>
  );
};

export default CalorieChangeReq;