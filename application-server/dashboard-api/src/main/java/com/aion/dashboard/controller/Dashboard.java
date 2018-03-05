package com.aion.dashboard.controller;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aion.dashboard.config.Config;
import com.aion.dashboard.entities.Account;
import com.aion.dashboard.entities.Block;
import com.aion.dashboard.entities.LastBlockRead;
import com.aion.dashboard.entities.Transaction;
import com.aion.dashboard.repository.AccountJpaRepository;
import com.aion.dashboard.repository.BlockJpaRepository;
import com.aion.dashboard.repository.LastBlockReadJpaRepository;
import com.aion.dashboard.repository.TransactionJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

@RestController
@RequestMapping("/dashboard")
public class Dashboard {

	@Autowired
	private BlockJpaRepository blockJpaRepository;

	@Autowired
	private TransactionJpaRepository transactionJpaRepository;

	@Autowired
	private AccountJpaRepository accountJpaRepository;
	
	@Autowired
	private LastBlockReadJpaRepository lastBlockReadJpaRepository;

	@Autowired
	private SimpMessagingTemplate brokerMessagingTemplate;

	@RequestMapping(value = "/search", method = RequestMethod.GET)
	public String search(@RequestParam(value="searchParam",required=false) String searchParam) {
		try {			
			if(searchParam != null) {
				if(searchParam.trim().isEmpty()) {
					return "{}";
				}else {
					ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

					if(searchParam.startsWith("0x"))
						searchParam = searchParam.replace("0x", "");

					// find in transaction hash list
					List<Transaction> transactionList = transactionJpaRepository.findByTransactionHash(searchParam);
					JSONArray jsonArray = new JSONArray();
					if(transactionList!=null && transactionList.size()>0) {
						Transaction transaction = transactionList.get(0);
						JSONObject result = new JSONObject(ow.writeValueAsString(transaction));
						jsonArray.put(result);
						return new JSONObject().put("content",jsonArray).put("entityType", "transaction").toString();
					}

					// find in block hash list or block number list
					List<Block> blockList = blockJpaRepository.findByBlockHash(searchParam);
					if(blockList!=null && blockList.size()>0) {
						Block block = blockList.get(0);
						JSONObject result = new JSONObject(ow.writeValueAsString(block));
						jsonArray.put(result);
						return new JSONObject().put("content",jsonArray).put("entityType", "block").toString();
					}

					// find in address list
					String addressSearch = searchParam;
					if(searchParam.trim().equals("0"))
						addressSearch = "0000000000000000000000000000000000000000000000000000000000000000";
					List<Account> accountList = accountJpaRepository.findByAddr(addressSearch);
					if(accountList!=null && accountList.size()>0) {
						Account account = accountList.get(0);
						JSONObject result = new JSONObject(ow.writeValueAsString(account));
						jsonArray.put(result);
						return new JSONObject().put("content",jsonArray).put("entityType", "account").toString();
					}

					// find in block number list
					if(validLong(searchParam)) {
						List<Block> blockLists = blockJpaRepository.findByBlockNumber(Long.parseLong(searchParam));
						if(blockLists!=null && blockLists.size()>0) {
							Block block = blockLists.get(0);
							JSONObject result = new JSONObject(ow.writeValueAsString(block));
							jsonArray.put(result);
							return new JSONObject().put("content",jsonArray).put("entityType", "block").toString();
						}
					}

					// empty object if no result found
					jsonArray.put(new JSONObject().put("rel", JSONObject.NULL));
					return new JSONObject().put("content",jsonArray).put("entityType", "").toString();
				}
			}else {
				return new JSONObject().put("result", "missing search param").toString();
			}

		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}
	}

