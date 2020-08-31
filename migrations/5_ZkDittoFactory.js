const ACE = artifacts.require('./ACE.sol');

const ZkDittoFactory = artifacts.require('./ZkDittoFactory.sol');
const MockDitto = artifacts.require('./MockDitto.sol');

module.exports = async (deployer, network) => {
  const aceContract = await ACE.deployed();

  // initialise the ZkDittoFactory
  await deployer.deploy(
    ZkDittoFactory,
    aceContract.address
  );

  if (network === 'development') {
    await deployer.deploy(MockDitto);
    const mockDitto = await MockDitto.deployed();

    const zkDittoFactory = await ZkDittoFactory.deployed();
    await zkDittoFactory.deployZkDitto(mockDitto.address);
  }
};
