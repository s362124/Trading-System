export type User = {
    id:string
    name:string
    surname:string
    email:string
    phoneNumber:number
    role:number
    gender:string
    address:string
    likedItems?:string[]
    password:string
    joinedAt:Date
}