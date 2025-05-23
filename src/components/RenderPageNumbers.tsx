import React from "react";
interface RenderPageNumbersProp{
    pageCount:number;
    page:number;
    handlePage:(i:number)=>void;
}
const RenderPageNumbers = ({pageCount,page,handlePage}:RenderPageNumbersProp) => {
        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            pages.push(
                <span
                    key={i}
                    onClick={() => handlePage(i)}
                    className={`w-[40px] h-[40px] rounded-full mx-1 text-[20px] inline-flex items-center justify-center cursor-pointer ${
                        page === i ? 'bg-red-700 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                    {i}
                </span>
            );
        }
        return <>{pages}</>;
    };

export default RenderPageNumbers;