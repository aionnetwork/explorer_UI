use aion;

create table block(
  block_hash varchar(64) not null primary key, 
  difficulty decimal(64,20), 
  extra_data varchar(64), 
  miner_address varchar(64), 
  nonce text, 
  nrg_consumed decimal(64,20), 
  nrg_limit decimal(64,20), 
  block_number bigint(64), 
  parent_hash varchar(64), 
  receipt_tx_root varchar(64), 
  size decimal(64,20), 
  state_root varchar(64), 
  timestamp_val bigint(64), 
  tx_trie_root varchar(64), 
  bloom text, solution text, 
  total_difficulty decimal(64,20), 
  num_transactions int, 
  block_reward decimal(64,20), 
  block_time bigint(64)
);

create table transaction(
  transaction_hash varchar(64) not null primary key, 
  block_number bigint(64), 
  data text, from_addr varchar(64), 
  nonce text, 
  nrg_consumed decimal(64,20), 
  nrg_price decimal(64,20), 
  to_addr varchar(64), 
  value decimal(64,20), 
  transaction_log text, 
  timestamp_val bigint(64), 
  block_hash varchar(64)
);

create table account(
  id bigint(30) unsigned auto_increment primary key, 
  addr varchar(64) not null unique, 
  balance decimal(64,20), 
  first_transaction_timestamp bigint(64), 
  last_transaction_timestamp bigint(64), 
  num_transactions bigint(64), 
  num_blocks_mined bigint(64)
);

create table last_block_read(
  id int(10) primary key,
  block_number bigint(64)
);

create index txn_block_number ON transaction (block_number);
create index blk_block_number ON block (block_number);

insert into last_block_read values(1,-1);
insert into last_block_read values(2,-1);