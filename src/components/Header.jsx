'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    if (pathname === '/search') return null;

    return (
        <header className="pt-5 bg-gray-700 text-white border-b border-[#b8a9a9] px-2">
            <nav className="w-11/12 sm:w-10/12 mx-auto flex justify-between">
                <div>
                    <div className="mb-5">
                        <Link href="/">
                            <h4 className="text-3xl font-bold"><span className="text-[red]">Local</span> Discovery</h4>
                        </Link>
                    </div>
                </div>
                <div>
                    <ul className="flex gap-4">
                        <li className="btn-list-shop hover:bg-[#b4afaf59] p-2 rounded-md cursor-pointer text-[18px]">
                            <Link href="/"><i className="fa-solid fa-shop"></i> List your shop</Link>
                        </li>
                        <Link href="/login">
                            <li className="btn-login bg-linear-to-r from-[#ff8938] to-[#ff0000] text-white font-bold p-2 w-[100px] hover:shadow-lg text-center rounded-md cursor-pointer text-[18px]">
                                Login
                            </li>
                        </Link>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
