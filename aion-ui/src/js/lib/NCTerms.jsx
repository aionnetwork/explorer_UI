/* eslint-disable */
// entity ------------------------------------------------------------
import LocalizedStrings from 'react-localization';

export const strings = new LocalizedStrings({
  
  en: {
    test:"this is the test string in english",

    Header_title: "Dashboard",
    header_tab1: "Explorer",
    //views
    header_tab2: "Analytics",
    //graphs

    header_search_str: "",
    header_search_filter: "",

    landing_blocks_title: "RECENT BLOCKS",
    landing_transaction_title: "RECENT TRANSACTIONS",
    landing_view_link: "View all",

    landing_txn_table_col1: "Age",
    landing_txn_table_col2: "Value",
    landing_txn_table_col3: "Transaction Hash",
    landing_txn_table_col4: "From Address",
    landing_txn_table_col5: "To Address",

    kpi_tab1_title: "NETWORK",
    kpi_tab1_subtitle: "EQUI2109",
    kpi_tab2_title: "TRANSACTION",
    
    kpi_block_l1: "Current",
    kpi_block_l2: "Block Time",
    kpi_block_desc: "Block Time",
    kpi_hash_l1: "Block Time",
    kpi_hash_l2: "Block Time",
    kpi_hash_desc: "Block Time",
    kpi_difficulty_l1: "Block Time",
    kpi_difficulty_l2: "Block Time",
    kpi_difficulty_desc: "Block Time",
    kpi_NRG_l1: "Block Time",
    kpi_NRG_l2: "Block Time",
    kpi_NRG_desc: "Block Time",
    kpi_TXNPEAK_l1: "Block Time",
    kpi_TXNPEAK_l2: "Block Time",
    kpi_TXNPEAK_desc: "Block Time",
    kpi_TXNTIME_l1: "Block Time",
    kpi_TXNTIME_l2: "Block Time",
    kpi_TXNTIME_desc: "Block Time",
    kpi_TXNCOUNT_l1: "Block Time",
    kpi_TXNCOUNT_l2: "Block Time",
    kpi_TXNCOUNT_desc: "Block Time",

    //account related strings
    Acc_list_title: "Account Lists",
    Acc_list_desc: "Recent Account Statistics",
    Acc_list_tab1: "Miner",
    Acc_list_tab2: "Account Inbound",
    Acc_list_tab3: "Account Outbound",

    Acc_miners_col1: "Address",
    Acc_miners_col2: "Avg Txn Per Mined Block",
    Acc_miners_col3: "% Blocks Found (Last 24hr)",
    
    Acc_inbound_col1: "Address",
    Acc_inbound_col2: "Txn Count",
    Acc_inbound_col3: "Avg NRG Price / Txn",
    Acc_inbound_col4: "Avg NRG Consumed / Txn",

    Acc_outbound_col1: "Address",
    Acc_outbound_col2: "Txn Count",
    Acc_outbound_col3: "Avg NRG Price / Txn",
    Acc_outbound_col4: "Avg NRG Consumed / Txn",

    Acc_detail_title: "Account",
    Acc_detail_row1: "Address",
    Acc_detail_row2: "Balance",
    Acc_detail_row2_subtitle: "as of block",
    Acc_detail_row3: "Nonce",
    Acc_detail_row4: "Token balance",

    Acc_detail_tab1: "Transactions",
    Acc_detail_tab2: "Mined Blocks",
    Acc_detail_tab3: "Transfers",

    Acc_detail_tab1_col1: "Block #",
    Acc_detail_tab1_col2: "Timestamp",
    Acc_detail_tab1_col3: "Value",
    Acc_detail_tab1_col4: "Transaction Hash",
    Acc_detail_tab1_col5: "From Address",
    Acc_detail_tab1_col6: "To Address",
    
    Acc_detail_tab2_col1: "Block #",
    Acc_detail_tab2_col2: "Timestamp",
    Acc_detail_tab2_col3: "Value",
    Acc_detail_tab2_col4: "Transaction Hash",
    Acc_detail_tab2_col5: "From Address",
    Acc_detail_tab2_col6: "To Address",

    Acc_detail_tab3_col1: "Block #",
    Acc_detail_tab3_col2: "Timestamp",
    Acc_detail_tab3_col3: "Value",
    Acc_detail_tab3_col4: "Transaction Hash",
    Acc_detail_tab3_col5: "From Address",
    Acc_detail_tab3_col6: "To Address",

    //Block related string
    Blk_list_title: "Blocks",
    Blk_list_desc: "Recent blocks",

    Blk_list_col1: "Block #",
    Blk_list_col2: "Timestamp",
    Blk_list_col3: "Txn Count",
    Blk_list_col4: "nrg Consumed",
    Blk_list_col5: "Difficulty",
    Blk_list_col6: "Block Size",

    Blk_detail_title: "Block",
    Blk_detail_row1: "Time Proposed",
    Blk_detail_row2: "Block Number",
    Blk_detail_row3: "Transaction Count",
    Blk_detail_row4: "Block Hash",
    Blk_detail_row5: "Parent Hash",
    Blk_detail_row6: "Miner",
    Blk_detail_row7: "Receipt Root",
    Blk_detail_row8: "Transaction Root",
    Blk_detail_row9: "State Root",
    Blk_detail_row10: "Difficulty",
    Blk_detail_row11: "Total Difficulty",
    Blk_detail_row12: "Nonce",
    Blk_detail_row13: "Block Reward",
    Blk_detail_row13_sub: "does not include transaction-fee payouts",
    Blk_detail_row14: "NRG Reward",
    Blk_detail_row14_sub: "transaction-fee payout for included transactions, minus own transactions",
    Blk_detail_row15: "NRG Consumed",
    Blk_detail_row16: "NRG Limit",
    Blk_detail_row17: "Block Size",
    Blk_detail_row18: "Bloom Filter",
    Blk_detail_row19: "Extra Data",
    Blk_detail_row20: "Equihash Solution",
    
    //Contracts
    Cntr_list_title: "Contracts",
    Cntr_list_desc: "Recent contracts",

    Cntr_list_col1: "Address",
    Cntr_list_col2: "Block",
    Cntr_list_col3: "Creator",
    Cntr_list_col4: "Transaction",
    
    Cntr_detail_title: "Contract",
    Cntr_detail_row1: "Address",
    Cntr_detail_row2: "Block Number",
    Cntr_detail_row3: "Transaction Hash",
    Cntr_detail_row4: "Creator",
    Cntr_detail_row5: "Balance",
    Cntr_detail_row6: "Nonce",

    Cntr_detail_tab1: "Transactions",
    Cntr_detail_tab2: "Events",
    
    Cntr_detail_tab1_col1: "Block #",
    Cntr_detail_tab1_col2: "Timestamp",
    Cntr_detail_tab1_col3: "Value",
    Cntr_detail_tab1_col4: "Transaction Hash",
    Cntr_detail_tab1_col5: "From Address",
    Cntr_detail_tab1_col6: "Status",
    Cntr_detail_tab1_col7: "To Address",

    Cntr_detail_tab2_col1: "Block #",
    Cntr_detail_tab2_col2: "Timestamp",
    Cntr_detail_tab2_col3: "Value",
    Cntr_detail_tab2_col4: "Transaction Hash",
    Cntr_detail_tab2_col5: "From Address",
    Cntr_detail_tab2_col6: "Status",
    Cntr_detail_tab2_col7: "To Address",

    //Tokens
    Tkn_list_title: "Tokens",
    Tkn_list_desc: "Total Tokens",

    Tkn_list_col1: "Token",
    Tkn_list_col2: "Decimal",
    Tkn_list_col3: "Frozen Supply",
    Tkn_list_col4: "Liquid Supply",
    Tkn_list_col5: "Creator",
    Tkn_list_col6: "Transaction",

    Tkn_detail_title: "Token",
    Tkn_detail_row1: "Created",
    Tkn_detail_row2: "Contract",
    Tkn_detail_row3: "Creator Addr",
    Tkn_detail_row4: "Transaction",
    Tkn_detail_row5: "Symbol",
    Tkn_detail_row6: "Granularity",
    Tkn_detail_row7: "Total Supply",
    Tkn_detail_row8: "Liquid Supply",

    Tkn_detail_tab1: "Transfers",
    Tkn_detail_tab2: "Holders",
    
    Tkn_detail_tab1_col1: "Block #",
    Tkn_detail_tab1_col2: "Timestamp",
    Tkn_detail_tab1_col3: "Value",
    Tkn_detail_tab1_col4: "Raw Value",
    Tkn_detail_tab1_col5: "From Address",
    Tkn_detail_tab1_col6: "",
    Tkn_detail_tab1_col7: "To Address",

    Tkn_detail_tab2_col1: "Account",
    Tkn_detail_tab2_col2: "Block #",
    Tkn_detail_tab2_col3: "Contract",
    Tkn_detail_tab2_col4: "Balance",
    
    //Transactions
    Txn_list_title: "Transactions",
    Txn_list_desc: "Recent Transaction",

    Txn_list_col1: "Block #",
    Txn_list_col2: "Timestamp",
    Txn_list_col3: "Value",
    Txn_list_col4: "Transaction Hash",
    Txn_list_col5: "From Address",
    Txn_list_col6: "Status",
    Txn_list_col7: "To Address",

    Txn_detail_title: "Transaction",
    Txn_detail_row1: "Time Sealed",
    Txn_detail_row2: "Coin",
    Txn_detail_row3: "Transaction Hash",
    Txn_detail_row4: "Block Number",
    Txn_detail_row5: "value",
    Txn_detail_row6: "NRG Price",
    Txn_detail_row7: "NRG Consumed",
    Txn_detail_row8: "Status",
    Txn_detail_row9: "Index",
    Txn_detail_row10: "Nonce",
    Txn_detail_row11: "From Address",
    Txn_detail_row12: "To Address",
    Txn_detail_row13: "Txn Logs",
    Txn_detail_row14: "Input Data",
    
    Txn_detail_tab1: "Transfers",
    
    Txn_detail_tab1_col1: "",
    Txn_detail_tab1_col2: "",
    Txn_detail_tab1_col3: "",
    Txn_detail_tab1_col4: "",
    Txn_detail_tab1_col5: "",
    Txn_detail_tab1_col6: "",
    Txn_detail_tab1_col7: "",

    //graphs

         
    //utils such as paging and misc strings
    time_r: "Retrieved",

    paging_str1: "First page",
    paging_str2: "Prev",
    paging_str3: "Page",
    paging_str4: "of",
    paging_str5: "Next",
    paging_str6: "Last page",

    footer_link_1: "Feedback",
    footer_link_2: "Community",
    footer_link_3: "Bounties & Grants",
    footer_link_4: "Developers",

    //breadcrumbs
    bread:"Home",
    Txn_slice: "",
    Txn_crumb: "",

    ///messaging

    Account: {
      LOADING:"Loading Account Details",
      LOADING_LIST:"Loading Accounts Data",
      LOADING_LIST_OUT:"Loading Out Bound Accounts Data",
      LOADING_LIST_MINER:"Loading Miner List",
      LOADING_LIST_IN:" Loading In Bound Accounts Data",
      EMPTY_DATA_TITLE:"Account Not Found",
      EMPTY_DATA:"No Data Available for Account: ",
      EMPTY_DATA_LIST:"No accounts found.",  
      INVALID_DATA:"Invalid Input. Please try again.",
      INVALID_DATA_LIST_IN:"No inbound account activity in last 24 hours",
      INVALID_DATA_LIST_OUT:"No outbound account activity in last 24 hours",
      INVALID_DATA_LIST_MINER:"Miner list not available.",
      DATA_POLICY:"Showing results from the latest transactions. ",
    },
    Block: {
      LOADING:"Loading Block Details",
      LOADING_LIST:"Loading Block Data",
      EMPTY_DATA:"No block found for descriptor: ",
      EMPTY_DATA_LIST:"No blocks found. Blockchain server loading blocks.",  
      EMPTY_DATA_LIST_MINER:"No mined blocks found.",  
      INVALID_DATA:"Syntax error: Invalid block structure.",
      INVALID_DATA_LIST:"Invalid Input. Please try again.",
      DATA_POLICY:"Showing results from the latest blocks. "
    },
    Contract: {
      LOADING:"Loading Contract Data",
      LOADING_LIST:"Loading Contract Data",
      EMPTY_DATA:"No Contracts found for:",
      EMPTY_DATA_LIST:"No Contracts found.", 
      EMPTY_DATA_LIST_ACC:"No Contracts Found Involving Account", 
      EMPTY_DATA_TITLE:"Contract Not Found",
      INVALID_DATA:"Contract Not Available",
      DATA_POLICY:"Showing results from the latest transactions. ",
      INVALID_DATA_LIST:"Invalid Input. Please try again."
    },
    Token: {
      TITLE:"Token",
      LOADING:"Loading Token Details",
      LOADING_LIST:"Loading Token Data",
      EMPTY_DATA:"Token Not Found",
      EMPTY_DATA_TITLE:"No Token",
      EMPTY_DATA_STR:"No Transaction found for descriptor: ",
      EMPTY_DATA_BY_ACCOUNT:"No tokens found involving account ",
      EMPTY_DATA_LIST:"No Tokens found.", 
      DATA_POLICY:"Showing results from the latest tokens. ",
      INVALID_DATA_TITLE:"No Token",
      INVALID_DATA:"Token Not Available",
      DATA_POLICY_TXN:"Showing results from the latest transactions. ",
      INVALID_DATA_LIST:"Invalid Input. Please try again.",
      GRANULARITY:"This is the Granularity"
    },
    Transaction: {
      LOADING:"Loading Transaction Details",
      LOADING_LIST:"Loading Transaction Data",
      EMPTY_DATA:"No Transaction found for descriptor: ",
      EMPTY_DATA_TITLE:"No Transactions",  
      EMPTY_DATA_LIST:"No transactions found for the last 30 days.", 
      EMPTY_DATA_LIST_TRN:"No internal transfers found.",
      EMPTY_DATA_LIST_ACC:"No Transactions Found Involving Account", 
      EMPTY_DATA_LIST_CNTR:"No Transactions Found Found For This Contract",  
      INVALID_DATA:"Syntax error: Invalid request structure.",
      INVALID_DATA_LIST:"Invalid Input. Please try again.",
      DATA_POLICY:"Showing results from the latest transactions. ",
      DATA_POLICY_CNTR:"Showing latest transactions for this contract.",
      DATA_POLICY_ACC:"Showing recent accounts which received transactions, over last 10,000 transactions.",
      DATA_POLICY_ACC_IN:"Showing recent accounts which received transactions, over last 10,000 transactions.",
      DATA_POLICY_ACC_OUT:"Showing recent accounts which sent transactions, over last 10,000 transactions.",
      DATA_POLICY_ACC_IN_EMPTY:"Showing recent accounts which received transactions, over last 10,000 transactions.",
      DATA_POLICY_ACC_OUT_EMPTY:"No outbound account activity in last 24 hours",
      
      DATA_POLICY_TRN:"Showing results from the latest transactions. "
      
    },
    Chart: {
      LOADING:"Loading Chart Details",  
      EMPTY_DATA:"No Data Available to Display Chart",    
      INVALID_DATA:"Error. Unable to Display Chart",
      DATA_POLICY:"Showing results from the latest transactions. "
    },
    Search: {
      LOADING:"Searching",
      LOADING_LIST:"Loading Results",
      EMPTY_DATA_TITLE:"Not Found",
      EMPTY_DATA:"No results found for: ",
      EMPTY_DATA_LIST:"No results found",  
      INVALID_DATA:"Invalid data",
      DATA_POLICY:"Showing results from the latest transactions. ",
      INVALID_DATA_LIST:"Invalid data. Please try again."
    },
    Paging: {
      LOADING:"Loading Details",
      LOADING_LIST:"Loading Data",
      EMPTY_DATA:"No result found for descriptor: ",
      EMPTY_DATA_LIST:"No data found.",  
      INVALID_DATA:"Syntax error. Data structure invalid.",
      DATA_POLICY:"Showing results from the latest transactions. ",
      INVALID_DATA_LIST:"Invalid response. Please try again."
    },
    Page: {
      LOADING:"Loading Page Details",
      LOADING_LIST:"Loading Page Data",
      EMPTY_DATA:"No data found for descriptor: ",
      EMPTY_DATA_LIST:"No data found.",  
      INVALID_DATA:"Syntax error: Invalid data structure.",
      DATA_POLICY:"Showing results from the latest transactions. ",
      INVALID_DATA_LIST:"Invalid Input. Please try again."
    }

  },
  es: {
    test:"this is the test string in english",
    kpi_block_l1: "Current",
    kpi_block_l2: "Block Time",
  },
  zh: {
    test:"this is the test string in english",
    kpi_block_l1: "Churrent",
    kpi_block_l2: "Block Time",
  },
});

