pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Keeps Attra balances cleaner and payments management less error-prown.
 * Any AttraCampaign knows the treasury and transfers collected fees to it.
 */
contract Treasury is Ownable {
    event TreasuryDeposit(uint256 timestamp, uint256 amount);
    event TreasuryWithdrawal(uint256 timestamp, uint256 amount);

    function withdrawTo(uint256 _amount, address payable receiver)
        public
        onlyOwner
    {
        require(
            address(this).balance >= _amount,
            "balance too low for this withdrawal"
        );
        receiver.transfer(_amount);
        emit TreasuryWithdrawal(block.timestamp, _amount);
    }

    receive() external payable {
        emit TreasuryDeposit(block.timestamp, msg.value);
    }
}
