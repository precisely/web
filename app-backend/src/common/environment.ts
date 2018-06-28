// yes, this is duplicative of what is in common.js, but I am paranoid
export const isOffline = !/^(no|0|false|)$/i.test(process.env.IS_OFFLINE || '');
