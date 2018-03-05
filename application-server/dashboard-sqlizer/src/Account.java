
public class Account {
	private String address;
	private long firstTransactionTimestamp;
	private long lastTransactionTimestamp;
	private int numTransactions;
	private int numBlocksMined;
	
	public Account(String addr,long firstTimestamp, long lastTimestamp, int transactionNum, int blocksMinedNum) {
		address = addr;
		firstTransactionTimestamp = firstTimestamp;
		lastTransactionTimestamp = lastTimestamp;
		numTransactions = transactionNum;
		numBlocksMined = blocksMinedNum;
	}
	
	public Account() {
		address="";
		firstTransactionTimestamp = 0;
		lastTransactionTimestamp = 0;
		numTransactions = 0;
		numBlocksMined = 0;
	}
	
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public long getFirstTransactionTimestamp() {
		return firstTransactionTimestamp;
	}
	public void setFirstTransactionTimestamp(long firstTransactionTimestamp) {
		this.firstTransactionTimestamp = firstTransactionTimestamp;
	}
	public long getLastTransactionTimestamp() {
		return lastTransactionTimestamp;
	}
	public void setLastTransactionTimestamp(long lastTransactionTimestamp) {
		this.lastTransactionTimestamp = lastTransactionTimestamp;
	}
	public int getNumTransactions() {
		return numTransactions;
	}
	public void setNumTransactions(int numTransactions) {
		this.numTransactions = numTransactions;
	}
	public int getNumBlocksMined() {
		return numBlocksMined;
	}
	public void setNumBlocksMined(int numBlocksMined) {
		this.numBlocksMined = numBlocksMined;
	}
	
}