	@RequestMapping(value = "/findByBlockNumberOrBlockHash", method = RequestMethod.GET)
	public String findByBlockNumberOrBlockHash(@RequestParam(value="searchParam",required=false) String searchParam) {
		try {			
			if(searchParam != null) {
				if(searchParam.trim().isEmpty()) {
					return "{}";
				}else {
					ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

					// find in block hash list or block number list
					if(searchParam.startsWith("0x"))
						searchParam = searchParam.replace("0x", "");
					List<Block> blockList = blockJpaRepository.findByBlockHash(searchParam);
					JSONArray blockArray = new JSONArray();
					if(blockList!=null && blockList.size()>0) {
						Block block = blockList.get(0);
						JSONObject result = new JSONObject(ow.writeValueAsString(block));
						blockArray.put(result);
						return new JSONObject().put("content", blockArray).toString();
					}

					// find in block number list
					if(validLong(searchParam)) {
						List<Block> blockLists = blockJpaRepository.findByBlockNumber(Long.parseLong(searchParam));
						if(blockLists!=null && blockLists.size()>0) {
							Block block = blockLists.get(0);
							JSONObject result = new JSONObject(ow.writeValueAsString(block));
							blockArray.put(result);
							return new JSONObject().put("content", blockArray).toString();
						}
					}

					// empty object if no result found
					blockArray.put(new JSONObject().put("rel", JSONObject.NULL));
					return new JSONObject().put("content", blockArray).toString();
				}
			}else {
				return new JSONObject().put("result", "missing search param").toString();
			}

		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}
	}

	@RequestMapping(value = "/findByTransactionHash", method = RequestMethod.GET)
	public String findByTransactionHash(@RequestParam(value="searchParam",required=false) String searchParam) {
		try {			
			if(searchParam != null) {
				if(searchParam.trim().isEmpty()) {
					return "{}";
				}else {
					ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

					// find in block hash list or block number list
					if(searchParam.startsWith("0x"))
						searchParam = searchParam.replace("0x", "");
					List<Transaction> transactionList = transactionJpaRepository.findByTransactionHash(searchParam);
					JSONArray jsonArray = new JSONArray();
					if(transactionList!=null && transactionList.size()>0) {
						Transaction transaction = transactionList.get(0);
						JSONObject result = new JSONObject(ow.writeValueAsString(transaction));
						jsonArray.put(result);
						return new JSONObject().put("content", jsonArray).toString();
					}

					// empty object if no result found
					jsonArray.put(new JSONObject().put("rel",  JSONObject.NULL));
					return new JSONObject().put("content", jsonArray).toString();
				}
			}else {
				return new JSONObject().put("message", "missing search param").toString();
			}

		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}
	}

