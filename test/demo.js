import utils from "@aztec/dev-utils";

const aztec = require("aztec.js");
const dotenv = require("dotenv");
dotenv.config();
const secp256k1 = require("@aztec/secp256k1");

const ACE = artifacts.require('./ACE.sol');
const ZkAsset = artifacts.require("./ZkAsset.sol");
const MockDitto = artifacts.require("./MockDitto.sol");
const ZkDittoFactory = artifacts.require("./ZkDittoFactory.sol");

const {
  proofs: { MINT_PROOF }
} = utils;

const { JoinSplitProof, MintProof } = aztec;

contract("Private payment", accounts => {
  const bob = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_0
  );
  const sally = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_1
  );

  let privatePayContract;
  let zkDittoFactory;
  let mockDitto;
  let ace;

  before(async () => {
    zkDittoFactory = await ZkDittoFactory.deployed();
    mockDitto = await MockDitto.deployed();
    ace = await ACE.deployed();
    privatePayContract = await ZkAsset.at(await zkDittoFactory.zkDittos.call(mockDitto.address));
  });

  it("Bob wants to transfer 100 public tokens to private", async() => {
    const bobNote1 = await aztec.note.create(bob.publicKey, 100);

    await mockDitto.approve(ace.address, 100, { from: bob.address });

    const sendProof = new JoinSplitProof(
      [],
      [bobNote1],
      bob.address,
      -100,
      bob.address
    );

    const sendProofData = sendProof.encodeABI(privatePayContract.address);
    const sendProofSignatures = sendProof.constructSignatures(
      privatePayContract.address,
      []
    );

    await ace.publicApprove(privatePayContract.address, sendProof.hash, 200, { from: bob.address });

    await privatePayContract.methods["confidentialTransfer(bytes,bytes)"](
      sendProofData,
      sendProofSignatures,
      {
        from: bob.address
      }
    );
  })

});