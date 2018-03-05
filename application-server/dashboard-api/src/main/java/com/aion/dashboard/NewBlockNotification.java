package com.aion.dashboard;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.aion.dashboard.controller.Dashboard;
import com.aion.dashboard.entities.LastBlockRead;
import com.aion.dashboard.repository.LastBlockReadJpaRepository;

@Component
public class NewBlockNotification {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    long previousBlockNumber = 0;
    
    @Autowired
	private LastBlockReadJpaRepository lastBlockReadJpaRepository;
    
    @Autowired
   	private Dashboard dashboard;
    
    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
    	LastBlockRead lastBlockRead = lastBlockReadJpaRepository.findById(1);
    	if(lastBlockRead!=null) {
    		Long blockNumber = lastBlockRead.getBlockNumber();
    		if(previousBlockNumber!=blockNumber) {
    			previousBlockNumber = blockNumber;
    			dashboard.receivedNewBlockDashboard();
    		}
    	}
    }
}