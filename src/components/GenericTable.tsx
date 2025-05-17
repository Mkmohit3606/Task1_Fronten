import React,{useState, useEffect} from "react";
import { Users$ } from "../services/api";
import { User } from "../types/TableTypes";
import { Subscription } from "rxjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;


export const  UserTable = ()=>{
    const[data, setData]= useState<User[]>([]);
    const[search,setSearch]= useState("");
    const[selectedId, setSelectedId]=useState<string[]>([]);
    const[page,setPage]= useState(1);
    const goToFirstPage = () => setPage(1);
    const goToLastPage = () => setPage(pageCount);
    const goToPrevPage = () => setPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPage(prev => Math.min(prev + 1, pageCount));


    //Load the api
    useEffect(()=>{
        const sub:Subscription = Users$.subscribe(setData);
        return ()=>sub.unsubscribe();
    },[]);

    const filtered = data.filter(u=>
        Object.values(u).some(v=>String(v).toLowerCase().includes(search.toLowerCase()) )
    );

    const paginated = filtered.slice((page -1)*PAGE_SIZE, page*PAGE_SIZE);
    const pageCount = Math.ceil(filtered.length/PAGE_SIZE);

    const toggleSelect = (id:string)=>{
        setSelectedId(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    };

    const toggleSelectAll =()=>{
        const currentPageId = paginated.map(u=>u.id);
        const allSelected = currentPageId.every(id =>selectedId.includes(id));
        setSelectedId(prev=>allSelected?prev.filter(id=>!currentPageId.includes(id)):[...prev,...currentPageId.filter(id=>!prev.includes(id))]);
    }

    const deleteUser = (id:string)=>{
        Users$.next(data.filter(u=>u.id !== id));
        setSelectedId(prev=>prev.filter(x=>x !==id));
    };

    const deleteSelected = ()=>{
        Users$.next(data.filter(u =>!selectedId.includes(u.id)));
        setSelectedId([]);
    }

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            pages.push(
                <span
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-[30px] h-[30px] rounded-full mx-1 inline-flex items-center justify-center cursor-pointer ${
                        page === i ? 'bg-red-700 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                    {i}
                </span>
            );
        }
        return pages;
    };


    return(
        <div className="py-6 px-[6rem]">
            <input
                type="text"
                placeholder="Search by name, email or role"
                className="p-2 border w-full mb-4"
                value={search}
                onChange={e=>{
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />
            <table className="w-full border">
                <thead className="border py-2 border-b-2">
                    <th className="text-start">
                        <input
                            className="ml-3"
                            type="checkbox"
                            checked={
                                paginated.length>0 && paginated.every(u=>selectedId.includes(u.id))
                            }
                            onChange={toggleSelectAll}
                        />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                            {
                                paginated.map((user)=>(
                                    <tr key={user.id} className="border my-2">
                                        <td className="text-start">
                                            <input 
                                                className="ml-3"
                                                type="checkbox"
                                                checked={selectedId.includes(user.id)}
                                                onChange={()=>toggleSelect(user.id)}
                                            />
                                        </td>
                                        <td className="text-center">{user.name}</td>
                                        <td className="text-center">{user.email}</td>
                                        <td className="text-center">{user.role}</td>
                                        { <td className="flex row justify-center">
                                            <FontAwesomeIcon icon={faPenSquare} className=" inline cursor-pointer text-[25px] mr-3"/>
                                            <FontAwesomeIcon icon={faTrash} className="inline text-[25px] cursor-pointer text-red-500"
                                            onClick={() => deleteUser(user.id)}/>
                                        </td>}
                                    </tr>
                                ))
                            }
                </tbody>
                <tfoot className="h-[40px]">
                    <tr>
                        <td><span className="ml-3 border border-red-500 bg-red-500 rounded-[7px] p-[7px] w-fit">Delete Selected</span></td>
                        <td colSpan={4} className="p-2 text-center">
                            <span onClick={goToFirstPage} className={`w-[30px] h-[30px] cursor-pointer rounded-full ${
                                page > 1 ?"bg-red-500":"bg-gray-500"
                            } text-white p-[5px] mx-2`}>&lt;&lt;</span>
                            <span onClick={goToPrevPage} className={`w-[30px] h-[30px] cursor-pointer rounded-full ${
                                page > 1 ?"bg-red-500":"bg-gray-500"
                            } text-white p-[5px] mx-2`}>&nbsp;&lt;&nbsp;</span>
                            {renderPageNumbers()}
                            <span onClick={goToNextPage} className={`w-[30px] h-[30px] cursor-pointer rounded-full ${
                                page < pageCount ?"bg-red-500":"bg-gray-500"
                            } text-white p-[5px] mx-2`}>&nbsp;&gt;&nbsp;</span>
                            <span onClick={goToLastPage} className={`w-[30px] h-[30px] cursor-pointer rounded-full ${
                                page < pageCount ?"bg-red-500":"bg-gray-500"
                            } text-white p-[5px] mx-2`}>&gt;&gt;</span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}