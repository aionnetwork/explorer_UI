/* eslint-disable */
// entity ------------------------------------------------------------
import LocalizedStrings from 'react-localization';

//change language and save in local storage
export const setLanguage = (lng) => {
    strings.setLanguage(lng);
    localStorage.setItem('lng_mode', lng);
}

export const strings = new LocalizedStrings({
  
  en: {
  
    Header_title: "Dashboard 2.4",
    header_tab1: "Explorer",
    //views
    header_tab2: "Analytics",
    //graphs

    header_search_str: "",
    header_search_filter: "",

    landing_blocks_title: "RECENT BLOCKS",
    landing_transactions_title: "RECENT TRANSACTIONS",
    landing_view_link: "View all",
    landing_blocks_text_a: "Block #",
    landing_blocks_text_b: "Proposed by ",
    landing_blocks_text_c: "Transactions",
    landing_blocks_text_d: "in",
    landing_blocks_text_e: "To be proposed ",
    landing_blocks_text_f: "momentarily... ",

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
    kpi_block_desc: "Mean of inter-block arrival time over the last hour. The target block time for the network is 10s. PoW difficulty is dynamically adjusted to acheive target. ",
    kpi_hash_l1: "Network",
    kpi_hash_l2: "Hash Rate",
    kpi_hash_desc: "Network hash rate = (last block's difficulty) /(average block time over the last hour.)",

    kpi_difficulty_l1: "Average",
    kpi_difficulty_l2: "Difficulty",
    kpi_difficulty_desc: "Difficulty, averaged over the last hour.",
    kpi_NRG_l1: "Consumed",
    kpi_NRG_l2: "NRG / Block",
    kpi_NRG_desc: "Average NRG consumed per block for the last hour.",

    kpi_TXNPEAK_l1: "Txn",
    kpi_TXNPEAK_l2: "/ Second",
    kpi_TXNPEAK_desc: "Transactions per second, averaged over the last hour",
    kpi_TXNTIME_l1: "24 Hr Peak",
    kpi_TXNTIME_l2: "Txn / Block",
    kpi_TXNTIME_desc: "Peak number of transactions / block observed in last 24 hours",
    kpi_TXNCOUNT_l1: "24 Hr",
    kpi_TXNCOUNT_l2: "Txn Count",
    kpi_TXNCOUNT_desc: "Number of transactions observed in last 24 hours",

    //account related strings
    Acc_list_title: "Account Lists",
    Acc_list_desc: "Recent Account Statistics",
    Acc_list_tab1: "Validator",
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

    Acc_rich_col1: "Address",
    Acc_rich_col2: "Liquid balance",
    Acc_rich_col3: "Holdings (%)",
    Acc_rich_col4: "Nonce",
    Acc_rich_col5: "Holdings (%)",
    Acc_rich_col6: "Holdings (%)",

    Acc_detail_title: "Account",
    Acc_detail_row1: "Address",
    Acc_detail_row2: "Liquid balance",
    Acc_detail_row2_subtitle_a: "Balance Service Unavailable",
    Acc_detail_row2_subtitle_b: "as of block",
    Acc_detail_row3: "Transaction count",
    Acc_detail_row4: "Contract view",
    Acc_detail_row5: "Token balance",

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
     Blk_detail_row21: "Seal Type",
    
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
    Cntr_detail_row7: "Notice",
    Cntr_detail_row7_sub_a: "This is a special bridge contract. To learn more about it click",
    Cntr_detail_row7_sub_b: "here",

    Cntr_detail_tab1: "Transactions",
    Cntr_detail_tab2: "Events",
    Cntr_detail_tab2: "Logs",
    
    Cntr_detail_tab1_col1: "Block #",
    Cntr_detail_tab1_col2: "Timestamp",
    Cntr_detail_tab1_col3: "Value",
    Cntr_detail_tab1_col4: "Transaction Hash",
    Cntr_detail_tab1_col5: "From Address",
    Cntr_detail_tab1_col6: "Status",
    Cntr_detail_tab1_col7: "To Address",

    Cntr_detail_tab2_col1: "Block #",
    Cntr_detail_tab2_col2: "Event",
    Cntr_detail_tab2_col3: "Event timestamp",

    Cntr_detail_tab3_col1: "Block #",
    Cntr_detail_tab3_col2: "Transaction Hash",
    Cntr_detail_tab3_col3: "LogIndex",
    Cntr_detail_tab3_col4: "Timestamp",

    //Tokens
    Tkn_list_title: "Tokens",
    Tkn_list_desc: "Total Tokens",
    Tkn_head_text_a: " Total Tokens",

    Tkn_list_col1: "Token",
    Tkn_list_col2: "Granularity",
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
    Txn_list_desc: "Recent Transactions",

    Txn_list_col1: "Block #",
    Txn_list_col2: "Timestamp",
    Txn_list_col3: "Value",
    Txn_list_col4: "Transaction Hash",
    Txn_list_col5: "From Address",
    Txn_list_col6: "Status",
    Txn_list_col7: "To Address",
    Txn_list_col8: "Raw Value",

    Txn_rt_list_col1: "Age",
    Txn_rt_list_col2: "Value",
    Txn_rt_list_col3: "Transaction Hash",
    Txn_rt_list_col4: "From Address",
    Txn_rt_list_col5: "To Address",

    Txn_trn_list_col1: "Block #",
    Txn_trn_list_col2: "Timestamp",
    Txn_trn_list_col3: "Value",
    Txn_trn_list_col4: "Transaction Hash",
    Txn_trn_list_col5: "From Address",
    Txn_trn_list_col6: "To Address",
    Txn_trn_list_own: "own account",
    Txn_own: "own account",

    Txn_event_log_col1: "Logs",

    Txn_list_own_col1: "Block #",
    Txn_list_own_col2: "Timestamp",
    Txn_list_own_col3: "Value",
    Txn_list_own_col4: "Transaction Hash",
    Txn_list_own_col5: "From Address",
    Txn_list_own_col6: "To Address",

    Txn_list_own_token_col1: "Block #",
    Txn_list_own_token_col3: "Timestamp",
    Txn_list_own_token_col4: "Value",
    Txn_list_own_token_col5: "Raw Value",
    Txn_list_own_token_col6: "Transaction Hash",
    Txn_list_own_token_col7: "From Address",
    Txn_list_own_token_col8: "To Address",

    Txn_list_own_trn_col1: "Block #",
    Txn_list_own_trn_col2: "Timestamp",
    Txn_list_own_trn_col3: "Value",
    Txn_list_own_trn_col4: "Raw Value",
    Txn_list_own_trn_col5: "Transaction Hash",
    Txn_list_own_trn_col6: "From Address",
    Txn_list_own_trn_col7: "To Address",
    Txn_list_own_trn_col8: "Status",
    Txn_list_own_trn_col9: "Type",
    Txn_list_own_trn_col10: "Nonce",

    Txn_detail_title: "Transaction",
    Txn_detail_row1: "Time Sealed",
    Txn_detail_row2: "Coin",
    Txn_detail_row2_desc: "native",
    Txn_detail_row2_alt1: "Token",
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
    Txn_detail_row12_sub_a: "Contract Creation",
    Txn_detail_row13: "Txn Logs",
    Txn_detail_row14: "Input Data",
    Txn_detail_row14_sub_a: "Copy",
    Txn_detail_row14_sub_b: "No Input Data",

    Txn_detail_row15: "NRG Limit",
    Txn_detail_row16: "Type",
    Txn_detail_row17: "Data",
    Txn_detail_row17_sub_a: "Copy",
    Txn_detail_row17_sub_b: "No Data",
    Txn_detail_row18: "Transaction Count",

    Txn_detail_tab1: "Transfers",
    
    Txn_detail_tab1_col1: "",
    Txn_detail_tab1_col2: "",
    Txn_detail_tab1_col3: "",
    Txn_detail_tab1_col4: "",
    Txn_detail_tab1_col5: "",
    Txn_detail_tab1_col6: "",
    Txn_detail_tab1_col7: "",

    //graphs
    Chart_1_title: 'Active Address Growth',
    Chart_1_subtitle_a: 'Click and drag in the plot area to zoom in',
    Chart_1_subtitle_b: 'Pinch the chart to zoom in',
    Chart_1_y_title: 'Address total',
    Chart_1_series_title: 'Total No of Addresses',

    Chart_2_title: 'Block Times Chart',
    Chart_2_subtitle_a: 'Click and drag in the plot area to zoom in',
    Chart_2_subtitle_b: 'Pinch the chart to zoom in',
    Chart_2_y_title: 'Block time (seconds) ',
    Chart_2_series_title: 'Block Times Chart',

    Chart_3_title: 'Hash Power Chart',
    Chart_3_subtitle_a: 'Click and drag in the plot area to zoom in',
    Chart_3_subtitle_b: 'Pinch the chart to zoom in',
    Chart_3_y_title: 'Hash Power  (sols/sec)',
    Chart_3_series_title: 'Hashpower (sols/sec)',

    Chart_4_title: 'Network Difficulty Chart',
    Chart_4_subtitle_a: 'Click and drag in the plot area to zoom in',
    Chart_4_subtitle_b: 'Pinch the chart to zoom in',
    Chart_4_y_title: 'Difficulty',
    Chart_4_series_title: 'Network Difficulty',

    Chart_5_title: 'Top Miners For The Past 7 days',
    Chart_5_series_title: 'Mined Blocks',

    Chart_6_title: 'Transaction per Hour',
    Chart_6_subtitle_a: 'Click and drag in the plot area to zoom in',
    Chart_6_subtitle_b: 'Pinch the chart to zoom in',
    Chart_6_y_title: 'Transactions)',
    Chart_6_series_title: 'Transactions per Hour',

    //metric menu
    Metric_menu_item_1: "Active Address",
    Metric_menu_item_2: "Block Times",
    Metric_menu_item_2_a: "PoS",
    Metric_menu_item_2_b: "PoW",
    Metric_menu_item_3: "Hash Power",
    Metric_menu_item_4: "Difficulty",
    Metric_menu_item_4_a: "PoS",
    Metric_menu_item_4_b: "PoW",
    Metric_menu_item_5: "Top Miners",
    Metric_menu_item_6: "Transactions per Hour",

    //Explorer menu
    Explorer_menu_item_1: "Accounts",
    Explorer_menu_item_2: "Blocks",
    Explorer_menu_item_3: "Contracts",
    Explorer_menu_item_4: "Tokens",
    Explorer_menu_item_5: "Transactions",
    //Connection menu
    Connection_menu_item_1: "Switch Network",
    Connection_menu_item_2: "Explorer Settings",
    Connection_menu_item_3: "Dark Mode",
    Connection_menu_item_4: "Language",
    //Mobile menu
    Mobile_menu_item_1: "Explorer",
    Mobile_menu_item_2: "Analytics",
    Mobile_menu_item_3: "Switch Network",
    //Liveliness display
    Live_str_1: "Latest block",
    Live_str_2: "observed at",
    //search
    Search_placeholder: 'Search for Account / Block / Contract / Transaction / Token',
    Search_filter: "Filter By  ",
    //pagination
    date_filter_policy: "This filter is only available for 7 days intervals.",
    pag_str_1: "Showing",
    pag_str_2: "of",
    pag_str_3: " for 30 days or selected range",
    pag_str_4: "  for 365 days",
    pag_str_5: " found",

    pag_str_6:"First page",
    pag_str_7: "Prev",
    pag_str_8: "Page",
    pag_str_9: "Next",
    pag_str_10: "Last page",
    pag_str_11: "Page size",

    //utils such as paging and misc strings
    time_r: "Retrieved",
    empty_string: "Not Available",
    not_contract: "Not a Contract",

    dialog_title:"Event logs",
    dialog_subtitle_1:"Logs",
    dialog_subtitle_2:"Inputs",

    no_match_title: "Oops ... Page Not Found",
    no_match_description: "You've found a page that doesn't exist.",
    non_ideal_state_home_link_text: "Navigate Home",

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

    si_prefix_msg: "This value may be displayed with SI unit prefix",
    
    //breadcrumbs
    bread:"Home",
    bread_slice: { 
      blk: "Blocks",
      acc: "Accounts",
      txn: "Transactions",
      tkn: "Tokens",
      cntr: "Contracts",
    },
    bread_crumb: {
      blk: "Block detail",
      acc: "Account detail",
      txn: "Transaction detail",
      tkn: "Token detail",
      cntr: "Contract detail",
    },

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
      GRANULARITY:"This is the increments by which a token can be sent. Example: If the granularity is 1 the token can be sent in multiples of 1."
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


  },
  zh: {
    test:"this is the test string in english",
    kpi_block_l1: "Churrent",
    kpi_block_l2: "Block Time",
  },
});

//export const spanish = T.translate(strings.en,).then(function(data){return data;}).catch(function(error){console.log(error);});
export const language = strings.getLanguage();

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
  GRANULARITY:"This is the increments by which a token can be sent. Example: If the granularity is 1 the token can be sent in multiples of 1."
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