	@RequestMapping(value = "/getBlockAndTransactionDetailsFromBlockNumberOrBlockHash", method = RequestMethod.GET)
	public String getBlock(@RequestParam(value="searchParam",required=false) String searchParam,@RequestParam(value="transactionPageSize",required=false) String transactionPageSize, @RequestParam(value="transactionPageNumber",required=false) String transactionPageNumber, @RequestParam(value="transactionSort",required=false) String transactionSort) {
		try {
			if(searchParam==null)
				throw new Exception();

			if(searchParam.startsWith("0x"))
				searchParam = searchParam.replace("0x", "");

			int txnPageSize=20;
			int txnPageNumber = 0;

			if(transactionPageSize != null && validInt(transactionPageSize))
				txnPageSize = Integer.parseInt(transactionPageSize);

			if(transactionPageNumber != null && validInt(transactionPageNumber))
				txnPageNumber = Integer.parseInt(transactionPageNumber);

			ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
			JSONObject blockObject = new JSONObject();

			// find in block number list
			boolean blockNumberfound = false;
			if(validLong(searchParam)) {
				List<Block> blockLists = blockJpaRepository.findByBlockNumber(Long.parseLong(searchParam));
				JSONArray blockArray = new JSONArray();
				if(blockLists!=null && blockLists.size()>0) {
					Block block = blockLists.get(0);
					JSONObject result = new JSONObject(ow.writeValueAsString(block));
					blockArray.put(result);
					blockObject.put("content", blockArray).toString();
					blockNumberfound = true;
				}
			}

			// find in blockHash
			if(!blockNumberfound) {
				List<Block> blockLists = blockJpaRepository.findByBlockHash(searchParam);
				JSONArray blockArray = new JSONArray();
				if(blockLists!=null && blockLists.size()>0) {
					Block block = blockLists.get(0);
					JSONObject result = new JSONObject(ow.writeValueAsString(block));
					blockArray.put(result);
					blockObject.put("content", blockArray).toString();
				}else {
					// empty content
					blockArray.put(new JSONObject().put("rel",  JSONObject.NULL));
					blockObject.put("content", blockArray).toString();
				}
			}

			// sorting for transactions
			Sort sort = new Sort(Sort.Direction.DESC, "blockNumber");
			String transactionColumnName = null;
			String sorting = "";
			if(transactionSort!=null) {
				if(transactionSort.contains(",")) {
					String[] spl = transactionSort.split(",");
					sorting = spl[1];
					transactionColumnName = spl[0];
				}else {
					transactionColumnName = transactionSort;
				}
				if(transactionColumnName!=null){
					if(sorting.equalsIgnoreCase("asc"))
						sort = new Sort(Sort.Direction.ASC, transactionColumnName);
					else
						sort = new Sort(Sort.Direction.DESC, transactionColumnName);
				}
			}

			// find in block number list
			Page<Transaction> transactions; 
			if(blockNumberfound)
				transactions = transactionJpaRepository.findByBlockNumber(Long.parseLong(searchParam),new PageRequest(txnPageNumber, txnPageSize,sort));
			else
				transactions = transactionJpaRepository.findByBlockHash(searchParam,new PageRequest(txnPageNumber, txnPageSize,sort));

			List<Transaction> transactionList = transactions.getContent();
			JSONArray transactionArray = new JSONArray();
			JSONObject transactionObject = new JSONObject();
			if(transactionList!=null && transactionList.size()>0) {
				for(int i=0;i<transactionList.size();i++) {
					Transaction transaction = transactionList.get(i);
					JSONObject result = new JSONObject(ow.writeValueAsString(transaction));
					transactionArray.put(result);
				}

				transactionObject.put("content", transactionArray).toString();
			}else {
				// empty content
				transactionArray.put(new JSONObject().put("rel",  JSONObject.NULL));
				transactionObject.put("content", transactionArray).toString();
			}

			JSONObject pageObject = new JSONObject();
			pageObject.put("totalElements", transactions.getTotalElements());
			pageObject.put("totalPages", transactions.getTotalPages());
			pageObject.put("number", txnPageNumber);
			pageObject.put("size", txnPageSize);
			transactionObject.put("page", pageObject);

			JSONObject jsonObject = new JSONObject();
			jsonObject.put("blockDetails",blockObject);
			jsonObject.put("transactionDetails",transactionObject);

			return jsonObject.toString();


		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}

	}

