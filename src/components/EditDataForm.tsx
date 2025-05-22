import React from "react";
import { User } from "../types/TableTypes";

interface EditDataFormProps {
    handleUpdateRow:(e:React.FormEvent)=>void;
    editData: User;
    handleCancle:()=>void;
    handleEditSingleCell:(valueName:string,value:string)=>void;
}

const EditDataForm= ({handleUpdateRow, editData, handleCancle, handleEditSingleCell}:EditDataFormProps)=>{
    return(
        <form onSubmit={(e)=>handleUpdateRow(e)} className="flex flex-row w-full align-baseline justify-between p-2 border-2 mx-0 mb-4">
                <div className="w-fit">
                    <label htmlFor="name">Name:</label>
                    <input type="text" value={editData.name} className="p-1 border-2 ml-1" name="name" id="name"
                        onChange={(e) => handleEditSingleCell( "name",e.target.value )}
                    />
                </div>
                <div className="w-fit">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={editData.email} id="email" className="p-1 border-2 ml-1"
                        onChange={(e) => handleEditSingleCell( "email",e.target.value )}
                    />
                </div>
                <div className="w-fit">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" className="p-1 border-2 ml-1"
                    value={editData?.role || ""}
                    onChange={(e) => {
                        if (editData) {
                            handleEditSingleCell("role", (e.target.value as 'admin' | 'member'));
                        }
                    }}
                    >
                        <option value="">Please select Role</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>                        
                    </select>
                </div>
                <div>
                    <button  className="w-fit bg-red-400 py-1 px-2 text-white font-[600]">Update</button>
                    <button type="submit" className="w-fit bg-success py-1 px-2 ml-2 text-white font-[600]"
                        onClick={(e)=>{
                            e.preventDefault();
                            handleCancle();
                        }}
                    >Cancle</button>
                </div>
                
            </form>
    );

}

export default EditDataForm;