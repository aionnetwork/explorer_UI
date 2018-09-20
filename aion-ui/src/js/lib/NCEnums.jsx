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
  BY_ACCOUNT: 2
}

export const accListType = {
  ALL: 0
}

export const tknListType = {
  ALL: 0,
  BY_ACCOUNT: 1
}

export const cntrListType = {
  ALL: 0,
  BY_ACCOUNT: 1
}
