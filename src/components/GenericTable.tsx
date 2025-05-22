import React,{useState, useEffect} from "react";
import { Users$ } from "../services/api";
import { User } from "../types/TableTypes";
import { Subscription } from "rxjs";
import RowData from "./RowData";
import RenderPageNumbers from "./RenderPageNumbers";
import EditDataForm from "./EditDataForm";


const PAGE_SIZE = 10;


export const  UserTable = ()=>{
    const[data, setData]= useState<User[]>([]);
    const[search,setSearch]= useState("");
    const[selectedId, setSelectedId]=useState<string[]>([]);
    const[showEdit,setShowEdit]= useState(false);
    const [editData, setEditData] = useState<User | null>(null);
    const[page,setPage]= useState(1);
    const goToFirstPage = () => setPage(1);
    const goToLastPage = () => setPage(pageCount);
    const goToPrevPage = () => setPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPage(prev => Math.min(prev + 1, pageCount));
    const handlePage = (i:number)=>setPage(i);

    //Load the api
    useEffect(()=>{
        const sub:Subscription = Users$.subscribe(setData);
        return ()=>sub.unsubscribe();
    },[]);

    /**
     * how filter work here
     * when we type anything in search bar the it call the function handleSearchChange
     * then the function will update state of search and page and based on update state the component will be re-render
     * it will change the data for filtered, paginated and pageCount
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Optional: Reset pagination to first page
    };


    const filterUsers = (users: User[], query: string): User[] => {
    const lowerQuery = query.toLowerCase();
    return users.filter(user =>
        Object.values(user).some(val =>
        String(val).toLowerCase().includes(lowerQuery)
        )
    );
    };


    const filtered = filterUsers(data, search);

    const paginated = filtered.slice((page -1)*PAGE_SIZE, page*PAGE_SIZE);
    const pageCount = Math.ceil(filtered.length/PAGE_SIZE);

    // Start of Toggle and Delete Data
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
    // End of Delete Data

    // For Start Edit Data
    const handleUpdateRow =(event:React.FormEvent)=>{
        event.preventDefault();
        if (!editData) return;
    const updated = data.map(user =>
      user.id === editData.id ? editData : user
    );
    Users$.next(updated);
    setShowEdit(false);
        setShowEdit(false);
    }

    const handleEdit = (id:string)=>{
        setShowEdit(true);
        const editDataGet = paginated.find(u => u.id === id) || null;
        setEditData(editDataGet);
    }
    const handleEditSingleCell = (valueName: string, value: string) => {
        setEditData(prev => {
            if (!prev) return prev; // safety check
            return { ...prev, [valueName]: value };
        });
    };

    const handleCancle =()=>{
        setEditData(null);
        setShowEdit(false);
    }
    // End of Edit Data

    return(
        <div className="py-6 px-[6rem]">
            <input
                type="text"
                placeholder="Search by name, email or role"
                className="p-2 border-2 w-full mb-4"
                value={search}
                onChange={handleSearchChange}
            />
            {showEdit && editData  && (
                <EditDataForm handleUpdateRow={handleUpdateRow} editData={editData} handleCancle={handleCancle} handleEditSingleCell={handleEditSingleCell}/>
            )}
            <table className="w-[80%] border table table-striped overflow-hidden">
                <thead className="border">
                    <tr>
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
                    </tr>
                </thead>
                <tbody>
                  <RowData paginated={paginated} deleteUser={deleteUser} toggleSelect={toggleSelect} selectedId={selectedId} handleEdit={handleEdit}/>  
                </tbody>
                <tfoot className="h-[40px]">
                    <tr>
                        <td><span className="ml-3 border border-red-500 bg-red-500 rounded-[7px] p-[7px] w-fit cursor-pointer" onClick={deleteSelected}>Delete Selected</span></td>
                        <td colSpan={4} className="p-2 text-center">
                            <span onClick={goToFirstPage} className={`w-[30px] h-[30px] cursor-pointer rounded-full ${
                                page > 1 ?"bg-red-500":"bg-gray-500"
                            } text-white p-[5px] mx-2`}>&lt;&lt;</span>
                            <span onClick={goToPrevPage} className={`w-[30px] h-[30px] cursor-pointer rounded-full ${
                                page > 1 ?"bg-red-500":"bg-gray-500"
                            } text-white p-[5px] mx-2`}>&nbsp;&lt;&nbsp;</span>
                            <RenderPageNumbers pageCount={pageCount} page={page} handlePage={handlePage}/>
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