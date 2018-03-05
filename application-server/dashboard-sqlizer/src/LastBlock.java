
public class LastBlock {
	private long blockNumber;
	private long timestampVal;
	private static LastBlock lastBlock;
	
	private LastBlock() {
		blockNumber = 0;
		timestampVal = 0;
	}
	
	public static LastBlock getLastBlock() {
		if(lastBlock==null)
			lastBlock = new LastBlock();
		return lastBlock;
	}
	
	public long getBlockNumber() {
		return blockNumber;
	}
	public void setBlockNumber(long blockNumber) {
		this.blockNumber = blockNumber;
	}
	public long getTimestampVal() {
		return timestampVal;
	}
	public void setTimestampVal(long timestampVal) {
		this.timestampVal = timestampVal;
	}

}