//_Dep
//.Account.
export const Account = {
  LOADING:"Loading Account Details",
  LOADING_LIST:"Loading Accounts Data",
  LOADING_LIST_OUT:"Loading Out Bound Accounts Data",
  LOADING_LIST_MINER:"Loading Miner List",
  LOADING_LIST_IN:" Loading In Bound Accounts Data",
  EMPTY_DATA_TITLE:"Account Not Found",
  EMPTY_DATA:"No Data Available for Account: ",
  EMPTY_DATA_LIST:"No accounts found.",  
  INVALID_DATA:"Invalid Input. Please try again.",
  INVALID_DATA_LIST_IN:"No inbound account activity in last 24 hours",
  INVALID_DATA_LIST_OUT:"No outbound account activity in last 24 hours",
  INVALID_DATA_LIST_MINER:"Miner list not available.",
  DATA_POLICY:"Showing results from the latest transactions. ",
};

export const Block = {
  LOADING:"Loading Block Details",
  LOADING_LIST:"Loading Block Data",
  EMPTY_DATA:"No block found for descriptor: ",
  EMPTY_DATA_LIST:"No blocks found. Blockchain server loading blocks.",  
  EMPTY_DATA_LIST_MINER:"No mined blocks found.",  
  INVALID_DATA:"Syntax error: Invalid block structure.",
  INVALID_DATA_LIST:"Invalid Input. Please try again.",
  DATA_POLICY:"Showing results from the latest blocks. "
};

