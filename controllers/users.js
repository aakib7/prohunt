exports.getUsers = (req,res)=>{
    try{
        return res.status(200).json({
            success:true,
            name:"aa1ib",
        });
    }
    catch(error){
        res.status(500).json(
            {
                success: false,
                message: error.message,
            });
    }
}