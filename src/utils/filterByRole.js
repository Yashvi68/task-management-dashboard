export const filterByRole =  (data, loggedInRole)=>{
    let allowedRoles = []
    allowedRoles = data.filter((curItem)=>{
        return curItem?.role?.includes(loggedInRole)
    })
    const s = allowedRoles.map((item)=>{
        if(item?.children){
            let childArr = filterByRole(item?.children,loggedInRole)
            // console.log("==childArr==",childArr)
            return{
                ...item,
                children:childArr
            }
        }else{
            return item
        }
    })
    return s ;
}