export const Contract = {
  LOADING:"Loading Contract Data",
  LOADING_LIST:"Loading Contract Data",
  EMPTY_DATA:"No Contracts found for:",
  EMPTY_DATA_LIST:"No Contracts found.", 
  EMPTY_DATA_LIST_ACC:"No Contracts Found Involving Account", 
  EMPTY_DATA_TITLE:"Contract Not Found",
  INVALID_DATA:"Contract Not Available",
  DATA_POLICY:"Showing results from the latest transactions. ",
  INVALID_DATA_LIST:"Invalid Input. Please try again."
};

export const Token = {
  TITLE:"Token",
  LOADING:"Loading Token Details",
  LOADING_LIST:"Loading Token Data",
  EMPTY_DATA:"Token Not Found",
  EMPTY_DATA_TITLE:"No Token",
  EMPTY_DATA_STR:"No Transaction found for descriptor: ",
  EMPTY_DATA_BY_ACCOUNT:"No tokens found involving account ",
  EMPTY_DATA_LIST:"No Tokens found.", 
  DATA_POLICY:"Showing results from the latest tokens. ",
  INVALID_DATA_TITLE:"No Token",
  INVALID_DATA:"Token Not Available",
  DATA_POLICY_TXN:"Showing results from the latest transactions. ",
  INVALID_DATA_LIST:"Invalid Input. Please try again.",
  GRANULARITY:"This is the Granularity"
};

