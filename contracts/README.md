# TON Smart Contracts for People Power Journey

## 📋 Overview

This directory contains the TON smart contracts for the People Power Journey game, including payment processing, staking, badge systems, and diamond tier management.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your actual values:

```env
TON_TESTNET_URL=https://testnet.ton.org
TON_MAINNET_URL=https://mainnet.ton.org
TON_API_KEY=your_ton_api_key_here
TON_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890
SUPER_ADMIN_ADDRESS=0x1234567890123456789012345678901234567890
PRIVATE_KEY=your_private_key_here
REPORT_GAS=true
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy to Testnet

```bash
npm run deploy:testnet
```

### 6. Deploy to Mainnet

```bash
npm run deploy:mainnet
```

## 📁 Contract Structure

### Core Contracts

- **`InfinityPaymentProcessor.sol`** - Main payment processing contract
  - Handles TON token payments
  - Manages staking and diamond tiers
  - Implements badge system
  - Processes super admin payouts

### Test Contracts

- **`MockTON.sol`** - Mock TON token for testing
- **`InfinityPaymentProcessor.test.js`** - Comprehensive test suite

### Deployment Scripts

- **`deploy-testnet.js`** - Testnet deployment script
- **`deploy-mainnet.js`** - Mainnet deployment script

## 🔧 Contract Features

### Payment Processing
- ✅ Secure TON token transfers
- ✅ Platform fee collection (2.5% default)
- ✅ Payment tracking and logging
- ✅ Reentrancy protection

### Staking System
- ✅ Flexible staking amounts
- ✅ Automatic diamond tier upgrades
- ✅ Staking rewards calculation
- ✅ Unstaking with proper validation

### Badge System
- ✅ Achievement-based badges
- ✅ Progressive unlock criteria
- ✅ Badge ownership tracking
- ✅ Event emission for unlocks

### Diamond Tiers
- ✅ Bronze (100 TON stake) - 1x multiplier, 5% cashback
- ✅ Silver (500 TON stake) - 1.2x multiplier, 10% cashback
- ✅ Gold (1000 TON stake) - 1.5x multiplier, 20% cashback
- ✅ Platinum (5000 TON stake) - 2x multiplier, 30% cashback

### Admin Functions
- ✅ Platform fee management
- ✅ Super admin address updates
- ✅ Emergency withdrawal
- ✅ Contract ownership transfer

## 📊 Gas Optimization

The contracts are optimized for gas efficiency:
- ✅ Packed structs for storage optimization
- ✅ Minimal external calls
- ✅ Efficient loop structures
- ✅ Optimized event emissions

## 🔒 Security Features

- ✅ ReentrancyGuard protection
- ✅ Ownable access control
- ✅ Input validation
- ✅ Overflow protection
- ✅ Emergency functions

## 🧪 Testing

The test suite covers:
- ✅ Contract deployment
- ✅ Payment processing
- ✅ Staking operations
- ✅ Diamond tier upgrades
- ✅ Badge unlocks
- ✅ Admin functions
- ✅ Error conditions

## 📈 Performance Metrics

Expected gas costs:
- Payment processing: ~50,000 gas
- Staking: ~30,000 gas
- Unstaking: ~35,000 gas
- Badge unlock: ~20,000 gas
- Tier upgrade: ~15,000 gas

## 🚨 Important Notes

1. **TON Token Address**: Replace the placeholder TON token address with the actual TON token contract address
2. **Super Admin**: Set the super admin address to a secure multi-sig wallet
3. **Private Key**: Never commit private keys to version control
4. **Testing**: Always test on testnet before mainnet deployment
5. **Audits**: Consider professional security audits for mainnet deployment

## 🔄 Upgrade Path

The contracts are designed to be upgradeable:
- Use proxy patterns for future upgrades
- Maintain backward compatibility
- Plan migration strategies carefully
- Test upgrade procedures thoroughly

## 📞 Support

For technical support:
- Review the test suite for usage examples
- Check the deployment scripts for integration patterns
- Refer to the People Power Journey documentation
- Contact the development team for complex issues

## 📜 License

MIT License - See LICENSE file for details
