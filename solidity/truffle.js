module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 4000000,   // <--- Twice as much
      gasPrice: 10000000000,
      from: "0x53DE0dbe22F953F849EF7A79f5ca792129414f59"
    },
    mainnet: {

    }
  }
};
