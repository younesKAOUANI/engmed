import { useState } from "react";
import { Card } from "./Card";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { cn } from "@/utils/cn";

export const Collapse = ({ title, ...props }) => {
    const [open, setOpen] = useState(false);
  
    return <Card className={cn('flex flex-col', props.className)}>
    
      <h3 onClick={() => setOpen(!open)} className={cn("flex items-center justify-between cursor-pointer font-bold text-xl", props.headerClassName)}>
        {title} {open ? <FaAngleUp /> : <FaAngleDown />}
      </h3>
      {open && <div className="w-full p-4">
        {props.children}
      </div>}
  
    </Card>
  }
  