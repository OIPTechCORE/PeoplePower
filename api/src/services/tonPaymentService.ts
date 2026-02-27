import { ethers } from 'ethers';

/**
 * TON Payment Processing Service
 * Handles all TON blockchain interactions for People Power Journey
 */
export class TONPaymentService {
  private provider: ethers.providers.Provider;
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(
    contractAddress: string,
    privateKey: string,
    rpcUrl: string
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    
    this.contract = new ethers.Contract(
      contractAddress,
      [
        'function processPayment(address user, uint256 amount, string paymentType) external returns (bool)',
        'function stakeTokens(uint256 amount) external returns (bool)',
        'function unstakeTokens(uint256 amount) external returns (bool)',
        'function getUserStats(address user) external view returns (uint256 balance, uint256 totalPaidAmount, uint256 diamondTier, uint256 stakeAmount, uint256 unlockedBadges)',
        'function getDiamondTierBenefits(address user) external view returns (uint256 tier, string name, uint256 multiplier, uint256 cashback)',
        'event PaymentProcessed(address indexed user, uint256 amount, uint256 fee, bytes32 paymentId)',
        'event BadgeUnlocked(address indexed user, uint256 badgeId)',
        'event DiamondTierUpgraded(address indexed user, uint256 newTier)',
        'event StakingProcessed(address indexed user, uint256 amount, bool isStake)'
      ],
      this.signer
    );
  }

  /**
   * Process a payment with TON tokens
   */
  async processPayment(
    userAddress: string,
    amount: string,
    paymentType: string = 'game_payment'
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.processPayment(
        userAddress,
        amountWei,
        paymentType,
        {
          gasLimit: 100000,
          gasPrice: await this.provider.getGasPrice()
        }
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Stake TON tokens for diamond tier benefits
   */
  async stakeTokens(
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.stakeTokens(amountWei, {
        gasLimit: 80000,
        gasPrice: await this.provider.getGasPrice()
      });

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Staking failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Unstake TON tokens
   */
  async unstakeTokens(
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const amountWei = ethers.utils.parseEther(amount);
      
      const tx = await this.contract.unstakeTokens(amountWei, {
        gasLimit: 90000,
        gasPrice: await this.provider.getGasPrice()
      });

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Unstaking failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userAddress: string): Promise<{
    balance: string;
    totalPaidAmount: string;
    diamondTier: number;
    stakeAmount: string;
    unlockedBadges: number;
  }> {
    try {
      const stats = await this.contract.getUserStats(userAddress);
      
      return {
        balance: ethers.utils.formatEther(stats.balance),
        totalPaidAmount: ethers.utils.formatEther(stats.totalPaidAmount),
        diamondTier: stats.diamondTier.toNumber(),
        stakeAmount: ethers.utils.formatEther(stats.stakeAmount),
        unlockedBadges: stats.unlockedBadges.toNumber()
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }

  /**
   * Get diamond tier benefits
   */
  async getDiamondTierBenefits(userAddress: string): Promise<{
    tier: number;
    name: string;
    multiplier: number;
    cashback: number;
  }> {
    try {
      const benefits = await this.contract.getDiamondTierBenefits(userAddress);
      
      return {
        tier: benefits.tier.toNumber(),
        name: benefits.name,
        multiplier: benefits.multiplier.toNumber(),
        cashback: benefits.cashback.toNumber()
      };
    } catch (error) {
      console.error('Failed to get diamond tier benefits:', error);
      throw error;
    }
  }

  /**
   * Listen to contract events
   */
  setupEventListeners(): void {
    // Payment processed event
    this.contract.on('PaymentProcessed', (user, amount, fee, paymentId, event) => {
      console.log('Payment processed:', {
        user,
        amount: ethers.utils.formatEther(amount),
        fee: ethers.utils.formatEther(fee),
        paymentId,
        transactionHash: event.transactionHash
      });
    });

    // Badge unlocked event
    this.contract.on('BadgeUnlocked', (user, badgeId, event) => {
      console.log('Badge unlocked:', {
        user,
        badgeId: badgeId.toString(),
        transactionHash: event.transactionHash
      });
    });

    // Diamond tier upgraded event
    this.contract.on('DiamondTierUpgraded', (user, newTier, event) => {
      console.log('Diamond tier upgraded:', {
        user,
        newTier: newTier.toString(),
        transactionHash: event.transactionHash
      });
    });

    // Staking processed event
    this.contract.on('StakingProcessed', (user, amount, isStake, event) => {
      console.log('Staking processed:', {
        user,
        amount: ethers.utils.formatEther(amount),
        isStake,
        transactionHash: event.transactionHash
      });
    });
  }

  /**
   * Get contract balance
   */
  async getContractBalance(): Promise<string> {
    try {
      const balance = await this.provider.getBalance(this.contract.address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to get contract balance:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(
    functionName: string,
    ...args: any[]
  ): Promise<string> {
    try {
      const gasEstimate = await this.contract.estimateGas[functionName](...args);
      const gasPrice = await this.provider.getGasPrice();
      const gasCost = gasEstimate.mul(gasPrice);
      
      return ethers.utils.formatEther(gasCost);
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }
}
