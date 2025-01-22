export namespace ResponseTypes {

    export type Default = {
        error: boolean,
        message: string
    }

    export type Login = {
        error: boolean,
        message: string,
        userId: number
    }

    export type Wiper = {
        error: boolean,
        message: string,
        userId: number,
        wiperAction: number
    };
    
    export type Ptz = {
        error: boolean,
        message: string,
        userId: number,
        channelId: number, 
        command: number
    };


    export type Predict = {
        error: boolean,
        message: string,
        predict: string
    }
}
