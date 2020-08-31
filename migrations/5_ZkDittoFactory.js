const ACE = artifacts.require('./ACE.sol');

const ZkDittoFactory = artifacts.require('./ZkDittoFactory.sol');
const MockDitto = artifacts.require('./MockDitto.sol');

module.exports = async (deployer, network) => {
  await deployer.deploy(MockDitto);
  const mockDitto = await MockDitto.deployed();

  let aceContract;
  if (network === 'development') {
    aceContract = await ACE.deployed();
    // initialise the ZkDittoFactory
    await deployer.deploy(
      ZkDittoFactory,
      aceContract.address
    );

    const zkDittoFactory = await ZkDittoFactory.deployed();
    await zkDittoFactory.deployZkDitto(mockDitto.address);
  }
};
