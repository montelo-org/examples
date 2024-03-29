"use client";

export default function Chat() {
  return (
    <div className={"w-full h-full flex flex-col justify-center items-center text-white"}>
      <a href={"/basic"} className={"hover:underline"}>
        <h1 className={"text-white"}>Basic Chat</h1>
      </a>
      <a href={"/tool-calling"} className={"hover:underline"}>
        <h1>Tool Calling</h1>
      </a>
      <a href={"/server-components?prompt=hello"} className={"hover:underline"}>
        <h1>Server Components</h1>
      </a>
      <a href={"/stream-react-response"} className={"hover:underline"}>
        <h1>Stream React Response</h1>
      </a>
    </div>
  );
}
