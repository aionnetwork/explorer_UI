package com.aion.dashboard.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aion.dashboard.entities.Account;
import com.aion.dashboard.entities.Transaction;

@Repository
public interface AccountJpaRepository extends PagingAndSortingRepository<Account, Long> {
	List<Account> findByAddr(@Param("addr") String addr);
}
