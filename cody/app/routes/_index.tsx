import { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import { IndexPage } from "~/pages/IndexPage";

export const meta: MetaFunction = () => {
  return [
    { title: "Cody by Montelo" },
    { name: "description", content: "Cody is the first AI Software Engineer Intern." },
  ];
};

export default function Index() {
  return (
    <ClientOnly fallback={null}>
      {() => <IndexPage />}
    </ClientOnly>
  );
}