	@RequestMapping(value = "/findTransactionByBlockNumberOrBlockHash", method = RequestMethod.GET)
	public String findTransactionByBlockNumberOrBlockHash(@RequestParam(value="searchParam",required=false) String searchParam,@RequestParam(value="transactionPageSize",required=false) String transactionPageSize, @RequestParam(value="transactionPageNumber",required=false) String transactionPageNumber, @RequestParam(value="transactionSort",required=false) String transactionSort) {
		try {
			if(searchParam==null)
				throw new Exception();

			if(searchParam.startsWith("0x"))
				searchParam = searchParam.replace("0x", "");

			int txnPageSize=20;
			int txnPageNumber = 0;

			if(transactionPageSize != null && validInt(transactionPageSize))
				txnPageSize = Integer.parseInt(transactionPageSize);

			if(transactionPageNumber != null && validInt(transactionPageNumber))
				txnPageNumber = Integer.parseInt(transactionPageNumber);

			ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

			// find in block number list
			boolean blockNumberfound = false;
			if(validLong(searchParam)) {
				List<Block> blockLists = blockJpaRepository.findByBlockNumber(Long.parseLong(searchParam));
				if(blockLists!=null && blockLists.size()>0) {
					blockNumberfound = true;
				}
			}

			// sorting for transactions
			Sort sort = new Sort(Sort.Direction.DESC, "blockNumber");
			String transactionColumnName = null;
			String sorting = "";
			if(transactionSort!=null) {
				if(transactionSort.contains(",")) {
					String[] spl = transactionSort.split(",");
					sorting = spl[1];
					transactionColumnName = spl[0];
				}else {
					transactionColumnName = transactionSort;
				}
				if(transactionColumnName!=null){
					if(sorting.equalsIgnoreCase("asc"))
						sort = new Sort(Sort.Direction.ASC, transactionColumnName);
					else
						sort = new Sort(Sort.Direction.DESC, transactionColumnName);
				}
			}

			// find in block number list
			Page<Transaction> transactions; 
			if(blockNumberfound)
				transactions = transactionJpaRepository.findByBlockNumber(Long.parseLong(searchParam),new PageRequest(txnPageNumber, txnPageSize,sort));
			else
				transactions = transactionJpaRepository.findByBlockHash(searchParam,new PageRequest(txnPageNumber, txnPageSize,sort));

			List<Transaction> transactionList = transactions.getContent();
			JSONArray transactionArray = new JSONArray();
			JSONObject transactionObject = new JSONObject();
			if(transactionList!=null && transactionList.size()>0) {
				for(int i=0;i<transactionList.size();i++) {
					Transaction transaction = transactionList.get(i);
					JSONObject result = new JSONObject(ow.writeValueAsString(transaction));
					transactionArray.put(result);
				}

				transactionObject.put("content", transactionArray).toString();

			}else {
				// empty content
				transactionArray.put(new JSONObject().put("rel",  JSONObject.NULL));
				transactionObject.put("content", transactionArray).toString();
			}

			JSONObject pageObject = new JSONObject();
			pageObject.put("totalElements", transactions.getTotalElements());
			pageObject.put("totalPages", transactions.getTotalPages());
			pageObject.put("number", txnPageNumber);
			pageObject.put("size", txnPageSize);
			transactionObject.put("page", pageObject);

			return transactionObject.toString();


		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}

	}

