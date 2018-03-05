package com.aion.dashboard.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Transaction")
public class Transaction {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Long id;
	String transactionHash;
	Long blockNumber;
	String data;
	String fromAddr;
	String toAddr;
	String nonce;
	Double nrgConsumed;
	Double nrgPrice;
	Double value;
	String transactionLog;
	Long timestampVal;
	String blockHash;
	
	
	public String getBlockHash() {
		return blockHash;
	}
	public void setBlockHash(String blockHash) {
		this.blockHash = blockHash;
	}
	public String getTransactionHash() {
		return transactionHash;
	}
	public void setTransactionHash(String transactionHash) {
		this.transactionHash = transactionHash;
	}
	public Long getBlockNumber() {
		return blockNumber;
	}
	public void setBlockNumber(Long blockNumber) {
		this.blockNumber = blockNumber;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getFromAddr() {
		return fromAddr;
	}
	public void setFromAddr(String fromAddr) {
		this.fromAddr = fromAddr;
	}
	public String getToAddr() {
		return toAddr;
	}
	public void setToAddr(String toAddr) {
		this.toAddr = toAddr;
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
	public Double getNrgPrice() {
		return nrgPrice;
	}
	public void setNrgPrice(Double nrgPrice) {
		this.nrgPrice = nrgPrice;
	}
	public Double getValue() {
		return value;
	}
	public void setValue(Double value) {
		this.value = value;
	}
	public String getTransactionLog() {
		return transactionLog;
	}
	public void setTransactionLog(String transactionLog) {
		this.transactionLog = transactionLog;
	}
	public Long getTimestampVal() {
		return timestampVal;
	}
	public void setTimestampVal(Long timestampVal) {
		this.timestampVal = timestampVal;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
	
}
