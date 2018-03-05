package com.aion.dashboard.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Block")
public class Block {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Long id;
	String blockHash;
	Double difficulty;
	String extraData;
	String minerAddress;
	String nonce;
	Double nrgConsumed;
	Double nrgLimit;
	Long blockNumber;
	String parentHash;
	String receiptTxRoot;
	Double size;
	String stateRoot;
	Long timestampVal;
	String txTrieRoot;
	String bloom;
	String solution;
	Double totalDifficulty;
	Long numTransactions;
	Double blockReward;
	Long blockTime;
	
	public Long getBlockTime() {
		return blockTime;
	}
	public void setBlockTime(Long blockTime) {
		this.blockTime = blockTime;
	}
	public String getBlockHash() {
		return blockHash;
	}
	public void setBlockHash(String blockHash) {
		this.blockHash = blockHash;
	}
	public Double getDifficulty() {
		return difficulty;
	}
	public void setDifficulty(Double difficulty) {
		this.difficulty = difficulty;
	}
	public String getExtraData() {
		return extraData;
	}
	public void setExtraData(String extraData) {
		this.extraData = extraData;
	}
	public String getMinerAddress() {
		return minerAddress;
	}
	public void setMinerAddress(String minerAddress) {
		this.minerAddress = minerAddress;
	}
	public String getNonce() {
		return nonce;
	}
	public void setNonce(String nonce) {
		this.nonce = nonce;
	}
	public Double getNrgConsumed() {
		return nrgConsumed;
	}
	public void setNrgConsumed(Double nrgConsumed) {
		this.nrgConsumed = nrgConsumed;
	}
	public Double getNrgLimit() {
		return nrgLimit;
	}
	public void setNrgLimit(Double nrgLimit) {
		this.nrgLimit = nrgLimit;
	}
	public Long getBlockNumber() {
		return blockNumber;
	}
	public void setBlockNumber(Long blockNumber) {
		this.blockNumber = blockNumber;
	}
	public String getParentHash() {
		return parentHash;
	}
	public void setParentHash(String parentHash) {
		this.parentHash = parentHash;
	}
	public String getReceiptTxRoot() {
		return receiptTxRoot;
	}
	public void setReceiptTxRoot(String receiptTxRoot) {
		this.receiptTxRoot = receiptTxRoot;
	}
	public Double getSize() {
		return size;
	}
	public void setSize(Double size) {
		this.size = size;
	}
	public String getStateRoot() {
		return stateRoot;
	}
	public void setStateRoot(String stateRoot) {
		this.stateRoot = stateRoot;
	}
	public Long getTimestampVal() {
		return timestampVal;
	}
	public void setTimestampVal(Long timestampVal) {
		this.timestampVal = timestampVal;
	}
	public String getTxTrieRoot() {
		return txTrieRoot;
	}
	public void setTxTrieRoot(String txTrieRoot) {
		this.txTrieRoot = txTrieRoot;
	}
	public String getBloom() {
		return bloom;
	}
	public void setBloom(String bloom) {
		this.bloom = bloom;
	}
	public String getSolution() {
		return solution;
	}
	public void setSolution(String solution) {
		this.solution = solution;
	}
	public Double getTotalDifficulty() {
		return totalDifficulty;
	}
	public void setTotalDifficulty(Double totalDifficulty) {
		this.totalDifficulty = totalDifficulty;
	}
	public Long getNumTransactions() {
		return numTransactions;
	}
	public void setNumTransactions(Long numTransactions) {
		this.numTransactions = numTransactions;
	}
	public Double getBlockReward() {
		return blockReward;
	}
	public void setBlockReward(Double blockReward) {
		this.blockReward = blockReward;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
	
	
	
	
}
