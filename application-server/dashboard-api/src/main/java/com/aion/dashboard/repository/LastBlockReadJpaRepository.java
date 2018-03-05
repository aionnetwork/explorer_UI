package com.aion.dashboard.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.aion.dashboard.entities.LastBlockRead;

@Repository
public interface LastBlockReadJpaRepository extends PagingAndSortingRepository<LastBlockRead, Long> {
	LastBlockRead findById(long id);
}
