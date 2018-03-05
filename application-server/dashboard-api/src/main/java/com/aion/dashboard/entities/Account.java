package com.aion.dashboard.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Account")
public class Account {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Long id;
	String addr;
	double balance;
	long firstTransactionTimestamp;
	long lastTransactionTimestamp;
	long numTransactions;
	long numBlocksMined;
	
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
	public long getNumTransactions() {
		return numTransactions;
	}
	public void setNumTransactions(long numTransactions) {
		this.numTransactions = numTransactions;
	}
	public long getNumBlocksMined() {
		return numBlocksMined;
	}
	public void setNumBlocksMined(long numBlocksMined) {
		this.numBlocksMined = numBlocksMined;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public double getBalance() {
		return balance;
	}
	public void setBalance(double balance) {
		this.balance = balance;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
	
	
	
}
