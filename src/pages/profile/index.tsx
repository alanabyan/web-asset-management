import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "react-query";

import Content from "@/components/layouts/Content";
import DashboardLayout from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { microgen } from "@/lib/microgen";

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [showMessage, setShowMessage] = React.useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = React.useState<
    { url: string; fileName: string }[] | null
  >(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  const {
    data: dataUsers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-users"],
    queryFn: async () => {
      const { user, error } = await microgen.auth.user();
      if (error) throw new Error(error.message || "Failed to fetch users");
      setProfileImageUrl(user.image || null);
      return user;
    },
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setName(`${data?.firstName} ${data?.lastName}`);
      setPhoneNumber(`${data.phoneNumber}`);
      setEmail(`${data.email}`);
      setLocation(`${data.location}`);
      setProfileImageUrl(data.profileImageUrl || null);
    },
  });

  const handleImageUpload = (file: File) => {
    setProfileImageUrl([
      { url: URL.createObjectURL(file), fileName: file.name },
    ]);
    setIsEditing(true);
    console.log("Submitting with file:", file);
  };

  const handleSubmitToggle = () => {
    setIsEditing(false);
    const file = fileInputRef.current?.files?.[0];
    mutate(file);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const CancelEditToggle = () => {
    setIsEditing(!isEditing);
    window.location.reload();
  };

  const { mutate } = useMutation({
    mutationKey: ["updateUsers"],
    mutationFn: async (file?: File) => {
      const arrayOfName = name.split(" ");
      const firstName = arrayOfName[0];
      const currentData = dataUsers;
      const lastName = arrayOfName.slice(1).join(" ");

      const updatedFields: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        location: string;
        profileImageUrl: { url: string; fileName: string }[];
      }> = {};

      if (name !== `${currentData?.firstName} ${currentData?.lastName}`) {
        updatedFields.firstName = firstName;
        updatedFields.lastName = lastName;
      }
      if (email !== currentData?.email) updatedFields.email = email;
      if (phoneNumber !== currentData?.phoneNumber)
        updatedFields.phoneNumber = phoneNumber;
      if (location !== currentData?.location) updatedFields.location = location;

      if (file) {
        const response = await microgen.storage.upload(file);
        console.log(response);

        if (response?.data?.url && response?.data?.fileName) {
          updatedFields.profileImageUrl = [
            {
              url: response.data.url,
              fileName: response.data.fileName,
            },
          ];
        } else {
          throw new Error("Failed to get uploaded image URL or file name");
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        console.log("No changes detected. Nothing to update.");
        return;
      }

      console.log("Updated Fields:", updatedFields);

      const { user, error } = await microgen.auth.update(updatedFields);
      if (error)
        throw new Error(error.message || "Failed to update user profile");
      return user;
    },
    onSuccess: () => {
      refetch();
      window.location.reload()
    },
    onError: (error) => console.error("Error updating profile:", error),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const profileImageSrc = profileImageUrl?.[0]?.url || "/account.svg";

  return (
    <div className="flex h-screen flex-col overflow-y-hidden bg-[#F9F9F9]">
      <div className="my-3 flex flex-col items-center justify-center">
        <span className="relative right-[405px] flex items-start py-6 text-3xl font-semibold">
          Profile Account
        </span>
        <div className="flex h-[456px] w-full max-w-5xl flex-row rounded-[20px] bg-[#FAFAFA] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]">
          {isEditing ? (
            <div className="mx-11 my-9 flex h-[382px] w-80 items-center justify-center rounded-[20px] bg-[#E0E0E0]">
              <Image
                width={100}
                height={100}
                alt="Profile"
                src={profileImageSrc || "/account.svg"}
                onClick={() => fileInputRef.current?.click()}
                className="h-full w-full cursor-pointer rounded-[20px]"
              />
              <Input
                type="file"
                accept="image/*"
                id="imageUpload"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>
          ) : (
            <div className="mx-11 my-9 flex h-[382px] w-80 items-center justify-center rounded-[20px] bg-[#E0E0E0]">
              <Image
                width={100}
                height={100}
                alt="Profile"
                src={profileImageSrc || "/account.svg"}
                className="h-full w-full rounded-[20px]"
              />
            </div>
          )}
          <div className="mx-4 my-9 flex flex-col gap-4">
            {isEditing ? (
              <>
                <div className="flex flex-row items-center justify-center text-xl font-medium">
                  Name:
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="firstName"
                    className="ml-10 mt-2 h-10 w-full rounded-md bg-[#ffffffdd] p-3 text-black/50 focus:ring-2 focus:ring-blue-500"
                    placeholder="Update Your Name"
                  />
                </div>
                <div className="flex flex-row items-center justify-center text-xl font-medium">
                  Email:
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    className="ml-12 mt-2 h-10 w-full rounded-md bg-[#ffffffdd] p-3 text-black/50 focus:ring-2 focus:ring-blue-500"
                    placeholder="Update Your Email"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-xl font-medium">
                  <div className="-ml-0 flex flex-row items-center justify-center text-xl font-medium">
                    <span>
                      Phone
                      <br /> Number:
                    </span>
                    <input
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
                      name="phoneNumber"
                      className="ml-6 mt-2 h-10 w-[450px] rounded-md bg-[#ffffffdd] p-3 text-black/50 focus:ring-2 focus:ring-blue-500"
                      placeholder="Update Your Phone Number"
                    />
                  </div>

                  {showMessage && (
                    <p className="mt-2 block text-sm text-red-500">
                      {showMessage}
                    </p>
                  )}
                </div>
                <div className="flex flex-row items-center justify-center text-xl font-medium">
                  Location:
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    name="Location"
                    className="ml-6 mt-2 h-10 w-full rounded-md bg-[#ffffffdd] p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col text-xl font-medium">
                  Name:
                  <span className="py-1 text-lg font-normal">
                    {dataUsers?.firstName} {dataUsers?.lastName}
                  </span>
                </div>
                <div className="flex flex-col text-xl font-medium">
                  Email:
                  <span className="py-1 text-lg font-normal">
                    {dataUsers?.email}
                  </span>
                </div>
                <div className="flex flex-col text-xl font-medium">
                  Phone Number:
                  <span className="py-1 text-lg font-normal">
                    {dataUsers?.phoneNumber}
                  </span>
                </div>
                <div className="flex flex-col text-xl font-medium">
                  Addres:
                  <span className="w-80 text-wrap py-1 text-lg font-normal">
                    {dataUsers.location}
                  </span>
                </div>
              </>
            )}
            {isEditing ? (
              <div className="flex gap-[27px]">
                <Button
                  variant={"profile"}
                  className="mt-20 w-[260px] gap-2"
                  onClick={handleSubmitToggle}
                >
                  <span>Save</span>
                </Button>
                <Button
                  variant={"profileOutline"}
                  className="mt-20 w-[260px] gap-2 transition duration-150 ease-linear hover:bg-[#0D2864] hover:text-[#FAFAFA]"
                  onClick={CancelEditToggle}
                >
                  <span>Cancel</span>
                </Button>
              </div>
            ) : (
              <Button
                variant={"profileOutline"}
                className="gap-2"
                onClick={handleEditToggle}
              >
                <Image
                  width={15}
                  height={15}
                  src={"/pencil.svg"}
                  alt="Pencil"
                />{" "}
                <span>Edit Profile</span>{" "}
              </Button>
            )}
          </div>
        </div>
        <div className="my-14 flex flex-col text-[#040F27]">
          <span className="py-5 text-2xl font-semibold">Security</span>
          {isEditing ? (
            <>
              <div className="h-auto max-h-56 w-[1024px] max-w-5xl rounded-[20px] bg-[#EFECFF] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]">
                <div className="flex px-5 py-6">
                  <span className="text-base font-medium text-[#040F27]">
                    Password :
                  </span>
                  <span className="-mt-2.5 px-10 text-2xl font-bold">
                    ............................
                  </span>
                </div>
                <hr className="m-auto flex h-[1px] w-[95%] border-none bg-[#040F2780] bg-opacity-50" />
                <div className="flex px-5 py-6">
                  <span className="text-base font-medium text-[#040F27]">
                    Email :
                  </span>
                  <span className="px-16 text-base font-semibold">
                    ClaudyoPasqal@gmail.com
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="mt-14 w-[83px]" variant={"profile"}>
                  Save
                </Button>
              </div>
            </>
          ) : (
            <div className="h-auto max-h-56 w-[1024px] max-w-5xl rounded-[20px] bg-[#FAFAFA] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]">
              <div className="flex px-5 py-6">
                <span className="text-base font-medium text-[#040F27]">
                  Password :
                </span>
                <span className="-mt-2.5 px-10 text-2xl font-bold">
                  ............................
                </span>
              </div>
              <hr className="m-auto flex h-[1px] w-[95%] border-none bg-[#040F2780] bg-opacity-50" />
              <div className="flex px-5 py-6">
                <span className="text-base font-medium text-[#040F27]">
                  Email :
                </span>
                <span className="px-16 text-base font-semibold">
                  ClaudyoPasqal@gmail.com
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Profile.getLayout = function getLayout(page: any) {
  return (
    <DashboardLayout>
      <Content>{page}</Content>
    </DashboardLayout>
  );
};
