task(
  "block-timestamp",
  "Prints the timestamp of the current block",
  async (_, { ethers }) => {
    const nr = await ethers.provider.getBlockNumber();
    await ethers.provider.getBlock(nr).then(({ timestamp }) => {
      console.log(
        "Current block: " +
          nr +
          " - - - - - - " +
          new Date(timestamp * 1000).toLocaleString()
      );
    });
  }
);
