
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import org.json.JSONObject;

public class Config {

	private static Config config;
	private JSONObject json;
	private String[] blockchainNodeList;
	private int numNodes;
	private String blockchainPort;
	private String dbUser;
	private String dbPassword;

	private Config() {
		try {
			byte[] encoded = Files.readAllBytes(Paths.get("config.json"));
			String content = new String(encoded, StandardCharsets.UTF_8);
			json = new JSONObject(content);

		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	public void setValues(String port,String nodeList, String dbUser, String dbPassword) {
		blockchainPort = port;

		// pre-populate blockchian nodes
		if(nodeList.contains(",")) {
			blockchainNodeList = nodeList.split(",");
			numNodes = blockchainNodeList.length;
		}
		else {
			blockchainNodeList = new String[1];
			blockchainNodeList[0] = nodeList;
			numNodes = 1;
		}
		
		this.dbUser = dbUser;
		this.dbPassword = dbPassword;
	}

	static Config getConfig() {
		if(config == null) {
			config = new Config();
		}
		return config;
	}

	String getBlockActiveThreasholdInSec() {
		try {
			return json.getString("blockActiveThreasholdInSec");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	} 

	int getNodeNum() {
		try {
			return numNodes;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return 0;
	} 

	String getDelayInPollingInMsec() {
		try {
			return json.getString("delayInPollingInMsec");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	} 

	String getNodeAddress(int index) {
		try {
			return "tcp://"+blockchainNodeList[index]+":"+blockchainPort;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	String getSqlIp() {
		try {
			return json.getString("sqlIp");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	String getSqlUsername() {
		try {
			return dbUser;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	String getSqlPassword() {
		try {
			return dbPassword;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
