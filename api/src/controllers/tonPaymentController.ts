import { Request, Response } from 'express';
import { TONPaymentService } from '../services/tonPaymentService';
import { logger } from '../utils/logger';

/**
 * TON Payment Controller
 * Handles all TON payment related API endpoints
 */
export class TONPaymentController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
    
    // Setup event listeners
    this.tonService.setupEventListeners();
  }

  /**
   * Process a payment
   */
  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { userAddress, amount, paymentType } = req.body;

      if (!userAddress || !amount) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: userAddress, amount'
        });
        return;
      }

      const result = await this.tonService.processPayment(
        userAddress,
        amount.toString(),
        paymentType || 'game_payment'
      );

      if (result.success) {
        logger.info('Payment processed successfully', {
          userAddress,
          amount,
          transactionHash: result.transactionHash
        });

        res.json({
          success: true,
          transactionHash: result.transactionHash,
          message: 'Payment processed successfully'
        });
      } else {
        logger.error('Payment processing failed', {
          userAddress,
          amount,
          error: result.error
        });

        res.status(500).json({
          success: false,
          error: result.error || 'Payment processing failed'
        });
      }
    } catch (error) {
      logger.error('Payment processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Stake tokens
   */
  async stakeTokens(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;

      if (!amount) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: amount'
        });
        return;
      }

      const result = await this.tonService.stakeTokens(amount.toString());

      if (result.success) {
        logger.info('Tokens staked successfully', {
          amount,
          transactionHash: result.transactionHash
        });

        res.json({
          success: true,
          transactionHash: result.transactionHash,
          message: 'Tokens staked successfully'
        });
      } else {
        logger.error('Staking failed', {
          amount,
          error: result.error
        });

        res.status(500).json({
          success: false,
          error: result.error || 'Staking failed'
        });
      }
    } catch (error) {
      logger.error('Staking error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Unstake tokens
   */
  async unstakeTokens(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;

      if (!amount) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: amount'
        });
        return;
      }

      const result = await this.tonService.unstakeTokens(amount.toString());

      if (result.success) {
        logger.info('Tokens unstaked successfully', {
          amount,
          transactionHash: result.transactionHash
        });

        res.json({
          success: true,
          transactionHash: result.transactionHash,
          message: 'Tokens unstaked successfully'
        });
      } else {
        logger.error('Unstaking failed', {
          amount,
          error: result.error
        });

        res.status(500).json({
          success: false,
          error: result.error || 'Unstaking failed'
        });
      }
    } catch (error) {
      logger.error('Unstaking error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const { userAddress } = req.params;

      if (!userAddress) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameter: userAddress'
        });
        return;
      }

      const stats = await this.tonService.getUserStats(userAddress);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get diamond tier benefits
   */
  async getDiamondTierBenefits(req: Request, res: Response): Promise<void> {
    try {
      const { userAddress } = req.params;

      if (!userAddress) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameter: userAddress'
        });
        return;
      }

      const benefits = await this.tonService.getDiamondTierBenefits(userAddress);

      res.json({
        success: true,
        data: benefits
      });
    } catch (error) {
      logger.error('Get diamond tier benefits error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get contract balance
   */
  async getContractBalance(req: Request, res: Response): Promise<void> {
    try {
      const balance = await this.tonService.getContractBalance();

      res.json({
        success: true,
        data: {
          balance,
          currency: 'TON'
        }
      });
    } catch (error) {
      logger.error('Get contract balance error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(req: Request, res: Response): Promise<void> {
    try {
      const { functionName, args } = req.body;

      if (!functionName) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: functionName'
        });
        return;
      }

      const gasCost = await this.tonService.estimateGas(functionName, ...(args || []));

      res.json({
        success: true,
        data: {
          functionName,
          gasCost,
          currency: 'TON'
        }
      });
    } catch (error) {
      logger.error('Estimate gas error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
