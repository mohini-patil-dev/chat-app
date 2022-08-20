import { Response } from 'express';

interface CommonResponse {
    code?: number;
    message?: string;
    data?: Object;
}

interface SuccessResponse extends CommonResponse {}
interface ErrorResponse extends CommonResponse {
    error?: any;
}

export class CustomResponse {
    res: Response;
    constructor(res: Response) {
        this.res = res;
    }

    success({ code = 200, message = 'Success', data = {} }: SuccessResponse) {
        this.res.status(code).json({
            success: true,
            message,
            data,
        });
    }

    reject(errorPayload: ErrorResponse) {
        if (errorPayload?.error?.isJoi) {
            errorPayload.code = 422;
        }
        this.res.status(errorPayload.code || 500).json({
            success: false,
            message:
                errorPayload.message ||
                errorPayload?.error?.message ||
                'Something went wrong, Please try again later.',
            data: errorPayload.data,
        });
    }
}
