import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.aion.api.IAionAPI;
import org.aion.api.IContract;
import org.aion.api.sol.IUint;
import org.aion.api.type.ApiMsg;
import org.aion.api.type.BlockDetails;
import org.aion.api.type.TxDetails;
import org.aion.api.type.TxLog;
import org.aion.base.type.Address;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AionService {

	private static AionService aionService;
	ApiMsg apiMsg;
	IAionAPI aionApi;
	Config config;
	DbHelper dbHelper;
	String nodeUrl;

	// constructor
	public AionService(String nodeLink) {
		config = Config.getConfig();
		aionApi = IAionAPI.init();
		apiMsg = new ApiMsg();
		nodeUrl = nodeLink;
		
		// connect to aion
		System.out.println("link "+nodeLink);
		apiMsg.set(aionApi.connect(nodeLink));
		if (apiMsg.isError()){
			System.out.println("Aion api connection could not be established.");
			closeApi();
		}

	}

	// node url
	public String getNodeUrl() {
		return nodeUrl;
	}

	// connection
	public boolean isConnected() {
		if(aionApi == null)
			return false;
		return aionApi.isConnected();
	}

	// get balance
	public String getBalance(String address) {
		apiMsg = aionApi.getChain().getBalance(Address.wrap(address));
		if (apiMsg.isError()) {
			System.out.println("" + apiMsg.getErrString());
			return null;
		}
		return String.valueOf((BigInteger)apiMsg.getObject());
	}

	// get block detail by range
	public JSONObject getBlockDetail(String blockNumber) {
		apiMsg = aionApi.getAdmin().getBlockDetailsByNumber(blockNumber);
		if (apiMsg.isError()) {
			System.out.println("" + apiMsg.getErrString());
			return null;
		}
		List<BlockDetails> blockDetailsList = apiMsg.getObject();
		try {
			JSONArray blockArray = new JSONArray();
			for(int i=0;blockDetailsList!=null && i<blockDetailsList.size();i++) {

				BlockDetails blockDetails = blockDetailsList.get(i);
				JSONObject blockJson = new JSONObject();
				blockJson.put("bloom", ""+blockDetails.getBloom());
				blockJson.put("difficulty", ""+blockDetails.getDifficulty());
				blockJson.put("extraData", ""+blockDetails.getExtraData());
				blockJson.put("minerAddress", ""+blockDetails.getMinerAddress());
				blockJson.put("nonce", ""+blockDetails.getNonce());
				blockJson.put("nrgConsumed", ""+blockDetails.getNrgConsumed());
				blockJson.put("nrgLimit", ""+blockDetails.getNrgLimit());
				blockJson.put("blockNumber", blockDetails.getNumber());
				blockJson.put("parentHash", ""+blockDetails.getParentHash());
				blockJson.put("receiptTxRoot", ""+blockDetails.getReceiptTxRoot());
				blockJson.put("size", ""+blockDetails.getSize());
				blockJson.put("solution", ""+blockDetails.getSolution());
				blockJson.put("stateRoot", ""+blockDetails.getStateRoot());
				blockJson.put("timestampVal", ""+blockDetails.getTimestamp());
				blockJson.put("txTrieRoot", ""+blockDetails.getTxTrieRoot());
				blockJson.put("totalDifficulty", ""+blockDetails.getTotalDifficulty());
				blockJson.put("blockReward", ""+rewardsCalculator(blockDetails.getNumber()));
				blockJson.put("blockHash", ""+blockDetails.getHash());

				JSONArray transactionJsonArray = new JSONArray();
				List<TxDetails> txDetailsList = blockDetails.getTxDetails();
				for(int j=0;txDetailsList!=null && j<txDetailsList.size();j++) {
					TxDetails txDetails = txDetailsList.get(j);
					JSONObject transactionJson = new JSONObject();
					transactionJson.put("blockNumber", blockDetails.getNumber());
					transactionJson.put("data", ""+txDetails.getData());
					transactionJson.put("fromAddr", ""+txDetails.getFrom());
					transactionJson.put("nonce", ""+txDetails.getNonce());
					transactionJson.put("nrgConsumed", ""+txDetails.getNrgConsumed());
					transactionJson.put("nrgPrice", ""+txDetails.getNrgPrice());
					transactionJson.put("toAddr", ""+txDetails.getTo());
					transactionJson.put("blockHash", ""+blockDetails.getHash());
					transactionJson.put("value", ""+txDetails.getValue());
					transactionJson.put("timestampVal", ""+blockDetails.getTimestamp());
					transactionJson.put("transactionHash", ""+txDetails.getTxHash());

					JSONArray transactionLogJsonArray = new JSONArray();
					List<TxLog> txLogList = txDetails.getLogs();
					for(int k=0; txLogList!=null && k<txLogList.size(); k++) {
						TxLog txLog = txLogList.get(k);
						JSONObject txLogJson = new JSONObject();
						txLogJson.put("address", txLog.getAddress());
						txLogJson.put("data", txLog.getData());
						List<String> topics = txLog.getTopics();

						JSONArray topicsArray = new JSONArray();
						for(int l=0;topics!=null && l<topics.size();l++)
							topicsArray.put(topics.get(l));

						txLogJson.put("topics", topicsArray);
						transactionLogJsonArray.put(txLogJson);
					}

					transactionJson.put("transactionLog", transactionLogJsonArray.toString());
					transactionJsonArray.put(transactionJson);

				}

				// miner details
				blockJson.put("minerAddressBalance", getBalance(blockJson.getString("minerAddress")));
				
				blockJson.put("numTransactions", ""+transactionJsonArray.length());
				blockJson.put("transactionList", transactionJsonArray);

				blockArray.put(blockJson);

			}

			return new JSONObject().put("blockList", blockArray);

		}catch(JSONException e) {
			e.printStackTrace();
			return null;
		}
	}

	// get latest block detail
	public BigInteger getLatestBlockDifficulty() {
		apiMsg = aionApi.getAdmin().getBlockDetailsByLatest(1L);
		if (apiMsg.isError()) {
			System.out.println("" + apiMsg.getErrString());
			return null;
		}
		List<BlockDetails> blockDetailsList = apiMsg.getObject();
		BlockDetails blockDetails = blockDetailsList.get(0);
		return blockDetails.getTotalDifficulty();
	}

	// get block detail by number
	public String getBlockHashbyNumber(Long blockNumber) {
		apiMsg = aionApi.getAdmin().getBlockDetailsByNumber(Long.toString(blockNumber));
		if (apiMsg.isError()) {
			System.out.println("" + apiMsg.getErrString());
			return null;
		}
		List<BlockDetails> blockDetailsList = apiMsg.getObject();
		try {
			BlockDetails blockDetails = blockDetailsList.get(0);
			return blockDetails.getHash().toString();
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// rewards calculator
	public BigDecimal rewardsCalculator(long blockNumber) {
		BigInteger m;
		BigInteger blockReward = new BigInteger("1500000000000000000");
		BigDecimal dividend = new BigDecimal("1000000000000000000");
		long rampUpLowerBound = 0;
		long rampUpUpperBound = 259200; 
		long delta = rampUpUpperBound - rampUpLowerBound;
		m = blockReward.divide(BigInteger.valueOf(delta));
		if (blockNumber <= rampUpUpperBound) {
			return new BigDecimal(BigInteger.valueOf(blockNumber).multiply(m)).divide(dividend);
		} else {
			return new BigDecimal(blockReward).divide(dividend);
		}
	}

	// get blockchain number
	public Long getBlockNumber() {
		apiMsg = aionApi.getChain().blockNumber();
		if (apiMsg.isError()) {
			System.out.println("" + apiMsg.getErrString());
			return null;
		}
		return apiMsg.getObject();
	}

	// closo aion api
	private void closeApi(){
		if (aionApi != null)
			aionApi.destroyApi();
	}
}