	@RequestMapping(value = "/getBlockAndTransactionDetailsFromAccount", method = RequestMethod.GET)
	public String getAccount(@RequestParam(value="accountAddress",required=false) String accountAddress,@RequestParam(value="transactionPageSize",required=false) String transactionPageSize, @RequestParam(value="transactionPageNumber",required=false) String transactionPageNumber,@RequestParam(value="blockPageSize",required=false) String blockPageSize, @RequestParam(value="blockPageNumber",required=false) String blockPageNumber,@RequestParam(value="transactionSort",required=false) String transactionSort, @RequestParam(value="blockSort",required=false) String blockSort) {
		try {
			if(accountAddress==null)
				throw new Exception();

			if(accountAddress.startsWith("0x"))
				accountAddress = accountAddress.replace("0x", "");

			if(accountAddress.trim().equals("0"))
				accountAddress = "0000000000000000000000000000000000000000000000000000000000000000";

			int txnPageSize=20;
			int txnPageNumber = 0;
			int blkPageSize = 20;
			int blkPageNumber = 0;

			if(transactionPageSize != null && validInt(transactionPageSize))
				txnPageSize = Integer.parseInt(transactionPageSize);

			if(transactionPageNumber != null && validInt(transactionPageNumber))
				txnPageNumber = Integer.parseInt(transactionPageNumber);

			if(blockPageSize != null && validInt(blockPageSize))
				blkPageSize = Integer.parseInt(blockPageSize);

			if(blockPageNumber != null && validInt(blockPageNumber))
				blkPageNumber = Integer.parseInt(blockPageNumber);

			// find in account number list
			List<Account> accountList = accountJpaRepository.findByAddr(accountAddress);
			ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
			JSONArray accountArray = new JSONArray();
			JSONObject accountObject = new JSONObject();
			if(accountList!=null && accountList.size()>0) {
				Account account = accountList.get(0);
				JSONObject result = new JSONObject(ow.writeValueAsString(account));
				accountArray.put(result);
				accountObject.put("content", accountArray).toString();
			}else {
				// empty content
				accountArray.put(new JSONObject().put("rel",  JSONObject.NULL));
				accountObject.put("content", accountArray).toString();
			}

			// sorting for transactions
			Sort sort = new Sort(Sort.Direction.DESC, "blockNumber");
			String transactionColumnName = null;
			String sorting = "";
			if(transactionSort!=null) {
				if(transactionSort.contains(",")) {
					String[] spl = transactionSort.split(",");
					sorting = spl[1];
					transactionColumnName = spl[0];
				}else {
					transactionColumnName = transactionSort;
				}
				if(transactionColumnName!=null){
					if(sorting.equalsIgnoreCase("asc"))
						sort = new Sort(Sort.Direction.ASC, transactionColumnName);
					else
						sort = new Sort(Sort.Direction.DESC, transactionColumnName);
				}
			}

			// find in account list for transactions
			Page<Transaction> transactions = transactionJpaRepository.findByFromAddrOrToAddr(accountAddress,accountAddress,new PageRequest(txnPageNumber, txnPageSize,sort));
			List<Transaction> transactionList = transactions.getContent();

			JSONArray transactionArray = new JSONArray();
			JSONObject transactionObject = new JSONObject();
			if(transactionList!=null && transactionList.size()>0) {
				for(int i=0;i<transactionList.size();i++) {
					Transaction transaction = transactionList.get(i);
					JSONObject result = new JSONObject(ow.writeValueAsString(transaction));
					transactionArray.put(result);
				}

				transactionObject.put("content", transactionArray).toString();
			}else {
				// empty content
				transactionArray.put(new JSONObject().put("rel",  JSONObject.NULL));
				transactionObject.put("content", transactionArray).toString();
			}

			JSONObject pageObject = new JSONObject();
			pageObject.put("totalElements", transactions.getTotalElements());
			pageObject.put("totalPages", transactions.getTotalPages());
			pageObject.put("number", txnPageNumber);
			pageObject.put("size", txnPageSize);
			transactionObject.put("page", pageObject);

			// sorting for blocks
			sort = new Sort(Sort.Direction.DESC, "blockNumber");
			String blockColumnName = null;
			sorting = "";
			if(blockSort!=null) {
				if(blockSort.contains(",")) {
					String[] spl = blockSort.split(",");
					sorting = spl[1];
					blockColumnName = spl[0];
				}else {
					blockColumnName = blockSort;
				}
				if(blockColumnName!=null){
					if(sorting.equalsIgnoreCase("asc"))
						sort = new Sort(Sort.Direction.ASC, blockColumnName);
					else
						sort = new Sort(Sort.Direction.DESC, blockColumnName);
				}
			}

			// find in account list for mined blocks
			Page<Block> blocks = blockJpaRepository.findByMinerAddress(accountAddress,new PageRequest(blkPageNumber, blkPageSize,sort));
			List<Block> blockList = blocks.getContent();

			JSONArray blockArray = new JSONArray();
			JSONObject blockObject = new JSONObject();
			if(blockList!=null && blockList.size()>0) {
				for(int i=0;i<blockList.size();i++) {
					Block block = blockList.get(i);
					JSONObject result = new JSONObject(ow.writeValueAsString(block));
					blockArray.put(result);
				}

				blockObject.put("content", blockArray).toString();
			}else {
				// empty content
				blockArray.put(new JSONObject().put("rel",  JSONObject.NULL));
				blockObject.put("content", blockArray).toString();
			}

			pageObject = new JSONObject();
			pageObject.put("totalElements", blocks.getTotalElements());
			pageObject.put("totalPages", blocks.getTotalPages());
			pageObject.put("number", blkPageNumber);
			pageObject.put("size", blkPageSize);
			blockObject.put("page", pageObject);

			JSONObject jsonObject = new JSONObject();
			jsonObject.put("accountDetails",accountObject);
			jsonObject.put("transactionDetails",transactionObject);
			jsonObject.put("blockDetails",blockObject);

			return jsonObject.toString();


		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}

	}

