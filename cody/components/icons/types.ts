import { FC, MouseEventHandler, SVGAttributes } from "react";

export type Icon = FC<{ className?: SVGAttributes<any>["className"]; onClick?: MouseEventHandler<SVGSVGElement> }>;