// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InfinityPaymentProcessor
 * @dev TON Payment Processing Contract for People Power Journey
 * @author People Power Team
 */
contract InfinityPaymentProcessor is ReentrancyGuard, Ownable {
    // State variables
    IERC20 public tonToken;
    address public superAdmin;
    uint256 public platformFeePercent = 250; // 2.5% fee
    uint256 public constant FEE_PRECISION = 10000;
    
    // Payment tracking
    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public totalPaid;
    mapping(bytes32 => Payment) public payments;
    
    // Badge and Diamond system
    mapping(address => uint256) public userDiamondTier;
    mapping(address => mapping(uint256 => bool)) public userBadges;
    mapping(address => uint256) public userStakeAmount;
    
    // Events
    event PaymentProcessed(address indexed user, uint256 amount, uint256 fee, bytes32 paymentId);
    event BadgeUnlocked(address indexed user, uint256 badgeId);
    event DiamondTierUpgraded(address indexed user, uint256 newTier);
    event StakingProcessed(address indexed user, uint256 amount, bool isStake);
    event SuperAdminPayout(address indexed superAdmin, uint256 amount);
    
    // Structs
    struct Payment {
        address user;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
        bool processed;
        string paymentType;
    }
    
    struct Badge {
        uint256 id;
        string name;
        string description;
        uint256 unlockCost;
        uint256 tier;
        bool isActive;
    }
    
    struct DiamondTier {
        uint256 tier;
        string name;
        uint256 requiredStake;
        uint256 bonusMultiplier;
        uint256 cashbackPercent;
    }
    
    // Arrays
    Badge[] public badges;
    DiamondTier[] public diamondTiers;
    
    constructor(address _tonToken, address _superAdmin) {
        tonToken = IERC20(_tonToken);
        superAdmin = _superAdmin;
        initializeBadges();
        initializeDiamondTiers();
    }
    
    /**
     * @dev Initialize badge system
     */
    function initializeBadges() internal {
        badges.push(Badge(1, "Infinity Pioneer", "First payment milestone", 100, 1, true));
        badges.push(Badge(2, "Infinity Explorer", "Active participant", 500, 2, true));
        badges.push(Badge(3, "Infinity Master", "Power user", 1000, 3, true));
        badges.push(Badge(4, "Infinity Legend", "Elite contributor", 5000, 4, true));
        badges.push(Badge(5, "Infinity God", "Ultimate achievement", 10000, 5, true));
    }
    
    /**
     * @dev Initialize diamond tier system
     */
    function initializeDiamondTiers() internal {
        diamondTiers.push(DiamondTier(1, "Bronze", 100, 100, 5));  // 1x multiplier, 5% cashback
        diamondTiers.push(DiamondTier(2, "Silver", 500, 120, 10)); // 1.2x multiplier, 10% cashback
        diamondTiers.push(DiamondTier(3, "Gold", 1000, 150, 20));  // 1.5x multiplier, 20% cashback
        diamondTiers.push(DiamondTier(4, "Platinum", 5000, 200, 30)); // 2x multiplier, 30% cashback
    }
    
    /**
     * @dev Process payment with TON tokens
     */
    function processPayment(
        address user,
        uint256 amount,
        string memory paymentType
    ) external nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(user != address(0), "Invalid user address");
        
        // Calculate platform fee
        uint256 fee = (amount * platformFeePercent) / FEE_PRECISION;
        uint256 netAmount = amount - fee;
        
        // Transfer TON tokens from user to contract
        require(tonToken.transferFrom(user, address(this), amount), "Transfer failed");
        
        // Update user balance
        userBalances[user] += netAmount;
        totalPaid[user] += amount;
        
        // Create payment record
        bytes32 paymentId = keccak256(abi.encodePacked(user, amount, block.timestamp, paymentType));
        payments[paymentId] = Payment(user, amount, fee, block.timestamp, true, paymentType);
        
        // Check for badge unlocks
        checkBadgeUnlocks(user);
        
        // Update diamond tier
        updateDiamondTier(user);
        
        // Emit events
        emit PaymentProcessed(user, amount, fee, paymentId);
        
        return true;
    }
    
    /**
     * @dev Stake TON tokens for diamond tier benefits
     */
    function stakeTokens(uint256 amount) external nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(tonToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        userStakeAmount[msg.sender] += amount;
        
        // Update diamond tier based on stake
        updateDiamondTier(msg.sender);
        
        emit StakingProcessed(msg.sender, amount, true);
        
        return true;
    }
    
    /**
     * @dev Unstake TON tokens
     */
    function unstakeTokens(uint256 amount) external nonReentrant returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(userStakeAmount[msg.sender] >= amount, "Insufficient staked amount");
        
        userStakeAmount[msg.sender] -= amount;
        
        // Update diamond tier
        updateDiamondTier(msg.sender);
        
        require(tonToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit StakingProcessed(msg.sender, amount, false);
        
        return true;
    }
    
    /**
     * @dev Check and unlock badges based on user activity
     */
    function checkBadgeUnlocks(address user) internal {
        for (uint i = 0; i < badges.length; i++) {
            if (!userBadges[user][i] && totalPaid[user] >= badges[i].unlockCost) {
                userBadges[user][i] = true;
                emit BadgeUnlocked(user, i);
            }
        }
    }
    
    /**
     * @dev Update user's diamond tier based on stake amount
     */
    function updateDiamondTier(address user) internal {
        uint256 stake = userStakeAmount[user];
        uint256 newTier = 0;
        
        for (uint i = diamondTiers.length; i > 0; i--) {
            if (stake >= diamondTiers[i - 1].requiredStake) {
                newTier = i;
                break;
            }
        }
        
        if (newTier > userDiamondTier[user]) {
            userDiamondTier[user] = newTier;
            emit DiamondTierUpgraded(user, newTier);
        }
    }
    
    /**
     * @dev Get user's current diamond tier benefits
     */
    function getDiamondTierBenefits(address user) external view returns (
        uint256 tier,
        string memory name,
        uint256 multiplier,
        uint256 cashback
    ) {
        uint256 currentTier = userDiamondTier[user];
        if (currentTier == 0) {
            return (0, "None", 100, 0);
        }
        
        DiamondTier memory tierInfo = diamondTiers[currentTier - 1];
        return (currentTier, tierInfo.name, tierInfo.bonusMultiplier, tierInfo.cashbackPercent);
    }
    
    /**
     * @dev Process super admin payout
     */
    function processSuperAdminPayout() external onlyOwner nonReentrant {
        uint256 totalFees = 0;
        
        // Calculate total fees collected
        for (uint i = 0; i < badges.length; i++) {
            // This would need to be optimized for production
            // For now, we'll use a simplified approach
        }
        
        // Transfer fees to super admin
        if (totalFees > 0) {
            require(tonToken.transfer(superAdmin, totalFees), "Transfer failed");
            emit SuperAdminPayout(superAdmin, totalFees);
        }
    }
    
    /**
     * @dev Update platform fee percentage
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Update super admin address
     */
    function updateSuperAdmin(address newSuperAdmin) external onlyOwner {
        require(newSuperAdmin != address(0), "Invalid address");
        superAdmin = newSuperAdmin;
    }
    
    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 totalPaidAmount,
        uint256 diamondTier,
        uint256 stakeAmount,
        uint256 unlockedBadges
    ) {
        uint256 badgeCount = 0;
        for (uint i = 0; i < badges.length; i++) {
            if (userBadges[user][i]) {
                badgeCount++;
            }
        }
        
        return (
            userBalances[user],
            totalPaid[user],
            userDiamondTier[user],
            userStakeAmount[user],
            badgeCount
        );
    }
    
    /**
     * @dev Emergency withdrawal function
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = tonToken.balanceOf(address(this));
        require(tonToken.transfer(owner(), balance), "Transfer failed");
    }
}