	@RequestMapping(value = "/findByAccountAddress", method = RequestMethod.GET)
	public String findByAccountAddress(@RequestParam(value="searchParam",required=false) String searchParam) {
		try {			
			if(searchParam != null) {
				if(searchParam.trim().isEmpty()) {
					return "{}";
				}else {
					ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

					// find in block hash list or block number list
					if(searchParam.startsWith("0x"))
						searchParam = searchParam.replace("0x", "");

					String addressSearch = searchParam;
					if(searchParam.trim().equals("0"))
						addressSearch = "0000000000000000000000000000000000000000000000000000000000000000";
					List<Account> accountList = accountJpaRepository.findByAddr(addressSearch);
					JSONArray jsonArray = new JSONArray();
					if(accountList!=null && accountList.size()>0) {
						Account account = accountList.get(0);
						JSONObject result = new JSONObject(ow.writeValueAsString(account));
						jsonArray.put(result);
						return new JSONObject().put("content", jsonArray).toString();
					}

					// empty object if no result found
					jsonArray.put(new JSONObject().put("rel",  JSONObject.NULL));
					return new JSONObject().put("content", jsonArray).toString();
				}
			}else {
				return new JSONObject().put("message", "missing search param").toString();
			}

		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}
	}


	@RequestMapping(value = "/view", method = RequestMethod.GET)
	public String viewDashboard() {
		try {

			ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
			JSONObject result = new JSONObject();
			Config config = Config.getConfig();
			int cacheWindowSize = Integer.parseInt(config.getLatestBlockTransactionWindowSize());
			int blockAverageWindowSize = Integer.parseInt(config.getBlockAverageWindow());

			// populate recent n blocks
			List<Block> blockList = blockJpaRepository.findTop8640ByOrderByIdDesc();
			JSONArray blockArray = new JSONArray();
			if(blockList!=null && blockList.size()>0) {
				for(int i=0;i<blockList.size() && i<cacheWindowSize;i++) {
					Block block = blockList.get(i);
					blockArray.put(new JSONObject(ow.writeValueAsString(block)));
				}
			}

			// populate recent n transactions
			List<Transaction> transactionList = transactionJpaRepository.findTop10ByOrderByIdDesc();
			JSONArray transactionArray = new JSONArray();
			if(transactionList!=null && transactionList.size()>0) {
				for(int i=0;i<transactionList.size() && i<cacheWindowSize;i++) {
					Transaction transaction = transactionList.get(i);
					transactionArray.put(new JSONObject(ow.writeValueAsString(transaction)));
				}
			}

			// find kpi parameters
			double averageDifficulty = 0 ;
			double averageBlockTime = 0;
			double transactionPerSecond = 0;
			double hashRate = 0;
			double totalTransactions = 0;
			double totalTime = 0;
			double lastBlockReward = 0;
			long totalTransactionsInLast24hours = 0;
			long peakTransactionsPerBlockInLast24hours = 0;
			double averageEnergyPrice = 0;
			double averageEnergyConsumed = 0;
			long startBlock = 0;
			long endBlock = 0;
			long startTimestamp = 0;
			long endTimestamp = 0;
			long currentBlockchainHead = 0;

			// kpi's for recent block averaging window
			if(blockList!=null && blockList.size()>0) {
				int size = min(blockAverageWindowSize,blockList.size());
				for(int i=0;i<size;i++) {
					Block block = blockList.get(i);
					averageDifficulty += block.getDifficulty();
					totalTransactions += (double)block.getNumTransactions();
					averageBlockTime += (double)(block.getBlockTime());

				}
				averageDifficulty = averageDifficulty/size;
				averageBlockTime = averageBlockTime/size;
				hashRate = blockList.get(0).getDifficulty()/averageBlockTime;
				totalTime = (double)(blockList.get(0).getTimestampVal()-blockList.get(size-1).getTimestampVal());
				transactionPerSecond = totalTransactions/totalTime;
				lastBlockReward = blockList.get(0).getBlockReward();
				endBlock = blockList.get(0).getBlockNumber();
				endTimestamp = blockList.get(0).getTimestampVal();
				startBlock = blockList.get(size-1).getBlockNumber();
				startTimestamp = blockList.get(size).getTimestampVal();
			}

			// kpi's for transactions
			List<Transaction> transactionKpaList = transactionJpaRepository.findTop128ByOrderByIdDesc();
			if(transactionKpaList!=null && transactionKpaList.size()>0) {
				int transactionSize = transactionKpaList.size();
				for(int i=0;i<transactionSize;i++) {
					Transaction transaction = transactionKpaList.get(i);
					averageEnergyConsumed += transaction.getNrgConsumed();
					averageEnergyPrice += transaction.getNrgPrice();
				}
				averageEnergyConsumed = averageEnergyConsumed/transactionSize;
				averageEnergyPrice = averageEnergyPrice/transactionSize;
			}

			// kpi's for recent block in a day
			if(blockList!=null && blockList.size()>0) {
				int size = blockList.size();
				for(int i=0;i<size;i++) {
					long numTransactions = blockList.get(i).getNumTransactions();
					totalTransactionsInLast24hours += numTransactions;
					if(peakTransactionsPerBlockInLast24hours < numTransactions) {
						peakTransactionsPerBlockInLast24hours = numTransactions;
					}
				}
			}
			
			LastBlockRead lastBlockRead = lastBlockReadJpaRepository.findById(2);
			if(lastBlockRead!=null)
				currentBlockchainHead = lastBlockRead.getBlockNumber();

			JSONObject kpi = new JSONObject();
			kpi.put("averageDifficulty", averageDifficulty);
			kpi.put("averageBlockTime", averageBlockTime);
			kpi.put("hashRate", hashRate);
			kpi.put("transactionPerSecond", transactionPerSecond);
			kpi.put("lastBlockReward", lastBlockReward);
			kpi.put("totalTransactionsInLast24hours", totalTransactionsInLast24hours);
			kpi.put("peakTransactionsPerBlockInLast24hours", peakTransactionsPerBlockInLast24hours);
			kpi.put("averageEnergyPrice", averageEnergyPrice);
			kpi.put("averageEnergyConsumed", averageEnergyConsumed);
			kpi.put("targetBlockTime", 10);
			kpi.put("startBlock", startBlock);
			kpi.put("endBlock", endBlock);
			kpi.put("startTimestamp", startTimestamp);
			kpi.put("endTimestamp", endTimestamp);
			kpi.put("currentBlockchainHead", currentBlockchainHead);

			result.put("kpi", kpi);
			result.put("blockList", blockArray);
			result.put("transactionList", transactionArray);


			JSONArray jsonArray = new JSONArray();
			jsonArray.put(result);



			return new JSONObject().put("content",jsonArray).toString();

		}catch(Exception e) {
			e.printStackTrace();
			JSONObject result = new JSONObject();
			result.put("message", "Error: Invalid Request");
			return result.toString();
		}
	}

	@RequestMapping(value = "/newBlockReceived", method = RequestMethod.POST)
	public void receivedNewBlockDashboard() {
		this.brokerMessagingTemplate.convertAndSend("/dashboard/view", viewDashboard());
	}

	public boolean validLong(String searchParam) {
		try {
			long blockNumber = Long.parseLong(searchParam);
			return true;
		}catch(Exception e) {
			return false;
		}
	}

	public boolean validInt(String searchParam) {
		try {
			int param = Integer.parseInt(searchParam);
			return true;
		}catch(Exception e) {
			return false;
		}
	}

	public int min(int a, int b) {
		if(a<b)
			return a;
		else
			return b;
	}

}



