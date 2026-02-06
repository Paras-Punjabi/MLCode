import { Spinner } from "@/components/ui/spinner";

const Loader = () => {
  return (
    <div className="absolute w-screen flex justify-center items-center h-screen">
        <Spinner className="size-18" />
      </div>
  )
}

export default Loader