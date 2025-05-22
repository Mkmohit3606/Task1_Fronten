import React from "react";

interface SearchContainerProp{
    search:string;
    handleSearchChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}
const SearchContainer = ({search, handleSearchChange}:SearchContainerProp)=>{
    return(
        <input
                type="text"
                placeholder="Search by name, email or role"
                className="p-2 border-2 w-full mb-4"
                value={search}
                onChange={(e)=>handleSearchChange(e)}
            />
    );
}

export default SearchContainer;