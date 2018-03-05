package com.aion.dashboard.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="LastBlockRead")
public class LastBlockRead {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Long id;
	Long blockNumber;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getBlockNumber() {
		return blockNumber;
	}
	public void setBlockNumber(Long blockNumber) {
		this.blockNumber = blockNumber;
	}
	
	
	
	
	
	
	
}