export const Transaction = {
  LOADING:"Loading Transaction Details",
  LOADING_LIST:"Loading Transaction Data",
  EMPTY_DATA:"No Transaction found for descriptor: ",
  EMPTY_DATA_TITLE:"No Transactions",  
  EMPTY_DATA_LIST:"No transactions found for the last 30 days.", 
  EMPTY_DATA_LIST_TRN:"No internal transfers found.",
  EMPTY_DATA_LIST_ACC:"No Transactions Found Involving Account", 
  EMPTY_DATA_LIST_CNTR:"No Transactions Found Found For This Contract",  
  INVALID_DATA:"Syntax error: Invalid request structure.",
  INVALID_DATA_LIST:"Invalid Input. Please try again.",
  DATA_POLICY:"Showing results from the latest transactions. ",
  DATA_POLICY_CNTR:"Showing latest transactions for this contract.",
  DATA_POLICY_ACC:"Showing recent accounts which received transactions, over last 10,000 transactions.",
  DATA_POLICY_ACC_IN:"Showing recent accounts which received transactions, over last 10,000 transactions.",
  DATA_POLICY_ACC_OUT:"Showing recent accounts which sent transactions, over last 10,000 transactions.",
  DATA_POLICY_ACC_IN_EMPTY:"Showing recent accounts which received transactions, over last 10,000 transactions.",
  DATA_POLICY_ACC_OUT_EMPTY:"No outbound account activity in last 24 hours",
  
  DATA_POLICY_TRN:"Showing results from the latest transactions. "
  
};

