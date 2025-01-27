import Image from "next/image";
import Link from "next/link";

export default function Menu({ children }) {
    return (
        <ul className="flex flex-col gap-4">
            {children}
        </ul>
    );
}


export const MenuItem = ({ children, href, props }) => {
    return (
        <li className="w-full">
            <Link href={href} {...props} className="flex w-full py-3 px-8 gap-2 text-lg font-semibold items-center hover:bg-primary hover:text-white">
                {children}
            </Link>
        </li>
    );
};
