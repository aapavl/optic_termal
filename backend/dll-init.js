import koffi from 'koffi';

export { 
    IPC_NET_Init, IPC_NET_Cleanup, 
    IPC_NET_DEVICENFO, IPC_NET_Login,
    S_PTZ_COMMAND, IPC_NET_PtzCommand,
    STR_WIPER, IPC_NET_WiperSet
};



const dll = koffi.load('IpcNetSDK.dll');


// -------------------------------------------------------
// init
const IPC_NET_Init = dll.func('bool IPC_NET_Init(int protocolType, void* pThis)');


// -------------------------------------------------------
// cleanup
const IPC_NET_Cleanup = dll.func('bool IPC_NET_Cleanup(int protocolType)');


// -------------------------------------------------------
// login
const IPC_NET_DEVICENFO = koffi.struct({
    szDeviceName: 'char[32]',
    szSerialNumber: 'char[48]',
    cVideoChanNum: 'char',
    cVehicleNum: 'char',
    cComCapNum: 'char',
    cComOutNum: 'char',
    uiHardwareVer: 'uint32',
    uiSoftwareVer: 'uint32',
    szMac: 'char[18]',
    usActWidth: 'uint16',
    usActHeight: 'uint16',
});
// const IPC_NET_Login = dll.func(['uint32', ['string', 'ushort', 'string', 'string', 'pointer', 'uint32', 'string', 'bool']]);
const IPC_NET_Login = 
dll.func('uint32 IPC_NET_Login(const char* szDevIP, uint16 wPort, const char* szName, const char* szPass,' +
    'void* lpDeviceInfo, uint32 dwVersion, uint32* dwVersionRQ, bool* bHeartBeatIndependency)');


// -------------------------------------------------------
// 24.1 - Установите параметры стеклоочистителя - WiperSet
const STR_WIPER = koffi.struct('PSTR_WIPER', {
    action: 'int', // 1: On, 2: Off, 3: Automatic
});
const IPC_NET_WiperSet = dll.func('bool IPC_NET_WiperSet(uint32 lUserID, PSTR_WIPER* lpParam)');


// -------------------------------------------------------
// 31.1 - Управление PTZ - PTZ
const S_PTZ_COMMAND = koffi.struct('LPS_PTZ_COMMAND', {
    uChanId: 'char',         // Video channel
    uPlateId: 'char',        // Yuntai address
    uCommand: 'char',        // Command word (e.g., PTZ_UP, PTZ_DOWN, etc.)
    uParam: 'char',          // Command parameter (e.g., speed)
    uSpeed: 'char',          // Speed of movement
    resv: 'char[127]',       // Reserved byte
});

const IPC_NET_PtzCommand = dll.func('uint32 IPC_NET_PtzCommand(uint32 lUserID, LPS_PTZ_COMMAND* lpCommand)');



