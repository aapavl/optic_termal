import Config from '../config.json' assert { type: "json" };
import koffi from 'koffi';
import { 
    IPC_NET_Init, IPC_NET_Cleanup,
    IPC_NET_DEVICENFO, IPC_NET_Login,
    S_PTZ_COMMAND, IPC_NET_PtzCommand,
    STR_WIPER, IPC_NET_WiperSet
} from './dll-init.js';


export { 
    init, cleanup, login, wiper, ptz
};


const requests = Config.lib.requests;


// -------------------------------------------------------
// init
function init(protocolType = requests.init.params.protocolType) {
    console.log('init function');
    return IPC_NET_Init(protocolType, null);
}


// -------------------------------------------------------
// cleanup
function cleanup(protocolType = requests.cleanup.params.protocolType) {
    console.log('cleanup function');
    return IPC_NET_Cleanup(protocolType);
}


// -------------------------------------------------------
// login
function login() {
    console.log('login function');
    const { devIP, port, userName, password, nVerMain, nVerSub, nVerFix1, nVerFix2 } = requests.cleanup.params.loginInfo;
    const dVersion = (nVerMain << 24) | (nVerSub << 16) | (nVerFix1 << 8) | nVerFix2;
    console.log('login param:', { devIP, port, userName, password, dVersion });

    const device = koffi.pointer(IPC_NET_DEVICENFO);
    const dVersionRQ = koffi.alloc('uint32', 4);  
    const bIndependency = koffi.alloc('bool', 1); 

    return IPC_NET_Login(devIP, port, userName, password, device, dVersion, dVersionRQ, bIndependency);
}


// -------------------------------------------------------
// 24.1 - Установите параметры стеклоочистителя - WiperSet
function wiper(lUserID, value) {
    return IPC_NET_WiperSet(lUserID, {action: value});
}


// -------------------------------------------------------
// 31.1 - Управление PTZ - PTZ
function ptz(lUserID, channelId, command) {
    return IPC_NET_PtzCommand(lUserID, {
        uChanId: channelId,
        uPlateId: 1,        
        uCommand: command,       
        uParam: 0,          
        uSpeed: 0,          
        resv: Array(127).fill(0)
    });
}



// -----------
// test fun
// -------------------------

// console.log("init: ", init());
// const lUserID = login();
// console.log("userId: ", lUserID);

// let ptzRes = ptz(lUserID, 0, Config.ptzCommand.PTZ_STOP);
// console.log("ptz: ", ptzRes);


// // let wiperRes = wiper(lUserID, Config.wiperAction.on);
// // console.log("wiper: ", wiperRes);
