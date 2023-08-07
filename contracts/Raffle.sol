// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
error Raffle__NotEnoughtETH();

contract Raffle{
// State Variales
uint256 private immutable i_entracefee; // immutable variables are cheap (gas wise)
address payable[] private s_players; // we added the paybale keyword because one of the address would be the winner and would recieve eth.

  constructor(uint256 entrancfee){
      i_entracefee = entrancfee;
  }

function enterRaffle() public payable{
      if(msg.value < i_entracefee){
        revert Raffle__NotEnoughtETH();
      }
      s_players.push(payable(msg.sender)); // add players to array of players
    }

function getEntranceFee() public view returns(uint256){
    return i_entracefee;
}

function getPlayers(uint256 index) public view returns(address){
    return s_players[index];
}
}