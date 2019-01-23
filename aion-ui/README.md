# Aion Explorer User Interface

### What's Here?

This is a sigle page application that consumes the aion explorer api service; This application is the main user interface to explore the Aion blockchain for blocks, transactions and accounts.

### Development 

1. Install `node_modules`

   ```
   yarn install
   ````
2. Run application for development
   ```
   yarn start
   ```
3. View application in web browser
   ```
   http://127.0.0.1:3000
   ```

### Build 

1. Edit the following variables in  `/src/env.json` as needed
      {
         "BASE_URL" : "mainnet-api.aion.network/aion",
         "HOME_URL" : "mainnet-api.aion.network",
         "NETWORK_LIST" : "mainnet",
         "GA_KEY" : "UA-000000-10",  
      }

2. Build application; Build destination is `/build`

   ```
   yarn build
   ```
## Dashboard Messages

There are three (3) main messaging states of the dashboard: Loading, Empty & Invalid

### Loading

Data is being retrieved from the server.

### Empty

No data was found for the specified parameters.

### Invalid

The parameters entered are incorrect. 

# Version

## 2.0.1

- Feedback form added
- Improvement in mobile responsiveness 
- Footer expanded it include other links
- Improved dashboard messaging
- Easy copy table cells(rightclick)
- Links in transaction details for contract creation
- Paging contract list
- Date filter for paging tables
- dark mode