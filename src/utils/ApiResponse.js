class ApiResponse {
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.statusCode=statusCode<400
        //server ka status code hota hai go and check on google
    }
}
export { ApiResponse }