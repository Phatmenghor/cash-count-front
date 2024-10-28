"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { route } from "@/constants/routed";
import Input from "@/components/ui/Input";
import FormMessage from "@/components/ui/FormMessage";
import Button from "@/components/ui/Button";
import withAnimation from "@/configs/withAnimation";
import CustomSelect from "@/components/ui/CustomSelect";
import { BiArrowBack } from "react-icons/bi";
import showToast from "@/components/toast/useToast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RegisterService } from "@/redux/service/registerService";
import { AllDataType, FormDataType } from "./type";
import { BranchModel } from "@/redux/models/register/BranchModel";
import { PositionModel } from "@/redux/models/register/PositionModel";

const Register: React.FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";

  const [allData, setAllData] = useState<AllDataType>({
    roles: null,
    branches: null,
    positions: null,
    departments: null,
  });

  const [formData, setFormData] = useState<FormDataType>({
    email: "phatmenghor19@gmail.com",
    otp: "1739",
    usernameAD: "",
    firstName: "",
    lastName: "",
    password: "",
    department: null,
    position: null,
    role: null,
    branch: null,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    return clearData();
  }, []);

  async function fetchData() {
    const response = await RegisterService.fetchAllData();
    console.log("### ===", response);
    setAllData(response);
  }

  const clearData = () => {
    setStep(1);
    setFormData({
      email: "phatmenghor19@gmail.com",
      otp: "1739",
      usernameAD: "",
      firstName: "",
      lastName: "",
      password: "",
      department: null,
      position: null,
      role: null,
      branch: null,
    });
    setErrors({});
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const {
      email,
      otp,
      firstName,
      lastName,
      department,
      position,
      branch,
      role,
      password,
      usernameAD,
    } = formData;

    if (step === 1 && !email) newErrors.email = "Email is required.";
    else if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email address.";

    if (step === 2 && !otp) newErrors.otp = "OTP is required.";

    if (step === 3) {
      if (!firstName) newErrors.firstName = "First name is required.";
      if (!lastName) newErrors.lastName = "Last name is required.";
      if (!department) newErrors.department = "Department is required.";
      if (!position) newErrors.position = "Position is required.";
      if (!branch) newErrors.branch = "Branch is required.";
      if (!role) newErrors.role = "Role is required.";
      if (!password) newErrors.password = "Password is required.";
      if (!usernameAD) newErrors.usernameAD = "AD user is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    setLoading(true);

    if (step === 1) {
      const response = await RegisterService.submidEmail({
        mail: formData.email,
      });
      if (response) {
        showToast(
          `Email sent to ${formData.email}. Please check inbox.`,
          "success"
        );
        setStep(2);
        setLoading(false);
        return;
      }
      showToast("Failed to send email. Please try again.", "error", 7000);
    } else if (step === 2) {
      const response = await RegisterService.verifyEmail({
        mail: formData.email,
        code: formData.otp,
      });
      if (response) {
        showToast("Email verified successfully!", "success");
        setStep(3);
        setLoading(false);
        return;
      }
      showToast(
        "Verification unsuccessful. Please verify your email and code otp again.",
        "error",
        7000
      );
    } else if (step === 3) {
      const resposne = await RegisterService.registerAccount({
        email: formData.email,
        otpCode: formData.otp,
        branchId: formData.branch!.id,
        departmentId: formData.branch!.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        positionId: formData.position!.id,
        roleId: formData.role!.id,
        username: formData.usernameAD,
      });
      if (resposne.success) {
        showToast("Your registration was successful!", "success");
        router.push(`/${route.DEACTIVATE_USER}`);
        setLoading(false);
        return;
      }
      showToast(resposne.message, "error", 7000);
    }
    setLoading(false);
  };

  const handleBack = () => {
    if (step == 3) {
      setFormData((prev) => ({
        ...prev,
        usernameAD: "",
        firstName: "",
        lastName: "",
        password: "",
        department: null,
        position: null,
        role: null,
        branch: null,
      }));
    } else if (step == 2) {
      setFormData((prev) => ({
        ...prev,
        otp: "",
      }));
    }
    setStep((prev) => prev - 1);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (key: keyof typeof formData, option: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: option,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-x-105 relative">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="mt-2 absolute flex items-center text-gray-600 hover:border-blue-600 hover:text-blue-500 rounded-lg transition duration-300"
          >
            <BiArrowBack size={20} />
          </button>
        )}

        <h1 className="text-3xl font-bold mb-1 text-center text-gray-800">
          Register
        </h1>
        {name && (
          <h2 className="text-lg mb-4 text-center text-gray-600">
            Welcome, {decodeURIComponent(name)}!
          </h2>
        )}
        <form onSubmit={handleSubmit}>
          {(step === 1 || step === 2) && (
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleInputChange}
                className="py-1.5"
                disabled={step > 1}
              />
              {errors.email && (
                <FormMessage message={errors.email} type="error" />
              )}
            </div>
          )}

          {step === 2 && (
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter OTP<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="tel"
                id="otp"
                name="otp"
                value={formData.otp}
                placeholder="Enter the OTP"
                onChange={handleInputChange}
                className="py-1.5"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {errors.otp && <FormMessage message={errors.otp} type="error" />}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email<span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                  className="py-1.5"
                  disabled
                />
                {errors.email && (
                  <FormMessage message={errors.email} type="error" />
                )}
              </div>

              {/* Role */}
              <CustomSelect
                id="role"
                value={formData.role}
                onChange={(option) => handleChange("role", option)}
                options={allData.roles}
                label="Role"
                getOptionLabel={(option) => option.name}
                errorMessage={errors.role}
                required
              />

              {/* Username AD */}
              <div>
                <label
                  htmlFor="usernameAD"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AD Username<span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="text"
                  id="usernameAD"
                  name="usernameAD"
                  value={formData.usernameAD}
                  placeholder="Enter AD username"
                  onChange={handleInputChange}
                  className="py-1.5"
                />
                {errors.usernameAD && (
                  <FormMessage message={errors.usernameAD} type="error" />
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                    className="py-1.5"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <FormMessage message={errors.password} type="error" />
                )}
              </div>

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name<span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="Enter your first name"
                  onChange={handleInputChange}
                  className="py-1.5"
                />
                {errors.firstName && (
                  <FormMessage message={errors.firstName} type="error" />
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name<span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Enter your last name"
                  onChange={handleInputChange}
                  className="py-1.5"
                />
                {errors.lastName && (
                  <FormMessage message={errors.lastName} type="error" />
                )}
              </div>

              {/* Department */}
              <CustomSelect
                id="department"
                value={formData.department}
                onChange={(option) => handleChange("department", option)}
                options={allData.departments}
                label="Department"
                getOptionLabel={(option) => option.name}
                errorMessage={errors.department}
                required
              />

              {/* Position */}
              <CustomSelect
                id="position"
                value={formData.position}
                onChange={(option) => handleChange("position", option)}
                getOptionLabel={(option) => option.name}
                label="Position"
                options={allData.positions}
                errorMessage={errors.position}
                required
              />

              {/* Branch */}
              <CustomSelect
                id="branch"
                value={formData.branch}
                onChange={(option) => handleChange("branch", option)}
                getOptionLabel={(option) => option.city}
                options={allData.branches}
                label="Branch"
                errorMessage={errors.branch}
                required
              />
            </div>
          )}

          <Button
            scaleOnHover={false}
            loading={loading}
            type="submit"
            className="py-1.5 w-full mt-8 text-sm"
            textLoading={
              step === 1
                ? "Request OTP ..."
                : step === 2
                ? "Verify OTP ..."
                : "Register ..."
            }
          >
            {step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Register"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 ">
            Have an account?{" "}
            <a
              href={`/${route.LOGIN}`}
              className="text-blue-500 hover:text-blue-700 transition-colors underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withAnimation(Register);
