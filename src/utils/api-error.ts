
class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];

    constructor(statusCode: number,message:string,error:any[]=[],stack?:string) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = error;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;