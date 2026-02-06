import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/configs/axios.config";
import { notFound } from "next/navigation";

const UserPublicProfile = async (props: PageProps<'/user/[username]'>) => {
  const { username } = await props.params
  const response = await axiosInstance.get<{
    success: boolean;
    data: {
      imageUrl: string;
      hasImage: boolean;
      username: string;
      firstName: string;
      lastName: string;
    };
    message: string
  }>(`/user/${username}`)

  if (!response?.data?.data) {
    notFound()
  }

  const profile = response.data.data

  return (
    <div className="page-container">
      <div className="grid grid-cols-5 gap-4 page-gutter-x">
        <div className="flex flex-col col-span-1 gap-4">
          <Avatar className="md:size-64 size-48">
            <AvatarImage src={profile.imageUrl} />
          </Avatar>
          <div className="md:text-2xl text-xl leading-tight">
            <p className="font-semibold mb-1">{profile.firstName + ' ' + profile.lastName}</p>
            <p className="font-extralight">{profile.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPublicProfile;
