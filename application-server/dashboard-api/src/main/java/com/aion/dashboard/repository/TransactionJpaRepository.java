package com.aion.dashboard.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aion.dashboard.entities.Transaction;

@Repository
public interface TransactionJpaRepository extends PagingAndSortingRepository<Transaction, Long> {
	Page<Transaction> findByFromAddrOrToAddr(@Param("fromAddr") String fromAddr,@Param("toAddr") String toAddr,Pageable pageable);
	Page<Transaction> findByBlockNumber(@Param("blockNumber") Long blockNumber, Pageable pageable);
	Page<Transaction> findByBlockHash(@Param("blockHash") String blockHash, Pageable pageable);
	List<Transaction> findByTransactionHash(@Param("transactionHash") String transactionHash);
	List<Transaction> findTop10ByOrderByIdDesc();
	List<Transaction> findTop128ByOrderByIdDesc();
}
