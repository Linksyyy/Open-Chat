import useUser from "@/Contexts/userContext";
import { FaPlus } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";

class Contact {
  nickname: string;
  user: string;
  constructor(nickname: string, user: string) {
    this.nickname = nickname;
    this.user = user;
  }
}

const contatos: Contact[] = [];

export default function Sidebar() {
  const { id, username, created_at } = useUser();
  const enteredAt = new Date(created_at);
  return (
    <div className="flex flex-col h-screen w-2/10">
      <div className="h-full flex-col flex w-full bg-p-1 pt-5 px-8">
        {/*Notifications*/}
        <div className="w-full flex justify-around py-5 items-center">
          <button className="bg-s-2 hover:bg-s-1 p-2.5 rounded-4xl transition-all duration-100 hover:scale-115">
            <FaBell />
          </button>
          <button className="bg-s-2 hover:bg-s-1 p-2.5 rounded-4xl transition-all duration-100 hover:scale-115">
            <FaPlus />
          </button>
        </div>

        {/*Chats*/}
        <div className="bg-p-0 py-4 px-4 h-full w-full rounded-4xl">
          {contatos.map((el, i) => (
            <button
              key={i}
              className="border-p-4 w-full text-inherit justify-center items-start flex flex-col transition-colors duration-200 ease-in-out border-b hover:bg-p-4 rounded-xl p-2"
            >
              <h2 className="font-bold text-xl">{el.nickname}</h2>
              <h6 className="font-light text-sm text-neutral-400">{el.user}</h6>
            </button>
          ))}
        </div>

        {/*User info*/}
        <div className="w-full flex flex-col py-5 justify-center items-center">
          <p className="text-foreground">Logged in as {username}</p>
          <p className="text-foreground-1 text-sm">
            Entered at {enteredAt.toLocaleDateString("pt-br")}
          </p>
          <p className="text-foreground-1 text-xs">{id}</p>
        </div>
      </div>
    </div>
  );
}
