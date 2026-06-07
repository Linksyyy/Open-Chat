import { JSX } from "react/jsx-runtime";

class Contact {
  nickname: string;
  user: string;
  constructor(nickname: string, user: string) {
    this.nickname = nickname;
    this.user = user;
  }
}

const contatos = [
  new Contact("Adriel", "linksyyy"),
  new Contact("Tcharlys", "drigomenezes"),
  new Contact("Luanda", "luandinha"),
  new Contact("Laura", "lauraaguiar"),
  new Contact("João", "joaoporfirio"),
  new Contact("Mimis", "richfuyostan"),
  new Contact("Levi", "mattslaoq"),
];

export default function Sidebar(): JSX.Element {
  return (
    <div className="h-screen flex w-2/10 bg-p-1 pt-5 px-8">
      <div className="bg-p-0 py-4 px-4 h-full w-screen rounded-4xl">
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
    </div>
  );
}
