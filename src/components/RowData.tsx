import React from "react";
import { User } from "../types/TableTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";

interface RowDataProps {
    paginated: User[],
    deleteUser: (id: string) => void;
    toggleSelect: (id: string) => void;
    selectedId: string[];
    handleEdit:(id:string)=>void;
}

const rowData = ({ paginated, deleteUser, toggleSelect, selectedId, handleEdit }: RowDataProps) => {
    return (
        <>
            {
                paginated.map((user) => (
                    <tr key={user.id} className="border">
                        <td className="text-start">
                            <input
                                className="ml-3"
                                type="checkbox"
                                checked={selectedId.includes(user.id)}
                                onChange={() => toggleSelect(user.id)}
                            />
                        </td>
                        <td className="text-start">{user.name}</td>
                        <td className="text-start">{user.email}</td>
                        <td className="text-start">{user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}</td>
                        {<td className="flex justify-start">
                            <FontAwesomeIcon icon={faPenSquare} className=" inline cursor-pointer text-[25px] mr-3 w-fit" 
                            onClick={()=>handleEdit(user.id)}
                            />
                            <FontAwesomeIcon icon={faTrash} className="inline text-[25px] cursor-pointer text-red-500 w-fit"
                                onClick={() => deleteUser(user.id)} />
                        </td>}
                    </tr>
                ))
            }
        </>
    );
}

export default rowData;