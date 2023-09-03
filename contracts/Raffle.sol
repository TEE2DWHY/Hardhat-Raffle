// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
error Raffle__NotEnoughtETH();
error Raffle___WithdrawalFailed();
error Raffle__RaflleIsClosed();
// Raffle Steps
// 1. Enter the Lottery
// 2. Pick a Random Winner(Verifiably Random)
// 3. Winner to be Selected every X minute (Completely Automated)

// import chainlink contracts
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    // Type Declaration
    enum RaffleState {
        OPEN,
        CALCULATING
    }
    // State Variales
    uint256 private immutable i_entracefee; // immutable variables are cheap (gas wise)
    address payable[] private s_players; // we added the paybale keyword because one of the address would be the winner and would recieve eth.
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint16 private immutable i_subscription;
    uint16 private constant CONFIRMATION_REQUEST = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    address[] private s_winners;
    // Events
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event RequestedRaffleWinners(address[] indexed winners);
    // Lottery Variables
    address private s_recentWinner;
    RaffleState private s_raffleState;

    constructor(
        address vrfCoordinatorV2,
        uint256 entrancefee,
        bytes32 gasLane,
        uint16 subscription,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_entracefee = entrancefee;
        i_gasLane = gasLane;
        i_subscription = subscription;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
    }

    // Enter Raffle
    function enterRaffle() public payable {
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__RaflleIsClosed();
        }
        if (msg.value < i_entracefee) {
            revert Raffle__NotEnoughtETH();
        }
        s_players.push(payable(msg.sender)); // add players to array of players
        emit RaffleEnter(msg.sender); // emit even with the address of a player (we emit an event when we update a dynamic array or mapping)
    }

    function checkUpkeep(bytes calldata /*checkData*/) external override {}

    // Pick Random Winner using chainlink VRF
    function requestRandomWinner() external {
        // Will revert if subscription is not set and funded.
        s_raffleState = RaffleState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // gasLane
            i_subscription,
            CONFIRMATION_REQUEST,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256,
        // requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        (bool callSuccess, ) = recentWinner.call{value: address(this).balance}(
            ""
        );
        if (!callSuccess) {
            revert Raffle___WithdrawalFailed();
        }
        s_winners.push(s_recentWinner);
        emit RequestedRaffleWinners(s_winners);
    }

    // View and Pure Functions
    function getEntranceFee() public view returns (uint256) {
        return i_entracefee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getWinners() public view returns (address[] memory) {
        return s_winners;
    }
}
