import {FC, ReactNode} from "react";

export const PageLayout: FC<{ title: string; children: ReactNode; }> = ({title, children}) => {
    return (
        <div>
            <div className={"flex justify-between w-1/2 pl-4 pt-4"}>
                <a href={"/"} className={"text-white hover:underline"}>
                    <h1>Back</h1>
                </a>

                <h1 className={"text-white"}>{title}</h1>
            </div>
            {children}
        </div>
    )
}