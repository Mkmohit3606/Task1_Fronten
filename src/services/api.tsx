import { BehaviorSubject } from "rxjs";
import { User } from "../types/TableTypes";

export const Users$ = new BehaviorSubject<User[]>([]);
export const fetchUsers = async()=>{
    const response = await fetch("https://excelerate-profile-dev.s3.ap-south-1.amazonaws.com/1681980949109_users.json");
    if(!response.ok) throw new Error("Failed to fetch Data");
    const data= await response.json();
    Users$.next(data);
}