import {Link} from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { MenuHTMLAttributes } from "react";

const Header = () => {
    const {isLoggedIn} = useAppContext();
    return (
        <div className="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">MernHolidays.com</Link>
                </span>
                <span className="flex space-x-2">
                    {isLoggedIn ? <>
                        <ul className="flex space-x-6">
                            <li className="relative group">
                                <button className="py-2 border flex items-center text-white px-3 rounded-md fold-bold hover:bg-blue-600">
                                My Progress <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                <ul className="mt-0 border absolute hidden group-hover:block bg-blue-800 text-white mt-2 py-2 w-40 rounded shadow-lg">
                                <li>
                                    <Link to="/my-progress-pictures" className="block px-4 py-2 hover:bg-blue-600 hover:border rounded">Progess Pictures</Link>
                                </li>
                                </ul>
                            </li>
                        </ul>
                        <Link className= "border flex items-center text-white px-3 rounded-md fold-bold hover:bg-blue-600 shadow-lg" to="/add-log"> Add Daily Log </Link>
                        <SignOutButton />
                    </>:
                    <Link to="/sign-in" className="text-blue-600 px-3 py-1 font-bold bg-white rounded-md hover:bg-gray-200 shadow-lg">
                    Sign In
                    </Link>}
                    
                    
                </span>
            </div>
        </div>
    );
};

export default Header;