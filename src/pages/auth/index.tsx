import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { microgen } from "@/lib/microgen";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [division, setDivision] = React.useState("");
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [showMessage, setShowMessage] = React.useState<string | null>(null);
  const router = useRouter();
  const formRef = React.useRef<HTMLDivElement>(null);

  const loginFn = async () => {
    const { user, token, error } = await microgen.auth.login({
      email,
      password,
    });
    if (error) {
      if (error.message.includes("email")) {
        throw new Error("Email is incorrect");
      } else if (error.message.includes("password")) {
        throw new Error("Password is incorrect");
      }
    }
    return { user, token };
  };

  const registerFn = async () => {
    const { user, token, } = await microgen.auth.register({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      division,
    });
    return { user, token };
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: isLoginForm ? loginFn : registerFn,
    onSuccess: (data) => {
      window.localStorage.setItem("token", data.token ?? "");
      window.localStorage.setItem("username", data.user.firstName ?? "");
      window.localStorage.setItem("email", data.user.email ?? "");
      toast.success("Succesfully Logged In!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    },
    onError: (err) => {
      toast.error("Your password or email is something wrong", {
        position: "top-center",
      });
    },
  });

  const toggleForm = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        duration: 0.5,
        scale: 0.9,
        opacity: 0,
        onComplete: () => {
          setIsLoginForm(!isLoginForm);
          gsap.fromTo(
            formRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5 },
          );
        },
      });
    }
  };

  React.useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      router.push("/assets");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-row">
      <div
        className="z-10 flex w-1/2 flex-col justify-center p-16"
        style={{
          background:
            "linear-gradient(240deg, #1b1f32 10%, #010C18 20%, #000 90%)",
        }}
      >
        <div className="absolute left-0 top-0 mx-6 my-4 flex items-center">
          <Image
            src={"/bodha.png"}
            width={100}
            height={100}
            alt="logo bodha"
            className="mb-6 w-36"
          />
          <div className="flex flex-col items-center justify-center text-white">
            <span className="text-4xl font-semibold">Asset</span>
            <span className="text-sm font-semibold">Management</span>
          </div>
        </div>
        <div className="absolute mx-auto w-full max-w-xl" ref={formRef}>
          <h2 className="mb-6 text-4xl font-bold text-white">Welcome</h2>
          <p className="mb-14 text-2xl font-medium text-[#888888]">
            {isLoginForm
              ? "Welcome back! Please enter your details."
              : "Create an account to get started!"}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading) {
                mutate();
              }
            }}
          >
            {!isLoginForm && (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Enter your First Name"
                    className="mt-2 w-full rounded-md bg-[#242D33] p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Enter your Last Name"
                    className="mt-2 w-full rounded-md bg-[#242D33] p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="tel"
                    pattern="[0-9]*"
                    placeholder="Enter your Phone Number"
                    className="mt-2 w-full rounded-md bg-[#242D33] p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
                    value={phoneNumber}
                    inputMode="numeric"
                    onChange={(e) => {
                      const newValue = e.target.value;

                      const numericValue = newValue.replace(/[^0-9]/g, "");

                      setPhoneNumber(numericValue);

                      if (/[a-zA-Z]/.test(newValue)) {
                        setShowMessage("Please enter only numbers");
                      } else {
                        setShowMessage(null);
                      }
                    }}
                  />
                  {showMessage && (
                    <p className="mt-2 text-sm text-red-500">{showMessage}</p>
                  )}
                </div>
                <div className="mb-6">
                  <Select onValueChange={(value: string) => setDivision(value)}>
                    <SelectTrigger className="mt-2 w-full rounded-md bg-[#242D33] p-3 text-gray-200">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className="border-solid border-cyan-500 bg-black">
                      <SelectGroup>
                        <SelectItem
                          value="3D Modelling"
                          className="font-semibold text-white"
                        >
                          3D Modelling
                        </SelectItem>
                        <SelectItem
                          value="Front-End Developer"
                          className="font-semibold text-white"
                        >
                          Front-End Developer
                        </SelectItem>
                        <SelectItem
                          value="Back-End Developer"
                          className="font-semibold text-white"
                        >
                          Back-End Developer
                        </SelectItem>
                        <SelectItem
                          value="Blueprint Engineer"
                          className="font-semibold text-white"
                        >
                          Blueprint Engineer
                        </SelectItem>
                        <SelectItem
                          value="Cloath Designer"
                          className="font-semibold text-white"
                        >
                          Cloath Designer
                        </SelectItem>
                        <SelectItem
                          value="UI/UX Designer"
                          className="font-semibold text-white"
                        >
                          UI/UX Designer
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="mb-6">
              <input
                type="email"
                placeholder="email"
                className="mt-2 w-full rounded-md bg-[#242D33] p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-md bg-[#242D33] p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isLoginForm && (
              <div className="mb-6 flex items-center justify-between">
                <label className="flex items-center text-sm text-[#D9D9D9]">
                  <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}
            <Button
              variant={"login"}
              type="submit"
              className="#122770 w-full rounded-[15px] py-3 text-white"
            >
              {isLoginForm ? "Login" : "Register"}
            </Button>
          </form>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-400">
              {isLoginForm ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={toggleForm}
                    className="text-blue-500 hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Do you have an account?{" "}
                  <button
                    onClick={toggleForm}
                    className="text-blue-500 hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="relative w-1/2 mix-blend-multiply">
        <Image
          src="/login-bg.png"
          alt="Mountain background"
          fill
          className="mix-blend-multiply"
        />
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background: "linear-gradient(420deg, #000 20%, #181b2c 95%)",
          }}
        ></div>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
