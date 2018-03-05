
public class AionMain {

	public static void main(String[] args) {		

		if(args[0]==null || args[1]==null || args[2]==null || args[3]==null ) {
			System.out.println("Incomplete input, returning");
			return;
		}
		
		// set configuration
		Config.getConfig().setValues(args[0], args[1], args[2], args[3]);
		
		// start block parser
		new BlockParserThread().start();
	
	}

}
