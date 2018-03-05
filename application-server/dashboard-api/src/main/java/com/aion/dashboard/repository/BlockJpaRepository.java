package com.aion.dashboard.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aion.dashboard.entities.Block;

@Repository
public interface BlockJpaRepository extends PagingAndSortingRepository<Block, Long> {
	List<Block> findByBlockNumber(@Param("blockNumber") Long blockNumber);
	Page<Block> findByMinerAddress(@Param("minerAddress") String minerAddress, Pageable pageable);
	Page<Block> findAll(Pageable pageable);
	List<Block> findByBlockHash(@Param("blockHash") String blockHash);
	List<Block> findTop8640ByOrderByIdDesc();
}
