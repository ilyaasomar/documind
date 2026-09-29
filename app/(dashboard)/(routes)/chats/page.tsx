import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";

const Chats = () => {
  return (
    <div className="flex-1 sm:p-2">
      <Header title="Chats" description="One document per conversation" />
      <div className="mt-4 sm:px-2">Chats</div>
    </div>
  );
};

export default Chats;