export const Chart = {
  LOADING:"Loading Chart Details",  
  EMPTY_DATA:"No Data Available to Display Chart",    
  INVALID_DATA:"Error. Unable to Display Chart",
  DATA_POLICY:"Showing results from the latest transactions. "

};

export const Search = {
  LOADING:"Searching",
  LOADING_LIST:"Loading Results",
  EMPTY_DATA_TITLE:"Not Found",
  EMPTY_DATA:"No results found for: ",
  EMPTY_DATA_LIST:"No results found",  
  INVALID_DATA:"Invalid data",
  DATA_POLICY:"Showing results from the latest transactions. ",
  INVALID_DATA_LIST:"Invalid data. Please try again."
};

export const Paging = {
  LOADING:"Loading Details",
  LOADING_LIST:"Loading Data",
  EMPTY_DATA:"No result found for descriptor: ",
  EMPTY_DATA_LIST:"No data found.",  
  INVALID_DATA:"Syntax error. Data structure invalid.",
  DATA_POLICY:"Showing results from the latest transactions. ",
  INVALID_DATA_LIST:"Invalid response. Please try again."
};
export const Page = {
  LOADING:"Loading Page Details",
  LOADING_LIST:"Loading Page Data",
  EMPTY_DATA:"No data found for descriptor: ",
  EMPTY_DATA_LIST:"No data found.",  
  INVALID_DATA:"Syntax error: Invalid data structure.",
  DATA_POLICY:"Showing results from the latest transactions. ",
  INVALID_DATA_LIST:"Invalid Input. Please try again."
};

