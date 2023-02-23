import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { connect } from "http2";
import { HelloWorld } from "../typechain-types";

describe("HelloWorld", () => {
  let helloWorldContract: HelloWorld;

  beforeEach(async function () {
    ///Used for creating a contract instance in blockchain
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    //Used for deploy the sc on blockchain
    helloWorldContract = (await helloWorldFactory.deploy()) as HelloWorld;
    //Wait for the contract to be deployed
    await helloWorldContract.deployed();
  });

  it("Should return Hello World!", async () => {
    //Call the function
    const text = await helloWorldContract.helloWorld();
    //Check the result
    expect(text).to.equal("Hello World!");
    console.log(text);
  });

  it("Should set owner to deployer account!", async () => {
    //Get the signer
    const signer = await ethers.getSigners();
    //Call the function
    const owner = await helloWorldContract.owner();
    //Check the result
    expect(owner).to.equal(signer[0].address);
    console.log(owner);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async () => {
    const accounts = await ethers.getSigners();

    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("Caller is not the owner");
    console.log(accounts[1].address);
  });

  it("Should execute transferOwnership correctly", async () => {
    const owner = await helloWorldContract.owner();
    const newOwner = await helloWorldContract.transferOwnership(owner);
    expect(owner).to.not.equal(newOwner);
    console.log(owner, newOwner);
  });

  it("Should not allow anyone other than owner to change text", async () => {
    const owner = await helloWorldContract.owner();
    const accounts = await ethers.getSigners();
    expect(owner).to.be.equal(accounts[0].address);
    console.log(owner, accounts[0].address);
  });

  it("Should change text correctly", async () => {
    const text = await helloWorldContract.helloWorld();
    const newtext = await helloWorldContract.setText("Text changed");
    expect(text).to.not.equal(newtext);
    console.log(text, newtext);
  });
});
