import { Response } from "express";

type GenericResProps<T> = {
    status: number;
    success: boolean;
    message: string;
    data: T;
    accessToken?: string;

}

const sendResponse = <T>(res: Response, props: GenericResProps<T>) => {
    return res.status(props.status).json(props);
}

export default sendResponse