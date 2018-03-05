
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

public class DbHelper {
	Connection connection;
	Config config;
	private static DbHelper dbHelper;
	private LastBlock lastBlock;

	private DbHelper() {
		config = Config.getConfig();
		lastBlock = LastBlock.getLastBlock();
		refreshConnection();
	}

	public static DbHelper getDbHelper() {
		if(dbHelper==null) {
			dbHelper = new DbHelper();
		}
		return dbHelper;
	}

	public void refreshConnection() {
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connection = DriverManager.getConnection("jdbc:mysql://"+config.getSqlIp()+"/aion?user="+config.getSqlUsername()+"&password="+config.getSqlPassword());
			connection.setAutoCommit (false); 
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	public Connection getConnection() {
		try {
			if(connection == null || !connection.isValid(5))
				refreshConnection();
		}catch(Exception e) {
			e.printStackTrace();
		}
		return connection;
	}

	// get last block number
	public long getLastBlockNumber(){
		try {
			String retrieveQuery = "select block_number from last_block_read where id = 1;";
			Statement statement = getConnection().createStatement();
			ResultSet resultSet = statement.executeQuery(retrieveQuery);
			ResultSetMetaData rsmd = resultSet.getMetaData();
			int numColumns = rsmd.getColumnCount();

			// parse each record in received account requests
			while(resultSet.next()){
				for (int i=1; i<=numColumns; i++) {
					String column_name = rsmd.getColumnName(i);
					try{
						return Long.parseLong(resultSet.getObject(column_name).toString());
					}catch(Exception e) {
						e.printStackTrace();
					}
				}
			}

			statement.close();
			resultSet.close();

		}catch(SQLException e) {
			e.printStackTrace();
		}

		return -1;

	}

	// get account information before consistent block number
	public Account getAccountInformationBeforeConsistentBlockNumber(String accountAddress,long blockNumber) {
		int timestamp = 0;
		Account account = null;

		try {
			String retrieveQuery = "select min(timestamp_val),max(timestamp_val),count(*) from transaction where block_number <= "+blockNumber+" and (from_addr = '"+accountAddress+"' or to_addr = '"+accountAddress+"');";
			Statement statement = getConnection().createStatement();
			ResultSet resultSet = statement.executeQuery(retrieveQuery);
			ResultSetMetaData rsmd = resultSet.getMetaData();
			int numColumns = rsmd.getColumnCount();

			// fetch parent_hash
			while(resultSet.next()){
				account = new Account();
				account.setFirstTransactionTimestamp(Long.parseLong((resultSet.getObject(rsmd.getColumnName(1)).toString())));
				account.setLastTransactionTimestamp(Long.parseLong((resultSet.getObject(rsmd.getColumnName(2)).toString())));
				account.setNumTransactions(Integer.parseInt((resultSet.getObject(rsmd.getColumnName(3)).toString())));
			}

			// get account information for miner blocks as well
			retrieveQuery = "select count(*) from block where block_number <= "+blockNumber+" and miner_address = '"+accountAddress+"';";
			resultSet = statement.executeQuery(retrieveQuery);
			rsmd = resultSet.getMetaData();

			while(resultSet.next()){
				account.setNumBlocksMined(Integer.parseInt((resultSet.getObject(rsmd.getColumnName(1)).toString())));
			}

			statement.close();
			resultSet.close();

		}catch(SQLException e) {
			e.printStackTrace();
		}

		return account;

	}

	// get block timestamp
	public long getLastBlockTimestamp(long blockNumber){

		if(blockNumber == lastBlock.getBlockNumber())
			return lastBlock.getTimestampVal();
		else {
			try {
				String retrieveQuery = "select timestamp_val from block where block_number = '"+blockNumber+"';";
				Statement statement = getConnection().createStatement();
				ResultSet resultSet = statement.executeQuery(retrieveQuery);
				ResultSetMetaData rsmd = resultSet.getMetaData();
				int numColumns = rsmd.getColumnCount();
				long timestamp = 0;

				// parse each record in received account requests
				while(resultSet.next()){
					for (int i=1; i<=numColumns; i++) {
						String column_name = rsmd.getColumnName(i);
						try{
							timestamp = Long.parseLong(resultSet.getObject(column_name).toString());
						}catch(Exception e) {
							e.printStackTrace();
						}
					}
				}			
				statement.close();
				resultSet.close();
				return timestamp;

			}catch(SQLException e) {
				e.printStackTrace();
			}

			return -1;
		}

	}

	// get parent hash from block number
	public String getHashFromBlockNumber(long blockNumber) {

		try {
			String retrieveQuery = "select block_hash from block where block_number = '"+blockNumber+"';";
			Statement statement = getConnection().createStatement();
			ResultSet resultSet = statement.executeQuery(retrieveQuery);
			ResultSetMetaData rsmd = resultSet.getMetaData();
			int numColumns = rsmd.getColumnCount();

			// fetch parent_hash
			while(resultSet.next()){
				String column_name = rsmd.getColumnName(1);
				try{
					return resultSet.getObject(column_name).toString();
				}catch(Exception e) {
					e.printStackTrace();
				}
			}

			statement.close();
			resultSet.close();

		}catch(SQLException e) {
			e.printStackTrace();
		}

		return null;

	}

	// save to block & transaction table
	public void saveToBlockAndTransaction(JSONObject blockContent, AionService aionService, boolean isBlockchainHead) {
		try {
			JSONArray blockArray = blockContent.getJSONArray("blockList");
			Hashtable<String, Account> accountHash = new Hashtable<String,Account>();
			
			if(blockArray==null || blockArray.length()==0)
				return;

			Statement statement = getConnection().createStatement();
			Statement secondBatch = getConnection().createStatement();

			for(int i=0;i<blockArray.length();i++) {
				JSONObject blockObject = blockArray.getJSONObject(i);

				// calculate block time
				long timestampVal = 0;
				if(i!=0) {
					timestampVal = Long.parseLong(blockObject.getString("timestampVal"))-Long.parseLong(blockArray.getJSONObject(i-1).getString("timestampVal"));
				}else {
					long lastBlockTimestamp = getLastBlockTimestamp(blockObject.getLong("blockNumber")-1);
					if(lastBlockTimestamp==0)// last block doesn't exist
						timestampVal = 0;
					else
						timestampVal = Long.parseLong(blockObject.getString("timestampVal"))-lastBlockTimestamp;
				}

				// save to block table
				String blockInsert = "insert into block(difficulty,extra_data,miner_address,nonce,nrg_consumed,nrg_limit,block_number,parent_hash,receipt_tx_root,size,state_root,timestamp_val,tx_trie_root, bloom, solution, total_difficulty, num_transactions, block_reward, block_hash, block_time) values('"+blockObject.getString("difficulty")+"','"+blockObject.getString("extraData")+"','"+blockObject.getString("minerAddress")+"','"+blockObject.getString("nonce")+"','"+blockObject.getString("nrgConsumed")+"','"+blockObject.getString("nrgLimit")+"',"+blockObject.getLong("blockNumber")+",'"+blockObject.getString("parentHash")+"','"+blockObject.getString("receiptTxRoot")+"','"+blockObject.getString("size")+"','"+blockObject.getString("stateRoot")+"','"+blockObject.getString("timestampVal")+"','"+blockObject.getString("txTrieRoot")+"','"+blockObject.getString("bloom")+"','"+blockObject.getString("solution")+"','"+blockObject.getString("totalDifficulty")+"','"+blockObject.getString("numTransactions")+"','"+blockObject.getString("blockReward")+"','"+blockObject.getString("blockHash")+"',"+timestampVal+");";
				statement.addBatch(blockInsert);

				JSONArray transactionArray = blockObject.getJSONArray("transactionList");
				for(int j=0; transactionArray!=null && j<transactionArray.length();j++) {
					JSONObject transactionObject = transactionArray.getJSONObject(j);

					String transactionInsert = "insert into transaction(block_number,data,from_addr,nonce,nrg_consumed,nrg_price,to_addr,value,transaction_log, timestamp_val, transaction_hash, block_hash) values("+blockObject.getLong("blockNumber")+",'"+transactionObject.getString("data")+"','"+transactionObject.getString("fromAddr")+"','"+transactionObject.getString("nonce")+"','"+transactionObject.getString("nrgConsumed")+"','"+transactionObject.getString("nrgPrice")+"','"+transactionObject.getString("toAddr")+"','"+transactionObject.getString("value")+"','"+transactionObject.getString("transactionLog")+"','"+transactionObject.getString("timestampVal")+"','"+transactionObject.getString("transactionHash")+"','"+transactionObject.getString("blockHash")+"');";

					// save to transaction table
					statement.addBatch(transactionInsert);

					// add account updation
					String[] addrName = new String[] {"fromAddr","toAddr"};
					for(int k=0;k<addrName.length;k++) {
						if(!transactionObject.getString(addrName[k]).trim().isEmpty()) {
							if(!accountHash.containsKey(transactionObject.getString(addrName[k]))) {
								String addr = transactionObject.getString(addrName[k]);
								long timestamp = Long.parseLong(transactionObject.getString("timestampVal"));
								accountHash.put(addr, new Account(addr,timestamp,timestamp,1,0));	
							}
							else {
								String addr = transactionObject.getString(addrName[k]);
								long timestamp = Long.parseLong(transactionObject.getString("timestampVal"));
								Account account = accountHash.get(addr);
								if(account.getFirstTransactionTimestamp()==0)
									account.setFirstTransactionTimestamp(timestamp);
								account.setNumTransactions(account.getNumTransactions()+1);
								account.setLastTransactionTimestamp(timestamp);
							}
						}
					}
				}

				// update miner address list
				if(!blockObject.getString("minerAddress").trim().isEmpty()) {
					if(!accountHash.containsKey(blockObject.getString("minerAddress"))) {
						String addr = blockObject.getString("minerAddress");
						accountHash.put(addr,new Account(addr,0,0,0,1));

					}else {
						String addr = blockObject.getString("minerAddress");
						Account account = accountHash.get(addr);
						account.setNumBlocksMined(account.getNumBlocksMined()+1);
					}	
				}

				if(i==blockArray.length()-1) {
					
					// update last blockNumber
					String updateQuery = "update last_block_read set block_number = "+blockObject.getLong("blockNumber")+" where id = 1;";
					statement.addBatch(updateQuery);
					
					// update current blockchain head
					String blockchainHeadQuery = "update last_block_read set block_number = "+blockObject.getLong("blockNumber")+" where id = 2;";
					if(!isBlockchainHead) {
						long blockchainHead = aionService.getBlockNumber();
						blockchainHeadQuery = "update last_block_read set block_number = "+blockchainHead+" where id = 2;";
					}
					statement.addBatch(blockchainHeadQuery);
					
					// update last block number
					lastBlock.setBlockNumber(blockObject.getLong("blockNumber"));
					lastBlock.setTimestampVal(Long.parseLong(blockObject.getString("timestampVal")));
				}

			}

			// update account info
			Set<String> keys = accountHash.keySet();
	        for(String fromAddr: keys){
	            Account account = accountHash.get(fromAddr);
				String fromAddrBalance = aionService.getBalance(fromAddr);
				String accountInsert = "insert into account(addr,balance,first_transaction_timestamp,last_transaction_timestamp,num_transactions,num_blocks_mined) values('"+fromAddr+"','"+fromAddrBalance+"',"+account.getFirstTransactionTimestamp()+","+account.getLastTransactionTimestamp()+","+account.getNumTransactions()+","+account.getNumBlocksMined()+") on duplicate key update balance=values(balance), first_transaction_timestamp = if(first_transaction_timestamp = 0,values(first_transaction_timestamp),first_transaction_timestamp), last_transaction_timestamp = if(values(last_transaction_timestamp)!= 0,values(last_transaction_timestamp),last_transaction_timestamp), num_transactions = values(num_transactions)+num_transactions, num_blocks_mined=values(num_blocks_mined)+num_blocks_mined";
				statement.addBatch(accountInsert);
	        }

			// update first batch
			statement.executeBatch();
			getConnection().commit();

		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	// reorganize blocks
	public void reorganizeBlocks(long blockNumber, AionService aionService) {
		try {
			// delete all blocks after consistent block
			String blockDelete = "delete from block where block_number > "+blockNumber+";";
			String transactionDelete = "delete from transaction where block_number > "+blockNumber+";";
			Statement statement = getConnection().createStatement();

			// identify if the account was added in inconsistent blocks
			ArrayList<String> accountList = getUniqueAccountListAboveConsistentBlock(blockNumber);
			if(accountList!=null && accountList.size()>0) {
				for(int i=0;i<accountList.size();i++) {
					String address = accountList.get(i);
					if(validAccount(blockNumber, address)) {
						// update account balance
						Account account = getAccountInformationBeforeConsistentBlockNumber(address, blockNumber);
						if(account!=null) {
							String updateQuery = "replace into account(addr,balance,first_transaction_timestamp,last_transaction_timestamp,num_transactions,num_blocks_mined) values('"+address+"','"+aionService.getBalance(address)+"',"+account.getFirstTransactionTimestamp()+","+account.getLastTransactionTimestamp()+","+account.getNumTransactions()+","+account.getNumBlocksMined()+");";
							statement.addBatch(updateQuery);
						}
					}else {
						// delete account record
						String deleteQuery = "delete from account where addr='"+address+"';";
						statement.addBatch(deleteQuery);
					}
				}
			}

			// update last block read with consistent block
			String lastBlockUpdate = "update last_block_read set block_number = '"+blockNumber+"' where id = 1;";
			
			// update last block read
			lastBlock.setBlockNumber(0);
			lastBlock.setTimestampVal(0);

			statement.addBatch(blockDelete);
			statement.addBatch(transactionDelete);
			statement.addBatch(lastBlockUpdate);

			statement.executeBatch();
			getConnection().commit();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	// get account list between inconsistent block range
	public ArrayList<String> getUniqueAccountListAboveConsistentBlock(long consistentBlockNumber){
		ArrayList<String> accountList = new ArrayList<String>();
		try {
			// from addr and to addr
			String query = "select to_addr,from_addr from transaction where block_number>"+consistentBlockNumber+";";
			Statement statement = getConnection().createStatement();
			ResultSet resultSet = statement.executeQuery(query);
			ResultSetMetaData rsmd = resultSet.getMetaData();
			while(resultSet.next()){
				String toAddress = resultSet.getObject(rsmd.getColumnName(1)).toString();
				String fromAddress = resultSet.getObject(rsmd.getColumnName(2)).toString();
				if(!toAddress.trim().isEmpty() && !accountList.contains(toAddress))
					accountList.add(toAddress);
				if(!fromAddress.trim().isEmpty() && !accountList.contains(fromAddress))
					accountList.add(fromAddress);

			}

			query = "select miner_address from block where block_number>"+consistentBlockNumber+";";
			resultSet = statement.executeQuery(query);
			rsmd = resultSet.getMetaData();
			while(resultSet.next()){
				String minerAddress = resultSet.getObject(rsmd.getColumnName(1)).toString();
				if(!accountList.contains(minerAddress))
					accountList.add(minerAddress);
			}

			statement.close();
			resultSet.close();
		}catch(Exception e) {
			e.printStackTrace();
			return accountList;
		}
		return accountList;
	}


	// identify valid account
	public boolean validAccount(long consistentBlockNumber,String address) {
		boolean result=false;
		try {
			String query = "select count(*) from transaction where block_number <="+consistentBlockNumber+" and (to_addr = '"+address+"' or from_addr = '"+address+"');";
			Statement statement = getConnection().createStatement();
			ResultSet resultSet = statement.executeQuery(query);
			ResultSetMetaData rsmd = resultSet.getMetaData();
			while(resultSet.next()){
				String column_name = rsmd.getColumnName(1);
				long count = Long.parseLong(resultSet.getObject(column_name).toString());
				if(count>0)
					result = true;
				else
					result = false;
				break;
			}
			statement.close();
			resultSet.close();

		}catch(SQLException e) {
			e.printStackTrace();
			return result;
		}
		return result;
	}


}
