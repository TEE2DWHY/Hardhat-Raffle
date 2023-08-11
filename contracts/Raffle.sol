// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
error Raffle__NotEnoughtETH();

// import chainlink contracts
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract Raffle is VRFConsumerBaseV2 {
    // State Variales
    uint256 private immutable i_entracefee; // immutable variables are cheap (gas wise)
    address payable[] private s_players; // we added the paybale keyword because one of the address would be the winner and would recieve eth.
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    // Events
    event RaffleEnter(address indexed player); // create an event

    constructor(
        address vrfCoordinatorV2,
        uint256 entrancefee
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_entracefee = entrancefee;
    }

    // Enter Raffle
    function enterRaffle() public payable {
        if (msg.value < i_entracefee) {
            revert Raffle__NotEnoughtETH();
        }
        s_players.push(payable(msg.sender)); // add players to array of players
        emit RaffleEnter(msg.sender); // emit even with the address of a player (we emit an event when we update a dynamic array or mapping)
    }

    // Pick Random Winner using chainlink VRF
    function requestRandomWinner() external {}

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {}

    // View and Pure Functions
    // Get Entrance Fee
    function getEntranceFee() public view returns (uint256) {
        return i_entracefee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
