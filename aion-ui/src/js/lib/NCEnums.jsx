/* eslint-disable */
// entity ------------------------------------------------------------

export const NCEntity = 
{
  UNKNOWN: 4,
  BLOCK: 0,
  TXN: 3,
  ACCOUNT: 2,
  TKN:1,
  SEARCH:5,
  CNTR:6,
  EVENT:7,
  TRN:8
};


export const NCChart = {
  ActiveAddressGrowth : 0,
  TopMiner : 1,
  Difficulty : 2,
  HashingPower : 3,
  TransactionsoverTime : 4,
  BlockTime : 5,
};

export let NCEntityInfo = {};

NCEntityInfo[NCEntity.BLOCK] = {
  icon: "pt-icon-layers",
  name: "Block",
  absoluteUrl: "/block/",
}
NCEntityInfo[NCEntity.TXN] = {
  icon: "pt-icon-applications",
  name: "Transaction",
  absoluteUrl: "/transaction/",
}
NCEntityInfo[NCEntity.UNKNOWN] = {
  icon: "pt-icon-help",
  name: "Unknown Entity",
  absoluteUrl: "/",
}
NCEntityInfo[NCEntity.ACCOUNT] = {
  icon: "pt-icon-document",
  name: "Account",
  absoluteUrl: "/account/",
}
NCEntityInfo[NCEntity.TKN] = {
  icon: "pt-icon-application",
  name: "Token",
  absoluteUrl: "/token/",
}
NCEntityInfo[NCEntity.CNTR] = {
  icon: "pt-icon-application",
  name: "Contract",
  absoluteUrl: "/contract/",
}
NCEntityInfo[NCEntity.SEARCH] = {
  icon: "pt-icon-search",
  name: "Default",
  absoluteUrl: "/search/",
}

export let NCEntityServerMapping = {};
NCEntityServerMapping['block'] = NCEntity.BLOCK;
NCEntityServerMapping['transaction'] = NCEntity.TXN;
NCEntityServerMapping['account'] = NCEntity.ACCOUNT;
NCEntityServerMapping['token'] = NCEntity.TKN;
NCEntityServerMapping['search'] = NCEntity.SEARCH;
NCEntityServerMapping['contract'] = NCEntity.CNTR;

NCEntityServerMapping['event'] = NCEntity.EVENT;
// tables -------------------------------------------------------------

export const NCSortType = {
  ASC: 0,
  DESC: 1,
};

// list types ---------------------------------------------------------

export const blkListType = {
  ALL: 0,
  BY_ACCOUNT: 1
}

export const txnListType = {
  ALL: 0,
  BY_BLOCK: 1,
  BY_ACCOUNT: 2,
  ALL_RANGE: 3,
  BY_ACCOUNT_RANGE: 4
}

export const accListType = {
  ALL: 0
}

export const tknListType = {
  ALL: 0,
  BY_ACCOUNT: 1
}
export const trnListType = {
  ALL: 0,
  BY_ACCOUNT: 1,
  BY_TXN:2
}
export const txnLogListType = {
  ALL: 2,
  BY_TXN: 0,
  BY_ACCOUNT:1
}
export const cntrListType = {
  ALL: 0,
  BY_ACCOUNT: 1
}
export const eventListType = {
  ALL: 0,
  BY_ACCOUNT: 1
}